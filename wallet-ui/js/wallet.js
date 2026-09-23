// Browser wallet for Midnight, talking to one or more `midnight serve` instances.
// Firefox has no Midnight wallet extension (friction log findings 35, 36), so this is the
// missing piece: the CLI wallet holds the keys, this shows their state and asks for writes.

import { watchAddress } from "./indexer.js";

const DEFAULT_PORTS = [9932, 9933, 9934, 9935];
// One `midnight serve` per wallet; the connector does not report which wallet it holds.
const WALLETS = {
  9932: { name: "Organiser", who: "You (human)", wallet: "moddable-preview",
          note: "Treasury. Deploys the contracts and funds the crew.", kind: "human",
          address: "mn_addr_preview1zh5vgfsj5v0d85xps8lxjv8wata8cfwafc54tkgy8umsgms35c3s4gsema" },
  9933: { name: "Floyd", who: "AI agent", wallet: "agent-floyd",
          note: "Hacker, crew boss in Midnight City.", kind: "agent",
          agentId: "user-agent-u4gfp92xeor3g2a",
          address: "mn_addr_preview1wg2ef7spxl8wfahg890z5q4kuhtc234ks7rx65djg3dc9f5ltx4sr69gyw" },
  9934: { name: "Tzilo", who: "AI agent", wallet: "agent-tzilo",
          note: "Miner in Midnight City.", kind: "agent",
          agentId: "user-agent-5wzs7d9q4cdz5gi",
          address: "mn_addr_preview12t3k3nkssja6ksfjqkkx5sfdzue9j33fpztgsheyszrpu63yq77s0epzru" },
  9935: { name: "FooFoo", who: "AI agent", wallet: "agent-foofoo",
          note: "Lumberjack in Midnight City.", kind: "agent",
          agentId: "user-agent-oyhuxtu984deja8",
          address: "mn_addr_preview1qkehtq54t8damevjy953sdua2qtad6adyer4cersc3ql9sw8envsg7kw3g" },
};
const label = (port) => WALLETS[port] ?? { name: `Port ${port}`, who: "unknown", wallet: "", note: "", kind: "" };
const NIGHT = "0".repeat(64);
const REFRESH_MS = 10000;

const connections = new Map(); // port -> { socket, status, name, snapshot }
const chain = new Map();       // port -> { night, transactions, caughtUp } straight from the indexer
const portsEl = document.getElementById("ports");
const walletsEl = document.getElementById("wallets");
const logEl = document.getElementById("log");

function log(message, kind = "") {
  const li = document.createElement("li");
  if (kind) li.className = kind;
  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString();
  li.append(time, document.createTextNode(message));
  logEl.prepend(li);
  while (logEl.children.length > 100) logEl.lastElementChild.remove();
}

function formatNight(raw) {
  if (raw === undefined || raw === null) return "0";
  const star = BigInt(raw);
  const whole = star / 1000000n;
  const fraction = (star % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : `${whole}`;
}

function formatDust(raw) {
  if (!raw) return "0";
  const specks = BigInt(raw);
  return (Number(specks / 1000000000n) / 1000000).toFixed(3);
}

/** One JSON-RPC connection to a wallet server. */
class Wallet {
  constructor(port) {
    this.port = port;
    this.pending = new Map();
    this.nextId = 0;
  }

  open() {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(`ws://localhost:${this.port}`);
      this.socket = socket;
      socket.onopen = () => resolve();
      socket.onerror = () => reject(new Error(`no wallet server on port ${this.port}`));
      socket.onclose = () => {
        for (const [, entry] of this.pending) entry.reject(new Error("connection closed"));
        this.pending.clear();
        const state = connections.get(this.port);
        if (state) { state.status = "off"; render(); }
      };
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (typeof message.id !== "number") return;
        const entry = this.pending.get(message.id);
        if (!entry) return;
        this.pending.delete(message.id);
        if (message.error) entry.reject(new Error(message.error.message));
        else entry.resolve(message.result);
      };
    });
  }

  call(method, params) {
    const id = ++this.nextId;
    this.socket.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`${method} timed out; check the wallet server's terminal for an approval prompt`));
      }, 180000);
    });
  }

  async snapshot() {
    const [status, config, unshielded, shielded, balances, dust] = await Promise.all([
      this.call("getConnectionStatus"),
      this.call("getConfiguration"),
      this.call("getUnshieldedAddress"),
      this.call("getShieldedAddresses"),
      this.call("getUnshieldedBalances"),
      this.call("getDustBalance"),
    ]);
    return {
      networkId: status.networkId,
      indexer: config.indexerUri,
      prover: config.proverServerUri,
      unshieldedAddress: unshielded.unshieldedAddress,
      shieldedAddress: shielded.shieldedAddress,
      night: balances[NIGHT] ?? "0",
      dust: dust.balance,
      dustCap: dust.cap,
    };
  }
}

async function connect(port, { quiet = false } = {}) {
  if (connections.has(port) && connections.get(port).status === "on") return;
  const wallet = new Wallet(port);
  connections.set(port, { wallet, status: "busy" });
  render();
  try {
    await wallet.open();
    const { networkId } = await wallet.call("connect", { networkId: "preview" });
    const snapshot = await wallet.snapshot();
    connections.set(port, { wallet, status: "on", networkId, snapshot });
    log(`connected to port ${port} (${networkId}, ${formatNight(snapshot.night)} NIGHT)`, "ok");
  } catch (error) {
    connections.set(port, { wallet, status: "off", error: error.message });
    if (!quiet) log(`port ${port}: ${error.message}`, "bad");
  }
  render();
}

async function refresh() {
  for (const [port, state] of connections) {
    // A server still syncing answers "Wallet not synced yet"; keep trying quietly.
    if (state.status === "off") { connect(port, { quiet: true }); continue; }
    if (state.status !== "on") continue;
    try {
      state.snapshot = await state.wallet.snapshot();
    } catch (error) {
      state.status = "off";
      log(`port ${port}: ${error.message}`, "bad");
    }
  }
  render();
}

/** Signing is the human-in-the-loop demonstration: it prompts in the server's terminal. */
async function requestSignature(port) {
  const state = connections.get(port);
  if (!state || state.status !== "on") return;
  const payload = `moddable-midnight wallet check ${new Date().toISOString()}`;
  const hex = Array.from(new TextEncoder().encode(payload)).map((b) => b.toString(16).padStart(2, "0")).join("");
  log(`${label(port).name}: asking the wallet to sign. Approve it in the terminal running this wallet's server.`);
  try {
    // The server wants a string plus an encoding, and signs with the unshielded key.
    const result = await state.wallet.call("signData", {
      data: hex,
      options: { encoding: "hex", keyType: "unshielded" },
    });
    log(`${label(port).name}: signed — ${JSON.stringify(result).slice(0, 90)}`, "ok");
  } catch (error) {
    log(`${label(port).name}: ${error.message}`, "bad");
  }
}

function card(port, state) {
  const el = document.createElement("article");
  const who = label(port);
  const s = state?.snapshot;              // local wallet server, when one is running
  const c = chain.get(port);              // the indexer, always
  const night = s ? formatNight(s.night) : c ? formatNight(c.night) : "—";
  const source = s ? "wallet server" : c?.caughtUp ? "live from the indexer" : "reading the chain…";
  el.className = "card" + (s ? "" : " watch-only");
  el.innerHTML = `
    <header>
      <div>
        <h3>${who.name} <span class="tag ${who.kind}">${who.who}</span></h3>
        <div class="net">${who.wallet} · preview · ${s ? ":" + port : "watch only"}</div>
      </div>
      <span class="net">${source}</span>
    </header>
    <div class="balances">
      <div class="balance"><div class="value">${night}</div><div class="label">NIGHT</div></div>
      ${s ? `<div class="balance"><div class="value">${formatDust(s.dust)}</div><div class="label">DUST</div></div>` : ""}
      ${c ? `<div class="balance"><div class="value">${c.transactions}</div><div class="label">transactions</div></div>` : ""}
    </div>
    <p class="note">${who.note}${who.agentId ? ` <a href="https://www.midnight.city/agents/${who.agentId}" target="_blank" rel="noopener">see in the city</a>` : ""}</p>
    <dl class="addr">
      <dt>Unshielded</dt><dd>${s?.unshieldedAddress ?? who.address ?? ""}</dd>
      ${s ? `<dt>Shielded</dt><dd>${s.shieldedAddress}</dd>` : ""}
    </dl>
  `;
  const actions = document.createElement("div");
  actions.className = "actions";
  if (s) {
    const sign = document.createElement("button");
    sign.textContent = "Request signature";
    sign.addEventListener("click", () => requestSignature(port));
    actions.append(sign);
  } else {
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = `Balance is live. To sign with this wallet: midnight serve --port ${port} --wallet ${who.wallet} --network preview`;
    actions.append(hint);
  }
  const copy = document.createElement("button");
  copy.className = "ghost";
  copy.textContent = "Copy address";
  copy.addEventListener("click", async () => {
    await navigator.clipboard.writeText(s?.unshieldedAddress ?? who.address ?? "");
    log(`${who.name}: address copied`);
  });
  actions.append(copy);
  el.append(actions);
  return el;
}

function render() {
  portsEl.replaceChildren(...[...connections.entries()].map(([port, state]) => {
    const li = document.createElement("li");
    const dot = document.createElement("span");
    dot.className = `dot ${state.status === "on" ? "on" : state.status === "busy" ? "busy" : "off"}`;
    li.append(dot, document.createTextNode(`${label(port).name} :${port}${state.error ? " — " + state.error : ""}`));
    if (state.status !== "on") {
      const retry = document.createElement("button");
      retry.className = "ghost";
      retry.textContent = "retry";
      retry.addEventListener("click", () => connect(port));
      li.append(retry);
    }
    return li;
  }));

  const cards = Object.keys(WALLETS).map(Number).map((port) => {
    const state = connections.get(port);
    return card(port, state?.status === "on" && state.snapshot ? state : null);
  });
  for (const [port, state] of connections) {
    if (!WALLETS[port] && state.status === "on" && state.snapshot) cards.push(card(port, state));
  }
  walletsEl.replaceChildren(...cards);
}

document.getElementById("add-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const port = Number(document.getElementById("port").value);
  if (port) connect(port);
});

for (const [port, who] of Object.entries(WALLETS)) {
  if (!who.address) continue;
  watchAddress(who.address, (update) => { chain.set(Number(port), update); render(); },
    (error) => log(`${who.name}: indexer ${error.message}`, "bad"));
}
log("balances are live from the public indexer; wallet servers add signing");
for (const port of DEFAULT_PORTS) connect(port, { quiet: true });
setInterval(refresh, REFRESH_MS);
