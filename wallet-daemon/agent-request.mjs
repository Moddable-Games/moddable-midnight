// What an agent runs to ask the daemon for a spend. The daemon decides, from the agent's
// policy, whether it runs at once or waits for the organiser.
//
//   node wallet-daemon/agent-request.mjs <agent wallet> transfer <to address> <NIGHT> [note]
//   node wallet-daemon/agent-request.mjs <agent wallet> draw [note]
//   node wallet-daemon/agent-request.mjs <agent wallet> list
//
// The token is read from the daemon's state dir, as an agent on this machine would.
import { readFileSync } from "node:fs";

const DAEMON = "http://127.0.0.1:9900";
const [wallet, kind, ...rest] = process.argv.slice(2);
if (!wallet || !["transfer", "draw", "list"].includes(kind)) {
  console.error("usage: agent-request.mjs <agent wallet> transfer <to> <NIGHT> [note] | draw [note] | list");
  process.exit(2);
}
const tokens = JSON.parse(readFileSync(new URL("./state/agent-tokens.json", import.meta.url), "utf8"));
const headers = { authorization: `Bearer ${tokens[wallet]}`, "content-type": "application/json" };

if (kind === "list") {
  const res = await fetch(`${DAEMON}/api/agent/requests`, { headers });
  for (const r of await res.json()) console.log(`${r.createdAt}  ${r.kind} ${r.circuit ?? ""}  ${r.status}  ${r.policy ?? ""}`);
  process.exit(0);
}

const body = kind === "draw"
  ? { kind, note: rest[0] }
  : { kind, to: rest[0], amount: rest[1], note: rest[2] };
const res = await fetch(`${DAEMON}/api/agent/requests`, { method: "POST", headers, body: JSON.stringify(body) });
const out = await res.json();
if (!res.ok) { console.error(out.error); process.exit(1); }
console.log(`${out.status}${out.autoApproved ? " (auto-approved)" : ""}: ${out.policy}`);
console.log(out.id);
