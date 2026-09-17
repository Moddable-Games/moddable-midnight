import assert from "node:assert/strict";
import { TournamentSimulator } from "./simulator.js";
import {
  type TournamentPrivateState,
  createPrivateState,
  randomBytes32,
} from "./witnesses.js";

const TOURNAMENT_ID = new Uint8Array(32).fill(7);
const PRIZE = 250n;

/** A participant: one long-lived secret plus the nonce of the pass they hold. */
const participant = (): TournamentPrivateState =>
  createPrivateState(randomBytes32(), randomBytes32());

/** Same player, different pass: same secret, fresh nonce. */
const secondPassFor = (p: TournamentPrivateState): TournamentPrivateState =>
  createPrivateState(p.secretKey, randomBytes32());

const expectReject = async (
  label: string,
  run: () => Promise<unknown>,
): Promise<void> => {
  try {
    await run();
  } catch {
    console.log(`  ok   ${label}`);
    return;
  }
  throw new Error(`expected rejection: ${label}`);
};

const expectAccept = async (
  label: string,
  run: () => Promise<unknown>,
): Promise<void> => {
  await run();
  console.log(`  ok   ${label}`);
};

const run = async (): Promise<void> => {
  const organiser = participant();
  const alice = participant();
  const bob = participant();
  const mallory = participant();

  const sim = await TournamentSimulator.deploy(
    organiser,
    TOURNAMENT_ID,
    PRIZE,
  );

  console.log("deployment");
  assert.equal(sim.ledger().prizePerClaim, PRIZE);
  assert.equal(sim.ledger().prizePool, 0n);
  assert.equal(sim.ledger().passCount, 0n);
  console.log("  ok   organiser recorded, pool empty");

  console.log("access control");
  await expectReject("non-organiser cannot fund the pool", () =>
    sim.fundPool(mallory, 1000n),
  );
  await expectReject("non-organiser cannot issue a pass", () =>
    sim.issuePass(mallory, new Uint8Array(32).fill(1)),
  );

  console.log("issuing and funding");
  await expectAccept("organiser funds the pool", () =>
    sim.fundPool(organiser, 1000n),
  );
  assert.equal(sim.ledger().prizePool, 1000n);

  const aliceCommitment = await sim.makePassCommitment(alice);
  const bobCommitment = await sim.makePassCommitment(bob);
  assert.notDeepEqual(
    aliceCommitment,
    bobCommitment,
    "distinct players must produce distinct commitments",
  );

  await expectAccept("organiser issues Alice a pass", () =>
    sim.issuePass(organiser, aliceCommitment),
  );
  await expectAccept("organiser issues Bob a pass", () =>
    sim.issuePass(organiser, bobCommitment),
  );
  assert.equal(sim.ledger().passCount, 2n);

  console.log("the private claim");
  await expectAccept("Alice claims against her pass", () =>
    sim.claimPrize(alice),
  );
  assert.equal(sim.ledger().prizePool, 750n);
  assert.equal(sim.ledger().claimCount, 1n);
  assert.equal(sim.ledger().spentPasses.size(), 1n);
  console.log("  ok   pool debited, one nullifier published");

  console.log("nullifier and membership enforcement");
  await expectReject("Alice cannot claim twice with the same pass", () =>
    sim.claimPrize(alice),
  );
  await expectReject("a player with no pass cannot claim", () =>
    sim.claimPrize(mallory),
  );
  await expectReject(
    "Alice cannot claim again with a fresh nonce she was never issued a pass for",
    () => sim.claimPrize(secondPassFor(alice)),
  );

  await expectAccept("Bob claims independently", () => sim.claimPrize(bob));
  assert.equal(sim.ledger().prizePool, 500n);
  assert.equal(sim.ledger().claimCount, 2n);

  console.log("what the chain reveals");
  const published = [...sim.ledger().spentPasses];
  assert.equal(published.length, 2);
  for (const nullifier of published) {
    assert.notDeepEqual(
      nullifier,
      aliceCommitment,
      "a nullifier must not equal a published leaf",
    );
    assert.notDeepEqual(nullifier, bobCommitment);
  }
  console.log(
    "  ok   nullifiers are uncorrelated with the issued leaf commitments",
  );

  console.log("adversarial witness");
  // The contract trusts only the sibling entries of findPassPath: claimPrize
  // discards the returned leaf and substitutes the commitment it recomputed
  // in-circuit. Prove that by handing the circuit a witness that returns Bob's
  // genuine path while the private state holds Mallory's secret.
  await expectReject(
    "a lying findPassPath cannot borrow another player's membership proof",
    () => sim.claimPrizeWithStolenPath(mallory, bobCommitment),
  );

  console.log("pool exhaustion");
  const carol = participant();
  await sim.issuePass(organiser, await sim.makePassCommitment(carol));
  await sim.fundPool(organiser, 1n);
  // Pool is 501; two more claims of 250 leave 1, a third must fail.
  await sim.claimPrize(carol);
  const dave = participant();
  await sim.issuePass(organiser, await sim.makePassCommitment(dave));
  await sim.claimPrize(dave);
  assert.equal(sim.ledger().prizePool, 1n);
  const erin = participant();
  await sim.issuePass(organiser, await sim.makePassCommitment(erin));
  await expectReject("claim fails once the pool cannot cover it", () =>
    sim.claimPrize(erin),
  );

  console.log("\nall checks passed");
};

run().catch((error) => {
  console.error("\nFAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
