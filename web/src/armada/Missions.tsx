import { useState } from "react";
import content from "./content.json";
import { useInView, useInterval, useReducedMotion } from "./hooks";
import { VesselIcon } from "./parts";

const BELLS = [2, 4, 8];
const STOPS = ["left-[6%]", "left-1/2", "left-[94%]"];
const CARRYING = ["ORDERS SEALED", "CARGO UNDERWAY", "PROOF FILED"];

/** A mission sails through its three watches; pick a watch to hold it there. */
export function Missions() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const reduced = useReducedMotion();
  useInterval(() => setStep((s) => (s + 1) % 3), 3600, auto && seen && !reduced);

  return (
    <section id="missions" className="chart-ground scroll-mt-18 border-y hairline">
      <div ref={ref} className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-28">
        <p className="readout mb-5 text-signal-yellow">MISSIONS</p>
        <h2 className="max-w-2xl text-4xl sm:text-5xl">A mission, watch by watch</h2>

        <div className="relative mt-16 hidden h-20 md:block" aria-hidden="true">
          <span className="absolute inset-x-[6%] top-1/2 border-t border-dashed border-chart" />
          <span className={`absolute left-[6%] top-1/2 h-px bg-signal-yellow transition-[width] duration-1000 ease-in-out ${["w-0", "w-[44%]", "w-[88%]"][step]}`} />
          {STOPS.map((pos, i) => (
            <span key={pos} className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-abyss transition-colors ${pos} ${i <= step ? "bg-signal-yellow" : "bg-chart"}`} />
          ))}
          <span className={`absolute top-1/2 -translate-x-1/2 -translate-y-[130%] transition-[left] duration-1000 ease-in-out ${STOPS[step]}`}>
            <VesselIcon id="flotilla" className="size-10 text-flag" />
          </span>
          <span className={`readout absolute top-[3.4rem] -translate-x-1/2 whitespace-nowrap text-signal-yellow transition-[left] duration-1000 ease-in-out ${STOPS[step]}`}>{CARRYING[step]}</span>
        </div>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-[2rem] bg-chart md:mt-6 md:grid-cols-3">
          {content.watch.map((w, i) => {
            const on = i === step;
            return (
              <li key={w.title}>
                <button type="button" aria-pressed={on} onClick={() => { setStep(i); setAuto(false); }}
                  className={`h-full w-full p-8 text-left transition-colors sm:p-10 ${on ? "bg-deck" : "bg-abyss/95 hover:bg-hull"}`}>
                  <span className="flex gap-1.5" aria-label={`${BELLS[i]} bells`}>
                    {Array.from({ length: BELLS[i] ?? 0 }, (_, b) => (
                      <span key={b} className={`size-2.5 rounded-full transition-colors ${on ? "bell bg-signal-yellow" : "bg-chart"}`} />
                    ))}
                  </span>
                  <span className="readout mt-6 block">{w.bell.toUpperCase()}</span>
                  <span className="mt-2 block font-display text-2xl font-semibold">{w.title}</span>
                  <span className={`mt-3 block transition-colors ${on ? "text-flag/85" : "text-mist"}`}>{w.body}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
