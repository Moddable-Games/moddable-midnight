# Security audit: crew treasury contract

`contracts/crew_treasury.compact` and `src/crew-witnesses.ts`, audited on 23 September 2026
before the contract's first deploy, using Midnight's own AI tooling:

1. `compact-core:audit-compact`, which dispatches the `compact-core:security-reviewer`
   agent for one adversarial pass and returns Verification Requests for anything Critical
   or High
2. the request confirmed here by running an attack against the compiled contract
3. `midnight-verify:verify` on the fixed contract and witnesses (the `witness-verifier`
   agent: type check, structural checklist, and execution)
4. one open question from step 3 settled on the preview network

Every finding below was fixed before deployment unless marked otherwise. The deployed
contract is `e412fa7fa89433c2d37bbf350eba95e61db6075d5189f0dc5f45c07583cac4b4` (preview,
block 992,293).

## Summary

| Severity | Count | Confirmed | Refuted | Inconclusive | Fixed |
|---|---|---|---|---|---|
| Critical | 1 | 1 | 0 | 0 | yes |
| High | 0 | | | | |
| Medium | 3 | | | | 2 of 3 in full; revocation in part |
| Low | 4 | | | | 4 |
| Suggestions | 3 | | | | 1 documented, 1 not needed, 1 tested on-chain |

The Medium count includes one found by the verification step rather than the review.

**Files reviewed:** `contracts/crew_treasury.compact`, `src/crew-witnesses.ts`, with
`src/crew.test.ts` as context.

## 1. Witness trust boundary and access control

**C-1 (Critical): any agent could drain the treasury by choosing a new period on every
call.** `draw(recipient, period)` took the period as an argument. The nullifier hashes the
period, so every new period value gave a nullifier never seen before, and "once per
period" held only if clients behaved. The test suite had even encoded it: "next period"
was just a different string.

- **Verification: Confirmed (tested).** `spikes/drain-poc.ts` against the compiled
  contract: `one mandate made 10 draws; drawCount=10, nullifiers=10, paid=500 MCC`.
- **Fix:** the period is now ledger state, `currentPeriod`, which only the organiser can
  change (`openPeriod`). `draw(recipient)` no longer takes a period. The reviewer offered
  an organiser-advanced counter or block-time windows; a date label set by the organiser
  keeps the period readable on-chain. The same script is now a regression test:
  `one mandate made 1 draw(s); stopped by: failed assert: Already drawn this period`.
- **Found on-chain the same way:** Floyd's second draw on preview was refused with that
  assert.

**M-3 (Medium, found by `midnight-verify`): an implicit period zero was open from
deployment.** After the C-1 fix, `currentPeriod` started as 32 zero bytes, so an agent
could draw once before the organiser opened any period. Total spend was still one draw
per mandate, so this was not a drain, but it contradicted "the organiser opens each
period". The review did not catch it; the verifier found it by executing the contract.

- **Fix:** `draw` asserts a period is open, and `openPeriod` refuses the zero value. Two
  tests cover it.

**M-1 (Medium): a mandate cannot be revoked.** Mandates live in a `HistoricMerkleTree`
checked with `checkRoot`, so a leaked agent secret would draw every period for good.

- **Fixed in part:** an organiser-only `paused` flag now stops all draws at once, and is
  tested.
- **Not fixed:** revoking one mandate. The suggested design (an epoch inside the leaf,
  plus `resetHistory()` and re-issuing) depends on `resetHistory` behaviour that has not
  been verified here. It is left as a known limitation rather than shipped untested.

**Positive:** the organiser is a domain-separated hash of a witness secret, fixed in the
constructor, not `ownPublicKey()`. The verifier confirmed that a stranger and an appointed
agent are both refused by every organiser circuit.

## 2. Cryptographic correctness

**L-2 (Low): the same agent secret gave the same public commitment in every crew.**

- **Fix:** `crewId` is now inside the commitment preimage.

**L-4 (Low): the NFT's coin nonce was a caller argument.**

- **Fix:** the nonce is derived in the circuit from the commitment.

**Positive:**

- `draw` rebinds the supplied Merkle path's leaf to the commitment it recomputes.
- The verifier ran three path forgeries (a stolen full path, own leaf with another
  member's siblings, and a member presenting another member's path). All three failed
  with "No such mandate".
- The nullifier has its own domain, includes the secret and `crewId`, and links neither
  to the commitment nor across periods.

## 3. Information leakage and disclosure

- **Recipients (documented):** `draw`'s recipient is public, so an agent paying the same
  address every period links its own draws. The contract's comment now advises fresh
  payout addresses.
- **Holder key (noted, accepted):** the verifier observed that `issueMandate` makes the
  holder's key public, linking a commitment to an agent's wallet. That is inherent in
  appointing a named agent. Draws still reveal only a nullifier and the payee.

## 4. Token and economic security

**M-2 (Medium): the NFT's "one of a kind" was not enforced.** The same commitment could
be issued twice.

- **Fix:** an `issued` set, and a re-issue fails with "Mandate already issued".
- **Documented:** the NFT (an "Agent Smart Contract") is a receipt of appointment, not a
  credential. Drawing needs the mandate's secret, not the token.

**L-1 (Low): a draw before any mint targeted the zero colour.**

- **Fix:** `draw` asserts the treasury is funded and the draw amount is non-zero.

**L-3 (Low): `setMetadata` accepted any token colour.**

- **Fix:** two fixed digest slots, `treasuryMetadata` and `mandateMetadata`, so the
  organiser cannot attach metadata to tokens this contract did not issue.

**Overdraw (reviewer suggestion, verifier open point): settled on preview.**

- The verifier noted the simulator lets draws exceed the contract's balance: 1,000
  minted, two draws of 600 both succeed locally. So only the real ledger could say what
  happens.
- On preview: the draw amount was set to 2,000,000 against a balance of 999,900, then
  FooFoo drew.
  - The transaction was included in block 992,518 as a partial success (`FailFallible` in
    midnight-js, `PARTIAL_SUCCESS` in the indexer) and paid its fee.
  - No MCC moved: the treasury still held 999,900.
  - The nullifier was not spent: after the amount was restored to 50, FooFoo drew
    successfully in the same period (block 992,552).
- So the ledger enforces the balance, and a failed payout rolls back the contract's state
  with it. No in-circuit balance check was added. See friction finding 43 for the cost
  of learning this only on-chain.

**Positive:** MCC is minted only by `mintTreasury`, only to the contract itself. Only
`draw` moves it out.

## Mechanical verification

- **Target:** `midnight-verify:verify contracts/crew_treasury.compact
  src/crew-witnesses.ts`. Verdict **Confirmed (witness-verified)**.
  - tsc passes against the generated `Witnesses<PS>`, and a malformed witness fails, as a
    negative control.
  - Names, tuple shapes, `WitnessContext` use and immutability all pass.
  - 36 of 36 behavioural checks pass in the verifier's own harness.
  - One gap was found, M-3, fixed above.
- **VR-1 (C-1):** Confirmed (tested). The drain ran; after the fix it stops at one draw.
- **Project tests:** `npx tsx src/crew.test.ts`, 32 assertions.
- **On-chain:** deploy, mint, three mandates, open period, a draw, a refused second draw,
  a refused overdraw and a draw after it. Each is confirmed from the public indexer, not
  the daemon (see `notes/WALLET-DAEMON.md`).

## What the tooling did well, and what it missed

- **The Critical:** the review found it in one pass, with a fix and a proof-of-concept
  sketch. It was a real bug that 21 passing tests had encoded as correct behaviour.
- **What the review missed:** the period-zero gap introduced by the fix. The verifier
  caught it by running the contract, not by reading it. The two steps together were
  better than either alone.
- **A limitation of the design:** the reviewer agent cannot run the verification itself.
  It hands requests back to the caller, so an audit is only as complete as the caller's
  follow-through.
- **Where only the chain could answer:** the overdraw. The simulator does not model
  contract balances, so the last word came from spending test tokens on preview.

## Verifying that the deployed contract is this source

A Midnight contract keeps one verifier key per circuit on-chain, and accepts only proofs made
against those keys. Compiling the published source produces the keys, so matching them proves
the deployed contract is the published source. midnight-js makes the same comparison
(`verifyContractState`) before it will call a deployed contract.

- **Reproduced (24 September):** a fresh compile of `contracts/crew_treasury.compact` with the
  pinned compiler 0.31.1 gave verifier keys byte-identical to all eight on-chain, and the chain
  holds no circuit the source lacks. A different contract's keys (the minting spike) were
  reported as ten differences, as they should be.
- **Anyone can repeat it:**
  ```
  compact compile +0.31.1 contracts/crew_treasury.compact /tmp/crew-check
  node scripts/verify-deployment.mjs /tmp/crew-check
  ```
- **Subscan:** the contract page's Contract Verification tab takes a Compact standard-input
  JSON. `contracts/crew_treasury.standard-input.json` is that file, generated from the same
  source; use compiler type "Compact standard-input" and version 0.31.1.
