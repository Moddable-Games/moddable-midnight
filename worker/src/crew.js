// The three-agent crew. One tick = three action rounds 20s apart, with replies after the
// first round. Actions finish in seconds (FINDINGS F1), so how often we act sets how busy
// the crew is; one action a minute left agents idle for most of it.
import { decide } from "./decide.js";
import { conversationTurn } from "./replies.js";
import { TOOLS } from "./tools.js";
import { FOOD_IDS } from "./food-ids.js";

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
const GOAL_TRIES = 12;          // give up on a contract goal that stops making progress
const SKIP_MS = 6 * 60 * 60 * 1000;

const CHECKED_KINDS = new Set(["trade", "crystal_transfer", "eat", "deliver_contract"]); // failures we learn from

export async function runTick(env, client, state, log) {
  const started = Date.now();
  const { toolOffers, buyers } = await readMerchants(client, state).catch(() => ({ toolOffers: [], buyers: [] }));

  // Open each agent's lease and read its progression once per tick. The lease lasts five
  // minutes and the next tick's session replaces it, so there is no release call.
  const turns = [];
  for (const agent of rotate(CREW)) {
    try {
      const lease = await client.openSession(agent.id);
      // Hunger moves about one point every 14 minutes, so needs is read once per tick too.
      const [progression, needs] = await Promise.all([client.read(agent.id, "progression"), client.read(agent.id, "needs")]);
      turns.push({ agent, lease, progression, needs });
      noteContentVersion(progression, state, log);
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
      await safely(log, turn.agent, () => actRound(client, turn, state, { toolOffers, buyers }, log, round + 1));
    }
    if (round === 0) {
      for (const turn of turns) {
        await safely(log, turn.agent, () => conversationTurn(env, client, turn.lease, turn.agent, state, log));
      }
    }
  }
}

async function actRound(client, { agent, lease, progression, needs }, state, { toolOffers, buyers }, log, round) {
  const inventory = await client.read(agent.id, "inventory");
  const decision = decide(agent, { inventory, progression, needs }, {
    mealCost: state.mealCost,
    sendBlocked: (state.noSendUntil[agent.name] ?? 0) > Date.now(),
    treasuryId: TREASURY_ID,
    round,
    toolOffers,
    buyers,
    fundRequests: agent.isTreasury ? (state.fundRequests ?? {}) : undefined,
    inedible: state.inedible ?? [],
    movedFor: (state.movedFor ?? {})[agent.name],
    delivered: (state.delivered ?? {})[agent.name] ?? [],
    skipContracts: (state.skipContracts ?? {})[agent.name] ?? {},
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

  // A goal whose next step repeats without the item ever arriving is unreachable in practice
  // (content and server disagree on some node yields), so drop it for a while and move on.
  // Only the same step repeating counts: a long chain (gather, gather, craft, move, deliver)
  // is progress, however many actions it takes.
  state.goalTries ??= {};
  if (decision.goal) {
    const last = state.goalTries[agent.name];
    const tries = last?.goal === decision.goal && last?.step === decision.label ? last.tries + 1 : 1;
    state.goalTries[agent.name] = { goal: decision.goal, step: decision.label, tries };
    if (tries > GOAL_TRIES) {
      state.skipContracts ??= {};
      (state.skipContracts[agent.name] ??= {})[decision.goal] = Date.now() + SKIP_MS;
      delete state.goalTries[agent.name];
      log(`${agent.name}: giving up on ${decision.goal} for now`);
    }
  }

  // Remember which contract we travelled for, so the next round delivers instead of moving.
  state.movedFor ??= {};
  if (decision.movingFor) state.movedFor[agent.name] = decision.movingFor;

  let outcome = "";
  if (decision.action) {
    const polls = CHECKED_KINDS.has(decision.action.kind) ? 1 : 0;
    const failure = await client.actAndCheck(lease, decision.action, polls);
    if (failure) {
      outcome = ` -> failed: ${failure}`;
      learnFromFailure(agent, decision.action, failure, state, inventory);
    } else if (decision.action.kind === "deliver_contract") {
      delete state.movedFor[agent.name];
      state.delivered ??= {};
      const done = [...new Set([...(state.delivered[agent.name] ?? []), decision.action.contractId])];
      state.delivered[agent.name] = done.slice(-60);
    } else if (agent.isTreasury && decision.action.kind === "crystal_transfer") {
      delete state.fundRequests[decision.action.recipientAgentId];
    }
  }
  log(`r${round} ${agent.name}: ${decision.label}${outcome} | ${decision.status}`);
}

// What the merchants will sell us (tools) and what they will buy (to shed load).
async function readMerchants(client, state) {
  const merchants = (await client.merchants()) ?? [];
  const toolOffers = merchants
    .filter((m) => TOOLS[m.offer?.paysItemId] && m.offer?.acceptsItemId === "crystal")
    .map((m) => ({
      itemId: m.offer.paysItemId,
      merchantName: m.name,
      price: state.priceOverride?.[m.name] ?? m.offer.acceptsQuantity,
    }));
  const buyers = merchants
    .filter((m) => m.offer?.paysItemId === "crystal" && m.offer?.acceptsItemId !== "crystal")
    .map((m) => ({ itemId: m.offer.acceptsItemId, merchantName: m.name, batch: m.trade?.batchMultiple ?? 1 }));
  return { toolOffers, buyers };
}

// The game ships content changes; log when its version moves so patches are visible.
function noteContentVersion(progression, state, log) {
  const version = progression?.capabilities?.contentVersion;
  if (version && version !== state.contentVersion) {
    log(`game content version changed: ${String(state.contentVersion).slice(0, 8)} -> ${version.slice(0, 8)}`);
    state.contentVersion = version;
  }
}

// Failures that should change future decisions (FINDINGS 15 and 17).
function learnFromFailure(agent, action, reason, state, inventory) {
  // Delivered from the wrong place: travel again before the next attempt (FINDINGS 23).
  if (action.kind === "deliver_contract") delete state.movedFor[agent.name];
  // The game refused food we counted as edible: never count those items again (FINDINGS 22).
  if (action.kind === "eat" && /edible/i.test(reason)) {
    state.inedible = [...new Set([...(state.inedible ?? []), ...edibleLooking(inventory, state)])];
  }
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

// Items we currently count as food, used to mark the culprits when an eat is refused.
function edibleLooking(inventory, state) {
  const inv = inventory?.inventory ?? {};
  const known = new Set(state.inedible ?? []);
  return Object.keys(inv).filter((id) => FOOD_IDS.has(id) && !known.has(id) && Number(inv[id]) > 0);
}
