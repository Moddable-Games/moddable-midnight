/**
 * Links between the three pages of the story: the tournament pass contract, the crew
 * treasury (MCC and Agent Smart Contracts), and the Midnight City crew itself.
 */
const PAGES = [
  { key: "pass", label: "Tournament pass", href: "" },
  { key: "treasury", label: "Crew treasury", href: "treasury.html" },
  { key: "crew", label: "The crew", href: "city.html" },
] as const;

export function SiteNav({ current }: { current: (typeof PAGES)[number]["key"] }) {
  return (
    <nav aria-label="The Moddable on Midnight pages" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
      {PAGES.map((page) => (
        <a
          key={page.key}
          href={`${import.meta.env.BASE_URL}${page.href}`}
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
      <a
        href="https://github.com/Moddable-Games/moddable-midnight"
        target="_blank"
        rel="noopener"
        className="text-white/70 transition-colors hover:text-white"
      >
        Source
      </a>
    </nav>
  );
}
