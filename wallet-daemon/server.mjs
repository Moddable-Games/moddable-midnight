// The Moddable wallet daemon: one long-lived process holding the organiser's wallet and the
// three agents' wallets, for a browser UI to drive.
//
// Why this exists instead of `midnight serve`: that serves one wallet per process, re-syncs
// for minutes on every start, and approves writes only on a terminal (friction log finding
// 41). Here every wallet syncs once, state is saved every minute so restarts take seconds,
// and every write waits in a queue until a human approves it in the browser.
//
//   node wallet-daemon/server.mjs          then open the wallet UI on http://localhost:5173
//
// Listens on 127.0.0.1 only, and answers only the wallet UI's origin, so another website
// open in the same browser cannot drive it.
import http from "node:http";
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import * as ledger from "@midnight-ntwrk/ledger-v8";
import { MidnightBech32m, UnshieldedAddress } from "@midnight-ntwrk/wallet-sdk-address-format";
import { openWallet, isUsable, saveState, PREVIEW } from "./wallet.mjs";

const PORT = 9900;
const ALLOWED_ORIGINS = new Set(["http://localhost:5173", "http://127.0.0.1:5173"]);
const NIGHT = "0".repeat(64);
const STAR_PER_NIGHT = 1_000_000n;
const REQUESTS_FILE = new URL("./state/requests.json", import.meta.url).pathname;

const ROSTER = [
  { wallet: "moddable-preview", name: "Organiser", kind: "human", role: "Treasury. Deploys the contracts and funds the crew." },
  { wallet: "agent-floyd", name: "Floyd", kind: "agent", role: "Hacker, crew boss in Midnight City.", agentId: "user-agent-u4gfp92xeor3g2a" },
  { wallet: "agent-tzilo", name: "Tzilo", kind: "agent", role: "Miner in Midnight City.", agentId: "user-agent-5wzs7d9q4cdz5gi" },
  { wallet: "agent-foofoo", name: "FooFoo", kind: "agent", role: "Lumberjack in Midnight City.", agentId: "user-agent-oyhuxtu984deja8" },
];

// ---------------------------------------------------------------------------------------
// Wallets
// ---------------------------------------------------------------------------------------

const wallets = new Map(); // wallet name -> { ...roster, handle, state, ready, error }

async function startWallet(entry) {
  const record = { ...entry, status: "opening" };
  wallets.set(entry.wallet, record);
  try {
    const handle = await openWallet(entry.wallet);
    record.handle = handle;
    record.address = handle.address;
    record.restoredFrom = handle.restoredFrom;
    record.status = "syncing";
    handle.facade.state().subscribe((state) => {
      record.state = state;
      record.ready = isUsable(state);
      const p = state.shielded?.state?.progress;
      record.shieldedProgress = p ? { applied: Number(p.appliedIndex ?? 0), target: Number(p.highestRelevantWalletIndex ?? 0) } : null;
      // Sending NIGHT only needs unshielded and DUST ("lite", as the CLI's own transfer uses).
      record.status = record.ready.unshielded && record.ready.dust ? "ready" : "syncing";
    });
    setInterval(() => saveState(handle).catch((e) => console.error(`${entry.name}: save failed: ${e.message}`)), 60_000);
    console.log(`${entry.name}: opened (${handle.restored ? "resumed from " + handle.restoredFrom : "fresh sync"})`);
  } catch (error) {
    record.status = "error";
    record.error = error.message;
    console.error(`${entry.name}: ${error.message}`);
  }
}

function summary(record) {
  const s = record.state;
  let dust = null;
  try { dust = s ? s.dust.balance(new Date()).toString() : null; } catch { /* not yet */ }
  return {
    wallet: record.wallet,
    name: record.name,
    kind: record.kind,
    role: record.role,
    agentId: record.agentId ?? null,
    address: record.address ?? null,
    status: record.status,
    error: record.error ?? null,
    restoredFrom: record.restoredFrom ?? null,
    night: s ? (s.unshielded.balances[NIGHT] ?? 0n).toString() : null,
    dust,
    sync: record.ready ?? null,
    shieldedProgress: record.shieldedProgress ?? null,
  };
}

// ---------------------------------------------------------------------------------------
// Requests: every write waits here until a human approves it
// ---------------------------------------------------------------------------------------

const requests = loadRequests();

function loadRequests() {
  try { return existsSync(REQUESTS_FILE) ? JSON.parse(readFileSync(REQUESTS_FILE, "utf8")) : []; } catch { return []; }
}
function saveRequests() {
  mkdirSync(new URL("./state/", import.meta.url).pathname, { recursive: true });
  writeFileSync(REQUESTS_FILE, JSON.stringify(requests.slice(-200), null, 2));
}

function parseNight(text) {
  const [whole, frac = ""] = String(text).trim().split(".");
  if (!/^\d+$/.test(whole) || !/^\d{0,6}$/.test(frac)) throw new Error("amount must be NIGHT with up to 6 decimals");
  const star = BigInt(whole) * STAR_PER_NIGHT + BigInt(frac.padEnd(6, "0"));
  if (star <= 0n) throw new Error("amount must be positive");
  return star;
}

function createRequest({ wallet, kind, to, amount, requestedBy, note }) {
  if (!wallets.has(wallet)) throw new Error(`unknown wallet ${wallet}`);
  if (kind !== "transfer") throw new Error(`unsupported request kind ${kind}`);
  MidnightBech32m.parse(to).decode(UnshieldedAddress, PREVIEW.networkId); // validate now, not at approval
  const request = {
    id: randomUUID(),
    wallet, kind, to,
    amount: parseNight(amount).toString(),
    requestedBy: requestedBy ?? "browser",
    note: note ?? "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  requests.push(request);
  saveRequests();
  console.log(`request ${request.id.slice(0, 8)}: ${wallet} -> ${to.slice(0, 22)}… ${Number(request.amount) / 1e6} NIGHT (pending approval)`);
  return request;
}

async function execute(request) {
  const record = wallets.get(request.wallet);
  if (record?.status !== "ready") throw new Error(`${record?.name ?? request.wallet} is still syncing`);
  const { facade, zswapKeys, dustKey, keystore } = record.handle;
  const receiverAddress = MidnightBech32m.parse(request.to).decode(UnshieldedAddress, PREVIEW.networkId);
  request.status = "building";
  const recipe = await facade.transferTransaction(
    [{ type: "unshielded", outputs: [{ amount: BigInt(request.amount), receiverAddress, type: ledger.unshieldedToken().raw }] }],
    { shieldedSecretKeys: zswapKeys, dustSecretKey: dustKey },
    { ttl: new Date(Date.now() + 30 * 60_000), payFees: true },
  );
  request.status = "signing";
  const signed = await facade.signRecipe(recipe, (data) => keystore.signData(data));
  request.status = "proving";
  const finalized = await facade.finalizeRecipe(signed);
  request.status = "submitting";
  // submitTransaction returns a transaction identifier, not the hash explorers use.
  request.txId = await facade.submitTransaction(finalized);
  request.status = "submitted";
  request.completedAt = new Date().toISOString();
  confirm(request);
}

/** Wait for the chain to show the transaction, and record its real hash and block. */
async function confirm(request) {
  const query = `{ transactions(offset: {identifier: "${request.txId}"}) { hash block { height } } }`;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const res = await fetch(PREVIEW.indexer, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
      const found = (await res.json()).data?.transactions?.[0];
      if (found) {
        request.txHash = found.hash;
        request.block = found.block?.height ?? null;
        request.status = "confirmed";
        saveRequests();
        console.log(`request ${request.id.slice(0, 8)}: confirmed in block ${request.block}, hash ${found.hash}`);
        return;
      }
    } catch { /* keep trying */ }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

async function decide(id, approve) {
  const request = requests.find((r) => r.id === id);
  if (!request) throw new Error("no such request");
  if (request.status !== "pending") throw new Error(`request is already ${request.status}`);
  if (!approve) {
    request.status = "rejected";
    request.decidedAt = new Date().toISOString();
    saveRequests();
    return request;
  }
  request.status = "approved";
  request.decidedAt = new Date().toISOString();
  saveRequests();
  // Proving takes a while; answer now and let the browser watch the status change.
  execute(request)
    .catch((error) => { request.status = "failed"; request.error = error.message; })
    .finally(() => { saveRequests(); console.log(`request ${id.slice(0, 8)}: ${request.status}${request.txId ? " " + request.txId : ""}${request.error ? " (" + request.error + ")" : ""}`); });
  return request;
}

// ---------------------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------------------

function send(res, status, body, origin) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > 64_000) throw new Error("request too large"); }
  return raw ? JSON.parse(raw) : {};
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin ?? "";
  // Only the wallet UI may talk to this. No origin at all (curl, local tools) is allowed for
  // reads only, so the daemon can be inspected but not driven from outside the page.
  const fromUI = ALLOWED_ORIGINS.has(origin);
  if (origin && !fromUI) return send(res, 403, { error: "origin not allowed" }, "null");
  if (req.method === "OPTIONS") return send(res, 204, {}, origin);
  const url = new URL(req.url, "http://localhost");
  try {
    if (req.method === "GET" && url.pathname === "/api/wallets") {
      return send(res, 200, [...wallets.values()].map(summary), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/requests") {
      return send(res, 200, [...requests].reverse(), origin);
    }
    if (!fromUI) return send(res, 403, { error: "writes are only accepted from the wallet UI" }, "null");
    if (req.method === "POST" && url.pathname === "/api/requests") {
      return send(res, 201, createRequest(await readBody(req)), origin);
    }
    const match = url.pathname.match(/^\/api\/requests\/([0-9a-f-]{36})\/(approve|reject)$/);
    if (req.method === "POST" && match) {
      return send(res, 200, await decide(match[1], match[2] === "approve"), origin);
    }
    return send(res, 404, { error: "not found" }, origin);
  } catch (error) {
    return send(res, 400, { error: error.message }, origin);
  }
});

server.listen(PORT, "127.0.0.1", () => console.log(`wallet daemon on http://127.0.0.1:${PORT}`));

// Open wallets one after another: in parallel they compete for the same indexer.
for (const entry of ROSTER) await startWallet(entry);
