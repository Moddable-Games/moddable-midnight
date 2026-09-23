// The frame every page shares (navigation, the story's chapters, the footer), for the static
// crew page. The React pages render the same data/site.json with their own components, so a
// link or chapter changed there changes everywhere.

const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const out = (href, label) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;

export async function renderFrame(current) {
  let site;
  try {
    site = await (await fetch("data/site.json", { cache: "no-cache" })).json();
  } catch {
    return; // the static fallback links in the page stay in place
  }
  const repo = (path) => `${site.repo}/blob/main/${path}`;
  const page = (href) => href || "./";

  const nav = document.getElementById("sitenav");
  if (nav) {
    nav.innerHTML = site.nav
      .map((p) => `<a href="${esc(page(p.href))}"${p.key === current ? ' aria-current="page"' : ""}>${esc(p.label)}</a>`)
      .join("") + out(site.repo, "Source");
  }

  const story = document.getElementById("story");
  if (story) {
    story.innerHTML = `
      <div class="story-head"><span>PART OF ONE STORY, IN FOUR CHAPTERS</span><a href="history.html">Read the whole history</a></div>
      <ol>${site.chapters.map((c) => {
        const href = c.page !== undefined ? page(c.page) : repo(c.doc);
        const target = c.page !== undefined ? "" : ' target="_blank" rel="noopener"';
        return `<li><a href="${esc(href)}"${target}${c.key === current ? ' aria-current="page"' : ""}>
          <span class="when">${c.number}. ${esc(c.when)}</span><span class="title">${esc(c.title)}</span></a></li>`;
      }).join("")}</ol>`;
  }

  const footer = document.getElementById("sitefooter");
  if (footer) {
    const column = (title, links) => `<div><div class="t">${esc(title)}</div>${links.join("")}</div>`;
    footer.innerHTML = `
      <div class="cols">
        ${column("THIS DEMO", [
          ...site.nav.map((p) => `<a href="${esc(page(p.href))}">${esc(p.label)}</a>`),
          `<a href="tournament.html">Tournament pass (chapter 1)</a>`,
        ])}
        ${column("THE NOTES", site.documents.slice(0, 5).map((d) => out(repo(d.href), d.title)))}
        ${column("MODDABLE", site.moddable.map((m) => out(m.href, m.title)))}
        ${column("PUBLIC DATA", [...site.sources.map((s) => out(s.href, s.title)), out(site.repo, "Source on GitHub")])}
      </div>
      <div class="base">
        <span>${esc(site.name)}: the ${esc(site.crewName)} (${esc(site.crewShort)}), its wallets and its treasury, on the Midnight preview network.</span>
        <span>v${esc(site.version)} · public data only, no keys</span>
      </div>`;
  }
}
