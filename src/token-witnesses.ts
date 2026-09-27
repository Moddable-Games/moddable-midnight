import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";

/**
 * Witnesses for the token contracts (native_unshielded, native_shielded, contract_token,
 * private_ledger) and the v3 crew treasury.
 *
 * Every contract authenticates its callers the same way: the caller proves, inside the
 * circuit, a secret whose hash the contract stored. `secretKey` is that secret and never
 * leaves the process holding it.
 *
 * Private state is plain JSON (hex strings, decimal strings) so any private-state store can
 * persist it without custom serialisation.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const bytes = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));

export const randomBytes32 = (): Uint8Array => globalThis.crypto.getRandomValues(new Uint8Array(32));

// ---------------------------------------------------------------------------
// Secret only: native_unshielded, native_shielded, contract_token
// ---------------------------------------------------------------------------

export type SecretState = { readonly secretKey: string };

export const secretState = (secretKey: Uint8Array): SecretState => {
  if (secretKey.length !== 32) throw new Error("secretKey must be 32 bytes");
  return { secretKey: hex(secretKey) };
};

export const secretWitnesses = {
  localSecretKey<L>(context: WitnessContext<L, SecretState>): [SecretState, Uint8Array] {
    return [context.privateState, bytes(context.privateState.secretKey)];
  },
};

// ---------------------------------------------------------------------------
// private_ledger: a note book
// ---------------------------------------------------------------------------

/** One note the holder can spend. */
export type HeldNote = { readonly domain: string; readonly amount: string; readonly nonce: string };

/**
 * `notes` are the holder's unspent notes; the wallet daemon keeps them current after every
 * transaction. `nextNonce` is the nonce the next mint or deposit uses, chosen before the call
 * so the holder can record the note it creates.
 */
export type NoteBookState = {
  readonly secretKey: string;
  readonly notes: readonly HeldNote[];
  readonly nextNonce: string;
};

export const noteBookState = (secretKey: Uint8Array, notes: HeldNote[] = [], nextNonce = randomBytes32()): NoteBookState => ({
  secretKey: hex(secretKey),
  notes,
  nextNonce: hex(nextNonce),
});

type Opening = { domain: Uint8Array; amount: bigint; nonce: Uint8Array };
type Path = { leaf: Uint8Array; path: { sibling: { field: bigint }; goes_left: boolean }[] };
type NoteLedger = { notes: { findPathForLeaf(leaf: Uint8Array): Path | undefined } };

export const noteBookWitnesses = {
  localSecretKey<L>(context: WitnessContext<L, NoteBookState>): [NoteBookState, Uint8Array] {
    return [context.privateState, bytes(context.privateState.secretKey)];
  },

  freshNonce<L>(context: WitnessContext<L, NoteBookState>): [NoteBookState, Uint8Array] {
    return [context.privateState, bytes(context.privateState.nextNonce)];
  },

  /** The smallest unspent note of `d` that covers `atLeast`. */
  noteToSpend<L>(context: WitnessContext<L, NoteBookState>, d: Uint8Array, atLeast: bigint): [NoteBookState, Opening] {
    const domain = hex(d);
    const note = context.privateState.notes
      .filter((n) => n.domain === domain && BigInt(n.amount) >= atLeast)
      .sort((a, b) => (BigInt(a.amount) < BigInt(b.amount) ? -1 : 1))[0];
    if (!note) throw new Error(`No note of ${domain.slice(0, 8)}… worth at least ${atLeast}`);
    return [context.privateState, { domain: d, amount: BigInt(note.amount), nonce: bytes(note.nonce) }];
  },

  findNotePath<L extends NoteLedger>(context: WitnessContext<L, NoteBookState>, commitment: Uint8Array): [NoteBookState, Path] {
    const path = context.ledger.notes.findPathForLeaf(commitment);
    if (!path) throw new Error(`Note 0x${hex(commitment).slice(0, 16)}… is not in the tree`);
    return [context.privateState, path];
  },
};

// ---------------------------------------------------------------------------
// crew_treasury_v3: the agent's secret and the terms it was appointed under
// ---------------------------------------------------------------------------

/** The salt is random, chosen by the organiser and given to the agent with its terms. */
export type MandateTerms = { capPerDraw: bigint; drawsPerPeriod: bigint; salt: Uint8Array };

export type CrewV3State = {
  readonly secretKey: string;
  readonly capPerDraw: string;
  readonly drawsPerPeriod: string;
  readonly salt: string;
};

export const crewV3State = (
  secretKey: Uint8Array,
  terms: MandateTerms = { capPerDraw: 0n, drawsPerPeriod: 0n, salt: new Uint8Array(32) },
): CrewV3State => ({
  secretKey: hex(secretKey),
  capPerDraw: terms.capPerDraw.toString(),
  drawsPerPeriod: terms.drawsPerPeriod.toString(),
  salt: hex(terms.salt),
});

type MandateLedger = { mandates: { findPathForLeaf(leaf: Uint8Array): Path | undefined } };

export const crewV3Witnesses = {
  localSecretKey<L>(context: WitnessContext<L, CrewV3State>): [CrewV3State, Uint8Array] {
    return [context.privateState, bytes(context.privateState.secretKey)];
  },

  mandateTerms<L>(context: WitnessContext<L, CrewV3State>): [CrewV3State, MandateTerms] {
    const s = context.privateState;
    return [s, { capPerDraw: BigInt(s.capPerDraw), drawsPerPeriod: BigInt(s.drawsPerPeriod), salt: bytes(s.salt) }];
  },

  findMandatePath<L extends MandateLedger>(context: WitnessContext<L, CrewV3State>, leaf: Uint8Array): [CrewV3State, Path] {
    const path = context.ledger.mandates.findPathForLeaf(leaf);
    if (!path) throw new Error("No current mandate for this agent. Has the organiser appointed it in this epoch?");
    return [context.privateState, path];
  },
};
