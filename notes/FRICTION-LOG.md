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

Suggested fix: drop the pinned version from the guide, or mark it as an example
and point to `compact update` for the current release.

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

Neither the docs (`llms.txt`, 1,834 lines) nor OpenZeppelin's Compact library
mention passkeys or WebAuthn. On Ethereum, passkey-backed smart accounts
(WebAuthn plus ERC-4337) removed seed phrases from onboarding, which is the
single biggest drop-off in consumer wallets. Midnight's account model is
different: shielded notes and a UTXO-style ledger rather than programmable
accounts, so the same pattern does not port directly.

Questions this raises, and worth time on a later pass:

- What does onboarding look like for a player who will never manage a seed
  phrase, and is passwordless entry on anyone's roadmap?
- Could a Compact contract verify a P-256 signature, and what would that cost in
  circuit terms?
- Where should key recovery live when the wallet holds shielded state?

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

**Faucets an agent can use.** Funding on `preview` currently means a human in a
browser: request tNIGHT, then register it so DUST generates. An agent building
and deploying end to end stops dead at that step. A rate-limited, attested
machine path (or a documented scripted route through the wallet SDK) would let an
agent take a contract from source to a deployed address unattended, which is a
sharper demonstration of "buildable by AI agents" than any tutorial.

### An agent-shaped wallet

The pieces for a headless wallet exist: the Wallet SDK covers a facade, HD key
derivation, address encoding, transfers, DUST management and atomic swaps, and
testkit-js exposes seed helpers for tests. So a script can hold keys and move
value today.

What does not obviously exist is a wallet shaped for an autonomous agent, where
the interesting questions are about restraint rather than capability:

- **Spend policy.** Per-call and per-day caps, an allowlist of contracts or
  endpoints, and a hard ceiling the agent cannot raise on its own.
- **Key custody.** Where does an agent's key live so that a compromised process
  is not a drained wallet? Session keys with short lives, and a separate
  funding key the agent never sees, would be the obvious shape.
- **Approval boundaries.** Which actions run unattended and which need a human,
  with the boundary declared up front rather than discovered after an incident.
- **Auditability with privacy.** On a shielded chain, an operator still needs to
  answer "what did my agent spend, and on what?" Selective disclosure could make
  that answerable to the operator and to a regulator without publishing it to
  everyone. That is the combination no public-chain agent wallet offers today.
- **DUST for machines.** DUST is non-transferable and regenerates from held
  NIGHT, so an agent cannot simply be sent gas. Its funding model has to be
  designed rather than assumed.

This connects the previous two notes: an agent that can pay per call (x402
style) and fund itself (a machine-usable faucet) still needs somewhere safe to
keep the keys, with limits an operator sets. A reference implementation of that,
even a small one, would say more about "buildable by AI agents" than another
tutorial contract.

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
