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
| 7 | Proof server running locally | pending | |
| 8 | Wallet funded from the preview faucet, tNIGHT registered for tDUST | pending | |
| 9 | Deployed to `preview` | pending | |
| 10 | Contract visible in a public explorer | pending | |

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

## Notes on the measure

- The clock starts at the repository, not at the idea, because everything before
  that is thinking rather than building.
- Time spent on findings for the friction log is included. It is part of the
  work, and excluding it would flatter the number.
- The proof server runs locally on port 6300 whichever network is targeted,
  because it handles private data. That is one Docker container, not the full
  local devnet.
