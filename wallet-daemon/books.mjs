// The daemon's records that are not on chain.
//
//   state/notes.json          private_ledger notes per contract and wallet. Secret: a note's
//                             nonce is what lets its owner spend it.
//   state/mandate-terms.json  v3 treasury terms per contract and agent. Private: the chain
//                             holds only a hash of them.
//   deployments.json          every token contract deployed through the daemon. Public, and
//                             committed, so the site can show the same list.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const STATE_DIR = new URL("./state/", import.meta.url).pathname;
const NOTES_FILE = STATE_DIR + "notes.json";
const TERMS_FILE = STATE_DIR + "mandate-terms.json";
const DEPLOYMENTS_FILE = new URL("./deployments.json", import.meta.url).pathname;

const read = (file, fallback) => { try { return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback; } catch { return fallback; } };
const writePrivate = (file, value) => {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(file, JSON.stringify(value, null, 2), { mode: 0o600 });
};

// ---------------------------------------------------------------------------
// Notes (private_ledger)
// ---------------------------------------------------------------------------

export function notesOf(contractAddress, wallet) {
  return read(NOTES_FILE, {})[contractAddress]?.[wallet] ?? [];
}

/** Replaces `spent` (if any) and files `created` notes with their owners. */
export function updateNotes(contractAddress, { wallet, spent, created = [] }) {
  const all = read(NOTES_FILE, {});
  const book = (all[contractAddress] ??= {});
  if (spent) book[wallet] = (book[wallet] ?? []).filter((n) => n.nonce !== spent.nonce);
  for (const { owner, note } of created) {
    if (BigInt(note.amount) === 0n) continue; // zero-value change notes are not worth keeping
    (book[owner] ??= []).push(note);
  }
  writePrivate(NOTES_FILE, all);
}

// ---------------------------------------------------------------------------
// Mandate terms (crew_treasury_v3)
// ---------------------------------------------------------------------------

export function mandateTermsOf(contractAddress, wallet) {
  const t = read(TERMS_FILE, {})[contractAddress]?.[wallet];
  if (!t) return undefined;
  if (!t.salt) throw new Error(`no salt recorded for ${wallet}'s mandate; it cannot draw`);
  return { capPerDraw: BigInt(t.capPerDraw), drawsPerPeriod: BigInt(t.drawsPerPeriod), salt: Uint8Array.from(Buffer.from(t.salt, "hex")), epoch: t.epoch ?? 0 };
}

export function allMandateTerms(contractAddress) {
  return read(TERMS_FILE, {})[contractAddress] ?? {};
}

export function setMandateTerms(contractAddress, wallet, terms) {
  const all = read(TERMS_FILE, {});
  (all[contractAddress] ??= {})[wallet] = {
    capPerDraw: String(terms.capPerDraw), drawsPerPeriod: String(terms.drawsPerPeriod), salt: terms.salt, epoch: terms.epoch ?? 0,
    issuedAt: new Date().toISOString(),
  };
  writePrivate(TERMS_FILE, all);
}

export function removeMandateTerms(contractAddress, wallet) {
  const all = read(TERMS_FILE, {});
  if (all[contractAddress]) delete all[contractAddress][wallet];
  writePrivate(TERMS_FILE, all);
}

// ---------------------------------------------------------------------------
// Deployments
// ---------------------------------------------------------------------------

export function deployments() {
  return read(DEPLOYMENTS_FILE, []);
}

export function recordDeployment(entry) {
  const all = deployments().filter((d) => d.address !== entry.address);
  all.push(entry);
  writeFileSync(DEPLOYMENTS_FILE, JSON.stringify(all, null, 2) + "\n");
  return entry;
}

/** Adds a token (domain) to a deployment's list, e.g. after a mint under a new domain. */
export function recordToken(address, token) {
  const all = deployments();
  const d = all.find((x) => x.address === address);
  if (!d) return;
  d.tokens = (d.tokens ?? []).filter((t) => t.domain !== token.domain);
  d.tokens.push(token);
  writeFileSync(DEPLOYMENTS_FILE, JSON.stringify(all, null, 2) + "\n");
}
