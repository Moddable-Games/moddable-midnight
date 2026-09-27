import { ArrowUpRight, Check, ChevronRight, Plus, Rocket, TrendingDown, TrendingUp, UserPlus } from "lucide-react";
import { useNav } from "@/App";
import { KIND_LABEL, KIND_MIP, TokenGlyph, WalletAvatar } from "@/components/glyphs";
import { RequestRow } from "@/components/request-row";
import { Chip, Panel, RoundAction } from "@/components/ui/primitives";
import { cn, dust, night, units, usd } from "@/lib/format";
import { useStore } from "@/lib/store";
import { groupByAsset, totalUsd } from "@/lib/totals";

function VaultCard() {
  const { holdingsList, priceOf, prices, wallets, pending } = useStore();
  const { open, go } = useNav();
  const groups = groupByAsset(holdingsList, priceOf);
  const total = totalUsd(groups);
  const nightTotal = wallets.reduce((s, w) => s + BigInt(w.night ?? 0), 0n);
  const dustTotal = wallets.reduce((s, w) => s + BigInt(w.dust ?? 0), 0n);
  const change = prices?.night.change24h ?? null;

  return (
    <section className="vault px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-white/70">All wallets</p>
        <Chip tone="dark">Simulated mainnet value</Chip>
      </div>
      <p className="figure mt-1 text-[2.75rem] leading-none sm:text-[3.5rem]">{usd(total)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
        <span><span className="figure text-white">{night(nightTotal.toString(), 0)}</span> NIGHT</span>
        <span><span className="figure text-white">{dust(dustTotal.toString())}</span> DUST</span>
        {change !== null ? (
          <span className={cn("inline-flex items-center gap-1", change >= 0 ? "text-[#8fe07c]" : "text-[#ff9a9a]")}>
            {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change).toFixed(1)}% NIGHT today
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex justify-between gap-1 sm:justify-start sm:gap-4">
        <RoundAction icon={<ArrowUpRight size={20} />} label="Send" onClick={() => open({ kind: "send" })} />
        <RoundAction icon={<Check size={20} />} label="Approve" badge={pending.length} onClick={() => go("activity")} />
        <RoundAction icon={<Rocket size={20} />} label="Deploy" onClick={() => open({ kind: "deploy" })} />
        <RoundAction icon={<UserPlus size={20} />} label="New agent" onClick={() => open({ kind: "new-agent" })} />
      </div>
    </section>
  );
}

function Accounts() {
  const { wallets, holdingsList, priceOf } = useStore();
  const { go } = useNav();
  return (
    <div className="scroll-x -mx-4 flex gap-3 px-4 md:-mx-0 md:px-0">
      {wallets.map((w) => {
        const value = totalUsd(groupByAsset(holdingsList, priceOf, w.wallet));
        return (
          <button key={w.wallet} type="button" onClick={() => go(w.kind === "human" ? "operator" : "agents", w.wallet)}
            className="w-[11.5rem] shrink-0 rounded-panel bg-surface p-4 text-left transition-colors hover:bg-[#fbfcfe]">
            <div className="flex items-center justify-between">
              <WalletAvatar wallet={w} size={32} />
              <span className={cn("size-2 rounded-full", w.status === "ready" ? "bg-ok" : w.status === "error" ? "bg-bad" : "bg-wait")} title={w.status} />
            </div>
            <p className="mt-3 truncate font-semibold">{w.name}</p>
            <p className="figure text-xl">{usd(value)}</p>
            <p className="text-[13px] text-ink-soft">{night(w.night, 0)} NIGHT</p>
          </button>
        );
      })}
    </div>
  );
}

function Assets() {
  const { holdingsList, priceOf } = useStore();
  const groups = groupByAsset(holdingsList, priceOf);
  return (
    <Panel title="Assets" flush>
      <ul className="pb-2">
        {groups.map(({ asset, amount, usd: value, wallets }) => (
          <li key={asset.key} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
            <TokenGlyph asset={asset} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{asset.name}</p>
              <p className="truncate text-[13px] text-ink-soft">{KIND_LABEL[asset.kind]}{wallets.size > 1 ? `, ${wallets.size} wallets` : ""}</p>
            </div>
            <div className="text-right">
              <p className="figure">{asset.nft ? (amount === 1n ? "1 item" : `${amount} items`) : `${units(amount, asset.decimals)} ${asset.symbol}`}</p>
              <p className="text-[13px] text-ink-soft">{value !== null ? usd(value) : "No price"}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function SupplyTypes() {
  const { deployments } = useStore();
  const { go } = useNav();
  return (
    <Panel title="Token types" flush>
      <ul className="pb-2">
        {([0, 1, 2, 3] as const).map((kind) => {
          const contracts = deployments.filter((d) => d.kind === kind && !d.error);
          const tokens = contracts.flatMap((d) => d.tokens);
          const nfts = tokens.filter((t) => t.nft).length;
          return (
            <li key={kind}>
              <button type="button" onClick={() => go("tokens", String(kind))} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-sunken sm:px-5">
                <TokenGlyph kind={kind} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{KIND_LABEL[kind]}</span>
                  <span className="block text-[13px] text-ink-soft">{KIND_MIP[kind]}</span>
                </span>
                <span className="text-right text-[13px] leading-tight text-ink-soft">
                  <span className="block"><span className="figure text-base text-ink">{tokens.length - nfts}</span> {tokens.length - nfts === 1 ? "token" : "tokens"}</span>
                  <span className="block"><span className="figure text-base text-ink">{nfts}</span> {nfts === 1 ? "NFT" : "NFTs"}</span>
                </span>
                <ChevronRight size={16} className="text-ink-faint" />
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function DashboardTab() {
  const { requests } = useStore();
  const { go, open } = useNav();
  const recent = requests.filter((r) => r.status !== "pending").slice(0, 5);
  return (
    <div className="space-y-5">
      <VaultCard />
      <Accounts />
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
        <Assets />
        <div className="space-y-5">
          <SupplyTypes />
          <Panel title="Recent" flush action={<button type="button" onClick={() => go("activity")} className="text-sm font-semibold text-cosmic">See all</button>}>
            {recent.length ? <ul>{recent.map((r) => <RequestRow key={r.id} r={r} />)}</ul> : (
              <div className="px-5 pb-5">
                <button type="button" onClick={() => open({ kind: "send" })} className="inline-flex items-center gap-2 text-sm font-semibold text-cosmic"><Plus size={16} />Make the first payment</button>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
