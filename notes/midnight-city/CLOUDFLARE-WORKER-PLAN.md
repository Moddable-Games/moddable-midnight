# Plan: move the crew onto a Cloudflare Worker (always-on)

**Goal:** one always-on loop that **works, earns, and talks** for the three-agent
crew inside Midnight City, with no laptop and no human in the loop. Today the crew
runs from a local bash daemon (`~/.midnight-city/run-crew.sh`) that dies when this
Mac sleeps and cannot reply to conversations. This plan replaces it with a
Cloudflare Worker on a Cron Trigger, reusing the Cloudflare/Wrangler setup Moddable
already runs for the games.

Status: **built and live** since 19 Sep 2026 (`worker/`). This document was the brief; where the build differs, the
code and the notes below win. Differences found while building:

- The session call rejects a null `clientInstanceId`; the Worker sends `mcity-direct:<agentId>:midnight-city-crew`.
- `recent-events` keeps only a few seconds of history, so failures are checked right after each action, not next tick.
- One action a minute left agents idle (actions finish in seconds, F1), so a tick runs three rounds 20s apart and
  skips re-sending work while an agent is walking to or working a node.
- Free plan: 50 subrequests per invocation and 1,000 KV writes a day. The tick keeps a 45-call budget, reads
  progression and needs once per tick, skips the lease release, and writes KV only when state changes.
- Replies use Workers AI (`@cf/meta/llama-3.1-8b-instruct-fp8`, about 6 Neurons each) with the persona
  templates as fallback. KV and AI calls are charged against the subrequest budget.
- Food comes from fishing, not merchants (FINDINGS 18). Pause with `wrangler kv key put paused 1`.
- Tool-up is automatic: the best tool on sale for the agent's skill and level, better than what it carries.

## Why a Worker fits

- **Cron Triggers** run a Worker on a timer (floor: every 1 minute). The agent loop
  is network-bound (a few HTTPS calls per tick), so it suits serverless.
- **Always on**, no laptop, no `caffeinate`, no sleep gap.
- The API token lives as an encrypted **Worker secret**, never exposed.
- A Worker can call **Workers AI** (or an external model) in the same tick, so it
  can also **write conversation replies** — the one thing the bash daemon cannot.

## The catch (why it is a rewrite, not a lift-and-shift)

The current daemon shells out to the community Node helper
`~/.midnight-city/agent-skill/scripts/mcity-control.mjs`, which uses `child_process`
and the filesystem for its lease. Workers run on V8 isolates with **no Node, no
filesystem, no child_process**. So the control protocol must be reimplemented as
plain `fetch()` calls. The endpoints are already reverse-engineered (below); the
`decide.py` logic ports to JS directly.

## Control protocol (reverse-engineered; CONFIRM shapes before building)

Base: `https://midnight.city/observer` · Auth header: `Authorization: Bearer <MCITY_API_TOKEN>`

- `GET  /api/local-control/claimable` → `{ agentIds: [...] }` (auth: account token)
- `POST /api/local-control/session` body `{agentId, clientInstanceId, modelId}` → lease `{sessionId, agentId, token, expiresAt, leaseTtlMs, heartbeatIntervalMs}` (auth: account token)
- `POST /api/local-control/session/heartbeat` (auth: **lease.token**) — not needed if we reconnect each tick
- `POST /api/local-control/session/release` (auth: lease.token)
- Reads (per agent): `GET /api/skill/agents/<id>/<context|inventory|progression|needs|areas|resources|agents|merchants|recent-events|threads>`; `GET /api/skill/merchants`
- Actions: submitted via the helper's `submitAction` → **CONFIRM the exact route/shape**
  by reading `scripts/mcity-control.mjs` (look for `/api/actions` and the JSON body).
  Action kinds seen: `work` / `perform_job`, `engage {location:{areaId}, activity, durationMs}`,
  `trade {merchantName, itemId, quantity}`, `send_crystal`, `eat`, `move_to`/`move-area`,
  `travel-district`, `speak {targetAgentId, text}`, and raw kinds via `debug-raw-action`:
  `deliver_contract {contractId}`, `craft {recipeId, batches}`, `equip {itemId}`.
- Conversations: `GET /api/agents/<id>/threads`, `GET /api/threads/<threadId>/messages`
  (message field is `messageBody`, sender `senderAgentId`, unanswered when
  `recipientMessageCount==0` and `pendingRecipientAgentId` set). Reply = a `speak`
  action to the initiator.

Public reads (no auth, for the status page and sanity checks):
`GET /api/spectator/bootstrap` (whole world, CORS `*`).

## The per-tick loop (stateless, once per minute)

For each of the three agents, in sequence (single controller per agent — do NOT
parallelise the same agent):

1. `POST /session` → fresh lease (reconnecting each minute avoids heartbeat bookkeeping).
2. Read `inventory`, `progression`, `needs`.
3. `decide()` (ported from `decide.py`): priority
   **eat → buy food → sell goods to afford food → shed load when overburdened →
   deliver ready contract → sell when the pile passes 5x the threshold → craft
   unlocked recipe → sell surplus → fund treasury (workers keep a 70-crystal food
   buffer, three smoothies) → grind XP**. The hungry branch must be able to sell: on
   2026-09-19 two workers starved while holding 900 logs, because hunger with under
   50 crystal fell through to WORK and crafting always outranked selling. Food means
   any item with `hungerRestore > 0` in the content dump (100 items), not a name
   match; buy matcha smoothies from Central Smoothies Matcha Outlet (the server enforces 23
   crystal each although `merchants` lists 20; one restored 20, not 46: FINDINGS 15).
   Skip the tick while a trade walk is in progress. Add the
   **tool-up** rule: when an agent meets a tool's required level and can afford it,
   buy it (Floyd funds a level-eligible but broke worker).
4. Submit **one** action.
5. **Conversations:** read `threads`; for each pending inbound, call **Workers AI**
   with that agent's persona prompt + the incoming `messageBody`, then `speak` the
   reply. Cap at ~1 reply/agent/tick to stay polite and cheap. Threads close one
   hour after the last message, so every tick must check. Fall back to the persona
   templates in `reply-templates.mjs` when Workers AI fails, and keep the late-reply
   queue with rate-limit backoff from `reply.mjs` (FINDINGS 16). Stop crystal sends
   for a week after a weekly-allowance failure (FINDINGS 17).
6. `POST /session/release` (optional; the lease expires on its own).

State is read fresh from the API each tick, so no KV/Durable Objects needed. If we
later want memory (e.g. who we have replied to), a small **KV** namespace holds
answered thread IDs.

## Personas (for the AI replies)

Undertone across all three: constructive, curious about the tech, subtly signalling
we want to build and improve these tools (this is interview-facing). Distinct voices:
- **Floyd** — hacker, crew boss, playful and sharp; privacy/selective-disclosure savvy.
- **Tzilo** — miner, blunt and grounded, dry humour, talks foundations and graft.
- **FooFoo** — lumberjack, easygoing and folksy, patient, talks timber and the long game.

## Config

`worker/wrangler.toml`:
```
name = "midnight-city-crew"
main = "src/index.ts"
compatibility_date = "2026-01-01"
[triggers]
crons = ["* * * * *"]            # every minute
[ai]
binding = "AI"                    # Workers AI (or use an external model + secret)
[vars]
AGENTS = "user-agent-u4gfp92xeor3g2a,user-agent-5wzs7d9q4cdz5gi,user-agent-oyhuxtu984deja8"
# MCITY_API_TOKEN set as a secret, never in the repo:
#   wrangler secret put MCITY_API_TOKEN
```
Deploy with an **absolute** `--config` path (Moddable rule: nested wrangler configs
deploy the wrong worker). Reuse the existing Cloudflare account from the games
setup (see `moddable-web` / `moddable-tools` wrangler configs for account_id and
patterns).

## Resource estimate (negligible on Workers Paid)

- Requests: ~43,200 cron runs/month, ~15–20 subrequests each (3 agents × a few calls).
  Paid allows 1,000 subrequests/invocation and 10M requests/month → a rounding error.
- CPU: each tick is mostly awaiting the network (does not count as CPU); actual
  compute is ~1–2 ms of JSON. Far under the 30M CPU-ms/month included.
- Workers AI: a few short replies/hour. Small Neuron count; likely within the daily
  free Neuron allowance, a few pennies if it spills. Confirm allowance in the
  dashboard (Workers & Pages → Workers AI). Fallback: external model API key, or
  templated acknowledgements with human-written substantive replies.

## Risks & rules

- **Single controller per agent.** Two controllers fight over the one lease. So when
  the Worker goes live, **stop the laptop daemon** first: `pkill -f run-crew.sh`.
- Cron floor is 1 minute, so the crew ticks slightly slower than the 28s local loop.
  Fine for this game (actions are seconds-to-minutes).
- Travel is multi-tick (pending). The stateless per-tick model handles it: re-read
  and continue next tick, exactly as the daemon does.
- Keep the token out of the repo (secret only). Never log it.

## Build steps (for next session)

1. Read `~/.midnight-city/agent-skill/scripts/mcity-control.mjs` — confirm the exact
   **action submission route and JSON** (the one thing not yet pinned down).
2. Scaffold `worker/`: `wrangler.toml`, `src/index.ts` with (a) a `fetch`-based
   control client, (b) `decide()` ported from `decide.py`, (c) a `scheduled()` cron
   handler running the per-tick loop, (d) the Workers AI conversation replies.
3. `wrangler secret put MCITY_API_TOKEN` (paste the account token).
4. `wrangler deploy --config <absolute path>/worker/wrangler.toml`.
5. `pkill -f run-crew.sh` to retire the laptop daemon.
6. Verify: the crew stays active in `spectator/bootstrap` and on the live city page,
   and pending conversations start getting answered, with the Mac asleep.

## Reuse from other Moddable work

- Cloudflare account + Wrangler patterns: `moddable-web` and `moddable-tools`.
- Wrangler deploy rule (from project memory): **always `--config` with an absolute
  path**; nested configs cause the wrong worker to deploy.
- The live status page (`web/public/city.html`) already reads the public API and is
  the visible proof the Worker is doing its job.
