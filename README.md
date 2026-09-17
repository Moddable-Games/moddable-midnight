# moddable-midnight

A proof of concept on [Midnight](https://midnight.network), the data-protection
blockchain, exploring what selective disclosure offers a games platform.

Moddable runs a rules-driven game engine, a public API and a tools layer. Some
game mechanics need a player to prove something without revealing everything:
that they are entitled to enter, that a result is genuine, that a prize is owed.
That is the shape Midnight is built for, so this repository tests it directly.

## The proof of concept

A tournament pass and a prize pool:

- **Entry pass (non-fungible)** — issued per tournament, held privately
- **Prize pool (fungible)** — funded once, paid against a proven pass
- **The claim** — a player proves they hold a valid pass for a given tournament
  and claims a prize, without disclosing which pass or who they are

Two token types exercise both halves of the model, and the claim path is the
smallest thing that demonstrates selective disclosure rather than describing it.

**In scope:** minting passes, funding a pool, one private claim path, tests.

**Out of scope:** transfers, secondary markets, multi-round tournaments, a front
end. This is an experiment, not a product.

## Why it is written down

The second purpose is to record how well the ecosystem's developer tooling
handles a new language. Compact is not in any model's training data, so
assistants have to be given the context to get it right. Where that works,
where it guesses, and what the compiler catches is tracked in
[`notes/FRICTION-LOG.md`](notes/FRICTION-LOG.md), alongside suggested fixes.

## Prerequisites

- macOS or Linux (the tooling assumes POSIX; Windows needs WSL)
- Node.js 20 or newer
- The Compact toolchain
- The Midnight Expert plugin suite, from
  [midnightntwrk.expert](https://midnightntwrk.expert)

## Building blocks

- [OpenZeppelin Compact contracts](https://github.com/OpenZeppelin/compact-contracts)
  (MIT): token, access, security, multisig, crypto and utils modules, including
  fungible, non-fungible and confidential fungible tokens
- [Midnight example NFT contracts](https://github.com/midnightntwrk/example-nft-contracts)

Composing the ecosystem's own libraries is deliberate. Hand-rolling a token
would prove less about whether the platform is ready to build on.

## Layout

```
contracts/   Compact sources
src/         TypeScript witnesses, tests and CLI
notes/       Friction log and findings
```

## Licence

MIT
