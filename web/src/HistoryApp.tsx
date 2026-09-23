import { ArrowRight, ExternalLink } from "lucide-react";
import { ModdableLinks } from "@/components/moddable-links";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SITE, pageHref, repoHref } from "@/lib/site";

/**
 * The whole story on one page: why this exists, the four chapters in order, the notes
 * behind them, the findings worth reading first, and where to find the rest of Moddable.
 */
export function HistoryApp() {
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
            <SiteNav current="history" />
            <Badge className="rounded-full border-white/30 bg-white/10 text-white">Midnight preview</Badge>
          </nav>
          <section className="max-w-3xl space-y-5 pt-12 pb-16">
            <p className="mg-eyebrow inline-flex items-center gap-2 font-pixel text-[11px] tracking-[1.5px] text-cosmic-glow">HISTORY</p>
            <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
              From a private tournament pass to a crew with its own treasury
            </h1>
            <p className="max-w-2xl text-base text-white/78 text-pretty">
              Moddable makes games that are built in the open. Some game mechanics need a player
              to prove something without revealing everything: that they may enter, that a result
              is genuine, that a prize is owed. Midnight is built for that shape of problem. This
              is a timed, documented record of building on it with Midnight's own AI developer
              tools, and of writing down every seam on the way.
            </p>
          </section>
        </div>
      </header>

      <main className="container mx-auto space-y-14 px-4 py-12">
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-semibold">Four chapters</h2>
          <ol className="relative space-y-6 border-l-2 border-primary/30 pl-6">
            {SITE.chapters.map((chapter) => (
              <li key={chapter.key} className="relative">
                <span className="absolute top-1.5 -left-[33px] size-4 rounded-full border-2 border-primary bg-background" />
                <p className="text-sm text-muted-foreground">
                  Chapter {chapter.number} · {chapter.when}
                </p>
                <h3 className="font-display text-2xl font-semibold">{chapter.title}</h3>
                <p className="mt-1 max-w-3xl text-muted-foreground text-pretty">{chapter.summary}</p>
                <p className="mt-2">
                  {chapter.page !== undefined ? (
                    <a href={pageHref(chapter.page)} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                      {chapter.pageLabel} <ArrowRight className="size-4" />
                    </a>
                  ) : (
                    <a href={repoHref(chapter.doc ?? "")} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                      {chapter.docLabel} <ExternalLink className="size-4" />
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-3xl font-semibold">The notes</h2>
            <p className="text-muted-foreground">The code is the smaller half of this project. The notes are the point.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SITE.documents.map((doc) => (
              <a key={doc.href} href={repoHref(doc.href)} target="_blank" rel="noopener" className="group block">
                <Card className="h-full transition-colors group-hover:border-primary/40">
                  <CardContent className="space-y-2 p-5">
                    <p className="flex items-center gap-2 font-display text-lg font-semibold">
                      {doc.title} <ExternalLink className="size-4 text-muted-foreground" />
                    </p>
                    <p className="text-sm text-muted-foreground">{doc.summary}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-3xl font-semibold">Worth reading first</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {SITE.highlights.map((item) => (
              <li key={item.href}>
                <a href={repoHref(item.href)} target="_blank" rel="noopener" className="flex items-start gap-3 rounded-xl border p-4 transition-colors hover:border-primary/40">
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <ModdableLinks />
      </main>

      <SiteFooter />
    </div>
  );
}
