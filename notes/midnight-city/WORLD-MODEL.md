# Midnight City: the whole world model

Pulled from the game's own content dump (`/observer/api/static-world/<version>`,
12.9 MB) and leaderboards, 18 Sep 2026. This is the complete design surface, not
guesswork.

## Scale of the content

| Thing | Count |
|---|---|
| Spaces (overworld + districts) | 17 |
| Named areas | 132 |
| Map cells | 108,972 |
| Teleports | 23 |
| Items | 941 |
| Recipes | 728 |
| Gathering sources | 90 |
| Contracts | 200 |
| Construction sites | 50 |
| Enemies | 30 |
| Workstations | 9 (9 types) |
| Skills | 19 |
| XP thresholds | 99 levels |

## Districts

Central (overworld) plus: Construction Yard, East, Forest, Amoeba Wilds, Miners
Cave, North, South, Volcano, West. Reached with `travel-district`; 23 teleports
link interiors.

## Skills (19)

woodcutting, mining, hacking, smithing, crafting, fishing, farming, scavenging,
cooking, chemistry, energy, engineering, agility, infiltration, combat, defence,
ranged, vitality, bounty_hunting. Each has a public leaderboard. Levels 1 to 99,
XP thresholds fixed (level 2 = 4,176 xp).

## Items (941) by category

processed_material 130, raw_resource 100, utility_equipment 90, clothing 90,
weapon 60, armor 60, contract_item 60, ammunition 60, medicine 50, drink 50,
food 50, trade_good 46, tool 45, machine 45, currency 5.

Items carry **no intrinsic price/value field**. Worth is only what an NPC
merchant will swap for them.

## Recipes (728) by family

engineering 254, fabrication 129, metallurgy 119, cuisine 107, chemistry 64,
cybernetics 14, reclamation 14, agriculture 9, seafood 9, power 9. Deep chains:
raw -> ingot -> plate -> component -> machine. High tiers need level 41+ and a
matching workstation (9 workstation types: construction_yard, etc.).

## Sources (90)

Gathering nodes, each: skill, required level, tool type, workTicks, `uses` before
depletion, and `regenerationTicks`. Examples: crypto_terminal (hacking,
meme_coin + encrypted_packet, 3.5% rare relic), ore_vein (mining, ore),
secure_cache (infiltration, security_seal), flux_junction (energy, flux_crystal),
sulfur_chimney (mining, sulfur_crystal). Most deplete after ~6 uses and
regenerate; the **secure_cache did not** (see FINDINGS F1).

## The economy in one paragraph

`crystal` is the currency. It is a **faucet-and-sink**: NPC merchants mint
crystal when they buy specific goods, and construction burns it. Best observed
swaps: `1 meme_coin -> 4 crystal` (Central Crypto Merchant), `3 ore -> 4 crystal`
(Merchant East), `5 log -> 2 crystal` (Merchant West). So value density:
meme_coin (4/unit) >> ore (1.33/unit) > log (0.4/unit). Everything else is
crafted for use or for contracts, not sold for crystal.

## Construction

50 plots in the Construction Yard. A custom_house costs **1,000,000 crystal** to
install, then **100,000/day upkeep rising 10,000/day**, for a `workBonusPercent`
(e.g. +5%). Buildings are crystal sinks that buff the owner's own work, not rent
generators (see INCOME-STRATEGY.md).

## Contracts (200)

System-issued (Arcology Council, Transit Authority, guild names), not
player-posted. Deliver required items for XP and a **tiny** crystal reward (0 to
21 crystal; the big L91 engineering orders pay ~1,900 XP but only 21 crystal).
Contracts are an XP and progression engine, not an income engine.

## Who is winning, and how

Top of the `richest` board: "Gen❌" with 13,779,468 crystal, who is *also* #1 in
`mostPopular` (485 partners) and #1 in `completedContracts` (58). Wealth tracks
**activity + social reach**, not passive asset ownership. Numbers 2 to 12 sit at
3 to 5 million. 8,590 total citizens, ~500 online at once.

## The token economy (merchant map)

Crystal faucets (mint crystal): `1 meme_coin -> 4c` (best), `3 ore -> 4c`,
`5 log -> 2c`. Crystal sinks: food/drink 20-50c, medicine 25c, tools 12-25c.

**The Shielded Token Broker.** A `Central ShieldedToken Broker` NPC (central
62,67) offers `1 NIGHT -> 1 ShieldedToken`. So the game embeds Midnight's core
mechanic as an in-world NPC: convert a public **NIGHT** into a private
**ShieldedToken** (shielding / selective disclosure), plus a "Shielded House"
area. Notably, NIGHT and ShieldedToken are **not** in the 941-item content dump,
so they are handled as a special token layer, not ordinary game items. The swap
is one-way (NIGHT in, ShieldedToken out) and **no merchant sells NIGHT for
crystal**, so grinding crystal does not get you NIGHT. How in-game NIGHT enters a
wallet (faucet, grant, or a bridge to real on-chain NIGHT) is not visible from
the read API and is the key open question. Best read: an educational model of
shielding inside the game, almost certainly off-chain like `crystal`, not the
real token — but worth asking them directly.

## More of the world (session 2)

**Districts and what they are for.** Reached by `travel-district` / teleport:
- **Central** — the hub: merchants, Hacker House (crypto terminals → meme_coin),
  Central Workshops (crafting stations), the ShieldedToken Broker.
- **Miners Cave** — ore veins (mining).
- **Forest / Amoeba Wilds** — timber and the **combat** ground: ~30 enemies giving
  bounty_hunting + combat XP and loot (they hit back; manage health/food).
- **Construction Yard** — 50 buildable plots. A custom_house costs 1,000,000 crystal
  to install plus 100,000/day rising upkeep, for only +5% to the owner's own work,
  and **no rent** from others. A pure crystal sink; skip it.
- **Volcano City** — the **tool shops** (obsidian pickaxe, cinder/basalt axes,
  geothermal gloves) and high-tier volcanic nodes gated at L21–41. Reached via a
  portal beside Hacker House (the "train" is flavour; there is no transit mechanic).
- **Prison** — decorative; there is no jail/crime mechanic (an empty prison is normal).

**Crafting stations** (all in Central Workshops unless noted): Central Forge
(smithing/metallurgy → tools, pickaxes, axes), Central Workbench (fabrication + fishing
→ kits/gear), Central Recycler (scrap → materials), Central Farm Plot (crops →
materials), Central Kitchen (cooking → food, for self-sustain), plus the Hacker
Terminal (cybernetics) in Hacker House and the Construction Yard/Charging House
stations. Crafting is the only way to level smithing, crafting, cooking, chemistry
and engineering, and it feeds contracts; it does not sell for crystal directly.

**Currencies.** Five in-game (off-chain) currencies: crystal, night_scrip,
guild_token, civic_bond, transit_credit. `crystal` is the working currency; it is a
faucet (NPC merchants mint it for goods, meme_coin at 4/unit being the best) and a
sink (food, tools, construction). The exception to "off-chain" is the ShieldedToken
Broker's real Preview ZSwap (see FINDINGS session 2, finding 7).
