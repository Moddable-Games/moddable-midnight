import { Check, Copy, EyeOff, Lock } from "lucide-react";
import { useState, type ReactNode } from "react";
import { KIND_LABEL, KIND_MIP, TokenGlyph } from "@/components/glyphs";
import { Button, Field, FormError, Input, Segmented, Select, Sheet } from "@/components/ui/primitives";
import { api, NIGHT, type Deployment, type Standard } from "@/lib/api";
import { cn, pad32Hex, units } from "@/lib/format";
import { useStore } from "@/lib/store";

export type SheetRequest =
  | { kind: "send"; from?: string }
  | { kind: "deploy" }
  | { kind: "new-agent" }
  | { kind: "appoint"; wallet: string }
  | { kind: "session"; wallet: string }
  | { kind: "token"; action: "mint" | "nft" | "transfer" | "convert" | "burn" | "metadata"; deployment: Deployment };

/** Submit, then show what happened in one line, closing on success. */
function useSubmit(onDone: () => void) {
  const { refresh } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (fn: () => Promise<unknown>, close = true) => {
    setBusy(true); setError(null);
    try { await fn(); await refresh("all"); if (close) onDone(); }
    catch (e) { setError((e as Error).message); }
    setBusy(false);
  };
  return { busy, error, submit };
}

const Queued = () => <p className="mb-3 text-[13px] text-ink-soft">This goes to the approval queue first. Nothing is signed until you approve it.</p>;

// ---------------------------------------------------------------------------

function SendSheet({ from, onClose }: { from?: string; onClose: () => void }) {
  const { wallets, holdingsList } = useStore();
  const [wallet, setWallet] = useState(from ?? "moddable-preview");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const options = holdingsList.filter((h) => h.wallet === wallet && h.asset.kind <= 1);
  const [asset, setAsset] = useState(`u:${NIGHT}`);
  const chosen = options.find((o) => o.asset.key === asset)?.asset ?? options[0]?.asset;
  const { busy, error, submit } = useSubmit(onClose);
  const privateAsset = chosen?.kind === 1;
  const toWallet = (w: string) => {
    const target = wallets.find((x) => x.wallet === w);
    setTo((privateAsset ? target?.shieldedAddress : target?.address) ?? "");
  };
  return (
    <Sheet open onClose={onClose} title="Send" footer={
      <Button className="w-full" size="lg" disabled={busy || !to || !amount || !chosen}
        onClick={() => submit(() => api.send({ wallet, kind: "transfer", to: to.trim(), amount: amount.trim(), token: chosen!.color! }))}>
        Queue payment
      </Button>}>
      <FormError message={error} />
      <Field label="From"><Select value={wallet} onChange={(e) => setWallet(e.target.value)}>{wallets.map((w) => <option key={w.wallet} value={w.wallet}>{w.name}</option>)}</Select></Field>
      <Field label="Asset">
        <Select value={chosen?.key ?? ""} onChange={(e) => setAsset(e.target.value)}>
          {options.map((o) => <option key={o.asset.key} value={o.asset.key}>{o.asset.name} ({units(o.amount, o.asset.decimals)}{o.asset.kind === 1 ? ", private" : ""})</option>)}
        </Select>
      </Field>
      <Field label="To" hint={privateAsset ? "A private token needs a private address (mn_shield-addr_…)" : "A public address (mn_addr_…)"}>
        <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder={privateAsset ? "mn_shield-addr_…" : "mn_addr_…"} />
      </Field>
      <div className="mb-3 flex flex-wrap gap-2">
        {wallets.filter((w) => w.wallet !== wallet).map((w) => (
          <button key={w.wallet} type="button" onClick={() => toWallet(w.wallet)} className="rounded-full bg-sunken px-3 py-1 text-sm font-semibold text-ink-soft hover:text-ink">{w.name}</button>
        ))}
      </div>
      <Field label="Amount" hint={chosen?.color === NIGHT ? "NIGHT, up to 6 decimals" : "Whole tokens"}>
        <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="figure text-xl" />
      </Field>
      <Queued />
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

const STANDARDS: { id: Standard; kind: 0 | 1 | 2 | 3; blurb: string }[] = [
  { id: "native_unshielded", kind: 0, blurb: "Public coins that move wallet to wallet, like NIGHT." },
  { id: "native_shielded", kind: 1, blurb: "Private coins: amounts and owners stay hidden as they move." },
  { id: "contract_token", kind: 2, blurb: "Public balances inside a contract, convertible to either kind of coin." },
  { id: "private_ledger", kind: 3, blurb: "Balances the contract keeps confidential. Transfers reveal nothing." },
];

function DeploySheet({ onClose }: { onClose: () => void }) {
  const [standard, setStandard] = useState<Standard>("native_unshielded");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("0");
  const { busy, error, submit } = useSubmit(onClose);
  return (
    <Sheet open onClose={onClose} title="Deploy a token" footer={
      <Button className="w-full" size="lg" disabled={busy || !name || !symbol}
        onClick={() => submit(() => api.tokenAction({ action: "deploy", standard, name, symbol, decimals: Number(decimals), domain: `moddable:${symbol.toLowerCase()}` }))}>
        Queue deploy
      </Button>}>
      <FormError message={error} />
      <div className="mb-4 grid gap-2">
        {STANDARDS.map((s) => (
          <button key={s.id} type="button" onClick={() => setStandard(s.id)} aria-pressed={standard === s.id}
            className={cn("flex items-center gap-3 rounded-[1rem] border-2 p-3 text-left transition-colors", standard === s.id ? "border-cosmic bg-cosmic-soft" : "border-line hover:border-ink-faint")}>
            <TokenGlyph kind={s.kind} />
            <span className="min-w-0"><span className="block font-semibold">{KIND_LABEL[s.kind]} <span className="text-[13px] font-medium text-ink-faint">{KIND_MIP[s.kind]}</span></span>
              <span className="block text-[13px] text-ink-soft">{s.blurb}</span></span>
          </button>
        ))}
      </div>
      <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Moddable Gold" maxLength={32} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Symbol"><Input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="GOLD" maxLength={8} /></Field>
        <Field label="Decimals"><Input inputMode="numeric" value={decimals} onChange={(e) => setDecimals(e.target.value)} /></Field>
      </div>
      <p className="mb-3 text-[13px] text-ink-soft">Every contract here issues fungible tokens and one-of-a-kind NFTs.</p>
      <Queued />
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

function NewAgentSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const { busy, error, submit } = useSubmit(onClose);
  return (
    <Sheet open onClose={onClose} title="Launch an agent" footer={
      <Button className="w-full" size="lg" disabled={busy || name.trim().length < 2} onClick={() => submit(() => api.createAgent({ name, role }))}>Create wallet</Button>}>
      <FormError message={error} />
      <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Juno" maxLength={24} /></Field>
      <Field label="Role"><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Scout in Midnight City" maxLength={120} /></Field>
      <p className="text-[13px] text-ink-soft">A new wallet is made on this machine; its key never leaves it. Then fund it, register it for DUST, appoint it to the treasury and give it a session, from the Operator tab.</p>
    </Sheet>
  );
}

function AppointSheet({ wallet, onClose }: { wallet: string; onClose: () => void }) {
  const { wallets } = useStore();
  const [cap, setCap] = useState("50");
  const [draws, setDraws] = useState("1");
  const { busy, error, submit } = useSubmit(onClose);
  const name = wallets.find((w) => w.wallet === wallet)?.name ?? wallet;
  return (
    <Sheet open onClose={onClose} title={`Appoint ${name}`} footer={
      <Button className="w-full" size="lg" disabled={busy} onClick={() => submit(() => api.agentStep(wallet, "appoint", { capPerDraw: cap, drawsPerPeriod: draws }))}>Queue appointment</Button>}>
      <FormError message={error} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Most per draw" hint="MCC"><Input inputMode="numeric" value={cap} onChange={(e) => setCap(e.target.value)} className="figure text-xl" /></Field>
        <Field label="Draws per period" hint="1 to 255"><Input inputMode="numeric" value={draws} onChange={(e) => setDraws(e.target.value)} className="figure text-xl" /></Field>
      </div>
      <p className="mb-3 flex items-start gap-2 text-[13px] text-ink-soft"><Lock size={15} className="mt-0.5 shrink-0 text-cosmic" />These terms stay private: the contract stores a salted hash and checks every draw against it. {name} also receives its Agent Smart Contract NFT.</p>
      <Queued />
    </Sheet>
  );
}

function SessionSheet({ wallet, onClose }: { wallet: string; onClose: () => void }) {
  const { wallets, refresh } = useStore();
  const [label, setLabel] = useState("Today's run");
  const [hours, setHours] = useState("8");
  const [maxRequests, setMaxRequests] = useState("50");
  const [maxNight, setMaxNight] = useState("10");
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = wallets.find((w) => w.wallet === wallet)?.name ?? wallet;
  const create = async () => {
    setError(null);
    try {
      const out = await api.agentStep<{ token: string }>(wallet, "sessions", { label, hours, maxRequests, maxNight });
      setToken(out.token);
      await refresh("all");
    } catch (e) { setError((e as Error).message); }
  };
  return (
    <Sheet open onClose={onClose} title={`Session for ${name}`} footer={token
      ? <Button className="w-full" size="lg" onClick={onClose}>Done</Button>
      : <Button className="w-full" size="lg" onClick={create}>Create session</Button>}>
      <FormError message={error} />
      {token ? (
        <div className="space-y-3">
          <p className="flex items-start gap-2 text-sm"><EyeOff size={16} className="mt-0.5 shrink-0 text-wait" />Give this token to {name}. It is shown once; only its hash is kept.</p>
          <button type="button" onClick={() => { navigator.clipboard.writeText(token); setCopied(true); }}
            className="flex w-full items-center gap-2 rounded-control bg-sunken p-3 text-left font-mono text-[12px] break-all">
            <span className="flex-1">{token}</span>{copied ? <Check size={16} className="text-ok" /> : <Copy size={16} />}
          </button>
        </div>
      ) : (
        <>
          <Field label="Label"><Input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={60} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Hours"><Input inputMode="numeric" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
            <Field label="Requests"><Input inputMode="numeric" value={maxRequests} onChange={(e) => setMaxRequests(e.target.value)} /></Field>
            <Field label="NIGHT"><Input inputMode="decimal" value={maxNight} onChange={(e) => setMaxNight(e.target.value)} /></Field>
          </div>
          <p className="text-[13px] text-ink-soft">When any limit runs out, or the session ends, its requests are refused before they reach you.</p>
        </>
      )}
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

const TITLES = { mint: "Mint", nft: "Mint an NFT", transfer: "Transfer", convert: "Convert", burn: "Burn", metadata: "Publish metadata" } as const;

function TokenSheet({ action, deployment: d, onClose }: { action: keyof typeof TITLES; deployment: Deployment; onClose: () => void }) {
  const { wallets, holdings } = useStore();
  const { busy, error, submit } = useSubmit(onClose);
  const [to, setTo] = useState("agent-floyd");
  const [amount, setAmount] = useState("");
  const [serial, setSerial] = useState("");
  const [holder, setHolder] = useState("moddable-preview");
  const fungible = d.tokens.filter((t) => !t.nft);
  const [domainHex, setDomainHex] = useState(d.tokens[0]?.domain ?? pad32Hex(`moddable:${d.symbol.toLowerCase()}`));
  const [direction, setDirection] = useState<"toShielded" | "toUnshielded" | "fromShielded" | "fromUnshielded">("toShielded");
  const [key, setKey] = useState("name");
  const [valType, setValType] = useState("string");
  const [value, setValue] = useState("");
  const [kind, setKind] = useState(String(d.kind));
  const balanceHere = holdings[holder]?.contract[`${d.address}:${domainHex}`] ?? "0";

  const body: Record<string, unknown> = { action: action === "nft" ? "mint" : action, contractAddress: d.address };
  let form: ReactNode;
  let ready = true;
  const tokenPicker = (list = d.tokens) => (
    <Field label="Token"><Select value={domainHex} onChange={(e) => setDomainHex(e.target.value)}>
      {list.map((t) => <option key={t.domain} value={t.domain}>{t.nft ? `NFT: ${t.label}` : `${d.symbol} (${t.label})`}</option>)}
    </Select></Field>
  );
  const recipient = (
    <Field label="To"><Select value={to} onChange={(e) => setTo(e.target.value)}>{wallets.map((w) => <option key={w.wallet} value={w.wallet}>{w.name}</option>)}</Select></Field>
  );
  const holderPicker = (
    <Field label="From" hint={d.storage === "contract" ? `${units(balanceHere, d.decimals)} held here` : undefined}><Select value={holder} onChange={(e) => setHolder(e.target.value)}>{wallets.map((w) => <option key={w.wallet} value={w.wallet}>{w.name}</option>)}</Select></Field>
  );
  const amountField = <Field label="Amount"><Input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="figure text-xl" /></Field>;

  if (action === "mint") {
    Object.assign(body, { to, amount, domain: d.storage === "contract" ? undefined : (fungible[0]?.label ?? `moddable:${d.symbol.toLowerCase()}`) });
    ready = /^\d+$/.test(amount);
    form = <>{recipient}{amountField}</>;
  } else if (action === "nft") {
    Object.assign(body, { nft: true, serial, to });
    ready = serial.trim().length > 0;
    form = <>{recipient}<Field label="Name of this one" hint="Unique within the contract"><Input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="Founder badge 2" maxLength={32} /></Field></>;
  } else if (action === "transfer") {
    Object.assign(body, { wallet: holder, to, domainHex, amount });
    ready = /^\d+$/.test(amount);
    form = <>{holderPicker}{tokenPicker()}{recipient}{amountField}
      {d.kind === 3 ? <p className="mb-3 flex items-start gap-2 text-[13px] text-ink-soft"><Lock size={15} className="mt-0.5 shrink-0 text-cosmic" />Private: the chain sees a nullifier and two commitments, not the token, amount or parties.</p> : null}</>;
  } else if (action === "convert") {
    Object.assign(body, { wallet: holder, domainHex, amount, direction });
    ready = /^\d+$/.test(amount);
    form = <>{holderPicker}{tokenPicker()}
      <Field label="Direction">
        <Segmented value={direction} onChange={setDirection} className="bg-sunken" options={[
          { value: "toShielded", label: "To private coin" }, { value: "toUnshielded", label: "To public coin" },
          { value: "fromShielded", label: "From private coin" }, { value: "fromUnshielded", label: "From public coin" },
        ]} />
      </Field>
      {amountField}
      <p className="mb-3 text-[13px] text-ink-soft">Private and public coins are different token types. The contract moves value between them through its balance, so the same asset can change form.</p></>;
  } else if (action === "burn") {
    Object.assign(body, { domainHex, amount });
    ready = /^\d+$/.test(amount);
    form = <>{tokenPicker(fungible)}{amountField}<p className="mb-3 text-[13px] text-ink-soft">Burns from the operator's own private coins. Public coins burn by being sent to the zero address.</p></>;
  } else {
    Object.assign(body, { domainHex, kind: Number(kind), key, valType, value });
    ready = key.trim().length > 0 && (valType === "null" || value.length > 0);
    const kinds = d.standard === "contract_token" ? ["2", "0", "1"] : d.standard === "private_ledger" ? ["3", "0", "1"] : [String(d.kind)];
    form = <>{tokenPicker()}
      <Field label="Describes"><Select value={kind} onChange={(e) => setKind(e.target.value)}>{kinds.map((k) => <option key={k} value={k}>{KIND_LABEL[Number(k) as 0]}</option>)}</Select></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Key"><Input value={key} onChange={(e) => setKey(e.target.value)} maxLength={32} /></Field>
        <Field label="Type"><Select value={valType} onChange={(e) => setValType(e.target.value)}>{["string", "integer", "uri", "json", "opaque", "null"].map((t) => <option key={t}>{t}</option>)}</Select></Field>
      </div>
      {valType !== "null" ? <Field label="Value" hint="Up to 189 bytes"><Input value={value} onChange={(e) => setValue(e.target.value)} /></Field> : null}</>;
  }

  return (
    <Sheet open onClose={onClose} title={`${TITLES[action]} ${d.symbol}`} footer={
      <Button className="w-full" size="lg" disabled={busy || !ready} onClick={() => submit(() => api.tokenAction(body))}>Queue {TITLES[action].toLowerCase()}</Button>}>
      <FormError message={error} />
      <div className="mb-4 flex items-center gap-3 rounded-[1rem] bg-sunken p-3">
        <TokenGlyph kind={d.kind} /><span><span className="block font-semibold">{d.name}</span><span className="text-[13px] text-ink-soft">{KIND_LABEL[d.kind]}, {d.mip}</span></span>
      </div>
      {form}
      <Queued />
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

export function Sheets({ sheet, onClose }: { sheet: SheetRequest | null; onClose: () => void }) {
  if (!sheet) return null;
  switch (sheet.kind) {
    case "send": return <SendSheet from={sheet.from} onClose={onClose} />;
    case "deploy": return <DeploySheet onClose={onClose} />;
    case "new-agent": return <NewAgentSheet onClose={onClose} />;
    case "appoint": return <AppointSheet wallet={sheet.wallet} onClose={onClose} />;
    case "session": return <SessionSheet wallet={sheet.wallet} onClose={onClose} />;
    case "token": return <TokenSheet action={sheet.action} deployment={sheet.deployment} onClose={onClose} />;
  }
}
