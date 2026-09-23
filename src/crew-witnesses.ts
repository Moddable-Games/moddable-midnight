import { createHash } from "node:crypto";
import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type {
  Ledger,
  MerkleTreePath,
} from "./managed/crew_treasury/contract/index.js";

/**
 * Private state for the crew treasury contract.
 *
 * `secretKey` is the security boundary: the organiser's gates organiser actions, an
 * agent's controls its mandate and derives its draw nullifiers. `mandateNonce` blinds the
 * agent's mandate commitment. Neither leaves the process that holds it.
 */
export type CrewPrivateState = {
  readonly secretKey: Uint8Array;
  readonly mandateNonce: Uint8Array;
};

export const createCrewPrivateState = (
  secretKey: Uint8Array,
  mandateNonce: Uint8Array = deriveNonce(secretKey),
): CrewPrivateState => {
  assertLength(secretKey, "secretKey");
  assertLength(mandateNonce, "mandateNonce");
  return { secretKey, mandateNonce };
};

export const randomBytes32 = (): Uint8Array =>
  globalThis.crypto.getRandomValues(new Uint8Array(32));

/** Stable nonce derived from the secret, for callers that only keep the secret. */
const deriveNonce = (secretKey: Uint8Array): Uint8Array =>
  new Uint8Array(createHash("sha256").update("moddable:crew:nonce").update(secretKey).digest());

const assertLength = (value: Uint8Array, name: string): void => {
  if (value.length !== 32) throw new Error(`${name} must be exactly 32 bytes, received ${value.length}`);
};

const toHex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

export const crewWitnesses = {
  localSecretKey(context: WitnessContext<Ledger, CrewPrivateState>): [CrewPrivateState, Uint8Array] {
    return [context.privateState, context.privateState.secretKey];
  },

  mandateNonce(context: WitnessContext<Ledger, CrewPrivateState>): [CrewPrivateState, Uint8Array] {
    return [context.privateState, context.privateState.mandateNonce];
  },

  /** Only the siblings are trusted: `draw` rebinds the leaf to the commitment it recomputes. */
  findMandatePath(
    context: WitnessContext<Ledger, CrewPrivateState>,
    commitment: Uint8Array,
  ): [CrewPrivateState, MerkleTreePath<Uint8Array>] {
    const path = context.ledger.mandates.findPathForLeaf(commitment);
    if (path === undefined) {
      throw new Error(`No mandate in the tree for commitment 0x${toHex(commitment)}. Has the organiser appointed this agent?`);
    }
    return [context.privateState, path];
  },
};
