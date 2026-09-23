// Browser wallet for Midnight, driving the local wallet daemon (wallet-daemon/server.mjs).
// Balances come live from the public indexer even when the daemon is down; the daemon adds
// DUST, sending, and the approval queue.
import { watchAddress } from "./indexer.js";

const DAEMON = "http://127.0.0.1:9900";
const EXPLORER_TX = "https://preview.midnightexplorer.com/transactions/";

// Known wallets, so the page can show live balances before the daemon answers.
const ROSTER = [
  { wallet: "moddable-preview", name: "Organiser", kind: "human", role: "Treasury. Deploys the contracts and funds the crew.",
    address: "mn_addr_preview1zh5vgfsj5v0d85xps8lxjv8wata8cfwafc54tkgy8umsgms35c3s4gsema" },
  { wallet: "agent-floyd", name: "Floyd", kind: "agent", role: "Hacker, crew boss in Midnight City.", agentId: "user-agent-u4gfp92xeor3g2a",
    address: "mn_addr_preview1wg2ef7spxl8wfahg890z5q4kuhtc234ks7rx65djg3dc9f5ltx4sr69gyw" },
  { wallet: "agent-tzilo", name: "Tzilo", kind: "agent", role: "Miner in Midnight City.", agentId: "user-agent-5wzs7d9q4cdz5gi",
    address: "mn_addr_preview12t3k3nkssja6ksfjqkkx5sfdzue9j33fpztgsheyszrpu63yq77s0epzru" },
  { wallet: "agent-foofoo", name: "FooFoo", kind: "agent", role: "Lumberjack in Midnight City.", agentId: "user-agent-oyhuxtu984deja8",
    address: "mn_addr_preview1qkehtq54t8damevjy953sdua2qtad6adyer4cersc3ql9sw8envsg7kw3g" },
];

// Tokens minted by our own contracts. Midnight has no token metadata service yet (friction
// log finding 39), so names and descriptions for our tokens live here.
const KNOWN_TOKENS = {
  "f3f4d88611d5af314fb32ef0e380fed5807aaac806362c05fc7f79bcf1b8b91d": { name: "Crew treasury token", kind: "fungible" },
  "7dab3653f25ff22bc04439dcd9aeea313432886baba621fcfa1bd8e33512deb0": { name: "Crew mandate", kind: "NFT" },
};

const chain = new Map();   // wallet -> { night, transactions, caughtUp } from the indexer
let daemon = null;         // latest /api/wallets, or null if the daemon is not running
let requests = [];
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

function tokenList(tokens) {
  if (!tokens?.length) return "";
  const rows = tokens.map((t) => {
    const known = KNOWN_TOKENS[t.type];
    return `<li><span class="tok-name">${known ? known.name : "Unknown token"}</span>
      <span class="tok-kind">${known?.kind ?? ""}</span>
      <span class="tok-amount">${t.amount}</span>
      <code title="${t.type}">${t.type.slice(0, 10)}…</code></li>`;
  }).join("");
  return `<ul class="tokens">${rows}</ul>`;
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
    ${tokenList(c?.tokens)}
    <p class="note">${entry.role}${entry.agentId ? ` <a href="https://www.midnight.city/agents/${entry.agentId}" target="_blank" rel="noopener">see in the city</a>` : ""}</p>
    <dl class="addr"><dt>Unshielded</dt><dd>${entry.address}</dd></dl>
  `;

  const draft = drafts.get(entry.wallet) ?? { to: "", amount: "" };
  const form = document.createElement("form");
  form.className = "send";
  form.innerHTML = `
    <select name="to" aria-label="Send to">
      <option value="">Send NIGHT to…</option>
      ${ROSTER.filter((r) => r.wallet !== entry.wallet)
        .map((r) => `<option value="${r.address}" ${draft.to === r.address ? "selected" : ""}>${r.name}</option>`).join("")}
    </select>
    <input name="amount" type="text" inputmode="decimal" placeholder="amount" value="${draft.amount}" aria-label="Amount in NIGHT">
    <button type="submit" ${d?.status === "ready" ? "" : "disabled"}>Request</button>
  `;
  form.addEventListener("input", () => drafts.set(entry.wallet, { to: form.elements.to.value, amount: form.elements.amount.value }));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const to = form.elements.to.value;
    const amount = form.elements.amount.value.trim();
    if (!to || !amount) return log("Pick a recipient and an amount first", "bad");
    try {
      await api("/api/requests", {
        method: "POST",
        body: JSON.stringify({ wallet: entry.wallet, kind: "transfer", to, amount, requestedBy: "you, in the browser" }),
      });
      drafts.delete(entry.wallet);
      document.activeElement?.blur?.();
      log(`${entry.name}: sending ${amount} NIGHT to ${byAddress(to)?.name} is waiting for your approval above`, "ok");
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
    log(`${entry.name}: address copied`);
  });
  article.append(copy);
  return article;
}

function describe(r, toName) {
  const who = `<b>${nameOf(r.wallet)}</b>`;
  if (r.kind === "deploy") {
    return `${who} deploys contract <b>${r.contract}</b>${r.contractAddress ? ` at <code>${r.contractAddress.slice(0, 16)}…</code>` : ""}`;
  }
  if (r.kind === "call") {
    const args = (r.args ?? []).map((a) => a?.uint ?? (a?.userAddress ? (byAddress(a.userAddress)?.name ?? "an address") : JSON.stringify(a))).join(", ");
    return `${who} calls <b>${r.contract}.${r.circuit}(${args})</b>`;
  }
  return `${who} sends <b>${night(r.amount)} NIGHT</b> to <b>${toName}</b>`;
}

function requestItem(r) {
  const li = document.createElement("li");
  li.className = `request ${r.status}`;
  const toName = r.to ? (byAddress(r.to)?.name ?? r.to.slice(0, 20) + "…") : "";
  const tx = r.txHash
    ? ` · block ${r.block} · <a href="${EXPLORER_TX}0x${r.txHash}" target="_blank" rel="noopener">view on explorer</a>`
    : r.txId ? " · waiting for the chain" : "";
  li.innerHTML = `
    <div class="what">${describe(r, toName)}</div>
    <div class="meta">requested by ${r.requestedBy} · ${new Date(r.createdAt).toLocaleTimeString()} · <span class="state">${r.status}</span>${r.error ? ` — ${r.error}` : ""}${tx}</div>
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
refresh();
setInterval(refresh, 3000);
