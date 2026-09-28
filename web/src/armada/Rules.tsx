import { Check, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import content from "./content.json";
import { useCountUp, useInView } from "./hooks";

const NUMERALS = ["I", "II", "III", "IV"];
const RECALL = 3;

type Run = { order: number; reached: number } | null;

/** Pick an order; it meets each article in turn until one stops it. */
export function Rules() {
  const [run, setRun] = useState<Run>(null);
  const order = run ? content.orders[run.order]! : null;
  const stop = order?.stop ?? null;
  const last = stop ?? content.rules.length - 1;
  const done = run !== null && run.reached >= last;

  useEffect(() => {
    if (!run || run.reached >= last) return;
    const id = window.setTimeout(() => setRun({ ...run, reached: run.reached + 1 }), 480);
    return () => window.clearTimeout(id);
  }, [run, last]);

  const status = (i: number) => {
    if (!run || i > run.reached) return "idle";
    if (i === stop) return stop === RECALL ? "invoke" : "stop";
    return "pass";
  };

  return (
    <section id="rules" className="scroll-mt-18 bg-hull">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="readout mb-5 text-signal-yellow">RULES</p>
            <h2 className="text-4xl sm:text-5xl">{content.rules_intro.title}</h2>
            <p className="mt-6 max-w-md text-lg text-mist">{content.rules_intro.body}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {content.orders.map((o, i) => (
                <li key={o.label}>
                  <button type="button" aria-pressed={run?.order === i} onClick={() => setRun({ order: i, reached: 0 })}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${run?.order === i ? "bg-signal-yellow text-abyss" : "bg-abyss ring-1 ring-flag/15 hover:ring-flag/40"}`}>
                    <Play className="size-3" />{o.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className={`readout mt-6 min-h-5 transition-opacity ${done ? "opacity-100" : "opacity-0"}`} aria-live="polite">
              {done && order ? order.result.toUpperCase() : ""}
            </p>
          </div>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {content.rules.map((r, i) => {
              const s = status(i);
              return (
                <li key={r.title} className={`rule relative border-t-2 pt-6 transition-colors duration-300 ${s === "stop" ? "border-signal-red" : s === "idle" ? "border-chart" : "border-signal-yellow"}`}>
                  <span className="flex items-center justify-between">
                    <span className="readout text-signal-yellow">ARTICLE {NUMERALS[i]}</span>
                    <span className={`grid size-6 place-items-center rounded-full transition-all duration-300 ${s === "idle" ? "scale-50 opacity-0" : "scale-100 opacity-100"} ${s === "stop" ? "bg-signal-red text-flag" : "bg-signal-yellow text-abyss"}`}>
                      {s === "stop" ? <X className="size-3.5" /> : <Check className="size-3.5" />}
                    </span>
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{r.title}</h3>
                  <p className="mt-2 text-mist">{r.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <Scale />
      </div>
    </section>
  );
}

function Figure({ figure, label, start }: { figure: string; label: string; start: boolean }) {
  const match = /^([\d,]+)(.*)$/.exec(figure);
  const target = match ? Number(match[1]!.replace(/,/g, "")) : 0;
  const value = useCountUp(target, start);
  return (
    <li>
      <p className="font-display text-6xl leading-none font-semibold tabular-nums">{value.toLocaleString("en-GB")}{match?.[2]}</p>
      <p className="mt-3 text-mist">{label}</p>
    </li>
  );
}

function Scale() {
  const [ref, seen] = useInView<HTMLUListElement>(0.5);
  return (
    <ul ref={ref} className="mt-24 grid gap-10 border-t hairline pt-14 sm:grid-cols-3">
      {content.scale.map((s) => <Figure key={s.label} figure={s.figure} label={s.label} start={seen} />)}
    </ul>
  );
}
