// Browser wallet for Midnight, driving the local wallet daemon (wallet-daemon/server.mjs).
// Balances come live from the public indexer even when the daemon is down; the daemon adds
// DUST, sending, and the approval queue.
import { watchAddress, NIGHT_TOKEN } from "./indexer.js";

const DAEMON = "http://127.0.0.1:9900";
const EXPLORER_TX = "https://preview.midnightexplorer.com/transactions/";

// Known wallets, so the page can show live balances before the daemon answers.
const ROSTER = [
  { wallet: "moddable-preview", name: "Organiser", kind: "human", role: "Treasury. Deploys the contracts and funds the crew.",
    address: "mn_addr_preview1zh5vgfsj5v0d85xps8lxjv8wata8cfwafc54tkgy8umsgms35c3s4gsema",
    shieldedAddress: "mn_shield-addr_preview1522fn0556q4xvq8x7z5p6hvhxwt42m2lywuxgyl5ewnqcvpeh72tnrq302s64v9gj5tw3a6fzxc7zh2qnsxpc0qc3enklz7l94tvwfqmrceev" },
  { wallet: "agent-floyd", name: "Floyd", kind: "agent", role: "Hacker, crew boss in Midnight City.", agentId: "user-agent-u4gfp92xeor3g2a",
    address: "mn_addr_preview1wg2ef7spxl8wfahg890z5q4kuhtc234ks7rx65djg3dc9f5ltx4sr69gyw",
    shieldedAddress: "mn_shield-addr_preview1rzvaswpzchksp7rnnllwdv337vu2v0gym0u6wpx3ygk8n5wsepsmk2ww6gqeunqxjwpyulpgnf2wh5r5ckqltxrjh4xv8jtuph56hhg0re52k" },
  { wallet: "agent-tzilo", name: "Tzilo", kind: "agent", role: "Miner in Midnight City.", agentId: "user-agent-5wzs7d9q4cdz5gi",
    address: "mn_addr_preview12t3k3nkssja6ksfjqkkx5sfdzue9j33fpztgsheyszrpu63yq77s0epzru",
    shieldedAddress: "mn_shield-addr_preview1z7lak7tmldfmwgtxtwwhsgev5rk4r267csq4xmqjj8rkvyqhn6wu5sz25zwt3r3yluulptmhf55v4q9xf9c6newf2pndquvchjpr4yszxtflg" },
  { wallet: "agent-foofoo", name: "FooFoo", kind: "agent", role: "Lumberjack in Midnight City.", agentId: "user-agent-oyhuxtu984deja8",
    address: "mn_addr_preview1qkehtq54t8damevjy953sdua2qtad6adyer4cersc3ql9sw8envsg7kw3g",
    shieldedAddress: "mn_shield-addr_preview1avnp3e548s4wsg3ylqzjfnsruklwclrr77mrth806aj6hfukuzpq9yj6g4nfzc6aael3k88lzt2dk8cxur3zl6fv9clfangfsua5n0cv7wyw7" },
];

// Tokens minted by our own contracts. Midnight has no token metadata service yet (friction
// log finding 39), so names and descriptions for our tokens live here.
const KNOWN_TOKENS = {
  // Crew treasury, contract e412fa7f…c4b4 (contracts/crew_treasury.compact)
  "eed99c9a56f4f3d719ff295eab2fcd59713233c71d34437284347c992b54a366": { name: "Midnight City Credits (MCC)", kind: "fungible" },
  "7ced7bf39622030ed6e55290f346e2277371eff6d44fdba47069786a4b3f2293": { name: "Agent Smart Contract: Floyd", kind: "NFT" },
  "9d454f805cbc15148268dcc49d4e2d386484010653f7f09910d331ff524c3b3d": { name: "Agent Smart Contract: Tzilo", kind: "NFT" },
  "66deba03d895468b3388866f511e7622e2c7af4d722e46aedf6958aa267ba92b": { name: "Agent Smart Contract: FooFoo", kind: "NFT" },
  // Mint spike, contract 9535b022…be36 (spikes/mint_spike.compact), before v2
  "f3f4d88611d5af314fb32ef0e380fed5807aaac806362c05fc7f79bcf1b8b91d": { name: "Spike treasury token", kind: "fungible" },
  "7dab3653f25ff22bc04439dcd9aeea313432886baba621fcfa1bd8e33512deb0": { name: "Spike mandate", kind: "NFT" },
};

const chain = new Map();   // wallet -> { night, transactions, caughtUp } from the indexer
let daemon = null;         // latest /api/wallets, or null if the daemon is not running
let requests = [];
let metadata = {};         // token type -> metadata the daemon checked against the contract
let metadataContract = "";
const drafts = new Map();  // wallet -> { to, amount } so polling does not wipe what you typed
const seen = new Map();    // request id -> last status, to log changes once

const el = (id) => document.getElementById(id);

function log(message, kind = "") {
  const li = document.createElement("li");
  if (kind) li.className = kind;
  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString();
  li.append(time, document.createTextNode(message));
  el("log").prepend(li);
  while (el("log").children.length > 100) el("log").lastElementChild.remove();
}

function night(raw) {
  if (raw === undefined || raw === null) return "—";
  const star = BigInt(raw);
  const whole = star / 1000000n;
  const fraction = (star % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : `${whole}`;
}

function dust(raw) {
  if (!raw) return "—";
  return (Number(BigInt(raw) / 1000000000n) / 1e6).toFixed(3);
}

const byAddress = (address) => ROSTER.find((r) => r.address === address);
const nameOf = (wallet) => ROSTER.find((r) => r.wallet === wallet)?.name ?? wallet;

async function api(path, options = {}) {
  const res = await fetch(DAEMON + path, { headers: { "Content-Type": "application/json" }, ...options });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body;
}

// ------------------------------------------------------------------------------------------
// Rendering
// ------------------------------------------------------------------------------------------

function statusText(d) {
  if (!d) return "watch only";
  if (d.status === "ready") return "ready to send";
  if (d.status === "error") return `error: ${d.error}`;
  if (d.shieldedProgress?.target) {
    const pct = Math.min(100, Math.round((100 * d.shieldedProgress.applied) / d.shieldedProgress.target));
    return `syncing ${pct}%`;
  }
  return d.status;
}

const EXPLORER = "https://preview.midnightexplorer.com";

function tokenList(tokens) {
  if (!tokens?.length) return "";
  const rows = tokens.map((t) => {
    const known = KNOWN_TOKENS[t.type];
    const meta = metadata[t.type];
    const image = meta?.imageData
      ? `<img class="tok-image" src="${meta.imageData}" alt="" title="${meta.image}">`
      : `<span class="tok-image"></span>`;
    const proof = meta
      ? `<a class="tok-proof ${meta.verified ? "ok" : "bad"}" href="${EXPLORER}/contracts/${metadataContract}" target="_blank" rel="noopener"
          title="Document ${meta.document}. ${meta.verified ? "Its hash matches the digest stored in the contract." : "Does NOT match the contract's digest."}">${meta.verified ? "metadata verified" : "metadata mismatch"}</a>`
      : "";
    return `<li>${image}
      <span class="tok-label">
        <span class="tok-name">${meta?.name ?? known?.name ?? "Unknown token"}${meta?.ticker ? ` <span class="tok-ticker">${meta.ticker}</span>` : ""}</span>
        <span class="tok-meta"><span class="tok-kind">${known?.kind ?? ""}${t.shielded ? " · shielded" : ""}</span>
          <code title="${t.type}">${t.type.slice(0, 8)}…</code>${proof}</span>
      </span>
      <span class="tok-amount">${t.amount}</span></li>`;
  }).join("");
  return `<ul class="tokens">${rows}</ul>`;
}

const tokenName = (type) => metadata[type]?.name ?? KNOWN_TOKENS[type]?.name ?? `token ${type.slice(0, 8)}…`;

/** What a wallet can send: NIGHT, its public tokens (from the indexer), its shielded ones (from the daemon). */
function sendableTokens(c, d) {
  const out = [{ type: NIGHT_TOKEN, name: "NIGHT", label: "NIGHT" }];
  for (const t of c?.tokens ?? []) out.push({ type: t.type, name: tokenName(t.type), label: `${tokenName(t.type)} (${t.amount})` });
  for (const [type, amount] of Object.entries(d?.shielded ?? {})) {
    out.push({ type, name: tokenName(type), label: `${tokenName(type)} (${amount}, shielded)` });
  }
  return out;
}

const isShieldedToken = (type, d) => type !== NIGHT_TOKEN && Object.hasOwn(d?.shielded ?? {}, type);

function recipientOptions(entry, draft) {
  const d = daemon?.find((w) => w.wallet === entry.wallet);
  const shielded = isShieldedToken(draft.token, d);
  const crew = ROSTER.filter((r) => r.wallet !== entry.wallet).map((r) => {
    const address = shielded ? r.shieldedAddress : r.address;
    return `<option value="${address}" ${draft.to === address ? "selected" : ""}>${r.name}${shielded ? " (shielded)" : ""}</option>`;
  });
  return `<option value="">Send to…</option>${crew.join("")}
    <option value="external" ${draft.to === "external" ? "selected" : ""}>Another address…</option>`;
}

const recipientName = (to) => ROSTER.find((r) => r.address === to || r.shieldedAddress === to)?.name ?? `${to.slice(0, 24)}…`;

/** Shielded holdings are private to the wallet, so only the daemon can list them. */
function shieldedTokens(d) {
  return Object.entries(d?.shielded ?? {}).map(([type, amount]) => ({ type, amount, shielded: true }));
}

function card(entry) {
  const d = daemon?.find((w) => w.wallet === entry.wallet);
  const c = chain.get(entry.wallet);
  const article = document.createElement("article");
  article.className = `card ${d?.status === "ready" ? "" : "watch-only"}`;

  article.innerHTML = `
    <header>
      <div>
        <h3>${entry.name} <span class="tag ${entry.kind}">${entry.kind === "human" ? "You (human)" : "AI agent"}</span></h3>
        <div class="net">${entry.wallet} · preview</div>
      </div>
      <span class="net status-${d?.status ?? "none"}">${statusText(d)}</span>
    </header>
    <div class="balances">
      <div class="balance"><div class="value">${night(d?.night ?? c?.night)}</div><div class="label">NIGHT</div></div>
      <div class="balance"><div class="value">${dust(d?.dust)}</div><div class="label">DUST</div></div>
      <div class="balance"><div class="value">${c?.transactions ?? "—"}</div><div class="label">transactions</div></div>
    </div>
    ${tokenList([...(c?.tokens ?? []), ...shieldedTokens(d)])}
    <p class="note">${entry.role}${entry.agentId ? ` <a href="https://www.midnight.city/agents/${entry.agentId}" target="_blank" rel="noopener">see in the city</a>` : ""}</p>
    <dl class="addr">
      <dt>Unshielded <span class="why">NIGHT and public tokens</span></dt><dd>${entry.address}</dd>
      <dt>Shielded <span class="why">private tokens, such as Agent Smart Contracts</span></dt><dd>${entry.shieldedAddress}</dd>
    </dl>
  `;

  const draft = drafts.get(entry.wallet) ?? { token: NIGHT_TOKEN, to: "", amount: "" };
  const holdings = sendableTokens(c, d);
  if (!holdings.some((h) => h.type === draft.token)) draft.token = NIGHT_TOKEN;
  const form = document.createElement("form");
  form.className = "send";
  const external = draft.to === "external";
  form.innerHTML = `
    <select name="token" aria-label="Token to send">
      ${holdings.map((h) => `<option value="${h.type}" ${draft.token === h.type ? "selected" : ""}>${h.label}</option>`).join("")}
    </select>
    <select name="to" aria-label="Send to">${recipientOptions(entry, draft)}</select>
    <input name="amount" type="text" inputmode="decimal" placeholder="amount" value="${draft.amount}" aria-label="Amount">
    <button type="submit" ${d?.status === "ready" ? "" : "disabled"}>Request</button>
    <input name="address" class="external ${external ? "" : "hidden"}" type="text" spellcheck="false"
      placeholder="${isShieldedToken(draft.token, d) ? "mn_shield-addr_preview1…" : "mn_addr_preview1…"}" value="${draft.address ?? ""}" aria-label="Recipient address">
  `;
  const saveDraft = () => drafts.set(entry.wallet, {
    token: form.elements.token.value, to: form.elements.to.value,
    amount: form.elements.amount.value, address: form.elements.address.value,
  });
  form.elements.token.addEventListener("change", () => {
    // Shielded tokens go to shielded addresses, everything else to unshielded ones.
    saveDraft();
    const current = drafts.get(entry.wallet);
    current.to = current.to === "external" ? "external" : "";
    form.elements.to.innerHTML = recipientOptions(entry, current);
    form.elements.address.placeholder = isShieldedToken(current.token, d) ? "mn_shield-addr_preview1…" : "mn_addr_preview1…";
  });
  form.addEventListener("input", () => {
    saveDraft();
    form.elements.address.classList.toggle("hidden", form.elements.to.value !== "external");
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = form.elements.token.value;
    const shielded = isShieldedToken(token, d);
    const choice = form.elements.to.value;
    const to = choice === "external" ? form.elements.address.value.trim() : choice;
    const pattern = shielded ? /^mn_shield-addr_preview1[0-9a-z]+$/ : /^mn_addr_preview1[0-9a-z]+$/;
    if (choice === "external" && !pattern.test(to)) {
      return log(shielded
        ? "That is not a preview shielded address (it should start mn_shield-addr_preview1)"
        : "That is not a preview unshielded address (it should start mn_addr_preview1)", "bad");
    }
    const amount = form.elements.amount.value.trim();
    if (!to || !amount) return log("Pick a recipient and an amount first", "bad");
    const label = holdings.find((h) => h.type === token)?.name ?? "tokens";
    try {
      await api("/api/requests", {
        method: "POST",
        body: JSON.stringify({ wallet: entry.wallet, kind: "transfer", to, amount, token, requestedBy: "you, in the browser" }),
      });
      drafts.delete(entry.wallet);
      document.activeElement?.blur?.();
      log(`${entry.name}: sending ${amount} ${label} to ${recipientName(to)} is waiting for your approval above`, "ok");
      await refresh();
    } catch (error) {
      log(`${entry.name}: ${error.message}`, "bad");
    }
  });
  article.append(form);

  const copy = document.createElement("button");
  copy.className = "ghost small";
  copy.type = "button";
  copy.textContent = "Copy address";
  copy.addEventListener("click", async () => {
    await navigator.clipboard.writeText(entry.address);
    log(`${entry.name}: unshielded address copied`);
  });
  const copyShielded = document.createElement("button");
  copyShielded.className = "ghost small";
  copyShielded.type = "button";
  copyShielded.textContent = "Copy shielded address";
  copyShielded.addEventListener("click", async () => {
    await navigator.clipboard.writeText(entry.shieldedAddress);
    log(`${entry.name}: shielded address copied`);
  });
  article.append(copy, copyShielded);
  return article;
}

function describe(r, toName) {
  const who = `<b>${nameOf(r.wallet)}</b>`;
  if (r.kind === "deploy") {
    return `${who} deploys contract <b>${r.contract}</b>${r.contractAddress ? ` at <code>${r.contractAddress.slice(0, 16)}…</code>` : ""}`;
  }
  if (r.kind === "call") {
    const args = (r.args ?? []).map((a) => a?.uint
      ?? (a?.userAddress ? (byAddress(a.userAddress)?.name ?? "an address") : null)
      ?? (a?.mandateOf ? `mandate of ${nameOf(a.mandateOf)}` : null)
      ?? (a?.coinPublicKeyOf ? `${nameOf(a.coinPublicKeyOf)}'s shielded key` : null)
      ?? (a?.bytes ? `0x${a.bytes.slice(0, 8)}…` : JSON.stringify(a))).join(", ");
    return `${who} calls <b>${r.contract}.${r.circuit}(${args})</b>`;
  }
  const what = !r.token || r.token === NIGHT_TOKEN ? `${night(r.amount)} NIGHT` : `${r.amount} ${tokenName(r.token)}`;
  return `${who} sends <b>${what}</b> to <b>${toName}</b>${r.shielded ? " (shielded)" : ""}`;
}

function requestItem(r) {
  const li = document.createElement("li");
  li.className = `request ${r.status}`;
  const toName = r.to ? recipientName(r.to) : "";
  const tx = r.txHash
    ? ` · block ${r.block} · <a href="${EXPLORER_TX}0x${r.txHash}" target="_blank" rel="noopener">view on explorer</a>`
    : r.txId ? " · waiting for the chain" : "";
  li.innerHTML = `
    <div class="what">${describe(r, toName)}</div>
    <div class="meta">requested by ${r.requestedBy} · ${new Date(r.createdAt).toLocaleTimeString()} · <span class="state">${r.status}</span>${r.error ? `: ${r.error}` : ""}${tx}</div>
    ${r.policy ? `<div class="meta policy">${r.autoApproved ? "Approved automatically" : "Held for you"}: ${r.policy}</div>` : ""}
  `;
  if (r.status === "pending") {
    const actions = document.createElement("div");
    actions.className = "actions";
    const approve = document.createElement("button");
    approve.textContent = "Approve";
    approve.addEventListener("click", () => decide(r.id, "approve"));
    const reject = document.createElement("button");
    reject.className = "ghost";
    reject.textContent = "Reject";
    reject.addEventListener("click", () => decide(r.id, "reject"));
    actions.append(approve, reject);
    li.append(actions);
  }
  return li;
}

function render() {
  const ready = daemon ? daemon.filter((w) => w.status === "ready").length : 0;
  el("daemon").textContent = daemon
    ? `Wallet daemon connected · ${ready} of ${daemon.length} wallets ready to send`
    : "Wallet daemon not running: balances are live, sending is off. Start it with: node wallet-daemon/server.mjs";
  el("daemon").className = `daemon ${daemon ? "on" : "off"}`;

  // Do not rebuild the cards while you are typing into one; it would steal the focus.
  if (!document.activeElement?.closest?.(".send")) el("wallets").replaceChildren(...ROSTER.map(card));

  const open = requests.filter((r) => r.status === "pending");
  const recent = requests.filter((r) => r.status !== "pending").slice(0, 8);
  const items = [...open, ...recent].map(requestItem);
  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "hint";
    empty.textContent = "No requests yet. Use a wallet's Send form below.";
    items.push(empty);
  }
  el("requests").replaceChildren(...items);
  el("approvals-panel").classList.toggle("attention", open.length > 0);
  showPending(open.length);
}

// The panel stays collapsed; a badge, a hint and the tab title say when something waits.
let lastPending = 0;
function showPending(count) {
  const badge = el("pending-count");
  badge.hidden = count === 0;
  badge.textContent = String(count);
  el("approvals-hint").textContent = count === 0 ? "nothing waiting"
    : count === 1 ? "1 request waiting for you" : `${count} requests waiting for you`;
  document.title = count ? `(${count}) Moddable Midnight Wallet` : "Moddable Midnight Wallet";
  if (count > lastPending) {
    el("approvals-panel").classList.remove("flash");
    void el("approvals-panel").offsetWidth; // restart the animation
    el("approvals-panel").classList.add("flash");
  }
  lastPending = count;
}

// ------------------------------------------------------------------------------------------
// Decisions and polling
// ------------------------------------------------------------------------------------------

async function decide(id, verdict) {
  try {
    const r = await api(`/api/requests/${id}/${verdict}`, { method: "POST" });
    log(verdict === "approve"
      ? `Approved: ${nameOf(r.wallet)} → ${night(r.amount)} NIGHT. Building, proving and submitting; about a minute.`
      : `Rejected: ${nameOf(r.wallet)} → ${night(r.amount)} NIGHT`, verdict === "approve" ? "ok" : "");
  } catch (error) {
    log(error.message, "bad");
  }
  await refresh();
}

async function refresh() {
  try {
    daemon = await api("/api/wallets");
    requests = await api("/api/requests");
    for (const r of requests) {
      const before = seen.get(r.id);
      if (before && before !== r.status && ["confirmed", "failed"].includes(r.status)) {
        log(`${nameOf(r.wallet)} → ${night(r.amount)} NIGHT: ${r.status}${r.block ? " in block " + r.block : ""}${r.error ? " — " + r.error : ""}`,
          r.status === "confirmed" ? "ok" : "bad");
      }
      seen.set(r.id, r.status);
    }
  } catch {
    daemon = null;
  }
  render();
}

for (const entry of ROSTER) {
  watchAddress(entry.address, (update) => { chain.set(entry.wallet, update); render(); },
    (error) => log(`${entry.name}: indexer ${error.message}`, "bad"));
}
log("Balances are live from the public indexer. The wallet daemon adds sending and approvals.");
try {
  if (localStorage.getItem("approvals-open") === "1") el("approvals-panel").open = true;
  el("approvals-panel").addEventListener("toggle", () => {
    try { localStorage.setItem("approvals-open", el("approvals-panel").open ? "1" : "0"); } catch { /* no storage */ }
  });
} catch { /* no storage: stays collapsed */ }
const PUBLIC_CHECK = "https://moddable-games.github.io/moddable-midnight/treasury.html";

/** The contract behind MCC and the Agent Smart Contracts: its public state, and the metadata check. */
async function loadContract() {
  try {
    const c = await api("/api/contract");
    const mcc = metadata[c.mcc.tokenType];
    const fmt = (n) => Number(n).toLocaleString();
    el("contract").innerHTML = `
      <div class="contract-grid">
        <div class="fact"><div class="value">${fmt(c.mcc.minted)}</div><div class="label">MCC minted</div></div>
        <div class="fact"><div class="value">${fmt(c.mcc.held)}</div><div class="label">MCC in the contract</div></div>
        <div class="fact"><div class="value">${fmt(c.mcc.paidOut)}</div><div class="label">MCC paid in ${c.mcc.drawCount} draws</div></div>
        <div class="fact"><div class="value">${c.asc.mandateCount}</div><div class="label">Agent Smart Contracts issued</div></div>
        <div class="fact"><div class="value">${c.mcc.drawAmount}</div><div class="label">MCC per draw</div></div>
        <div class="fact"><div class="value">${c.period ?? "none"}</div><div class="label">${c.paused ? "period (draws paused)" : "open period"}</div></div>
      </div>
      <ul class="contract-checks">
        <li class="${c.mcc.addsUp ? "ok" : "bad"}">${c.mcc.addsUp ? "Supply adds up" : "Supply does NOT add up"}: minted = held + paid out</li>
        <li class="${c.metadataVerified ? "ok" : "bad"}">${c.metadataVerified ? "Metadata verified" : "Metadata mismatch"} against the two digests stored on-chain</li>
      </ul>
      <dl class="addr">
        <dt>Contract</dt><dd><a href="${EXPLORER}/contracts/${c.address}" target="_blank" rel="noopener">${c.address}</a></dd>
        <dt>MCC token type</dt><dd>${c.mcc.tokenType}${mcc ? ` · <a href="https://ipfs.io/ipfs/${mcc.document.replace("ipfs://", "")}" target="_blank" rel="noopener" title="Resolves once pinned">${mcc.document}</a>` : ""}</dd>
        <dt>On-chain metadata digests</dt><dd>MCC ${c.digests.treasury}<br>Agent Smart Contracts ${c.digests.mandates}</dd>
      </dl>
      <p class="hint">Anyone can check all of this without trusting this machine:
        <a href="${PUBLIC_CHECK}" target="_blank" rel="noopener">the public verification page</a> reads the contract from Midnight's indexer and re-checks every file in their browser.</p>`;
    el("contract-panel").hidden = false;
  } catch { /* daemon down: the public page still works */ }
}

/** Token names and images, each checked by the daemon against digests stored on-chain. */
async function loadMetadata() {
  try {
    const out = await api("/api/metadata");
    metadata = out.tokens ?? {};
    metadataContract = out.contract ?? "";
    render();
  } catch { /* daemon down: names fall back to KNOWN_TOKENS */ }
}

refresh();
setInterval(refresh, 3000);
loadMetadata().then(loadContract);
setInterval(() => loadMetadata().then(loadContract), 60_000);
