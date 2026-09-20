// Contracts as a goal, not an accident. The progression API only lists a contract once the
// agent holds the goods, so candidates come from the content table: at or below the agent's
// level in that contract's skill, not already completed, and reachable with one planner step.
import { CONTRACTS } from "./contracts.js";
import { nextStep } from "./planner.js";
import { FOOD_IDS } from "./food-ids.js";

const MAX_CANDIDATES = 12;   // keep the per-tick planning cheap

const count = (inv, id) => Number(inv?.[id] ?? 0) || 0;
const holdsAll = (inv, reqs) => reqs.every((r) => count(inv, r.itemId) >= r.quantity);

// Contracts we could still do: right level, not spent. Best value first (XP plus crystal),
// since every one takes a single delivery.
export function candidates(skills, completed) {
  const done = new Set(completed ?? []);
  const level = (skill) => Number(skills?.[skill]?.level ?? 0);
  return Object.entries(CONTRACTS)
    .filter(([id, c]) => !done.has(id) && c.level <= level(c.skill))
    .sort(([, a], [, b]) => (b.xp + b.crystal * 10) - (a.xp + a.crystal * 10));
}

// A contract whose goods we already hold: deliver it now. Food is only handed over when the
// stock can spare it, so a delivery never leaves an agent hungry.
export function deliverable(inv, skills, completed, foodFloor = 0) {
  return candidates(skills, completed)
    .find(([, c]) => holdsAll(inv, c.requirements) && sparesFood(inv, c.requirements, foodFloor))?.[0] ?? null;
}

function sparesFood(inv, reqs, foodFloor) {
  const spend = reqs.filter((r) => FOOD_IDS.has(r.itemId)).reduce((sum, r) => sum + r.quantity, 0);
  if (!spend) return true;
  const stock = Object.keys(inv).filter((id) => FOOD_IDS.has(id)).reduce((sum, id) => sum + count(inv, id), 0);
  return stock - spend >= foodFloor;
}

// Otherwise the next gather or craft step towards the most valuable reachable contract.
// ctx: { inv, skills, nodes, round } as used by the planner.
export function pursue(ctx, completed) {
  const skip = ctx.skip ?? {};
  let checked = 0;
  for (const [id, contract] of candidates(ctx.skills, completed)) {
    if (checked >= MAX_CANDIDATES) break;
    if (holdsAll(ctx.inv, contract.requirements)) continue;
    if ((skip[id] ?? 0) > Date.now()) continue; // goal that stopped making progress
    if (!sparesFood(ctx.inv, contract.requirements, ctx.foodFloor ?? 0)) continue;
    checked += 1;
    for (const req of contract.requirements) {
      if (count(ctx.inv, req.itemId) >= req.quantity) continue;
      const step = nextStep(req.itemId, req.quantity, ctx, 0, [id]);
      // Skip contracts we cannot reach (no node for the item, or a recipe level we lack).
      if (step.act) return { goal: id, label: `CONTRACT ${id.slice(0, 34)}: ${step.act.label}`, action: step.act.action };
      break;
    }
  }
  return null;
}
