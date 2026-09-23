// The crew page: each agent live from Midnight City's public observer API, and each agent's
// real Midnight preview wallet live from Midnight's public indexer. No keys, no sign-in.
import { watchAddress } from "./indexer.js";
import { renderFrame } from "./site-frame.js";

const OBS = "https://midnight.city/observer";

// Wallets as published in notes/midnight-city/AGENT-WALLETS.md.
const CREW = [
  { id: "user-agent-u4gfp92xeor3g2a", name: "Floyd", cls: "agent-floyd", short: "hacker · treasury", role: "hacker · treasury & social", img: "img/floyd.png",
    address: "mn_addr_preview1wg2ef7spxl8wfahg890z5q4kuhtc234ks7rx65djg3dc9f5ltx4sr69gyw",
    shielded: "mn_shield-addr_preview1rzvaswpzchksp7rnnllwdv337vu2v0gym0u6wpx3ygk8n5wsepsmk2ww6gqeunqxjwpyulpgnf2wh5r5ckqltxrjh4xv8jtuph56hhg0re52k" },
  { id: "user-agent-5wzs7d9q4cdz5gi", name: "Tzilo", cls: "agent-tzilo", short: "miner · contracts", role: "miner · smithing & contracts", img: "img/tzilo.png",
    address: "mn_addr_preview12t3k3nkssja6ksfjqkkx5sfdzue9j33fpztgsheyszrpu63yq77s0epzru",
    shielded: "mn_shield-addr_preview1z7lak7tmldfmwgtxtwwhsgev5rk4r267csq4xmqjj8rkvyqhn6wu5sz25zwt3r3yluulptmhf55v4q9xf9c6newf2pndquvchjpr4yszxtflg" },
  { id: "user-agent-oyhuxtu984deja8", name: "FooFoo", cls: "agent-foofoo", short: "lumberjack · supply", role: "lumberjack · supply & crafting", img: "img/foofoo.png",
    address: "mn_addr_preview1qkehtq54t8damevjy953sdua2qtad6adyer4cersc3ql9sw8envsg7kw3g",
    shielded: "mn_shield-addr_preview1avnp3e548s4wsg3ylqzjfnsruklwclrr77mrth806aj6hfukuzpq9yj6g4nfzc6aael3k88lzt2dk8cxur3zl6fv9clfangfsua5n0cv7wyw7" },
].map((c) => ({ ...c, url: `https://www.midnight.city/agents/${c.id}` }));

const el = (id) => document.getElementById(id);
const fmt = (n) => Number(n || 0).toLocaleString();
const nice = (s) => String(s || "—").replace(/_/g, " ").replace(/-/g, " ");
const night = (raw) => (raw === undefined ? "…" : (Number(raw / 1000n) / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 }));

el("lineup").innerHTML = CREW.map((c) => `
  <a class="toon ${c.cls}" href="${c.url}" target="_blank" rel="noopener">
    <span class="edge"></span>
    <img class="bob" src="${c.img}" alt="${c.name}">
    <div class="nm">${c.name}</div><div class="rl">${c.short}</div>
    <div class="follow">follow in the city</div>
  </a>`).join("");

// ---------------------------------------------------------------------------------------
// Wallets, live from the indexer
// ---------------------------------------------------------------------------------------

const balances = new Map(); // agent name -> latest indexer update

function walletHtml(c) {
  const b = balances.get(c.name);
  const dust = b ? (b.nightForDust > 0n ? `${night(b.nightForDust)} NIGHT generating` : "not generating") : "…";
  return `
    <div class="t">MIDNIGHT WALLET · PREVIEW</div>
    <div class="bal">
      <div><div class="v">${b ? night(b.night) : "…"}</div><div class="k">NIGHT</div></div>
      <div><div class="v">${b ? fmt(b.mcc) : "…"}</div><div class="k">MCC</div></div>
      <div><div class="v">${b ? b.transactions : "…"}</div><div class="k">transactions</div></div>
    </div>
    <p class="addr"><b>Address</b> ${c.address}<button type="button" data-copy="${c.address}">copy</button></p>
    <p class="addr"><b>Shielded</b> ${c.shielded}<button type="button" data-copy="${c.shielded}">copy</button></p>
    <p class="note">DUST: ${dust}. The DUST balance itself is private to the wallet; the indexer shows which NIGHT produces it.
      MCC comes from the <a href="treasury.html">crew treasury contract</a>.</p>`;
}

for (const c of CREW) {
  watchAddress(c.address, (update) => {
    balances.set(c.name, update);
    const box = el(`wallet-${c.name}`);
    if (box) box.innerHTML = walletHtml(c);
  });
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-copy]");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.textContent = "copied";
  } catch {
    button.textContent = "copy failed";
  }
  setTimeout(() => { button.textContent = "copy"; }, 2000);
});

// ---------------------------------------------------------------------------------------
// Agents, live from the observer
// ---------------------------------------------------------------------------------------

function card(c, a) {
  if (!a) {
    return `<div class="card ${c.cls}"><div class="band"><img class="por" src="${c.img}" alt=""><div><h3>${c.name}</h3><div class="role">${c.role}</div></div></div>
      <div class="err">Off the grid right now.</div><div class="wallet" id="wallet-${c.name}">${walletHtml(c)}</div></div>`;
  }
  const crystal = a.inventory?.crystal || 0;
  const on = a.presence === "online" || a.status !== "offline";
  const hp = a.vitals?.health ?? 0;
  const hpMax = a.vitals?.maxHealth || 100;
  const done = (a.completedContractIds || []).length;
  const doing = nice(a.activeAction?.activity || a.status || "idle");
  const skills = Object.entries(a.skills || {}).filter(([, v]) => (v.xp || 0) > 0).sort((x, y) => y[1].level - x[1].level);
  const chips = skills.map(([k, v]) => `<span>${k} <b>L${v.level}</b></span>`).join("") || '<span class="none">no XP yet</span>';
  return `<div class="card ${c.cls}">
    <div class="band">
      <img class="por" src="${c.img}" alt="${c.name}">
      <div><h3>${c.name}</h3><div class="role">${c.role}</div></div>
      <div class="status ${on ? "" : "off"}">${a.statusEmoji || ""} ${on ? "at work" : "resting"}</div>
    </div>
    <div class="rows">
      <div class="row"><span class="lab">Doing now</span><span class="num">${doing}</span></div>
      <div class="row"><span class="lab">Trade</span><span class="num">${a.profession}, rank ${a.professionRank ?? 1}</span></div>
      <div class="row"><span class="lab">Crystal</span><span class="num crystal">${fmt(crystal)}</span></div>
      <div class="row"><span class="lab">Contracts done</span><span class="num">${done}</span></div>
      <div class="row"><span class="lab">Fed</span><span class="num">${a.hunger?.state || "normal"}</span></div>
      <div class="row"><span class="lab">Health</span><span class="num">${hp} / ${hpMax}</span></div>
    </div>
    <progress class="hp" max="${hpMax}" value="${hp}" aria-label="health"></progress>
    <div class="rows tight"><div class="row"><span class="lab">Whereabouts</span><span class="num">${nice(a.position?.spaceId)}</span></div></div>
    <div class="sk">${chips}</div>
    <div class="wallet" id="wallet-${c.name}">${walletHtml(c)}</div>
    <a class="watch" href="${c.url}" target="_blank" rel="noopener">Follow ${c.name} in Midnight City</a>
  </div>`;
}

async function refresh() {
  try {
    const response = await fetch(`${OBS}/api/spectator/bootstrap`, { cache: "no-store" });
    if (!response.ok) throw new Error(`observer ${response.status}`);
    const data = await response.json();
    const byId = Object.fromEntries(data.dynamicWorld.agents.map((a) => [a.id, a]));
    const agents = CREW.map((c) => byId[c.id]);
    el("crew").innerHTML = CREW.map((c, i) => card(c, agents[i])).join("");

    const present = agents.filter(Boolean);
    el("treasury").textContent = fmt(present.reduce((sum, a) => sum + (a.inventory?.crystal || 0), 0));
    el("online").innerHTML = `${present.filter((a) => a.presence === "online" || a.status !== "offline").length} <small>/ ${CREW.length}</small>`;
    el("skills").textContent = present.reduce((n, a) => n + Object.values(a.skills || {}).filter((v) => (v.xp || 0) > 0).length, 0);
    el("contracts").textContent = present.reduce((n, a) => n + (a.completedContractIds || []).length, 0);
    const time = new Date().toLocaleTimeString();
    el("stamp").textContent = `last read ${time}`;
    el("livelabel").textContent = `live · updated ${time}`;
  } catch (error) {
    el("crew").innerHTML = `<div class="card"><div class="err">Could not reach the city: ${error.message}. It refreshes on its own; try again shortly.</div></div>`;
    el("livelabel").textContent = "reconnecting…";
  }
}

renderFrame("crew");
refresh();
setInterval(refresh, 20_000);
