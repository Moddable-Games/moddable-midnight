import { NIGHT } from "./api";
import { valueOf } from "./format";
import type { Asset, Holding } from "./store";

/** Holdings grouped by asset across wallets (optionally one wallet), with simulated USD. */
export function groupByAsset(holdings: Holding[], priceOf: (a: Asset) => number | null, wallet?: string) {
  const groups = new Map<string, { asset: Asset; amount: bigint; usd: number | null; wallets: Set<string> }>();
  for (const h of holdings) {
    if (wallet && h.wallet !== wallet) continue;
    const g = groups.get(h.asset.key) ?? { asset: h.asset, amount: 0n, usd: null, wallets: new Set<string>() };
    g.amount += BigInt(h.amount);
    g.wallets.add(h.wallet);
    groups.set(h.asset.key, g);
  }
  for (const g of groups.values()) g.usd = valueOf(g.amount, g.asset.decimals, priceOf(g.asset));
  // NIGHT first, then by value, then fungible before NFTs, then by name.
  return [...groups.values()].sort((a, b) =>
    Number(b.asset.color === NIGHT && b.asset.kind === 0) - Number(a.asset.color === NIGHT && a.asset.kind === 0)
    || (b.usd ?? -1) - (a.usd ?? -1) || Number(a.asset.nft) - Number(b.asset.nft) || a.asset.name.localeCompare(b.asset.name));
}

export const totalUsd = (groups: { usd: number | null }[]) => groups.reduce((s, g) => s + (g.usd ?? 0), 0);
