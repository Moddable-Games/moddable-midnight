import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  api, NIGHT, type Deployment, type Holdings, type LegacyMetadata, type Policy, type Prices, type Settings,
  type TreasuryV3, type Wallet, type WalletRequest,
} from "./api";

/** One kind of thing a wallet can hold, however it is held. */
export type Asset = {
  key: string;
  name: string;
  symbol: string;
  /** MIP-0018 kind: 0 native unshielded, 1 native shielded, 2 contract unshielded, 3 contract shielded. */
  kind: 0 | 1 | 2 | 3;
  nft: boolean;
  decimals: number;
  color: string | null;
  contract: string | null;
  domain: string | null;
  image?: string | null;
};

export type Holding = { asset: Asset; wallet: string; amount: string };

type Store = {
  online: boolean;
  lastError: string | null;
  wallets: Wallet[];
  requests: WalletRequest[];
  deployments: Deployment[];
  holdings: Holdings;
  policy: Policy | null;
  treasury: TreasuryV3 | null;
  prices: Prices | null;
  settings: Settings | null;
  assets: Map<string, Asset>;
  holdingsList: Holding[];
  pending: WalletRequest[];
  priceOf: (asset: Asset) => number | null;
  refresh: (what?: "fast" | "all") => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
};

const NIGHT_ASSET: Asset = { key: `u:${NIGHT}`, name: "Night", symbol: "NIGHT", kind: 0, nft: false, decimals: 6, color: NIGHT, contract: null, domain: null };

/** Names every token type the app can see, from the token contracts and the treasuries. */
function catalogue(deployments: Deployment[], legacy: LegacyMetadata | null, treasury: TreasuryV3 | null): Map<string, Asset> {
  const map = new Map<string, Asset>([[NIGHT_ASSET.key, NIGHT_ASSET]]);
  for (const d of deployments) {
    if (d.error) continue;
    for (const t of d.tokens) {
      const named = d.metadata.find((m) => m.domain === t.domain && m.key === "name")?.value;
      const base = {
        name: t.nft ? t.label : (named ?? d.name), symbol: t.nft ? d.symbol : d.symbol,
        nft: t.nft, decimals: t.nft ? 0 : d.decimals, color: t.color, contract: d.address, domain: t.domain,
      };
      if (d.storage === "contract") {
        map.set(`c:${d.address}:${t.domain}`, { ...base, key: `c:${d.address}:${t.domain}`, kind: d.kind });
      }
      // Native forms: a native token has one; a contract token can be converted into either.
      if (d.kind !== 1) map.set(`u:${t.color}`, { ...base, key: `u:${t.color}`, kind: 0 });
      if (d.kind !== 0) map.set(`s:${t.color}`, { ...base, key: `s:${t.color}`, kind: 1 });
    }
  }
  for (const [type, t] of Object.entries(legacy?.tokens ?? {})) {
    const key = `${t.shielded ? "s" : "u"}:${type}`;
    map.set(key, { key, name: t.name, symbol: t.ticker, kind: t.shielded ? 1 : 0, nft: t.shielded, decimals: 0, color: type, contract: legacy!.contract, domain: null, image: t.imageData });
  }
  // All zeros until the treasury's first mint, which would collide with NIGHT's type.
  if (treasury?.treasuryColor && treasury.treasuryColor !== NIGHT) {
    const key = `u:${treasury.treasuryColor}`;
    map.set(key, { key, name: "Midnight City Credits v3", symbol: "MCC", kind: 0, nft: false, decimals: 0, color: treasury.treasuryColor, contract: treasury.address, domain: null });
  }
  return map;
}

// The phase-0 mint spike (spikes/mint_spike.compact), which predates the metadata work.
const SPIKE: Record<string, [string, string, boolean]> = {
  "f3f4d88611d5af314fb32ef0e380fed5807aaac806362c05fc7f79bcf1b8b91d": ["Spike treasury", "SPK", false],
  "7dab3653f25ff22bc04439dcd9aeea313432886baba621fcfa1bd8e33512deb0": ["Spike mandate", "SPK", true],
};

const unknownAsset = (key: string, kind: 0 | 1): Asset => SPIKE[key.slice(2)] ? {
  key, name: SPIKE[key.slice(2)][0], symbol: SPIKE[key.slice(2)][1], kind, nft: SPIKE[key.slice(2)][2], decimals: 0, color: key.slice(2), contract: null, domain: null,
} : ({
  key, name: `Token ${key.slice(2, 10)}`, symbol: key.slice(2, 6).toUpperCase(), kind, nft: false, decimals: 0, color: key.slice(2), contract: null, domain: null,
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [requests, setRequests] = useState<WalletRequest[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [holdings, setHoldings] = useState<Holdings>({});
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [treasury, setTreasury] = useState<TreasuryV3 | null>(null);
  const [prices, setPrices] = useState<Prices | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [legacy, setLegacy] = useState<LegacyMetadata | null>(null);
  const slowAt = useRef(0);

  const refresh = useCallback(async (what: "fast" | "all" = "fast") => {
    try {
      const [w, r] = await Promise.all([api.wallets(), api.requests()]);
      setWallets(w);
      setRequests(r);
      setOnline(true);
      setLastError(null);
    } catch (e) {
      setOnline(false);
      setLastError((e as Error).message);
      return;
    }
    // Chain reads are slower; refresh them every 20 seconds, or when asked.
    if (what === "all" || Date.now() - slowAt.current > 20_000) {
      slowAt.current = Date.now();
      const results = await Promise.allSettled([
        api.tokens(what === "all"), api.holdings(), api.policy(), api.treasuryV3(), api.prices(), api.settings(), api.legacyMetadata(),
      ]);
      const [t, h, p, tv, pr, st, lm] = results;
      if (t.status === "fulfilled") setDeployments(t.value.deployments);
      if (h.status === "fulfilled") setHoldings(h.value);
      if (p.status === "fulfilled") setPolicy(p.value);
      if (tv.status === "fulfilled") setTreasury(tv.value);
      if (pr.status === "fulfilled") setPrices(pr.value);
      if (st.status === "fulfilled") setSettings(st.value);
      if (lm.status === "fulfilled") setLegacy(lm.value);
    }
  }, []);

  useEffect(() => {
    refresh("all");
    const id = setInterval(() => refresh("fast"), 4000);
    return () => clearInterval(id);
  }, [refresh]);

  const assets = useMemo(() => catalogue(deployments, legacy, treasury), [deployments, legacy, treasury]);

  const holdingsList = useMemo(() => {
    const out: Holding[] = [];
    for (const [wallet, h] of Object.entries(holdings)) {
      for (const [type, amount] of Object.entries(h.unshielded)) {
        if (amount === "0") continue;
        out.push({ asset: assets.get(`u:${type}`) ?? unknownAsset(`u:${type}`, 0), wallet, amount });
      }
      for (const [type, amount] of Object.entries(h.shielded)) {
        if (amount === "0") continue;
        out.push({ asset: assets.get(`s:${type}`) ?? unknownAsset(`s:${type}`, 1), wallet, amount });
      }
      for (const [key, amount] of Object.entries(h.contract)) {
        const asset = assets.get(`c:${key}`);
        if (asset && amount !== "0") out.push({ asset, wallet, amount });
      }
    }
    return out;
  }, [holdings, assets]);

  const priceOf = useCallback((asset: Asset): number | null => {
    if (!prices) return null;
    if (asset.color === NIGHT && asset.kind === 0) return prices.night.usd;
    const set = asset.color ? prices.tokens[asset.color] : undefined;
    return set ? Number(set) : null;
  }, [prices]);

  const pending = useMemo(() => requests.filter((r) => r.status === "pending"), [requests]);

  const value: Store = {
    online, lastError, wallets, requests, deployments, holdings, policy, treasury, prices, settings,
    assets, holdingsList, pending, priceOf, refresh,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
