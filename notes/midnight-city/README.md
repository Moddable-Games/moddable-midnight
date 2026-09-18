# Moddable on Midnight City

A second experiment alongside the [tournament-pass contract](../../README.md):
instead of building *on* Midnight, this one operates *inside*
[Midnight City](https://www.midnight.city/), IO Global's agentic simulation
where AI agents live, work and trade on their own. We run a **three-agent crew**,
coordinate them toward shared goals, and document what it reveals about the
platform's agent economy — the same "build it, then write down every seam" method
we used for the Midnight Expert tooling.

**Live fleet status:** https://moddable-games.github.io/moddable-midnight/city.html
(reads the game's public observer API directly, no wallet, no sign-in).

## The crew

| Agent | Profession | Role | Chases |
|---|---|---|---|
| **Floyd** (FLOYD FLINKLE FLIMBLE FLOP) | hacker | Treasury, contracts, social face | richest, mostPopular, mostLiked, hacking |
| **Tzilo** | miner | Mining + smithing, contracts | mining, smithing, completedContracts |
| **FooFoo** | lumberjack | Breadth + provisioning (food, planks) | several skill boards, self-sustain |

They are driven through the community `midnight-city-direct-control` API. A small
decision brain ([`decide.py`](decide.py)) chooses, per agent per tick, whether to
gather, complete a contract, craft, sell, fund a teammate, or grind for the next
level. Conversations are handled directly, each agent replying in its own voice.

## How they work together

The one hard constraint shapes everything: **agents can send each other crystal,
but never items.** So cooperation is financial, not a supply chain. Workers funnel
crystal to Floyd's treasury; the treasury buys each teammate's tools; and each
agent specialises in a *different* leaderboard so the crew's collective standing is
broad rather than three agents fighting over one board. "Use the benefit of one to
lift another" becomes: Floyd's wealth equips the workers, the workers' output feeds
the treasury.

## The documents

- [`FINDINGS.md`](FINDINGS.md) — every friction point, loophole and surprise, with
  evidence and a suggested fix. Highlights: a resource-farming loophole on
  co-located caches, a **real on-chain Midnight Preview shielded ZSwap** embedded
  as an in-game NPC broker, a sanctioned three-agent fleet that can pool crystal
  but not items (so no true cooperative production), and a "property" system that
  is a pure crystal sink with no rent.
- [`WORLD-MODEL.md`](WORLD-MODEL.md) — the whole game mapped from its 12.9MB content
  dump: 941 items, 728 recipes, 200 contracts, 90 sources, 19 skills, 9 workstations.
- [`INCOME-STRATEGY.md`](INCOME-STRATEGY.md) — where crystal actually comes from,
  and why there is no passive-income mechanic.
- [`CITY-NOTES.md`](CITY-NOTES.md) — districts, landmarks, the economy at a glance.

## What is and isn't real

The in-game currencies (`crystal`, `night_scrip`, ...) are off-chain game items.
The exception is the **ShieldedToken Broker**, which performs a genuine atomic
shielded swap on the real Midnight **Preview** network — the same network the
tournament-pass contract in this repo is deployed to. That single NPC is where the
game touches the real chain, and it is the bridge between these two experiments.

## Note on credentials

Nothing here contains secrets. The account token, wallet and the third-party
control bundle stay on the operator's machine, outside this repository.
