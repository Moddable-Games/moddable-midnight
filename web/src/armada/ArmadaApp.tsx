import { ArrowRight, BadgeCheck, EyeOff, Eye } from "lucide-react";
import { useState, type FormEvent } from "react";
import content from "./content.json";
import { ChartTable, Hoist, SignalFlag, type FlagId } from "./parts";

/**
 * Midnight Armada: a concept page for a future service, a private command deck for fleets of AI
 * agents on the Midnight network. Standalone by design: its own theme, fonts and words, linked
 * from nowhere.
 */

const BELLS = [2, 4, 8];
const FLAG_ORDER: FlagId[] = ["flagship", "flotilla", "harbor", "cloak"];

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label={content.brand}>
      <Hoist />
      <span className="whitespace-nowrap font-display text-base tracking-[0.14em] uppercase sm:text-xl sm:tracking-[0.18em]">Midnight <span className="italic tracking-[0.08em] normal-case">Armada</span></span>
    </a>
  );
}

function Hero() {
  return (
    <header id="top" className="chart-ground relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <nav className="flex items-center justify-between py-6">
          <Wordmark />
          <ul className="hidden items-center gap-8 text-[15px] text-mist md:flex">
            <li><a href="#fleet" className="hover:text-flag">The fleet</a></li>
            <li><a href="#cloak" className="hover:text-flag">Cloaking Device</a></li>
            <li><a href="#rules" className="hover:text-flag">Rules of engagement</a></li>
          </ul>
          <a href="#commission" className="whitespace-nowrap rounded-full border border-flag/30 px-4 py-2 text-sm font-medium hover:border-signal-yellow hover:text-signal-yellow">Request access</a>
        </nav>
        <div className="grid items-center gap-10 pb-20 pt-8 lg:grid-cols-[1.05fr_1fr] lg:pb-28">
          <div>
            <p className="readout mb-6 text-signal-yellow">ON STATION, 03:00 LOCAL</p>
            <h1 className="text-[2.55rem] sm:text-7xl lg:text-[4.7rem] xl:text-[5.2rem]">
              <span className="whitespace-nowrap">Command the fleet</span><br /><span className="italic text-mist sm:whitespace-nowrap">Stay in the dark</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-flag/80">{content.hero.body}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#commission" className="group inline-flex h-13 items-center gap-2 rounded-full bg-signal-yellow px-7 font-semibold text-abyss hover:bg-[#ffc619]">
                {content.hero.primary}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#fleet" className="inline-flex h-13 items-center rounded-full px-7 font-semibold ring-1 ring-flag/25 hover:ring-flag/60">{content.hero.secondary}</a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end"><ChartTable /></div>
        </div>
      </div>
    </header>
  );
}

function Manifesto() {
  return (
    <section className="border-y hairline bg-hull">
      <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 md:py-32">
        <blockquote className="font-display text-3xl leading-[1.15] font-normal sm:text-5xl">
          <span className="text-signal-yellow">“</span>{content.manifesto.quote}<span className="text-signal-yellow">”</span>
        </blockquote>
        <p className="mt-10 max-w-2xl text-lg text-mist">{content.manifesto.follow}</p>
      </div>
    </section>
  );
}

function Fleet() {
  const [active, setActive] = useState<FlagId>("flagship");
  const unit = content.fleet.find((f) => f.id === active)!;
  return (
    <section id="fleet" className="scroll-mt-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <h2 className="max-w-3xl text-5xl sm:text-6xl">One command structure, <span className="italic">four</span> kinds of vessel</h2>
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.25fr]">
        <ul className="space-y-2" role="tablist" aria-label="The fleet">
          {content.fleet.map((f) => (
            <li key={f.id}>
              <button type="button" role="tab" aria-selected={active === f.id} onClick={() => setActive(f.id as FlagId)}
                className={`flex w-full items-center gap-5 rounded-2xl p-5 text-left transition-colors ${active === f.id ? "bg-deck ring-1 ring-flag/15" : "hover:bg-hull"}`}>
                <SignalFlag id={f.id as FlagId} />
                <span className="flex-1">
                  <span className="block font-display text-2xl">{f.name}</span>
                  <span className="block text-[15px] text-mist">{f.role}</span>
                </span>
                <ArrowRight className={`size-5 transition-opacity ${active === f.id ? "text-signal-yellow opacity-100" : "opacity-0"}`} />
              </button>
            </li>
          ))}
        </ul>
        <article className="relative overflow-hidden rounded-[2rem] bg-deck p-8 ring-1 ring-flag/10 sm:p-12" role="tabpanel">
          <p className="readout text-signal-yellow">{unit.role.toUpperCase()}</p>
          <h3 className="mt-3 font-display text-4xl sm:text-5xl">{unit.name}</h3>
          <p className="mt-5 max-w-lg text-lg text-flag/80">{unit.body}</p>
          <ul className="mt-8 space-y-3">
            {unit.points.map((p) => (
              <li key={p} className="flex items-start gap-3"><span className="mt-2.5 h-px w-6 shrink-0 bg-signal-yellow" />{p}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function Deck() {
  const d = content.deck;
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid items-end gap-6 lg:grid-cols-[1fr_1fr]">
        <h2 className="text-5xl sm:text-6xl">{d.title}</h2>
        <p className="max-w-lg text-lg text-mist">{d.body}</p>
      </div>
      <figure className="mt-14 overflow-hidden rounded-[2rem] bg-hull ring-1 ring-flag/10" aria-label="A concept of the command deck">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b hairline px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <SignalFlag id="flagship" className="h-8 w-11" />
            <div><p className="readout">FLAGSHIP</p><p className="font-display text-2xl">{d.flagship}</p></div>
          </div>
          <div className="text-right"><p className="readout">TREASURY, CLOAKED</p><p className="font-display text-3xl">{d.treasury}</p></div>
        </div>
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <ul className="divide-y divide-chart border-b hairline lg:border-b-0 lg:border-r">
            {d.flotillas.map((f) => (
              <li key={f.name} className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 px-6 py-5 sm:grid-cols-[auto_10rem_1fr] sm:px-8">
                <SignalFlag id="flotilla" className="h-6 w-8" />
                <div><p className="font-semibold">{f.name}</p><p className="readout">{f.agents} AGENTS</p></div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="h-2 overflow-hidden rounded-full bg-abyss"><div className={`h-full rounded-full bg-signal-yellow ${f.used}`} /></div>
                  <p className="mt-1.5 text-[13px] text-mist">{f.label}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-5 sm:px-8">
            <p className="readout mb-3">SIGNALS</p>
            <ul className="space-y-3">
              {d.signals.map((s) => (
                <li key={s.from} className="flex items-start gap-3">
                  <EyeOff className="mt-1 size-4 shrink-0 text-signal-yellow" />
                  <div className="min-w-0 flex-1"><p className="text-[15px]">{s.what}</p><p className="text-[13px] text-mist">{s.from}</p></div>
                  <span className="readout">{s.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </figure>
      <figcaption className="mt-3 text-[13px] text-mist">A concept of the deck. Names and figures are illustrative.</figcaption>
    </section>
  );
}

function Course() {
  return (
    <section className="border-t hairline">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-28">
        <h2 className="max-w-2xl text-5xl sm:text-6xl">Charting the course</h2>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4">
          <span className="absolute left-0 right-0 top-[11px] hidden h-px border-t border-dashed border-chart md:block" aria-hidden="true" />
          {content.course.map((c, i) => (
            <li key={c.phase} className="relative">
              <span className={`relative grid size-6 place-items-center rounded-full ring-4 ring-abyss ${i === 0 ? "bg-signal-yellow" : "bg-chart"}`}>
                {i === 0 ? <span className="size-2 rounded-full bg-abyss" /> : null}
              </span>
              <h3 className="mt-5 font-display text-2xl">{c.phase}</h3>
              <p className="mt-2 text-mist">{c.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Watches() {
  return (
    <section className="chart-ground border-y hairline">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-28">
        <h2 className="max-w-2xl text-5xl">A mission, watch by watch</h2>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-chart md:grid-cols-3">
          {content.watch.map((w, i) => (
            <li key={w.title} className="bg-abyss/95 p-8 sm:p-10">
              <span className="flex gap-1.5" aria-label={`${BELLS[i]} bells`}>
                {Array.from({ length: BELLS[i] ?? 0 }, (_, b) => <span key={b} className="size-2.5 rounded-full bg-signal-yellow/80" />)}
              </span>
              <p className="readout mt-6">{w.bell.toUpperCase()}</p>
              <h3 className="mt-2 font-display text-3xl">{w.title}</h3>
              <p className="mt-3 text-mist">{w.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Cloak() {
  const [on, setOn] = useState(true);
  return (
    <section id="cloak" className="scroll-mt-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SignalFlag id="cloak" className="h-12 w-16" />
          <h2 className="mt-6 text-5xl sm:text-6xl">{content.cloak.title}</h2>
          <p className="mt-6 max-w-lg text-lg text-flag/80">{content.cloak.body}</p>
        </div>
        <div className="rounded-[2rem] bg-deck p-6 ring-1 ring-flag/10 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-2xl">Settlement 7,204</p>
            <button type="button" role="switch" aria-checked={on} onClick={() => setOn(!on)}
              className="inline-flex items-center gap-3 rounded-full bg-abyss px-4 py-2 text-sm font-medium ring-1 ring-flag/15">
              {on ? <EyeOff className="size-4 text-signal-yellow" /> : <Eye className="size-4 text-mist" />}
              Cloaking Device {on ? "on" : "off"}
              <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-signal-yellow" : "bg-chart"}`}>
                <span className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-abyss transition-transform ${on ? "translate-x-4" : ""}`} />
              </span>
            </button>
          </div>
          <dl className="mt-6 divide-y divide-chart">
            {content.cloak.transaction.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-mist">{f.label}</dt>
                <dd className={`font-mono text-sm ${on && f.label !== "Policy" ? "redacted px-2" : ""}`}>{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-abyss p-4">
            <BadgeCheck className="size-8 shrink-0 text-signal-yellow" />
            <div>
              <p className="font-semibold">Compliance proven</p>
              <p className="text-sm text-mist">{on ? "The auditor verifies the proof. Nothing else leaves the fleet." : "Details visible to holders of a disclosure key."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Rules() {
  return (
    <section id="rules" className="scroll-mt-10 bg-hull">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="text-5xl sm:text-6xl">Rules of <span className="italic">engagement</span></h2>
          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {content.rules.map((r, i) => (
              <li key={r.title} className="border-t hairline pt-6">
                <span className="readout text-signal-yellow">ARTICLE {["I", "II", "III", "IV"][i]}</span>
                <h3 className="mt-2 font-display text-3xl">{r.title}</h3>
                <p className="mt-2 text-mist">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <ul className="mt-24 grid gap-10 border-t hairline pt-14 sm:grid-cols-3">
          {content.scale.map((s) => (
            <li key={s.label}>
              <p className="font-display text-7xl leading-none">{s.figure}</p>
              <p className="mt-3 text-mist">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Commanders() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <h2 className="max-w-3xl text-5xl sm:text-6xl">Who takes command</h2>
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.commanders.map((c, i) => (
          <li key={c.title} className="rounded-[1.75rem] bg-deck p-7 ring-1 ring-flag/10">
            <SignalFlag id={FLAG_ORDER[i % FLAG_ORDER.length] ?? "flagship"} className="h-7 w-9" />
            <h3 className="mt-6 font-display text-2xl">{c.title}</h3>
            <p className="mt-2 text-mist">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Commission() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  const field = "h-12 w-full rounded-xl bg-abyss px-4 text-flag ring-1 ring-chart placeholder:text-mist/70 focus:outline-none focus:ring-signal-yellow";
  return (
    <section id="commission" className="chart-ground scroll-mt-10 border-t hairline">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-2">
        <div>
          <h2 className="text-5xl sm:text-7xl">{content.commission.title}</h2>
          <p className="mt-6 max-w-md text-lg text-flag/80">{content.commission.body}</p>
        </div>
        <div className="rounded-[2rem] bg-deck p-6 ring-1 ring-flag/10 sm:p-9">
          {sent ? (
            <div className="flex min-h-72 flex-col justify-center">
              <SignalFlag id="flagship" className="h-12 w-16" />
              <p className="mt-6 font-display text-3xl">Signal received</p>
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
              <button type="submit" className="mt-2 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-signal-yellow font-semibold text-abyss hover:bg-[#ffc619]">
                Request a commission <ArrowRight className="size-4" />
              </button>
              <p className="text-center text-[13px] text-mist">{content.commission.note}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function ArmadaApp() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Fleet />
      <Deck />
      <Watches />
      <Cloak />
      <Rules />
      <Commanders />
      <Course />
      <Commission />
      <footer className="border-t hairline">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-10 sm:px-8">
          <Wordmark />
          <p className="text-sm text-mist">A concept for a future service on the Midnight network. Not yet in service.</p>
        </div>
      </footer>
    </>
  );
}
