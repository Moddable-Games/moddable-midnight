import { ArrowDownLeft, ArrowUpRight, Check, Copy, Pause, Play, Trash2, UserX } from "lucide-react";
import { useState } from "react";
import { useNav } from "@/App";
import { api, type Wallet } from "@/lib/api";
import { cn, short, units, usd } from "@/lib/format";
import { useStore } from "@/lib/store";
import { groupByAsset } from "@/lib/totals";
import { KIND_LABEL, TokenGlyph } from "./glyphs";
import { Button, FormError, RoundAction } from "./ui/primitives";

/** An address you can copy with one tap. */
export function CopyAddress({ label, value, dark = false }: { label: string; value: string | null; dark?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" disabled={!value}
      onClick={() => { if (value) { navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); } }}
      className={cn("flex w-full items-center gap-2 rounded-control px-3 py-2 text-left transition-colors",
        dark ? "bg-white/8 hover:bg-white/14" : "bg-sunken hover:bg-cosmic-soft")}>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-[12px]", dark ? "text-white/60" : "text-ink-faint")}>{label}</span>
        <span className={cn("block truncate font-mono text-[12px]", dark ? "text-white" : "text-ink")}>{value ? short(value, 18, 10) : "Opening…"}</span>
      </span>
      {done ? <Check size={15} className={dark ? "text-glow" : "text-ok"} /> : <Copy size={15} className={dark ? "text-white/60" : "text-ink-faint"} />}
    </button>
  );
}

/** Send and receive, as round actions on a dark card. */
export function MoneyActions({ w }: { w: Wallet }) {
  const { open } = useNav();
  return (
    <div className="flex gap-3">
      <RoundAction icon={<ArrowUpRight size={20} />} label="Send" onClick={() => open({ kind: "send", from: w.wallet })} />
      <RoundAction icon={<ArrowDownLeft size={20} />} label="Receive" onClick={() => open({ kind: "receive", wallet: w.wallet })} />
    </div>
  );
}

/** Everything one wallet holds, NIGHT first. */
export function AssetList({ wallet, empty = "Nothing here yet." }: { wallet: string; empty?: string }) {
  const { holdingsList, priceOf } = useStore();
  const { open } = useNav();
  const groups = groupByAsset(holdingsList, priceOf, wallet);
  if (!groups.length) return <p className="px-5 pb-5 text-sm text-ink-soft">{empty}</p>;
  return (
    <ul className="pb-2">
      {groups.map(({ asset, amount, usd: value }) => (
        <li key={asset.key}>
          <button type="button" disabled={!asset.nft} onClick={() => open({ kind: "nft", assetKey: asset.key })}
            className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-left sm:px-5", asset.nft && "hover:bg-sunken")}>
            <TokenGlyph asset={asset} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{asset.name}</span>
              <span className="block truncate text-[13px] text-ink-soft">{KIND_LABEL[asset.kind]}</span>
            </span>
            <span className="text-right">
              <span className="figure block">{asset.nft ? "1 item" : `${units(amount, asset.decimals)} ${asset.symbol}`}</span>
              <span className="block text-[13px] text-ink-soft">{value !== null ? usd(value) : asset.nft ? "View" : "No price"}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Pause, take out of the treasury, or remove an agent. Each confirms first. */
export function AgentControls({ w, compact = false }: { w: Wallet; compact?: boolean }) {
  const { policy, treasury, refresh } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paused = policy?.agents[w.wallet]?.paused ?? false;
  const appointed = Boolean(treasury?.terms?.[w.wallet]);
  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true); setError(null);
    try { await fn(); await refresh("all"); } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };
  const size = compact ? "sm" : "md";
  return (
    <div>
      <FormError message={error} />
      <div className="flex flex-wrap gap-2">
        <Button size={size} tone="soft" disabled={busy} onClick={() => act(() => api.agentStep(w.wallet, "pause", { paused: !paused }))}>
          {paused ? <><Play size={15} />Resume</> : <><Pause size={15} />Pause</>}
        </Button>
        <Button size={size} tone="soft" disabled={busy || !appointed}
          onClick={() => confirm(`Take ${w.name} out of the treasury? The contract cannot revoke one mandate alone, so this revokes all of them and appoints every other agent again on its current terms.`)
            && act(() => api.agentStep(w.wallet, "revoke", {}))}>
          <UserX size={15} />Revoke
        </Button>
        <Button size={size} tone="bad" disabled={busy}
          onClick={() => confirm(`Remove ${w.name}? Everything it holds goes back to the operator, NIGHT last, and it is archived. Its keys are kept.`)
            && act(() => api.agentStep(w.wallet, "remove", {}))}>
          <Trash2 size={15} />Remove
        </Button>
      </div>
      {paused ? <p className="mt-2 text-[13px] text-wait">Paused: every request from {w.name} is refused until you resume it.</p> : null}
    </div>
  );
}
