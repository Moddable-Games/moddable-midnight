# The wallet daemon and the browser wallet

Midnight has no browser wallet for Firefox (findings 35, 36). The wallet CLI's DApp
connector (`midnight serve`) can stand in for one, but it serves a single wallet per
process, re-syncs for minutes on every start, and approves writes only on a terminal
(finding 41). Its `contract deploy` never completes on a wallet with shielded history,
because shielded sync progress is not saved between runs (finding 40).

So this repo runs its own wallet process.

## Pieces

- `wallet-daemon/wallet.mjs` builds a wallet exactly as the CLI does (same derivation,
  same `WalletFacade.init`), from the wallet SDK packages pinned in `package.json` at the
  versions the CLI proved on preview. Sync state for every channel is saved every minute,
  and a start resumes from whichever is newer, our state or the CLI's cache.
- `wallet-daemon/server.mjs` holds the organiser's wallet and the three agents' wallets in
  one process, on `127.0.0.1:9900`. It answers only the wallet UI's origin. Every payment,
  deployment and contract call is queued as a request and waits for a human to approve it.
- `wallet-daemon/deploy.mjs` deploys and calls contracts with the standard midnight-js
  providers, using the daemon's already-synced wallet as the wallet provider.
- `wallet-ui/` is the page (`http://localhost:5173`). Balances come live from the public
  indexer's `unshieldedTransactions(address)` subscription, so they show even with the
  daemon stopped; the daemon adds DUST, sending and approvals.

Run it:

```
node wallet-daemon/server.mjs                 # the daemon
python3 -m http.server 5173 -d wallet-ui      # the page
```

The proof server must be running on `localhost:6300` for anything that writes.

## What it has done on preview, 23 September 2026

Every entry was requested and approved through the daemon, then confirmed from the public
indexer rather than from the daemon's own report.

| What | Result | Block |
|---|---|---|
| Payment, Tzilo to Floyd, 1 NIGHT | tx `6d995f0b2e327d51…ada4ecf4`; Floyd 5,001 → 5,002, Tzilo 5,000 → 4,999 | 990,835 |
| Deploy `spikes/mint_spike.compact` | contract `9535b0226b9af9392087a0f29d201d40d8869dc0813d5043e7caf5fec5fbbe36` | 990,961 |
| `mintTreasury(1000000)`, fungible | contract holds 1,000,000 of token type `f3f4d88611d5af314fb32ef0e380fed5807aaac806362c05fc7f79bcf1b8b91d` | 990,970 |
| `mintMandate(Floyd)`, supply-1 NFT | Floyd's wallet holds 1 of token type `7dab3653f25ff22bc04439dcd9aeea313432886baba621fcfa1bd8e33512deb0` | 990,983 |

The spike was deployed from Tzilo's wallet because it was the one fully synced at the time;
the v2 contracts will be deployed by the organiser's wallet.

One earlier deploy attempt failed after submission (the private-state store rejected a
hex-only password). Whether that attempt reached the chain is unknown: its transaction id
was not recorded, which the daemon now does at submission.

## What is still missing

- No token names or images in any wallet: preview serves no token metadata (finding 39).
  The page labels our two tokens itself.
- Agents cannot yet ask the daemon for anything: requests come from the page. An
  authenticated agent route, with per-agent limits that approve small requests
  automatically, is the next piece.
- The spike's mint circuits have no access control. v2 gates them on the organiser.
