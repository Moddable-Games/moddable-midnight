# Security audit: token contracts and crew treasury v3

Five contracts and two shared modules, audited on 27 September 2026 before first deploy,
with the same Midnight AI tooling as the v2 audit (`notes/AUDIT-crew-treasury.md`):

1. `compact-core:audit-compact`, which dispatches the `compact-core:security-reviewer` agent
   for one adversarial pass and returns Verification Requests for anything Critical or High
2. the High finding confirmed by running the attack against the compiled contract
   (`spikes/poc-h1.ts`), then run again on the fix
3. a second reviewer pass over the fixes only

Every finding was fixed before deploy.

**Files reviewed:** `contracts/native_unshielded.compact`, `contracts/native_shielded.compact`,
`contracts/contract_token.compact`, `contracts/private_ledger.compact`,
`contracts/crew_treasury_v3.compact`, `contracts/lib/Events.compact`,
`contracts/lib/TokenMetadata.compact`, `src/token-witnesses.ts`, `src/note-book.ts`, with
`src/tokens.test.ts` and `src/crew-v3.test.ts` as context.

## Summary

| Severity | First pass | Confirmed | Second pass (fixes) | Fixed |
|---|---|---|---|---|
| Critical | 0 | | 0 | |
| High | 1 | 1 (by running it) | 0 | yes |
| Medium | 4 | | 0 | 4 |
| Low | 5 | | 3 new | 8 |
| Suggestions | 4 | | | 3 applied, 1 left as a consumer rule |

## High

**H-1: a private transfer's notes could be opened from public data.** In `private_ledger`,
the nonces of the change note and the recipient's note were `hash(tag, nullifier)`, and the
nullifier is public. A commitment hides its contents only while its nonce is secret, so an
observer could try known owner keys and amounts and match the published commitments. The
attack script recovered "bob holds 37; alice holds 963" from the ledger alone.

Fixed: every output nonce now mixes in the spender's secret (`outputNonce(tag, sk,
spentNonce)`, and `tagged(tag, seed)` for the payment and coin), and the nullifier is bound to
the note (`hash(tag, sk, commitment)`). The same script now recovers nothing, and
`src/tokens.test.ts` keeps it as a regression test.

## Medium

**M-1: re-issuing a mandate gave fresh draw slots in the same period** (`crew_treasury_v3`).
The draw nullifier included the epoch, so `revokeAll` plus re-issue reset every agent's
slots. Issuing new terms without `revokeAll` also left the old leaf valid. Fixed: the
nullifier no longer includes the epoch, and `appointed` allows one mandate per agent per
epoch. Regression test: a re-issued mandate draws slot 0 again and is refused.

**M-2: the header overstated draw privacy.** Payee and amount are public, so draws to one
address are linked. Fixed in the header: unlinkable only when each draw pays a fresh address.

**M-3: nonce reuse could destroy notes** (`private_ledger`). Mint and deposit nonces came
from a witness with nothing on chain to stop repeats, and the nullifier did not cover the
note, so two notes with one nonce shared a nullifier. Fixed: nullifiers bind the commitment,
and `usedNonces` records a hash of every random nonce and refuses repeats.

**M-4: a full note tree would freeze every note.** Depth 16 held 65,536 notes, and every
spend inserts new ones. Fixed: depth 20 (about a million).

## Low

- **L-1** `private_ledger.publishMetadata` accepted reserved kinds 4 to 255. Fixed: 0, 1, 3 only.
- **L-2** Metadata could describe domains a contract never issued. Fixed in all five.
- **L-3** Derived shielded-coin nonces were public, so recipients could be found by trying
  known keys (`contract_token.shield`, the v3 NFT). Fixed: the minter's secret is inside.
- **L-4** Mandate leaves had no salt, so terms could be guessed from the leaf. Fixed: `salt`.
- **L-5** Some circuits accepted the zero recipient. Fixed where missing.

Second pass, over the fixes:

- **L-A** `contract_token.shield` returned the whole coin, secret nonce included. Fixed:
  returns the color.
- **L-B** A duplicate commitment (same nonce, amount and owner) could be minted by the issuer
  or a depositor, doubling what supply counted. Fixed: `commitments` refuses any repeat.
- **L-C** `native_shielded`'s derived nonce came from a public seed. Fixed: the issuer's
  secret replaces the seed.

## Suggestions

- The blocked-payee list stops direct payments only; the header now says funds can still be
  forwarded.
- `contract_token.minter` is now sealed (there is no setter).
- MIP-0018 value bytes beyond `valLen` are not checked in-circuit. MIP-0018 section 2.2 already
  requires consumers to ignore them; the token reader does.
- Whether two calls in one transaction could claim the same Zswap output was left unverified by
  the reviewer; the ledger's claim rules are expected to prevent it.

## Deliberate deviations from the MIPs

Each contract's header lists them. The one worth calling out: MIP-0004 builds on OpenZeppelin
`FungibleToken`, whose caller identity is `ownPublicKey()`. With the conversion circuits that
would let anyone move another account's balance to their own address, so accounts here are
hash-based, the pattern MIP-0004 already requires for its admin and minter.
