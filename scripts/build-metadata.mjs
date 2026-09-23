// Builds the token metadata documents for the crew treasury, and the digests the contract
// anchors on-chain with setMetadata.
//
//   node scripts/build-metadata.mjs
//
// Documents follow Midnight's token metadata spec (midnight-architecture,
// apis-and-common-types/metadata/Token Metadata.md). Images are referenced by IPFS CID, so the
// bytes can be checked against the link. Each document's subject is re-derived here from the
// contract address and domain separator, and must match the token type seen on chain.
//
// Output, all under metadata/:
//   images/*.svg                  the artwork (hand-written, not generated here)
//   tokens/<token type>.json      one document per token, in canonical form
//   agent-smart-contracts.json    the collection manifest: every NFT's subject and document CID
//   anchors.json                  CIDs, and the two SHA-256 digests to pass to setMetadata
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import * as rt from "@midnight-ntwrk/compact-runtime";
import { rawTokenType } from "@midnight-ntwrk/ledger-v8";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { ledger } from "../src/managed/crew_treasury/contract/index.js";
import { sha256, cid, canonical } from "../wallet-daemon/metadata.mjs";

setNetworkId("preview");

const CONTRACT = "e412fa7fa89433c2d37bbf350eba95e61db6075d5189f0dc5f45c07583cac4b4";
const MCC_TYPE = "eed99c9a56f4f3d719ff295eab2fcd59713233c71d34437284347c992b54a366";
const INDEXER = "https://indexer.preview.midnight.network/api/v4/graphql";
const INDEXER_WS = "wss://indexer.preview.midnight.network/api/v4/graphql/ws";
const OUT = new URL("../metadata/", import.meta.url).pathname;

// Which agent holds which mandate NFT, by token type (confirmed in each agent's own wallet).
const HOLDERS = {
  "7ced7bf39622030ed6e55290f346e2277371eff6d44fdba47069786a4b3f2293": "Floyd",
  "9d454f805cbc15148268dcc49d4e2d386484010653f7f09910d331ff524c3b3d": "Tzilo",
  "66deba03d895468b3388866f511e7622e2c7af4d722e46aedf6958aa267ba92b": "FooFoo",
};

// ---------------------------------------------------------------------------------------
// Token identities, re-derived from the contract
// ---------------------------------------------------------------------------------------

const hex = (bytes) => Buffer.from(bytes).toString("hex");
const pad32 = (text) => { const b = new Uint8Array(32); b.set(new TextEncoder().encode(text)); return b; };
const vector2 = new rt.CompactTypeVector(2, new rt.CompactTypeBytes(32));

/** Same derivation as issueMandate: persistentHash([pad(32, "moddable:crew:mandate-nft:"), commitment]). */
const mandateDomain = (commitment) => rt.persistentHash(vector2, [pad32("moddable:crew:mandate-nft:"), commitment]);

function checkedSubject(domain, expected) {
  const derived = rawTokenType(domain, CONTRACT);
  if (derived !== expected) throw new Error(`token type mismatch: derived ${derived}, chain has ${expected}`);
  return derived;
}

// ---------------------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------------------

const onChain = await indexerPublicDataProvider(INDEXER, INDEXER_WS).queryContractState(CONTRACT);
const state = ledger(onChain.data);

const images = Object.fromEntries(readdirSync(OUT + "images").map((f) => [f, cid(readFileSync(OUT + "images/" + f))]));

const mccDomain = pad32("moddable:crew:treasury");
const documents = [{
  type: "token",
  subject: checkedSubject(mccDomain, MCC_TYPE),
  contract_address: CONTRACT,
  domain_separator: hex(mccDomain),
  shielded: false,
  ticker: "MCC",
  name: "Midnight City Credits",
  description: "The Moddable crew's treasury token. Minted only by the organiser; AI agents draw a fixed amount once per period by proving in zero knowledge that they hold a mandate, without revealing which one.",
  image: `ipfs://${images["mcc.svg"]}`,
  decimals: 0,
  supply: Number(state.treasuryMinted),
  version: 1,
}];

for (const commitment of state.issued) {
  const domain = mandateDomain(commitment);
  // The derived type must be one an agent's own wallet reported holding.
  const subject = rawTokenType(domain, CONTRACT);
  const holder = HOLDERS[subject];
  if (!holder) throw new Error(`issued mandate ${subject} is not a token type any agent holds`);
  documents.push({
    type: "token",
    subject,
    contract_address: CONTRACT,
    domain_separator: hex(domain),
    shielded: true,
    ticker: "ASC",
    name: `Agent Smart Contract: ${holder}`,
    description: `${holder}'s appointment to the Moddable crew in Midnight City. A one-of-one shielded token, a receipt of the mandate the organiser issued. Drawing from the treasury needs the mandate's secret, not this token.`,
    image: `ipfs://${images["agent-smart-contract.svg"]}`,
    decimals: 0,
    supply: 1,
    version: 1,
  });
}

// The spec also requires a `signatures` array (Schnorr over secp256k1, ADR 0017). Nothing on
// preview verifies or serves these documents yet (friction log finding 39), so they are left
// unsigned and anchored instead: the contract stores the SHA-256 of their canonical form,
// which the spec lists as a check clients may perform.
mkdirSync(OUT + "tokens", { recursive: true });
const collection = { type: "collection", name: "Agent Smart Contracts", contract_address: CONTRACT, items: [] };
const cids = {};
for (const doc of documents) {
  const bytes = Buffer.from(canonical(doc));
  writeFileSync(OUT + `tokens/${doc.subject}.json`, bytes);
  cids[doc.subject] = cid(bytes);
  if (doc.shielded) collection.items.push({ subject: doc.subject, name: doc.name, document: `ipfs://${cids[doc.subject]}` });
}
const collectionBytes = Buffer.from(canonical(collection));
writeFileSync(OUT + "agent-smart-contracts.json", collectionBytes);

const mccBytes = readFileSync(OUT + `tokens/${MCC_TYPE}.json`);
const anchors = {
  contract: CONTRACT,
  images: Object.fromEntries(Object.entries(images).map(([f, c]) => [f, `ipfs://${c}`])),
  documents: Object.fromEntries(Object.entries(cids).map(([s, c]) => [s, `ipfs://${c}`])),
  collection: `ipfs://${cid(collectionBytes)}`,
  setMetadata: {
    treasuryDigest: sha256(mccBytes).toString("hex"),
    mandateDigest: sha256(collectionBytes).toString("hex"),
  },
};
writeFileSync(OUT + "anchors.json", JSON.stringify(anchors, null, 2) + "\n");
console.log(JSON.stringify(anchors, null, 2));
