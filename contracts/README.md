# Compact sources

`tournament_pass.compact` — entry passes committed into a Merkle tree, a prize
pool, and a claim that proves membership and spends a nullifier without
revealing which pass was used.

Compile: `npm run compile` (output lands in `../src/managed/`, gitignored).

`crew_treasury.compact`: v2 crew treasury (live): MCC, Agent Smart Contract NFTs, one fixed
draw per mandate per period.

The token contracts, each fungible and non-fungible, audited in
`../notes/AUDIT-token-contracts.md`:

- `native_unshielded.compact`: native public coins after MIP-0014
- `native_shielded.compact`: native private coins after MIP-0011
- `contract_token.compact`: contract balances with UTXO conversion after MIP-0004
- `private_ledger.compact`: confidential contract balances as notes (MIP-0018 kind 3)
- `crew_treasury_v3.compact`: private per-agent caps and draw slots, blocked payees, revoke-all
- `lib/Events.compact`, `lib/TokenMetadata.compact`: MIP-0002 events and MIP-0018 metadata,
  kept in contract state until ledger 9

Compile any of them with `compact compile +0.31.1 contracts/<name>.compact src/managed/<name>`.
Tests: `npx tsx src/tokens.test.ts`, `npx tsx src/crew-v3.test.ts`.

