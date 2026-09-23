import { CheckCircle2, ExternalLink, RefreshCw, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { StoryStrip } from "@/components/story-strip";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCrewTreasury } from "@/hooks/use-crew-treasury";
import {
  CONTRACT_SOURCE,
  CREW_TREASURY,
  type CrewSnapshot,
  IPFS_GATEWAY,
  type TokenDocument,
} from "@/lib/crew-treasury";
import { formatTime, shortHex } from "@/lib/format";
import { EXPLORER, NETWORK, ONE_AM_EXPLORER, SUBSCAN } from "@/lib/tournament";

const lines = (from: number, to: number) => `${CONTRACT_SOURCE}#L${from}-L${to}`;

function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-primary">
      {children}
    </a>
  );
}

export function TreasuryApp() {
  const { snapshot, error, loading, refresh } = useCrewTreasury();

  return (
    <div className="min-h-screen bg-background">
      <header className="relative isolate overflow-hidden bg-black text-white">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-cosmic-deep via-cosmic-mid to-black" />
        <div className="mg-hero-hex -z-10" />
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap items-center justify-between gap-3 py-5">
            <a href={import.meta.env.BASE_URL} aria-label="Home">
              <img src={`${import.meta.env.BASE_URL}img/moddable-logo-white.png`} alt="Moddable" className="h-7 w-auto" />
            </a>
            <SiteNav current="treasury" />
            <div className="flex items-center gap-2">
              <Badge className="rounded-full border-white/30 bg-white/10 text-white">Midnight {NETWORK}</Badge>
              <Badge className="rounded-full border-white/30 bg-transparent text-white/80">Verify it yourself</Badge>
            </div>
          </nav>

          <section className="max-w-3xl space-y-5 pt-12 pb-16">
            <p className="mg-eyebrow inline-flex items-center gap-2 font-pixel text-[11px] tracking-[1.5px] text-cosmic-glow">
              CREW TREASURY
            </p>
            <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
              Midnight City Credits and Agent Smart Contracts, checked against the chain
            </h1>
            <p className="max-w-2xl text-base text-white/78 text-pretty">
              This page trusts nothing Moddable runs. It reads the contract from Midnight's public
              indexer, decodes it with the compiled contract, re-derives every token type in your
              browser, and verifies each metadata file against a digest stored on-chain.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={EXPLORER.contract(CREW_TREASURY)}
                target="_blank"
                rel="noopener"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
              >
                Contract {shortHex(CREW_TREASURY, 6, 6)}
                <ExternalLink className="size-4" />
              </a>
              <a
                href={CONTRACT_SOURCE}
                target="_blank"
                rel="noopener"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contract source
                <ExternalLink className="size-4" />
              </a>
              <Button
                variant="outline"
                onClick={refresh}
                disabled={loading}
                className="h-10 border-white/40 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              >
                <RefreshCw className={loading ? "animate-spin" : undefined} />
                Check again
              </Button>
            </div>
            <p className="text-sm text-white/70">
              Also on{" "}
              <a href={SUBSCAN.contract(CREW_TREASURY)} target="_blank" rel="noopener" className="text-white underline underline-offset-4 hover:text-cosmic-glow">
                Subscan
              </a>{" "}
              and the{" "}
              <a href={ONE_AM_EXPLORER.contract(CREW_TREASURY)} target="_blank" rel="noopener" className="text-white underline underline-offset-4 hover:text-cosmic-glow">
                1AM explorer
              </a>
              . The crew's first contract, a{" "}
              <a href={`${import.meta.env.BASE_URL}tournament.html`} className="text-white underline underline-offset-4 hover:text-cosmic-glow">
                private tournament pass
              </a>
              , is still live too.
            </p>
          </section>
        </div>
      </header>

      <main className="container mx-auto space-y-10 px-4 py-10">
        <StoryStrip current="treasury" />
        {error && (
          <p className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
            Could not read the contract: {error}
          </p>
        )}
        {!snapshot && !error && <p className="text-sm text-muted-foreground">Reading the chain and checking the files…</p>}
        {snapshot && <Report snapshot={snapshot} />}
        <OnChainOffChain />
      </main>

      <SiteFooter />
    </div>
  );
}

function Checks({ snapshot }: { snapshot: CrewSnapshot }) {
  const passed = snapshot.checks.filter((c) => c.ok).length;
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-semibold">
        {passed} of {snapshot.checks.length} checks pass
      </h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {snapshot.checks.map((check) => (
          <li key={check.label} className="flex gap-3 rounded-lg border p-4">
            {check.ok
              ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mg-green" aria-label="passes" />
              : <XCircle className="mt-0.5 size-5 shrink-0 text-mg-red" aria-label="fails" />}
            <div className="space-y-1">
              <p className="font-semibold">{check.label}</p>
              <p className="text-sm break-words text-muted-foreground">{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Report({ snapshot }: { snapshot: CrewSnapshot }) {
  const { mcc, asc } = snapshot;
  return (
    <>
      <Checks snapshot={snapshot} />

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Midnight City Credits (MCC)</h2>
        <p className="max-w-3xl text-muted-foreground text-pretty">
          An unshielded token, so its whole supply is public. Only the organiser can mint it{" "}
          (<Out href={lines(136, 147)}>mintTreasury</Out>), always into the contract itself, and it
          leaves only through a <Out href={lines(208, 230)}>draw</Out>: one per agent mandate per
          period, paid to an address that anyone can see.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Minted" value={mcc.minted.toLocaleString()} detail="treasuryMinted, on the ledger" />
          <StatCard label="Held by the contract" value={mcc.held.toLocaleString()} detail="the contract's MCC balance, per the indexer" />
          <StatCard label="Paid out" value={mcc.paidOut.toLocaleString()} detail={`${mcc.payouts.length} draws, listed below`} />
          <StatCard
            label="Per draw"
            value={mcc.drawAmount.toLocaleString()}
            detail={`period ${mcc.currentPeriod}${mcc.paused ? ", draws paused" : ""}`}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {mcc.document && <TokenCard doc={mcc.document} tokenType={mcc.tokenType} />}
          <Card>
            <CardContent className="space-y-3 p-5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Where every paid-out MCC went</p>
              <ul className="divide-y text-sm">
                {mcc.payouts.map((p) => (
                  <li key={p.hash} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                    <span>
                      <span className="font-semibold">{p.name ?? "Unknown address"}</span>{" "}
                      <code className="text-xs text-muted-foreground">{shortHex(p.owner, 18, 6)}</code>
                    </span>
                    <span className="tabular-nums">
                      {p.amount.toLocaleString()} MCC ·{" "}
                      <Out href={EXPLORER.transaction(p.hash)}>block {p.blockHeight.toLocaleString()}</Out>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Draws reveal the payee, never which mandate drew: {mcc.spentDraws} one-time draw
                tokens (nullifiers) are recorded, none linkable to an agent.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Agent Smart Contracts</h2>
        <p className="max-w-3xl text-muted-foreground text-pretty">
          One shielded NFT per appointed agent. Shielded means nobody but the holder can see
          which wallet holds it or whether it has moved, so the chain cannot show you holders.
          What it does prove: each NFT's token type is derived from a mandate the contract
          issued, the contract mints exactly one of each and refuses to issue the same mandate
          twice (<Out href={lines(153, 168)}>issueMandate</Out>), and {asc.mandateCount.toString()}{" "}
          mandates have been issued.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {asc.mandates.map((m) => (
            <div key={m.tokenType} className="space-y-2">
              {m.document
                ? <TokenCard doc={m.document} tokenType={m.tokenType} />
                : <p className="text-sm text-destructive">No metadata found for {shortHex(m.tokenType)}</p>}
              <p className="px-1 text-xs break-words text-muted-foreground">
                Mandate commitment {shortHex(m.commitment, 10, 6)} on the ledger derives this token type.
              </p>
            </div>
          ))}
        </div>
      </section>

      <Activity snapshot={snapshot} />

      <p className="text-xs text-muted-foreground">
        Checked at {formatTime(snapshot.fetchedAt)}. Checks again every 30 seconds.
      </p>
    </>
  );
}

function TokenCard({ doc, tokenType }: { doc: TokenDocument; tokenType: string }) {
  return (
    <Card>
      <CardContent className="flex gap-4 p-5">
        {doc.imageUrl
          ? <img src={doc.imageUrl} alt="" className="size-20 shrink-0 rounded-lg" />
          : <div className="size-20 shrink-0 rounded-lg bg-muted" />}
        <div className="min-w-0 space-y-1.5">
          <p className="font-semibold">
            {doc.name} <span className="text-xs font-semibold tracking-wide text-muted-foreground">{doc.ticker}</span>
          </p>
          <p className={`flex items-center gap-1.5 text-sm ${doc.verified ? "text-mg-green" : "text-mg-red"}`}>
            {doc.verified ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
            {doc.verified ? "Metadata verified" : "Metadata does not match"}
          </p>
          <p className="text-xs text-muted-foreground">{doc.how}.</p>
          <p className="text-xs break-all text-muted-foreground">Token type {tokenType}</p>
          <p className="flex flex-wrap gap-x-3 text-xs">
            <Out href={doc.sourceUrl}>document on GitHub</Out>
            <Out href={IPFS_GATEWAY(doc.cid)}>document on IPFS (once pinned)</Out>
            <Out href={IPFS_GATEWAY(doc.imageCid)}>image on IPFS (once pinned)</Out>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const CIRCUIT_LABELS: Record<string, string> = {
  deploy: "Contract deployed by the organiser",
  mintTreasury: "MCC minted into the contract",
  issueMandate: "Agent appointed, Agent Smart Contract minted",
  openPeriod: "Spending period opened",
  draw: "Agent drew its allowance",
  setMetadata: "Metadata digests anchored",
  setDrawAmount: "Draw amount changed",
  setPaused: "Draws paused or resumed",
};

function Activity({ snapshot }: { snapshot: CrewSnapshot }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-semibold">Every transaction on the contract</h2>
      <ul className="divide-y rounded-lg border">
        {snapshot.actions.map((a) => (
          <li key={a.hash} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2.5 text-sm">
            <span>
              {CIRCUIT_LABELS[a.kind] ?? a.kind}
              {a.status !== "SUCCESS" && (
                <span className="ml-2 text-xs font-semibold text-mg-red">
                  {a.status === "PARTIAL_SUCCESS" ? "payout refused by the ledger, nothing moved" : a.status.toLowerCase()}
                </span>
              )}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {formatTime(a.timestamp)} ·{" "}
              <Out href={EXPLORER.transaction(a.hash)}>block {a.blockHeight.toLocaleString()}</Out>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const PLACES: [string, string, string][] = [
  ["MCC supply minted, draw amount, current period, pause flag", "On-chain, public", "Read from the contract's ledger"],
  ["MCC held by the contract, and every payout with its recipient", "On-chain, public", "Read from the indexer's balances and transaction outputs"],
  ["MCC and each Agent Smart Contract's token type", "On-chain, derived", "Recomputed in this page from the contract address and the ledger"],
  ["Which agent holds which Agent Smart Contract, and any later transfer", "On-chain, shielded", "Private to the holder; not visible here or in any explorer"],
  ["Which agent made which draw", "Never revealed", "Draws publish a one-time nullifier and the payee only"],
  ["Two metadata digests (SHA-256)", "On-chain, public", "treasuryMetadata and mandateMetadata on the ledger"],
  ["Metadata documents (name, ticker, description, image link)", "Off-chain", "In the repository and addressed by IPFS CID; checked against the digests"],
  ["Artwork", "Off-chain", "In the repository and addressed by IPFS CID; each image checked against its CID"],
];

function OnChainOffChain() {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-semibold">What is on-chain, and what is checked against it</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-2.5">What</th>
              <th className="px-4 py-2.5">Where</th>
              <th className="px-4 py-2.5">How this page gets it</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {PLACES.map(([what, where, how]) => (
              <tr key={what}>
                <td className="px-4 py-2.5">{what}</td>
                <td className="px-4 py-2.5 font-semibold whitespace-nowrap">{where}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{how}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="max-w-3xl text-sm text-muted-foreground text-pretty">
        Midnight has no on-chain token metadata, and its metadata service is specified but not
        yet running on preview. So the documents follow Midnight's token metadata specification
        and live off-chain, while the contract stores their SHA-256 so nobody, including
        Moddable, can change them unnoticed. This page fetches them from GitHub. The IPFS links
        will resolve once the files are pinned; the CIDs are fixed by the file contents, so
        pinning changes nothing on this page.
      </p>
    </section>
  );
}
