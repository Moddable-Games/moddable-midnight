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
| 11 | Agent registers tNIGHT for DUST generation | pending | |
| 12 | Agent deploys the contract to `preview` | pending | |
| 13 | Contract visible in a public explorer | pending | |

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

Pending deployment:

- Midnight Explorer (preview): https://preview.midnightexplorer.com/
- Subscan (preview): https://midnight-preview.subscan.io/
- 1am: https://explorer.1am.xyz/?network=preview

## Where it stands

- **Clock stopped at +63m** (17 Sep ~13:06). Waiting time between sessions is
  not counted.
- **Wallet funded:** 5,000 tNIGHT on `preview`, agent wallet `moddable-preview`.
- **Next, in order:**
  1. Build `src/witnesses.js` so the wallet CLI can load the witnesses.
  2. Let the private state factory accept a single secret key and generate the
     pass nonce itself (see friction log, finding 18).
  3. Register tNIGHT for DUST generation.
  4. Deploy to `preview` and record the contract address and explorer link.
- **On restart:** note the resume time here and continue the elapsed count
  from +63m.

## Notes on the measure

- **Paused 17 Sep ~13:06** at the end of a working session (usage limit reached),
  with the faucet drip still queued. Time between sessions is excluded from the
  elapsed total; the restart time is recorded when work resumes.

- The clock starts at the repository, not at the idea, because everything before
  that is thinking rather than building.
- Time spent on findings for the friction log is included. It is part of the
  work, and excluding it would flatter the number.
- The proof server runs locally on port 6300 whichever network is targeted,
  because it handles private data. That is one Docker container, not the full
  local devnet.
