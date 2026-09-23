import { ArrowRight, ExternalLink } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { StoryStrip } from "@/components/story-strip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SITE, pageHref, repoHref } from "@/lib/site";
import { EXPLORER } from "@/lib/tournament";
import wallet from "../public/data/wallet.json";

type Linked = (typeof wallet.why)[number];

function FindingList({ items }: { items: Linked[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <a href={repoHref(item.href)} target="_blank" rel="noopener" className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40">
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{item.finding}</span>
            <span className="text-sm">{item.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Chapter three: the wallet the crew needed and could not get. A local wallet process for the
 * organiser and the agents, and a browser page to approve what they do. It runs on the
 * operator's machine, so this page describes it, shows it, and links its on-chain record.
 */
export function WalletApp() {
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
            <SiteNav current="wallet" />
            <Badge className="rounded-full border-white/30 bg-white/10 text-white">Midnight preview</Badge>
          </nav>
          <section className="grid items-center gap-10 pt-10 pb-14 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="mg-eyebrow inline-flex items-center gap-2 font-pixel text-[11px] tracking-[1.5px] text-cosmic-glow">WALLET · CHAPTER 3</p>
              <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
                A Midnight wallet for Firefox, shared by a human and three AI agents
              </h1>
              <p className="max-w-xl text-base text-white/78 text-pretty">
                Midnight City asks its agents to hold NIGHT, but gives self-hosted agents no way to
                have a wallet. Firefox has no Midnight wallet at all, and Midnight's wallet CLI could
                pay but not deploy. So the {SITE.crewName} got its own: real preview wallets for the
                organiser and each agent, in one local process, with a browser page where every
                payment waits for a human.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={repoHref("notes/WALLET-DAEMON.md")} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90">
                  How it works <ExternalLink className="size-4" />
                </a>
                <a href={`${SITE.repo}/tree/main/wallet-daemon`} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  The source <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
            <a href={pageHref("img/wallet-ui-full.png")} className="block overflow-hidden rounded-xl border border-white/15 shadow-2xl transition-colors hover:border-cosmic-glow">
              <img
                src={pageHref("img/wallet-ui-hero.png")}
                alt="The wallet page: the approvals panel, the crew treasury contract, and the organiser's and Floyd's wallets with their NIGHT, DUST and tokens"
                className="block w-full"
              />
            </a>
          </section>
        </div>
      </header>

      <main className="container mx-auto space-y-14 px-4 py-12">
        <StoryStrip current="wallet" />

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-semibold">Why it had to exist</h2>
            <p className="text-muted-foreground text-pretty">
              Chapter two left the crew working the city with no way to hold money, and chapter four
              needed an organiser's wallet to deploy a treasury. Five findings stood in the way.
            </p>
            <FindingList items={wallet.why} />
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-semibold">What building it uncovered</h2>
            <p className="text-muted-foreground text-pretty">
              Running Midnight's own wallet libraries directly surfaced problems that reach anyone who
              does the same, each logged with evidence and a suggested fix.
            </p>
            <FindingList items={wallet.found} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold">What it does</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wallet.features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="space-y-2 p-5">
                  <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">{feature.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl font-semibold">What it has signed</h2>
          <p className="max-w-3xl text-muted-foreground text-pretty">
            Every one of these was requested and approved through the wallet, then confirmed on the
            public indexer rather than taken from the wallet's own report.
          </p>
          <ul className="divide-y rounded-xl border bg-card">
            {wallet.transactions.map((tx) => (
              <li key={tx.hash} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2.5 text-sm">
                <span>{tx.what}</span>
                <a href={EXPLORER.transaction(tx.hash)} target="_blank" rel="noopener" className="text-muted-foreground tabular-nums underline underline-offset-4 hover:text-primary">
                  block {tx.block.toLocaleString()}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-semibold">The wallet page</h2>
            <p className="max-w-3xl text-muted-foreground text-pretty">
              It runs on the operator's machine and holds real keys, so it is not published. Keys stay
              in the local wallet process, which answers only this page. Balances come live from
              Midnight's public indexer; the treasury panel links to the{" "}
              <a href={pageHref("treasury.html")} className="underline underline-offset-4 hover:text-primary">public check</a>{" "}
              anyone can run.
            </p>
          </div>
          <a href={pageHref("img/wallet-ui-full.png")} className="block overflow-hidden rounded-xl border">
            <img
              src={pageHref("img/wallet-ui-full.png")}
              alt="The full wallet page: approvals, the crew treasury contract, and four wallet cards for the organiser, Floyd, Tzilo and FooFoo, each with balances, tokens, addresses and a send form"
              className="block w-full"
              loading="lazy"
            />
          </a>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-6">
          <p className="font-display text-xl font-semibold">Next: the treasury these wallets deployed and draw from.</p>
          <a href={pageHref("treasury.html")} className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            Check the treasury <ArrowRight className="size-4" />
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
