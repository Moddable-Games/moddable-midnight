// Publishes the crew's wallet balances for the city page.
//
// The public indexer has no balance-by-address query (only contract, bridge and DUST by
// Cardano address), so a static page cannot read these live. This reads the wallets from
// the local `midnight serve` instances and writes a timestamped snapshot the page fetches.
//
//   midnight serve --port 9932 --wallet moddable-preview --network preview   (and 9933-9935)
//   node scripts/wallet-snapshot.mjs
//
// Addresses are public; nothing secret leaves the machine.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const OUT = resolve(process.cwd(), "web/public/data/wallets.json");
const NIGHT = "0".repeat(64);

const WALLETS = [
  { key: "organiser", label: "Organiser", port: 9932, wallet: "moddable-preview" },
  { key: "floyd", label: "Floyd", port: 9933, wallet: "agent-floyd", agentId: "user-agent-u4gfp92xeor3g2a" },
  { key: "tzilo", label: "Tzilo", port: 9934, wallet: "agent-tzilo", agentId: "user-agent-5wzs7d9q4cdz5gi" },
  { key: "foofoo", label: "FooFoo", port: 9935, wallet: "agent-foofoo", agentId: "user-agent-oyhuxtu984deja8" },
];

function rpc(port, method, params) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://localhost:${port}`);
    const timer = setTimeout(() => { socket.close(); reject(new Error(`port ${port}: timed out`)); }, 30000);
    socket.onerror = () => { clearTimeout(timer); reject(new Error(`port ${port}: no wallet server`)); };
    socket.onopen = () => socket.send(JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }));
    socket.onmessage = (event) => {
      clearTimeout(timer);
      const message = JSON.parse(event.data);
      socket.close();
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
  });
}

async function read(entry) {
  const [address, balances, dust] = await Promise.all([
    rpc(entry.port, "getUnshieldedAddress"),
    rpc(entry.port, "getUnshieldedBalances"),
    rpc(entry.port, "getDustBalance"),
  ]);
  return {
    ...entry,
    address: address.unshieldedAddress,
    night: balances[NIGHT] ?? "0",
    dust: dust.balance,
    dustCap: dust.cap,
  };
}

const wallets = [];
for (const entry of WALLETS) {
  try {
    wallets.push(await read(entry));
    console.log(`${entry.label}: ok`);
  } catch (error) {
    console.log(`${entry.label}: ${error.message}`);
    wallets.push({ ...entry, error: error.message });
  }
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ takenAt: new Date().toISOString(), network: "preview", wallets }, null, 2) + "\n");
console.log(`wrote ${OUT}`);
