import { pureCircuits } from "./managed/private_ledger/contract/index.js";
import type { HeldNote } from "./token-witnesses.js";

/**
 * Off-chain bookkeeping for private_ledger notes.
 *
 * Every note a call creates can be worked out from what the caller already knows: the note it
 * spent, the amounts and the nonce it chose. These helpers do that with the contract's own
 * pure circuits (compiled from the same Compact source), so the book cannot drift from the
 * circuit. The wallet daemon runs them after each confirmed call and files each new note
 * with its owner.
 */

const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");
const bytes = (h: string) => Uint8Array.from(Buffer.from(h, "hex"));

/** pad(32, text), as Compact computes it. */
export const pad32 = (text: string): Uint8Array => {
  const out = new Uint8Array(32);
  out.set(new TextEncoder().encode(text));
  return out;
};

export const ownerKeyOf = (secretKey: Uint8Array): string => hex(pureCircuits.ownerKey(secretKey));

export const commitmentOf = (owner: string, note: HeldNote): string =>
  hex(pureCircuits.noteCommitment({ domain: bytes(note.domain), owner: bytes(owner), amount: BigInt(note.amount) }, bytes(note.nonce)));

/** The note a mint or deposit creates, from the nonce the caller supplied. */
export const createdNote = (domain: string, amount: bigint, nonce: string): HeldNote => ({ domain, amount: amount.toString(), nonce });

/**
 * What spending `input` for `amount` creates: the caller's change note, and for a transfer
 * the recipient's note. Mirrors `spend` and `transfer` in private_ledger.compact: every nonce
 * mixes in the spender's secret, so only the spender (and whoever it tells) can open them.
 */
export function afterSpend(secretKey: Uint8Array, input: HeldNote, amount: bigint) {
  const owner = ownerKeyOf(secretKey);
  const nullifier = pureCircuits.nullifierOf(secretKey, bytes(commitmentOf(owner, input)));
  const spentNonce = bytes(input.nonce);
  const seed = pureCircuits.outputNonce(pad32("moddable:kind3:out:"), secretKey, spentNonce);
  const change: HeldNote = {
    domain: input.domain,
    amount: (BigInt(input.amount) - amount).toString(),
    nonce: hex(pureCircuits.outputNonce(pad32("moddable:kind3:change:"), secretKey, spentNonce)),
  };
  const paid: HeldNote = {
    domain: input.domain,
    amount: amount.toString(),
    nonce: hex(pureCircuits.tagged(pad32("moddable:kind3:pay:"), seed)),
  };
  return { nullifier: hex(nullifier), change, paid };
}

/** The note the witness will pick: the smallest one of `domain` covering `amount`. */
export function pickNote(notes: readonly HeldNote[], domain: string, amount: bigint): HeldNote | undefined {
  return notes
    .filter((n) => n.domain === domain && BigInt(n.amount) >= amount)
    .sort((a, b) => (BigInt(a.amount) < BigInt(b.amount) ? -1 : 1))[0];
}
