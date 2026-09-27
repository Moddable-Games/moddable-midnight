import {
  ArrowRight, Ban, Bot, Check, Copy, ExternalLink, FileCheck2, Gauge, KeyRound, Lock, RotateCcw, ShieldCheck, Timer, Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { StoryStrip } from "@/components/story-strip";
import { SITE, pageHref, repoHref } from "@/lib/site";
import { EXPLORER } from "@/lib/tournament";
import lab from "../public/data/token-lab.json";
import wallet from "../public/data/wallet.json";

/**
 * Chapter three, told as a product: the Moddable Wallet as if it were a service for
 * organisations that run agents. The page reads as a standalone homepage; the story it belongs
 * to surfaces near the bottom. Every screenshot is the real app on preview, and every figure
 * comes from the repo's own records.
 */

const ICONS: Record<string, typeof Gauge> = { gauge: Gauge, "file-check": FileCheck2, ban: Ban, timer: Timer, lock: Lock, rotate: RotateCcw };

// Real counts from this repo's records, so the proof line cannot drift from the chain.
const PROOF = {
  signed: wallet.transactions.length + lab.run.length + lab.deployments.length,
  contracts: lab.deployments.length + 2, // the token contracts plus both treasuries
  types: 4,
};

function Mark() {
  return (
    <span className="grid size-9 place-items-center rounded-[0.8rem] bg-white/10 ring-1 ring-white/15">
      <svg viewBox="0 0 24 24" className="size-5 text-cosmic-glow" aria-hidden="true">
        <path fill="currentColor" d="M12 2 21 7v10l-9 5-9-5V7l9-5Zm0 3.2L6 8.5v7l6 3.3 6-3.3v-7l-6-3.3Z" />
      </svg>
    </span>
  );
}

function CopyCommand({ label, command }: { label: string; command: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <li className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="mb-2 text-sm text-white/65">{label}</p>
      <div className="flex items-start gap-3">
        <span className="min-w-0 flex-1 break-all font-mono text-[13px] text-white">{command}</span>
        <button type="button" aria-label={`Copy: ${label}`} onClick={() => { navigator.clipboard.writeText(command); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="grid size-8 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
          {copied ? <Check className="size-4 text-cosmic-glow" /> : <Copy className="size-4" />}
        </button>
      </div>
    </li>
  );
}

function Feature({ f, flip }: { f: (typeof wallet.features)[number]; flip: boolean }) {
  return (
    <section id={f.id} className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
      <div className={flip ? "lg:order-2" : ""}>
        <h3 className="font-display text-3xl leading-tight font-bold text-balance md:text-4xl">{f.title}</h3>
        <p className="mt-3 max-w-md text-muted-foreground text-pretty">{f.body}</p>
        <ul className="mt-5 space-y-2.5">
          {f.points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-[15px]">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-cosmic-mid text-white"><Check className="size-3" /></span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <a href={pageHref(f.image)} className="wl-browser block transition-transform hover:-translate-y-0.5">
        <img src={pageHref(f.image)} alt={f.alt} loading="lazy" />
      </a>
    </section>
  );
}

function Section({ id, title, lead, children, dark = false }: { id?: string; title: string; lead?: ReactNode; children: ReactNode; dark?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-24 ${dark ? "text-white" : ""}`}>
      <h2 className="font-display text-4xl leading-tight font-bold text-balance md:text-5xl">{title}</h2>
      {lead ? <p className={`mt-3 max-w-2xl text-lg text-pretty ${dark ? "text-white/70" : "text-muted-foreground"}`}>{lead}</p> : null}
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function WalletApp() {
  const nav = [["Features", "#features"], ["Controls", "#controls"], ["Shared control", "#multisig"], ["For teams", "#teams"]];
  return (
    <div className="min-h-screen bg-mg-canvas">
      {/* Hero: a product homepage first */}
      <header className="relative isolate overflow-hidden pb-16 text-white md:pb-24">
        <div className="wl-band" />
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between gap-4 py-5">
            <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold" aria-label="Moddable Wallet">
              <Mark /> Moddable <span className="text-white/60">Wallet</span>
            </a>
            <ul className="hidden items-center gap-7 text-[15px] text-white/80 md:flex">
              {nav.map(([label, href]) => <li key={href}><a href={href} className="hover:text-white">{label}</a></li>)}
            </ul>
            <div className="flex items-center gap-3">
              <a href={pageHref("")} className="hidden text-sm text-white/70 hover:text-white sm:block">Moddable on Midnight</a>
              <a href="#run" className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm font-semibold text-cosmic-deep hover:bg-white/90">Run it</a>
            </div>
          </nav>

          <div id="top" className="grid items-center gap-12 pt-10 md:pt-16 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/85 ring-1 ring-white/15">
                <span className="size-2 rounded-full bg-mg-green" /> Live on Midnight preview
              </p>
              <h1 className="font-display text-5xl leading-[0.98] font-bold tracking-tight text-balance md:text-7xl">{wallet.hero.title}</h1>
              <p className="mt-6 max-w-lg text-lg text-white/78 text-pretty">{wallet.hero.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={wallet.hero.primary.href} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-cosmic-deep hover:bg-white/90">
                  {wallet.hero.primary.label} <ArrowRight className="size-4" />
                </a>
                <a href={wallet.hero.secondary.href} className="inline-flex h-12 items-center rounded-full px-6 font-semibold text-white ring-1 ring-white/35 hover:bg-white/10">
                  {wallet.hero.secondary.label}
                </a>
              </div>
            </div>
            <div className="relative pb-10 lg:pb-0">
              <div className="wl-browser">
                <img src={pageHref("img/wallet-app-dashboard.png")} alt="The Moddable Wallet dashboard on a desktop" />
              </div>
              <div className="wl-phone absolute -bottom-6 right-2 w-[34%] max-w-[210px] sm:right-6 lg:-bottom-12 lg:-right-4">
                <img src={pageHref("img/wallet-app-phone.png")} alt="The same dashboard on a phone" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-28 px-4 pb-20">
        {/* Proof, as a sentence rather than a stat row */}
        <p className="mx-auto max-w-4xl pt-6 text-center font-display text-2xl leading-snug font-semibold text-balance md:text-3xl">
          <span className="text-cosmic-mid">{PROOF.signed} transactions</span> signed and confirmed on chain,{" "}
          <span className="text-cosmic-mid">{PROOF.contracts} contracts</span> audited before deploy,{" "}
          <span className="text-cosmic-mid">{PROOF.types} token types</span>, and not one key that ever left the machine.
        </p>

        <div id="features" className="scroll-mt-24 space-y-24">
          {wallet.features.map((f, i) => <Feature key={f.id} f={f} flip={i % 2 === 1} />)}
        </div>

        <section className="grid items-center gap-10 rounded-[2rem] bg-cosmic-deep p-8 text-white md:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-4xl leading-tight font-bold text-balance">Approve from your pocket</h2>
            <p className="mt-3 max-w-md text-white/70 text-pretty">
              The same app on a phone: a tab bar for the views you use most, and every action in a sheet you can finish with a thumb.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {wallet.phone.map((p) => <div key={p.image} className="wl-phone"><img src={pageHref(p.image)} alt={p.alt} loading="lazy" /></div>)}
          </div>
        </section>

        <Section id="controls" title="Every limit, where it belongs" lead="Some rules are checked by the wallet before anything is signed. The ones that matter most are checked by the chain, where no software can be talked round.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wallet.controls.map((c) => {
              const Icon = ICONS[c.icon] ?? ShieldCheck;
              const onChain = c.where.includes("hain");
              return (
                <div key={c.title} className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
                  <div className="flex items-center justify-between">
                    <span className={`grid size-11 place-items-center rounded-2xl ${onChain ? "bg-cosmic-mid text-white" : "bg-mg-canvas text-cosmic-mid"}`}><Icon className="size-5" /></span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${onChain ? "bg-cosmic-glow/20 text-cosmic-mid" : "bg-mg-canvas text-muted-foreground"}`}>{c.where}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{c.title}</h3>
                  <p className="mt-1 text-muted-foreground text-pretty">{c.body}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* The one dark band: what is coming */}
        <section id="multisig" className="scroll-mt-24 overflow-hidden rounded-[2rem] bg-mg-elevated p-8 text-white md:p-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <span className="inline-flex rounded-full bg-cosmic-glow/15 px-3 py-1 text-sm font-semibold text-cosmic-glow">Planned</span>
              <h2 className="mt-4 font-display text-4xl leading-tight font-bold text-balance md:text-5xl">{wallet.multisig.title}</h2>
              <p className="mt-3 max-w-md text-lg text-white/70 text-pretty">{wallet.multisig.body}</p>
              <ul className="mt-8 space-y-5">
                {wallet.multisig.items.map((m) => (
                  <li key={m.title}>
                    <p className="font-display text-xl font-bold">{m.title}</p>
                    <p className="text-white/65">{m.body}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-md text-sm text-white/50 text-pretty">{wallet.multisig.note}</p>
            </div>
            {/* A quorum, drawn: two people and two agents, three signatures needed */}
            <figure className="self-center">
              <svg viewBox="0 0 420 340" className="w-full" role="img" aria-labelledby="quorum-title">
                <title id="quorum-title">A payment waits for three of four signers: two people and two agents</title>
                <defs>
                  <linearGradient id="q-line" x1="0" x2="1"><stop offset="0" stopColor="#3a7be8" /><stop offset="1" stopColor="#6fb5ff" /></linearGradient>
                </defs>
                {[[70, 70, true], [350, 70, true], [70, 270, true], [350, 270, false]].map(([x, y, signed], i) => (
                  <line key={i} x1={x as number} y1={y as number} x2="210" y2="170" stroke={signed ? "url(#q-line)" : "#3a3d44"} strokeWidth="3" strokeDasharray={signed ? "0" : "6 8"} />
                ))}
                <circle cx="210" cy="170" r="54" fill="#0a0d2a" stroke="#6fb5ff" strokeWidth="2" />
                <text x="210" y="165" textAnchor="middle" fill="#fff" fontFamily="Rajdhani" fontWeight="700" fontSize="30">3 of 4</text>
                <text x="210" y="190" textAnchor="middle" fill="#6fb5ff" fontFamily="Barlow" fontSize="14">signed</text>
                {[[70, 70, "Operator", true, true], [350, 70, "Finance", true, true], [70, 270, "Floyd", false, true], [350, 270, "Tzilo", false, false]].map(([x, y, label, human, signed]) => (
                  <g key={label as string}>
                    <circle cx={x as number} cy={y as number} r="34" fill={signed ? "#1a3680" : "#161721"} stroke={signed ? "#6fb5ff" : "#3a3d44"} strokeWidth="2" />
                    <g transform={`translate(${(x as number) - 12} ${(y as number) - 12})`} fill={signed ? "#fff" : "#636b78"}>
                      {human
                        ? <><circle cx="12" cy="7" r="5" /><path d="M2 23c0-6 4.5-9 10-9s10 3 10 9Z" /></>
                        : <><rect x="3" y="6" width="18" height="15" rx="4" /><rect x="11" y="1" width="2" height="5" /><circle cx="9" cy="13" r="2" fill="#161721" /><circle cx="15" cy="13" r="2" fill="#161721" /></>}
                    </g>
                    <text x={x as number} y={(y as number) + 56} textAnchor="middle" fill={signed ? "#fff" : "#636b78"} fontFamily="Barlow" fontSize="14">{label as string}{signed ? "" : " (waiting)"}</text>
                  </g>
                ))}
              </svg>
              <figcaption className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-white/60">
                <span className="inline-flex items-center gap-1.5"><Users className="size-4" /> People</span>
                <span className="inline-flex items-center gap-1.5"><Bot className="size-4" /> Agents</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <Section id="teams" title="Built for teams with agents on the payroll">
          <div className="grid gap-4 md:grid-cols-3">
            {wallet.audiences.map((a) => (
              <div key={a.title} className="rounded-3xl bg-white p-7 ring-1 ring-black/5">
                <h3 className="font-display text-2xl font-bold">{a.title}</h3>
                <p className="mt-2 text-muted-foreground text-pretty">{a.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <section id="run" className="scroll-mt-24 grid gap-10 rounded-[2rem] bg-cosmic-deep p-8 text-white md:p-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-4xl leading-tight font-bold text-balance md:text-5xl">Run it yourself</h2>
            <p className="mt-3 max-w-md text-white/70 text-pretty">
              It is open source and runs on your own machine: keys stay in a local wallet process that answers only the app. You need Node 22, Docker for the proof server, and wallets made with Midnight's wallet CLI.
            </p>
            <a href={repoHref("notes/WALLET-DAEMON.md")} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 font-semibold text-cosmic-glow hover:underline">
              The full guide <ExternalLink className="size-4" />
            </a>
          </div>
          <ol className="space-y-3">{wallet.run.map((r) => <CopyCommand key={r.label} {...r} />)}</ol>
        </section>

        {/* The reveal: this product is one step in a public build */}
        <section className="space-y-10 border-t border-black/10 pt-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="wl-pixel text-cosmic-mid">CHAPTER 3 OF {SITE.chapters.length}</p>
              <h2 className="mt-3 font-display text-4xl leading-tight font-bold text-balance">This wallet is one chapter of a story</h2>
              <p className="mt-3 text-muted-foreground text-pretty">
                Moddable Wallet was built in public for the {SITE.crewName}, three AI agents working in
                Midnight City, when it turned out that self-hosted agents had no way to hold money and
                Firefox had no Midnight wallet at all. Everything above runs on Midnight's preview network,
                and every finding along the way is written down.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[...wallet.why.slice(0, 2), ...wallet.found.slice(0, 2)].map((item) => (
                <a key={item.href} href={repoHref(item.href)} target="_blank" rel="noopener" className="rounded-2xl bg-white p-4 ring-1 ring-black/5 transition-colors hover:ring-cosmic-mid/40">
                  <span className="text-xs font-semibold text-cosmic-mid">{item.finding}</span>
                  <span className="mt-1 block text-sm text-pretty">{item.title}</span>
                </a>
              ))}
            </div>
          </div>
          <StoryStrip current="wallet" />
          <details className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <summary className="cursor-pointer font-display text-lg font-bold">What the first version signed</summary>
            <ul className="mt-3 divide-y">
              {wallet.transactions.map((tx) => (
                <li key={tx.hash} className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-sm">
                  <span>{tx.what}</span>
                  <a href={EXPLORER.transaction(tx.hash)} target="_blank" rel="noopener" className="text-muted-foreground tabular-nums underline underline-offset-4 hover:text-primary">
                    block {tx.block.toLocaleString()}
                  </a>
                </li>
              ))}
            </ul>
          </details>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <p className="flex items-center gap-2 font-display text-xl font-semibold"><KeyRound className="size-5 text-cosmic-mid" />Next: the tokens and treasury this wallet runs.</p>
            <a href={pageHref("tokens.html")} className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              See the four token types <ArrowRight className="size-4" />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
