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
import { deploy, call, mandateCommitment } from "./deploy.mjs";
import { verifiedMetadata } from "./metadata.mjs";
import { ensureAgentTokens, agentForToken, evaluate, crewTreasury } from "./agents.mjs";

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

const wallets = new Map(ROSTER.map((entry) => [entry.wallet, { ...entry, status: "queued" }]));

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
    // Shielded tokens are visible only to their holder, so they come from the wallet, not the
    // public indexer. Token type (hex) -> amount.
    shielded: s ? Object.fromEntries(Object.entries(s.shielded.balances ?? {}).map(([t, v]) => [t, v.toString()])) : null,
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

function createRequest({ wallet, kind, to, amount, contract, contractAddress, circuit, args, requestedBy, note }) {
  if (!wallets.has(wallet)) throw new Error(`unknown wallet ${wallet}`);
  if (!["transfer", "deploy", "call"].includes(kind)) throw new Error(`unsupported request kind ${kind}`);
  if (kind === "transfer") MidnightBech32m.parse(to).decode(UnshieldedAddress, PREVIEW.networkId); // validate now
  if (kind !== "transfer" && !/^[a-z0-9_]+$/.test(contract ?? "")) throw new Error("contract must be a compiled contract name");
  if (kind === "call" && (!contractAddress || !circuit)) throw new Error("a call needs contractAddress and circuit");
  const request = {
    id: randomUUID(),
    wallet, kind,
    to: to ?? null,
    amount: kind === "transfer" ? parseNight(amount).toString() : null,
    contract: contract ?? null,
    contractAddress: contractAddress ?? null,
    circuit: circuit ?? null,
    args: args ?? [],
    requestedBy: requestedBy ?? "browser",
    note: note ?? "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  requests.push(request);
  saveRequests();
  console.log(`request ${request.id.slice(0, 8)}: ${describe(request)} (pending approval)`);
  return request;
}

function describe(r) {
  if (r.kind === "transfer") return `${r.wallet} -> ${r.to.slice(0, 22)}… ${Number(r.amount) / 1e6} NIGHT`;
  if (r.kind === "deploy") return `${r.wallet} deploys ${r.contract}`;
  return `${r.wallet} calls ${r.contract}.${r.circuit}`;
}

/**
 * JSON cannot carry bigints or addresses; arguments arrive tagged and are converted here.
 * `coinPublicKeyOf` names a daemon wallet that will receive shielded coins from the call, so
 * it is added to `recipients` and its encryption key goes with the call. `mandateOf` is that
 * agent's mandate commitment, computed locally from its own secret.
 */
async function coerce(arg, request, recipients) {
  if (arg && typeof arg === "object") {
    if ("coinPublicKeyOf" in arg) {
      const target = wallets.get(arg.coinPublicKeyOf);
      if (!target?.handle) throw new Error(`${arg.coinPublicKeyOf} is not open in the daemon`);
      recipients.push(target.handle);
      return { bytes: Uint8Array.from(Buffer.from(target.handle.zswapKeys.coinPublicKey, "hex")) };
    }
    if ("mandateOf" in arg) {
      if (!wallets.has(arg.mandateOf)) throw new Error(`unknown wallet ${arg.mandateOf}`);
      return mandateCommitment(arg.mandateOf, request.contractAddress);
    }
    if ("uint" in arg) return BigInt(arg.uint);
    if ("userAddress" in arg) {
      const address = MidnightBech32m.parse(arg.userAddress).decode(UnshieldedAddress, PREVIEW.networkId);
      return { bytes: new Uint8Array(address.data) };
    }
    if ("bytes" in arg) return Uint8Array.from(Buffer.from(arg.bytes, "hex"));
  }
  return arg;
}

async function execute(request) {
  const record = wallets.get(request.wallet);
  if (request.kind !== "transfer") {
    // Contract work balances shielded as well as unshielded, so it needs the full sync.
    if (!record?.ready?.all) throw new Error(`${record?.name ?? request.wallet} has not finished its full sync yet`);
    const onPhase = (phase, txId) => {
      request.status = phase;
      if (txId) { request.txId = txId; saveRequests(); }
    };
    const recipients = [];
    const args = [];
    for (const arg of request.args) args.push(await coerce(arg, request, recipients));
    const out = request.kind === "deploy"
      ? await deploy(record.handle, request.contract, { args, onPhase })
      : await call(record.handle, request.contract, request.contractAddress, request.circuit, args, { onPhase, recipients });
    Object.assign(request, {
      contractAddress: out.contractAddress ?? request.contractAddress,
      txId: out.txId, txHash: out.txHash, block: out.block, chainStatus: out.status,
      result: out.result === undefined ? null : typeof out.result === "bigint" ? out.result.toString()
        : out.result instanceof Uint8Array ? Buffer.from(out.result).toString("hex") : out.result,
      status: "confirmed",
      completedAt: new Date().toISOString(),
    });
    return;
  }
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
  await confirm(request);
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

const lanes = new Map(); // wallet -> promise of its last queued transaction

async function inLane(wallet, job) {
  const previous = lanes.get(wallet) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(async () => {
    await untilReady(wallet);
    return job();
  });
  lanes.set(wallet, next);
  return next;
}

/** After its own transaction lands, a wallet re-syncs briefly before it can build another. */
async function untilReady(wallet, limitMs = 5 * 60_000) {
  const started = Date.now();
  while (Date.now() - started < limitMs) {
    if (wallets.get(wallet)?.ready?.all) return;
    await new Promise((r) => setTimeout(r, 2000));
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
  // Proving takes a while; answer now and let the browser watch the status change. One
  // transaction per wallet at a time: until the last one lands, its coins are spent and its
  // change has not come back, so a second would fail with "Insufficient funds".
  inLane(request.wallet, () => execute(request))
    .catch((error) => { request.status = "failed"; request.error = error.message; })
    .finally(() => { saveRequests(); console.log(`request ${id.slice(0, 8)}: ${request.status}${request.contractAddress ? " contract " + request.contractAddress : ""}${request.txHash ? " tx " + request.txHash : ""}${request.block ? " block " + request.block : ""}${request.error ? " (" + request.error + ")" : ""}`); });
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
    if (req.method === "GET" && url.pathname === "/api/history") {
      const record = wallets.get(url.searchParams.get("wallet") ?? "");
      if (!record?.handle) return send(res, 404, { error: "unknown or unopened wallet" }, origin || "null");
      const entries = await record.handle.facade.getAllFromTxHistory();
      return send(res, 200, JSON.parse(JSON.stringify(entries.slice(-20), (k, v) => typeof v === "bigint" ? v.toString() : v)), origin || "null");
    }
    if (req.method === "GET" && url.pathname === "/api/metadata") {
      return send(res, 200, await verifiedMetadata(), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/requests") {
      return send(res, 200, [...requests].reverse(), origin);
    }
    if (url.pathname.startsWith("/api/agent/")) return await agentRoute(req, res, url, origin);
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

/**
 * Agents' route. An agent's token binds it to its own wallet; the policy in agents.mjs decides
 * whether each request runs at once or waits in the wallet page for the organiser.
 */
async function agentRoute(req, res, url, origin) {
  // Agents are programs, not pages: refusing any browser origin keeps a web page from
  // borrowing a token that happens to be in reach.
  if (origin) return send(res, 403, { error: "agents call without a browser origin" }, "null");
  const agent = agentForToken(req.headers.authorization);
  if (!agent) return send(res, 401, { error: "unknown agent token" }, "null");
  const own = wallets.get(agent);

  if (req.method === "GET" && url.pathname === "/api/agent/requests") {
    return send(res, 200, requests.filter((r) => r.wallet === agent).reverse().slice(0, 50), "null");
  }
  if (req.method === "POST" && url.pathname === "/api/agent/requests") {
    const body = await readBody(req);
    const requestedBy = `agent:${own.name}`;
    const request = body.kind === "draw"
      ? createRequest({ wallet: agent, kind: "call", contract: "crew_treasury", contractAddress: crewTreasury(),
          circuit: "draw", args: [{ userAddress: own.address }], requestedBy, note: body.note ?? "treasury draw" })
      : body.kind === "transfer"
        ? createRequest({ wallet: agent, kind: "transfer", to: body.to, amount: body.amount, requestedBy, note: body.note })
        : null;
    if (!request) return send(res, 400, { error: "kind must be transfer or draw" }, "null");
    const crewAddresses = new Set([...wallets.values()].map((w) => w.address).filter(Boolean));
    const verdict = evaluate(agent, request, requests, crewAddresses);
    request.policy = verdict.reason;
    if (verdict.auto) {
      request.autoApproved = true;
      await decide(request.id, true);
    }
    saveRequests();
    console.log(`request ${request.id.slice(0, 8)} from ${own.name}: ${verdict.auto ? "auto-approved" : "waiting for approval"} (${verdict.reason})`);
    return send(res, 201, request, "null");
  }
  return send(res, 404, { error: "not found" }, "null");
}

console.log(`agent tokens: ${ensureAgentTokens()}`);
server.listen(PORT, "127.0.0.1", () => console.log(`wallet daemon on http://127.0.0.1:${PORT}`));

// Sync one wallet at a time: in parallel they compete for CPU and the indexer and all crawl
// (three at once managed ~4k shielded events in minutes; one alone does ~1,400 a second).
// Already-synced wallets resume instantly, so they are not held up by this.
async function untilSynced(entry, limitMs = 20 * 60_000) {
  const started = Date.now();
  while (Date.now() - started < limitMs) {
    const record = wallets.get(entry.wallet);
    if (record?.ready?.all || record?.status === "error") return;
    await new Promise((r) => setTimeout(r, 2000));
  }
}
// Wallets that finished a full sync before resume in seconds, so start those first; then
// sync the rest one by one, organiser before agents.
const SYNCED_FILE = new URL("./state/synced.json", import.meta.url).pathname;
const synced = new Set((() => { try { return JSON.parse(readFileSync(SYNCED_FILE, "utf8")); } catch { return []; } })());
const order = [...ROSTER].sort((a, b) => Number(synced.has(b.wallet)) - Number(synced.has(a.wallet)));
for (const entry of order) {
  await startWallet(entry);
  await untilSynced(entry);
  const record = wallets.get(entry.wallet);
  console.log(`${entry.name}: ${record?.ready?.all ? "fully synced" : "moving on while it finishes"}`);
  if (record?.ready?.all) {
    synced.add(entry.wallet);
    writeFileSync(SYNCED_FILE, JSON.stringify([...synced]));
  }
  if (record?.handle) await saveState(record.handle).catch(() => {});
}
