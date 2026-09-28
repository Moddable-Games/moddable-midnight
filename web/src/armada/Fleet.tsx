import { ArrowRight, EyeOff } from "lucide-react";
import { useState } from "react";
import content from "./content.json";
import { useInView, useInterval, useReducedMotion } from "./hooks";
import { VesselIcon, type VesselId } from "./parts";

const TOUR_MS = 6000;

/** The four vessels. The tour moves on by itself until the visitor picks one. */
export function Fleet() {
  const [active, setActive] = useState<VesselId>("flagship");
  const [touring, setTouring] = useState(true);
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();
  const ids = content.fleet.map((f) => f.id as VesselId);
  useInterval(() => setActive((a) => ids[(ids.indexOf(a) + 1) % ids.length]!), TOUR_MS, touring && seen && !reduced);
  const unit = content.fleet.find((f) => f.id === active)!;
  const pick = (id: VesselId) => { setActive(id); setTouring(false); };

  return (
    <section id="fleet" className="scroll-mt-18 mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <p className="readout mb-5 text-signal-yellow">THE FLEET</p>
      <h2 className="max-w-3xl text-4xl sm:text-5xl">One command structure, four kinds of vessel</h2>
      <div ref={ref} className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.25fr]">
        <ul className="space-y-2" role="tablist" aria-label="The fleet">
          {content.fleet.map((f) => {
            const on = active === f.id;
            return (
              <li key={f.id}>
                <button type="button" role="tab" aria-selected={on} onClick={() => pick(f.id as VesselId)}
                  className={`relative flex w-full items-center gap-5 overflow-hidden rounded-2xl p-5 text-left transition-colors ${on ? "bg-deck ring-1 ring-flag/15" : "hover:bg-hull"}`}>
                  <VesselIcon id={f.id as VesselId} className={`size-10 shrink-0 transition-colors ${on ? "text-flag" : "text-mist"}`} />
                  <span className="flex-1">
                    <span className="block font-display text-xl font-semibold">{f.name}</span>
                    <span className="block text-[15px] text-mist">{f.role}</span>
                  </span>
                  <ArrowRight className={`size-5 transition-all ${on ? "translate-x-0 text-signal-yellow opacity-100" : "-translate-x-2 opacity-0"}`} />
                  {on && touring && seen && !reduced ? <span key={active} className="tour-bar absolute inset-x-0 bottom-0 h-0.5 origin-left bg-signal-yellow/70" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <article key={active} className="panel-in relative overflow-hidden rounded-[2rem] bg-deck p-8 ring-1 ring-flag/10 sm:p-12" role="tabpanel">
          <VesselIcon id={active} draw className="pointer-events-none absolute -bottom-10 -right-10 size-64 text-flag opacity-[0.08] sm:size-80" />
          <p className="readout relative text-signal-yellow">{unit.role.toUpperCase()}</p>
          <h3 className="relative mt-3 font-display text-3xl font-semibold sm:text-4xl">{unit.name}</h3>
          <p className="relative mt-5 max-w-lg text-lg text-flag/80">{unit.body}</p>
          <ul className="relative mt-8 space-y-3">
            {unit.points.map((p, i) => (
              <li key={p} className={`stagger flex items-start gap-3 stagger-${i + 1}`}><span className="mt-3 h-px w-6 shrink-0 bg-signal-yellow" />{p}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

type Signal = { from: string; what: string };

/** The command deck: budgets fill in on arrival and settlements keep arriving, newest first. */
export function Deck() {
  const d = content.deck;
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const reduced = useReducedMotion();
  const [focus, setFocus] = useState<string | null>(null);
  const [feed, setFeed] = useState<(Signal & { n: number })[]>(() => d.signals.map((s, i) => ({ ...s, n: i })));
  const [next, setNext] = useState(d.signals.length);
  useInterval(() => {
    const s = d.stream[next % d.stream.length]!;
    setFeed((f) => [{ ...s, n: next }, ...f].slice(0, 5));
    setNext(next + 1);
  }, 2600, seen && !reduced);

  return (
    <section id="deck" className="scroll-mt-18 mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid items-end gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="readout mb-5 text-signal-yellow">THE DECK</p>
          <h2 className="text-4xl sm:text-5xl">{d.title}</h2>
        </div>
        <p className="max-w-lg text-lg text-mist">{d.body}</p>
      </div>
      <figure ref={ref} className="mt-14 overflow-hidden rounded-[2rem] bg-hull ring-1 ring-flag/10" aria-label="A concept of the command deck">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b hairline px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <VesselIcon id="flagship" className="size-9 text-flag" />
            <div><p className="readout">FLAGSHIP</p><p className="font-display text-xl font-semibold">{d.flagship}</p></div>
          </div>
          <div className="text-right"><p className="readout">TREASURY, CLOAKED</p><p className="font-display text-2xl font-semibold">{d.treasury}</p></div>
        </div>
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <ul className="divide-y divide-chart border-b hairline lg:border-b-0 lg:border-r">
            {d.flotillas.map((f) => {
              const on = focus === f.name;
              return (
                <li key={f.name}>
                  <button type="button" aria-pressed={on} onClick={() => setFocus(on ? null : f.name)}
                    className={`grid w-full grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 px-6 py-5 text-left transition-colors sm:grid-cols-[auto_10rem_1fr] sm:px-8 ${on ? "bg-deck" : "hover:bg-deck/50"}`}>
                    <VesselIcon id="flotilla" className={`size-7 ${on ? "text-signal-yellow" : "text-mist"}`} />
                    <span><span className="block font-semibold">{f.name}</span><span className="readout block">{f.agents} AGENTS</span></span>
                    <span className="col-span-2 block sm:col-span-1">
                      <span className="block h-2 overflow-hidden rounded-full bg-abyss">
                        <span className={`block h-full rounded-full bg-signal-yellow transition-[width] duration-1000 ease-out ${seen ? f.used : "w-0"}`} />
                      </span>
                      <span className="mt-1.5 block text-[13px] text-mist">{f.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="px-6 py-5 sm:px-8">
            <p className="readout mb-3 flex items-center gap-2"><span className="live-dot size-1.5 rounded-full bg-signal-yellow" />SIGNALS{focus ? `, ${focus.toUpperCase()}` : ""}</p>
            <ul className="space-y-3" aria-live="off">
              {feed.map((s, i) => {
                const dim = focus !== null && !s.from.startsWith(focus);
                return (
                  <li key={s.n} className={`${i === 0 && s.n >= d.signals.length ? "feed-in" : ""} flex items-start gap-3 transition-opacity ${dim ? "opacity-30" : ""}`}>
                    <EyeOff className="mt-1 size-4 shrink-0 text-signal-yellow" />
                    <div className="min-w-0 flex-1"><p className="text-[15px]">{s.what}</p><p className="text-[13px] text-mist">{s.from}</p></div>
                    <span className="readout">{i === 0 ? "now" : `${i * 3}s`}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </figure>
      <figcaption className="mt-3 text-[13px] text-mist">A concept of the deck. Pick a flotilla to follow its signals. Names and figures are illustrative.</figcaption>
    </section>
  );
}
