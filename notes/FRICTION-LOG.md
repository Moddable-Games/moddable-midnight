# Friction log

Running record of where Midnight's developer tooling helped, guessed or failed
while building this proof of concept. Each entry: what happened, what it cost,
and the fix worth suggesting.

## Findings before writing any code

Probed and, where an early conclusion turned out to be wrong, corrected before it
reached anyone. Evidence over impressions.

### 1. The Kapa MCP server needs a sign-in the docs do not mention

Docs (`/ai-integration/kapa-mcp-server`) give the command:

```
claude mcp add --transport http midnight https://midnight.mcp.kapa.ai
```

and state no API key is required. Probing on 2026-09-17:

- `GET https://midnight.mcp.kapa.ai/` returns 405
- `POST /` with a JSON-RPC `initialize` returns **401 `invalid_token`,
  "Authentication required"**
- `/.well-known/oauth-protected-resource` returns 200 and names the authorization
  server `https://mcp.kapa.ai/auth/public`, scope `openid`
- `/mcp`, `/sse`, `/messages` and `/v1/mcp` all return 404

So the server is healthy and expects an OAuth flow. Kapa's public MCP option
authenticates users through a Google or GitHub sign-in, which explains both the
401 and the docs' claim that no API key is needed: strictly true, since it is
OAuth rather than a key, but the sign-in step is never mentioned.

Effect: a first-time reader who curls the URL, or an agent probing the usual MCP
paths, sees a 401 or a 404 and nothing that points at a browser sign-in. On a
headless machine there is no stated route at all.

Suggested fix: state that the first connection opens a Google or GitHub sign-in,
and say what to do without a browser (API key auth, or a documented fallback).

### 2. midnightntwrk.expert is hard for agents to read

The site answers differently by `Accept` header: browsers get a Vite SPA whose
content only exists after JavaScript runs; agents get the plugin marketplace
JSON, served as `text/html`.

- `llms.txt`, `robots.txt`, `sitemap.xml` and `.well-known/ai-plugin.json` all
  return 200 with the catch-all response rather than real files
- Unknown paths return 200, so nothing is distinguishable from a typo
- The marketplace JSON does not link to the Kapa MCP server, and the docs do not
  link to the marketplace manifest

Effect: the tooling built to make Midnight agent-buildable is itself hard for an
agent to discover or crawl. `docs.midnight.network/llms.txt` (179KB) shows
the standard the expert site could meet.

Suggested fix: serve a real `llms.txt` and `sitemap.xml`, return 404 for unknown
paths, send `application/json` for the manifest, and cross-link the two tools.

### 3. Install guide pins an older compiler than `compact update` installs

`/getting-started/installation.md` says:

```
compact update 0.31.1
```

Running `compact update` with no argument on 2026-09-17 installed **0.34.0** and
set it as default. Toolchain `compact 0.5.2`.

Effect: a reader following the guide literally pins a version three releases
behind, and an agent reading the same page will suggest it.

~~Suggested fix: drop the pinned version from the guide, or mark it as an example
and point to `compact update` for the current release.~~

**Corrected at deploy time (finding 20):** the pin was right. 0.31.1 is the
version the networks and the stable SDK support; 0.34.0 compiles and tests
locally but cannot be deployed with stable tooling. The real problem is that
`compact update` installs a release the networks do not support, and nothing
says so. The better fix is the reverse of the one first suggested: keep the pin,
explain why, and have `compact update` warn when it moves past the supported
version.

### 4. The skills shape output, not just knowledge (positive)

Running `/midnight-expert:doctor` and `/midnight-tooling:doctor` returned a
health report that was genuinely good: status vocabulary from the check scripts
(`pass`, `warn`, `critical`, `info`), a defined badge mapping, table layouts and
section headings, all specified in the skill files rather than left to the
agent. The result read like a product feature, not a chat response.

Two things stood out:

- Once that style was established, it carried across the rest of the session.
  The agent kept the same reporting shape for later output, so the plugins set a
  house style rather than formatting one command.
- The formatting rules did some of the thinking: "omit sections where everything
  passes", "re-run only the checks that failed", "show the report, never the raw
  bash output". That is process encoded as instructions, and it made the answer
  shorter and more useful.

**Question worth asking the team:** how much of Midnight Expert's value is
knowledge (Compact syntax, SDK detail, verification) and how much is enforced
process (report shape, fix-then-verify loops, what not to show)? The second kind
seems to travel further than expected, and it is cheaper to maintain than
reference content that ages with every release.

### 5. A fresh install reports failing cross-plugin references

`/midnight-expert:doctor` on a clean machine flags four critical cross-plugin
references to a `devs` plugin that is not installed and is not in any configured
marketplace (checked `claude plugin marketplace list`: only the official
Anthropic marketplaces and `midnight-expert` are present):

```
compact-core  → devs:code-review        | critical | devs not installed
compact-core  → devs:typescript-core    | critical | devs not installed
compact-core  → devs:security-core      | critical | devs not installed
midnight-verify → devs:deps-maintenance | critical | devs not installed
```

Effect: a first-time user's health report opens with four criticals they cannot
act on, which makes the rest of the report easier to ignore.

Suggested fix: mark those references optional and downgrade them to `info` when
`devs` is absent, or say in the docs where `devs` comes from.

### 6. Setup notes from a clean install

- `octocode-mcp` added via `npx` timed out on first connect (30s). Installing it
  globally and pointing the server at the binary connected immediately. Worth a
  line in the fix table.
- Two MCP servers the plugins expect (`octocode`, `midnight-devnet`) are reported
  as "not configured in Claude Code — check that the plugin is installed and its
  MCP server is enabled", but the plugins ship no MCP server definitions, so the
  advice cannot resolve the warning. `octocode` has a documented add command in
  the doctor output; `midnight-devnet` does not.
- TypeScript was missing and is needed for witness type checking
  (`npm install -g typescript`).

## Open questions worth exploring

### Passwordless onboarding: passkeys and WebAuthn

*Revised after querying the Kapa knowledge base.*

What the knowledge base says:

- **No native account abstraction.** The docs' wallet matrix leaves the smart
  contract / account abstraction row empty: "Midnight has no native smart
  accounts". So the Ethereum route (a passkey-backed ERC-4337 account) has no
  direct equivalent.
- **Signature verification in Compact covers secp256k1, not P-256.** The
  standard library exposes `secp256k1EcdsaVerify` and `jubjubSchnorrVerify`.
  NIST P-256, the curve WebAuthn passkeys use, exists lower down in the
  `midnight-zk` Rust curves crate but is not exposed to Compact.
- **Consumer onboarding is pointed elsewhere.** The docs suggest Dynamic
  ("confirm Midnight support") or Wallet-as-a-Service for passkey onboarding,
  and list Midnight Passport, an announced MPC-based consumer wallet.

Questions this leaves, worth time on a later pass:

- Would exposing P-256 verification in the Compact standard library, given the
  curve already exists in `midnight-zk`, make contract-level passkey
  authorisation practical, and at what circuit cost?
- Is MPC (Midnight Passport) the intended passwordless path, rather than
  on-chain authorisation?
- Where does key recovery live when the wallet holds shielded state?

Relevant experience: I led passkey-based wallet infrastructure at Oviato, taking
prototypes to production architecture, so this is the gap I would most like to
dig into.

### Machine-payable endpoints and faucets for agents

Two adjacent threads, both relevant to a chain whose selling point is
regulator-friendly privacy.

**Agentic payments.** x402 (Coinbase, May 2025) revives HTTP 402: a client calls
an endpoint, the server answers `402` with payment terms, the client signs a
transfer authorisation and retries with it in a header. Today it settles USDC or
EURC on EVM chains and SPL USDC on Solana, and volumes are small (roughly $28k a
day in early 2026, much of it testing), but the direction is toward more chains
and tighter integration with agent tooling and MCP.

Questions Midnight is unusually placed to answer:

- What would a machine-payable endpoint look like where the *amount and the
  payer* are shielded, but a regulator or auditor can be given selective
  disclosure? That is a genuine differentiator over settling in public USDC.
- DUST is non-transferable and regenerates from held NIGHT. What does that mean
  for an agent paying per call: does it pay in a shielded custom token while DUST
  covers its own fees, and who funds the agent's NIGHT?
- Could an MCP server price individual tool calls this way? Moddable already runs
  a public API serving around 250,000 agent requests a week, so the metering
  problem is real rather than hypothetical.

**Faucets an agent can use.** Funding on `preview` and `preprod` is
captcha-gated: the official testkit `FaucetClient` sends an `X-Captcha-Token`
and a Turnstile token with each request, and the wallet CLI's `airdrop` works
only on the local `undeployed` network. DUST registration afterwards *is*
scriptable through the wallet SDK. So an agent can do everything except the
first step, which needs a human. A rate-limited, attested machine path would let
an agent take a contract from source to a deployed address unattended, a sharper
demonstration of "buildable by AI agents" than any tutorial.

### An agent-shaped wallet

*Corrected after querying the Kapa knowledge base: an earlier draft said this
did not obviously exist. It does, as community tooling.*

The community `midnight-wallet-cli` (npm, v0.5.2) ships an MCP server,
`midnight-wallet-mcp`, exposing wallet generation, balances, transfers, DUST
registration and local network control as tools. The docs say its newest tools
let an agent "drive the full contract lifecycle: deploy, call, and read state",
and that a two-step confirmation tool "shows the human what the agent is about
to spend before anything executes". The awesome-dapps list also includes
MidPilot, an AI spending assistant with local policy checks over the MCP wallet.

The docs are candid about the risk: the MCP column is "the highest-risk cell",
with a security checklist to scope tools, cap spend per action and per day,
allowlist destinations, and require human confirmation for anything
irreversible.

What remains open is where those limits live:

- **Guidance, not enforcement.** Caps and allowlists are recommended practice.
  With no native account abstraction there are no on-chain session keys or
  spend policies, so limits sit in the client, where a compromised agent process
  can ignore them.
- **Auditability with privacy.** On a shielded chain, an operator still needs to
  answer "what did my agent spend, and on what?" Selective disclosure could make
  that answerable to the operator and a regulator without publishing it.
- **DUST for machines.** DUST is non-transferable and regenerates from held
  NIGHT, so an agent cannot simply be sent gas; its funding model has to be
  designed.

Taken with the two notes above: payment per call, a faucet an agent can use,
and a wallet whose limits are enforced rather than advised are the three pieces
that would let an agent operate end to end with an operator still in control.

## During the build

Contract: an entry pass committed into a Merkle tree, a prize pool, and a claim
that proves membership and spends a nullifier without revealing which pass.
**Two compile attempts**: one rejection, then clean. The TypeScript side took
four rounds. Roughly 20% of the effort was Compact; 80% was the tooling around
it.

### 7. The pragma version is not the compiler version

Compiler 0.34.0 emits language version **0.26.0**:

```
$ compact compile --language-version
0.26.0
```

`contract-info.json` carries three independent numbers: compiler 0.34.0,
language 0.26.0, runtime 0.19.0. Every skill says to run
`compact compile --language-version`, but none says why. Anyone reasoning from
"I installed 0.34.0" writes `pragma language_version >= 0.34;` and gets a
rejection with no hint that two different version lines exist.

Suggested fix: one sentence in the pragma docs saying the language version is
versioned independently of the compiler and currently trails it.

### 8. Exported circuit parameters are witness-tainted, and no skill says so

The only compile failure, four errors at once:

```
potential witness-value disclosure must be declared but is not:
  witness value potentially disclosed:
    the value of parameter tid of the constructor at line 111 char 13
  nature of the disclosure:
    ledger operation might disclose the witness value
```

Every skill frames disclosure around `witness()` return values. Circuit
*parameters* are never mentioned, yet they are prover-supplied, so a plain
`commitment: Bytes<32>` argument needs `disclose()` before reaching
`passes.insert()`. Correct behaviour and arguably the right default, but
surprising, and it nudges a newcomer toward wrapping everything in `disclose()`
reflexively, which is the habit the privacy model exists to prevent.

The error message itself is excellent: it names the parameter, the line, the
nature of the disclosure and the path through the program.

Suggested fix: a row in the disclosure tables reading "an exported circuit's
parameters are private until disclosed".

### 9. Skill guidance for Merkle membership has a security gap

`compact-privacy-disclosure/references/privacy-patterns.md` gives an "Anonymous
Authentication with Nullifier" pattern that feeds the witness-supplied path
straight into `merkleTreePathRoot`. The witness returns the whole path
*including its leaf*, and nothing binds that leaf to the caller, so a witness
returning another member's path passes the check. The RWA example in
`compact-examples` carries a comment acknowledging the same gap in its own code.

The contract here rebinds the leaf in-circuit before hashing:

```compact
const bound = MerkleTreePath<16, Bytes<32>> { leaf: commitment, path: supplied.path };
```

and a deliberately lying witness (`claimPrizeWithStolenPath`) is rejected by the
test suite. The fix is three lines and costs nothing.

Suggested fix: correct the canonical pattern at source, with a sentence on why.
Anonymous Merkle membership is the flagship Midnight pattern, so this is the
example people will copy.

### 10. Runtime context API matches no documented shape (four rounds)

Writing witnesses was clean: the generated `Witnesses<PS>` type matched what
`compact-witness-ts` describes and type-checked first time. *Driving* the
contract from TypeScript did not. Getting new contract state out of a circuit
result took three wrong guesses:

- `result.context.transactionContext.state` — no such property
- `result.context.currentQueryContext.state` — exists on `CallContext`, not `CircuitContext`
- `result.context.callContext.currentQueryContext.state` — correct

Also `initialState()` returns a `ContractState` while `createCircuitContext` and
`ledger()` want a `ChargedState`, so `.data` is required. None of this appears in
any skill; it was found by reading
`node_modules/@midnight-ntwrk/compact-runtime/dist/circuit-context.d.ts`.

Suggested fix: a ten-line worked simulator example in the testing skill. Single
highest-value gap encountered.

### 11. Smaller papercuts

- **Generic stdlib struct literals compile** (`MerkleTreePath<16, Bytes<32>> { ... }`)
  but appear in no skill. This is what makes the security fix above possible, so
  it is worth documenting; the alternative is asserting leaf equality, which
  discloses a bit and is strictly weaker.
- **Field names differ across the boundary**: `goesLeft` in Compact becomes
  `goes_left` in the generated `index.d.ts`. Harmless until someone constructs a
  path by hand in TypeScript.
- **`compact format` has no line-width control** and collapsed multi-line hash
  argument vectors into a 101-character line. On cryptographic code, one
  domain-separated input per line is a review aid, not a style preference.

### 12. The compiler is smarter than the docs suggest (positive)

`makePassCommitment` reads a witness, so it is not `pure`, but it performs no
ledger operation. The compiler worked that out and marked it `"proof": false`,
emitting no ZKIR and no proving key, so a player derives their pass commitment
locally at zero proof cost. The skills present `pure` as a binary affecting
proving-key generation; the reality is a three-way split (pure /
impure-but-unproven / proven). Good behaviour the documentation undersells.

### 13. Skills were accurate on the language, weak on integration (positive and negative)

Reliable on Compact itself: `persistentCommit`'s `(value, rand)` signature,
`merkleTreePathRoot` generics, `HistoricMerkleTree` over `MerkleTree` for a
growing set, `Counter.read()` and `map.lookup()` naming traps, depth bounds, and
the commitment-versus-nullifier domain separation rule. The "Common
Hallucination Traps" tables are load-bearing and were used in preference to
recall. One rejection in two attempts is the result.

Everything *around* the contract — versions, runtime API, local testing, the
formatter — is where the time went.

### 14. Process note: a catch-all `git add` mixed unrelated work

While the contract was being written, a parallel commit of these notes ran
`git add -A` and swept the in-progress contract, witnesses, tests and
`package.json` into commits `2096b3c` and `19f8314`, whose messages describe
only the notes. Nothing was lost and the tree is clean, but the history is
misleading. Recorded rather than rewritten, since the commits were already
pushed. Lesson for an agent-driven repo: stage explicit paths when more than one
worker is active.

### 15. Kapa is much better than grepping the docs index (positive)

Once signed in, the Kapa MCP returned precise, sourced chunks spanning the docs,
the wallet specification, architecture decision records, the `midnight-zk`
crates and community tooling. Four queries surfaced things a grep of
`llms.txt` missed entirely: the community wallet MCP server, the absence of
native account abstraction, where P-256 lives, and the captcha on the faucet.
It corrected two claims in this log before they reached anyone.

Worth saying plainly because finding 1 is about Kapa's setup friction: the tool
itself is the best research surface in the ecosystem. The gap is getting to it.

### 16. Proof server instructions disagree across pages

- `guides/local-proving` pins `midnightntwrk/proof-server:8.1.0` and warns that
  `latest` "lags behind", last republished May 2026.
- `guides/run-proof-server` tells users to pull `midnightntwrk/proof-server:latest`.
- Tutorials pin `8.0.3` in some places and `8.1.0` in others, and some write
  `docker run ... 8.1.0 -- midnight-proof-server -v` while others omit the `--`.

Effect: a newcomer following the most obvious guide gets the lagging image, and
an agent reading several pages has no way to tell which is current.

Suggested fix: point every page at the support matrix for the tag, and retire
the `latest` instruction.

### 17. The docs' Midnight Expert description is already stale

The community wallets page describes Midnight Expert as "13 plugins (87 skills,
17 agents)". The marketplace installed 16 plugins on 17 September 2026. Minor,
but it is the kind of number an agent will repeat with confidence.

### 18. The wallet CLI deploys witness contracts only if you match an unwritten convention

`midnight contract deploy` does support contracts with witnesses, but only by
convention, which you find by reading the bundled source:

- It imports a **compiled** module from `dist/witnesses.js`, `src/witnesses.js`,
  `contract/dist/witnesses.js` or `contract/src/witnesses.js`. A TypeScript
  `src/witnesses.ts` is found but rejected, so a project tested with `tsx` needs
  a separate build step before it can deploy.
- It takes the named export `witnesses`, plus any export whose name starts with
  `create` and contains `privatestate`.
- It calls that factory as `createPrivateState(secretKey)` with **one** argument.
  If that throws, it tries no arguments, then silently falls back to `{}`. A
  factory needing two values (ours takes a secret key and a pass nonce) deploys
  with empty private state and fails later inside a witness, far from the cause.

**Suggested fix:** document the witness module contract on the CLI page, and
fail loudly instead of falling back to `{}` when a factory exists but throws.

### 19. The faucet hung on the first request and worked on the second

The preview faucet accepted the request at 12:55 and returned a drip id with
status `PENDING` and task status `scheduled`, and no transaction hash. Ten
minutes later nothing had reached the wallet. After about 30 minutes the web page
crashed. A second request went through in under a minute, and 5,000 tNIGHT
arrived at 13:21 ([transaction](https://preview.midnightexplorer.com/transactions/0x98b947897e9b174eee8be1ae55c1915b5424a7045a5b129f27621e9e0f3d7634)). There is no queue position or
expected wait, so neither a person nor an agent can tell slow from stuck.

## Deploying to the public testnet

### 20. The newest compiler cannot be deployed with the stable SDK

The default install path (`compact update`) gave compiler 0.34.0 and runtime
0.19.0. The contract compiled and passed every test. Deploying it failed.

The [compatibility matrix](https://docs.midnight.network/relnotes/support-matrix)
lists compiler 0.31.1, runtime 0.16.0 and Midnight.js 4.1.1 for preview, preprod
and mainnet alike. Midnight.js only accepts 0.19-era contracts from its 5.0 beta
line. The community wallet CLI bundles the stable 4.1.1 line.

The switch back took about ten minutes: install 0.31.1 alongside 0.34.0, relax
the pragma from `>= 0.26` to `>= 0.23` (the contract needed nothing newer), pin
the runtime, and adapt the test harness to the older runtime API
(`createCircuitContext` loses its circuit id argument, and state moves from
`context.callContext.currentQueryContext` to `context.currentQueryContext`).

**Suggested fix:** have `compact update` default to, or at least warn about, the
newest release the networks support. The matrix exists; the tools do not read it.

### 21. The latest `compact-js` on npm cannot be installed

`@midnight-ntwrk/compact-js@2.5.3`, tagged `latest`, depends on
`@midnight-ntwrk/ledger-v9@^0.1.0-alpha.1`, which is not published. `npm install`
fails with `ETARGET`. Pinning 2.5.1, the version in the compatibility matrix and
the one the wallet CLI bundles, works.

### 22. The wallet CLI deploy needs SDK packages in the project, and says it is a network error

The deploy writes a temporary script into the project and runs it there, so it
resolves `@midnight-ntwrk/midnight-js-*` from the project's own `node_modules`,
not from the CLI's. With none installed, it fails with `ERR_MODULE_NOT_FOUND`,
wrapped in an error coded `NETWORK_ERROR`. It took four minutes to fail. Seven
packages are needed: `compact-js`, `midnight-js-contracts`, `-network-id`,
`-http-client-proof-provider`, `-indexer-public-data-provider`,
`-level-private-state-provider` and `-node-zk-config-provider`.

**Suggested fix:** check for these before syncing the wallet, and print the
install command.

### 23. DUST registration succeeds, then reports failure

`midnight dust register` registered both UTXOs, then waited for DUST to appear,
timed out after five minutes and exited with `SYNC_TIMEOUT` (exit code 4). An
immediate `midnight dust status` showed the registration in place and 619 DUST
available. An agent trusting the exit code would retry or stop.

`--json` also does not suppress the progress spinner: the register run wrote
170KB of spinner frames to stdout ahead of the JSON result.

### 24. Deploying was fast once it worked (positive)

With the versions aligned, `midnight contract deploy` synced the wallet, proved
the constructor locally, balanced fees in DUST and submitted, in **25 seconds**.
The contract was queryable through the public indexer straight away. No human
signed anything: the agent wallet auto-approves, which is the point for testnet
and exactly the thing to constrain before mainnet.

The CLI also writes a `midnight-level-db/` directory into the project holding
the contract's private state, including the secret key. It is not in any default
`.gitignore`; a catch-all `git add` would publish it.

## Using the contract on-chain

### 25. Two copies of the ledger package break every call, not the deploy

The deploy worked. Every call after it failed within six seconds with
`expected instance of LedgerParameters`. `npm ls` showed two copies of
`@midnight-ntwrk/ledger-v8` (8.1.0 pinned by `midnight-js-protocol@4.1.1`, 8.1.2
from `compact-js@2.5.1`) and two of `onchain-runtime-v3` (3.0.0 and 3.1.1). An
`instanceof` check across the copies fails.

Adding npm `overrides` for both packages fixed it at once. The error names a
class, not a version conflict, so nothing points at the cause.

**Suggested fix:** align the exact pins inside the Midnight.js 4.1.x packages,
and name duplicate runtime packages in the error.

### 26. The wallet CLI replaces a contract's private state on every call

`midnight contract call` passes `initialPrivateState` to `findDeployedContract`
each time, built afresh by the project's `createPrivateState`. Midnight.js stores
whatever is passed, so the stored state from the previous call is overwritten.
The source comment says the stored state is kept and this is only a fallback;
the behaviour says otherwise.

For this contract that meant the pass nonce, randomly generated when not
supplied, changed between `issuePass` and `claimPrize`, and the claim failed
with "No entry pass found". The witness error message made the diagnosis quick.
The fix was to derive the nonce from the secret key, which keeps it unguessable
but limits a key to one pass. A contract storing anything that evolves in private
state (counters, balances, credentials) would lose it silently.

**Suggested fix:** omit `initialPrivateState` when stored state exists.

### 27. The CLI returns no transaction hashes and no circuit results

`contract call` returns `{"status":"success"}`. There is no transaction hash to
link to an explorer, and no return value, so a circuit like `makePassCommitment`
that exists to compute a value is unusable from the CLI. Getting the commitment
meant a script that reads the CLI's private state store directly, which in turn
meant reading the CLI source for the store name, account id and password.

That password is a constant in the published package,
`mn-contract-default-pwd-16ch`, so the private state store is effectively
unencrypted to anyone with the file. Fine for a testnet agent, worth a warning
before mainnet. Transaction hashes came from the public indexer's
`contract(address) { actions }` query, which worked well.

### 28. Front-end tooling exists, and assumes a browser wallet

Midnight Expert ships `midnight-dapp-dev`: an `init` skill scaffolding Vite,
React 19, shadcn and Tailwind v4, plus skills for the DApp Connector API and the
SDK, and a front-end agent. The docs add a leaderboard tutorial with a browser
DApp part, React and Next.js wallet-connect guides, and a community starter
template (see `KAPA-QUERIES.md`, query 5).

Every write path in that material goes through the Lace (or 1AM) browser
extension. The leaderboard tutorial also shows the read path that needs no
wallet: fetch contract state from the indexer and decode it with the compiled
contract's own `ledger()` function. The community CLI documents a local DApp
Connector on `ws://localhost:9932`, which could let a page transact through the
agent wallet instead of an extension. Not yet tried.

### 29. The explorer confirms the contract, labels the wrong deployment, and shows state as raw bytes

Midnight Explorer (preview) resolved the contract and the claim transaction,
checked against screenshots taken at 17:45.

- The contract page lists the **latest action**, the `claimPrize` call in block
  907,570, under "Deployment Tx". The actual deploy is `cae26415…` in block
  907,507, per the indexer's `ContractDeploy` action.
- Ledger state is a hex dump. The explorer has no way to decode it, because the
  layout lives in the compiled contract, not on-chain. Pool size, pass count and
  claim count are all in there, unreadable.
- The claim transaction page is a good privacy exhibit: status success, a fee of
  1 SPECK, 8,583 bytes, entry point `claimPrize`, no created or spent outputs, and
  nothing that identifies the claimant or the pass.

A contract-specific front end is the only way to show a reader what the state
means, which is the case for building one.

## Building the front end with `midnight-dapp-dev`

Started 17:48 by invoking the `midnight-dapp-dev:init` skill with
`--ui-name web --api-name api --contract-package moddable-midnight`. The script
ran in under a second and wrote 33 files: a Vite, React 19, shadcn and Tailwind
v4 app in `web/`, and a TypeScript API package in `api/`.

### 30. The scaffold assumes a monorepo that this project is not

- Contract detection looks for `*/src/managed/*/` with a `package.json` beside
  it, so a single-package project (contract at the root) is not found.
- The API package gets a `peerDependency` on the contract package by name. When
  that is the root package, `npm install` fails with a 404: npm looks for it on
  the public registry.
- The skill says it "updates root package.json workspaces if applicable". The
  script only does so when `workspaces` already exists, and says nothing when it
  does not, so `web/` and `api/` were left outside the install.

Fix applied: add `workspaces` by hand, drop the peer dependency, import the
compiled contract by relative path.

### 31. Caret ranges walk straight into findings 21 and 25

The API package declares `"@midnight-ntwrk/compact-js": "^2.5.1"`, which
resolves to the uninstallable 2.5.3, and `"@midnight-ntwrk/ledger-v8": "^8.1.0"`,
which invites the duplicate-package failure. Every Midnight dependency was
pinned to the exact versions that deployed (Midnight.js 4.1.1, compact-js 2.5.1,
runtime 0.16.0, ledger 8.1.2). Given how sensitive the stack is to mismatches,
the template should pin exact versions from the compatibility matrix.

### 32. The untouched scaffold does not typecheck, test or build

Straight after install:

- `tsc -b` reported errors: an unused import and two invalid casts in a test, an
  unresolvable API import until `api/` was built, two implicit `any`s, and the
  CommonJS Vite plugin "not callable" under its own types.
- `tsconfig.app.json` has no `noEmit`, so `tsc -b` wrote a `.js` file beside every
  source file. Vitest then ran every test twice.
- One test fails: it expects the text "Lace wallet"; the component says "No
  Midnight wallet extension found".
- `vite build` failed: `vite-plugin-top-level-await` 1.6.0 with Vite 7 throws
  "missing field `type`". The build targets `esnext`, which supports top-level
  await natively, so the plugin was removed.
- The build warns that `isomorphic-ws/browser.js` does not export `WebSocket`,
  which the indexer provider imports for subscriptions. Not yet tested at runtime.

About ten minutes to a green typecheck, 7 passing tests and a working build. The
resulting bundle carries 10.2MB of ledger WebAssembly (4.6MB gzipped).

### 33. The template is wallet-first; the read path is left to the reader

Everything hangs off a connected wallet: `createProviders(api)` takes the
DApp Connector session and reads the indexer URL from the wallet's
configuration. There is no way to show a contract's state to a visitor without
a wallet, although the leaderboard tutorial documents exactly that pattern.

The wallet half looks careful. The `balanceTx` and `submitTx` bridges carry
precise comments on the connector's hex encoding and return types, and the
template includes a wallet widget, a proof server status check and tests.
Those claims are unverified until the write path is tried.

### 34. Reading the contract from a browser was the smoothest step so far (positive)

The read-only page worked the first time it ran. The preview indexer allows any
origin, so the browser queries it directly with no proxy or key. Decoding with
`ContractState.deserialize` and the compiled contract's `ledger()` ran in the
browser through `vite-plugin-wasm`, exactly as the leaderboard tutorial
describes. It took about eight minutes from a green scaffold to a styled page
showing live pool, passes, claims, nullifiers and activity.

Two small notes:

- The scaffold keeps separate alias lists in `vite.config.ts` and
  `vitest.config.ts`, so a new alias has to be added twice or the tests cannot
  resolve it.
- Once the page stopped importing the wallet providers, the build dropped the
  10.2MB ledger WebAssembly entirely. A read-only page ships 1.3MB of WebAssembly
  and 1.1MB of JavaScript. The template bundles the wallet stack whether a page
  needs it or not.

## Setting up a browser wallet

### 35. Lace on Firefox cannot set up a Midnight wallet, and fails with "file not found"

Lace's Firefox setup screen, "Select a Blockchain", offers Cardano (Default),
Midnight (New) and Bitcoin (New). Selecting Midnight and pressing Next navigates
to `moz-extension://…/tab.html`, which does not exist in the Firefox build, and
Firefox shows its own "File not found" page. Selecting Cardano and pressing Next
goes on to "Choose recovery method" as normal. Observed from screenshots taken
17 Sep, 18:08 to 18:09.

This is a known gap, reported but unexplained in the product:

- The Firefox add-on is Lace 1.33.3, last updated 28 January 2026 (checked
  against the Mozilla add-ons API on 17 September 2026).
- [Lace issue #2206](https://github.com/input-output-hk/lace/issues/2206), opened
  1 April 2026, says 1.33.3 "does not support Midnight". It is open, with no
  comments.
- Midnight's wallet reference lists Lace's browser extension as Chrome and Edge
  only, and 1AM as available on Chrome and Firefox.

The setup screen still offers Midnight on Firefox and then breaks, so the user
finds out by hitting an error page rather than a message. Neither the add-on
listing nor the Lace setup flow says Midnight needs Chrome or Edge.

**Workaround:** Lace in Chrome or Edge. 1AM is not a Firefox option either, despite
the docs (finding 36).

**Suggested fix:** hide Midnight in the Firefox build's setup, or show "Midnight
requires Chrome or Edge" in its place, until the Firefox add-on is updated.

### 36. No Midnight wallet could be found for Firefox, although the docs list one

Midnight's wallet reference lists 1AM with "Browser extension: Yes (Chrome,
Firefox)", and its 1AM profile says "Chrome and Firefox extensions are live".
Checked on 17 September 2026:

- A person looking for 1AM in Firefox could not find it.
- Searching the Mozilla add-ons API for "1am", "1AM wallet", "1am.xyz" and the
  developer name "webisoft" returned no 1AM extension.
- 1am.xyz mentions Firefox in its copy, but the only extension download link on
  the page is to the Chrome Web Store.
- The Lace add-on on Firefox is 1.33.3, without Midnight (finding 35).
- SubWallet, listed among wallets announcing Midnight support, is on Firefox as
  version 1.2.32, last updated October 2024, before Midnight's launch.

So a Firefox user currently has no browser wallet for Midnight that could be
found, and the documentation says otherwise. The alternatives are a Chromium
browser, or a CLI wallet such as `midnight-wallet-cli`.

**Suggested fix:** correct the 1AM entry, or link the Firefox listing if it
exists; and state browser support plainly on the "Fund a wallet" and Lace pages,
which are where a newcomer meets the choice.
