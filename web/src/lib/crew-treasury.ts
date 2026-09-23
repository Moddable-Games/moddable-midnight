import {
  CompactTypeBytes,
  CompactTypeVector,
  ContractState,
  persistentHash,
  rawTokenType,
} from "@midnight-ntwrk/compact-runtime";
import { ledger } from "@crew";
import { INDEXER_URL } from "@/lib/tournament";

/**
 * Independent check of the crew treasury: Midnight City Credits (MCC) and the Agent Smart
 * Contract NFTs.
 *
 * Nothing here trusts Moddable's servers or wallets. Contract state and transactions come
 * from Midnight's public indexer and are decoded with the compiled contract's own
 * `ledger()`. Both token types are re-derived in the browser from the contract address.
 * Metadata documents are fetched from GitHub, but are only marked verified when their
 * SHA-256 matches a digest stored in the contract (or, for each NFT's document, when its
 * IPFS CID matches the list the contract's digest covers). Where the files come from
 * therefore does not matter: a changed file fails the check.
 */

export const CREW_TREASURY =
  "e412fa7fa89433c2d37bbf350eba95e61db6075d5189f0dc5f45c07583cac4b4";

export const REPO_URL = "https://github.com/Moddable-Games/moddable-midnight";
export const METADATA_RAW =
  "https://raw.githubusercontent.com/Moddable-Games/moddable-midnight/main/metadata/";
export const METADATA_TREE = `${REPO_URL}/tree/main/metadata`;
export const CONTRACT_SOURCE = `${REPO_URL}/blob/main/contracts/crew_treasury.compact`;
export const IPFS_GATEWAY = (cid: string) => `https://ipfs.io/ipfs/${cid}`;

/** The crew's public (unshielded) addresses, as published in notes/midnight-city/AGENT-WALLETS.md. */
export const CREW_ADDRESSES: Record<string, string> = {
  mn_addr_preview1zh5vgfsj5v0d85xps8lxjv8wata8cfwafc54tkgy8umsgms35c3s4gsema: "Organiser",
  mn_addr_preview1wg2ef7spxl8wfahg890z5q4kuhtc234ks7rx65djg3dc9f5ltx4sr69gyw: "Floyd",
  mn_addr_preview12t3k3nkssja6ksfjqkkx5sfdzue9j33fpztgsheyszrpu63yq77s0epzru: "Tzilo",
  mn_addr_preview1qkehtq54t8damevjy953sdua2qtad6adyer4cersc3ql9sw8envsg7kw3g: "FooFoo",
};

const QUERY = `
  query Crew($address: HexEncoded!) {
    contract(address: $address) {
      state
      actions {
        __typename
        transaction {
          hash
          block { height timestamp }
          ... on RegularTransaction {
            transactionResult { status }
            unshieldedCreatedOutputs { owner tokenType value }
          }
        }
        ... on ContractCall { entryPoint }
      }
    }
    contractAction(address: $address) {
      ... on ContractCall { unshieldedBalances { tokenType amount } }
      ... on ContractDeploy { unshieldedBalances { tokenType amount } }
    }
  }
`;

// ---------------------------------------------------------------------------------------
// Bytes, hashes and CIDs
// ---------------------------------------------------------------------------------------

export const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

const fromHex = (hex: string): Uint8Array =>
  Uint8Array.from(hex.match(/../g) ?? [], (byte) => parseInt(byte, 16));

/** Compact's pad(32, text): the UTF-8 bytes, zero-filled to 32. */
const pad32 = (text: string): Uint8Array => {
  const out = new Uint8Array(32);
  out.set(new TextEncoder().encode(text));
  return out;
};

async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new Uint8Array(bytes)));
}

/** RFC 4648 base32, lower case, no padding: the multibase "b" alphabet. */
function base32(bytes: Uint8Array): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += alphabet[(value << (5 - bits)) & 31];
  return out;
}

/** CIDv1, raw codec, sha2-256: the IPFS address of a file stored as one raw block. */
export async function cidOf(bytes: Uint8Array): Promise<string> {
  const digest = await sha256(bytes);
  return `b${base32(new Uint8Array([0x01, 0x55, 0x12, 0x20, ...digest]))}`;
}

const stripIpfs = (uri: string) => uri.replace(/^ipfs:\/\//, "");

// ---------------------------------------------------------------------------------------
// The snapshot
// ---------------------------------------------------------------------------------------

export interface Check {
  label: string;
  ok: boolean;
  detail: string;
}

export interface Payout {
  owner: string;
  name: string | null;
  amount: bigint;
  hash: string;
  blockHeight: number;
}

export interface Action {
  kind: string;
  status: string;
  hash: string;
  blockHeight: number;
  timestamp: Date;
}

export interface TokenDocument {
  subject: string;
  name: string;
  ticker: string;
  description: string;
  cid: string;
  sourceUrl: string;
  imageCid: string;
  imageUrl: string | null;
  verified: boolean;
  how: string;
}

export interface Mandate {
  commitment: string;
  tokenType: string;
  document: TokenDocument | null;
}

export interface CrewSnapshot {
  address: string;
  crewId: string;
  organiser: string;
  mcc: {
    tokenType: string;
    derivedTokenType: string;
    minted: bigint;
    held: bigint;
    paidOut: bigint;
    payouts: Payout[];
    drawAmount: bigint;
    currentPeriod: string;
    paused: boolean;
    drawCount: bigint;
    spentDraws: number;
    document: TokenDocument | null;
  };
  asc: {
    mandateCount: bigint;
    mandates: Mandate[];
    collectionCid: string | null;
    collectionVerified: boolean;
  };
  onChainDigests: { treasury: string; mandates: string };
  actions: Action[];
  checks: Check[];
  fetchedAt: Date;
}

interface GraphQlAction {
  __typename: string;
  entryPoint?: string;
  transaction: {
    hash: string;
    block: { height: number; timestamp: number };
    transactionResult?: { status: string };
    unshieldedCreatedOutputs?: { owner: string; tokenType: string; value: string }[];
  };
}

/** Bytes<32> period label, as set by openPeriod: the text before the zero padding. */
const periodLabel = (bytes: Uint8Array): string => {
  if (bytes.every((b) => b === 0)) return "none open";
  const end = bytes.indexOf(0);
  return new TextDecoder().decode(end === -1 ? bytes : bytes.slice(0, end));
};

async function fetchBytes(url: string): Promise<Uint8Array | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    return response.ok ? new Uint8Array(await response.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

const vector2 = new CompactTypeVector(2, new CompactTypeBytes(32));

/** issueMandate's derivation: the NFT's domain is persistentHash([pad("moddable:crew:mandate-nft:"), commitment]). */
const mandateTokenType = (commitment: Uint8Array, address: string): string =>
  String(rawTokenType(persistentHash(vector2, [pad32("moddable:crew:mandate-nft:"), commitment]), address));

// ---------------------------------------------------------------------------------------
// Metadata, verified against the contract
// ---------------------------------------------------------------------------------------

interface Locator {
  imageFileByCid: Map<string, string>;
}

/**
 * anchors.json only says where our files live. It is not trusted: every byte it points to
 * is checked against a CID or an on-chain digest before being shown as verified.
 */
async function loadLocator(): Promise<Locator> {
  const bytes = await fetchBytes(`${METADATA_RAW}anchors.json`);
  const anchors = bytes ? JSON.parse(new TextDecoder().decode(bytes)) : { images: {} };
  const imageFileByCid = new Map<string, string>(
    Object.entries(anchors.images as Record<string, string>).map(([file, uri]) => [stripIpfs(uri), file]),
  );
  return { imageFileByCid };
}

async function loadDocument(
  subject: string,
  address: string,
  locator: Locator,
  trusted: (bytes: Uint8Array, cid: string) => Promise<{ ok: boolean; how: string }>,
): Promise<TokenDocument | null> {
  const sourceUrl = `${METADATA_RAW}tokens/${subject}.json`;
  const bytes = await fetchBytes(sourceUrl);
  if (!bytes) return null;
  const doc = JSON.parse(new TextDecoder().decode(bytes));
  const cid = await cidOf(bytes);
  const anchor = await trusted(bytes, cid);

  // The image is shown only from bytes that hash to the CID the document names.
  const imageCid = stripIpfs(doc.image ?? "");
  const imageFile = locator.imageFileByCid.get(imageCid);
  const imageBytes = imageFile ? await fetchBytes(`${METADATA_RAW}images/${imageFile}`) : null;
  const imageOk = imageBytes !== null && (await cidOf(imageBytes)) === imageCid;
  const imageUrl = imageOk
    ? URL.createObjectURL(new Blob([imageBytes as BlobPart], { type: "image/svg+xml" }))
    : null;

  const about = doc.subject === subject && doc.contract_address === address;
  return {
    subject,
    name: doc.name,
    ticker: doc.ticker,
    description: doc.description,
    cid,
    sourceUrl,
    imageCid,
    imageUrl,
    verified: anchor.ok && imageOk && about,
    how: !about
      ? "the document describes a different token or contract"
      : !imageOk
        ? "the image does not match its CID"
        : anchor.how,
  };
}

// ---------------------------------------------------------------------------------------
// Fetch and check
// ---------------------------------------------------------------------------------------

export async function fetchCrewTreasury(address: string = CREW_TREASURY): Promise<CrewSnapshot> {
  const response = await fetch(INDEXER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { address } }),
  });
  if (!response.ok) throw new Error(`Indexer responded ${response.status}`);
  const body = await response.json();
  if (body.errors?.length) throw new Error(body.errors[0].message ?? "Indexer query failed");
  const contract = body.data?.contract;
  if (!contract?.state) throw new Error(`No contract found at ${address}`);

  const state = ledger(ContractState.deserialize(fromHex(contract.state)).data);

  // MCC: its token type, derived here exactly as mintTreasury derives it.
  const mccType = toHex(state.treasuryColor);
  const derivedMccType = String(rawTokenType(pad32("moddable:crew:treasury"), address));
  const held = BigInt(
    (body.data.contractAction?.unshieldedBalances ?? [])
      .find((b: { tokenType: string }) => b.tokenType === mccType)?.amount ?? 0,
  );

  const raw = contract.actions as GraphQlAction[];
  const actions: Action[] = raw.map((a) => ({
    kind: a.__typename === "ContractDeploy" ? "deploy" : (a.entryPoint ?? a.__typename),
    status: a.transaction.transactionResult?.status ?? "SUCCESS",
    hash: a.transaction.hash,
    blockHeight: a.transaction.block.height,
    timestamp: new Date(a.transaction.block.timestamp),
  }));
  const payouts: Payout[] = raw
    .filter((a) => a.entryPoint === "draw")
    .flatMap((a) => (a.transaction.unshieldedCreatedOutputs ?? [])
      .filter((o) => o.tokenType === mccType)
      .map((o) => ({
        owner: o.owner,
        name: CREW_ADDRESSES[o.owner] ?? null,
        amount: BigInt(o.value),
        hash: a.transaction.hash,
        blockHeight: a.transaction.block.height,
      })));
  const paidOut = payouts.reduce((sum, p) => sum + p.amount, 0n);

  // Agent Smart Contracts: one token type per issued mandate, derived as issueMandate does.
  const commitments = Array.from(state.issued) as Uint8Array[];
  const onChainDigests = { treasury: toHex(state.treasuryMetadata), mandates: toHex(state.mandateMetadata) };

  const locator = await loadLocator();
  const mccDocument = await loadDocument(mccType, address, locator, async (bytes) => {
    const ok = toHex(await sha256(bytes)) === onChainDigests.treasury;
    return { ok, how: ok ? "its SHA-256 equals the contract's treasuryMetadata" : "its SHA-256 does not match the contract" };
  });

  const collectionBytes = await fetchBytes(`${METADATA_RAW}agent-smart-contracts.json`);
  const collectionVerified =
    collectionBytes !== null && toHex(await sha256(collectionBytes)) === onChainDigests.mandates;
  const listed = new Map<string, string>(
    collectionBytes
      ? JSON.parse(new TextDecoder().decode(collectionBytes)).items.map(
          (i: { subject: string; document: string }) => [i.subject, stripIpfs(i.document)],
        )
      : [],
  );

  const mandates: Mandate[] = [];
  for (const commitment of commitments) {
    const tokenType = mandateTokenType(commitment, address);
    const document = await loadDocument(tokenType, address, locator, async (_bytes, cid) => {
      const ok = collectionVerified && listed.get(tokenType) === cid;
      return {
        ok,
        how: ok
          ? "its CID is listed in the collection, whose SHA-256 equals the contract's mandateMetadata"
          : "not covered by the contract's mandateMetadata digest",
      };
    });
    mandates.push({ commitment: toHex(commitment), tokenType, document });
  }

  const successfulDraws = raw.filter((a) => a.entryPoint === "draw" && a.transaction.transactionResult?.status === "SUCCESS").length;
  const checks: Check[] = [
    {
      label: "MCC is this contract's token",
      ok: derivedMccType === mccType,
      detail: `rawTokenType(pad(32, "moddable:crew:treasury"), contract) = ${derivedMccType.slice(0, 12)}…, the contract records ${mccType.slice(0, 12)}…`,
    },
    {
      label: "MCC supply adds up",
      ok: state.treasuryMinted === held + paidOut,
      detail: `minted ${state.treasuryMinted.toLocaleString()} = held by the contract ${held.toLocaleString()} + paid out in draws ${paidOut.toLocaleString()}`,
    },
    {
      label: "Every draw paid exactly once",
      ok: BigInt(successfulDraws) === state.drawCount && payouts.length === successfulDraws,
      detail: `${successfulDraws} successful draw transactions, ${payouts.length} MCC payouts, drawCount ${state.drawCount} on the ledger`,
    },
    {
      label: "One NFT type per mandate",
      ok: BigInt(mandates.length) === state.mandateCount && new Set(mandates.map((m) => m.tokenType)).size === mandates.length,
      detail: `${mandates.length} issued commitments, ${state.mandateCount} counted, each deriving a distinct token type`,
    },
    {
      label: "MCC metadata matches the contract",
      ok: mccDocument?.verified ?? false,
      detail: mccDocument ? mccDocument.how : "document not found",
    },
    {
      label: "Agent Smart Contract metadata matches the contract",
      ok: collectionVerified && mandates.every((m) => m.document?.verified),
      detail: collectionVerified
        ? "the collection's SHA-256 equals mandateMetadata, and every NFT document's CID is listed in it"
        : "the collection does not match mandateMetadata",
    },
  ];

  return {
    address,
    crewId: toHex(state.crewId),
    organiser: toHex(state.organiser),
    mcc: {
      tokenType: mccType,
      derivedTokenType: derivedMccType,
      minted: state.treasuryMinted,
      held,
      paidOut,
      payouts,
      drawAmount: state.drawAmount,
      currentPeriod: periodLabel(state.currentPeriod),
      paused: state.paused,
      drawCount: state.drawCount,
      spentDraws: Number(state.spentDraws.size()),
      document: mccDocument,
    },
    asc: {
      mandateCount: state.mandateCount,
      mandates,
      collectionCid: collectionBytes ? await cidOf(collectionBytes) : null,
      collectionVerified,
    },
    onChainDigests,
    actions,
    checks,
    fetchedAt: new Date(),
  };
}
