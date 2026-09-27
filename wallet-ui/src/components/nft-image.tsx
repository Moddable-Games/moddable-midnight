import { Eye, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { mediaUrl } from "@/lib/api";
import { cn } from "@/lib/format";
import type { Asset } from "@/lib/store";

const ART = ["nft-art-0", "nft-art-1", "nft-art-2", "nft-art-3"];

/**
 * An NFT's picture: its pinned image (the daemon's copy first, then a public IPFS gateway),
 * or, for an NFT without one, artwork drawn from its token type so it still reads as an item.
 */
export function NftImage({ asset, className }: { asset: Asset; className?: string }) {
  const [src, setSrc] = useState(asset.image ?? null);
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img src={src} alt={asset.name} loading="lazy" className={cn("bg-sunken object-cover", className)}
        onError={() => {
          const gateway = asset.imageUri ? mediaUrl(asset.imageUri).gateway : null;
          if (gateway && src !== gateway) setSrc(gateway); else setFailed(true);
        }} />
    );
  }
  const hidden = asset.kind === 1 || asset.kind === 3;
  const Icon = hidden ? Lock : Eye;
  return (
    <div className={cn("nft-art relative grid place-items-center overflow-hidden text-white", ART[asset.kind], className)} role="img" aria-label={`${asset.name}, no image`}>
      <span className="grid place-items-center gap-2 text-center">
        <span className="relative grid size-16 place-items-center rounded-full bg-white/12 ring-1 ring-white/25">
          <Icon size={26} />
          <Sparkles size={14} className="absolute -right-1 -top-1 text-glow" />
        </span>
      </span>
    </div>
  );
}
