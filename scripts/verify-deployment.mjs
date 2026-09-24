// Checks that the deployed crew treasury is exactly contracts/crew_treasury.compact.
//
//   compact compile +0.31.1 contracts/crew_treasury.compact /tmp/crew-check
//   node scripts/verify-deployment.mjs /tmp/crew-check
//
// A Midnight contract stores one verifier key per circuit on-chain, and only proofs made
// against those keys are accepted. Compiling the published source produces the keys; if every
// compiled key byte-matches the one on-chain, and the chain has no circuit the source lacks,
// the deployed contract is this source. It is the comparison midnight-js itself makes before
// it will call a contract (verifyContractState). The build is reproducible: a fresh compile
// with the pinned compiler gives identical keys.
import { readFileSync, readdirSync } from "node:fs";
import { ContractState } from "@midnight-ntwrk/compact-runtime";

const ADDRESS = process.argv[3] ?? "e412fa7fa89433c2d37bbf350eba95e61db6075d5189f0dc5f45c07583cac4b4";
const INDEXER = "https://indexer.preview.midnight.network/api/v4/graphql";
const built = process.argv[2];
if (!built) {
  console.error("usage: node scripts/verify-deployment.mjs <compiled output dir> [contract address]");
  process.exit(2);
}

const query = `{ contract(address: "${ADDRESS}") { state } }`;
const response = await fetch(INDEXER, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query }) });
const hex = (await response.json()).data?.contract?.state;
if (!hex) throw new Error(`no contract at ${ADDRESS}`);
const state = ContractState.deserialize(Buffer.from(hex, "hex"));

const onChain = new Set(state.operations().map((op) => (typeof op === "string" ? op : Buffer.from(op).toString())));
const keysDir = `${built.replace(/\/$/, "")}/keys/`;
const compiled = readdirSync(keysDir).filter((f) => f.endsWith(".verifier")).map((f) => f.replace(".verifier", ""));

let failures = 0;
for (const circuit of compiled) {
  const deployed = state.operation(circuit)?.verifierKey;
  const same = deployed && Buffer.compare(Buffer.from(deployed), readFileSync(keysDir + circuit + ".verifier")) === 0;
  if (!same) failures++;
  console.log(`${same ? "match " : "DIFFER"}  ${circuit}`);
  onChain.delete(circuit);
}
for (const extra of onChain) { failures++; console.log(`EXTRA   ${extra} is on-chain but not in the source`); }

console.log(failures === 0
  ? `\nThe contract at ${ADDRESS} is this source: all ${compiled.length} circuits match.`
  : `\n${failures} difference(s): the deployed contract is not this source.`);
process.exit(failures === 0 ? 0 : 1);
