// Token metadata: content addressing, and checking our documents against the contract.
//
// The documents live in metadata/ and are addressed by IPFS CID (scripts/build-metadata.mjs
// writes them). The crew treasury contract stores the SHA-256 of the MCC document and of the
// Agent Smart Contract collection manifest; the manifest in turn lists each NFT document's
// CID. So one on-chain read is enough to check every document and image the page shows.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { PREVIEW } from "./wallet.mjs";

const METADATA_DIR = new URL("../metadata/", import.meta.url).pathname;

export const sha256 = (bytes) => createHash("sha256").update(bytes).digest();

/** RFC 4648 base32, lower case, no padding: the multibase "b" alphabet. */
function base32(bytes) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
  let bits = 0, value = 0, out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) { out += alphabet[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += alphabet[(value << (5 - bits)) & 31];
  return out;
}

/**
 * CIDv1, raw codec, sha2-256: what `ipfs add --cid-version=1` gives a file small enough to be
 * one block. Every file here is far below the 256 KiB chunk size.
 */
export function cid(bytes) {
  if (bytes.length > 256 * 1024) throw new Error("file too large for a single-block CID");
  return "b" + base32(Buffer.concat([Buffer.from([0x01, 0x55, 0x12, 0x20]), sha256(bytes)]));
}

/** RFC 8785 canonical JSON, for the plain strings, integers, booleans and objects used here. */
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
  }
  if (typeof value === "number" && !Number.isSafeInteger(value)) throw new Error("only integers are used");
  return JSON.stringify(value);
}

const hex = (bytes) => Buffer.from(bytes).toString("hex");
const stripIpfs = (uri) => uri.replace(/^ipfs:\/\//, "");

let cache = null;

/**
 * Every token document in metadata/, each marked verified only if it chains back to a digest
 * stored in the contract. Images are returned inline, and also checked against their CID.
 * Cached for a minute, since it reads the chain.
 */
export async function verifiedMetadata() {
  if (cache && Date.now() - cache.at < 60_000) return cache.value;
  if (!existsSync(METADATA_DIR + "anchors.json")) return { tokens: {} };
  const anchors = JSON.parse(readFileSync(METADATA_DIR + "anchors.json", "utf8"));

  const { ledger } = await import("../src/managed/crew_treasury/contract/index.js");
  const onChain = await indexerPublicDataProvider(PREVIEW.indexer, PREVIEW.indexerWS).queryContractState(anchors.contract);
  const state = ledger(onChain.data);

  const collectionBytes = readFileSync(METADATA_DIR + "agent-smart-contracts.json");
  const collectionOk = hex(sha256(collectionBytes)) === hex(state.mandateMetadata);
  const listed = new Map(JSON.parse(collectionBytes).items.map((i) => [i.subject, stripIpfs(i.document)]));

  const images = new Map(readdirSync(METADATA_DIR + "images").map((f) => {
    const bytes = readFileSync(METADATA_DIR + "images/" + f);
    return [cid(bytes), bytes];
  }));

  const tokens = {};
  for (const file of readdirSync(METADATA_DIR + "tokens")) {
    const bytes = readFileSync(METADATA_DIR + "tokens/" + file);
    const doc = JSON.parse(bytes);
    const verified = doc.shielded
      ? collectionOk && listed.get(doc.subject) === cid(bytes)
      : hex(sha256(bytes)) === hex(state.treasuryMetadata);
    const image = images.get(stripIpfs(doc.image));
    tokens[doc.subject] = {
      name: doc.name,
      ticker: doc.ticker,
      description: doc.description,
      shielded: doc.shielded,
      document: `ipfs://${cid(bytes)}`,
      image: doc.image,
      imageData: image ? `data:image/svg+xml;base64,${image.toString("base64")}` : null,
      verified: verified && Boolean(image),
    };
  }
  const value = { contract: anchors.contract, tokens };
  cache = { at: Date.now(), value };
  return value;
}

/**
 * The crew treasury's public state, for the wallet page's contract panel: what the ledger
 * says, the contract's MCC balance, and what has been paid out in draws. The public
 * verification page (web/treasury.html) does the same from the browser, trusting nothing
 * here.
 */
export async function contractSummary() {
  const anchors = JSON.parse(readFileSync(METADATA_DIR + "anchors.json", "utf8"));
  const address = anchors.contract;
  const { ledger } = await import("../src/managed/crew_treasury/contract/index.js");
  const onChain = await indexerPublicDataProvider(PREVIEW.indexer, PREVIEW.indexerWS).queryContractState(address);
  const state = ledger(onChain.data);
  const mccType = hex(state.treasuryColor);

  const query = `{ contractAction(address: "${address}") { ... on ContractCall { unshieldedBalances { tokenType amount } } }
    contract(address: "${address}") { actions { ... on ContractCall { entryPoint transaction { ... on RegularTransaction {
      transactionResult { status } unshieldedCreatedOutputs { owner tokenType value } } } } } } }`;
  const res = await fetch(PREVIEW.indexer, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
  const data = (await res.json()).data;
  const held = BigInt(data.contractAction?.unshieldedBalances?.find((b) => b.tokenType === mccType)?.amount ?? 0);
  const paidOut = data.contract.actions
    .filter((a) => a?.entryPoint === "draw")
    .flatMap((a) => a.transaction?.unshieldedCreatedOutputs ?? [])
    .filter((o) => o.tokenType === mccType)
    .reduce((sum, o) => sum + BigInt(o.value), 0n);
  const period = Buffer.from(state.currentPeriod);
  const metadata = await verifiedMetadata();

  return {
    address,
    mcc: {
      tokenType: mccType,
      minted: state.treasuryMinted.toString(),
      held: held.toString(),
      paidOut: paidOut.toString(),
      addsUp: state.treasuryMinted === held + paidOut,
      drawAmount: state.drawAmount.toString(),
      drawCount: state.drawCount.toString(),
    },
    asc: { mandateCount: state.mandateCount.toString() },
    period: period.every((b) => b === 0) ? null : period.subarray(0, period.indexOf(0) === -1 ? 32 : period.indexOf(0)).toString("utf8"),
    paused: state.paused,
    digests: { treasury: hex(state.treasuryMetadata), mandates: hex(state.mandateMetadata) },
    metadataVerified: Object.values(metadata.tokens).every((t) => t.verified),
  };
}
