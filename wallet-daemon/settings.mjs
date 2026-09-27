// App settings and prices.
//
// The dashboard shows USD values "as if on mainnet": test NIGHT (tNIGHT) is valued at NIGHT's
// live market price, and tokens this project issued at prices the operator sets here. Every
// USD figure in the app is labelled simulated. The price feed is CoinGecko's public API
// (coin id "midnight-3"), fetched by the daemon so the page makes no third-party calls.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const FILE = new URL("./state/settings.json", import.meta.url).pathname;
const COINGECKO = "https://api.coingecko.com/api/v3/simple/price?ids=midnight-3&vs_currencies=usd&include_24hr_change=true";

const DEFAULTS = {
  currency: "USD",
  livePrices: true,
  // token type (hex) -> USD per whole token. NFTs have no price unless set.
  tokenPrices: {},
  nightFallbackUsd: "0.025",
  approvalSound: false,
};

export function readSettings() {
  try { return { ...DEFAULTS, ...(existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : {}) }; } catch { return { ...DEFAULTS }; }
}

export function writeSettings(input) {
  const current = readSettings();
  const next = { ...current };
  if ("livePrices" in input) next.livePrices = Boolean(input.livePrices);
  if ("approvalSound" in input) next.approvalSound = Boolean(input.approvalSound);
  if ("nightFallbackUsd" in input) {
    if (!/^\d+(\.\d+)?$/.test(String(input.nightFallbackUsd))) throw new Error("price must be a number");
    next.nightFallbackUsd = String(input.nightFallbackUsd);
  }
  if (input.tokenPrices && typeof input.tokenPrices === "object") {
    next.tokenPrices = {};
    for (const [type, price] of Object.entries(input.tokenPrices)) {
      if (!/^[0-9a-f]{64}$/.test(type)) throw new Error("token types are 64 hex characters");
      if (price === "" || price === null) continue;
      if (!/^\d+(\.\d+)?$/.test(String(price))) throw new Error("prices must be numbers");
      next.tokenPrices[type] = String(price);
    }
  }
  mkdirSync(new URL("./state/", import.meta.url).pathname, { recursive: true, mode: 0o700 });
  writeFileSync(FILE, JSON.stringify(next, null, 2), { mode: 0o600 });
  return next;
}

let cache = { at: 0, value: null };

/** NIGHT's USD price (live, cached five minutes, or the fallback) and the operator's token prices. */
export async function prices() {
  const settings = readSettings();
  let night = { usd: Number(settings.nightFallbackUsd), change24h: null, source: "fallback", at: null };
  if (settings.livePrices) {
    if (cache.value && Date.now() - cache.at < 5 * 60_000) night = cache.value;
    else {
      try {
        const res = await fetch(COINGECKO, { signal: AbortSignal.timeout(5000) });
        const body = await res.json();
        const quote = body["midnight-3"];
        if (quote?.usd) {
          night = { usd: quote.usd, change24h: quote.usd_24h_change ?? null, source: "coingecko", at: new Date().toISOString() };
          cache = { at: Date.now(), value: night };
        }
      } catch { /* keep the fallback */ }
    }
  }
  return { night, tokens: settings.tokenPrices, simulated: true };
}
