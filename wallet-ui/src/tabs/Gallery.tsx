import { Images, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNav } from "@/App";
import { KIND_LABEL, TokenGlyph, WalletAvatar } from "@/components/glyphs";
import { NftImage } from "@/components/nft-image";
import { Button, Chip, Empty, Panel, Segmented } from "@/components/ui/primitives";
import { cn } from "@/lib/format";
import { useStore, type Asset } from "@/lib/store";

type Filter = "all" | "0" | "1" | "2" | "3";

/** Every NFT the app can see, whoever holds it, from the token contracts and the treasuries. */
export function useNfts() {
  const { assets, holdingsList, active } = useStore();
  const holders = new Map<string, string[]>();
  for (const h of holdingsList) if (h.asset.nft) holders.set(h.asset.key, [...(holders.get(h.asset.key) ?? []), h.wallet]);
  // A contract NFT has a balance form and native forms under one token; show one card per
  // token, preferring the form somebody holds.
  const byToken = new Map<string, { asset: Asset; holders: string[] }>();
  for (const a of assets.values()) {
    if (!a.nft) continue;
    const id = `${a.contract}:${a.domain ?? a.color}`;
    const held = (holders.get(a.key) ?? []).filter((w) => active.some((x) => x.wallet === w));
    const current = byToken.get(id);
    if (!current || (!current.holders.length && held.length)) byToken.set(id, { asset: a, holders: held });
  }
  const nfts = [...byToken.values()];
  return nfts;
}

export function GalleryTab() {
  const { active } = useStore();
  const { open } = useNav();
  const [filter, setFilter] = useState<Filter>("all");
  const nfts = useNfts().filter((n) => filter === "all" || String(n.asset.kind) === filter);
  const name = (w: string) => active.find((x) => x.wallet === w);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl">Gallery</h1>
        <Button onClick={() => open({ kind: "mint-nft" })}><Sparkles size={17} />Mint NFT</Button>
      </div>
      <Segmented value={filter} onChange={setFilter} options={[
        { value: "all", label: "All" },
        ...([0, 1, 2, 3] as const).map((k) => ({ value: String(k) as Filter, label: KIND_LABEL[k] })),
      ]} />
      {nfts.length ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:grid-cols-4">
          {nfts.map(({ asset, holders }) => {
            const holder = holders[0] ? name(holders[0]) : undefined;
            return (
              <li key={asset.key}>
                <button type="button" onClick={() => open({ kind: "nft", assetKey: asset.key })}
                  className="group block w-full overflow-hidden rounded-panel bg-surface text-left transition-shadow hover:shadow-[0_12px_30px_-12px_rgba(10,13,42,0.35)]">
                  <NftImage asset={asset} className="aspect-square w-full" />
                  <div className="space-y-1.5 p-3">
                    <p className="truncate font-display text-lg font-bold">{asset.name}</p>
                    <div className="flex items-center justify-between gap-2">
                      <Chip tone={asset.kind === 1 || asset.kind === 3 ? "cosmic" : "neutral"} className="truncate">{KIND_LABEL[asset.kind]}</Chip>
                      {holder ? <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-ink-soft"><WalletAvatar wallet={holder} size={32} /></span> : null}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <Panel><Empty icon={<Images size={20} />} title="No NFTs of this type yet" action={<Button size="sm" onClick={() => open({ kind: "mint-nft" })}>Mint one</Button>} /></Panel>
      )}
      <p className={cn("flex items-center gap-2 text-[13px] text-ink-soft")}><TokenGlyph kind={1} size={32} />Each NFT is its own token type. Its picture is metadata attached to that one token, pinned to IPFS when it is minted here.</p>
    </div>
  );
}
