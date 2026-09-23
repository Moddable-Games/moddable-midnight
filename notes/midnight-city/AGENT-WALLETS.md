# The crew's Midnight wallets

Midnight City asks agents to hold NIGHT (the Central ShieldedToken Broker sells a
ShieldedToken for it) and gives self-hosted agents no way to register a wallet:
the Agent Wallets panel says owner-managed agents appear "only after they publish
a visual wallet through their API", and no such API is documented or present in
the skill bundle (city finding 25, blocked upstream on Passport issue #113).

So the association lives here instead, in public, where anyone can check it. Each
crew member has a real Preview wallet, created on 23 September 2026 with
`midnight wallet generate`, funded from the Midnight preview faucet, and
registered for DUST generation. Seeds are in `~/.midnight/wallets/`, never in this
repository.

| Agent | City agent id | Wallet | Preview address |
|---|---|---|---|
| Floyd | `user-agent-u4gfp92xeor3g2a` | `agent-floyd` | `mn_addr_preview1wg2ef7spxl8wfahg890z5q4kuhtc234ks7rx65djg3dc9f5ltx4sr69gyw` |
| Tzilo | `user-agent-5wzs7d9q4cdz5gi` | `agent-tzilo` | `mn_addr_preview12t3k3nkssja6ksfjqkkx5sfdzue9j33fpztgsheyszrpu63yq77s0epzru` |
| FooFoo | `user-agent-oyhuxtu984deja8` | `agent-foofoo` | `mn_addr_preview1qkehtq54t8damevjy953sdua2qtad6adyer4cersc3ql9sw8envsg7kw3g` |

The organiser wallet, which funds them and deploys the contracts, is
`moddable-preview`:
`mn_addr_preview1zh5vgfsj5v0d85xps8lxjv8wata8cfwafc54tkgy8umsgms35c3s4gsema`.

## Funding

Faucet drips of 5,000 tNIGHT each on 23 September (the faucet documentation says
1,000 per request; it sent 5,000, as it did on 17 September):

| Agent | Funding transaction |
|---|---|
| Tzilo | `00f4532a44d03255d24fb3c503de0882a0dcfaac44f9636438388cb635c114949a` |
| FooFoo | `00efd665c68efc080706322cb6cc26e033f083553a2b761262d44e28c1e081430f` |
| Floyd | `006935a08c2e5d780c96b0251d87a4f9ea7f370062ceeb07e16a70e260be6bc0ab` |

Floyd also holds 1 NIGHT sent from the organiser wallet, the first treasury-to-agent
transfer, in `009cdea3b9c64c94ce25eb4e41e6d97307771d28dfc1c5e94014903545e32ba6e4`.

## What a funded agent still cannot do

NIGHT alone pays for nothing. Each wallet's UTXOs must be registered for DUST
generation before the agent can submit any transaction, and `midnight dust
register` reports `SYNC_TIMEOUT` while having succeeded (friction log finding 23,
first seen 17 September, reproduced on these fresh wallets on 23 September). Check
`midnight dust status` rather than the exit code.

This matters for the treasury design: an agent funded at the moment it needs to
spend is an agent that cannot spend. Funding has to run ahead of demand.
