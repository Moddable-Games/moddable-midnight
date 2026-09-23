import { type PageKey, SITE, pageHref } from "@/lib/site";

/** The three links every page shares: Treasury (home), Crew and History, then the source. */
export function SiteNav({ current }: { current?: PageKey }) {
  return (
    <nav aria-label={SITE.name} className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
      {SITE.nav.map((page) => (
        <a
          key={page.key}
          href={pageHref(page.href)}
          aria-current={page.key === current ? "page" : undefined}
          className={
            page.key === current
              ? "border-b-2 border-cosmic-glow font-semibold text-white"
              : "text-white/70 transition-colors hover:text-white"
          }
        >
          {page.label}
        </a>
      ))}
      <a href={SITE.repo} target="_blank" rel="noopener" className="text-white/70 transition-colors hover:text-white">
        Source
      </a>
    </nav>
  );
}
