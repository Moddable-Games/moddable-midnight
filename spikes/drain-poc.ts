// Regression for the audit's VR-1. Before the fix, draw() took a caller-chosen period, so one
// mandate drew ten times in one block by passing ten different periods. Now the period lives
// on the ledger and only the organiser opens one: the second draw must fail.
//   npx tsx spikes/drain-poc.ts
import { createCircuitContext, createConstructorContext, sampleContractAddress } from "@midnight-ntwrk/compact-runtime";
import { Contract, ledger } from "../src/managed/crew_treasury/contract/index.js";
import { createCrewPrivateState, crewWitnesses, randomBytes32 } from "../src/crew-witnesses.ts";
const c = new Contract(crewWitnesses);
const organiser = createCrewPrivateState(randomBytes32(), randomBytes32());
const agent = createCrewPrivateState(randomBytes32(), randomBytes32());
const addr = sampleContractAddress();
let state = (await c.initialState(createConstructorContext(organiser, "0".repeat(64)), new Uint8Array(32).fill(9), 50n)).currentContractState.data;
const run = async (who, circuit, ...args) => { const r = await c.circuits[circuit](createCircuitContext(addr, "0".repeat(64), state, who), ...args); state = r.context.currentQueryContext.state; return r.result; };
await run(organiser, "mintTreasury", 1_000_000n);
await run(organiser, "openPeriod", new Uint8Array(32).fill(1));
const commitment = await run(agent, "makeMandateCommitment");
await run(organiser, "issueMandate", commitment, { bytes: randomBytes32() });
let ok = 0;
let stoppedBy = "nothing";
for (let i = 0; i < 10; i++) {
  try { await run(agent, "draw", { bytes: randomBytes32() }); ok++; }
  catch (e) { stoppedBy = (e as Error).message; break; }
}
console.log(`one mandate made ${ok} draw(s); drawCount=${ledger(state).drawCount}; stopped by: ${stoppedBy}`);
if (ok !== 1) { console.error("REGRESSION: the drain is back"); process.exit(1); }
