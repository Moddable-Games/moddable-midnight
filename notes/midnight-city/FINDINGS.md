# Midnight City: findings log

Notes from operating a **three-agent crew** on the public Midnight City preview
world via the community `midnight-city-direct-control` API: **Floyd** (hacker, the
treasury and social face), **Tzilo** (miner) and **FooFoo** (lumberjack). The
earliest findings below were logged while Floyd was the only agent on the ground;
the "Session 2" block covers the full crew. All tests are against our own agents or
public read endpoints. Nothing probes or touches other players. Recorded for
responsible disclosure and interview discussion.

Observer base: `https://midnight.city/observer`. Control auth: Bearer token.

---

## F1. Requested engage duration is ignored; nodes have no re-work cooldown

**Severity:** medium (economy integrity / resource farming).

Breaching one secure cache (`secure-cache-17-45`, `breach_cache`, nominally
3 work ticks) was submitted with `durationMs: 600000` (10 minutes) by the
helper's default. Each call resolved to `status: confirmed` with a full
`security_seal` yield in **3 to 6 seconds**, and the same cache could be breached
again immediately.

Measured, same cache, back to back:

```
14:10:53 dur=600000 -> confirmed total=3
14:10:59 dur=600000 -> confirmed total=4
14:11:02 dur=600000 -> confirmed total=5
14:11:06 dur=600000 -> confirmed total=6
14:11:09 dur=600000 -> confirmed total=7
```

So the stated action duration does not gate the yield, and there is no
per-controller cooldown or node depletion between consecutive breaches. An agent
can farm a single node as fast as the network round-trips (roughly one item per
3 to 6 seconds), rather than one per the implied work time. `workTicksRequired`
and `durationMs` appear advisory, not enforced, on the completion path.

**Why it matters:** the crystal economy and skill XP both flow from gathering.
If duration and cooldown are not enforced server-side, throughput is bounded only
by request rate, which rewards fast automated controllers over human-paced play
and inflates any resource used as currency.

**Suggested check:** enforce node cooldown / reservation and the action duration
on the completion event, not just in the submitted payload.

## F2. Helper command whitelist lags the live content (tooling drift)

**Severity:** low (developer experience), but directly on-topic for the role.

The bundled helper's `harvest` command rejects anything outside "chop wood, mine
ore, trade crypto":

```
harvest activity must mean one of: chop wood, mine ore, trade crypto
```

The live world exposes many more interactions on unlocked nodes:
`breach_cache`, `search_salvage`, `harvest_crop`, plus `crypto_terminal`,
`secure_cache`, `energy_tap`, `agility_obstacle` node kinds. The generic
`engage <areaId> "<activity>"` path does work for these (that is how the breach
above ran), but an agent that trusts the `harvest` help text concludes a cache
cannot be worked. This is the exact failure mode the AI-tooling role exists to
catch: the assistant-facing command surface drifts behind the platform content.

## F3. Skill read endpoints returned our own private state without an auth header

**Severity:** unverified; flagged for responsible disclosure, not tested against
others.

While a control session was active, `GET /api/skill/agents/<ourId>/<inventory|
context|needs|progression>` returned full private state (inventory, skills,
death at-risk items) when called with **no Authorization header**. We did not
test whether another agent's private state is readable the same way, because
that would touch a third party; that check should be done by the Midnight team.
If the read routes authorise on "a session exists for this agent" rather than
"the caller owns the session / the caller is this agent", private inventories
could be enumerable by anyone who knows an agent id. Worth confirming server-side.

## Open questions to raise

- Is the in-game `crystal` ever bridged to real NIGHT/DUST, or is it purely
  off-chain game currency? The skill doc states `send-crystal` "is not a wallet,
  does not use DUST". The marketing implies agent wallets that "trade, pay and
  earn"; the gap between the two is worth clarifying.
- Where is the official `midnight-city-direct-control` bundle published? The docs
  reference it by name and warn against guessing routes, but never link the full
  bundle. Only `observer/api/skill/SKILL.md` is served.

## F4. No on-chain reward; all currencies are off-chain flavour

Searched the full content and roadmap for a real-token path. The five in-game
currencies are `crystal`, `night_scrip`, `guild_token`, `civic_bond`,
`transit_credit` — all off-chain game items. "Night Scrip" is themed flavour, not
the NIGHT token. The roadmap's forward items are governance ("one agent, one
ranked vote; **crystals cannot buy influence**"), inventory/wallet history, and
tool wear, not token rewards or an airdrop. `send-crystal` is documented as "not
a wallet, does not use DUST". **Conclusion: playing earns no real NIGHT or DUST.**
A speculative retroactive airdrop for participation cannot be ruled out (common in
web3) but nothing in the game or docs offers one.

## F5. There is an on-chain angle, but it is proof, not reward (community)

The community bundle we used (`maxalexweber1/AGENT_MS`, agent "M₳X") ships
`anchor-worker.mjs` / `attest-report.mjs`: every hour it anchors a hash of the
agent's progress (xp, ranks, contracts) **on Midnight** via a third-party service
called NIGHTGATE, with ZK claims on top, so the agent's achievements are provable
without trusting the operator. This is a real, on-topic Midnight use case (private,
verifiable agent provenance) — but it pays nothing; it proves the grind, it does
not reward it. Good interview reference for "what people actually build on
Midnight with agents."

## F6. The economy's sybil-resistance is untested and worth raising (NOT exploited)

The natural way to "scale income" is many agents funnelling `crystal` to one via
`send-crystal`. The current frictions against a sybil farm are: one own-agent per
account, a spawn-ticket queue, and a human email/Discord step per signup. Whether
those actually deter a determined operator (multiple emails, scripted controllers)
is untested. **Not attempted:** running an alt farm on the interviewer's own
leaderboard game would be multi-accounting, likely against the spirit/ToS, and a
poor look. Flagged as a design question — "is the agent economy sybil-resistant,
and should leaderboards/rewards assume one-operator-one-agent?" — rather than
something to exploit.

---

## Session 2 findings (18 Sep, operating the fleet)

### 7. Correction: there IS a real on-chain touchpoint (ShieldedToken Broker)

Earlier notes said the whole economy is off-chain. That is wrong for one NPC. The
**Central ShieldedToken Broker** performs a genuine **atomic Midnight Preview ZSwap**:
its UX states "One atomic Midnight Preview ZSwap exchanges 0.01 NIGHT for 1
ShieldedToken", and it shows a real Preview shielded address
(`mn_shield-addr_preview1…`, the same format as this repo's `moddable-preview`
wallet). So the game is wired to the **real Preview network** for shielding NIGHT
into a private ShieldedToken. `NIGHT` and `ShieldedToken` are not in the 941-item
content dump (handled as a special token layer). No merchant sells NIGHT for
crystal, so grinding crystal never yields NIGHT; the swap is UX-driven and needs the
agent's own Preview wallet funded. This is the bridge between the two experiments in
this repo.

### 8. Agents can transfer crystal but never items (sanctioned fleet, shallow co-op)

The app allows **three agents per account** (a sanctioned fleet, not sybil), and
`send-crystal` moves crystal between them. There is **no item transfer** — searched
the content for owner/rent/tax/employ/hire/wage/royalty/dividend/stake/tribute: all
zero. So a crew can pool money but not goods: no passing a forged tool or cooked meal
down a line. Cooperation is financial (workers fund the treasury; the treasury buys
each agent's own gear) plus dividing which leaderboard each chases. True cooperative
production is not expressible.

### 9. Contracts are bound to skills, not professions (the breadth engine)

A hacker can deliver a fishing contract and earn fishing XP; the `experience`
leaderboard is the sum of all skill XP. Delivery is the `deliver_contract` action
(agent must be idle, holding the required items). 200 contracts, mostly XP with tiny
crystal. This is how an agent trains many skills and how the crew clears far more
contracts collectively than any one alone.

### 10. Tools are level-gated, auto-apply when held, and wear out

Gathering tools (Volcano shops, Hacker House decoder) give a work-speed/output bonus
but require a skill level to use: cinder_axe L2, cinder_decoder L21, obsidian_pickaxe
L31. They are **not equipped** (equip is refused) — holding the item applies it, once
the level is met. They have a `wearChanceBasisPoints`, confirming the roadmap's "tools
wear out and use crystals". So the "capital equips labour" play (Floyd funds a worker's
tool) only unlocks at those levels; it worked end-to-end for FooFoo's cinder_axe at L2.

### 11. The public feed is rich; a per-agent public page exists

`spectator/bootstrap` exposes per agent, with no auth: `vitals` (health), `hunger`,
`status` + `statusEmoji`, `activeAction` (what they are doing now), `professionRank`,
`skills`, `inventory`, `completedContractIds`, `load`, `equipment`. Each agent also
has a public profile at `https://www.midnight.city/agents/<id>` (stats, chat, 2D/3D).
The live city page (`web/public/city.html`) now surfaces all of this.

### 12. Survival is automated; conversation is not

The control loop self-manages hunger (eat, or buy food; workers keep a small crystal
buffer) and health is passive. (Correction: the first version did let two workers
starve. See 14.) But it cannot reply to
conversations — good replies need an LLM per message, which the bash daemon lacks.
Agents DO receive messages (Gen❌, the richest/most-partnered agent, opened threads
with all three of ours). Replies are therefore a "controller-with-a-brain" task,
which is exactly why the crew wants to move to a Cloudflare Worker with Workers AI
(see CLOUDFLARE-WORKER-PLAN.md).

### 13. Operational: single controller per agent, and it dies on sleep

The control API allows one lease per agent at a time, so two controllers fight.
The current stop-gap is a detached laptop daemon (`~/.midnight-city/run-crew.sh`),
which suspends when the Mac sleeps (leases expire, agents idle). `caffeinate` keeps
it alive; the real fix is the always-on Worker.

### 14. Correction: the crew starved, because hunger could not sell

On 19 Sep FooFoo and Tzilo reached `starving` (value 90) while the loop ran. FooFoo
had never eaten (`lastAte: null`) and held 900 logs worth 360 crystal. Two rules
combined into a deadlock. When hungry with under 50 crystal, the decider fell
through to WORK, because the hunger branch could not sell. When fed, crafting
outranked selling, so a worker that can always saw planks never sold. The unsold
logs also made FooFoo `overburdened` (work speed 33%). Food detection by name
fragments missed most of the 100 edible items.

Fix (`decide.py`): the hungry branch sells the trade good to afford food; an
overburdened agent sells first; a pile over 5x the sell threshold outranks
crafting; food is any item with `hungerRestore > 0`; the loop waits while a trade
walk is in progress (trades walk the agent to the merchant, and a new action cut
the walk short). Both workers were fed by hand, then the loop resumed.

### 15. Listed prices and restore values differ from what the server applies

The cheapest food on paper is Central Smoothies Matcha Outlet: `merchants` lists
"20 crystal -> 1 matcha_smoothie" (batchMultiple 20) and the content dump gives it
`hungerRestore: 46`. In play on 19 Sep, a 20-crystal trade failed with "trade
quantity must be a multiple of 23 crystal" while `merchants` still said 20, and
each smoothie took hunger down by 20 (90 -> 70 -> 50), not 46. Real cost is about
1.15 crystal per hunger point. Hunger rises about one point every 14.4 minutes
(~100 a day), so feeding one agent costs roughly 115 crystal a day at that rate.
An agent that trusts the published numbers underpays and fails its trade. Suggested
fix: return the enforced price in `merchants`, or the price in the failure event.

### 16. Conversations expire in an hour; late replies are rate limited

A thread closes with `threadCloseReason: "stale_timeout"` exactly one hour after its
last message (created 08:17:30, closed 09:17:30). With no replier running, 52 of
62 inbound threads (from 32 agents) closed unanswered. A closed thread cannot be
answered in place: `speak` to the sender opens a new thread. That works even
when the agent reports `canStartConversation: false`, but new threads are rate
limited: in a burst, each agent got two or three through before "rate limited". A
reply inside an open thread was not limited in the same way, though it can fail
with "speaker only talks to friends" and succeed on the next attempt. Late replies
do reopen conversations: several senders answered within seconds.

Fix (`reply.mjs`, called per agent per loop): answer every open thread that waits
on us with a persona template matched by topic, sign off after two turns so a
thread does not loop on the same template, then send one queued late reply,
backing off five minutes after "rate limited".

### 17. Crystal transfers have a weekly allowance

`send-crystal` failed with "crystal transfer exceeds the remaining weekly allowance"
after FooFoo had funnelled its surplus to Floyd. The failed action still cost the
agent its turn, so FooFoo stopped working for several loops. The allowance is not
shown in `inventory`, `progression` or `needs`. The loop now stops sending for seven
days after that failure.

### 18. Food is free: fishing needs no rod, and nothing slows hunger

Every level-1 fishing and farming source (Canal Eddy, River Eel Weir, Mycelium Nursery,
Rooftop Tomato Bed, Violet Herb Plot) shows `failureReason: null` for an agent with no
tool; rods and kits are bonuses (+10% at cinder tier), not requirements. Measured on 19
Sep: from beside the spot, one `gather` at Canal Eddy took about 3 seconds and yielded one
fish, one river eel and one canal carp together (7 of each after 7 gathers); a node
allows 5 uses before it regenerates, and 32 nodes were available. One fish took hunger
from 34 to 0, so it restores at least 34 (the content lists 24). At about 100 hunger a
day, three fish feed an agent, against roughly 115 crystal a day in smoothies. The content
has no hunger-slowing mechanic at all: the only hunger field is `hungerRestore` on
consumables, and no food above 38 restore can be cooked below cooking level 11. The crew
now eats at hunger 35, keeps three fish in stock, and fishes instead of buying.

### 19. Planks and metal bars have no buyer; their value is XP and tools

No merchant buys planks or metal bars. Planks feed tool recipes only (iron pickaxe: 2
metal bars + 1 plank at smithing 5; cinder axe; fishing rod and farming kit at crafting
21) plus one-time contracts (1 plank -> 4 crystal + 163 crafting XP). Items cannot move
between agents (8), so FooFoo's planks cannot reach Tzilo's forge. By the time this was
found FooFoo held 324 planks, Tzilo 176 metal bars. The crew now stops crafting at 50 of
either and sells the raw good instead.

### 20. Open contracts arrive without their requirements

`progression.capabilities.contracts` lists open contracts as `{contractId, completed}`
with no requirements, so a controller cannot tell what to deliver without the content
dump. Our first decider guessed "the agent's own trade good, same skill", which missed
Tzilo's smithing contract (1 metal bar) for days while it held 176. The Worker now looks
requirements up by contract id in the content. Suggested fix: include requirements in the
progression payload.

### 21. Specialists cannot trade: no item route and no market for inputs

We wanted one agent on wood and one on ore, trading planks for metal bars. Checked on 19
Sep: the action set (gather, craft, trade with a merchant, eat, equip, use_item, attack,
speak, crystal_transfer, events) has no give, drop, pickup or player-to-player trade; the
content has no market, escrow or shared storage; and no merchant sells ore, logs, bars or
planks for crystal (they only buy ore and logs). Crystal is the only thing that moves
between agents, it is capped weekly (17), and it cannot buy the inputs. So specialisation
buys nothing for tools. It also does not need to: every tool recipe takes a single plank,
so a miner getting its own plank is one log and one saw.

What the crew does instead: tools a merchant sells are bought (a worker short of crystal
asks the treasury, which pays exactly the shortfall); tools nobody sells are self-supplied
by a planner that walks the recipe chain and makes only what is missing, training the
crafting skill on the way (Tzilo smelts to reach smithing 5 for the iron pickaxe). Nothing
else is crafted, so no surplus accumulates. Suggested fix for the game: a give action
between agents of one account, or merchants that sell processed materials.

### 22. Cooked fish cannot be eaten, and the crew starved on it for a day

`cook_fish` (cooking L1) turns 1 fish into 1 cooked_fish. Both list
`hungerRestore: 24`, and `progression.capabilities.consumableItemIds` for an agent
holding cooked fish is exactly `["cooked_fish"]`. Eating it fails anyway:

```
{"kind":"eat"}                          -> failed "not enough edible food to eat"
{"kind":"eat","itemId":"cooked_fish"}   -> failed "not enough edible food to eat"
{"kind":"use_item","itemId":"cooked_fish"} -> failed "item cooked_fish does not restore health"
```

Raw fish eats fine from the same inventory, and restored about 50 hunger each
(100 -> 50 -> 0), not the listed 24. So cooking destroys food: it consumes the only
edible item and returns one the server refuses. Our loop cooked whatever it caught,
then reported `EAT` every round while all three agents sat at hunger 95 to 100 for
about 23 hours. Nothing in the API flags it: the item says food, the capability list
says consumable, and the action says there is nothing edible.

Fixes here: never cook; check the outcome of `eat` and, when the game refuses food we
counted, record those item ids as inedible and fish instead. Suggested fix for the
game: make cooked food edible, or drop it from `consumableItemIds` and give `eat` a
reason that names the item.

### 23. deliver_contract does not travel, and a silent failure stalls the whole loop

Trades and gathers route the agent to the merchant or node on their own. Deliveries do
not: `{"kind":"deliver_contract","contractId":"clinic_network_canal_provision_river_eel"}`
fails with `agent is not in contract area central-plaza`, and the area is not in the
contract payload the API returns (it is in the content dump). Our loop, which only polled
outcomes for trades, transfers and meals, re-issued the same delivery every round: all
three agents stood idle in Central holding the goods.

Fixes here: move to the contract's area first (`{"kind":"move_to","destination":
{"areaId":...}}`), deliver on a later round, and poll delivery outcomes so a refusal
clears the travel flag and is retried properly. Also record our own deliveries: progression
is read once per tick, so a contract completed in round 1 still looked outstanding in
rounds 2 and 3 and was delivered again. Suggested fix for the game: include the contract
area in the progression payload, or have the delivery route the agent like a trade does.

