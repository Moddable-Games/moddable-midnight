import { ContractState, rawTokenType } from "@midnight-ntwrk/compact-runtime";
import * as ContractToken from "@contract-token";
import * as NativeShielded from "@native-shielded";
import * as NativeUnshielded from "@native-unshielded";
import * as PrivateLedger from "@private-ledger";
import { INDEXER_URL } from "@/lib/tournament";
import lab from "../../public/data/token-lab.json";

/**
 * The Tokens page's live read: each token contract's public state, fetched from Midnight's
 * public indexer and decoded in this browser with the contract's own compiled ledger(). Nothing
 * comes from the wallet daemon; token-lab.json only lists which contracts to read.
 */

export const LAB = lab;
export type Standard = "native_unshielded" | "native_shielded" | "contract_token" | "private_ledger";

const DECODERS: Record<Standard, (data: ContractState["data"]) => any> = {
  native_unshielded: NativeUnshielded.ledger,
  native_shielded: NativeShielded.ledger,
  contract_token: ContractToken.ledger,
  private_ledger: PrivateLedger.ledger,
};

const EVENT_NAMES = ["ShieldedSpend", "ShieldedReceive", "ShieldedMint", "ShieldedBurn", "UnshieldedSpend",
  "UnshieldedReceive", "UnshieldedMint", "UnshieldedBurn", "Paused", "Unpaused", "Misc"];

const fromHex = (hex: string) => Uint8Array.from(hex.match(/../g)!.map((b) => parseInt(b, 16)));
const toHex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
const text = (b: Uint8Array) => new TextDecoder().decode(b.slice(0, b.findLastIndex((x) => x !== 0) + 1));

export type LiveToken = { domain: string; color: string; nft: boolean; supply: bigint; label: string };
export type LiveContract = {
  address: string;
  standard: Standard;
  name: string;
  symbol: string;
  tokens: LiveToken[];
  events: { index: number; type: string }[];
  metadata: { key: string; kind: number; value: string }[];
  /** Kind 3 only: notes created and spent, the only things a transfer shows. */
  notes?: { created: number; spent: number };
};

const entries = (m: any): [any, any][] => { try { return [...m]; } catch { return []; } };
const values = (m: any): any[] => { try { return [...m]; } catch { return []; } };

export async function readContract(address: string, standard: Standard): Promise<LiveContract> {
  const res = await fetch(INDEXER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: "query($a: HexEncoded!) { contract(address: $a) { state } }", variables: { a: address } }),
  });
  const body = await res.json();
  const hex = body.data?.contract?.state;
  if (!hex) throw new Error(`No contract at ${address.slice(0, 10)}…`);
  const l = DECODERS[standard](ContractState.deserialize(fromHex(hex)).data);

  const supplyMap = standard === "contract_token" ? l.supplyByDomain : l.mintedByDomain;
  const nfts = new Set(values(l.nftDomains).map((d: Uint8Array) => toHex(d)));
  const metadata = entries(l.tokenMetadata).map(([, p]) => ({
    key: text(p.key), kind: Number(p.kind), domain: toHex(p.domainSep),
    value: Number(p.valType) === 1 ? new TextDecoder().decode(p.value.slice(0, Number(p.valLen))) : Number(p.valType) === 2 ? String(p.value[0]) : "",
  }));
  const tokens = entries(supplyMap).map(([k, v]) => {
    const domain = toHex(k);
    const burned = l.burnedByDomain?.member?.(k) ? l.burnedByDomain.lookup(k) : 0n;
    const nft = nfts.has(domain);
    const named = metadata.find((m) => m.domain === domain && m.key === "name")?.value;
    return { domain, color: String(rawTokenType(k, address)), nft, supply: BigInt(v) - BigInt(burned), label: nft ? "NFT" : named ?? text(k) };
  });
  const events = entries(l.eventLog).map(([i, e]) => ({ index: Number(i), type: EVENT_NAMES[Number(e.eventType)] ?? "?" }))
    .sort((a, b) => a.index - b.index);
  return {
    address, standard, name: l._name, symbol: l._symbol, tokens, events, metadata,
    notes: standard === "private_ledger" ? { created: values(l.commitments).length, spent: values(l.spent).length } : undefined,
  };
}

export const readAll = () => Promise.allSettled(LAB.deployments.map((d) => readContract(d.address, d.standard as Standard)));
