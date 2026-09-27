import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** A base-unit amount shown with `decimals` places, trimmed. */
export function units(raw: string | bigint | null | undefined, decimals = 0, maxFraction = 2): string {
  if (raw === null || raw === undefined) return "—";
  const v = BigInt(raw);
  const scale = 10n ** BigInt(decimals);
  const whole = v / scale;
  const frac = v % scale;
  const wholeText = whole.toLocaleString("en-GB");
  if (!decimals || frac === 0n) return wholeText;
  const fracText = frac.toString().padStart(decimals, "0").slice(0, maxFraction).replace(/0+$/, "");
  return fracText ? `${wholeText}.${fracText}` : wholeText;
}

export const night = (star: string | null | undefined, maxFraction = 2) => units(star, 6, maxFraction);

/** DUST is in SPECK: 10^15 per DUST. */
export const dust = (speck: string | null | undefined) => units(speck, 15, 2);

export const usd = (value: number | null | undefined, compact = false) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    notation: compact && value >= 100_000 ? "compact" : "standard",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
};

/** Whole-token value in USD for a base-unit amount at `price` per whole token. */
export const valueOf = (raw: string | bigint, decimals: number, price: number | null) =>
  price === null ? null : (Number(BigInt(raw)) / 10 ** decimals) * price;

export const short = (text: string | null | undefined, head = 10, tail = 6) =>
  !text ? "—" : text.length <= head + tail + 1 ? text : `${text.slice(0, head)}…${text.slice(-tail)}`;

export function ago(iso: string | undefined | null): string {
  if (!iso) return "";
  const s = Math.round((Date.now() - Date.parse(iso)) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export const pad32Hex = (label: string) => {
  const bytes = new TextEncoder().encode(label);
  const out = new Uint8Array(32);
  out.set(bytes.slice(0, 32));
  return [...out].map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Explorer URL formats, each verified by rendering a real page.
export const explorer = {
  tx: (hash: string) => `https://preview.midnightexplorer.com/transactions/0x${hash.replace(/^0x/, "")}`,
  contract: (address: string) => `https://preview.midnightexplorer.com/contracts/${address}`,
  block: (height: number) => `https://preview.midnightexplorer.com/blocks/${height}`,
};

// The public site, where the explanations live (the app itself stays short).
export const SITE = "https://moddable-games.github.io/moddable-midnight";
