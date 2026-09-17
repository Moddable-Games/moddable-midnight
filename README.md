# moddable-midnight

A proof of concept on [Midnight](https://midnight.network), the data-protection
blockchain, exploring what selective disclosure offers a games platform, and a
timed, documented record of what it takes a newcomer to ship on it.

Moddable runs a rules-driven game engine, a public API and a tools layer. Some
game mechanics need a player to prove something without revealing everything:
that they are entitled to enter, that a result is genuine, that a prize is owed.
That is the shape Midnight is built for, so this repository tests it directly.

## At a glance

| | |
|---|---|
| **Contract** | [`tournament_pass.compact`](contracts/tournament_pass.compact): private entry passes plus a prize pool, claimed by proof |
| **Tests** | 14 assertions, including an adversarial stolen-path case ([`src/`](src/README.md)) |
| **Toolchain** | Compact compiler 0.34.0, language 0.26, runtime 0.19.0, proof server 8.1.0 |
| **Clock** | +63 minutes from empty repository to a funded-wallet wait ([timeline](notes/TIMELINE.md)) |
| **Findings** | 19 logged, with suggested fixes ([friction log](notes/FRICTION-LOG.md)) |
| **Status** | Compiled and tested locally; deployment to the `preview` testnet in progress |

## The notes

The code is the smaller half of this repository. The notes are the point.

| Document | What it holds |
|---|---|
| [**Friction log**](notes/FRICTION-LOG.md) | Every obstacle, surprise and pleasant surprise met on the way, each with evidence and a suggested fix |
| [**Timeline**](notes/TIMELINE.md) | Milestones from repository creation to a contract in a public explorer, timed from git history and command output |
| [**Kapa queries**](notes/KAPA-QUERIES.md) | Every question put to Midnight's knowledge base server, what came back, and what it changed |

### Worth reading first

- [A security gap in the documented Merkle membership pattern](notes/FRICTION-LOG.md#9-skill-guidance-for-merkle-membership-has-a-security-gap),
  and the one-line fix this contract uses
- [Exported circuit parameters are witness-tainted](notes/FRICTION-LOG.md#8-exported-circuit-parameters-are-witness-tainted-and-no-skill-says-so),
  which no guidance mentions
- [The knowledge base server needs an undocumented sign-in](notes/FRICTION-LOG.md#1-the-kapa-mcp-server-needs-a-sign-in-the-docs-do-not-mention),
  and [how much better it is once connected](notes/FRICTION-LOG.md#15-kapa-is-much-better-than-grepping-the-docs-index-positive)
- [Deploying a contract with witnesses relies on an unwritten convention](notes/FRICTION-LOG.md#18-the-wallet-cli-deploys-witness-contracts-only-if-you-match-an-unwritten-convention)

### Open questions

Ideas beyond the proof of concept, researched against the docs and source:

- [Passwordless onboarding with passkeys and WebAuthn](notes/FRICTION-LOG.md#passwordless-onboarding-passkeys-and-webauthn)
- [Machine-payable endpoints and faucets agents can use](notes/FRICTION-LOG.md#machine-payable-endpoints-and-faucets-for-agents)
- [An agent-shaped wallet, and where its limits are enforced](notes/FRICTION-LOG.md#an-agent-shaped-wallet)

## The proof of concept

A tournament pass and a prize pool:

- **Entry pass (non-fungible):** issued per tournament, held privately
- **Prize pool (fungible):** funded once, paid against a proven pass
- **The claim:** a player proves they hold a valid pass for a given tournament
  and claims a prize, without disclosing which pass or who they are

### How the claim stays private

1. A player commits to a pass off-chain: a hash of their secret key and a fresh
   nonce, with domain separation. Only the commitment goes on-chain, into a
   historic Merkle tree.
2. To claim, the player proves in zero knowledge that their commitment is in the
   tree. The circuit rebinds the supplied path to the commitment it derives, so
   a path copied from someone else's pass cannot be replayed.
3. The claim publishes a nullifier derived from the tournament, secret key and
   nonce. Spending it twice fails, and it reveals nothing about which pass it
   came from.

**In scope:** issuing passes, funding a pool, one private claim path, tests.

**Out of scope:** transfers, secondary markets, multi-round tournaments, a front
end. This is an experiment, not a product.

**A caveat on the pool:** the prize pool is a `Uint<64>` ledger counter that
tracks entitlement. It does not move value. Real payouts would use Midnight's
shielded token operations, which are a natural next step rather than part of
this test.

## Quick start

```bash
npm install
npm run compile     # Compact to circuits, keys and TypeScript bindings
npm run typecheck
npm test            # in-memory simulator, no network needed
```

Requires macOS or Linux (Windows via WSL), Node.js 20 or newer, and the
[Compact toolchain](https://docs.midnight.network). The Midnight Expert plugin
suite from [midnightntwrk.expert](https://midnightntwrk.expert) was used
throughout the build.

## Layout

| Path | Contents |
|---|---|
| [`contracts/`](contracts/README.md) | Compact source |
| [`src/`](src/README.md) | Witnesses, simulator harness and tests |
| [`notes/`](notes/) | Friction log, timeline and knowledge base queries |

## References

The contract uses only the Compact standard library. These libraries were
reviewed as reference points and are the route to real token behaviour:

- [OpenZeppelin Compact contracts](https://github.com/OpenZeppelin/compact-contracts)
  (MIT): token, access, security, multisig, crypto and utils modules
- [Midnight example NFT contracts](https://github.com/midnightntwrk/example-nft-contracts)

## Licence

[MIT](LICENSE)
