// Auto-replier, called by run-crew.sh once per agent per loop, while that agent is connected.
// 1) Reply to every open thread waiting on us (in-thread replies).
// 2) Otherwise send one queued late reply (starts a new thread; rate limited per agent).
// Usage: node reply.mjs <agentId> <persona>
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { replyFor } from "./reply-templates.mjs";

const HOME = path.join(os.homedir(), ".midnight-city");
const SKILL = path.join(HOME, "agent-skill");
const QUEUE = path.join(HOME, "reply-queue.json");
const STATE = path.join(HOME, "reply-state.json");
const BACKOFF_MS = 5 * 60 * 1000;   // after "rate limited", leave that agent's queue alone
const MAX_OUR_TURNS = 2;            // after this many replies in one thread, sign off

const [agentId, persona] = process.argv.slice(2);

const readJson = (f, dflt) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return dflt; } };
const writeJson = (f, v) => { fs.writeFileSync(f + ".tmp", JSON.stringify(v, null, 1)); fs.renameSync(f + ".tmp", f); };
const mc = (...args) => JSON.parse(execFileSync("node", ["scripts/mcity-control.mjs", ...args], { cwd: SKILL, encoding: "utf8" }));
const log = (msg) => console.log(`${new Date().toTimeString().slice(0, 8)} ${persona}: REPLY ${msg}`);

function speak(target, text) {
  try {
    const o = mc("speak", target, text).outcome || {};
    return o.status === "delivered" ? "delivered" : (o.reason || o.status || "unknown");
  } catch (e) {
    return "error " + String(e.message).split("\n")[0].slice(0, 100);
  }
}

const state = readJson(STATE, {});
const mine = state[persona] || (state[persona] = { signedOff: [], backoffUntil: 0 });

// 1) open threads waiting on us
const threads = mc("threads").threads || [];
const pending = threads.filter(t => t.threadStatus === "open" && t.pendingRecipientAgentId === agentId);
for (const t of pending) {
  const other = t.initiatorAgentId === agentId ? t.recipientAgentId : t.initiatorAgentId;
  const ourTurns = t.initiatorAgentId === agentId ? t.initiatorMessageCount : t.recipientMessageCount;
  if (mine.signedOff.includes(t.threadId)) continue;
  const signoff = (ourTurns || 0) >= MAX_OUR_TURNS;
  const result = speak(other, replyFor(persona, t.latestMessagePreview, { signoff }));
  if (signoff && result === "delivered") mine.signedOff.push(t.threadId);
  log(`${signoff ? "signoff" : "thread"} ${other.slice(-10)} ${result}`);
}

// 2) one queued late reply, unless we are backing off
const queue = readJson(QUEUE, {});
const q = queue[persona] || [];
if (!pending.length && q.length && Date.now() > mine.backoffUntil) {
  const item = q[0];
  const result = speak(item.target, item.text);
  if (result === "delivered") q.shift();
  else if (/rate limited/i.test(result)) mine.backoffUntil = Date.now() + BACKOFF_MS;
  else q.push(q.shift()); // other failure: rotate so one bad item cannot block the rest
  queue[persona] = q;
  writeJson(QUEUE, queue);
  log(`queued ${item.target.slice(-10)} ${result} (${q.length} left)`);
}

mine.signedOff = mine.signedOff.slice(-500);
writeJson(STATE, state);
