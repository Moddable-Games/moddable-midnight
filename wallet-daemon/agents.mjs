// The agents' own route into the daemon, and the limits that decide what needs a human.
//
// An agent authenticates with a bearer token bound to its own wallet: it can spend only from
// that wallet, whatever it asks for. Two kinds of token:
//
//   standing token   agent-tokens.json, one per agent, no expiry (what agent-request.mjs uses)
//   session          made by the operator in the wallet app: expires, and carries its own
//                    budget of requests and NIGHT; revocable at any time
//
// The policy (agent-policy.json, public, edited from the app) then decides each request:
//
//   refused   the recipient is on a blocked list (the operator's or this agent's), the
//             contract is not on this agent's whitelist, or a session limit is spent.
//             Refused requests never reach the approval queue.
//   automatic NIGHT to a crew wallet within the agent's per-transfer and daily caps (and its
//             session's budget); a treasury draw when autoDraw is on (the contract enforces
//             its own caps on chain).
//   approval  everything else waits for the operator.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { randomBytes, randomUUID, timingSafeEqual, createHash } from "node:crypto";

const STATE_DIR = new URL("./state/", import.meta.url).pathname;
const TOKENS_FILE = STATE_DIR + "agent-tokens.json";
const SESSIONS_FILE = STATE_DIR + "agent-sessions.json";
const POLICY_FILE = new URL("./agent-policy.json", import.meta.url).pathname;
const STAR_PER_NIGHT = 1_000_000n;
const NIGHT = "0".repeat(64);

const readJson = (file, fallback) => { try { return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback; } catch { return fallback; } };
const writePrivate = (file, value) => {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(file, JSON.stringify(value, null, 2), { mode: 0o600 });
};

// ---------------------------------------------------------------------------
// Policy
// ---------------------------------------------------------------------------

export const DEFAULT_AGENT_POLICY = {
  spendCaps: { perTransferNight: "1", dailyNight: "5" },
  whitelistedContracts: [],
  blockedAddresses: [],
  autoDraw: true,
  paused: false,
};

export function policy() {
  const p = readJson(POLICY_FILE, { agents: {} });
  p.blockedAddresses ??= [];
  for (const [wallet, a] of Object.entries(p.agents)) p.agents[wallet] = { ...DEFAULT_AGENT_POLICY, ...a };
  return p;
}

function savePolicy(p) {
  writeFileSync(POLICY_FILE, JSON.stringify(p, null, 2) + "\n");
  return p;
}

const nightText = (text, what) => {
  if (!/^\d+(\.\d{1,6})?$/.test(String(text))) throw new Error(`${what} must be NIGHT with up to 6 decimals`);
  return String(text);
};
const toStar = (text) => {
  const [w, f = ""] = String(text).split(".");
  return BigInt(w) * STAR_PER_NIGHT + BigInt(f.padEnd(6, "0"));
};

/** Replaces one agent's policy with validated values. */
export function setAgentPolicy(wallet, input) {
  const p = policy();
  const current = p.agents[wallet] ?? { ...DEFAULT_AGENT_POLICY };
  const next = {
    spendCaps: {
      perTransferNight: nightText(input.spendCaps?.perTransferNight ?? current.spendCaps.perTransferNight, "per-transfer cap"),
      dailyNight: nightText(input.spendCaps?.dailyNight ?? current.spendCaps.dailyNight, "daily cap"),
    },
    whitelistedContracts: (input.whitelistedContracts ?? current.whitelistedContracts).map((a) => {
      if (!/^[0-9a-f]{64}$/.test(a)) throw new Error("contract addresses are 64 hex characters");
      return a;
    }),
    blockedAddresses: (input.blockedAddresses ?? current.blockedAddresses).map(String),
    autoDraw: Boolean(input.autoDraw ?? current.autoDraw),
    paused: Boolean(input.paused ?? current.paused),
  };
  p.agents[wallet] = next;
  savePolicy(p);
  return next;
}

export function setBlockedAddresses(list) {
  const p = policy();
  p.blockedAddresses = list.map((b) => ({ address: String(b.address), note: String(b.note ?? "") }));
  savePolicy(p);
  return p.blockedAddresses;
}

export function setTreasuryV3(address) {
  const p = policy();
  p.crewTreasuryV3 = address;
  savePolicy(p);
}

export const crewTreasury = () => policy().crewTreasury;
export const crewTreasuryV3 = () => policy().crewTreasuryV3 ?? null;

// ---------------------------------------------------------------------------
// Tokens and sessions
// ---------------------------------------------------------------------------

/** Makes a standing token for every agent in the policy that lacks one. */
export function ensureAgentTokens() {
  const tokens = readJson(TOKENS_FILE, {});
  let changed = false;
  for (const wallet of Object.keys(policy().agents)) {
    if (!tokens[wallet]) { tokens[wallet] = randomBytes(32).toString("base64url"); changed = true; }
  }
  if (changed) writePrivate(TOKENS_FILE, tokens);
  return TOKENS_FILE;
}

const digest = (token) => createHash("sha256").update(token).digest("hex");
const sameText = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export function sessions() {
  return readJson(SESSIONS_FILE, []);
}

/** A new session for `wallet`. The token is returned once and only its hash is kept. */
export function createSession(wallet, { label, hours, maxRequests, maxNight }) {
  const h = Number(hours);
  if (!(h > 0 && h <= 24 * 30)) throw new Error("a session lasts between an hour and 30 days");
  const token = `mms_${randomBytes(24).toString("base64url")}`;
  const session = {
    id: randomUUID(),
    wallet,
    label: String(label ?? "").slice(0, 60) || "Session",
    tokenHash: digest(token),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + h * 3_600_000).toISOString(),
    maxRequests: Math.max(1, Math.floor(Number(maxRequests ?? 50))),
    maxNight: nightText(maxNight ?? "10", "session NIGHT budget"),
    used: { requests: 0, night: "0" },
    revokedAt: null,
  };
  writePrivate(SESSIONS_FILE, [...sessions(), session]);
  return { session: publicSession(session), token };
}

export function revokeSession(id) {
  const all = sessions();
  const s = all.find((x) => x.id === id);
  if (!s) throw new Error("no such session");
  s.revokedAt ??= new Date().toISOString();
  writePrivate(SESSIONS_FILE, all);
  return publicSession(s);
}

export function publicSession(s) {
  const { tokenHash, ...rest } = s;
  const expired = Date.parse(s.expiresAt) < Date.now();
  return { ...rest, status: s.revokedAt ? "revoked" : expired ? "expired" : "active" };
}

/** Who a bearer token belongs to: `{ wallet, session }` (session null for a standing token). */
export function identify(header) {
  const presented = String(header ?? "").replace(/^Bearer\s+/i, "");
  if (!presented) return null;
  for (const [wallet, token] of Object.entries(readJson(TOKENS_FILE, {}))) {
    if (sameText(token, presented)) return { wallet, session: null };
  }
  const hash = digest(presented);
  const s = sessions().find((x) => sameText(x.tokenHash, hash));
  return s ? { wallet: s.wallet, session: s } : null;
}

/** Counts a request against its session. */
export function chargeSession(id, starSpent) {
  const all = sessions();
  const s = all.find((x) => x.id === id);
  if (!s) return;
  s.used.requests += 1;
  s.used.night = formatNight(toStar(s.used.night) + starSpent);
  writePrivate(SESSIONS_FILE, all);
}

const formatNight = (star) => `${star / STAR_PER_NIGHT}${star % STAR_PER_NIGHT ? "." + (star % STAR_PER_NIGHT).toString().padStart(6, "0").replace(/0+$/, "") : ""}`;

// ---------------------------------------------------------------------------
// The decision
// ---------------------------------------------------------------------------

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

/**
 * What happens to `request` from `wallet`: `{ verdict: "refuse" | "auto" | "approve", reason }`.
 * `history` is every request so far (for the daily cap); `crewAddresses` the roster's
 * addresses; `session` the session it came through, if any.
 */
export function evaluate(wallet, request, history, crewAddresses, session = null) {
  const p = policy();
  const agent = p.agents[wallet];
  if (!agent) return { verdict: "refuse", reason: "no policy for this agent" };
  if (agent.paused) return { verdict: "refuse", reason: "this agent is paused" };

  if (session) {
    if (session.revokedAt) return { verdict: "refuse", reason: "session revoked" };
    if (Date.parse(session.expiresAt) < Date.now()) return { verdict: "refuse", reason: "session expired" };
    if (session.used.requests >= session.maxRequests) return { verdict: "refuse", reason: `session used all ${session.maxRequests} requests` };
  }

  const blocked = new Set([...p.blockedAddresses.map((b) => b.address), ...agent.blockedAddresses]);
  const payee = request.kind === "transfer" ? request.to
    : (request.args ?? []).find((a) => a && typeof a === "object" && "userAddress" in a)?.userAddress;
  if (payee && blocked.has(payee)) return { verdict: "refuse", reason: "recipient is on a blocked list" };

  if (request.kind === "call") {
    const whitelisted = new Set([...agent.whitelistedContracts, p.crewTreasury, p.crewTreasuryV3].filter(Boolean));
    if (!whitelisted.has(request.contractAddress)) return { verdict: "refuse", reason: "contract is not on this agent's whitelist" };
    const isTreasury = request.contractAddress === p.crewTreasury || request.contractAddress === p.crewTreasuryV3;
    if (request.circuit === "draw" && isTreasury) {
      return agent.autoDraw
        ? { verdict: "auto", reason: "treasury draw; the contract enforces this agent's caps on chain" }
        : { verdict: "approve", reason: "draws need approval for this agent" };
    }
    return { verdict: "approve", reason: "whitelisted contract; calls need approval" };
  }
  if (request.kind !== "transfer") return { verdict: "refuse", reason: `agents cannot ${request.kind}` };
  if (request.token && request.token !== NIGHT) return { verdict: "approve", reason: "only NIGHT transfers are approved automatically" };

  const amount = BigInt(request.amount);
  if (session && toStar(session.used.night) + amount > toStar(session.maxNight)) {
    return { verdict: "refuse", reason: `over this session's ${session.maxNight} NIGHT budget` };
  }
  const perTransfer = toStar(agent.spendCaps.perTransferNight);
  const perDay = toStar(agent.spendCaps.dailyNight);
  if (!crewAddresses.has(request.to)) return { verdict: "approve", reason: "recipient is outside the crew" };
  if (amount > perTransfer) return { verdict: "approve", reason: `over the ${agent.spendCaps.perTransferNight} NIGHT per-transfer cap` };
  const spentToday = history
    .filter((r) => r.wallet === wallet && r.kind === "transfer" && r.autoApproved && Date.parse(r.createdAt) >= startOfToday())
    .reduce((sum, r) => sum + BigInt(r.amount), 0n);
  if (spentToday + amount > perDay) return { verdict: "approve", reason: `would pass the ${agent.spendCaps.dailyNight} NIGHT daily cap` };
  return { verdict: "auto", reason: `within ${agent.spendCaps.perTransferNight} NIGHT per transfer and ${agent.spendCaps.dailyNight} NIGHT a day` };
}
