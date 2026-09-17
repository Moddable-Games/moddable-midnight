import { createHash } from "node:crypto";
import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type {
  Ledger,
  MerkleTreePath,
} from "./managed/tournament_pass/contract/index.js";

/**
 * Private state for the tournament pass contract.
 *
 * `secretKey` is the security boundary. Whoever holds it controls every pass
 * whose leaf commits to it, and can derive the matching nullifiers. It never
 * leaves this process: the circuit consumes it, the transcript sees only
 * commitments and nullifiers derived from it.
 *
 * `passNonce` is the blinding factor for the currently held pass. It is what
 * makes two passes belonging to the same player produce different leaves and
 * different nullifiers. Issue a fresh one per pass.
 */
export type TournamentPrivateState = {
  readonly secretKey: Uint8Array;
  readonly passNonce: Uint8Array;
};

/**
 * Build private state from 32-byte values supplied by the caller.
 *
 * The nonce is optional because the Midnight wallet CLI calls this factory with
 * a secret key only, and calls it again on every contract call, replacing the
 * stored private state each time. A random default would change the nonce
 * between issuing a pass and claiming it. Deriving it from the secret keeps it
 * stable and still unguessable, at the cost of one pass per secret key.
 */
export const createPrivateState = (
  secretKey: Uint8Array,
  passNonce: Uint8Array = deriveNonce(secretKey),
): TournamentPrivateState => {
  assertLength(secretKey, "secretKey");
  assertLength(passNonce, "passNonce");
  return { secretKey, passNonce };
};

/**
 * Fresh 32 bytes from the platform CSPRNG.
 *
 * Used for both the long-lived secret and per-pass nonces. Never derive either
 * from a predictable source: a guessable nonce lets an observer test candidate
 * leaves against the published Merkle tree and de-anonymise a claim.
 */
export const randomBytes32 = (): Uint8Array =>
  globalThis.crypto.getRandomValues(new Uint8Array(32));

/** Deterministic pass nonce: SHA-256 over a domain tag and the secret key. */
const deriveNonce = (secretKey: Uint8Array): Uint8Array =>
  new Uint8Array(
    createHash("sha256")
      .update("moddable:tournament-pass:nonce")
      .update(secretKey)
      .digest(),
  );

const assertLength = (value: Uint8Array, name: string): void => {
  if (value.length !== 32) {
    throw new Error(
      `${name} must be exactly 32 bytes, received ${value.length}`,
    );
  }
};

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

export const witnesses = {
  /**
   * The caller's long-lived secret. The circuit derives both the pass
   * commitment and the claim nullifier from it, under different domain
   * separators, so the two cannot be correlated on-chain.
   */
  localSecretKey(
    context: WitnessContext<Ledger, TournamentPrivateState>,
  ): [TournamentPrivateState, Uint8Array] {
    return [context.privateState, context.privateState.secretKey];
  },

  /** Blinding nonce for the pass currently held. */
  passNonce(
    context: WitnessContext<Ledger, TournamentPrivateState>,
  ): [TournamentPrivateState, Uint8Array] {
    return [context.privateState, context.privateState.passNonce];
  },

  /**
   * Authentication path for the caller's pass, read from the local copy of the
   * ledger state.
   *
   * Only the sibling entries of this result are trusted. `claimPrize`
   * discards the returned leaf and substitutes the commitment it recomputed
   * in-circuit, so a malicious witness implementation returning some other
   * member's path cannot claim against that member's pass: the recomputed root
   * will not match.
   */
  findPassPath(
    context: WitnessContext<Ledger, TournamentPrivateState>,
    commitment: Uint8Array,
  ): [TournamentPrivateState, MerkleTreePath<Uint8Array>] {
    const path = context.ledger.passes.findPathForLeaf(commitment);
    if (path === undefined) {
      throw new Error(
        `No entry pass found in the tree for commitment 0x${toHex(commitment)}. ` +
          `Has the organiser issued a pass for this secret and nonce?`,
      );
    }
    return [context.privateState, path];
  },
};
