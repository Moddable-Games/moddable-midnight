# Concept to public chain: the clock

How long it takes one engineer, new to Compact, to go from an idea to a
contract deployed on a public Midnight network, using the ecosystem's own AI
tooling. Times are BST, taken from git history and command output rather than
memory. Anything estimated says so.

## Milestones

| # | Milestone | Timestamp | Elapsed |
|---|-----------|-----------|---------|
| 0 | Concept agreed: NFT entry pass plus fungible prize pool, claimed by proof | 16 Sep, evening (approx) | — |
| 1 | Repository created, README and scope written | 17 Sep 12:03 | T0 |
| 2 | Compact toolchain installed (CLI 0.5.2, compiler 0.34.0) | 17 Sep 12:10 | +7m |
| 3 | Midnight Expert plugins installed (16 plugins) | 17 Sep 12:15 (approx) | +12m |
| 4 | Environment verified, two doctors run, blockers fixed | 17 Sep 12:35 | +32m |
| 5 | First contract compiles (2 attempts, full ZK pipeline) | 17 Sep 12:36 | +33m |
| 6 | Tests pass: 14 assertions, including an adversarial witness case | 17 Sep 12:36 | +33m |
| 7 | Proof server running locally (`proof-server:8.1.0`, health ok) | 17 Sep 12:51 | +48m |
| 8 | Kapa MCP connected; four research queries run (see `KAPA-QUERIES.md`) | 17 Sep 12:45 | +42m |
| 9 | Agent wallet created with `midnight-wallet-cli` 0.5.2, preview address derived | 17 Sep 12:54 | +51m |
| 10 | **Human step:** tNIGHT requested at the preview faucet (captcha); drip queued as `PENDING` / `scheduled` | 17 Sep 12:55 | +52m |
| 10a | First faucet request hangs; the web page crashes after about 30 minutes | 17 Sep ~13:20 | during the pause |
| 10b | Second faucet request succeeds in under a minute: 5,000 tNIGHT ([tx](https://preview.midnightexplorer.com/transactions/0x98b947897e9b174eee8be1ae55c1915b5424a7045a5b129f27621e9e0f3d7634)) | 17 Sep 13:21 | during the pause |
| — | **Clock resumed** after the pause; wallet now holds 10,000 tNIGHT (the first faucet request also landed) | 17 Sep 17:21 | +63m |
| 10c | Deploy fixes: compiled witnesses module, single-argument private state factory | 17 Sep 17:22 | +64m |
| 11 | Agent registers 2 UTXOs for DUST generation; CLI reports a timeout, but status shows 619 DUST available | 17 Sep 17:27 | +69m |
| 11a | First deploy fails: the stable SDK cannot run 0.34.0 output; project moved to the supported toolchain (compiler 0.31.1, runtime 0.16.0, Midnight.js 4.1.1), tests re-run green | 17 Sep 17:34 | +76m |
| 12 | **Agent deploys the contract to `preview`** in 25 seconds, block 907,507 | 17 Sep 17:35 | **+77m** |
| 13 | Deploy confirmed through the public indexer; explorer links below | 17 Sep 17:37 | +79m |
| 14 | First calls fail on a duplicated ledger package; fixed with npm overrides; pool funded on-chain | 17 Sep 17:39 | +81m |
| 15 | Pass issued, but the claim fails: the CLI replaces private state on every call, so the nonce changed; nonce now derived from the secret key | 17 Sep 17:40 | +82m |
| 16 | Pass reissued and **a private claim succeeds on-chain**: pool 500 to 400, one nullifier spent | 17 Sep 17:41 | **+84m** |
| 17 | Front end scaffolded with the `midnight-dapp-dev:init` skill | 17 Sep 17:48 | +90m |
| 18 | Scaffold fixed to typecheck, test and build (findings 30 to 33) | 17 Sep 17:52 | +94m |
| 19 | **Read-only front end decodes live contract state in the browser**, in Moddable styling | 17 Sep 17:56 | **+98m** |
| 20 | Integration guide written from captured responses | 17 Sep 17:59 | +101m |
| 21 | Caveats researched (Kapa, four queries) and checked against raw chain data; documented with sources | 17 Sep 18:05 | +106m |
| 22 | Front end published on GitHub Pages with links to the write-up (after the clock stopped; not counted) | 17 Sep 18:24 | — |

**The only human step is the faucet captcha.** Everything else, from wallet
creation to deployment, is driven by the agent through the community wallet
CLI, which also ships an MCP server so the same flow can run without a terminal.

## Target

`preview`, the public test network, because it needs no real funds and has a
faucet and block explorers. Mainnet has no faucet, so a mainnet deploy would
mean buying NIGHT; that is a separate decision, not a measure of how quickly a
newcomer can ship.

## What counts as done

A contract address on `preview` that resolves in a public explorer, plus the
transaction that deployed it. Links recorded below when we have them.

## Explorer links

- **Contract address:** `2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191`
- **Deploy transaction:** `cae26415ed0ab92ee22f8c0feb4ef61ef0d0283161bddd875b70fc2c1aa812ca` (block 907,507, 17:35:24 BST)
- Contract on Midnight Explorer: https://preview.midnightexplorer.com/contracts/2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191
- Deploy transaction on Midnight Explorer: https://preview.midnightexplorer.com/transactions/0xcae26415ed0ab92ee22f8c0feb4ef61ef0d0283161bddd875b70fc2c1aa812ca
- Contract on Subscan: https://midnight-preview.subscan.io/contract/2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191
- Contract on 1am: https://explorer.1am.xyz/contract/2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191?network=preview

### Every transaction

| Action | Transaction | Block | Time (BST) |
|---|---|---|---|
| Deploy | [`cae26415ed0a…`](https://preview.midnightexplorer.com/transactions/0xcae26415ed0ab92ee22f8c0feb4ef61ef0d0283161bddd875b70fc2c1aa812ca) | 907,507 | 17:35:24 |
| fundPool | [`42c0d6732288…`](https://preview.midnightexplorer.com/transactions/0x42c0d67322885a26ef0b3737400cccc2de365a1835f8113124bc2212c408fa1a) | 907,545 | 17:39:12 |
| issuePass (orphaned) | [`3f8414661bd0…`](https://preview.midnightexplorer.com/transactions/0x3f8414661bd018856dd405c1ac8d25242ad05ea2d467453585bea23e48e1f1b2) | 907,551 | 17:39:48 |
| issuePass | [`5e31df51cb8c…`](https://preview.midnightexplorer.com/transactions/0x5e31df51cb8c88eeb319b863d0dc85fdd5aecd97a53ae2ccc0b9b6edf3f47d65) | 907,565 | 17:41:12 |
| claimPrize | [`c2d1cfd9553d…`](https://preview.midnightexplorer.com/transactions/0xc2d1cfd9553df5294c431c563706154a0e2d52a16b1b3e5ec64f54e0c6e7aeed) | 907,570 | 17:41:42 |

The orphaned pass was issued against a nonce the CLI then discarded (finding 26).
It stays in the tree, unclaimable, which is itself a small demonstration: the
ledger holds a commitment nobody can link to a player.

**Final public state:** 2 passes, 1 claim, pool 400 of 500, prize 100 per claim,
1 spent nullifier.

The explorers are single-page apps, so their URLs return 200 whatever the
address; the deploy itself was verified against the preview indexer's GraphQL
API, which returned the `ContractDeploy` action and block above.

## Where it stands

- **+77 minutes** of working time from an empty repository to a contract on a
  public Midnight network; **+84 minutes** to the full lifecycle (fund, issue,
  private claim) on-chain. The break between sessions is excluded.
- **+98 minutes** to a read-only front end showing that state live.
- **Clock paused at +106m** (17 Sep 18:05) while next steps are chosen. The
  caveat research was requested during review, so it is counted.
- **Next:** browser writes, through Lace and through the wallet CLI's local
  connector.

## Notes on the measure

- **Paused 17 Sep ~13:06** at the end of a working session (usage limit reached),
  with the faucet drip still queued, and resumed at 17:21. Time between
  sessions is excluded from the elapsed total.
- **Paused 17 Sep 18:05** at +106m, after the caveat research.

- The clock starts at the repository, not at the idea, because everything before
  that is thinking rather than building.
- Time spent on findings for the friction log is included. It is part of the
  work, and excluding it would flatter the number.
- The proof server runs locally on port 6300 whichever network is targeted,
  because it handles private data. That is one Docker container, not the full
  local devnet.

## Resumed 23 September 2026, 08:55 (clock restarts at +106m)

Second-round interview confirmed, so the work continues. Direction set with Mark
on 23 Sep: a browser wallet for Firefox (none exists, findings 35 and 36), a v2
contract with shielded NFT mandates and a real unshielded token treasury, and the
tie-in to Midnight City: the city's ShieldedToken Broker spends NIGHT an agent can
never earn in-game (city finding 7), so the treasury is what funds it.

| # | Step | When | Elapsed |
|---|---|---|---|
| 38 | Clock resumed; direction set (Firefox wallet, v2 tokens, Midnight City tie-in) | 23 Sep 08:55 | +106m |
| 39 | Spike: `midnight serve` connector proven from a plain WebSocket client (reads, addresses, balances, DUST) | 23 Sep 09:05 | +116m |
| 40 | Spike: minting, a supply-1 NFT and a payout compile on the pinned 0.31.1 | 23 Sep 09:10 | +121m |
| 41 | Spike: preview indexer serves no token metadata (finding 39) | 23 Sep 09:15 | +126m |
| 42 | Six failed `contract deploy` attempts, diagnosed to sync 100% then timeout (finding 40) | 23 Sep 09:20 to 09:50 | +131m |
| 43 | Dead proof server found and restarted; transfers work again | 23 Sep 09:25 | +136m |
| 44 | Three agent wallets created, funded (5,000 tNIGHT each) and DUST-registered | 23 Sep 09:30 to 09:50 | +141m |
| 45 | `src/connector.ts` written: one JSON-RPC client for the browser wallet and the tooling | 23 Sep 09:45 | +156m |
| — | **Running total at 09:54** | | **+165m** |

Phase 0 is the cost of re-entry after six days away: a dead container, a broken
deploy path, and an ecosystem gap (no agent wallets in the city, blocked upstream
on Passport #113). None of it was contract work, and all of it is logged.

## Clock paused 23 September 10:26 UTC (at +197m)

08:55 to 10:26 UTC is 91 minutes. Splitting it honestly, because the headline number is
only worth something if it says what it measures:

| What | Minutes | Counted? |
|---|---|---|
| Midnight tooling and ecosystem: spikes, six failed deploys, dead proof server, agent wallets, faucet, DUST, Passport research, findings 38 to 41 | ~55 | yes |
| Building the browser wallet (UI, connector client, indexer balance subscription) | ~24 | yes |
| Fixing my own defects in that wallet (malformed `signData`, stale sockets marking live connections dead, a readiness probe that tested the handshake rather than the data) | ~12 | yes, but it is not Midnight's fault |

The third row is mine, not the ecosystem's, and the total would flatter this project if it
were quietly dropped. It stays in, labelled. The first row is the honest measure of what it
costs to pick this work up after six days away: a container that had exited, a deploy path
that fails at 100% sync, and a wallet gap blocked upstream since July.

All times in this file are UTC. An earlier version of this entry said 155 minutes, from
comparing a UTC start against a local-time clock; corrected on the spot.

Running total: **+197m**. Contract v2 is not started; the spike contract compiles and has
never deployed.

## Resumed 23 September, 10:3x UTC, after the usage limit reset

| # | Step | When (UTC) |
|---|---|---|
| 46 | Wallet rebuilt in our own process from the CLI's packages; sync progress per channel shows the slow leg is shielded, not DUST (finding 40 corrected) | 10:40 |
| 47 | Wallet daemon: four wallets in one process, approvals in the browser, state saved and resumed | 10:55 |
| 48 | First payment through the daemon, confirmed on chain (block 990,835) | 11:34 |
| 49 | Deploy fails on two copies of `ledger-v8` (finding 42); moved the daemon onto the repo's pinned tree | 11:43 |
| 50 | **Contract deployed** through the daemon (block 990,961) | 11:46 |
| 51 | **Fungible token minted**, 1,000,000 held by the contract (block 990,970) | 11:47 |
| 52 | **NFT minted** to Floyd's wallet, supply 1 (block 990,983) | 11:49 |

