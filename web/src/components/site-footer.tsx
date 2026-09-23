import { SITE, pageHref, repoHref } from "@/lib/site";

const linkClass = "text-muted-foreground transition-colors hover:text-foreground";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
      <ul className="space-y-1.5 text-sm">{children}</ul>
    </div>
  );
}

/** The footer every page shares, the static crew page included (it renders the same data). */
export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto grid gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <Column title="This demo">
          {SITE.nav.map((page) => (
            <li key={page.key}><a href={pageHref(page.href)} className={linkClass}>{page.label}</a></li>
          ))}
          <li><a href={pageHref("tournament.html")} className={linkClass}>Tournament pass (chapter 1)</a></li>
        </Column>
        <Column title="The notes">
          {SITE.documents.slice(0, 5).map((doc) => (
            <li key={doc.href}><a href={repoHref(doc.href)} target="_blank" rel="noopener" className={linkClass}>{doc.title}</a></li>
          ))}
        </Column>
        <Column title="Moddable">
          {SITE.moddable.map((link) => (
            <li key={link.href}><a href={link.href} target="_blank" rel="noopener" className={linkClass}>{link.title}</a></li>
          ))}
        </Column>
        <Column title="Public data">
          {SITE.sources.map((link) => (
            <li key={link.href}><a href={link.href} target="_blank" rel="noopener" className={linkClass}>{link.title}</a></li>
          ))}
          <li><a href={SITE.repo} target="_blank" rel="noopener" className={linkClass}>Source on GitHub</a></li>
        </Column>
      </div>
      <div className="container mx-auto flex flex-wrap justify-between gap-2 border-t px-4 py-4 text-xs text-muted-foreground">
        <span>
          {SITE.name}: the {SITE.crewName} ({SITE.crewShort}), its wallets and its treasury, on the Midnight preview network.
        </span>
        <span>v{SITE.version} · public data only, no keys</span>
      </div>
    </footer>
  );
}
