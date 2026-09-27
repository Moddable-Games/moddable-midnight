// The operator's chat with the assistant that runs this wallet, and the CLI the assistant uses.
//
// The page posts messages to the daemon. An assistant session on this machine, watching the
// repo, waits for them with `chat.mjs wait`, does the work, and answers
// with `chat.mjs reply`, linking any requests it queued so the page can show their progress.
// While nobody is watching, messages wait; the page says so, from the assistant's heartbeat.
//
//   node wallet-daemon/chat.mjs wait                       block until an operator message; print it
//   node wallet-daemon/chat.mjs watch                      keep the heartbeat and print each new operator message once
//   node wallet-daemon/chat.mjs reply "text" [--requests id,id] [--status working|done]
//   node wallet-daemon/chat.mjs history [n]                the last n messages
//
// Messages live in state/chat.json. This module is also imported by server.mjs.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";

const STATE_DIR = new URL("./state/", import.meta.url).pathname;
const FILE = STATE_DIR + "chat.json";
const DAEMON = "http://127.0.0.1:9900";
const ORIGIN = "http://localhost:5173";
const ONLINE_MS = 3 * 60_000;

const read = () => { try { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : { messages: [], heartbeat: null }; } catch { return { messages: [], heartbeat: null }; } };
const write = (doc) => { mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 }); writeFileSync(FILE, JSON.stringify(doc, null, 2), { mode: 0o600 }); };

// ---------------------------------------------------------------------------
// Store (used by the daemon)
// ---------------------------------------------------------------------------

export function chatState() {
  const doc = read();
  const online = Boolean(doc.heartbeat && Date.now() - Date.parse(doc.heartbeat) < ONLINE_MS);
  return { messages: doc.messages.slice(-100), assistant: { online, lastSeen: doc.heartbeat } };
}

export function addMessage({ from, text, requests = [], status = null }) {
  const clean = String(text ?? "").trim();
  if (!clean) throw new Error("message is empty");
  if (clean.length > 4000) throw new Error("message is over 4,000 characters");
  if (!["operator", "assistant"].includes(from)) throw new Error("unknown sender");
  const doc = read();
  const message = { id: randomUUID(), from, text: clean, requests: requests.filter((r) => /^[0-9a-f-]{36}$/.test(r)), status, at: new Date().toISOString() };
  doc.messages.push(message);
  if (from === "assistant") doc.heartbeat = message.at;
  write(doc);
  return message;
}

export function heartbeat() {
  const doc = read();
  doc.heartbeat = new Date().toISOString();
  write(doc);
}

// ---------------------------------------------------------------------------
// CLI (used by the assistant)
// ---------------------------------------------------------------------------

async function post(path, body) {
  const res = await fetch(DAEMON + path, { method: "POST", headers: { "content-type": "application/json", origin: ORIGIN }, body: JSON.stringify(body) });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out.error ?? `HTTP ${res.status}`);
  return out;
}

async function cli(args) {
  const [command, ...rest] = args;
  if (command === "wait") {
    // Answer everything since the assistant last spoke.
    for (;;) {
      await post("/api/chat/heartbeat", {});
      const { messages } = await (await fetch(DAEMON + "/api/chat")).json();
      const lastReply = messages.findLastIndex((m) => m.from === "assistant");
      const waiting = messages.slice(lastReply + 1).filter((m) => m.from === "operator");
      if (waiting.length) {
        for (const m of waiting) console.log(`[${m.at}] operator: ${m.text}`);
        return;
      }
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  if (command === "watch") {
    const seen = new Set((await (await fetch(DAEMON + "/api/chat")).json()).messages.map((m) => m.id));
    for (;;) {
      try {
        await post("/api/chat/heartbeat", {});
        const { messages } = await (await fetch(DAEMON + "/api/chat")).json();
        for (const m of messages) {
          if (seen.has(m.id)) continue;
          seen.add(m.id);
          if (m.from === "operator") console.log(`chat ${m.id}: ${m.text.replace(/\s+/g, " ")}`);
        }
      } catch { /* daemon restarting; try again */ }
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  if (command === "reply") {
    const text = rest[0];
    const flag = (name) => (rest.includes(name) ? rest[rest.indexOf(name) + 1] : null);
    const requests = (flag("--requests") ?? "").split(",").filter(Boolean);
    const message = await post("/api/chat/reply", { text, requests, status: flag("--status") });
    console.log(`sent ${message.id}`);
    return;
  }
  if (command === "history") {
    const { messages } = await (await fetch(DAEMON + "/api/chat")).json();
    for (const m of messages.slice(-Number(rest[0] ?? 20))) console.log(`[${m.at}] ${m.from}: ${m.text}`);
    return;
  }
  console.error("usage: chat.mjs wait | reply \"text\" [--requests id,id] [--status working|done] | history [n]");
  process.exit(2);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  cli(process.argv.slice(2)).catch((e) => { console.error(e.message); process.exit(1); });
}
