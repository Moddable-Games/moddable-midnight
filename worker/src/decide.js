// One agent's next action, ported from notes/midnight-city/decide.py.
// Priority: 0) do not interrupt a trade walk  1) stay fed: eat early, fish when out of food,
// buy food only as a fallback  1a) keep a small fish stock  1b) buy the best tool on sale
// 1c) Floyd funds a worker's tool  2) shed load when overburdened  3) deliver a ready contract
// 4) sell a big pile  5) work a contract, and self-supply a tool nobody sells (gather, craft,
// train); the two alternate by round so neither starves the other
// 6) sell surplus  7) workers fund Floyd, keeping a food buffer  8) work.
// Nothing is crafted except for a tool plan, a contract or food, so no surplus builds up.
import { FOOD_IDS } from "./food-ids.js";
import { TOOLS } from "./tools.js";
import { toolToCraft, nextStep, trainStep, toolSkills, heldBonus } from "./planner.js";
import { deliverable, pursue } from "./contract-plan.js";
import { CONTRACTS } from "./contracts.js";

// Cheapest food per hunger point. The server enforced 23 crystal per smoothie while
// `merchants` listed 20 (FINDINGS 15); the tick updates this from failure events.
export const FOOD_MERCHANT = "Central Smoothies Matcha Outlet";
export const DEFAULT_MEAL_COST = 23;
const FOOD_BUFFER_MEALS = 3;

// Fishing is free: Canal Eddy needs no rod at fishing level 1, and each gather yields one
// fish, one river eel and one canal carp. One fish restored about 50 hunger in play.
// Never cook: cooked_fish cannot be eaten even though the game lists it as consumable
// (FINDINGS 22), so cooking destroys the crew's food.
const FISHING_SOURCE = "canal_eddy";
const EAT_AT = 45;      // eat before "hungry"; a fish restored about 50 in play
const FOOD_STOCK = 3;   // about a day of fish at ~100 hunger a day

const count = (inv, id) => Number(inv?.[id] ?? 0) || 0;
const hasAll = (inv, reqs) => (reqs ?? []).every((r) => count(inv, r.itemId) >= Number(r.quantity ?? 1));

// agent: roster entry. docs: { inventory, progression, needs } responses.
// opts: { mealCost, sendBlocked, treasuryId, round, toolOffers: [{ itemId, merchantName, price }],
//         fundRequests: { workerId: crystal } (treasury only), inedible: [itemId],
//         movedFor: contractId we have already travelled to, delivered: [contractId],
//         skipContracts: { contractId: until } goals that stopped making progress,
//         buyers: [{ itemId, merchantName, batch }] merchants that buy items for crystal }
export function decide(agent, docs, opts) {
  const invDoc = docs.inventory ?? {};
  const inv = invDoc.inventory ?? {};
  const loadState = invDoc.load?.state ?? "";
  const caps = docs.progression?.capabilities ?? {};
  const recipes = caps.recipes ?? [];
  const contracts = caps.contracts ?? [];
  const skill = docs.progression?.skills?.[agent.skill] ?? {};
  const hunger = docs.needs?.hunger?.state ?? "normal";
  const hungerValue = Number(docs.needs?.hunger?.value ?? 0);
  const fishingNodes = (caps.sources ?? [])
    .find((src) => src.sourceId === FISHING_SOURCE && !src.failureReason)?.availableNodeIds ?? [];

  const mealCost = opts.mealCost || DEFAULT_MEAL_COST;
  const crystal = count(inv, "crystal");
  const goods = count(inv, agent.good);
  const sellable = Math.floor(goods / agent.batch) * agent.batch;
  const inedible = new Set(opts.inedible ?? []);
  const foods = Object.keys(inv).filter((id) => FOOD_IDS.has(id) && !inedible.has(id) && count(inv, id) > 0);
  const foodStock = foods.reduce((sum, id) => sum + count(inv, id), 0);

  const status = `L${skill.level ?? "?"} ${agent.skill} xp${skill.xp ?? 0} | hunger=${hunger}(${hungerValue}) | ` +
    `crystal=${crystal} | ${agent.good}=${goods} food=${foodStock} load=${loadState || "-"}`;
  const result = (label, action) => ({ label, action, status });

  const sell = () => result(`SELL ${sellable}`, {
    kind: "trade", merchantName: agent.merchant, itemId: agent.good, quantity: sellable,
  });
  const work = () => result("WORK", { kind: "perform_job" });
  const fish = () => {
    const nodeId = fishingNodes[(opts.round ?? 0) % fishingNodes.length];
    return result(`FISH ${nodeId}`, { kind: "gather", nodeId });
  };

  // 0) a trade walks the agent to the merchant first; a new action would cut it short
  const active = invDoc.agent?.activeAction;
  if (active && !["engage", "perform_job"].includes(active.kind)) {
    return result(`WAIT ${active.kind}`, null);
  }

  // 1) eat early; when out of food, fish; buy (or sell to afford) only if fishing is unavailable
  const hungry = !["normal", "full", ""].includes(hunger);
  if (foods.length && (hungry || hungerValue >= EAT_AT)) return result("EAT", { kind: "eat" });
  if (hungry) {
    if (fishingNodes.length) return fish();
    if (crystal >= mealCost) {
      const quantity = Math.min(Math.floor(crystal / mealCost), 2) * mealCost;
      return result(`BUYFOOD ${quantity}`, {
        kind: "trade", merchantName: FOOD_MERCHANT, itemId: "crystal", quantity,
      });
    }
    return sellable > 0 ? sell() : work();
  }

  // 1a) keep a small fish stock so nobody ever needs to buy food
  if (foodStock < FOOD_STOCK && fishingNodes.length) return fish();

  // 1b) buy the best tool on sale for a useful skill; if we cannot afford it, ask the treasury
  const skills = docs.progression?.skills ?? {};
  const wanted = bestToolOnSale(agent, inv, skills, opts.toolOffers ?? []);
  const spendable = crystal - mealCost;
  const fundRequest = wanted && wanted.price > spendable ? wanted.price - spendable : 0;
  const withFund = (r) => ({ ...r, fundRequest });
  if (wanted && !fundRequest) {
    return result(`BUYTOOL ${wanted.itemId} ${wanted.price}`, {
      kind: "trade", merchantName: wanted.merchantName, itemId: "crystal", quantity: wanted.price,
    });
  }

  // 1c) the treasury covers a worker's shortfall for a tool on sale, keeping its own buffer
  if (agent.isTreasury && !opts.sendBlocked) {
    for (const [workerId, amount] of Object.entries(opts.fundRequests ?? {})) {
      if (crystal - mealCost * FOOD_BUFFER_MEALS >= amount) {
        return result(`FUND ${workerId.slice(-6)} ${amount}`, { kind: "crystal_transfer", recipientAgentId: workerId, quantity: amount });
      }
    }
  }

  // 2) overburdened agents work at a fraction of speed
  if (loadState === "overburdened") {
    if (sellable > 0) return withFund(sell());
    // Nothing of our own trade good: shift whatever else a merchant will take.
    const spare = (opts.buyers ?? [])
      .map((b) => ({ ...b, qty: Math.floor(count(inv, b.itemId) / b.batch) * b.batch }))
      .filter((b) => b.qty > 0)
      .sort((a, b) => b.qty - a.qty)[0];
    if (spare) {
      return withFund(result(`DUMP ${spare.itemId} ${spare.qty}`, {
        kind: "trade", merchantName: spare.merchantName, itemId: spare.itemId, quantity: spare.qty,
      }));
    }
  }

  // 3) deliver a contract whose goods we hold (the API only lists it once we do)
  // Progression is read once per tick, so a contract delivered this tick would still look
  // outstanding to the later rounds; our own record of deliveries covers the gap.
  const completed = [...(docs.progression?.completedContractIds ?? []), ...(opts.delivered ?? [])];
  // deliver_contract does not walk the agent to the contract area (FINDINGS 23), so move
  // first, then deliver on a later round once we are standing there.
  const ready = deliverable(inv, skills, completed, FOOD_STOCK);
  if (ready) {
    if (opts.movedFor === ready) {
      return withFund(result(`DELIVER ${ready}`, { kind: "deliver_contract", contractId: ready }));
    }
    const area = CONTRACTS[ready].area;
    return withFund({
      ...result(`GOTO ${area} for ${ready.slice(0, 30)}`, { kind: "move_to", destination: { areaId: area } }),
      movingFor: ready,
    });
  }

  // 4) crafting must not starve selling: sell first once the pile passes 5x the threshold
  if (goods >= agent.sellAt * 5 && sellable > 0) return withFund(sell());

  // 5) a contract step and a tool step, alternating by round so neither starves the other
  const ctx = { inv, skills, nodes: nodesBySource(caps), round: opts.round, foodFloor: FOOD_STOCK, skip: opts.skipContracts ?? {} };
  const toolPlan = () => {
    const soldIds = new Set((opts.toolOffers ?? []).map((o) => o.itemId));
    const toolId = toolToCraft(agent, inv, skills, soldIds);
    if (!toolId) return null;
    const step = nextStep(toolId, 1, ctx, 0, [toolId]);
    return step.act ?? (step.blocked ? trainStep(toolId, step.blocked, ctx) : null);
  };
  const contractPlan = () => pursue(ctx, completed);
  const order = (opts.round ?? 1) % 3 === 0 ? [toolPlan, contractPlan] : [contractPlan, toolPlan];
  for (const plan of order) {
    const chosen = plan();
    if (chosen) return withFund({ ...result(chosen.label, chosen.action), goal: chosen.goal });
  }

  // 6) sell surplus
  if (goods >= agent.sellAt && sellable > 0) return withFund(sell());

  // 7) workers fund the treasury, keeping a food buffer (sends have a weekly allowance)
  const buffer = mealCost * FOOD_BUFFER_MEALS;
  if (!agent.isTreasury && crystal > buffer && !opts.sendBlocked && !fundRequest) {
    const quantity = crystal - buffer;
    return result(`SEND ${quantity}`, { kind: "crystal_transfer", recipientAgentId: opts.treasuryId, quantity });
  }

  return withFund(work());
}

const nodesBySource = (caps) => Object.fromEntries((caps.sources ?? [])
  .filter((src) => !src.failureReason)
  .map((src) => [src.sourceId, src.availableNodeIds ?? []]));

// The best tool on sale in a useful skill that the agent can use now and does not already
// beat, regardless of price (the caller decides between buying and asking for funds).
function bestToolOnSale(agent, inv, skills, offers) {
  const level = (skill) => Number(skills?.[skill]?.level ?? 0);
  return offers
    .filter((o) => {
      const t = TOOLS[o.itemId];
      return t && toolSkills(agent, skills).includes(t.skill) && t.level <= level(t.skill) && t.bonus > heldBonus(inv, t.skill);
    })
    .sort((a, b) => TOOLS[b.itemId].bonus - TOOLS[a.itemId].bonus)[0] ?? null;
}
