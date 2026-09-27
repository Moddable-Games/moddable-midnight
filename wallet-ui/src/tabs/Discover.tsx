import { Code2, Compass, ExternalLink, FileText, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Chip, Panel, Segmented } from "@/components/ui/primitives";
import { cn } from "@/lib/format";
import data from "@/data/discovery.json";

type Service = (typeof data.services)[number];

const TINTS: Record<string, string> = {
  trade: "bg-cosmic text-white",
  fees: "bg-vault text-glow",
  identity: "bg-[#e7ecf8] text-cosmic",
  provenance: "bg-ok-soft text-ok",
  markets: "bg-wait-soft text-wait",
};

function ServiceCard({ s }: { s: Service }) {
  const live = s.status === "Live app";
  return (
    <li className="flex flex-col rounded-panel bg-surface p-5">
      <div className="flex items-start gap-3">
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-[0.9rem] font-display text-lg font-bold", TINTS[s.category])}>{s.name.slice(0, 1)}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-tight text-balance">{s.name}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink-soft">
            {s.by}<Chip tone={live ? "ok" : "neutral"}>{live ? `Live on ${s.network}` : s.status}</Chip>
          </p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm text-pretty">{s.summary}</p>
      <p className="mt-3 flex items-start gap-2 rounded-control bg-sunken px-3 py-2 text-[13px] text-ink-soft">
        <Lightbulb size={15} className="mt-0.5 shrink-0 text-cosmic" /><span><span className="font-semibold text-ink">Idea for this wallet.</span> {s.idea}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[13px] font-semibold">
        {s.app ? <a href={s.app} target="_blank" rel="noopener" className="inline-flex items-center gap-1 rounded-full bg-cosmic px-3 py-1 text-white hover:bg-[#15306f]">Open app<ExternalLink size={12} /></a> : null}
        <a href={s.repo} target="_blank" rel="noopener" className="inline-flex items-center gap-1 rounded-full bg-sunken px-3 py-1 text-ink-soft hover:text-cosmic"><Code2 size={13} />Code</a>
        <a href={s.sourceUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 rounded-full bg-sunken px-3 py-1 text-ink-soft hover:text-cosmic"><FileText size={13} />{live ? "Readme" : "Application"}</a>
      </div>
    </li>
  );
}

/**
 * What else is being built on Midnight, by other teams: a live DEX, and the applications filed
 * to deploy on mainnet. Nothing here is integrated yet; each card says what it could do inside
 * this wallet.
 */
export function DiscoverTab() {
  const [category, setCategory] = useState("all");
  const shown = data.services.filter((s) => category === "all" || s.category === category);
  return (
    <div className="space-y-5">
      <section className="vault p-6 sm:p-7">
        <Compass size={28} className="text-glow" />
        <h1 className="mt-3 text-3xl sm:text-4xl">What people are building on Midnight</h1>
        <p className="mt-2 max-w-xl text-white/75">Services from other teams, and what each could do inside this wallet. None is connected yet; these are the ones worth connecting.</p>
      </section>
      <Segmented value={category} onChange={setCategory} options={[
        { value: "all", label: "All" }, ...data.categories.map((c) => ({ value: c.id, label: c.label })),
      ]} />
      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{shown.map((s) => <ServiceCard key={s.name} s={s} />)}</ul>
      <Panel><p className="text-[13px] text-ink-soft">{data.source}</p></Panel>
    </div>
  );
}
