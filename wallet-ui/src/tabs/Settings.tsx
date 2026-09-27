import { BookOpen, Check, ExternalLink, Radio, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { TokenGlyph } from "@/components/glyphs";
import { Button, Field, FormError, Input, Panel, Toggle } from "@/components/ui/primitives";
import { api, DAEMON, NIGHT } from "@/lib/api";
import { SITE, usd } from "@/lib/format";
import { useStore } from "@/lib/store";

export function SettingsTab() {
  const { settings, prices, assets, refresh, online, wallets } = useStore();
  const [draft, setDraft] = useState(settings);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { setDraft(settings); }, [settings]);

  // One price per color: the natives and the native forms of contract tokens share it.
  // Public forms first, so a contract token is listed by its public glyph.
  const priced = [...new Map([...assets.values()].filter((a) => !a.nft && a.color && a.color !== NIGHT)
    .sort((a, b) => a.kind - b.kind).reverse().map((a) => [a.color!, a])).values()];

  const save = async () => {
    if (!draft) return;
    setError(null);
    try { await api.saveSettings(draft); await refresh("all"); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Settings</h1>
      {draft ? (
        <Panel title="Prices" action={<Button size="sm" onClick={save}>{saved ? <><Check size={15} />Saved</> : "Save"}</Button>}>
          <FormError message={error} />
          <p className="mb-4 text-sm text-ink-soft">The dashboard values test tokens as if they were on mainnet. Every USD figure is simulated.</p>
          <div className="mb-4 flex items-center justify-between gap-3 rounded-[1rem] bg-sunken px-3 py-3">
            <span className="flex items-center gap-3">
              <TokenGlyph asset={assets.get(`u:${NIGHT}`)} />
              <span className="text-sm"><span className="font-semibold">Live NIGHT price</span><br />
                <span className="text-ink-soft">{prices?.night.source === "coingecko" ? `${usd(prices.night.usd)} from CoinGecko` : "Using the fallback below"}</span></span>
            </span>
            <Toggle checked={draft.livePrices} onChange={(v) => setDraft({ ...draft, livePrices: v })} label="Use the live NIGHT price" />
          </div>
          <Field label="NIGHT fallback, USD" hint="Used when the live price is off or unreachable">
            <Input inputMode="decimal" value={draft.nightFallbackUsd} onChange={(e) => setDraft({ ...draft, nightFallbackUsd: e.target.value })} />
          </Field>
          <h3 className="mb-2 mt-5 text-base">Our tokens, USD each</h3>
          <ul>
            {priced.map((a) => (
              <li key={a.color} className="flex items-center gap-3 border-b border-line py-2 last:border-0">
                <TokenGlyph asset={a} size={32} />
                <span className="min-w-0 flex-1 truncate font-semibold">{a.name} <span className="text-ink-faint">{a.symbol}</span></span>
                <Input className="h-9 w-28 text-right" inputMode="decimal" placeholder="No price" aria-label={`${a.name} price`}
                  value={draft.tokenPrices[a.color!] ?? ""} onChange={(e) => setDraft({ ...draft, tokenPrices: { ...draft.tokenPrices, [a.color!]: e.target.value } })} />
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <Panel title="Connection">
        <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
          <dt className="flex items-center gap-2 text-ink-soft"><Server size={15} />Daemon</dt><dd>{online ? "Connected" : "Offline"}, <span className="font-mono text-[12px]">{DAEMON}</span></dd>
          <dt className="flex items-center gap-2 text-ink-soft"><Radio size={15} />Network</dt><dd>Midnight preview</dd>
          <dt className="text-ink-soft">Wallets open</dt><dd>{wallets.filter((w) => w.status === "ready").length} of {wallets.length}</dd>
        </dl>
      </Panel>

      <Panel title="How it works">
        <ul className="space-y-1">
          {[
            ["The wallet, explained", `${SITE}/wallet.html`],
            ["Token types and MIPs", `${SITE}/tokens.html`],
            ["Check the treasury yourself", `${SITE}/treasury.html`],
            ["Source code", "https://github.com/Moddable-Games/moddable-midnight"],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-control px-2 py-2 hover:bg-sunken">
                <BookOpen size={17} className="text-cosmic" /><span className="flex-1 font-semibold">{label}</span><ExternalLink size={15} className="text-ink-faint" />
              </a>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
