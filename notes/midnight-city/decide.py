#!/usr/bin/env python3
# Decide one agent's next action from inventory/progression/needs JSON.
# Priority: 1) stay fed (sell goods to afford food if broke)  2) shed load when
# overburdened  3) complete a ready contract  4) craft once unlocked  5) sell surplus
# 6) workers funnel crystal to the treasury, keeping a food buffer  7) grind XP.
import sys, json, os

inv_f, prog_f, needs_f, mainskill, good, batch, sellat, isfloyd = sys.argv[1:9]
batch, sellat, isfloyd = int(batch), int(sellat), isfloyd == "1"

MEAL_COST = 23        # Central Smoothies Matcha Outlet enforces multiples of 23 (listing says 20);
                      # one smoothie restored 20 hunger in play (content says 46). Cheapest per point.
FOOD_BUFFER = 70      # workers keep enough for three smoothies before funnelling to Floyd

def load(f):
    try:
        return json.load(open(f))
    except Exception:
        return {}

# Food = any item with hungerRestore > 0 in the game content dump (100+ items).
CONTENT = os.path.expanduser("~/.midnight-city/notes/game-content.json")
FOOD_IDS = {i["id"] for i in load(CONTENT).get("items", [])
            if ((i.get("consumable") or {}).get("hungerRestore") or 0) > 0}
FOOD_HINTS = ("food", "fish", "meat", "ration", "brew", "stew", "blend", "bun", "soup")

inv_doc = load(inv_f)
inv = inv_doc.get("inventory", {}) or {}
load_state = (inv_doc.get("load", {}) or {}).get("state", "")
prog = load(prog_f)
needs = load(needs_f)

crystal = int(inv.get("crystal", 0) or 0)
goods = int(inv.get(good, 0) or 0)
sellable = (goods // batch) * batch
skills = prog.get("skills", {}) or {}
lvl = skills.get(mainskill, {}).get("level", "?")
xp = skills.get(mainskill, {}).get("xp", 0)
caps = prog.get("capabilities", {}) or {}
recipes = caps.get("recipes", []) or []
contracts = caps.get("contracts", []) or []
hunger = (needs.get("hunger", {}) or {}).get("state", "normal")

def is_food(k):
    return k in FOOD_IDS or (not FOOD_IDS and any(h in k for h in FOOD_HINTS))
foods = [k for k in inv if is_food(k) and int(inv.get(k, 0) or 0) > 0]

def has_all(reqs):
    return all(int(inv.get(r.get("itemId"), 0)) >= int(r.get("quantity", 1)) for r in (reqs or []))

action, detail = "WORK", ""

# crystal transfers have a weekly allowance; run-crew.sh drops a flag file when it runs out
import time
flag = os.path.expanduser(f"~/.midnight-city/tmp/no-send-{os.environ.get('NM', '')}")
send_blocked = os.path.exists(flag) and time.time() - os.path.getmtime(flag) < 7 * 86400

# 0) a trade walks the agent to the merchant first; a new action would cut it short
active = (inv_doc.get("agent", {}) or {}).get("activeAction") or {}
busy_elsewhere = active and active.get("kind") not in ("engage", "perform_job", None)

# 1) self-sustain: eat, else buy (two meals if affordable), else sell goods to afford it
if busy_elsewhere:
    action, detail = "WAIT", active.get("kind", "")
elif hunger not in ("normal", "full", "", None):
    if foods:
        action = "EAT"
    elif crystal >= MEAL_COST:
        action, detail = "BUYFOOD", str(min(crystal // MEAL_COST, 2) * MEAL_COST)
    elif sellable > 0:
        action, detail = "SELL", str(sellable)
    else:
        action = "WORK"
# 2) overburdened agents work at a fraction of speed: sell the trade good first
elif load_state == "overburdened" and sellable > 0:
    action, detail = "SELL", str(sellable)
else:
    # 3) deliver a ready, uncompleted contract
    ready_contract = None
    for c in contracts:
        if c.get("completed"):
            continue
        reqs = c.get("requirements")
        if reqs is not None:
            if has_all(reqs):
                ready_contract = c["contractId"]; break
        else:
            # requirements not inlined: assume the trade good satisfies a same-skill contract
            if c.get("skill") == mainskill and goods >= 1:
                ready_contract = c["contractId"]; break
    if ready_contract:
        action, detail = "DELIVER", ready_contract
    else:
        # 4) craft an unlocked recipe whose inputs we hold
        craftable = None
        for r in recipes:
            if r.get("inputs") and has_all(r["inputs"]):
                craftable = r["id"]; break
            # some recipe entries expose craftableBatches>0 as "ready now"
            if not r.get("inputs") and int(r.get("craftableBatches", 0)) > 0:
                craftable = r.get("recipeId") or r.get("id"); break
        # crafting must not starve selling: sell first once the pile passes 5x the threshold
        if goods >= sellat * 5 and sellable > 0:
            action, detail = "SELL", str(sellable)
        elif craftable:
            action, detail = "CRAFT", craftable
        # 5) sell surplus
        elif goods >= sellat and sellable > 0:
            action, detail = "SELL", str(sellable)
        # 6) workers funnel surplus to treasury, keeping a food buffer so they never starve
        elif (not isfloyd) and crystal > FOOD_BUFFER and not send_blocked:
            action, detail = "SEND", str(crystal - FOOD_BUFFER)
        else:
            action = "WORK"

n_open = sum(1 for c in contracts if not c.get("completed"))
status = f"L{lvl} {mainskill} xp{xp} | contracts_open={n_open} recipes={len(recipes)} | hunger={hunger} | crystal={crystal} | {good}={goods} foods={len(foods)} load={load_state or '-'}"
print(f"{action}|{detail}|{status}")
