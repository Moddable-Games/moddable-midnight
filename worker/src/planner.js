// Self-supply for tools nobody sells. Works back from the tool through its recipe chain and
// returns the single next step: gather a raw input, craft an intermediate, or train the
// crafting skill the chain needs. Makes only what is missing, so no surplus builds up.
import { RECIPES, SOURCES_BY_ITEM } from "./recipes.js";
import { TOOLS } from "./tools.js";

// Start on a tool this many levels before the agent can use it, so the crafting skill
// (e.g. smithing 5 for the iron pickaxe) is trained by the time the tool is usable.
const LOOKAHEAD_LEVELS = 3;
const MAX_DEPTH = 6;

const RECIPES_FOR = {};
for (const [id, recipe] of Object.entries(RECIPES)) {
  for (const item of Object.keys(recipe.outputs)) (RECIPES_FOR[item] ??= []).push(id);
}

const count = (inv, id) => Number(inv?.[id] ?? 0) || 0;

// Skills whose tools are worth having: the agent's profession, fishing for food, and any
// other skill it actually practises (contracts spread the crew across skills).
export const toolSkills = (agent, skills) => [...new Set([
  agent.skill,
  "fishing",
  ...Object.entries(skills ?? {}).filter(([, s]) => (s?.xp ?? 0) > 0).map(([name]) => name),
])];

export function heldBonus(inv, skill) {
  return Math.max(0, ...Object.keys(inv)
    .filter((id) => TOOLS[id]?.skill === skill && count(inv, id) > 0)
    .map((id) => TOOLS[id].bonus));
}

// The nearest tool worth crafting: for the agent's own trade (which is its rank) or fishing
// (its food), within reach, better than what we carry, not sold by any merchant (those are
// bought instead, for any skill it practises), and craftable at all. Crafting a tool for a
// side skill costs more work time than the tool ever saves.
export function toolToCraft(agent, inv, skills, soldIds) {
  const level = (skill) => Number(skills?.[skill]?.level ?? 0);
  const craftFor = [agent.skill, "fishing"];
  return Object.entries(TOOLS)
    .filter(([id, t]) => craftFor.includes(t.skill) &&
      t.level <= level(t.skill) + LOOKAHEAD_LEVELS &&
      t.bonus > heldBonus(inv, t.skill) &&
      !soldIds.has(id) &&
      RECIPES_FOR[id])
    .sort(([, a], [, b]) => a.level - b.level)
    .map(([id]) => id)[0] ?? null;
}

// ctx: { inv, skills, nodes: sourceId -> availableNodeIds, round }
// Returns { have } | { act: { label, action } } | { blocked: { skill, chain } } | { stuck: reason }
export function nextStep(item, qty, ctx, depth = 0, chain = []) {
  if (count(ctx.inv, item) >= qty) return { have: true };
  if (depth > MAX_DEPTH) return { stuck: `too deep at ${item}` };
  const level = (skill) => Number(ctx.skills?.[skill]?.level ?? 0);

  // Raw inputs: gather from any source we can use. By sourceId, not nodeId: several sources
  // share one kind of map placement (every crop source lists the same crop beds), and a node
  // gives whatever source the City bound to it, so gathering a listed node for violet herb
  // brought wheat or nothing. With a sourceId the City picks a node that gives that source.
  for (const src of SOURCES_BY_ITEM[item] ?? []) {
    const nodes = ctx.nodes[src.sourceId] ?? [];
    if (nodes.length && level(src.skill) >= src.level) {
      return { act: { label: `GATHER ${item} for ${chain[0] ?? item}`, action: { kind: "gather", sourceId: src.sourceId } } };
    }
  }

  // Crafted inputs: try every recipe that makes the item. A recipe we lack the level for is
  // not worth gathering inputs for yet; it is reported as blocked so a tool plan can train
  // the skill. Otherwise satisfy the inputs first, then craft one batch.
  let blocked = null;
  for (const recipeId of RECIPES_FOR[item] ?? []) {
    const recipe = RECIPES[recipeId];
    const path = [...chain, recipeId];
    if (level(recipe.skill) < recipe.level) {
      blocked ??= { blocked: { skill: recipe.skill, chain: path } };
      continue;
    }
    let missing = null;
    for (const [input, need] of Object.entries(recipe.inputs)) {
      const step = nextStep(input, need, ctx, depth + 1, path);
      if (!step.have) { missing = step; break; }
    }
    if (!missing) return { act: { label: `CRAFT ${recipeId} for ${chain[0] ?? item}`, action: { kind: "craft", recipeId, batches: 1 } } };
    if (missing.act) return missing;
    if (missing.blocked) blocked ??= missing;
  }
  return blocked ?? { stuck: `no source or recipe for ${item}` };
}

// Whether the whole chain for an item can be completed now: held, gatherable from a listed
// node at our level, or craftable at our level from inputs that are themselves feasible.
// Used before starting a contract, so an agent never gathers towards a goal it cannot finish.
export function feasible(item, qty, ctx, depth = 0) {
  if (count(ctx.inv, item) >= qty) return true;
  if (depth > MAX_DEPTH) return false;
  const level = (skill) => Number(ctx.skills?.[skill]?.level ?? 0);
  if ((SOURCES_BY_ITEM[item] ?? []).some((src) => (ctx.nodes[src.sourceId] ?? []).length && level(src.skill) >= src.level)) {
    return true;
  }
  return (RECIPES_FOR[item] ?? []).some((recipeId) => {
    const recipe = RECIPES[recipeId];
    return level(recipe.skill) >= recipe.level &&
      Object.entries(recipe.inputs).every(([input, need]) => feasible(input, need, ctx, depth + 1));
  });
}

// Every recipe reachable from an item's recipe chain.
function chainRecipes(item, seen = new Set()) {
  for (const recipeId of RECIPES_FOR[item] ?? []) {
    if (seen.has(recipeId)) continue;
    seen.add(recipeId);
    for (const input of Object.keys(RECIPES[recipeId].inputs)) chainRecipes(input, seen);
  }
  return seen;
}

// When a tool's chain is blocked on a crafting skill, train it with the lowest-level recipe
// of that skill anywhere in the chain (e.g. smelt_metal_bar for smithing). The by-product is
// XP; the items are the few spare inputs the tool will need anyway.
export function trainStep(toolId, blocked, ctx) {
  const level = Number(ctx.skills?.[blocked.skill]?.level ?? 0);
  const trainer = [...chainRecipes(toolId)]
    .map((id) => [id, RECIPES[id]])
    .filter(([, r]) => r.skill === blocked.skill && r.level <= level)
    .sort(([, a], [, b]) => a.level - b.level)[0];
  if (!trainer) return null;
  const [recipeId, recipe] = trainer;
  const [output] = Object.keys(recipe.outputs);
  const step = nextStep(output, count(ctx.inv, output) + 1, ctx, 0, [toolId]);
  if (!step.act) return null;
  return { label: `TRAIN ${blocked.skill}: ${step.act.label}`, action: step.act.action };
}
