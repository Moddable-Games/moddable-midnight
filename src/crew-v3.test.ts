// In-memory tests for crew treasury v3: private per-agent caps and draw slots, blocked payees,
// epoch revocation, and the attacks on each.
//   npx tsx src/crew-v3.test.ts
import assert from "node:assert/strict";
import {
  type ChargedState,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import { Contract, ledger, pureCircuits, EventType } from "./managed/crew_treasury_v3/contract/index.js";
import { type CrewV3State, crewV3State, crewV3Witnesses, randomBytes32 } from "./token-witnesses.js";

const CREW_ID = new Uint8Array(32).fill(3);
const label = (text: string) => { const b = new Uint8Array(32); b.set(new TextEncoder().encode(text)); return b; };
const address = () => ({ bytes: randomBytes32() });

class Crew {
  state!: ChargedState;
  readonly address = sampleContractAddress();
  constructor(readonly contract = new Contract<CrewV3State>(crewV3Witnesses)) {}
  static async deploy(organiser: CrewV3State) {
    const crew = new Crew();
    const { currentContractState } = await crew.contract.initialState(createConstructorContext(organiser, "0".repeat(64)), CREW_ID);
    crew.state = currentContractState.data;
    return crew;
  }
  ledger() { return ledger(this.state); }
  async run(who: CrewV3State, circuit: keyof Contract<CrewV3State>["circuits"], ...args: unknown[]) {
    const context = createCircuitContext(this.address, "0".repeat(64), this.state, who);
    // biome-ignore lint: the circuit table is keyed by name
    const result = await (this.contract.circuits[circuit] as any)(context, ...args);
    this.state = result.context.currentQueryContext.state;
    return result.result;
  }
}

let passed = 0;
const ok = async (name: string, run: () => Promise<unknown>) => { await run(); passed++; console.log(`  ok   ${name}`); };
const rejects = async (name: string, run: () => Promise<unknown>, reason: RegExp) => {
  try { await run(); } catch (e) {
    assert.match(String((e as Error).message), reason, `${name}: wrong failure`);
    passed++; console.log(`  ok   ${name}`); return;
  }
  throw new Error(`expected rejection: ${name}`);
};

/** An agent: its secret, the key it hands the organiser, and the terms it was given. */
const agent = (capPerDraw: bigint, drawsPerPeriod: bigint) => {
  const secret = randomBytes32();
  const terms = { capPerDraw, drawsPerPeriod, salt: randomBytes32() };
  return { secret, terms, key: pureCircuits.agentKey(secret, CREW_ID), state: crewV3State(secret, terms) };
};

const organiser = crewV3State(randomBytes32());
const floyd = agent(100n, 2n);
const tzilo = agent(20n, 1n);
const crew = await Crew.deploy(organiser);
const period = label("2026-09-27");

console.log("crew_treasury_v3");
await rejects("no draw before funding and a period", () => crew.run(floyd.state, "draw", 10n, 0n, address()), /No period open|not funded/);
await rejects("a stranger cannot mint the treasury", () => crew.run(floyd.state, "mintTreasury", 1000n), /not the organiser/);
await ok("the organiser mints MCC into the contract", async () => {
  await crew.run(organiser, "mintTreasury", 1_000_000n);
  assert.equal(crew.ledger().treasuryMinted, 1_000_000n);
});
await ok("the organiser appoints agents under private terms; only the leaf is public", async () => {
  await crew.run(organiser, "issueMandate", floyd.key, floyd.terms, address());
  await crew.run(organiser, "issueMandate", tzilo.key, tzilo.terms, address());
  assert.equal(crew.ledger().mandateCount, 2n);
  const leaf = pureCircuits.mandateLeaf(CREW_ID, floyd.key, 0n, floyd.terms);
  assert.ok(crew.ledger().issued.member(leaf));
});
await rejects("the same mandate cannot be issued twice", () => crew.run(organiser, "issueMandate", floyd.key, floyd.terms, address()), /already appointed|already issued/);
await rejects("an agent cannot appoint itself", () => crew.run(floyd.state, "issueMandate", floyd.key, { capPerDraw: 10n ** 9n, drawsPerPeriod: 99n, salt: randomBytes32() }, address()), /not the organiser/);
await rejects("one mandate per agent per epoch: new terms cannot be stacked on old ones (audit M-1)", () =>
  crew.run(organiser, "issueMandate", floyd.key, { capPerDraw: 5000n, drawsPerPeriod: 9n, salt: randomBytes32() }, address()), /already appointed/);
await ok("the organiser opens a period", () => crew.run(organiser, "openPeriod", period));

await ok("an agent draws within its cap", async () => {
  await crew.run(floyd.state, "draw", 100n, 0n, address());
  assert.equal(crew.ledger().drawCount, 1n);
  const last = [...crew.ledger().eventLog].sort(([a], [b]) => (a < b ? -1 : 1)).at(-1)![1];
  assert.equal(last.eventType, EventType.UnshieldedSpend);
  assert.equal(last.amount, 100n);
});
await rejects("a draw over the agent's cap is refused", () => crew.run(floyd.state, "draw", 101n, 1n, address()), /cap per draw/);
await ok("a second draw in the same period uses the next slot", () => crew.run(floyd.state, "draw", 50n, 1n, address()));
await rejects("a used slot cannot be drawn again", () => crew.run(floyd.state, "draw", 1n, 1n, address()), /slot is used/);
await rejects("slots beyond the session limit are refused", () => crew.run(floyd.state, "draw", 1n, 2n, address()), /No draws left/);
await rejects("an agent with one slot gets one draw", async () => {
  await crew.run(tzilo.state, "draw", 20n, 0n, address());
  await crew.run(tzilo.state, "draw", 20n, 1n, address());
}, /No draws left/);
await rejects("claiming bigger terms than appointed fails: that leaf is not in the tree", () =>
  crew.run(crewV3State(tzilo.secret, { ...tzilo.terms, capPerDraw: 10_000n, drawsPerPeriod: 9n }), "draw", 5000n, 0n, address()), /No current mandate/);
await rejects("the right terms with the wrong salt do not match the leaf (audit L-4)", () =>
  crew.run(crewV3State(tzilo.secret, { ...tzilo.terms, salt: randomBytes32() }), "draw", 1n, 0n, address()), /No current mandate/);
await rejects("a draw to the zero address is refused (audit L-5)", () => crew.run(floyd.state, "draw", 1n, 0n, { bytes: new Uint8Array(32) }), /zero address/);
await rejects("a stranger's secret has no mandate", () => crew.run(agent(100n, 1n).state, "draw", 1n, 0n, address()), /No current mandate/);
await rejects("a stolen path for another agent's leaf is rejected", async () => {
  const floydLeaf = pureCircuits.mandateLeaf(CREW_ID, floyd.key, 0n, floyd.terms);
  const lying = new Contract<CrewV3State>({
    ...crewV3Witnesses,
    findMandatePath: (context, _leaf) => crewV3Witnesses.findMandatePath(context, floydLeaf),
  });
  const thief = agent(100n, 2n);
  const context = createCircuitContext(crew.address, "0".repeat(64), crew.state, thief.state);
  await lying.circuits.draw(context, 10n, 0n, address());
}, /No current mandate/);

await ok("a new period refills every agent's slots", async () => {
  await crew.run(organiser, "openPeriod", label("2026-09-28"));
  await crew.run(tzilo.state, "draw", 20n, 0n, address());
});
const blocked = address();
await ok("the organiser blocks a payee", () => crew.run(organiser, "blockPayee", blocked));
await rejects("a draw to a blocked payee is refused", () => crew.run(floyd.state, "draw", 10n, 0n, blocked), /Payee is blocked/);
await ok("an unblocked payee can be paid again", async () => {
  await crew.run(organiser, "unblockPayee", blocked);
  await crew.run(floyd.state, "draw", 10n, 0n, blocked);
});
await rejects("an agent cannot unblock or block payees", () => crew.run(floyd.state, "blockPayee", address()), /not the organiser/);

await ok("pausing stops every draw and is logged", async () => {
  await crew.run(organiser, "setPaused", true);
  await assert.rejects(() => crew.run(floyd.state, "draw", 10n, 1n, address()), /paused/);
  await crew.run(organiser, "setPaused", false);
});
await ok("revokeAll moves to a new epoch; old mandates stop working", async () => {
  await crew.run(organiser, "revokeAll");
  assert.equal(crew.ledger().epoch, 1n);
  await assert.rejects(() => crew.run(floyd.state, "draw", 10n, 1n, address()), /No current mandate/);
});
const newTerms = { capPerDraw: 30n, drawsPerPeriod: 2n, salt: randomBytes32() };
const reissued = crewV3State(floyd.secret, newTerms);
await ok("the organiser re-issues a mandate in the new epoch, with new terms", () => crew.run(organiser, "issueMandate", floyd.key, newTerms, address()));
await rejects("a re-issued mandate gets no fresh slots in the same period (audit M-1 regression)", () =>
  crew.run(reissued, "draw", 10n, 0n, address()), /slot is used/);
await ok("it draws with its unused slot, under the new cap", async () => {
  await crew.run(reissued, "draw", 30n, 1n, address());
  await assert.rejects(() => crew.run(reissued, "draw", 31n, 1n, address()), /cap per draw|slot is used/);
});
await ok("in the next period the new terms apply in full", async () => {
  await crew.run(organiser, "openPeriod", label("2026-09-29"));
  await crew.run(reissued, "draw", 30n, 0n, address());
  await assert.rejects(() => crew.run(reissued, "draw", 31n, 1n, address()), /cap per draw/);
});
await rejects("tzilo, not re-issued, stays revoked", () => crew.run(tzilo.state, "draw", 1n, 0n, address()), /No current mandate/);

const payload = (domainSep: Uint8Array, kind: bigint) => ({ domainSep, kind, key: label("name"), valType: 1n, valLen: 3n, value: new Uint8Array(189) });
await ok("metadata for MCC (kind 0) is accepted", () => crew.run(organiser, "publishMetadata", payload(label("moddable:crew3:treasury"), 0n)));
await rejects("metadata for any other domain is refused (audit L-2)", () => crew.run(organiser, "publishMetadata", payload(label("fake"), 0n)), /Not a token this treasury issued/);
await rejects("kind-1 metadata only for a real Agent Smart Contract", () => crew.run(organiser, "publishMetadata", payload(randomBytes32(), 1n)), /Not a token this treasury issued/);

console.log(`\n${passed} passed`);
