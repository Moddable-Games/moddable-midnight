// The agents' own route into the daemon, and the limits that decide what needs a human.
//
// Each agent authenticates with a bearer token, which binds it to its own wallet: it can
// spend only from that wallet, whatever it asks for. The policy (agent-policy.json, public)
// then decides whether a request runs at once or waits for the organiser in the wallet page:
//
//   transfer  NIGHT to another crew wallet, at most autoApproveNight each and dailyAutoNight
//             a day in total, runs at once. Anything larger, or to an address outside the
//             crew, waits for approval.
//   draw      the agent's allowance from the crew treasury, paid to its own address. Runs at
//             once when autoDraw is set: the contract already limits it to one per period.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { randomBytes, timingSafeEqual } from "node:crypto";

const STATE_DIR = new URL("./state/", import.meta.url).pathname;
const TOKENS_FILE = STATE_DIR + "agent-tokens.json";
const POLICY = JSON.parse(readFileSync(new URL("./agent-policy.json", import.meta.url), "utf8"));
const STAR_PER_NIGHT = 1_000_000n;

export const crewTreasury = () => POLICY.crewTreasury;

/** Makes a token for every agent in the policy that lacks one. Tokens never leave the state dir. */
export function ensureAgentTokens() {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  const tokens = existsSync(TOKENS_FILE) ? JSON.parse(readFileSync(TOKENS_FILE, "utf8")) : {};
  let changed = false;
  for (const wallet of Object.keys(POLICY.agents)) {
    if (!tokens[wallet]) { tokens[wallet] = randomBytes(32).toString("base64url"); changed = true; }
  }
  if (changed) writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), { mode: 0o600 });
  return TOKENS_FILE;
}

/** The agent wallet a bearer token belongs to, or null. */
export function agentForToken(header) {
  const presented = Buffer.from(String(header ?? "").replace(/^Bearer\s+/i, ""));
  if (!presented.length || !existsSync(TOKENS_FILE)) return null;
  const tokens = JSON.parse(readFileSync(TOKENS_FILE, "utf8"));
  for (const [wallet, token] of Object.entries(tokens)) {
    const expected = Buffer.from(token);
    if (expected.length === presented.length && timingSafeEqual(expected, presented)) return wallet;
  }
  return null;
}

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

/**
 * Whether `request` from `wallet` may run without a human, and why. `history` is every
 * request so far, used for the daily total; `crewAddresses` are the roster's addresses.
 */
export function evaluate(wallet, request, history, crewAddresses) {
  const policy = POLICY.agents[wallet];
  if (!policy) return { auto: false, reason: "no policy for this agent" };

  if (request.kind === "call" && request.circuit === "draw") {
    return policy.autoDraw
      ? { auto: true, reason: "treasury draw; the contract allows one per period" }
      : { auto: false, reason: "draws need approval for this agent" };
  }
  if (request.kind !== "transfer") return { auto: false, reason: `${request.kind} always needs approval` };
  if (request.token && request.token !== "0".repeat(64)) return { auto: false, reason: "only NIGHT transfers are approved automatically" };

  const amount = BigInt(request.amount);
  const perTransfer = BigInt(policy.autoApproveNight) * STAR_PER_NIGHT;
  const perDay = BigInt(policy.dailyAutoNight) * STAR_PER_NIGHT;
  if (!crewAddresses.has(request.to)) return { auto: false, reason: "recipient is outside the crew" };
  if (amount > perTransfer) return { auto: false, reason: `over the ${policy.autoApproveNight} NIGHT auto-approve limit` };
  const spentToday = history
    .filter((r) => r.wallet === wallet && r.kind === "transfer" && r.autoApproved && Date.parse(r.createdAt) >= startOfToday())
    .reduce((sum, r) => sum + BigInt(r.amount), 0n);
  if (spentToday + amount > perDay) return { auto: false, reason: `would pass the ${policy.dailyAutoNight} NIGHT daily auto-approve limit` };
  return { auto: true, reason: `within ${policy.autoApproveNight} NIGHT per transfer and ${policy.dailyAutoNight} NIGHT a day` };
}
