import site from "../../public/data/site.json";

/**
 * Everything the pages share: navigation, the story's chapters, the documents, links out to
 * Moddable, and the version. One file (public/data/site.json) feeds the React pages and the
 * static crew page alike, so they cannot drift apart.
 */
export const SITE = site;
export type Chapter = (typeof site.chapters)[number];
export type PageKey = (typeof site.nav)[number]["key"] | "tournament";

/** A page of this site, or an outside address (a chapter can live on its own site). */
export const isExternal = (href: string) => /^https?:\/\//.test(href);
export const pageHref = (href: string) => (isExternal(href) ? href : `${import.meta.env.BASE_URL}${href}`);
/** Outside links open in a new tab, as every external link on the site does. */
export const linkProps = (href: string) =>
  isExternal(href) ? { href, target: "_blank", rel: "noopener" } : { href: pageHref(href) };
/** The chapter count in words, for copy like "in six chapters". */
const COUNT_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export const chapterCount = COUNT_WORDS[site.chapters.length] ?? String(site.chapters.length);
export const ChapterCount = chapterCount.charAt(0).toUpperCase() + chapterCount.slice(1);
export const repoHref = (path: string) => `${site.repo}/blob/main/${path}`;
