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
  providers, using the daemon's already-synced wallet as the wallet provider. Each wallet
  keeps its own private state per contract (secrets in `state/crew-secrets.json`). A call
  that sends shielded coins to another wallet passes that wallet's encryption key.
- `wallet-daemon/agents.mjs` and `agent-policy.json` are the agents' own route, with
  limits (below).
- `wallet-daemon/metadata.mjs` serves token names and images only after checking them
  against digests stored in the contract.
- `wallet-daemon/request.mjs` (operator) and `agent-request.mjs` (agents) are
  command-line clients.
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

The spike was deployed from Tzilo's wallet because it was the one fully synced at the time.

### v2: the crew treasury

`contracts/crew_treasury.compact`, audited before deploy (`notes/AUDIT-crew-treasury.md`),
deployed and run by the organiser's wallet. The fungible token is Midnight City Credits
(MCC); each agent's shielded NFT is its Agent Smart Contract.

| What | Result | Block |
|---|---|---|
| Deploy | contract `e412fa7fa89433c2d37bbf350eba95e61db6075d5189f0dc5f45c07583cac4b4` | 992,293 |
| `mintTreasury(1000000)` | contract holds 1,000,000 MCC, token type `eed99c9a…a366` | 992,298 |
| `issueMandate` for Floyd, Tzilo, FooFoo | each agent's own wallet shows 1 of its NFT (`7ced7bf3…`, `9d454f80…`, `66deba03…`) | 992,303 / 318 / 322 |
| `openPeriod("2026-09-23")` | | 992,327 |
| Floyd draws | 50 MCC to Floyd's address, per the indexer | 992,331 |
| Floyd draws again | refused before submission: "Already drawn this period" | none |
| `setMetadata` | digests of the MCC document and the Agent Smart Contract collection | 992,402 |
| Tzilo draws, through the agent route, approved automatically | 50 MCC | 992,483 |
| Overdraw test: amount 2,000,000 against 999,900 | partial success, fee paid, no MCC moved, nullifier not spent | 992,518 |
| FooFoo draws after the failed overdraw | succeeds in the same period | 992,552 |

The NFTs are minted in the organiser's transaction but sent to the agents. Without the
agents' encryption keys the coins would exist and never be visible to them (Kapa query
11). The daemon passes those keys, and each agent's wallet reports its NFT.

## Sending tokens, and shielded sends

Each wallet's Send form lists what that wallet holds: NIGHT, public tokens such as MCC,
and shielded tokens such as its Agent Smart Contract. The recipient's address decides the
kind of transfer, using the wallet SDK's `transferTransaction`:

- an `mn_addr_…` address gets an unshielded transfer (NIGHT, MCC)
- an `mn_shield-addr_…` address gets a shielded transfer (Agent Smart Contracts). The
  address carries the recipient's encryption key, so they can see the coin.
- NIGHT exists only unshielded, and a request to send it to a shielded address is refused

Tested on preview:

| What | Block |
|---|---|
| 10 MCC, Floyd to Tzilo (40 change back to Floyd, per the indexer) | 993,649 |
| Floyd's Agent Smart Contract to the organiser's shielded address | 993,656 |
| The same NFT back to Floyd | 993,666 |

Shielded sends needed a fix first. Since 28 August, no shielded address can be parsed
with a fresh install of Midnight's address library, the official wallet CLI's included
(friction finding 44).

About the city's ShieldedToken Broker: it advertises "One atomic Midnight Preview ZSwap
exchanges 0.01 NIGHT for 1 ShieldedToken". A swap is not a send. Both sides' inputs and
outputs settle in one transaction, which the wallet SDK builds with `initSwap`, and the
broker has to supply its half. Sending a token to the broker's shielded address would be
a gift, and NIGHT cannot be sent to a shielded address at all. Testing the broker needs
the city to accept a swap from an outside wallet, which is where finding 25 (no way to
register an agent wallet) stops us.

## Contract panel and public verification

The page's contract panel (`GET /api/contract`) shows the crew treasury's public state:
- MCC minted, held and paid out, and whether they add up
- mandates issued, the draw amount and the open period
- the two metadata digests, and whether our files match them

For anyone who does not trust this machine, the crew treasury check is published on GitHub
Pages. It does the same checks entirely in the visitor's browser:
- reads the contract from the public indexer
- decodes it with the compiled contract
- re-derives MCC's and every Agent Smart Contract's token type
- fetches the metadata from GitHub and checks each file against the on-chain digests
  and CIDs

## Agents' route and limits

`POST /api/agent/requests`, with a per-agent bearer token (made on first start, kept in
`state/agent-tokens.json`). The token binds the agent to its own wallet. Any request from
a browser origin is refused. `agent-policy.json` decides:

- **transfer** to another crew wallet, within `autoApproveNight` each and `dailyAutoNight`
  a day: runs at once
- **transfer** that is larger, or to an address outside the crew: waits in the page's
  Approvals panel, with the reason shown
- **draw** from the treasury: runs at once, since the contract allows one per period

Tested on preview with Tzilo:

- 0.5, 0.2 and 0.3 NIGHT to FooFoo ran automatically.
- 3 NIGHT waited, over the 1 NIGHT limit.
- 0.1 NIGHT to an outside address waited.
- A draw ran automatically, and a second draw was refused by the contract.

Transactions from one wallet run one at a time. Two approved back to back first failed
with "Insufficient funds": the first had spent the wallet's coins and its change was not
back yet. Each wallet now has a queue, and the next transaction starts once the last one
is confirmed.

## Token metadata

`metadata/` holds the artwork, one document per token following Midnight's token metadata
spec, and a collection manifest for the Agent Smart Contracts. `scripts/build-metadata.mjs`
rebuilds them from chain state. It re-derives each token type from the contract address
and domain separator, which must match what the chain and the agents' wallets report.
Images and documents are addressed by IPFS CID (`metadata/anchors.json`). The contract
stores the SHA-256 of the MCC document and of the manifest, and the manifest lists each
NFT document's CID. So one on-chain read verifies everything the page shows. A tampered
document shows as a mismatch; this was tested.

All seven files (two images, four token documents, the collection manifest) are pinned on
the public IPFS network through Pinata (`scripts/pin-metadata.mjs`, record in
`metadata/pins.json`), under exactly the CIDs above. Each was uploaded with Pinata's `v1`
import profile (raw leaves, 256 KiB chunks), which stores a file smaller than one chunk as
the single raw block our CID names; the script refuses any other CID. Pinata's gateway and
an independent public gateway (trustless-gateway.link) served the bytes back, and they
re-hash to the CIDs. Anyone can fetch them from any gateway, for example
`https://ipfs.io/ipfs/<cid>`, and check them the same way. (Pinata allows uploading a
ready-made CAR file, which would pin a chosen CID directly, only on paid plans.)

One earlier deploy attempt failed after submission (the private-state store rejected a
hex-only password). Whether that attempt reached the chain is unknown: its transaction id
was not recorded, which the daemon now does at submission.

## What is still missing

- No other wallet shows our token names or images: preview serves no token metadata
  (finding 39). Our page shows them, verified against the contract.
- The crew Worker runs in Cloudflare and cannot reach this machine. For the city agents to
  request spends themselves, the daemon should pull their requests from the Worker (with a
  shared secret) and pass them through the same policy.
- Revoking a single mandate (audit M-1); only a pause of all draws exists.
