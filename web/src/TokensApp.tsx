import { ArrowRight, ExternalLink, Eye, Lock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { StoryStrip } from "@/components/story-strip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SITE, pageHref, repoHref } from "@/lib/site";
import { LAB, type LiveContract, readAll } from "@/lib/token-lab";
import { EXPLORER } from "@/lib/tournament";
import content from "../public/data/tokens.json";

type Kind = 0 | 1 | 2 | 3;

/** Native coin = filled disc, contract balance = ring; lock = private, eye = public. */
function KindGlyph({ kind }: { kind: Kind }) {
  const native = kind < 2;
  const hidden = kind === 1 || kind === 3;
  const Icon = hidden ? Lock : Eye;
  return (
    <span className={`grid size-12 shrink-0 place-items-center rounded-full ${
      native ? (hidden ? "bg-cosmic-mid text-white" : "bg-foreground text-background") : hidden ? "border-2 border-cosmic-mid text-cosmic-mid" : "border-2 border-foreground"
    }`}>
      <Icon className="size-5" />
    </span>
  );
}

const stepOf = (n: number) => LAB.run.find((r) => r.step === n);

function Evidence({ steps }: { steps: number[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {steps.map((n) => {
        const s = stepOf(n);
        if (!s?.txHash) return null;
        return (
          <li key={n}>
            <a href={EXPLORER.transaction(s.txHash)} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs hover:border-primary/40 hover:text-primary">
              {s.label} <ExternalLink className="size-3" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function TypeCard({ t, live }: { t: (typeof content.types)[number]; live?: LiveContract }) {
  const deployment = LAB.deployments.find((d) => d.standard === t.standard);
  const fungible = live?.tokens.filter((x) => !x.nft).length ?? null;
  const nfts = live?.tokens.filter((x) => x.nft).length ?? null;
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <KindGlyph kind={t.kind as Kind} />
          <div>
            <h3 className="font-display text-xl font-semibold">{t.name}</h3>
            <p className="text-sm text-muted-foreground">{t.mip}, {t.status.toLowerCase()}</p>
          </div>
        </div>
        <p className="text-sm text-pretty">{t.summary}</p>
        <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Hidden</dt><dd className="text-pretty">{t.private}</dd>
          <dt className="text-muted-foreground">NFTs</dt><dd className="text-pretty">{t.nft}</dd>
          <dt className="text-muted-foreground">Burning</dt><dd className="text-pretty">{t.burn}</dd>
        </dl>
        {deployment ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted px-3 py-2 text-sm">
            <span>
              {live ? (
                <><span className="font-semibold tabular-nums">{fungible}</span> fungible, <span className="font-semibold tabular-nums">{nfts}</span> NFT, <span className="font-semibold tabular-nums">{live.events.length}</span> events on chain</>
              ) : "Reading the chain…"}
            </span>
            <a href={EXPLORER.contract(deployment.address)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-mono text-xs hover:text-primary">
              {deployment.address.slice(0, 8)}…{deployment.address.slice(-6)} <ExternalLink className="size-3" />
            </a>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

/**
 * Chapter five: every kind of Midnight token, from the latest token MIPs, issued and moved on
 * preview, with the questions it answers and the gaps it found. The wallet app does the work;
 * this page explains it and reads the contracts live.
 */
export function TokensApp() {
  const [live, setLive] = useState<Record<string, LiveContract>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    readAll().then((results) => {
      const next: Record<string, LiveContract> = {};
      for (const r of results) if (r.status === "fulfilled") next[r.value.standard] = r.value;
      setLive(next);
      if (results.some((r) => r.status === "rejected")) setError("Some contracts could not be read from the indexer just now.");
    });
  }, []);

  const veil = live.private_ledger;

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
            <SiteNav current="tokens" />
            <Badge className="rounded-full border-white/30 bg-white/10 text-white">Midnight preview</Badge>
          </nav>
          <section className="grid items-center gap-10 pt-10 pb-14 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-5">
              <p className="mg-eyebrow inline-flex items-center gap-2 font-pixel text-[11px] tracking-[1.5px] text-cosmic-glow">TOKENS · CHAPTER 5</p>
              <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
                Four kinds of Midnight token, each issued and moved on preview
              </h1>
              <p className="max-w-xl text-base text-white/78 text-pretty">
                Midnight tokens can be public or private, and live as coins or as balances inside a
                contract. We built all four from the latest token proposals, minted fungible supplies
                and NFTs of each, moved value between private and public form, and gave the{" "}
                {SITE.crewName} spending limits the chain itself enforces.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/midnightntwrk/midnight-improvement-proposals" target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90">
                  The MIPs <ExternalLink className="size-4" />
                </a>
                <a href={`${SITE.repo}/tree/main/contracts`} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  The contracts <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {content.types.map((t) => (
                <div key={t.kind} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <span className="mb-3 flex items-center gap-2 text-cosmic-glow">
                    {t.kind === 1 || t.kind === 3 ? <Lock className="size-5" /> : <Eye className="size-5" />}
                    {t.kind < 2 ? "coin" : "balance"}
                  </span>
                  <p className="font-display text-xl font-semibold">{t.name}</p>
                  <p className="text-sm text-white/70">{t.mip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </header>

      <main className="container mx-auto space-y-14 px-4 py-12">
        <StoryStrip current="tokens" />

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-semibold">The four types</h2>
            <p className="max-w-3xl text-muted-foreground text-pretty">
              The counts below are read from each contract's state on Midnight's public indexer as
              this page loads, decoded in your browser with the contract's own compiled code.
            </p>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.types.map((t) => <TypeCard key={t.kind} t={t} live={live[t.standard]} />)}
          </div>
          {veil?.notes ? (
            <p className="max-w-3xl text-sm text-muted-foreground text-pretty">
              The private contract holds {veil.notes.created} note commitments, {veil.notes.spent} of them spent.
              That, and each note's commitment and nullifier, is all anyone can see of its transfers.
            </p>
          ) : null}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold">Three questions, answered on chain</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {content.questions.map((q) => (
              <Card key={q.q}>
                <CardContent className="p-5">
                  <h3 className="font-display text-lg font-semibold text-balance">{q.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground text-pretty">{q.a}</p>
                  <Evidence steps={q.evidence} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold">What each proposal became</h2>
          <ul className="divide-y rounded-xl border bg-card">
            {content.mips.map((m) => (
              <li key={m.mip} className="grid gap-2 px-5 py-4 md:grid-cols-[10rem_12rem_1fr] md:items-baseline">
                <span className="font-display text-lg font-semibold">{m.mip}</span>
                <span><Badge variant={m.verdict === "Implemented" ? "default" : "secondary"} className="rounded-full">{m.verdict}</Badge></span>
                <span className="text-sm text-pretty"><span className="font-semibold">{m.title}.</span> {m.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-semibold">Agents, under limits</h2>
            <p className="max-w-3xl text-muted-foreground text-pretty">
              Some limits are enforced by the wallet daemon before anything is signed, and some by the
              treasury contract itself, where no daemon can be talked round.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.agents.map((a) => (
              <Card key={a.title}>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">{a.title}</h3>
                    <Badge variant="secondary" className="rounded-full">{a.where}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty">{a.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-semibold">What we found</h2>
            <ul className="space-y-2">
              {content.findings.map((f) => (
                <li key={f.href}>
                  <a href={repoHref(f.href)} target="_blank" rel="noopener" className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40">
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{f.finding}</span>
                    <span className="text-sm">{f.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-semibold">Every step, on chain</h2>
            <ol className="max-h-[28rem] divide-y overflow-y-auto rounded-xl border bg-card">
              {LAB.run.map((s) => (
                <li key={s.step} className="flex items-baseline justify-between gap-3 px-4 py-2 text-sm">
                  <span className="flex items-baseline gap-2">
                    <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">{s.step}</span>
                    <span>{s.label}</span>
                  </span>
                  {s.txHash ? (
                    <a href={EXPLORER.transaction(s.txHash)} target="_blank" rel="noopener" className="shrink-0 text-muted-foreground tabular-nums underline underline-offset-4 hover:text-primary">
                      block {s.block?.toLocaleString()}
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-6">
          <p className="flex items-center gap-2 font-display text-xl font-semibold"><Sparkles className="size-5 text-primary" />All of this runs from the wallet app.</p>
          <a href={pageHref("wallet.html")} className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            See the wallet <ArrowRight className="size-4" />
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
