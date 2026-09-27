// VR-1: open a private_ledger transfer's commitments from public data alone.
import { createCircuitContext, createConstructorContext, sampleContractAddress } from "@midnight-ntwrk/compact-runtime";
import { Contract, ledger, pureCircuits } from "../src/managed/private_ledger/contract/index.js";
import { noteBookState, noteBookWitnesses, randomBytes32 } from "../src/token-witnesses.js";
import { ownerKeyOf, pad32 } from "../src/note-book.js";
const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");
const issuerSk = randomBytes32(), aliceSk = randomBytes32(), bobSk = randomBytes32();
const domain = pad32("veil");
const c = new Contract(noteBookWitnesses);
const addr = sampleContractAddress();
let state = (await c.initialState(createConstructorContext(noteBookState(issuerSk), "0".repeat(64)), "V", "V", 0n, domain)).currentContractState.data;
const mintNonce = randomBytes32();
let r = await c.circuits.mint(createCircuitContext(addr, "0".repeat(64), state, noteBookState(issuerSk, [], mintNonce)), Buffer.from(ownerKeyOf(aliceSk), "hex"), 1000n);
state = r.context.currentQueryContext.state;
const before = new Set([...ledger(state).spent].map(hex));
r = await c.circuits.transfer(createCircuitContext(addr, "0".repeat(64), state, noteBookState(aliceSk, [{ domain: hex(domain), amount: "1000", nonce: hex(mintNonce) }])), domain, Buffer.from(ownerKeyOf(bobSk), "hex"), 37n);
state = r.context.currentQueryContext.state;
// PUBLIC ONLY from here: the new nullifier, the tree, the domain, and known owner keys.
const nf = [...ledger(state).spent].map(hex).find((n) => !before.has(n))!;
const tree = ledger(state).notes;
const found: string[] = [];
for (const [who, owner] of [["bob", ownerKeyOf(bobSk)], ["alice", ownerKeyOf(aliceSk)]] as const)
  for (const tag of ["moddable:kind3:pay:", "moddable:kind3:change:", "moddable:kind3:out:"]) {
    const nonce = pureCircuits.tagged(pad32(tag), Buffer.from(nf, "hex")); // all an observer can derive
    for (let a = 0n; a <= 10_000n; a++) {
      const com = pureCircuits.noteCommitment({ domain, owner: Buffer.from(owner, "hex"), amount: a }, nonce);
      if (tree.findPathForLeaf(com)) { found.push(`${who} holds ${a} (${tag})`); break; }
    }
  }
console.log(found.length ? "CONFIRMED: " + found.join("; ") : "REFUTED: nothing recovered");
