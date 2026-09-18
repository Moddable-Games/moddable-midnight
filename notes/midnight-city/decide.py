#!/usr/bin/env python3
# Decide one agent's next action from inventory/progression/needs JSON.
# Priority: 1) stay fed  2) complete a ready contract (XP + board)  3) craft once
# unlocked  4) sell surplus  5) workers funnel crystal to the treasury  6) grind XP.
import sys, json

inv_f, prog_f, needs_f, mainskill, good, batch, sellat, isfloyd = sys.argv[1:9]
batch, sellat, isfloyd = int(batch), int(sellat), isfloyd == "1"

def load(f):
    try:
        return json.load(open(f))
    except Exception:
        return {}

inv = load(inv_f).get("inventory", {}) or {}
prog = load(prog_f)
needs = load(needs_f)

crystal = int(inv.get("crystal", 0) or 0)
skills = prog.get("skills", {}) or {}
lvl = skills.get(mainskill, {}).get("level", "?")
xp = skills.get(mainskill, {}).get("xp", 0)
caps = prog.get("capabilities", {}) or {}
recipes = caps.get("recipes", []) or []
contracts = caps.get("contracts", []) or []
hunger = (needs.get("hunger", {}) or {}).get("state", "normal")

FOOD_HINTS = ("food", "fish", "meat", "smoothie", "rice", "meal", "ration", "brew", "stew")
foods = [k for k in inv if any(h in k for h in FOOD_HINTS) and inv.get(k, 0) > 0]

def has_all(reqs):
    return all(int(inv.get(r.get("itemId"), 0)) >= int(r.get("quantity", 1)) for r in (reqs or []))

action, detail = "WORK", ""

# 1) self-sustain
if hunger not in ("normal", "full", "", None):
    action = "EAT" if foods else ("BUYFOOD" if crystal >= 50 else "WORK")
else:
    # 2) deliver a ready, uncompleted contract
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
            if c.get("skill") == mainskill and int(inv.get(good, 0)) >= 1:
                ready_contract = c["contractId"]; break
    if ready_contract:
        action, detail = "DELIVER", ready_contract
    else:
        # 3) craft an unlocked recipe whose inputs we hold
        craftable = None
        for r in recipes:
            if r.get("inputs") and has_all(r["inputs"]):
                craftable = r["id"]; break
            # some recipe entries expose craftableBatches>0 as "ready now"
            if not r.get("inputs") and int(r.get("craftableBatches", 0)) > 0:
                craftable = r.get("recipeId") or r.get("id"); break
        if craftable:
            action, detail = "CRAFT", craftable
        # 4) sell surplus
        elif good and int(inv.get(good, 0)) >= sellat:
            action, detail = "SELL", str((int(inv.get(good, 0)) // batch) * batch)
        # 5) workers funnel to treasury
        elif (not isfloyd) and crystal >= 4:
            action, detail = "SEND", str(crystal)
        else:
            action = "WORK"

n_open = sum(1 for c in contracts if not c.get("completed"))
status = f"L{lvl} {mainskill} xp{xp} | contracts_open={n_open} recipes={len(recipes)} | hunger={hunger} | crystal={crystal}"
print(f"{action}|{detail}|{status}")
