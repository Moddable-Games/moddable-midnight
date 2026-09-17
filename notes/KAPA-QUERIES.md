# Kapa knowledge base: query record

A record of every question put to Midnight's Kapa MCP server during this build,
what came back, and what it changed. Kept separately from the friction log so
the tool's usefulness can be judged on evidence rather than impression.

## Setup

| Step | Detail |
|------|--------|
| Server | `https://midnight.mcp.kapa.ai`, HTTP transport |
| Added | `claude mcp add --scope user --transport http midnight https://midnight.mcp.kapa.ai` |
| Auth | OAuth, Google or GitHub sign-in in a browser (see friction log, finding 1) |
| Session restart needed | Yes, MCP servers load at session start |
| Tool exposed | `search_midnight_knowledge_sources`: one natural-language query in, a fixed number of ranked chunks out, each with a source URL |

## How it compared with the alternative

Before Kapa was available, research meant grepping `docs.midnight.network/llms.txt`
(1,834 lines, an index of page titles and one-line descriptions). That index
answered "does a page with this name exist", not "what does the page say", and it
cannot see the source repositories at all.

## Queries

### 1. Passkeys and P-256

**Asked (17 Sep, ~12:45):** "Does Midnight support passkeys, WebAuthn, or P-256
(secp256r1) signature verification for wallets or in Compact contracts?"

**Came back from:** the Compact standard library reference, the `midnight-zk`
curves crate README, architecture decision record 17 (signature scheme), the
wallet specification, and network cryptography docs.

**What it established:**

- Compact exposes `secp256k1EcdsaVerify` and `jubjubSchnorrVerify`; no P-256
  verification in the standard library
- P-256 exists in `midnight-zk` as a Rust curve module, below Compact
- The wallet HD structure uses secp256k1 (Schnorr, with opt-in ECDSA)

**What it changed:** the passkeys open question went from "the docs don't
mention it" to a specific proposal: expose the P-256 curve that already exists in
`midnight-zk` to Compact.

**Previous method would have found:** none of it. `llms.txt` has zero hits for
passkey or WebAuthn, and no visibility into `midnight-zk` or the ADRs.

### 2. Funding a wallet without a browser

**Asked:** "How can I fund a wallet on the preview network programmatically with
the wallet SDK instead of using the faucet website in a browser?"

**Came back from:** the "Funding a wallet" guide (SDK procedure with code), the
community wallet CLI and MCP page, the `midnight-dust-generator` repository, the
`midnight-local-dev` funding source, and the testkit `FaucetClient` source.

**What it established:**

- The testnet faucets need a captcha: the testkit client sends an
  `X-Captcha-Token` and a Turnstile token
- The wallet CLI's `airdrop` works only on the local `undeployed` network
- Registering NIGHT for DUST generation is fully scriptable through the SDK,
  with working code

**What it changed:** confirmed the faucet finding with source-level evidence
rather than inference, and separated the human-only step (funding) from the
scriptable one (registration).

### 3. Running the proof server

**Asked:** "How do I run the Midnight proof server locally with Docker, including
the image name and command?"

**Came back from:** five doc pages and two repositories.

**What it established:** `midnightntwrk/proof-server:8.1.0` is current stable,
and `latest` lags (last republished May 2026). The retrieved pages also disagree
with one another on the tag and command syntax.

**What it changed:** the proof server was started on the correct pinned tag
first time, and the disagreement became friction log finding 16. Kapa
surfaced the contradiction because it returned several pages side by side.

### 4. Agents, payments and wallets

**Asked:** "Can AI agents or autonomous software make payments on Midnight, and
are there spending limits, session keys, or agent wallet features?"

**Came back from:** the community wallets overview and its custody matrix, the
wallet CLI and MCP page, the wallet security checklist, the awesome-dapps list,
and the tokenomics whitepaper.

**What it established:**

- A community wallet MCP server exists and can deploy, call and read contracts,
  with a two-step spend confirmation
- Midnight has no native account abstraction, so no on-chain session keys
- The docs recommend spend caps, allowlists and human confirmation for agents
- MidPilot, a community AI spending assistant, applies local policy checks

**What it changed:** **corrected a claim already in the log.** An earlier draft
said an agent-shaped wallet did not obviously exist. It does, as community
tooling, and the open question narrowed to where limits are enforced.

### 5. Building a front end

**Asked (17 Sep, ~17:42):** "Building a Midnight DApp frontend in the browser:
React, Lace wallet DApp connector, reading contract state from the indexer, UI
templates"

**Came back from:** the leaderboard tutorial (browser DApp part and overview),
the Edda Labs starter template page, the community wallet integration guide, the
wallet SDK developer guide, and the React and Next.js wallet-connect guides.

**What it established:**

- A read-only view needs no wallet: query `contractAction(address) { state }`
  from the indexer and decode it with the compiled contract's `ledger()`
- Browser writes go through the DApp Connector API (`window.midnight`), with
  Lace and 1AM as the documented wallets
- The community CLI exposes a local connector on `ws://localhost:9932`
- The starter template and tutorial both target compiler 0.30 to 0.31, runtime
  0.16 and Midnight.js 4.1.1, matching what deployment forced (finding 20)

**What it changed:** the front end starts read-only, decoding state in the
browser, rather than asking anyone to install a wallet extension.

## Assessment so far

**Strong:**

- Retrieval reaches source repositories, ADRs, specifications and the
  whitepaper, not just docs pages
- Every chunk carries a source URL, so claims can be checked and cited
- Returning several sources side by side exposes contradictions between them
- Two claims in the friction log were corrected before reaching anyone

**Limits observed:**

- Fixed top-k results: answers are long, and the reader still has to synthesise
- Community and official material arrive mixed together; the docs flag that the
  Foundation does not maintain community projects, but the chunks themselves
  do not always say so
- No answer text, only retrieval, so quality depends on the question being
  specific

**Verdict for now:** the most useful research tool in the ecosystem once
connected, and worth putting in front of every new builder. The friction is
entirely in reaching it: OAuth nobody mentions, and a restart.
