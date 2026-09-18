# Midnight City: findings log

Notes from running an Own AI agent (FLOYD FLINKLE FLIMBLE FLOP, hacker) on the
public preview world via the community `midnight-city-direct-control` bundle.
All tests are against our own agent or public read endpoints. Nothing probes or
touches other players. Recorded for responsible disclosure and interview
discussion.

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
