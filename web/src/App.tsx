import { ExternalLink, RefreshCw } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { PrivacyPanel } from "@/components/privacy-panel";
import { StatCard } from "@/components/stat-card";
import { REPO, WriteUp } from "@/components/write-up";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTournament } from "@/hooks/use-tournament";
import { formatTime, shortHex } from "@/lib/format";
import { CONTRACT_ADDRESS, EXPLORER, NETWORK } from "@/lib/tournament";

export function App() {
  const { snapshot, error, loading, refresh } = useTournament();

  return (
    <div className="min-h-screen bg-background">
      <header className="relative isolate overflow-hidden bg-black text-white">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-cosmic-deep via-cosmic-mid to-black" />
        <div className="mg-hero-hex -z-10" />
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap items-center justify-between gap-3 py-5">
            <img src={`${import.meta.env.BASE_URL}img/moddable-logo-white.png`} alt="Moddable" className="h-7 w-auto" />
            <div className="flex items-center gap-2">
              <Badge className="rounded-full border-white/30 bg-white/10 text-white">
                Midnight {NETWORK}
              </Badge>
              <Badge className="rounded-full border-white/30 bg-transparent text-white/80">
                Read-only
              </Badge>
            </div>
          </nav>

          <section className="max-w-3xl space-y-5 pt-12 pb-16">
            <p className="mg-eyebrow inline-flex items-center gap-2 font-pixel text-[11px] tracking-[1.5px] text-cosmic-glow">
              TOURNAMENT PASS
            </p>
            <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
              Prove you hold an entry pass and claim a prize, without revealing
              which pass or who you are
            </h1>
            <p className="max-w-2xl text-base text-white/78 text-pretty">
              This page reads the live contract from Midnight's public indexer
              and decodes it with the compiled contract. No wallet is needed to
              watch.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={EXPLORER.contract(CONTRACT_ADDRESS)}
                target="_blank"
                rel="noopener"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
              >
                Contract {shortHex(CONTRACT_ADDRESS, 6, 6)}
                <ExternalLink className="size-4" />
              </a>
              <a
                href={REPO}
                target="_blank"
                rel="noopener"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Source and notes
                <ExternalLink className="size-4" />
              </a>
              <Button
                variant="outline"
                onClick={refresh}
                disabled={loading}
                className="h-10 border-white/40 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              >
                <RefreshCw className={loading ? "animate-spin" : undefined} />
                Refresh
              </Button>
            </div>
          </section>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-10">
        {error && (
          <p className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
            Could not read the contract: {error}
          </p>
        )}

        {!snapshot && !error && (
          <p className="text-sm text-muted-foreground">Reading the chain…</p>
        )}

        {snapshot && <Dashboard snapshot={snapshot} />}

        <WriteUp />
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-wrap gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted-foreground">
          <a href={REPO} target="_blank" rel="noopener" className="hover:text-foreground">
            Source
          </a>
          <a href={`${REPO}/blob/main/notes/FRICTION-LOG.md`} target="_blank" rel="noopener" className="hover:text-foreground">
            Friction log
          </a>
          <a href={`${REPO}/blob/main/notes/TIMELINE.md`} target="_blank" rel="noopener" className="hover:text-foreground">
            Timeline
          </a>
          <a href={`${REPO}/blob/main/docs/INTEGRATION.md`} target="_blank" rel="noopener" className="hover:text-foreground">
            Integration docs
          </a>
        </div>
      </footer>
    </div>
  );
}

function Dashboard({
  snapshot,
}: {
  snapshot: NonNullable<ReturnType<typeof useTournament>["snapshot"]>;
}) {
  const funded = snapshot.prizePool + snapshot.claimCount * snapshot.prizePerClaim;
  const remainingPercent =
    funded === 0n ? 0 : Number((snapshot.prizePool * 100n) / funded);
  const claimsLeft =
    snapshot.prizePerClaim === 0n ? 0n : snapshot.prizePool / snapshot.prizePerClaim;

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Prize pool"
          value={snapshot.prizePool.toString()}
          detail={
            <div className="space-y-1.5 pt-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${remainingPercent}%` }}
                />
              </div>
              <span>
                {remainingPercent}% of {funded.toString()} funded remains
              </span>
            </div>
          }
        />
        <StatCard
          label="Prize per claim"
          value={snapshot.prizePerClaim.toString()}
          detail={`Enough for ${claimsLeft.toString()} more claims`}
        />
        <StatCard
          label="Passes issued"
          value={snapshot.passCount.toString()}
          detail="Stored only as commitments"
        />
        <StatCard
          label="Prizes claimed"
          value={snapshot.claimCount.toString()}
          detail="Each spends one nullifier"
        />
      </section>

      <PrivacyPanel snapshot={snapshot} />

      <ActivityFeed activity={snapshot.activity} />

      <p className="text-xs text-muted-foreground">
        {snapshot.stateBytes.toLocaleString()} bytes of contract state decoded at{" "}
        {formatTime(snapshot.fetchedAt)}. Refreshes every 15 seconds.
      </p>
    </>
  );
}
