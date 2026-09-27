// Who the daemon holds wallets for. roster.json is public (names, roles, no keys); each
// wallet's seed lives in ~/.midnight/wallets/<wallet>.json, the wallet CLI's own format.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { HDWallet, Roles } from "@midnight-ntwrk/wallet-sdk-hd";
import { createKeystore } from "@midnight-ntwrk/wallet-sdk-unshielded-wallet";
import { PREVIEW } from "./wallet.mjs";

const ROSTER_FILE = new URL("./roster.json", import.meta.url).pathname;
const WALLETS_DIR = join(homedir(), ".midnight", "wallets");

export const roster = () => JSON.parse(readFileSync(ROSTER_FILE, "utf8"));

const save = (list) => writeFileSync(ROSTER_FILE, JSON.stringify(list, null, 2) + "\n");

/** The operator: the one account holding the master key (roster flag `operator`). */
export function operatorWallet() {
  const list = roster();
  const op = list.find((e) => e.operator) ?? list.find((e) => e.kind === "human" && !e.archived);
  if (!op) throw new Error("no operator account");
  return op.wallet;
}

/**
 * A new wallet: a fresh 32-byte seed in the wallet CLI's file format (the CLI accepts 32-byte
 * seeds with --seed), then a roster entry. The seed never leaves the wallet file.
 *   kind "agent"   an AI agent, under agent policy
 *   kind "human"   a person's account, for a purpose ("Payroll", "Grants", ...)
 */
export function createWallet({ name, role, kind = "agent", operator = false }) {
  const clean = String(name ?? "").trim();
  if (!/^[A-Za-z][A-Za-z0-9 ]{1,23}$/.test(clean)) throw new Error("name: 2 to 24 letters, digits or spaces, starting with a letter");
  const prefix = kind === "agent" ? "agent" : "account";
  const wallet = `${prefix}-${clean.toLowerCase().replace(/\s+/g, "-")}`;
  const list = roster();
  if (list.some((e) => e.wallet === wallet)) throw new Error(`${clean} already exists`);
  const file = join(WALLETS_DIR, `${wallet}.json`);
  if (existsSync(file)) throw new Error(`a wallet file for ${wallet} already exists`);

  const seed = randomBytes(32);
  const hd = HDWallet.fromSeed(seed);
  if (hd.type !== "seedOk") throw new Error("seed rejected");
  const key = hd.hdWallet.selectAccount(0).selectRole(Roles.NightExternal).deriveKeyAt(0);
  if (key.type === "keyOutOfBounds") throw new Error("key derivation out of bounds");
  const address = createKeystore(key.key, PREVIEW.networkId).getBech32Address().asString();

  mkdirSync(WALLETS_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(file, JSON.stringify({ seed: seed.toString("hex"), addresses: { preview: address }, createdAt: new Date().toISOString() }, null, 2), { mode: 0o600 });

  const entry = {
    wallet, name: clean, kind,
    role: String(role ?? "").slice(0, 120) || (kind === "agent" ? "AI agent" : "Account"),
    ...(operator ? { operator: true } : {}),
    createdAt: new Date().toISOString(),
  };
  save([...list, entry]);
  return { ...entry, address };
}

export const createAgent = (input) => createWallet({ ...input, kind: "agent" });

/** On a first start with no operator, make one, so the app always has a master key. */
export function ensureOperator() {
  const list = roster();
  if (list.some((e) => e.operator)) return null;
  const human = list.find((e) => e.kind === "human" && !e.archived);
  if (human) { human.operator = true; save(list); return human.wallet; }
  return createWallet({ name: "Operator", role: "Holds the master key.", kind: "human", operator: true }).wallet;
}

/** Marks a wallet archived: it stays in the roster (its keys are never deleted) but is hidden. */
export function archiveWallet(wallet) {
  const list = roster();
  const e = list.find((x) => x.wallet === wallet);
  if (!e) throw new Error(`unknown wallet ${wallet}`);
  if (e.operator) throw new Error("the operator cannot be removed");
  e.archived = true;
  e.archivedAt = new Date().toISOString();
  save(list);
  return e;
}
