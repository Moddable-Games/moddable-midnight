// Reads every token contract in deployments.json from the chain and describes it the way the
// wallet app's Tokens tab shows it: the family, each token (domain) with its supply and colors,
// the MIP-0002 event log and the MIP-0018 metadata, decoded.
//
// Nothing here trusts the daemon's own records for numbers: supplies, NFTs, events and
// metadata all come from the contract's public state via the indexer. deployments.json only
// says which contracts to look at, and remembers human labels (NFT serials) the chain holds
// only as hashes.
import { rawTokenType } from "@midnight-ntwrk/compact-runtime";
import { deployments } from "./books.mjs";
import { readLedger } from "./deploy.mjs";
import { STANDARDS } from "./token-actions.mjs";

const hex = (b) => Buffer.from(b).toString("hex");

const EVENT_NAMES = ["ShieldedSpend", "ShieldedReceive", "ShieldedMint", "ShieldedBurn", "UnshieldedSpend",
  "UnshieldedReceive", "UnshieldedMint", "UnshieldedBurn", "Paused", "Unpaused", "Misc"];
const VAL_TYPES = ["opaque", "string", "integer", "json", "uri", "null"];

/** Text if the bytes are printable UTF-8 once trailing NULs are trimmed, else null. */
export function trimmedText(bytes) {
  let end = bytes.length;
  while (end > 0 && bytes[end - 1] === 0) end--;
  if (end === 0) return "";
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes.slice(0, end));
    return /^[\x20-\x7e -￿]+$/.test(text) ? text : null;
  } catch { return null; }
}

/** A MIP-0018 value, read as its declared val-type says (section 2.1). */
function decodeValue(p) {
  const len = Number(p.valLen);
  const raw = p.value.slice(0, len);
  const type = VAL_TYPES[Number(p.valType)] ?? "reserved";
  if (type === "null") return { type, value: null };
  if (type === "integer") {
    let n = 0n;
    for (let i = raw.length - 1; i >= 0; i--) n = (n << 8n) | BigInt(raw[i]); // little-endian
    return { type, value: n.toString() };
  }
  if (type === "opaque") return { type, value: hex(raw) };
  return { type, value: new TextDecoder().decode(raw) };
}

const entries = (map) => { try { return [...map]; } catch { return []; } };

const ledgerNumber = (map, key) => (map?.member?.(key) ? map.lookup(key) : 0n);

/** Everything the Tokens tab needs about one deployment. */
export async function describeDeployment(d) {
  const { ledger } = await readLedger(d.standard, d.address);
  const standard = STANDARDS[d.standard];
  const nfts = new Set(entries(ledger.nftDomains).map(hex));
  const serials = Object.fromEntries((d.tokens ?? []).filter((t) => t.serial).map((t) => [t.domain, t.serial]));

  // Every domain the contract has issued, from its own supply maps.
  const supplyMap = d.standard === "contract_token" ? ledger.supplyByDomain : ledger.mintedByDomain;
  const domains = entries(supplyMap).map(([k]) => hex(k));
  const fungible = d.domainHex;
  if (fungible && !domains.includes(fungible)) domains.unshift(fungible);

  const tokens = domains.map((domain) => {
    const key = Buffer.from(domain, "hex");
    const nft = nfts.has(domain);
    const minted = ledgerNumber(supplyMap, key);
    const burned = ledgerNumber(ledger.burnedByDomain, key);
    const outNative = ledgerNumber(ledger.utxoSupplyByDomain, key);
    // Native colors exist for kinds 0 and 1, and for a contract token's native forms.
    const color = rawTokenType(key, d.address);
    return {
      domain,
      label: nft ? (serials[domain] ?? `NFT ${domain.slice(0, 8)}`) : (trimmedText(key) ?? domain.slice(0, 12)),
      nft,
      color,
      minted: minted.toString(),
      burned: burned.toString(),
      inNativeForm: outNative.toString(),
      // Honest supply wording per standard (MIP-0011/0014: an upper bound).
      supply: (minted - burned).toString(),
    };
  });

  const events = entries(ledger.eventLog)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([index, e]) => ({
      index: Number(index),
      type: EVENT_NAMES[Number(e.eventType)] ?? "Unknown",
      domain: hex(e.domainSep),
      tokenType: hex(e.tokenType),
      amount: e.amount.toString(),
      subject: trimmedText(e.subject) ?? hex(e.subject),
    }));

  const metadata = entries(ledger.tokenMetadata).map(([, p]) => ({
    domain: hex(p.domainSep),
    kind: Number(p.kind),
    key: trimmedText(p.key) ?? hex(p.key),
    ...decodeValue(p),
  }));

  return {
    address: d.address,
    standard: d.standard,
    kind: standard.kind,
    mip: standard.mip,
    label: standard.label,
    privacy: standard.privacy,
    storage: standard.storage,
    name: ledger._name,
    symbol: ledger._symbol,
    decimals: Number(ledger._decimals),
    deployedBlock: d.block ?? null,
    deployTx: d.txHash ?? null,
    tokens,
    events,
    metadata,
  };
}

let cache = { at: 0, value: null };

/** All deployments, cached briefly because each read goes to the indexer. */
export async function describeAll({ fresh = false } = {}) {
  if (!fresh && cache.value && Date.now() - cache.at < 20_000) return cache.value;
  const out = [];
  for (const d of deployments()) {
    try { out.push(await describeDeployment(d)); }
    catch (error) { out.push({ address: d.address, standard: d.standard, error: error.message }); }
  }
  cache = { at: Date.now(), value: out };
  return out;
}
