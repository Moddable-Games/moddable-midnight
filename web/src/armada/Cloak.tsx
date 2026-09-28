import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import content from "./content.json";
import { VesselIcon } from "./parts";

type Viewer = "public" | "auditor" | "commander";

const VIEWERS: { id: Viewer; label: string; note: string }[] = [
  { id: "public", label: "Public", note: "The chain sees a valid proof. Nothing else leaves the fleet." },
  { id: "auditor", label: "Auditor", note: "A disclosure key opens the fields the regulator needs, and no more." },
  { id: "commander", label: "Commander", note: "The Flagship sees the whole settlement, as it always does." },
];

/** One settlement, seen by three different eyes. */
export function Cloak() {
  const [viewer, setViewer] = useState<Viewer>("public");
  const c = content.cloak;
  const note = VIEWERS.find((v) => v.id === viewer)!.note;
  return (
    <section id="cloak" className="scroll-mt-18 mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <VesselIcon id="cloak" className="size-14 text-flag" />
          <p className="readout mt-6 mb-5 text-signal-yellow">CLOAKING DEVICE</p>
          <h2 className="text-4xl sm:text-5xl">{c.title}</h2>
          <p className="mt-6 max-w-lg text-lg text-flag/80">{c.body}</p>
        </div>
        <div className="rounded-[2rem] bg-deck p-6 ring-1 ring-flag/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-xl font-semibold">Settlement 7,204</p>
            <div className="flex rounded-full bg-abyss p-1 ring-1 ring-flag/15" role="radiogroup" aria-label="View as">
              {VIEWERS.map((v) => (
                <button key={v.id} type="button" role="radio" aria-checked={viewer === v.id} onClick={() => setViewer(v.id)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${viewer === v.id ? "bg-signal-yellow text-abyss" : "text-mist hover:text-flag"}`}>{v.label}</button>
              ))}
            </div>
          </div>
          <div key={viewer} className="relative mt-6 overflow-hidden">
            <span className="scan pointer-events-none absolute inset-x-0 top-0 h-10" aria-hidden="true" />
            <dl className="divide-y divide-chart">
              {c.transaction.map((f) => {
                const shown = f.seen.includes(viewer);
                return (
                  <div key={f.label} className="flex items-center justify-between gap-4 py-3.5">
                    <dt className="text-mist">{f.label}</dt>
                    <dd className={`font-mono text-sm transition-colors ${shown ? "" : "redacted px-2"}`} aria-label={shown ? undefined : "Hidden"}>{f.value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-abyss p-4">
            <BadgeCheck className="size-8 shrink-0 text-signal-yellow" />
            <div>
              <p className="font-semibold">Compliance proven</p>
              <p className="text-sm text-mist">{note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
