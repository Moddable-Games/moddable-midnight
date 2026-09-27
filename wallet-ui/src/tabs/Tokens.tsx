import { ArrowLeftRight, ExternalLink, Flame, Layers, Plus, Rocket, ScrollText, Send, Sparkles, Tag } from "lucide-react";
import { useState } from "react";
import { useNav } from "@/App";
import { KIND_LABEL, TokenGlyph } from "@/components/glyphs";
import { Button, Chip, Empty, Panel, Segmented } from "@/components/ui/primitives";
import type { Deployment } from "@/lib/api";
import { cn, explorer, short, units } from "@/lib/format";
import { useStore } from "@/lib/store";

type Filter = "all" | "0" | "1" | "2" | "3";

const EVENT_TONE: Record<string, "ok" | "cosmic" | "bad" | "neutral"> = {
  UnshieldedMint: "ok", ShieldedMint: "ok", ShieldedBurn: "bad", UnshieldedBurn: "bad",
  ShieldedReceive: "cosmic", UnshieldedReceive: "cosmic", UnshieldedSpend: "cosmic", ShieldedSpend: "cosmic",
};

/** Plain words for each MIP-0002 event, since the app avoids protocol jargon. */
function describeEvent(e: Deployment["events"][number], d: Deployment) {
  const token = d.tokens.find((t) => t.domain === e.domain);
  const what = token ? (token.nft ? token.label : d.symbol) : "";
  switch (e.type) {
    case "UnshieldedMint": return `Minted ${units(e.amount)} ${what} as public coins`;
    case "ShieldedMint": return `Minted ${units(e.amount)} ${what} as private coins`;
    case "ShieldedBurn": return `Burned ${units(e.amount)} ${what}`;
    case "ShieldedReceive": return `Took in ${units(e.amount)} ${what} private coins`;
    case "UnshieldedReceive": return `Took in ${units(e.amount)} ${what} public coins`;
    case "UnshieldedSpend": return `Paid out ${units(e.amount)} ${what}`;
    case "Misc":
      if (e.subject.startsWith("mip-0018")) return `Published metadata${what ? ` for ${what}` : ""}`;
      if (e.subject === "mip-0004:transfer") return `Moved ${units(e.amount)} ${what} between accounts`;
      if (e.subject.endsWith(":mint")) return `Minted ${units(e.amount)} ${what} into balances`;
      if (e.subject === "kind3:transfer") return "Private transfer (nothing disclosed)";
      return e.subject;
    default: return e.type;
  }
}

function ContractCard({ d }: { d: Deployment }) {
  const { open } = useNav();
  const [view, setView] = useState<"tokens" | "events" | "metadata">("tokens");
  const contractKind = d.storage === "contract";
  return (
    <Panel flush>
      <header className="flex flex-wrap items-center gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <TokenGlyph kind={d.kind} size={48} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl">{d.name} <span className="text-ink-faint">{d.symbol}</span></h2>
          <p className="flex flex-wrap items-center gap-2 text-[13px] text-ink-soft">
            <Chip tone="cosmic">{d.mip}</Chip>
            <a href={explorer.contract(d.address)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-mono text-[12px] hover:text-cosmic">
              {short(d.address, 8, 6)}<ExternalLink size={12} />
            </a>
          </p>
        </div>
      </header>

      <div className="scroll-x flex gap-2 px-4 pt-4 sm:px-5">
        <Button size="sm" tone="soft" onClick={() => open({ kind: "token", action: "mint", deployment: d })}><Plus size={15} />Mint</Button>
        <Button size="sm" tone="soft" onClick={() => open({ kind: "token", action: "nft", deployment: d })}><Sparkles size={15} />Mint NFT</Button>
        {contractKind ? <Button size="sm" tone="soft" onClick={() => open({ kind: "token", action: "transfer", deployment: d })}><Send size={15} />Transfer</Button> : null}
        {contractKind ? <Button size="sm" tone="soft" onClick={() => open({ kind: "token", action: "convert", deployment: d })}><ArrowLeftRight size={15} />Convert</Button> : null}
        {d.standard === "native_shielded" ? <Button size="sm" tone="soft" onClick={() => open({ kind: "token", action: "burn", deployment: d })}><Flame size={15} />Burn</Button> : null}
        <Button size="sm" tone="soft" onClick={() => open({ kind: "token", action: "metadata", deployment: d })}><Tag size={15} />Metadata</Button>
      </div>

      <div className="px-4 pt-4 sm:px-5">
        <Segmented value={view} onChange={setView} className="bg-sunken" options={[
          { value: "tokens", label: <span className="inline-flex items-center gap-1.5"><Layers size={14} />Tokens {d.tokens.length}</span> },
          { value: "events", label: <span className="inline-flex items-center gap-1.5"><ScrollText size={14} />Events {d.events.length}</span> },
          { value: "metadata", label: <span className="inline-flex items-center gap-1.5"><Tag size={14} />Metadata {d.metadata.length}</span> },
        ]} />
      </div>

      {view === "tokens" ? (
        d.tokens.length ? (
          <ul className="py-2">
            {[...d.tokens].sort((a, b) => Number(a.nft) - Number(b.nft)).map((t) => (
              <li key={t.domain} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                <TokenGlyph size={32} asset={{ key: t.domain, name: t.label, symbol: d.symbol, kind: d.kind, nft: t.nft, decimals: d.decimals, color: t.color, contract: d.address, domain: t.domain }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{t.nft ? t.label : d.metadata.find((m) => m.domain === t.domain && m.key === "name")?.value ?? d.name}</p>
                  <p className="truncate font-mono text-[11px] text-ink-faint" title={t.color}>{short(t.color, 10, 6)}</p>
                </div>
                <div className="text-right text-[13px] text-ink-soft">
                  <p className="figure text-base text-ink">{units(t.supply, t.nft ? 0 : d.decimals)}{t.nft ? " of 1" : ""}</p>
                  {BigInt(t.burned) > 0n ? <p>{units(t.burned, d.decimals)} burned</p> : null}
                  {contractKind && BigInt(t.inNativeForm) > 0n ? <p>{units(t.inNativeForm, d.decimals)} out as coins</p> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : <Empty icon={<Layers size={20} />} title="Nothing minted yet" action={<Button size="sm" onClick={() => open({ kind: "token", action: "mint", deployment: d })}>Mint</Button>} />
      ) : null}

      {view === "events" ? (
        <ol className="py-2">
          {[...d.events].reverse().slice(0, 12).map((e) => (
            <li key={e.index} className="flex items-center gap-3 px-4 py-2 text-sm sm:px-5">
              <span className="figure w-8 shrink-0 text-right text-ink-faint">{e.index}</span>
              <Chip tone={EVENT_TONE[e.type] ?? "neutral"} className="shrink-0">{e.type}</Chip>
              <span className="min-w-0 flex-1 truncate">{describeEvent(e, d)}</span>
            </li>
          ))}
          {!d.events.length ? <li className="px-5 py-4 text-sm text-ink-soft">No events yet.</li> : null}
        </ol>
      ) : null}

      {view === "metadata" ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-4 py-4 text-sm sm:px-5">
          {d.metadata.map((m, i) => {
            const token = d.tokens.find((t) => t.domain === m.domain);
            return (
              <div key={i} className="contents">
                <dt className="text-ink-soft">{m.key} <span className="text-ink-faint">({KIND_LABEL[m.kind as 0 | 1 | 2 | 3]?.toLowerCase() ?? `kind ${m.kind}`}{token?.nft ? `, ${token.label}` : ""})</span></dt>
                <dd className="break-words font-semibold">{m.value ?? "null"}</dd>
              </div>
            );
          })}
          {!d.metadata.length ? <p className="col-span-2 text-ink-soft">No MIP-0018 declarations yet.</p> : null}
        </dl>
      ) : null}
    </Panel>
  );
}

export function TokensTab() {
  const { deployments } = useStore();
  const { focus, open, go } = useNav();
  const filter: Filter = focus && ["0", "1", "2", "3"].includes(focus) ? (focus as Filter) : "all";
  const shown = deployments.filter((d) => !d.error && (filter === "all" || String(d.kind) === filter));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl">Tokens</h1>
        <Button onClick={() => open({ kind: "deploy" })}><Rocket size={17} />Deploy</Button>
      </div>
      <Segmented value={filter} onChange={(v) => go("tokens", v === "all" ? undefined : v)} options={[
        { value: "all", label: "All types" },
        ...([0, 1, 2, 3] as const).map((k) => ({
          value: String(k) as Filter,
          label: <span className={cn("inline-flex items-center gap-1.5")}>{KIND_LABEL[k]}</span>,
        })),
      ]} />
      {shown.length ? shown.map((d) => <ContractCard key={d.address} d={d} />) : (
        <Panel><Empty icon={<Rocket size={20} />} title="No contracts of this type yet" action={<Button size="sm" onClick={() => open({ kind: "deploy" })}>Deploy one</Button>} /></Panel>
      )}
    </div>
  );
}
