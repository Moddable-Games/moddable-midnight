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
import { inspect } from "node:util";
import { randomUUID, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import * as ledger from "@midnight-ntwrk/ledger-v8";
import { MidnightBech32m, UnshieldedAddress, ShieldedAddress } from "@midnight-ntwrk/wallet-sdk-address-format";
import { openWallet, isUsable, saveState, PREVIEW } from "./wallet.mjs";
import { deploy, call, mandateCommitment, loadContract, contractSecret, agentKeyV3 } from "./deploy.mjs";
import { verifiedMetadata, contractSummary } from "./metadata.mjs";
import {
  ensureAgentTokens, identify, evaluate, crewTreasury, crewTreasuryV3, chargeSession, policy, setAgentPolicy,
  setBlockedAddresses, sessions, createSession, revokeSession, publicSession, setTreasuryV3, DEFAULT_AGENT_POLICY,
} from "./agents.mjs";
import { roster, createAgent, createWallet, ensureOperator, operatorWallet, archiveWallet } from "./roster.mjs";
import { chatState, addMessage, heartbeat } from "./chat.mjs";
import { pinImage, localImage } from "./nft-media.mjs";
import { buildTokenAction, STANDARDS } from "./token-actions.mjs";
import { describeAll } from "./token-reader.mjs";
import { deployments, recordDeployment, recordToken, notesOf, updateNotes, setMandateTerms, allMandateTerms, removeMandateTerms } from "./books.mjs";
import { afterSpend, createdNote, pickNote, pad32, ownerKeyOf } from "../src/note-book.ts";
import { rawTokenType } from "@midnight-ntwrk/compact-runtime";
import { readSettings, writeSettings, prices } from "./settings.mjs";

const PORT = 9900;
// 5173 is this repo's wallet app; 5175 is the Armada wallet (github.com/msmalley/armada, wallet/),
// a restyled build of the same client.
const ALLOWED_ORIGINS = new Set(["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5175", "http://127.0.0.1:5175"]);
const NIGHT = "0".repeat(64);
const STAR_PER_NIGHT = 1_000_000n;
const REQUESTS_FILE = new URL("./state/requests.json", import.meta.url).pathname;

// The app always has an operator: made on first start if the roster has none.
const madeOperator = ensureOperator();
if (madeOperator) console.log(`created the operator account ${madeOperator}`);
const ROSTER = roster();
const operator = () => operatorWallet();

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
    record.shieldedAddress = MidnightBech32m.encode(PREVIEW.networkId, await handle.facade.shielded.getAddress()).asString();
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
    operator: Boolean(record.operator),
    archived: Boolean(record.archived),
    address: record.address ?? null,
    status: record.status,
    error: record.error ?? null,
    restoredFrom: record.restoredFrom ?? null,
    shieldedAddress: record.shieldedAddress ?? null,
    createdAt: record.createdAt ?? null,
    night: s ? (s.unshielded.balances[NIGHT] ?? 0n).toString() : null,
    // Every unshielded token the wallet holds: token type (hex) -> amount.
    unshielded: s ? Object.fromEntries(Object.entries(s.unshielded.balances ?? {}).map(([t, v]) => [t, v.toString()])) : null,
    dustRegistered: s ? s.unshielded.availableCoins.some((c) => c.meta?.registeredForDustGeneration) : null,
    unregisteredNight: s ? s.unshielded.availableCoins.filter((c) => c.utxo.type === NIGHT && !c.meta?.registeredForDustGeneration).length : null,
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

const NIGHT_TYPE = ledger.unshieldedToken().raw;

/**
 * A transfer's recipient decides its kind: an mn_addr is unshielded, an mn_shield-addr is
 * shielded. NIGHT exists only unshielded, so it cannot go to a shielded address.
 */
function transferShape(to, token) {
  if (!/^[0-9a-f]{64}$/.test(token)) throw new Error("token must be a 64-character hex token type");
  const shielded = String(to ?? "").startsWith("mn_shield-addr_");
  if (shielded && token === NIGHT_TYPE) throw new Error("NIGHT is unshielded only: send it to an mn_addr address");
  if (shielded) MidnightBech32m.parse(to).decode(ShieldedAddress, PREVIEW.networkId);
  else MidnightBech32m.parse(to).decode(UnshieldedAddress, PREVIEW.networkId);
  return { shielded };
}

/** NIGHT has 6 decimals; our tokens (MCC, Agent Smart Contracts) have none. */
function parseAmount(text, token) {
  if (token === NIGHT_TYPE) return parseNight(text);
  if (!/^\d+$/.test(String(text).trim())) throw new Error("amount must be a whole number of tokens");
  const value = BigInt(String(text).trim());
  if (value <= 0n) throw new Error("amount must be positive");
  return value;
}

function createRequest({ wallet, kind, to, amount, token, contract, contractAddress, circuit, args, requestedBy, note, extra, after }) {
  if (!wallets.has(wallet)) throw new Error(`unknown wallet ${wallet}`);
  if (!["transfer", "deploy", "call", "dust-register"].includes(kind)) throw new Error(`unsupported request kind ${kind}`);
  const tokenType = String(token ?? NIGHT_TYPE).toLowerCase();
  const shape = kind === "transfer" ? transferShape(to, tokenType) : null; // validate now
  if ((kind === "deploy" || kind === "call") && !/^[a-z0-9_]+$/.test(contract ?? "")) throw new Error("contract must be a compiled contract name");
  if (kind === "call" && (!contractAddress || !circuit)) throw new Error("a call needs contractAddress and circuit");
  const request = {
    id: randomUUID(),
    wallet, kind,
    to: to ?? null,
    amount: kind === "transfer" ? parseAmount(amount, tokenType).toString() : null,
    token: kind === "transfer" ? tokenType : null,
    shielded: shape?.shielded ?? false,
    contract: contract ?? null,
    contractAddress: contractAddress ?? null,
    circuit: circuit ?? null,
    args: args ?? [],
    requestedBy: requestedBy ?? "browser",
    note: note ?? "",
    extra: extra ?? null,
    after: after ?? null,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  requests.push(request);
  saveRequests();
  console.log(`request ${request.id.slice(0, 8)}: ${describe(request)} (pending approval)`);
  return request;
}

function describe(r) {
  if (r.kind === "transfer") {
    const what = (r.token ?? NIGHT_TYPE) === NIGHT_TYPE ? `${Number(r.amount) / 1e6} NIGHT` : `${r.amount} of ${r.token.slice(0, 8)}…`;
    return `${r.wallet} -> ${r.to.slice(0, 22)}… ${what}${r.shielded ? " (shielded)" : ""}`;
  }
  if (r.kind === "deploy") return `${r.wallet} deploys ${r.contract}`;
  if (r.kind === "dust-register") return `${r.wallet} registers its NIGHT for DUST`;
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
    if ("domain" in arg) return pad32(String(arg.domain));
    if ("accountOf" in arg) {
      const { module } = await loadContract("contract_token");
      return module.pureCircuits.accountOf(contractSecret(arg.accountOf, "contract_token"));
    }
    if ("ownerOf" in arg) return Uint8Array.from(Buffer.from(ownerKeyOf(contractSecret(arg.ownerOf, "private_ledger")), "hex"));
    if ("coin" in arg) {
      // A fresh coin of this contract's token, paid in by the caller's wallet in this call.
      const color = rawTokenType(Uint8Array.from(Buffer.from(arg.coin.domainHex, "hex")), request.contractAddress);
      return { nonce: new Uint8Array(randomBytes(32)), color: Uint8Array.from(Buffer.from(color, "hex")), value: BigInt(arg.coin.amount) };
    }
    if ("metadata" in arg) return metadataPayload(arg.metadata);
    if ("terms" in arg) {
      return { capPerDraw: BigInt(arg.terms.capPerDraw), drawsPerPeriod: BigInt(arg.terms.drawsPerPeriod), salt: Uint8Array.from(Buffer.from(arg.terms.salt, "hex")) };
    }
    if ("agentKeyOf" in arg) return agentKeyV3(arg.agentKeyOf, pad32("moddable:midnight-city:crew:v3"));
    if ("userAddress" in arg) {
      const address = MidnightBech32m.parse(arg.userAddress).decode(UnshieldedAddress, PREVIEW.networkId);
      return { bytes: new Uint8Array(address.data) };
    }
    if ("bytes" in arg) return Uint8Array.from(Buffer.from(arg.bytes, "hex"));
  }
  return arg;
}

/** A MIP-0018 payload from the app's fields (key text, value by type). */
function metadataPayload({ domainHex, kind, key, valType, value }) {
  const types = { opaque: 0, string: 1, integer: 2, json: 3, uri: 4, null: 5 };
  const t = types[valType];
  if (t === undefined) throw new Error("valType must be opaque, string, integer, json, uri or null");
  const keyBytes = new TextEncoder().encode(String(key ?? ""));
  if (!keyBytes.length || keyBytes.length > 32) throw new Error("key must be 1 to 32 bytes");
  let bytes;
  if (t === 5) bytes = new Uint8Array(0);
  else if (t === 2) {
    let n = BigInt(value); bytes = new Uint8Array(16); // Uint<128>, little-endian (MIP-0018 appendix A)
    for (let i = 0; i < 16; i++) { bytes[i] = Number(n & 0xffn); n >>= 8n; }
  } else if (t === 0) bytes = Uint8Array.from(Buffer.from(String(value), "hex"));
  else {
    if (t === 3) JSON.parse(String(value));
    if (t === 4) new URL(String(value));
    bytes = new TextEncoder().encode(String(value));
  }
  if (bytes.length > 189) throw new Error("value is over 189 bytes");
  const padded = new Uint8Array(189); padded.set(bytes);
  const k = new Uint8Array(32); k.set(keyBytes);
  return { domainSep: Uint8Array.from(Buffer.from(domainHex, "hex")), kind: BigInt(kind), key: k, valType: BigInt(t), valLen: BigInt(bytes.length), value: padded };
}

/** Registers the wallet's unregistered NIGHT for DUST, as the wallet SDK docs do. */
async function registerDust(request, record) {
  const { facade, keystore } = record.handle;
  const unregistered = record.state.unshielded.availableCoins.filter((c) => c.utxo.type === NIGHT && !c.meta?.registeredForDustGeneration);
  if (!unregistered.length) throw new Error("no unregistered NIGHT to register");
  request.status = "building";
  const recipe = await facade.registerNightUtxosForDustGeneration(unregistered, keystore.getPublicKey(), (payload) => keystore.signData(payload));
  request.status = "proving";
  const finalized = await facade.finalizeRecipe(recipe);
  request.status = "submitting";
  request.txId = await facade.submitTransaction(finalized);
  request.status = "submitted";
  await confirm(request);
}

/** Bookkeeping once a token action is confirmed: registry, labels, private notes, terms. */
async function runAfter(request) {
  const a = request.after;
  if (!a) return;
  if (a.type === "recordDeployment") {
    recordDeployment({
      address: request.contractAddress, standard: a.standard, name: a.name, symbol: a.symbol, decimals: a.decimals,
      domain: a.domain, domainHex: Buffer.from(pad32(a.domain)).toString("hex"),
      block: request.block ?? null, txHash: request.txHash ?? null, deployedAt: new Date().toISOString(), tokens: [],
    });
    return;
  }
  const d = deployments().find((x) => x.address === request.contractAddress);
  if (a.type === "minted") {
    const domainHex = a.nft
      ? Buffer.from((await loadContract(d.standard)).module.pureCircuits.nftDomain(pad32(a.serial))).toString("hex")
      : Buffer.from(pad32(a.domain)).toString("hex");
    recordToken(d.address, { domain: domainHex, serial: a.nft ? a.serial : null, label: a.nft ? a.serial : a.domain });
    if (d.standard === "private_ledger") {
      updateNotes(d.address, { wallet: a.to, created: [{ owner: a.to, note: createdNote(domainHex, BigInt(a.amount), a.nonce) }] });
    }
  }
  if (d?.standard === "private_ledger" && a.type === "spent") {
    const secret = contractSecret(request.wallet, "private_ledger");
    const input = request.spentNote;
    const { change, paid } = afterSpend(secret, input, BigInt(a.amount));
    const created = [{ owner: request.wallet, note: change }];
    if (a.pays) created.push({ owner: a.to, note: paid });
    updateNotes(d.address, { wallet: request.wallet, spent: input, created });
  }
  if (d?.standard === "private_ledger" && a.type === "deposited") {
    updateNotes(d.address, { wallet: request.wallet, created: [{ owner: request.wallet, note: createdNote(a.domainHex, BigInt(a.amount), a.nonce) }] });
  }
  if (a.type === "appointed") {
    setMandateTerms(request.contractAddress, a.agent, { capPerDraw: a.capPerDraw, drawsPerPeriod: a.drawsPerPeriod, salt: a.salt, epoch: a.epoch });
  }
  if (a.type === "treasuryV3") setTreasuryV3(request.contractAddress);
  if (a.type === "revoked") removeMandateTerms(request.contractAddress, a.agent);
  if (a.type === "archive") { archiveWallet(a.wallet); const r = wallets.get(a.wallet); if (r) r.archived = true; }
  // An NFT minted with an image: publish its name and image (MIP-0018) as follow-ups the
  // operator already approved with the mint.
  if (a.type === "minted" && a.nft && a.imageUri && d) {
    const domainHex = Buffer.from((await loadContract(d.standard)).module.pureCircuits.nftDomain(pad32(a.serial))).toString("hex");
    const kind = STANDARDS[d.standard].kind;
    for (const [key, valType, value] of [["name", "string", a.serial], ["image", "uri", a.imageUri]]) {
      const { request: follow } = buildTokenAction({ action: "metadata", contractAddress: d.address, domainHex, kind, key, valType, value }, { addressOf });
      const queued = createRequest({ ...follow, requestedBy: `follow-up of ${request.id.slice(0, 8)}` });
      queued.autoApproved = true;
      await decide(queued.id, true);
    }
  }
}

async function execute(request) {
  const record = wallets.get(request.wallet);
  if (request.kind === "dust-register") return registerDust(request, record);
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
    // The note the witness will spend, recorded now so the books can be updated afterwards.
    if (request.contract === "private_ledger" && request.after?.type === "spent") {
      request.spentNote = pickNote(notesOf(request.contractAddress, request.wallet), request.after.domainHex, BigInt(request.after.amount));
      if (!request.spentNote) throw new Error("no note large enough for that amount");
    }
    const extra = request.extra?.nextNonce ? { nextNonce: Uint8Array.from(Buffer.from(request.extra.nextNonce, "hex")) } : {};
    const out = request.kind === "deploy"
      ? await deploy(record.handle, request.contract, { args, onPhase, extra })
      : await call(record.handle, request.contract, request.contractAddress, request.circuit, args, { onPhase, recipients, extra });
    Object.assign(request, {
      contractAddress: out.contractAddress ?? request.contractAddress,
      txId: out.txId, txHash: out.txHash, block: out.block, chainStatus: out.status,
      result: out.result === undefined ? null : typeof out.result === "bigint" ? out.result.toString()
        : out.result instanceof Uint8Array ? Buffer.from(out.result).toString("hex") : out.result,
      status: "confirmed",
      completedAt: new Date().toISOString(),
    });
    // A call that did not succeed entirely changed nothing worth recording.
    if (request.chainStatus && request.chainStatus !== "SucceedEntirely") {
      request.status = "failed";
      request.error = `on chain: ${request.chainStatus}`;
      return;
    }
    await runAfter(request);
    return;
  }
  if (record?.status !== "ready") throw new Error(`${record?.name ?? request.wallet} is still syncing`);
  const { facade, zswapKeys, dustKey, keystore } = record.handle;
  const token = request.token ?? NIGHT_TYPE;
  const output = request.shielded
    ? { type: "shielded", outputs: [{ amount: BigInt(request.amount), type: token,
        receiverAddress: MidnightBech32m.parse(request.to).decode(ShieldedAddress, PREVIEW.networkId) }] }
    : { type: "unshielded", outputs: [{ amount: BigInt(request.amount), type: token,
        receiverAddress: MidnightBech32m.parse(request.to).decode(UnshieldedAddress, PREVIEW.networkId) }] };
  request.status = "building";
  const recipe = await facade.transferTransaction(
    [output],
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

/** An error and its causes, which is where the node's actual reason usually is. */
function errorText(error) {
  const parts = [];
  for (let e = error, depth = 0; e && depth < 6; e = e.cause, depth++) {
    const text = e.message ?? String(e);
    if (!parts.includes(text)) parts.push(text);
  }
  return parts.join(" ← ");
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
    .catch((error) => {
      request.status = "failed";
      request.error = errorText(error);
      console.error(`request ${id.slice(0, 8)} failed:`, inspect(error, { depth: 6 }));
    })
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

async function readBody(req, limit = 64_000) {
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > limit) throw new Error("request too large"); }
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
    if (req.method === "GET" && url.pathname === "/api/contract") {
      return send(res, 200, await contractSummary(), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/metadata") {
      return send(res, 200, await verifiedMetadata(), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/requests") {
      return send(res, 200, [...requests].reverse(), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/tokens") {
      return send(res, 200, { standards: STANDARDS, deployments: await describeAll({ fresh: url.searchParams.has("fresh") }) }, origin);
    }
    if (req.method === "GET" && url.pathname === "/api/holdings") {
      return send(res, 200, await holdings(), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/policy") {
      const p = policy();
      return send(res, 200, { ...p, defaults: DEFAULT_AGENT_POLICY, sessions: sessions().map(publicSession).reverse() }, origin);
    }
    if (req.method === "GET" && url.pathname === "/api/treasury-v3") {
      return send(res, 200, await treasuryV3Summary(), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/settings") {
      return send(res, 200, readSettings(), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/prices") {
      return send(res, 200, await prices(), origin);
    }
    if (req.method === "GET" && url.pathname === "/api/chat") {
      return send(res, 200, chatState(), origin || "null");
    }
    const media = url.pathname.match(/^\/api\/media\/(b[a-z2-7]+)$/);
    if (req.method === "GET" && media) {
      const image = localImage(media[1]);
      if (!image) return send(res, 404, { error: "no such image here" }, origin || "null");
      res.writeHead(200, { "Content-Type": image.type, "Cache-Control": "public, max-age=31536000, immutable", "Access-Control-Allow-Origin": origin || "*" });
      return res.end(image.bytes);
    }
    if (url.pathname.startsWith("/api/agent/")) return await agentRoute(req, res, url, origin);
    if (!fromUI) return send(res, 403, { error: "writes are only accepted from the wallet UI" }, "null");
    if (req.method === "POST" && url.pathname === "/api/requests") {
      return send(res, 201, createRequest(await readBody(req)), origin);
    }
    if (req.method === "POST" && url.pathname === "/api/token-actions") {
      const body = await readBody(req, 512_000);
      // An NFT's image is pinned first, so the mint is only queued once the image is on IPFS.
      if (body.action === "mint" && body.nft && body.image) body.imageUri = (await pinImage(body.image, body.serial)).uri;
      delete body.image;
      const { request, after } = buildTokenAction(body, { addressOf, nameOf: (w) => wallets.get(w)?.name ?? w });
      return send(res, 201, createRequest({ ...request, after }), origin);
    }
    if (req.method === "POST" && url.pathname === "/api/chat") {
      return send(res, 201, addMessage({ from: "operator", text: (await readBody(req)).text }), origin);
    }
    if (req.method === "POST" && url.pathname === "/api/chat/reply") {
      const body = await readBody(req);
      return send(res, 201, addMessage({ from: "assistant", text: body.text, requests: body.requests ?? [], status: body.status ?? null }), origin);
    }
    if (req.method === "POST" && url.pathname === "/api/chat/heartbeat") {
      heartbeat();
      return send(res, 200, { ok: true }, origin);
    }
    if (req.method === "POST" && url.pathname === "/api/accounts") {
      return send(res, 201, await addAccount(await readBody(req)), origin);
    }
    if (req.method === "POST" && url.pathname === "/api/agents") {
      return send(res, 201, await addAgent(await readBody(req)), origin);
    }
    const agentMatch = url.pathname.match(/^\/api\/agents\/([a-z0-9-]+)\/(fund|dust|appoint|policy|sessions|pause|revoke|remove)$/);
    if (req.method === "POST" && agentMatch) {
      return send(res, 201, await agentSetup(agentMatch[1], agentMatch[2], await readBody(req)), origin);
    }
    const sessionMatch = url.pathname.match(/^\/api\/sessions\/([0-9a-f-]{36})\/revoke$/);
    if (req.method === "POST" && sessionMatch) {
      return send(res, 200, revokeSession(sessionMatch[1]), origin);
    }
    if (req.method === "POST" && url.pathname === "/api/policy/blocked") {
      return send(res, 200, setBlockedAddresses((await readBody(req)).blocked ?? []), origin);
    }
    if (req.method === "POST" && url.pathname === "/api/treasury-v3") {
      return send(res, 201, treasuryV3Action(await readBody(req)), origin);
    }
    if (req.method === "POST" && url.pathname === "/api/settings") {
      return send(res, 200, writeSettings(await readBody(req)), origin);
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
 * Agents' route. A token (standing or session) binds an agent to its own wallet; agents.mjs
 * decides whether each request is refused, runs at once, or waits for the operator.
 */
async function agentRoute(req, res, url, origin) {
  // Agents are programs, not pages: refusing any browser origin keeps a web page from
  // borrowing a token that happens to be in reach.
  if (origin) return send(res, 403, { error: "agents call without a browser origin" }, "null");
  const who = identify(req.headers.authorization);
  if (!who) return send(res, 401, { error: "unknown agent token" }, "null");
  const agent = who.wallet;
  const own = wallets.get(agent);
  if (!own) return send(res, 403, { error: "agent is not open in the daemon" }, "null");

  if (req.method === "GET" && url.pathname === "/api/agent/requests") {
    return send(res, 200, requests.filter((r) => r.wallet === agent).reverse().slice(0, 50), "null");
  }
  if (req.method === "POST" && url.pathname === "/api/agent/requests") {
    const body = await readBody(req);
    const requestedBy = who.session ? `agent:${own.name} (session ${who.session.label})` : `agent:${own.name}`;
    let shape;
    if (body.kind === "draw") {
      // v3 when it is live (the agent's own terms, a free slot), else v2's fixed draw.
      const v3 = crewTreasuryV3();
      shape = v3
        ? { wallet: agent, kind: "call", contract: "crew_treasury_v3", contractAddress: v3, circuit: "draw",
            args: [{ uint: String(body.amount ?? 1) }, { uint: String(body.slot ?? 0) }, { userAddress: own.address }], requestedBy, note: body.note ?? "treasury draw" }
        : { wallet: agent, kind: "call", contract: "crew_treasury", contractAddress: crewTreasury(),
            circuit: "draw", args: [{ userAddress: own.address }], requestedBy, note: body.note ?? "treasury draw" };
    } else if (body.kind === "transfer") {
      shape = { wallet: agent, kind: "transfer", to: body.to, amount: body.amount, token: body.token, requestedBy, note: body.note };
    } else if (body.kind === "call") {
      shape = { wallet: agent, kind: "call", contract: body.contract, contractAddress: body.contractAddress, circuit: body.circuit, args: body.args ?? [], requestedBy, note: body.note };
    } else {
      return send(res, 400, { error: "kind must be transfer, draw or call" }, "null");
    }
    const crewAddresses = new Set([...wallets.values()].map((w) => w.address).filter(Boolean));
    // Judge before queueing, so refused requests never reach the operator's queue.
    const probe = { ...shape, token: shape.token ? String(shape.token).toLowerCase() : NIGHT_TYPE,
      amount: shape.kind === "transfer" ? parseAmount(shape.amount, String(shape.token ?? NIGHT_TYPE).toLowerCase()).toString() : null };
    const verdict = evaluate(agent, probe, requests, crewAddresses, who.session);
    if (verdict.verdict === "refuse") {
      const refused = { id: randomUUID(), wallet: agent, kind: shape.kind, to: shape.to ?? null, amount: probe.amount, token: shape.kind === "transfer" ? probe.token : null,
        contract: shape.contract ?? null, contractAddress: shape.contractAddress ?? null, circuit: shape.circuit ?? null,
        requestedBy, note: shape.note ?? "", status: "refused", policy: verdict.reason, createdAt: new Date().toISOString() };
      requests.push(refused);
      saveRequests();
      console.log(`request from ${own.name} refused (${verdict.reason})`);
      return send(res, 403, refused, "null");
    }
    const request = createRequest(shape);
    request.policy = verdict.reason;
    if (who.session) {
      request.sessionId = who.session.id;
      chargeSession(who.session.id, request.kind === "transfer" && request.token === NIGHT_TYPE ? BigInt(request.amount) : 0n);
    }
    if (verdict.verdict === "auto") {
      request.autoApproved = true;
      await decide(request.id, true);
    }
    saveRequests();
    console.log(`request ${request.id.slice(0, 8)} from ${own.name}: ${verdict.verdict === "auto" ? "auto-approved" : "waiting for approval"} (${verdict.reason})`);
    return send(res, 201, request, "null");
  }
  return send(res, 404, { error: "not found" }, "null");
}

// ---------------------------------------------------------------------------------------
// Operator: agents, holdings, treasury v3
// ---------------------------------------------------------------------------------------

const addressOf = (wallet) => {
  const address = wallets.get(wallet)?.address;
  if (!address) throw new Error(`${wallet} is not open in the daemon`);
  return address;
};

/** A new agent: wallet file, roster entry, default policy, and its wallet opened. */
async function addAgent(body) {
  const entry = createAgent(body);
  setAgentPolicy(entry.wallet, {});
  ensureAgentTokens();
  wallets.set(entry.wallet, { ...entry, status: "queued" });
  startWallet(entry).catch(() => {});
  return entry;
}

/** The setup steps the Operator tab offers for one agent. Each is an ordinary request. */
async function agentSetup(wallet, step, body) {
  if (!wallets.has(wallet)) throw new Error(`unknown wallet ${wallet}`);
  if (step === "fund") {
    return createRequest({ wallet: operator(), kind: "transfer", to: addressOf(wallet), amount: String(body.amount ?? "100"), requestedBy: "operator", note: `Fund ${wallets.get(wallet).name}` });
  }
  if (step === "dust") {
    return createRequest({ wallet, kind: "dust-register", requestedBy: "operator", note: `Register ${wallets.get(wallet).name}'s NIGHT for DUST` });
  }
  if (step === "appoint") return appointV3(wallet, body);
  if (step === "policy") return setAgentPolicy(wallet, body);
  if (step === "sessions") return createSession(wallet, body);
  if (step === "pause") return setAgentPolicy(wallet, { paused: Boolean(body.paused) });
  if (step === "revoke") return revokeOne(wallet);
  if (step === "remove") return removeAgent(wallet, body);
  throw new Error("unknown step");
}

const V3_CREW_ID = () => Buffer.from(pad32("moddable:midnight-city:crew:v3")).toString("hex");

/** Appoint an agent in the v3 treasury under private terms, sending its NFT to its wallet. */
function appointV3(wallet, body, epoch = 0) {
  const address = crewTreasuryV3();
  if (!address) throw new Error("the v3 treasury is not deployed yet");
  const capPerDraw = String(body.capPerDraw ?? "50");
  const drawsPerPeriod = String(body.drawsPerPeriod ?? "1");
  if (!/^\d+$/.test(capPerDraw) || !/^\d+$/.test(drawsPerPeriod) || Number(drawsPerPeriod) < 1 || Number(drawsPerPeriod) > 255) {
    throw new Error("cap is a whole number; draws per period is 1 to 255");
  }
  const salt = randomBytes(32).toString("hex");
  return createRequest({
    wallet: operator(), kind: "call", contract: "crew_treasury_v3", contractAddress: address, circuit: "issueMandate",
    args: [{ agentKeyOf: wallet }, { terms: { capPerDraw, drawsPerPeriod, salt } }, { coinPublicKeyOf: wallet }],
    requestedBy: "operator", note: `Appoint ${wallets.get(wallet).name}: up to ${capPerDraw} MCC a draw, ${drawsPerPeriod} a period`,
    after: { type: "appointed", agent: wallet, capPerDraw, drawsPerPeriod, salt, epoch },
  });
}

/** Organiser actions on the v3 treasury, including its deploy. */
function treasuryV3Action(body) {
  const address = crewTreasuryV3();
  const organiserCall = (circuit, args, note, after = null) => {
    if (!address) throw new Error("the v3 treasury is not deployed yet");
    return createRequest({ wallet: operator(), kind: "call", contract: "crew_treasury_v3", contractAddress: address, circuit, args, requestedBy: "operator", note, after });
  };
  switch (body.action) {
    case "deploy":
      if (address) throw new Error("the v3 treasury is already deployed");
      return createRequest({ wallet: operator(), kind: "deploy", contract: "crew_treasury_v3", args: [{ bytes: V3_CREW_ID() }],
        requestedBy: "operator", note: "Deploy crew treasury v3", after: { type: "treasuryV3" } });
    case "mint": return organiserCall("mintTreasury", [{ uint: String(body.amount) }], `Mint ${body.amount} MCC into the v3 treasury`);
    case "openPeriod": return organiserCall("openPeriod", [{ domain: String(body.period) }], `Open period ${body.period}`);
    case "pause": return organiserCall("setPaused", [Boolean(body.paused)], body.paused ? "Pause draws" : "Resume draws");
    case "revokeAll": return organiserCall("revokeAll", [], "Revoke every mandate (new epoch)");
    case "block": return organiserCall("blockPayee", [{ userAddress: body.address }], `Block payee ${String(body.address).slice(0, 20)}…`);
    case "unblock": return organiserCall("unblockPayee", [{ userAddress: body.address }], `Unblock payee ${String(body.address).slice(0, 20)}…`);
    default: throw new Error("unknown treasury action");
  }
}

async function treasuryV3Summary() {
  const address = crewTreasuryV3();
  if (!address) return { address: null };
  const { readLedger } = await import("./deploy.mjs");
  const { ledger } = await readLedger("crew_treasury_v3", address);
  const terms = allMandateTerms(address);
  return {
    address,
    treasuryColor: Buffer.from(ledger.treasuryColor).toString("hex"),
    minted: ledger.treasuryMinted.toString(),
    mandates: ledger.mandateCount.toString(),
    draws: ledger.drawCount.toString(),
    epoch: Number(ledger.epoch),
    paused: ledger.paused,
    period: Buffer.from(ledger.currentPeriod).toString("utf8").replace(/\0+$/, ""),
    blocked: [...ledger.blockedPayees].map((b) => Buffer.from(b).toString("hex")),
    // Private terms, known only here: the chain holds a salted hash of them.
    terms: Object.fromEntries(Object.entries(terms).map(([w, t]) => [w, { capPerDraw: t.capPerDraw, drawsPerPeriod: t.drawsPerPeriod, epoch: t.epoch }])),
  };
}

/** A person's account for a purpose (payroll, grants, a team): a wallet with no agent policy. */
async function addAccount(body) {
  const entry = createWallet({ name: body.name, role: body.purpose, kind: "human" });
  wallets.set(entry.wallet, { ...entry, status: "queued" });
  startWallet(entry).catch(() => {});
  return entry;
}

/**
 * Take one agent out of the treasury. Mandates are anonymous, so the contract cannot revoke one
 * alone (that would link it to its draws): revoke all by moving to a new epoch, then appoint
 * every other agent again on its current terms, with fresh salts. Each step is a request.
 */
function revokeOne(wallet) {
  const address = crewTreasuryV3();
  if (!address) throw new Error("the v3 treasury is not deployed");
  const terms = allMandateTerms(address);
  if (!terms[wallet]) throw new Error(`${wallets.get(wallet)?.name ?? wallet} is not appointed`);
  const nextEpoch = Math.max(...Object.values(terms).map((t) => t.epoch ?? 0)) + 1;
  const queued = [createRequest({ wallet: operator(), kind: "call", contract: "crew_treasury_v3", contractAddress: address, circuit: "revokeAll", args: [],
    requestedBy: "operator", note: `Revoke all mandates, to remove ${wallets.get(wallet)?.name ?? wallet}`, after: { type: "revoked", agent: wallet } })];
  for (const [other, t] of Object.entries(terms)) {
    if (other === wallet || !wallets.has(other) || wallets.get(other).archived) continue;
    queued.push(appointV3(other, { capPerDraw: t.capPerDraw, drawsPerPeriod: t.drawsPerPeriod }, nextEpoch));
  }
  setAgentPolicy(wallet, { autoDraw: false });
  return { requests: queued };
}

/**
 * Remove an agent: stop it, sweep everything it holds to the operator (tokens first, NIGHT last,
 * so fees can still be paid), then archive it. Its keys are kept; nothing is deleted.
 */
async function removeAgent(wallet, body) {
  const record = wallets.get(wallet);
  if (!record || record.kind !== "agent") throw new Error("only agents can be removed here");
  const op = wallets.get(operator());
  const s = summary(record);
  const queued = [];
  setAgentPolicy(wallet, { paused: true, autoDraw: false });
  for (const session of sessions().filter((x) => x.wallet === wallet && !x.revokedAt)) revokeSession(session.id);
  const sweep = (to, amount, token, note) => queued.push(createRequest({ wallet, kind: "transfer", to, amount, token, requestedBy: "operator", note }));
  for (const [type, amount] of Object.entries(s.unshielded ?? {})) {
    if (type !== NIGHT && BigInt(amount) > 0n) sweep(op.address, amount, type, `Return ${record.name}'s ${type.slice(0, 8)}… to the operator`);
  }
  for (const [type, amount] of Object.entries(s.shielded ?? {})) {
    if (BigInt(amount) > 0n) sweep(op.shieldedAddress, amount, type, `Return ${record.name}'s private ${type.slice(0, 8)}… to the operator`);
  }
  // Contract-held balances move inside their contracts.
  const held = (await holdings())[wallet]?.contract ?? {};
  for (const [key, amount] of Object.entries(held)) {
    const [contractAddress, domainHex] = key.split(":");
    const { request, after } = buildTokenAction({ action: "transfer", contractAddress, domainHex, to: operator(), amount, wallet }, { addressOf, nameOf: (w) => wallets.get(w)?.name ?? w });
    queued.push(createRequest({ ...request, after, requestedBy: "operator" }));
  }
  if (crewTreasuryV3() && allMandateTerms(crewTreasuryV3())[wallet] && body.revoke !== false) queued.push(...revokeOne(wallet).requests);
  // NIGHT last: after it moves, the agent generates no more DUST.
  if (BigInt(s.night ?? 0) > 0n) {
    queued.push(createRequest({ wallet, kind: "transfer", to: op.address, amount: (Number(s.night) / 1e6).toFixed(6), requestedBy: "operator",
      note: `Return ${record.name}'s NIGHT to the operator`, after: { type: "archive", wallet } }));
  } else {
    archiveWallet(wallet);
    record.archived = true;
  }
  return { requests: queued };
}

/**
 * What each wallet holds across every token type: native balances from the wallet itself,
 * contract-held balances read from each token contract (kind 2) or the daemon's note book
 * (kind 3).
 */
async function holdings() {
  const out = {};
  const described = await describeAll();
  for (const w of wallets.values()) {
    const s = summary(w);
    out[w.wallet] = { unshielded: s.unshielded ?? {}, shielded: s.shielded ?? {}, contract: {} };
  }
  const { module: ct } = await loadContract("contract_token").catch(() => ({ module: null }));
  for (const d of described) {
    if (d.error) continue;
    if (d.standard === "contract_token" && ct) {
      const { readLedger } = await import("./deploy.mjs");
      const { ledger } = await readLedger("contract_token", d.address);
      for (const w of wallets.values()) {
        const account = ct.pureCircuits.accountOf(contractSecret(w.wallet, "contract_token"));
        for (const t of d.tokens) {
          const slot = ct.pureCircuits.balanceSlot(Buffer.from(t.domain, "hex"), account);
          const v = ledger.balances.member(slot) ? ledger.balances.lookup(slot) : 0n;
          if (v > 0n) out[w.wallet].contract[`${d.address}:${t.domain}`] = v.toString();
        }
      }
    }
    if (d.standard === "private_ledger") {
      for (const w of wallets.values()) {
        for (const n of notesOf(d.address, w.wallet)) {
          const key = `${d.address}:${n.domain}`;
          out[w.wallet].contract[key] = (BigInt(out[w.wallet].contract[key] ?? 0) + BigInt(n.amount)).toString();
        }
      }
    }
  }
  return out;
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
