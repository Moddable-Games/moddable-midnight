import { ArrowRight } from "lucide-react";
import { ModdableLinks } from "@/components/moddable-links";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { StoryStrip } from "@/components/story-strip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SITE, pageHref } from "@/lib/site";

const CREW = [
  { name: "Floyd", img: "img/floyd.png" },
  { name: "Tzilo", img: "img/tzilo.png" },
  { name: "FooFoo", img: "img/foofoo.png" },
];

const DOORS = [
  {
    href: "city.html",
    eyebrow: "LIVE",
    title: `Meet the ${SITE.crewShort} crew`,
    body: "Three AI agents working Midnight City around the clock, each with its own real Midnight wallet. Live from the game and the chain.",
    cta: "The crew",
  },
  {
    href: "treasury.html",
    eyebrow: "VERIFY",
    title: "Check the crew treasury",
    body: "Midnight City Credits and the agents' Agent Smart Contract NFTs, checked against the Midnight chain in your own browser.",
    cta: "The treasury",
  },
  {
    href: "history.html",
    eyebrow: "READ",
    title: "The whole story",
    body: "Four chapters from an empty repository, with every finding, the security audit and the timed clock behind them.",
    cta: "The history",
  },
];

/** The front door: what this is, three ways in, and the rest of Moddable. */
export function HomeApp() {
  return (
    <div className="min-h-screen bg-background">
      <header className="relative isolate overflow-hidden bg-black text-white">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-cosmic-deep via-cosmic-mid to-black" />
        <div className="mg-hero-hex -z-10" />
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap items-center justify-between gap-3 py-5">
            <a href={pageHref("")} aria-label="Home">
              <img src={pageHref("img/moddable-logo-white.png")} alt="Moddable" className="h-7 w-auto" />
            </a>
            <SiteNav />
            <Badge className="rounded-full border-white/30 bg-white/10 text-white">Midnight preview</Badge>
          </nav>
          <section className="grid items-center gap-10 pt-12 pb-16 lg:grid-cols-[3fr_2fr]">
            <div className="space-y-5">
              <p className="mg-eyebrow inline-flex items-center gap-2 font-pixel text-[11px] tracking-[1.5px] text-cosmic-glow">MODDABLE ON MIDNIGHT</p>
              <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
                An AI crew with real wallets and a private treasury
              </h1>
              <p className="max-w-2xl text-base text-white/78 text-pretty">
                The {SITE.crewName} ({SITE.crewShort}) is three AI agents living in Midnight City.
                They hold real wallets on Midnight's preview network and draw their allowance from
                a treasury contract that pays them without revealing which of them drew. All of it
                built with Midnight's own AI developer tools, timed, and written down.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={pageHref("city.html")} className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90">
                  Meet the crew <ArrowRight className="size-4" />
                </a>
                <a href={pageHref("history.html")} className="inline-flex h-10 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  Read the story
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {CREW.map((agent) => (
                <a key={agent.name} href={pageHref("city.html")} className="rounded-xl border border-white/15 bg-white/5 p-3 text-center transition-colors hover:border-cosmic-glow">
                  <img src={pageHref(agent.img)} alt={agent.name} className="mx-auto h-28 w-auto [image-rendering:pixelated]" />
                  <p className="mt-2 font-display text-lg font-semibold">{agent.name}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </header>

      <main className="container mx-auto space-y-12 px-4 py-12">
        <section className="grid gap-4 md:grid-cols-3">
          {DOORS.map((door) => (
            <a key={door.href} href={pageHref(door.href)} className="group block">
              <Card className="h-full transition-colors group-hover:border-primary/40">
                <CardContent className="space-y-2 p-6">
                  <p className="font-pixel text-[10px] tracking-[1.5px] text-primary">{door.eyebrow}</p>
                  <h2 className="font-display text-2xl font-semibold">{door.title}</h2>
                  <p className="text-muted-foreground text-pretty">{door.body}</p>
                  <p className="inline-flex items-center gap-1.5 pt-1 font-semibold text-primary">
                    {door.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </section>

        <StoryStrip />

        <ModdableLinks />
      </main>

      <SiteFooter />
    </div>
  );
}
