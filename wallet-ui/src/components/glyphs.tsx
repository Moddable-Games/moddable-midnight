import { Bot, Eye, KeyRound, Lock, Moon, Sparkles } from "lucide-react";
import { NIGHT, type Wallet } from "@/lib/api";
import { cn } from "@/lib/format";
import type { Asset } from "@/lib/store";

/** The four token types as one visual system: fill = native coin, ring = contract balance;
    lock = shielded, eye = public. NFTs get a spark. */
export const KIND_LABEL = ["Native public", "Native private", "Contract public", "Contract private"] as const;
export const KIND_MIP = ["MIP-0014", "MIP-0011", "MIP-0004", "Kind 3"] as const;

export function TokenGlyph({ asset, kind, size = 40 }: { asset?: Asset; kind?: 0 | 1 | 2 | 3; size?: 32 | 40 | 48 }) {
  const k = asset?.kind ?? kind ?? 0;
  const native = k === 0 || k === 1;
  const privateKind = k === 1 || k === 3;
  const isNight = asset?.color === NIGHT && k === 0;
  const dims = size === 48 ? "size-12" : size === 32 ? "size-8" : "size-10";
  const icon = size === 32 ? 15 : 18;
  if (asset?.image) {
    return <img src={asset.image} alt="" className={cn(dims, "shrink-0 rounded-full bg-sunken object-cover")} />;
  }
  return (
    <span className={cn(
      dims, "relative grid shrink-0 place-items-center rounded-full",
      isNight ? "bg-vault text-glow" : native ? (privateKind ? "bg-cosmic text-white" : "bg-ink text-white")
        : privateKind ? "border-2 border-cosmic bg-surface text-cosmic" : "border-2 border-ink bg-surface text-ink",
    )}>
      {isNight ? <Moon size={icon} /> : privateKind ? <Lock size={icon} /> : <Eye size={icon} />}
      {asset?.nft ? (
        <span className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-glow text-vault">
          <Sparkles size={10} />
        </span>
      ) : null}
    </span>
  );
}

const TINTS = ["bg-[#dfe8ff] text-[#1a3680]", "bg-[#e5f3df] text-[#2b6e1e]", "bg-[#fdeccc] text-[#8a5a00]", "bg-[#f3e1f7] text-[#7a2c8f]", "bg-[#dff4f3] text-[#1d6b67]"];

export function WalletAvatar({ wallet, size = 40 }: { wallet: Pick<Wallet, "wallet" | "name" | "kind">; size?: 32 | 40 | 48 }) {
  const dims = size === 48 ? "size-12 text-lg" : size === 32 ? "size-8 text-sm" : "size-10";
  if (wallet.kind === "human") {
    return <span className={cn(dims, "grid shrink-0 place-items-center rounded-full bg-cosmic text-glow")}><KeyRound size={size === 32 ? 15 : 18} /></span>;
  }
  const tint = TINTS[[...wallet.wallet].reduce((s, c) => s + c.charCodeAt(0), 0) % TINTS.length];
  return (
    <span className={cn(dims, tint, "relative grid shrink-0 place-items-center rounded-full font-display font-bold")}>
      {wallet.name.slice(0, 1)}
      <span className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-surface text-ink-soft ring-2 ring-surface">
        <Bot size={11} />
      </span>
    </span>
  );
}
