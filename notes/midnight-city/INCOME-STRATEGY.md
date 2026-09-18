# Income strategy for the crew (Floyd, Tzilo, FooFoo)

> This began as a solo analysis of Floyd, the hacker, before the crew existed, so
> much of the detail below is his route. The three-agent strategy — Floyd banks and
> hacks, Tzilo mines, FooFoo works timber, all funnelling to one treasury while each
> chases a different leaderboard — is in [README.md](README.md) and FINDINGS session 2.

## The direct answer to "make others earn for him"

I searched the entire game content (941 items, 728 recipes, 200 contracts, 50
sites) for any mechanic that lets one agent earn from another's labour:

```
owner 0 · rent 0 · tax 0 · employ 0 · hire 0 · wage 0 · royalty 0
dividend 0 · stake 0 · landlord 0 · tenant 0 · tribute 0 · tip 0
```

**There is none.** No employment, no rent, no royalties, no dividends, no
staking. `send-crystal` is the only agent-to-agent value transfer and it is
manual gifting. Construction buildings buff the *owner's own* work and cost
upkeep; they do not collect from other agents who use them.

So today Floyd cannot make others generate crystal for him through any built-in
system. Wealth is earned by one's own gathering plus selling, and the richest
agent proves it: he is also the most *industrious* (most completed contracts) and
most *connected* (485 partners), not a rentier. **This is itself the headline
finding for the interview** (see below).

## Floyd's route (his profession is the best crystal faucet, so he banks)

Crystal density by good: **meme_coin = 4 crystal/unit**, the best in the game.
meme_coin is produced by **crypto_terminal**, a **hacking** node. Floyd is a
**hacker**. So his profession is already pointed at the single best crystal
faucet. The loop:

1. Work crypto terminals in **Hacker House** (`trade_crypto`, job-eligible for
   hackers). Yields meme_coin + encrypted_packet, and a 3.5% rare
   `etched_circuit_relic` / `etched_cipher_deck`.
2. Sell meme_coin to the **Central Crypto Merchant** at 4 crystal each.
3. Terminals deplete (~6 uses) and regenerate (~18 ticks), so rotate across the
   56 terminals rather than hammering one.

This also climbs hacking + the hacker profession rank, unlocking the 73 sources
and higher recipes currently locked at rank 1.

## Scaling within what the game allows

Since there is no labour market, "scale" means one of:

- **Breadth of nodes + automation.** One controller can only drive Floyd, but it
  can drive him continuously and optimally (rotate terminals, never idle, sell in
  batches). That is the honest ceiling of a single agent.
- **Social capital.** The one multiplayer lever is partners/popularity, which the
  richest agent maxes. Worth probing whether partnerships unlock shared work or
  gifting at scale; no crystal-transfer mechanic was found in content, so treat
  as unproven.
- **Multiple agents.** Real scale would need several spawned agents, each with a
  controller. That is where a fleet (many agents, one orchestrator) would matter,
  and where the "others earn for him" idea becomes "his own fleet earns for him."
  Blocked today by spawn tickets (one agent per account seen so far).

## The interview-grade observation

Midnight City is marketed as an *agentic economy* ("agents that trade, pay and
earn on your behalf"). Yet the economy has **no capital or labour market**: agents
cannot employ, rent to, tax, or passively earn from one another. The rich agent
is a hard worker with many friends, not a capital owner. For a showcase of
autonomous economic agents, the most interesting behaviours — delegation,
employment, capital formation, rent, tribute — are **not yet expressible**. That
is a precise, on-topic gap to raise: the sandbox proves agents can *work*, but not
yet that they can *organise*. Combined with the crystal being off-chain (not
NIGHT/DUST), the "agent wallet economy" is still aspirational in the live build.
