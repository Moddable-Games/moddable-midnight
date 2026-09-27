// Publishes the token contracts and their on-chain run for the site's Tokens page:
// wallet-daemon/deployments.json and notes/token-lab-run.json -> web/public/data/token-lab.json.
// Only public facts: addresses, blocks, transaction hashes. The page reads live state itself.
//   node scripts/build-token-data.mjs
import { readFileSync, writeFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const deployments = read("../wallet-daemon/deployments.json");
const policy = read("../wallet-daemon/agent-policy.json");
const run = read("../notes/token-lab-run.json");

// The latest confirmed attempt per step (a step retried after a fix keeps its failure in notes/).
const steps = new Map();
for (const r of run) if (r.status === "confirmed") steps.set(r.step, { step: r.step, label: r.label, txHash: r.txHash, block: r.block });

const out = {
  generatedAt: new Date().toISOString(),
  deployments: deployments.map((d) => ({ address: d.address, standard: d.standard, name: d.name, symbol: d.symbol, domain: d.domain, block: d.block, txHash: d.txHash })),
  treasuryV3: policy.crewTreasuryV3,
  run: [...steps.values()].sort((a, b) => a.step - b.step),
};
writeFileSync(new URL("../web/public/data/token-lab.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`${out.deployments.length} contracts, ${out.run.length} confirmed steps`);
