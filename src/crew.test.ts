// In-memory tests for the crew treasury contract: every rule, including the attacks.
//   npx tsx src/crew.test.ts
import assert from "node:assert/strict";
import {
  type ChargedState,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import { Contract, ledger } from "./managed/crew_treasury/contract/index.js";
import { type CrewPrivateState, createCrewPrivateState, crewWitnesses, randomBytes32 } from "./crew-witnesses.js";

const CREW_ID = new Uint8Array(32).fill(9);
const DRAW = 50n;
const period = (label: string) => { const b = new Uint8Array(32); b.set(new TextEncoder().encode(label)); return b; };
const person = (): CrewPrivateState => createCrewPrivateState(randomBytes32(), randomBytes32());
const address = () => ({ bytes: randomBytes32() });

class Crew {
  private state!: ChargedState;
  readonly address = sampleContractAddress();
  constructor(readonly contract = new Contract<CrewPrivateState>(crewWitnesses)) {}

  static async deploy(organiser: CrewPrivateState): Promise<Crew> {
    const crew = new Crew();
    const { currentContractState } = await crew.contract.initialState(
      createConstructorContext(organiser, "0".repeat(64)), CREW_ID, DRAW);
    crew.state = currentContractState.data;
    return crew;
  }

  ledger() { return ledger(this.state); }

  /** Runs a circuit as `who`, and keeps the resulting state only if it succeeds. */
  async run<K extends keyof Contract<CrewPrivateState>["circuits"]>(
    who: CrewPrivateState, circuit: K, ...args: unknown[]
  ): Promise<unknown> {
    const context = createCircuitContext(this.address, "0".repeat(64), this.state, who);
    // biome-ignore lint: the circuit table is keyed by name
    const result = await (this.contract.circuits[circuit] as any)(context, ...args);
    this.state = result.context.currentQueryContext.state;
    return result.result;
  }

  /** A contract whose path witness lies, returning another agent's genuine path. */
  withStolenPath(victim: Uint8Array): Crew {
    const lying = new Crew(new Contract<CrewPrivateState>({
      ...crewWitnesses,
      findMandatePath: (context, _c) => crewWitnesses.findMandatePath(context, victim),
    }));
    lying.state = this.state;
    return lying;
  }
}

let passed = 0;
const ok = async (label: string, run: () => Promise<unknown>) => { await run(); passed++; console.log(`  ok   ${label}`); };
const rejects = async (label: string, run: () => Promise<unknown>, reason: RegExp) => {
  try { await run(); } catch (e) {
    assert.match(String((e as Error).message), reason, `${label}: wrong failure`);
    passed++; console.log(`  ok   ${label}`); return;
  }
  throw new Error(`expected rejection: ${label}`);
};

const organiser = person();
const floyd = person();
const tzilo = person();
const stranger = person();
const crew = await Crew.deploy(organiser);

console.log("organiser");
await ok("constructor records the draw amount", async () => assert.equal(crew.ledger().drawAmount, DRAW));
await rejects("no draw before the treasury is funded or a period opened", () => crew.run(floyd, "draw", address()), /not funded|No period open/);
await rejects("a stranger cannot mint MCC", () => crew.run(stranger, "mintTreasury", 1000n), /not the organiser/);
let color!: Uint8Array;
await ok("the organiser mints MCC", async () => { color = await crew.run(organiser, "mintTreasury", 1_000_000n) as Uint8Array; });
await ok("the mint is recorded", async () => {
  assert.equal(crew.ledger().treasuryMinted, 1_000_000n);
  assert.deepEqual(crew.ledger().treasuryColor, color);
});
await rejects("minting zero is refused", () => crew.run(organiser, "mintTreasury", 0n), /positive/);

console.log("mandates (Agent Smart Contracts)");
const floydCommitment = await crew.run(floyd, "makeMandateCommitment") as Uint8Array;
const tziloCommitment = await crew.run(tzilo, "makeMandateCommitment") as Uint8Array;
await rejects("a stranger cannot appoint an agent", () => crew.run(stranger, "issueMandate", floydCommitment, address()), /not the organiser/);
let floydNft!: Uint8Array;
await ok("the organiser appoints Floyd and mints his NFT", async () => {
  floydNft = await crew.run(organiser, "issueMandate", floydCommitment, address()) as Uint8Array;
});
let tziloNft!: Uint8Array;
await ok("the organiser appoints Tzilo", async () => {
  tziloNft = await crew.run(organiser, "issueMandate", tziloCommitment, address()) as Uint8Array;
});
await ok("each mandate NFT has its own token type", async () => {
  assert.notDeepEqual(floydNft, tziloNft);
  assert.equal(crew.ledger().mandateCount, 2n);
});
await rejects("a mandate cannot be issued twice", () => crew.run(organiser, "issueMandate", floydCommitment, address()), /already issued/);

console.log("draws");
const payee = address();
await rejects("no draw before the organiser opens a period", () => crew.run(floyd, "draw", payee), /No period open/);
await rejects("the all-zero period cannot be opened", () => crew.run(organiser, "openPeriod", new Uint8Array(32)), /all zeros/);
await rejects("a stranger cannot open a period", () => crew.run(stranger, "openPeriod", period("2026-09-23")), /not the organiser/);
await ok("the organiser opens period 2026-09-23", () => crew.run(organiser, "openPeriod", period("2026-09-23")));
await rejects("the open period cannot be reopened", () => crew.run(organiser, "openPeriod", period("2026-09-23")), /already open/);
await ok("Floyd draws", () => crew.run(floyd, "draw", payee));
await rejects("Floyd cannot draw twice in one period", () => crew.run(floyd, "draw", payee), /Already drawn/);
await ok("Tzilo draws in the same period as Floyd", () => crew.run(tzilo, "draw", address()));
await rejects("an agent with no mandate cannot draw", () => crew.run(stranger, "draw", payee), /No mandate|No such mandate/);
await rejects("a stolen path does not let a stranger draw",
  () => crew.withStolenPath(floydCommitment).run(stranger, "draw", payee), /No such mandate/);
await ok("Floyd draws again once the organiser opens the next period", async () => {
  await crew.run(organiser, "openPeriod", period("2026-09-24"));
  await crew.run(floyd, "draw", payee);
});
await ok("three draws are counted, and three nullifiers spent", async () => {
  assert.equal(crew.ledger().drawCount, 3n);
  assert.equal(crew.ledger().spentDraws.size(), 3n);
});
await ok("no nullifier reveals which mandate drew", async () => {
  for (const n of crew.ledger().spentDraws) {
    assert.notDeepEqual(n, floydCommitment);
    assert.notDeepEqual(n, tziloCommitment);
  }
});

console.log("limits and metadata");
await rejects("a stranger cannot pause draws", () => crew.run(stranger, "setPaused", true), /not the organiser/);
await ok("the organiser pauses draws", () => crew.run(organiser, "setPaused", true));
await rejects("no draws while paused", () => crew.run(tzilo, "draw", address()), /paused/);
await ok("the organiser resumes draws", async () => {
  await crew.run(organiser, "setPaused", false);
  await crew.run(tzilo, "draw", address());
});
await rejects("a stranger cannot change the draw amount", () => crew.run(stranger, "setDrawAmount", 1_000n), /not the organiser/);
await ok("the organiser changes the draw amount", async () => {
  await crew.run(organiser, "setDrawAmount", 75n);
  assert.equal(crew.ledger().drawAmount, 75n);
});
const mccDigest = randomBytes32();
const nftDigest = randomBytes32();
await rejects("a stranger cannot set metadata", () => crew.run(stranger, "setMetadata", mccDigest, nftDigest), /not the organiser/);
await ok("the organiser publishes both metadata digests", async () => {
  await crew.run(organiser, "setMetadata", mccDigest, nftDigest);
  assert.deepEqual(crew.ledger().treasuryMetadata, mccDigest);
  assert.deepEqual(crew.ledger().mandateMetadata, nftDigest);
});

console.log(`\n${passed} assertions passed`);
