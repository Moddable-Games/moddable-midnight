import { ArrowRight } from "lucide-react";
import content from "./content.json";
import { FleetChart } from "./FleetChart";
import { useScrollProgress } from "./hooks";

export function Hero() {
  const h = content.hero;
  return (
    <header id="top" className="hero-ground relative overflow-hidden pt-18">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1fr_1fr] lg:pb-24 lg:pt-14">
        <div className="relative z-10">
          <p className="readout rise mb-6 text-signal-yellow">{h.eyebrow}</p>
          <h1 className="rise rise-1 text-[2.6rem] sm:text-6xl xl:text-[4.4rem]">
            <span className="block">{h.title[0]}</span>
            <span className="block text-signal-yellow">{h.title[1]}</span>
          </h1>
          <p className="rise rise-2 mt-8 max-w-[34rem] text-lg text-flag/80">{h.body}</p>
          <div className="rise rise-3 mt-10 flex flex-wrap gap-4">
            <a href="#commission" className="group inline-flex h-13 items-center gap-2 rounded-full bg-signal-yellow px-7 font-semibold text-abyss hover:bg-[#ffc619]">
              {h.primary}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#fleet" className="inline-flex h-13 items-center rounded-full px-7 font-semibold ring-1 ring-flag/25 hover:ring-flag/60">{h.secondary}</a>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end"><FleetChart /></div>
      </div>
    </header>
  );
}

/** The manifesto lights up word by word as it scrolls into view. */
export function Manifesto() {
  const [ref, progress] = useScrollProgress<HTMLQuoteElement>();
  const words = content.manifesto.quote.split(" ");
  const lit = Math.round(progress * words.length * 1.15);
  return (
    <section id="manifesto" className="scroll-mt-18 border-y hairline bg-hull">
      <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 md:py-32">
        <p className="readout mb-8 text-signal-yellow">MANIFESTO</p>
        <blockquote ref={ref} className="font-display text-3xl leading-[1.2] font-medium sm:text-[2.6rem]">
          {words.map((w, i) => (
            <span key={i} className={`transition-colors duration-300 ${i < lit ? "text-flag" : "text-chart"}`}>{w}{i < words.length - 1 ? " " : ""}</span>
          ))}
        </blockquote>
        <p className="mt-10 max-w-2xl text-lg text-mist">{content.manifesto.follow}</p>
      </div>
    </section>
  );
}
