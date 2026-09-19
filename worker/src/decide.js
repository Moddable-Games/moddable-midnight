// One agent's next action, ported from notes/midnight-city/decide.py.
// Priority: 0) do not interrupt a trade walk  1) stay fed (sell goods to afford food)
// 1b) buy the best profession tool the agent qualifies for  2) shed load when overburdened
// 3) deliver a ready contract  4) sell a big pile  5) craft  6) sell surplus
// 7) workers fund Floyd, keeping a food buffer  8) work.
import { FOOD_IDS } from "./food-ids.js";
import { TOOLS } from "./tools.js";

// Cheapest food per hunger point. The server enforced 23 crystal per smoothie while
// `merchants` listed 20 (FINDINGS 15); the tick updates this from failure events.
export const FOOD_MERCHANT = "Central Smoothies Matcha Outlet";
export const DEFAULT_MEAL_COST = 23;
const FOOD_BUFFER_MEALS = 3;

const count = (inv, id) => Number(inv?.[id] ?? 0) || 0;
const hasAll = (inv, reqs) => (reqs ?? []).every((r) => count(inv, r.itemId) >= Number(r.quantity ?? 1));

// agent: roster entry. docs: { inventory, progression, needs } responses.
// opts: { mealCost, sendBlocked, treasuryId, toolOffers: [{ itemId, merchantName, price }] }
export function decide(agent, docs, opts) {
  const invDoc = docs.inventory ?? {};
  const inv = invDoc.inventory ?? {};
  const loadState = invDoc.load?.state ?? "";
  const caps = docs.progression?.capabilities ?? {};
  const recipes = caps.recipes ?? [];
  const contracts = caps.contracts ?? [];
  const skill = docs.progression?.skills?.[agent.skill] ?? {};
  const hunger = docs.needs?.hunger?.state ?? "normal";

  const mealCost = opts.mealCost || DEFAULT_MEAL_COST;
  const crystal = count(inv, "crystal");
  const goods = count(inv, agent.good);
  const sellable = Math.floor(goods / agent.batch) * agent.batch;
  const foods = Object.keys(inv).filter((id) => FOOD_IDS.has(id) && count(inv, id) > 0);

  const status = `L${skill.level ?? "?"} ${agent.skill} xp${skill.xp ?? 0} | hunger=${hunger} | ` +
    `crystal=${crystal} | ${agent.good}=${goods} foods=${foods.length} load=${loadState || "-"}`;
  const result = (label, action) => ({ label, action, status });

  const sell = () => result(`SELL ${sellable}`, {
    kind: "trade", merchantName: agent.merchant, itemId: agent.good, quantity: sellable,
  });
  const work = () => result("WORK", { kind: "perform_job" });

  // 0) a trade walks the agent to the merchant first; a new action would cut it short
  const active = invDoc.agent?.activeAction;
  if (active && !["engage", "perform_job"].includes(active.kind)) {
    return result(`WAIT ${active.kind}`, null);
  }

  // 1) eat, else buy up to two meals, else sell goods to afford one
  if (!["normal", "full", ""].includes(hunger)) {
    if (foods.length) return result("EAT", { kind: "eat" });
    if (crystal >= mealCost) {
      const quantity = Math.min(Math.floor(crystal / mealCost), 2) * mealCost;
      return result(`BUYFOOD ${quantity}`, {
        kind: "trade", merchantName: FOOD_MERCHANT, itemId: "crystal", quantity,
      });
    }
    return sellable > 0 ? sell() : work();
  }

  // 1b) tool up: best tool on sale for our skill, at or below our level, better than what
  // we carry, affordable while keeping one meal. Never buys a second of the same tool.
  const tool = bestToolToBuy(agent, inv, Number(skill.level ?? 0), crystal - mealCost, opts.toolOffers ?? []);
  if (tool) {
    return result(`BUYTOOL ${tool.itemId} ${tool.price}`, {
      kind: "trade", merchantName: tool.merchantName, itemId: "crystal", quantity: tool.price,
    });
  }

  // 2) overburdened agents work at a fraction of speed
  if (loadState === "overburdened" && sellable > 0) return sell();

  // 3) deliver a ready, uncompleted contract
  for (const c of contracts) {
    if (c.completed) continue;
    const ready = c.requirements != null
      ? hasAll(inv, c.requirements)
      : c.skill === agent.skill && goods >= 1; // requirements not inlined: assume the trade good
    if (ready) return result(`DELIVER ${c.contractId}`, { kind: "deliver_contract", contractId: c.contractId });
  }

  // 4) crafting must not starve selling: sell first once the pile passes 5x the threshold
  if (goods >= agent.sellAt * 5 && sellable > 0) return sell();

  // 5) craft an unlocked recipe whose inputs we hold
  for (const r of recipes) {
    const id = r.inputs?.length
      ? (hasAll(inv, r.inputs) ? r.id : null)
      : (Number(r.craftableBatches ?? 0) > 0 ? (r.recipeId ?? r.id) : null);
    if (id) return result(`CRAFT ${id}`, { kind: "craft", recipeId: id, batches: 1 });
  }

  // 6) sell surplus
  if (goods >= agent.sellAt && sellable > 0) return sell();

  // 7) workers fund the treasury, keeping a food buffer (sends have a weekly allowance)
  const buffer = mealCost * FOOD_BUFFER_MEALS;
  if (!agent.isTreasury && crystal > buffer && !opts.sendBlocked) {
    const quantity = crystal - buffer;
    return result(`SEND ${quantity}`, { kind: "crystal_transfer", recipientAgentId: opts.treasuryId, quantity });
  }

  return work();
}

function bestToolToBuy(agent, inv, level, spendable, offers) {
  const held = Object.keys(inv).filter((id) => TOOLS[id]?.skill === agent.skill && count(inv, id) > 0);
  const heldBonus = Math.max(0, ...held.map((id) => TOOLS[id].bonus));
  return offers
    .filter((o) => {
      const t = TOOLS[o.itemId];
      return t && t.skill === agent.skill && t.level <= level && t.bonus > heldBonus && o.price <= spendable;
    })
    .sort((a, b) => TOOLS[b.itemId].bonus - TOOLS[a.itemId].bonus)[0] ?? null;
}
