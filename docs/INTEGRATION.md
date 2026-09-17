# Integrating with the tournament pass contract

Everything needed to read from, or write to, the deployed contract: addresses,
endpoints, what is public and what stays private, real responses from the
public indexer, and the exact SDK versions that work.

Every example below was captured from the live contract on 17 September 2026.
Nothing is illustrative.

- [Deployment](#deployment)
- [Public and private data](#public-and-private-data)
- [Circuits](#circuits)
- [Reading: no wallet needed](#reading-no-wallet-needed)
- [Writing: wallet, proof server and SDK](#writing-wallet-proof-server-and-sdk)
- [Versions that work together](#versions-that-work-together)
- [Caveats](#caveats)

## Deployment

| | |
|---|---|
| Network | `preview` (public testnet) |
| Contract address | `2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191` |
| Deploy transaction | `cae26415ed0ab92ee22f8c0feb4ef61ef0d0283161bddd875b70fc2c1aa812ca` |
| Deployed in block | 907,507 |
| Indexer (GraphQL, HTTP) | `https://indexer.preview.midnight.network/api/v4/graphql` |
| Explorer | [preview.midnightexplorer.com](https://preview.midnightexplorer.com/contracts/2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191) |
| Proof server (writes only) | Local, `http://localhost:6300`, image `midnightntwrk/proof-server:8.1.0` |

The indexer needs no key and allows any origin (`access-control-allow-origin: *`),
so a browser page can query it directly.

Explorer URLs take the contract address as-is and a transaction hash prefixed
with `0x`. The explorer's "Deployment Tx" field on the contract page shows the
latest action, not the deploy (friction log, finding 29).

## Public and private data

Midnight contracts keep two kinds of state. The public ledger lives on-chain and
anyone can read it. Private state lives with the user, is used to build a
zero-knowledge proof locally, and never leaves their machine.

| Data | Where it lives | Who can see it | How a page gets it |
|---|---|---|---|
| `tournamentId` | Public ledger (sealed at deploy) | Anyone | Indexer |
| `organiser`: hash of the organiser's secret key | Public ledger (sealed at deploy) | Anyone | Indexer |
| `prizePerClaim`, `prizePool` | Public ledger | Anyone | Indexer |
| `passCount`, `claimCount` | Public ledger | Anyone | Indexer |
| `passes`: pass commitments in a historic Merkle tree | Public ledger | Anyone (root and each inserted commitment) | Indexer |
| `spentPasses`: spent nullifiers | Public ledger | Anyone | Indexer |
| Contract activity: transaction hash, block, circuit name | Chain | Anyone | Indexer |
| Secret key (32 bytes) | Player's device | The player only | Wallet tooling or the app's private state store |
| Pass nonce (32 bytes) | Player's device | The player only | Derived from the secret key in this build |
| Merkle path for the player's pass | Computed on the device from public data | Never published | `findPassPath` witness |
| Which pass a claim used | Nowhere | Nobody | Not recoverable from the chain |

The link between the two columns is the proof. A claim shows the circuit that
the player knows a secret key and nonce whose commitment is in the tree, and that
the nullifier they publish was derived from the same values. The chain sees the
nullifier and the Merkle root, not the leaf.

## Circuits

From `midnight contract inspect` against the compiled contract.

| Circuit | Arguments | Who can call | Changes | Transaction |
|---|---|---|---|---|
| `constructor` | `tid: Bytes<32>`, `prize: Uint<64>` | Deployer, who becomes organiser | Seals `organiser`, `tournamentId`, sets `prizePerClaim` | Deploy |
| `makePassCommitment` | none | Anyone, locally | Nothing; returns `Bytes<32>` | None (runs off-chain) |
| `issuePass` | `commitment: Bytes<32>` | Organiser only | Inserts commitment, `passCount + 1` | Yes |
| `fundPool` | `amount: Uint<64>` (above 0) | Organiser only | `prizePool + amount` | Yes |
| `claimPrize` | none (all inputs are private) | Any pass holder, once per pass | Inserts nullifier, `prizePool - prizePerClaim`, `claimCount + 1` | Yes |

Witnesses the calling application must supply: `localSecretKey()`,
`passNonce()` and `findPassPath(commitment)`. Their implementation is in
[`src/witnesses.ts`](../src/witnesses.ts).

"Organiser only" is enforced in-circuit: the caller's secret key must hash to the
sealed `organiser` value.

## Reading: no wallet needed

Two GraphQL queries give everything the [front end](../web/) shows.

![The read-only front end decoding the live contract](img/read-only-front-end.png)
 Send them as
a JSON `POST` with `{"query": "...", "variables": {...}}`.

### Contract history

```graphql
query History($address: HexEncoded!) {
  contract(address: $address) {
    actions {
      __typename
      transaction { hash block { height timestamp } }
      ... on ContractCall { entryPoint }
    }
  }
}
```

Response (newest first; `timestamp` is milliseconds since the epoch):

```json
{
  "data": {
    "contract": {
      "actions": [
        {
          "__typename": "ContractCall",
          "entryPoint": "claimPrize",
          "transaction": {
            "hash": "c2d1cfd9553df5294c431c563706154a0e2d52a16b1b3e5ec64f54e0c6e7aeed",
            "block": { "height": 907570, "timestamp": 1789663302000 }
          }
        },
        {
          "__typename": "ContractCall",
          "entryPoint": "issuePass",
          "transaction": {
            "hash": "5e31df51cb8c88eeb319b863d0dc85fdd5aecd97a53ae2ccc0b9b6edf3f47d65",
            "block": { "height": 907565, "timestamp": 1789663272000 }
          }
        },
        {
          "__typename": "ContractCall",
          "entryPoint": "issuePass",
          "transaction": {
            "hash": "3f8414661bd018856dd405c1ac8d25242ad05ea2d467453585bea23e48e1f1b2",
            "block": { "height": 907551, "timestamp": 1789663188000 }
          }
        },
        {
          "__typename": "ContractCall",
          "entryPoint": "fundPool",
          "transaction": {
            "hash": "42c0d67322885a26ef0b3737400cccc2de365a1835f8113124bc2212c408fa1a",
            "block": { "height": 907545, "timestamp": 1789663152001 }
          }
        },
        {
          "__typename": "ContractDeploy",
          "transaction": {
            "hash": "cae26415ed0ab92ee22f8c0feb4ef61ef0d0283161bddd875b70fc2c1aa812ca",
            "block": { "height": 907507, "timestamp": 1789662924000 }
          }
        }
      ]
    }
  }
}
```

### Current state

```graphql
query State($address: HexEncoded!) {
  contractAction(address: $address) { state }
}
```

The response is one hex string, 8,435 bytes at the time of writing. The first
bytes decode as ASCII to `midnight:contract-state[v6]:`; the rest is only
meaningful to the compiled contract.

```json
{
  "data": {
    "contractAction": {
      "state": "6d69646e696768743a636f6e74726163742d73746174655b76365d3ae1010004040400080104040490030440806b5f8b47…"
    }
  }
}
```

### Decoding the state

The compiled contract's generated `ledger()` function names the fields. This is
the core of [`web/src/lib/tournament.ts`](../web/src/lib/tournament.ts):

```ts
import { ContractState } from "@midnight-ntwrk/compact-runtime";
import { ledger } from "../src/managed/tournament_pass/contract/index.js";

const bytes = Uint8Array.from(stateHex.match(/../g)!, (b) => parseInt(b, 16));
const state = ledger(ContractState.deserialize(bytes).data);

state.prizePool;                     // bigint
state.passes.root().field;           // bigint, the Merkle root
Array.from(state.spentPasses);       // Uint8Array[], the nullifiers
```

Decoded, as JSON:

```json
{
  "tournamentId": "bfb4129d9dfc3a0cc495e4fd2634f9508de228b223d50a86c5c588a0ae0fedf3",
  "organiser": "0ce331f7c28607cbb065c53cbe39f34fafbb981b0f12c8278962ad5d11d17d78",
  "prizePool": "400",
  "prizePerClaim": "100",
  "passCount": "2",
  "claimCount": "1",
  "merkleRoot": "36775908253063397957654760888682033780440796058515540635724170409338408184141",
  "spentNullifiers": [
    "fb90e17aed11269f7d2ce68cceef2a1fa76c51682a2ff5ca55d8b01e5fa3974b"
  ]
}
```

A browser build needs the WebAssembly runtime `compact-runtime` depends on. With
Vite, `vite-plugin-wasm` handles it; the read-only page ships 1.3MB of
WebAssembly (393KB gzipped) and 1.1MB of JavaScript (192KB gzipped).

## Writing: wallet, proof server and SDK

A write builds a proof on the caller's machine, so it needs three things a read
does not: a funded wallet holding DUST for fees, a local proof server, and the
contract's witnesses.

### Prerequisites

```bash
docker run -d -p 6300:6300 midnightntwrk/proof-server:8.1.0 midnight-proof-server -v
npm run compile   # compiler 0.31.1, see Versions below
npm run build     # emits dist/witnesses.js for the wallet CLI
```

A wallet on `preview` needs tNIGHT from the faucet (captcha, done by a person),
then registration for DUST generation, which an agent can do:

```bash
midnight dust register --wallet moddable-preview --network preview
midnight dust status --wallet moddable-preview --network preview --json
```

```json
{"subcommand":"status","registered":true,"registeredUtxos":2,"unregisteredUtxos":0,"dustBalance":"619.198299999999999","dustAvailable":true,"eventsApplied":14,"ownedUtxos":2,"cached":true,"network":"preview"}
```

### Headless, with the agent wallet

These are the commands that produced the transactions listed above, using the
community [`midnight-wallet-cli`](https://docs.midnight.network/sdks/community/wallets/community-wallets-cli-mcp)
0.5.2. Arguments are JSON: numbers become `bigint`, and arrays of 0 to 255
integers become `Uint8Array`.

```bash
# Deploy. tid is SHA-256("moddable-midnight/tournament-001") as 32 integers.
midnight contract deploy --managed src/managed/tournament_pass \
  --network preview --wallet moddable-preview \
  --args '{"tid": [191,180,18,157, …], "prize": 100}' --json
```

```json
{"subcommand":"deploy","contractName":"tournament_pass","address":"2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191","network":"preview"}
```

```bash
midnight contract call --address 2a7fe78c…e1c191 --managed src/managed/tournament_pass \
  --network preview --wallet moddable-preview \
  --circuit fundPool --args '{"amount": 500}' --json
```

```json
{"subcommand":"call","contractName":"tournament_pass","circuit":"fundPool","address":"2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191","network":"preview","status":"success"}
```

`issuePass` takes the 32-byte commitment printed by
[`scripts/pass-commitment.ts`](../scripts/pass-commitment.ts), and `claimPrize`
takes `'{}'`. Each call took 29 to 30 seconds, most of it proving.

The CLI returns no transaction hash; take it from the indexer's history query.
Reading back public state is also built in:

```bash
midnight contract state --address 2a7fe78c…e1c191 --managed src/managed/tournament_pass \
  --network preview --wallet moddable-preview --json
```

```json
{"subcommand":"state","address":"2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191","network":"preview","fields":{"organiser":"0ce331f7c28607cbb065c53cbe39f34fafbb981b0f12c8278962ad5d11d17d78","tournamentId":"bfb4129d9dfc3a0cc495e4fd2634f9508de228b223d50a86c5c588a0ae0fedf3","passes":"{}","passCount":"2","claimCount":"1","prizePool":"400","prizePerClaim":"100"},"maps":{"spentPasses":{"size":"1"}}}
```

### What the CLI expects from the project

Found by reading its source (friction log, findings 18, 22 and 26):

| Requirement | Detail |
|---|---|
| Witness module | Compiled JavaScript at `dist/witnesses.js` or `src/witnesses.js`, exporting `witnesses` |
| Private state factory | An export whose name starts with `create` and contains `privatestate`, callable with the secret key alone |
| Private state store | `./midnight-level-db/`, store and id `tournament_passPrivateState`, account `mn-contract-runner`. Gitignore it: it holds secrets |
| Private state lifetime | Replaced on every call; anything that must persist has to be derivable from the secret key |
| SDK packages | Installed in the project itself, not only the CLI; list below |

### In a browser

Writes from a page go through the DApp Connector API (`window.midnight`), with
Lace or 1AM as the wallet, or the CLI's local connector. The `api/` package holds
the provider wiring from the `midnight-dapp-dev` template. Not yet exercised:
this section will be filled in from that work.

## Versions that work together

Every Midnight package is pinned exactly. Caret ranges resolved to broken or
duplicated packages (findings 21, 25 and 31).

| Component | Version |
|---|---|
| Compact compiler | 0.31.1 (`compact compile +0.31.1`), language `>= 0.23` |
| `@midnight-ntwrk/compact-runtime` | 0.16.0 |
| `@midnight-ntwrk/compact-js` | 2.5.1 (2.5.3 does not install) |
| `@midnight-ntwrk/midnight-js-*` | 4.1.1 |
| `@midnight-ntwrk/ledger-v8` | 8.1.2, forced with npm `overrides` |
| `@midnight-ntwrk/onchain-runtime-v3` | 3.1.1, forced with npm `overrides` |
| `@midnight-ntwrk/dapp-connector-api` | 4.0.1 |
| Proof server | `midnightntwrk/proof-server:8.1.0` |
| `midnight-wallet-cli` | 0.5.2 |

Packages the wallet CLI needs installed in the project: `compact-js`,
`midnight-js-contracts`, `midnight-js-network-id`,
`midnight-js-http-client-proof-provider`,
`midnight-js-indexer-public-data-provider`,
`midnight-js-level-private-state-provider` and
`midnight-js-node-zk-config-provider`.

## Caveats

- **One key plays both roles.** The agent wallet is organiser and player, so on
  this deployment the issuing and claiming transactions come from the same
  wallet. The contract's privacy holds between different players; this demo does
  not show that.
- **One pass per secret key.** The pass nonce is derived from the secret key to
  survive the CLI's private state handling. Two passes for one player need
  separate keys.
- **The pool tracks entitlement, not value.** `prizePool` is a counter. Paying
  real tokens would use Midnight's shielded token operations.
- **Fee payment was not analysed.** Whether DUST spending links transactions to a
  wallet is outside what this proof of concept examined.
- **Issuance is public.** Each `issuePass` transaction discloses the commitment it
  adds, and when. Anonymity rests on commitments being unlinkable to claims, and
  weakens with few passes issued.
