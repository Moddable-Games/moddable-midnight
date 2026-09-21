// Midnight City crew: an always-on loop that works, earns and talks for three agents.
// A Cron Trigger runs one tick per minute; state that must outlive a tick lives in KV.
import { createClient } from "./control.js";
import { runTick } from "./crew.js";
import { DEFAULT_MEAL_COST } from "./decide.js";

const STATE_KEY = "state";

function emptyState() {
  return {
    paused: false,         // legacy switch; prefer the separate "paused" key
    mealCost: DEFAULT_MEAL_COST,
    noSendUntil: {},       // agent name -> ms; crystal transfers hit a weekly allowance
    backoffUntil: {},      // agent name -> ms; new conversations are rate limited
    queue: {},             // agent name -> [{ target, text }] late replies still to send
    signedOff: {},         // agent name -> thread ids we have closed politely
    priceOverride: {},     // merchant name -> price the server enforced over the listing
    fundRequests: {},      // worker id -> crystal short for a tool on sale; the treasury pays
    inedible: ["cooked_fish"], // items the game refuses to eat despite listing them as food
    movedFor: {},          // agent name -> contract whose area it has travelled to
    delivered: {},         // agent name -> contracts we delivered (progression lags a tick)
    skipContracts: {},     // agent name -> { contractId: until } goals that made no progress
    goalTries: {},         // agent name -> { goal, tries } progress counter for the current goal
    contentVersion: null,  // game content hash; a change means the game shipped an update
  };
}

async function loadState(env) {
  const saved = await env.CREW_STATE.get(STATE_KEY, "json");
  return { ...emptyState(), ...(saved ?? {}) };
}

async function tick(env) {
  const state = await loadState(env);
  const before = JSON.stringify(state);
  const lines = [];
  const log = (line) => { lines.push(line); console.log(line); };

  // Pause without touching state: wrangler kv key put paused 1 (delete the key to resume).
  if (state.paused || (await env.CREW_STATE.get("paused"))) {
    log("paused");
    return lines;
  }

  const client = createClient(env);
  client.charge(3); // the KV reads above and the write below
  await runTick(env, client, state, log);

  // Free KV allows 1,000 writes a day and a tick runs 1,440 times, so write only on change.
  if (JSON.stringify(state) !== before) await env.CREW_STATE.put(STATE_KEY, JSON.stringify(state));
  log(`subrequests left ${client.remaining()}`);
  return lines;
}

export default {
  async scheduled(controller, env, ctx) {
    await tick(env);
  },

  // Read-only status: queue sizes and flags, no tokens, no message text.
  async fetch(request, env) {
    const state = await loadState(env);
    const queued = Object.fromEntries(Object.entries(state.queue).map(([k, v]) => [k, v.length]));
    return Response.json({
      paused: state.paused,
      mealCost: state.mealCost,
      queued,
      contentVersion: state.contentVersion,
      noSendUntil: state.noSendUntil,
      backoffUntil: state.backoffUntil,
    });
  },
};
