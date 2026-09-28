import { ArrowRight, Building2, ChartCandlestick, Gamepad2, Landmark } from "lucide-react";
import { useState, type FormEvent } from "react";
import content from "./content.json";
import { useInView } from "./hooks";
import { Wordmark } from "./Nav";
import { SonarMark, VesselIcon } from "./parts";

const COMMANDER_ICONS = [ChartCandlestick, Building2, Gamepad2, Landmark];

export function Commanders() {
  const [ref, seen] = useInView<HTMLUListElement>(0.2);
  return (
    <section id="commanders" className="scroll-mt-18 mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <p className="readout mb-5 text-signal-yellow">COMMANDERS</p>
      <h2 className="max-w-3xl text-4xl sm:text-5xl">Who takes command</h2>
      <ul ref={ref} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.commanders.map((c, i) => {
          const Icon = COMMANDER_ICONS[i] ?? Building2;
          return (
            <li key={c.title} className={`reveal group rounded-[1.75rem] bg-deck p-7 ring-1 ring-flag/10 transition hover:-translate-y-1 hover:ring-signal-yellow/40 stagger-${i + 1} ${seen ? "is-in" : ""}`}>
              <Icon className="size-8 text-mist transition-colors group-hover:text-signal-yellow" strokeWidth={1.5} />
              <h3 className="mt-6 font-display text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-mist">{c.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The route ahead: the line draws itself in, and the fleet sits at the first phase. */
export function Course() {
  const [ref, seen] = useInView<HTMLOListElement>(0.4);
  return (
    <section id="course" className="scroll-mt-18 border-t hairline">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-28">
        <p className="readout mb-5 text-signal-yellow">COURSE</p>
        <h2 className="max-w-2xl text-4xl sm:text-5xl">Charting the course</h2>
        <ol ref={ref} className="relative mt-16 grid gap-10 md:grid-cols-4">
          <span className="absolute left-0 right-0 top-[11px] hidden h-px border-t border-dashed border-chart md:block" aria-hidden="true" />
          <span className={`absolute left-0 top-[11px] hidden h-px bg-signal-yellow transition-[width] duration-[1600ms] ease-out md:block ${seen ? "w-full" : "w-0"}`} aria-hidden="true" />
          {content.course.map((c, i) => (
            <li key={c.phase} className={`reveal relative stagger-${i + 1} ${seen ? "is-in" : ""}`}>
              <span className={`relative grid size-6 place-items-center rounded-full ring-4 ring-abyss ${i === 0 ? "bg-signal-yellow" : "bg-chart"}`}>
                {i === 0 ? <span className="ping-soft absolute inset-0 rounded-full bg-signal-yellow" /> : null}
                {i === 0 ? <span className="relative size-2 rounded-full bg-abyss" /> : null}
              </span>
              {i === 0 ? <span className="readout absolute -top-6 left-0 text-signal-yellow">NOW</span> : null}
              <h3 className="mt-5 font-display text-xl font-semibold">{c.phase}</h3>
              <p className="mt-2 text-mist">{c.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Commission() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  const field = "h-12 w-full rounded-xl bg-abyss px-4 text-flag ring-1 ring-chart placeholder:text-mist/70 focus:outline-none focus:ring-signal-yellow";
  return (
    <section id="commission" className="chart-ground scroll-mt-18 border-t hairline">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-2">
        <div>
          <p className="readout mb-5 text-signal-yellow">COMMISSION</p>
          <h2 className="text-4xl sm:text-6xl">{content.commission.title}</h2>
          <p className="mt-6 max-w-md text-lg text-flag/80">{content.commission.body}</p>
        </div>
        <div className="rounded-[2rem] bg-deck p-6 ring-1 ring-flag/10 sm:p-9">
          {sent ? (
            <div className="panel-in flex min-h-72 flex-col justify-center">
              <span className="relative grid size-16 place-items-center">
                <span className="ping-soft absolute inset-0 rounded-full ring-1 ring-signal-yellow" />
                <SonarMark className="size-12 text-flag" />
              </span>
              <p className="mt-6 font-display text-2xl font-semibold">Signal received</p>
              <p className="mt-2 text-mist">{content.commission.note} When commissions open, this is where you will start.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block"><span className="mb-1.5 block text-sm text-mist">Name</span><input required className={field} placeholder="Admiral Grace Hopper" /></label>
              <label className="block"><span className="mb-1.5 block text-sm text-mist">Organisation</span><input required className={field} placeholder="Fleet name or company" /></label>
              <label className="block"><span className="mb-1.5 block text-sm text-mist">Size of fleet</span>
                <select className={field} defaultValue="">
                  <option value="" disabled>How many agents?</option>
                  <option>Fewer than 10</option><option>10 to 100</option><option>100 to 1,000</option><option>More than 1,000</option>
                </select>
              </label>
              <label className="block"><span className="mb-1.5 block text-sm text-mist">Work email</span><input required type="email" className={field} placeholder="you@fleet.com" /></label>
              <button type="submit" className="group mt-2 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-signal-yellow font-semibold text-abyss hover:bg-[#ffc619]">
                {content.commission.cta}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <p className="text-center text-[13px] text-mist">{content.commission.note}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-10 sm:px-8">
        <Wordmark />
        <p className="flex items-center gap-2 text-sm text-mist"><VesselIcon id="cloak" className="size-5" />A concept for a future service on the Midnight network. Not yet in service.</p>
      </div>
    </footer>
  );
}
