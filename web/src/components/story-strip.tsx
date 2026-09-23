import { type PageKey, SITE, pageHref, repoHref } from "@/lib/site";

/**
 * Where this page sits in the story: the four chapters in order, the current one marked.
 * Each chapter links to its live page, or to its notes when it has no page of its own.
 */
export function StoryStrip({ current }: { current?: PageKey }) {
  return (
    <section aria-label="The story so far" className="rounded-2xl border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Part of one story, in four chapters
        </p>
        <a href={pageHref("history.html")} className="text-sm underline underline-offset-4 hover:text-primary">
          Read the whole history
        </a>
      </div>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {SITE.chapters.map((chapter) => {
          const here = chapter.key === current;
          const external = chapter.page === undefined;
          const href = external ? repoHref(chapter.doc ?? "") : pageHref(chapter.page ?? "");
          return (
            <li key={chapter.key}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
                aria-current={here ? "page" : undefined}
                className={`block h-full rounded-xl border p-3 transition-colors ${
                  here ? "border-primary bg-primary/5" : "hover:border-primary/40"
                }`}
              >
                <span className="text-xs text-muted-foreground">
                  {chapter.number}. {chapter.when}
                </span>
                <span className="block font-semibold">{chapter.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
