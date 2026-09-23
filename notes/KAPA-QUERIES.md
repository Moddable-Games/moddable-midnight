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

### 6. Checking the documentation's caveats

**Asked (17 Sep, ~18:05), four queries:** DUST fee privacy and wallet linkage;
`HistoricMerkleTree` historic roots and anonymity; whether the preview network is
reset; paying tokens out of a contract.

**Came back from:** the tokens overview, DUST architecture page, ledger DUST
specification and tokenomics whitepaper; the ledger data types reference,
security best practices guide and a ledger VM test; a midnight-node change note on
the June 2026 preview reset; the standard library reference, token transfer
example and shielded token tutorial.

**What it established:**

- DUST is shielded; spends publish the fee, not the owner; sponsorship exists
- `checkRoot` on a historic tree accepts any past root; the docs warn that small
  trees give almost no privacy
- Preview was reset in June 2026
- `sendUnshielded` names a public recipient; shielded delivery works reliably
  only to the caller

**What it changed:** four caveats went from "not analysed" or assumption to
sourced statements in `docs/INTEGRATION.md`. One claim on the front end
("no address appears") was replaced with what the evidence supports. The claim
that issued commitments are visible was checked directly against the chain and
corrected: a hash of each commitment is visible, not the commitment.

### 7. Token metadata and NFT images (23 September)

**Asked:** "Is there an NFT token standard on Midnight with metadata and images? Can a
wallet display token images or metadata for tokens minted by a contract?"

**Came back from:** the architecture repository's Token Metadata specification, ADR 0015
(off-chain token metadata, status Proposed), ADR 0012 (manual token names), the metadata
server API spec, and the tokens overview.

**What it established:** token metadata (name, ticker, image, supply) is specified as a
signed off-chain document, CIP-26 style, served by an indexer metadata server; token
standards are due through the MIP process.

**What it changed:** set the design to IPFS-addressed metadata with an on-chain digest.
Introspecting the preview indexer then showed nothing serves that metadata yet (finding 39).

### 8. The minting API and its language version

**Asked:** "Compact mintUnshieldedToken example contract, sendUnshielded, token domain
separator, minimum language version required for token minting."

**Came back from:** the token transfers example contract, the unshielded token tutorial,
the standard library reference, the ledger ADT reference, and the midnight-js e2e tests.

**What it established:** exact signatures for `mintUnshieldedToken`, `mintShieldedToken`
and `sendUnshielded`, and a tutorial using `pragma language_version 0.23`.

**What it changed:** ruled out the feared version wall before any code was written. The
spike then compiled on the pinned 0.31.1 first time.

### 9. Wallet balances without a wallet

**Asked:** "How to query an unshielded address balance or UTXOs from a public API without
running a wallet?"

**Came back from:** the indexer API v4 reference, the midnight-js indexer data provider,
and its release notes.

**What it established:** `queryUnshieldedBalances` is for contract addresses only, but the
indexer has a subscription, `unshieldedTransactions(address)`, streaming every unshielded
event for a wallet address.

**What it changed:** **corrected our own claim**, made an hour earlier after introspecting
only the query type, that live balances needed a hosted relay. The wallet page now reads
balances straight from the public indexer.

### 10. Why a deploy hangs on a synced wallet

**Asked:** "contract deploy wallet sync timed out preview network, shielded sync never
completes, requireStrictSync, what does the wallet need synced before deploying a contract."

**Came back from:** the unshielded token tutorial's `syncWallet`, the bboard tutorial, the
example hello-world wallet, the testkit, and the community wallet troubleshooting table.

**What it established:** the tutorial deliberately does not gate on DUST, warning it "may
never report strictly complete" on public networks; the troubleshooting table lists
"Deploy fails before it starts: wallet not fully synced".

**What it changed:** pointed at the right mechanism (a sync predicate that never becomes
true), but the channel was wrong. Measuring each channel showed DUST settled in under a
second and shielded was the slow one, and the CLI never saved shielded progress
(finding 40, corrected). Useful, not decisive: the answer still had to be measured.

### 11. Shielded NFTs minted to someone else

**Asked:** "When a Compact contract calls mintShieldedToken with recipient
left(ZswapCoinPublicKey) of a user, does the user's wallet detect and receive that shielded
coin automatically, or does it need the encryption public key?"

**Came back from:** the midnight-node toolkit README, the standard library reference for
`sendShielded`, the shielded token tutorial, midnight-js 4.0.4 release notes, and
midnight-js `zswap-utils`.

**What it established:** a shielded coin sent to a user other than the transaction's caller
carries no ciphertext unless the caller supplies that user's encryption key: "the
transaction will succeed, but no coins will be visible in the destination wallet". midnight-js
accepts the mapping as `additionalCoinEncPublicKeyMappings`.

**What it changed:** **caught a silent failure before it shipped.** The v2 contract's
`issueMandate` mints each agent's NFT from the organiser's transaction. As first planned
it would have succeeded on chain and delivered NFTs no agent could see. The daemon holds
every wallet, so it passes the mapping.

### 12. How an NFT should reference its metadata and image

**Asked:** "How should an NFT on Midnight reference its metadata or image, for example
with a token URI or an IPFS CID?"

**Returned:** the token metadata spec (`midnight-architecture`,
`apis-and-common-types/metadata/Token Metadata.md`), ADR 0015 and the metadata
specification:

- **Where metadata lives:** off-chain, CIP-26 style, as a document per token type
- **Fields:** `subject`, `contract_address`, `domain_separator`, `shielded`, `ticker`,
  `name`, `version`, `signatures`, and optionally `description`, `image`, `decimals` and
  `supply`
- **Images:** the spec's own example uses `"image": "ipfs://aaa/image.png"`
- **Integrity:** clients may check a document against "an anchor (being hash of metadata
  canonical form published in a different place, like on-chain)"
- **Canonical form:** RFC 8785, with `signatures` removed before hashing

**What it changed:** **gave the design.** The crew treasury stores the SHA-256 of each
canonical document, the documents reference images by IPFS CID, and the daemon verifies
both before the wallet page shows a name or image. Each document's subject is re-derived
from the contract address and domain separator with `ledger-v8`'s `rawTokenType`. It
matched every token type seen on chain, which confirms the contract's domain derivation
too. The one required field we skip is `signatures` (Schnorr over secp256k1): nothing on
preview verifies or serves the documents yet (finding 39), so the on-chain anchor does
that job.

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
