// The three-agent crew. One tick = three action rounds 20s apart, with replies after the
// first round. Actions finish in seconds (FINDINGS F1), so how often we act sets how busy
// the crew is; one action a minute left agents idle for most of it.
import { decide } from "./decide.js";
import { conversationTurn } from "./replies.js";
import { TOOLS } from "./tools.js";

// Same roster as the laptop daemon (~/.midnight-city/run-crew.sh).
export const CREW = [
  { name: "Floyd", id: "user-agent-u4gfp92xeor3g2a", skill: "hacking", good: "meme_coin",
    merchant: "Central Crypto Merchant", batch: 1, sellAt: 15, isTreasury: true },
  { name: "Tzilo", id: "user-agent-5wzs7d9q4cdz5gi", skill: "mining", good: "ore",
    merchant: "Central Merchant East", batch: 3, sellAt: 9, isTreasury: false },
  { name: "FooFoo", id: "user-agent-oyhuxtu984deja8", skill: "woodcutting", good: "log",
    merchant: "Central Merchant West", batch: 5, sellAt: 10, isTreasury: false },
];
const TREASURY_ID = CREW.find((a) => a.isTreasury).id;

const ROUNDS = 3;
const ROUND_GAP_MS = 20_000;
const ROUND_COST = 2;           // inventory + action, per agent
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const CHECKED_KINDS = new Set(["trade", "crystal_transfer"]); // failures we learn from

export async function runTick(env, client, state, log) {
  const started = Date.now();
  const toolOffers = await readToolOffers(client, state).catch(() => []);

  // Open each agent's lease and read its progression once per tick. The lease lasts five
  // minutes and the next tick's session replaces it, so there is no release call.
  const turns = [];
  for (const agent of rotate(CREW)) {
    try {
      const lease = await client.openSession(agent.id);
      // Hunger moves about one point every 14 minutes, so needs is read once per tick too.
      const [progression, needs] = await Promise.all([client.read(agent.id, "progression"), client.read(agent.id, "needs")]);
      turns.push({ agent, lease, progression, needs });
    } catch (error) {
      log(`${agent.name}: session error ${String(error.message ?? error).slice(0, 160)}`);
    }
  }

  for (let round = 0; round < ROUNDS; round++) {
    if (round > 0) {
      const wait = started + round * ROUND_GAP_MS - Date.now();
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    }
    if (client.remaining() < turns.length * ROUND_COST) {
      log(`round ${round + 1}: skipped, subrequest budget low`);
      break;
    }
    for (const turn of turns) {
      await safely(log, turn.agent, () => actRound(client, turn, state, toolOffers, log, round + 1));
    }
    if (round === 0) {
      for (const turn of turns) {
        await safely(log, turn.agent, () => conversationTurn(env, client, turn.lease, turn.agent, state, log));
      }
    }
  }
}

async function actRound(client, { agent, lease, progression, needs }, state, toolOffers, log, round) {
  const inventory = await client.read(agent.id, "inventory");
  const decision = decide(agent, { inventory, progression, needs }, {
    mealCost: state.mealCost,
    sendBlocked: (state.noSendUntil[agent.name] ?? 0) > Date.now(),
    treasuryId: TREASURY_ID,
    round,
    toolOffers,
    fundRequests: agent.isTreasury ? (state.fundRequests ?? {}) : undefined,
  });

  // Workers post their shortfall for a tool on sale; the treasury pays it on its turn.
  state.fundRequests ??= {};
  if (!agent.isTreasury) {
    if (decision.fundRequest > 0) state.fundRequests[agent.id] = decision.fundRequest;
    else delete state.fundRequests[agent.id];
  }

  // Re-sending work while the agent walks to or works a node restarts the job; let it run.
  const active = inventory?.agent?.activeAction;
  if (["perform_job", "gather"].includes(decision.action?.kind) && active?.kind === "engage" &&
      ["traveling", "active"].includes(active.phase)) {
    log(`r${round} ${agent.name}: BUSY ${active.activity} ${active.phase} | ${decision.status}`);
    return;
  }

  let outcome = "";
  if (decision.action) {
    const polls = CHECKED_KINDS.has(decision.action.kind) ? 1 : 0;
    const failure = await client.actAndCheck(lease, decision.action, polls);
    if (failure) {
      outcome = ` -> failed: ${failure}`;
      learnFromFailure(agent, decision.action, failure, state);
    } else if (agent.isTreasury && decision.action.kind === "crystal_transfer") {
      delete state.fundRequests[decision.action.recipientAgentId];
    }
  }
  log(`r${round} ${agent.name}: ${decision.label}${outcome} | ${decision.status}`);
}

// Tools on sale for crystal, at the enforced price where a failure has taught us one.
async function readToolOffers(client, state) {
  const merchants = (await client.merchants()) ?? [];
  return merchants
    .filter((m) => TOOLS[m.offer?.paysItemId] && m.offer?.acceptsItemId === "crystal")
    .map((m) => ({
      itemId: m.offer.paysItemId,
      merchantName: m.name,
      price: state.priceOverride?.[m.name] ?? m.offer.acceptsQuantity,
    }));
}

// Failures that should change future decisions (FINDINGS 15 and 17).
function learnFromFailure(agent, action, reason, state) {
  const price = /multiple of (\d+) crystal/i.exec(reason);
  if (price && action.itemId === "crystal") {
    if (/Smoothies/.test(action.merchantName)) state.mealCost = Number(price[1]);
    else (state.priceOverride ??= {})[action.merchantName] = Number(price[1]);
  }
  if (/weekly allowance/i.test(reason)) state.noSendUntil[agent.name] = Date.now() + WEEK_MS;
}

// Rotate who goes first each minute so a tight budget never starves the same agent.
function rotate(list) {
  const start = Math.floor(Date.now() / 60000) % list.length;
  return [...list.slice(start), ...list.slice(0, start)];
}

async function safely(log, agent, fn) {
  try {
    await fn();
  } catch (error) {
    log(`${agent.name}: error ${String(error.message ?? error).slice(0, 200)}`);
  }
}
