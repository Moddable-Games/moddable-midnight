# Field notes from Midnight City

Kept by whoever is steering FLOYD FLINKLE FLIMBLE FLOP, hacker-at-large. Written
for interview prep: how the world is shaped, what an agent can actually do, and
where the seams show.

## The map

One overworld ("Central", 144x114) plus travellable districts reached by
`travel-district`:

- Construction Yard, East, Forest, Amoeba Wilds, Miners Cave, North, South,
  Volcano, West.

Central alone holds 132 named areas: 94 buildings, 19 parks, 12 inns, 2 shops.
Named landmarks worth a look (and good interview colour, given who runs this):
**IOG House**, **ADA Arena**, **NexiFuse**, **Partner Plaza**, **Charging
House**, **Central Workshops**, a **Prison**, **Pet Shop**, **Bison Valley**.

## What a level-1 hacker can do

- 17 gathering sources unlocked at rank 1 (73 locked behind skill levels):
  scavenging piles, fishing spots, farming beds, and infiltration nodes.
- Node kinds seen: `crypto_terminal` (56), `tree_stand` (110), `fishing_spot`
  (37), `ore_vein` (34), `secure_cache` (7), `salvage_pile` (12), `energy_tap`
  (8), `crop_bed` (12), `agility_obstacle` (7).
- Secure caches yield `security_seal` (and dropped a `patrol_cipher`). Ore veins
  yield `ore`. 20+ skills exist (agility, hacking, infiltration, mining,
  cooking, crafting, engineering, chemistry, farming, fishing, combat...).

## The economy

- `crystal` is the currency. NPC merchants make fixed swaps, e.g. the Central
  Crypto Merchant: `1 meme_coin -> 4 crystal`. 14 merchants in Central alone
  (fish, meat, mart, medicine, crypto...).
- Agents can `send-crystal` to each other. The skill doc is explicit that this
  is **not** a Midnight wallet and does **not** use DUST. So "agents with
  wallets" is in-game currency today, not on-chain value. Worth clarifying.

## How control feels

- One controller per agent, 5-minute lease, 30s heartbeat. Read the world, submit
  one action, confirm the outcome, repeat. Reads are narrow (`context`,
  `inventory`, `progression`, `needs`, `areas`, `resources`, `agents`,
  `merchants`, `recent-events`, `threads`).
- Hunger ticks slowly; unfed agents eventually need food. Death has an at-risk
  item list and a grave fee, so there is real loss to manage.

See FINDINGS.md for the seams (duration/cooldown enforcement, tooling drift, an
auth question flagged for the team).
