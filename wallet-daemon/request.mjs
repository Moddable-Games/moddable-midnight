// Command-line client for the wallet daemon: queue a request, optionally approve it, and wait
// for the outcome.
//
//   node wallet-daemon/request.mjs '<request json>'            queue it for approval in the page
//   node wallet-daemon/request.mjs '<request json>' --approve  queue and approve (operator use)
//
// The daemon accepts writes only from the wallet page's origin, so this sends that origin.
// It is for the operator on this machine; agents get their own route with limits.
const DAEMON = "http://127.0.0.1:9900";
const ORIGIN = "http://localhost:5173";

const [json, flag] = process.argv.slice(2);
if (!json) {
  console.error("usage: node wallet-daemon/request.mjs '<request json>' [--approve]");
  process.exit(2);
}

async function post(path, body) {
  const res = await fetch(DAEMON + path, {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN },
    body: body ? JSON.stringify(body) : undefined,
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error ?? `HTTP ${res.status}`);
  return out;
}

const request = await post("/api/requests", JSON.parse(json));
console.log(`queued ${request.id}`);
if (flag !== "--approve") process.exit(0);

await post(`/api/requests/${request.id}/approve`);
let last = "";
for (;;) {
  await new Promise((r) => setTimeout(r, 3000));
  const all = await (await fetch(DAEMON + "/api/requests")).json();
  const now = all.find((r) => r.id === request.id);
  if (now.status !== last) console.log(`  ${now.status}${now.txId ? ` tx ${now.txId.slice(0, 16)}…` : ""}`);
  last = now.status;
  if (["confirmed", "failed", "rejected"].includes(now.status) || (now.status === "submitted" && now.txHash)) {
    console.log(JSON.stringify(now, null, 2));
    process.exit(now.status === "failed" ? 1 : 0);
  }
}
