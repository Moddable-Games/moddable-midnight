import site from "../../public/data/site.json";

/**
 * Everything the pages share: navigation, the story's chapters, the documents, links out to
 * Moddable, and the version. One file (public/data/site.json) feeds the React pages and the
 * static crew page alike, so they cannot drift apart.
 */
export const SITE = site;
export type Chapter = (typeof site.chapters)[number];
export type PageKey = (typeof site.nav)[number]["key"] | "tournament";

export const pageHref = (href: string) => `${import.meta.env.BASE_URL}${href}`;
export const repoHref = (path: string) => `${site.repo}/blob/main/${path}`;
