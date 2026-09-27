// Runs every token operation once on preview through the wallet daemon, approving each as the
// operator, and records the outcome (transaction hash and block) in notes/token-lab-run.json.
//
//   node scripts/token-lab-run.mjs            all steps
//   node scripts/token-lab-run.mjs 12         from step 12 (after a failure)
//
// Each step is an ordinary daemon request, so it also appears in the wallet app's Activity.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const DAEMON = "http://127.0.0.1:9900";
const ORIGIN = "http://localhost:5173";
const OUT = new URL("../notes/token-lab-run.json", import.meta.url).pathname;

const deployments = JSON.parse(readFileSync(new URL("../wallet-daemon/deployments.json", import.meta.url), "utf8"));
const at = (standard) => deployments.find((d) => d.standard === standard);
const NU = at("native_unshielded");
const NS = at("native_shielded");
const CT = at("contract_token");
const PL = at("private_ledger");
const hexOf = (label) => { const b = Buffer.alloc(32); b.write(label); return b.toString("hex"); };

const tokenAction = (body) => ["/api/token-actions", body];
const treasury = (body) => ["/api/treasury-v3", body];
const agent = (wallet, step, body) => [`/api/agents/${wallet}/${step}`, body];

const STEPS = [
  ["MIP-0014 fungible mint to Floyd", tokenAction({ action: "mint", contractAddress: NU.address, domain: NU.domain, to: "agent-floyd", amount: "1000" })],
  ["MIP-0014 NFT to Tzilo", tokenAction({ action: "mint", contractAddress: NU.address, nft: true, serial: "Founder badge 1", to: "agent-tzilo" })],
  ["MIP-0011 fungible mint to Floyd", tokenAction({ action: "mint", contractAddress: NS.address, domain: NS.domain, to: "agent-floyd", amount: "500" })],
  ["MIP-0011 fungible mint to the organiser (for the burn)", tokenAction({ action: "mint", contractAddress: NS.address, domain: NS.domain, to: "moddable-preview", amount: "100" })],
  ["MIP-0011 NFT to FooFoo", tokenAction({ action: "mint", contractAddress: NS.address, nft: true, serial: "Relic 1", to: "agent-foofoo" })],
  ["MIP-0011 burn 10 through the contract", tokenAction({ action: "burn", contractAddress: NS.address, domainHex: hexOf(NS.domain), amount: "10" })],
  ["MIP-0004 mint 1000 to the organiser's account", tokenAction({ action: "mint", contractAddress: CT.address, to: "moddable-preview", amount: "1000" })],
  ["MIP-0004 NFT to the organiser", tokenAction({ action: "mint", contractAddress: CT.address, nft: true, serial: "Deed 1", to: "moddable-preview" })],
  ["MIP-0004 transfer 25 to Floyd's account", tokenAction({ action: "transfer", contractAddress: CT.address, domainHex: hexOf(CT.domain), to: "agent-floyd", amount: "25", wallet: "moddable-preview" })],
  ["MIP-0004 shield 100 (balance to shielded coin)", tokenAction({ action: "convert", direction: "toShielded", contractAddress: CT.address, domainHex: hexOf(CT.domain), amount: "100" })],
  ["MIP-0004 toUtxo 100 (balance to unshielded UTXO)", tokenAction({ action: "convert", direction: "toUnshielded", contractAddress: CT.address, domainHex: hexOf(CT.domain), amount: "100" })],
  ["MIP-0004 unshield 50 (shielded coin back to balance)", tokenAction({ action: "convert", direction: "fromShielded", contractAddress: CT.address, domainHex: hexOf(CT.domain), amount: "50" })],
  ["MIP-0004 fromUtxo 50 (unshielded UTXO back to balance)", tokenAction({ action: "convert", direction: "fromUnshielded", contractAddress: CT.address, domainHex: hexOf(CT.domain), amount: "50" })],
  ["Kind 3 mint 1000 to the organiser", tokenAction({ action: "mint", contractAddress: PL.address, to: "moddable-preview", amount: "1000" })],
  ["Kind 3 NFT to the organiser", tokenAction({ action: "mint", contractAddress: PL.address, nft: true, serial: "Seal 1", to: "moddable-preview" })],
  ["Kind 3 private transfer 200 to Floyd", tokenAction({ action: "transfer", contractAddress: PL.address, domainHex: hexOf(PL.domain), to: "agent-floyd", amount: "200", wallet: "moddable-preview" })],
  ["Kind 3 toUtxo 100", tokenAction({ action: "convert", direction: "toUnshielded", contractAddress: PL.address, domainHex: hexOf(PL.domain), amount: "100" })],
  ["Kind 3 fromUtxo 50", tokenAction({ action: "convert", direction: "fromUnshielded", contractAddress: PL.address, domainHex: hexOf(PL.domain), amount: "50" })],
  ["Kind 3 toShielded 100", tokenAction({ action: "convert", direction: "toShielded", contractAddress: PL.address, domainHex: hexOf(PL.domain), amount: "100" })],
  ["Kind 3 fromShielded 50", tokenAction({ action: "convert", direction: "fromShielded", contractAddress: PL.address, domainHex: hexOf(PL.domain), amount: "50" })],
  ["MIP-0018 name for the MIP-0014 token", tokenAction({ action: "metadata", contractAddress: NU.address, domainHex: hexOf(NU.domain), kind: 0, key: "name", valType: "string", value: "Moddable Credits" })],
  ["MIP-0018 name for the MIP-0011 token", tokenAction({ action: "metadata", contractAddress: NS.address, domainHex: hexOf(NS.domain), kind: 1, key: "name", valType: "string", value: "Moddable Shards" })],
  ["MIP-0018 name for the MIP-0004 balance (kind 2)", tokenAction({ action: "metadata", contractAddress: CT.address, domainHex: hexOf(CT.domain), kind: 2, key: "name", valType: "string", value: "Moddable Contract Token" })],
  ["MIP-0018 decimals for the MIP-0004 token", tokenAction({ action: "metadata", contractAddress: CT.address, domainHex: hexOf(CT.domain), kind: 2, key: "decimals", valType: "integer", value: "0" })],
  ["MIP-0018 name for the kind-3 token", tokenAction({ action: "metadata", contractAddress: PL.address, domainHex: hexOf(PL.domain), kind: 3, key: "name", valType: "string", value: "Moddable Veil" })],
  ["v3: mint 1,000,000 MCC into the treasury", treasury({ action: "mint", amount: "1000000" })],
  ["v3: open period 2026-09-27", treasury({ action: "openPeriod", period: "2026-09-27" })],
  ["v3: appoint Floyd (cap 100 a draw, 3 draws a period)", agent("agent-floyd", "appoint", { capPerDraw: "100", drawsPerPeriod: "3" })],
  ["v3: appoint Tzilo (cap 50, 1 draw)", agent("agent-tzilo", "appoint", { capPerDraw: "50", drawsPerPeriod: "1" })],
  ["v3: appoint FooFoo (cap 50, 2 draws)", agent("agent-foofoo", "appoint", { capPerDraw: "50", drawsPerPeriod: "2" })],
];

async function post(path, body) {
  const res = await fetch(DAEMON + path, { method: "POST", headers: { "content-type": "application/json", origin: ORIGIN }, body: JSON.stringify(body ?? {}) });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error ?? `HTTP ${res.status}`);
  return out;
}

async function outcome(id) {
  for (;;) {
    await new Promise((r) => setTimeout(r, 4000));
    const all = await (await fetch(DAEMON + "/api/requests")).json();
    const r = all.find((x) => x.id === id);
    if (["confirmed", "failed", "rejected"].includes(r.status)) return r;
  }
}

const record = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : [];
const from = Number(process.argv[2] ?? 1);
for (let i = from - 1; i < STEPS.length; i++) {
  const [label, [path, body]] = STEPS[i];
  const started = Date.now();
  const queued = await post(path, body);
  await post(`/api/requests/${queued.id}/approve`);
  const r = await outcome(queued.id);
  const line = { step: i + 1, label, status: r.status, circuit: r.circuit ?? r.kind, contract: r.contractAddress, txHash: r.txHash ?? null,
    block: r.block ?? null, chainStatus: r.chainStatus ?? null, error: r.error ?? null, seconds: Math.round((Date.now() - started) / 1000), at: new Date().toISOString() };
  record.push(line);
  writeFileSync(OUT, JSON.stringify(record, null, 2) + "\n");
  console.log(`${String(i + 1).padStart(2)}. ${r.status.padEnd(9)} ${label}${r.block ? ` (block ${r.block})` : ""}${r.error ? `: ${r.error.split("\n")[0]}` : ""}`);
  if (r.status !== "confirmed") process.exit(1);
}
console.log("all steps confirmed");
