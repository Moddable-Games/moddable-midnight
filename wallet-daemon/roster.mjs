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

/**
 * A new agent: a fresh 32-byte seed in the CLI's wallet format (the CLI accepts 32-byte seeds
 * with --seed), then an entry in the roster. The seed never leaves the wallet file.
 */
export function createAgent({ name, role }) {
  const clean = String(name ?? "").trim();
  if (!/^[A-Za-z][A-Za-z0-9 ]{1,23}$/.test(clean)) throw new Error("name: 2 to 24 letters, digits or spaces, starting with a letter");
  const wallet = `agent-${clean.toLowerCase().replace(/\s+/g, "-")}`;
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

  const entry = { wallet, name: clean, kind: "agent", role: String(role ?? "").slice(0, 120) || "AI agent", createdAt: new Date().toISOString() };
  save([...list, entry]);
  return { ...entry, address };
}
