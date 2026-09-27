import { Ban, Bot, Check, ChevronRight, FileCheck2, Gauge, Landmark, Plus, ShieldCheck, Timer, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNav } from "@/App";
import { KIND_LABEL, TokenGlyph, WalletAvatar } from "@/components/glyphs";
import { RequestRow } from "@/components/request-row";
import { Button, Chip, Empty, Field, FormError, Input, Panel, Toggle } from "@/components/ui/primitives";
import { api, type AgentPolicy, type Wallet } from "@/lib/api";
import { ago, cn, dust, night, short, units, usd } from "@/lib/format";
import { useStore } from "@/lib/store";
import { groupByAsset, totalUsd } from "@/lib/totals";

function Balances({ w }: { w: Wallet }) {
  const { holdingsList, priceOf } = useStore();
  const groups = groupByAsset(holdingsList, priceOf, w.wallet);
  return (
    <section className="vault p-5">
      <div className="flex items-center gap-3">
        <WalletAvatar wallet={w} size={48} />
        <div className="min-w-0">
          <h1 className="truncate text-2xl">{w.name}</h1>
          <p className="truncate text-sm text-white/70">{w.role}</p>
        </div>
      </div>
      <p className="figure mt-4 text-4xl">{usd(totalUsd(groups))}</p>
      <p className="text-sm text-white/70">{night(w.night, 0)} NIGHT, {dust(w.dust)} DUST</p>
      <ul className="scroll-x mt-4 flex gap-2">
        {groups.filter((g) => !(g.asset.kind === 0 && g.asset.symbol === "NIGHT")).map((g) => (
          <li key={g.asset.key} className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm">
            <TokenGlyph asset={g.asset} size={32} />
            <span><span className="figure">{g.asset.nft ? g.asset.name : units(g.amount, g.asset.decimals)}</span>{g.asset.nft ? "" : ` ${g.asset.symbol}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Limits({ w }: { w: Wallet }) {
  const { policy, deployments, refresh } = useStore();
  const current = policy?.agents[w.wallet];
  const [draft, setDraft] = useState<AgentPolicy | null>(current ?? null);
  const [blockInput, setBlockInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setDraft(current ?? null); }, [w.wallet, policy]);
  if (!draft) return null;
  const dirty = JSON.stringify(draft) !== JSON.stringify(current);
  const contracts = [
    ...(policy?.crewTreasuryV3 ? [{ address: policy.crewTreasuryV3, name: "Crew treasury", fixed: true }] : []),
    { address: policy!.crewTreasury, name: "Crew treasury (v2)", fixed: true },
    ...deployments.filter((d) => !d.error).map((d) => ({ address: d.address, name: `${d.name} (${KIND_LABEL[d.kind].toLowerCase()})`, fixed: false })),
  ];
  const save = async () => {
    setError(null);
    try { await api.agentStep(w.wallet, "policy", draft); await refresh("all"); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e) { setError((e as Error).message); }
  };
  return (
    <Panel title="Limits" action={<Button size="sm" disabled={!dirty} onClick={save}>{saved ? <><Check size={15} />Saved</> : "Save limits"}</Button>}>
      <FormError message={error} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Per payment" hint="NIGHT paid without asking you">
          <Input inputMode="decimal" value={draft.spendCaps.perTransferNight} onChange={(e) => setDraft({ ...draft, spendCaps: { ...draft.spendCaps, perTransferNight: e.target.value } })} />
        </Field>
        <Field label="Per day" hint="NIGHT a day, in total">
          <Input inputMode="decimal" value={draft.spendCaps.dailyNight} onChange={(e) => setDraft({ ...draft, spendCaps: { ...draft.spendCaps, dailyNight: e.target.value } })} />
        </Field>
      </div>
      <div className="mb-4 flex items-center justify-between gap-3 rounded-[1rem] bg-sunken px-3 py-2.5">
        <span className="text-sm"><span className="font-semibold">Treasury draws run at once</span><br /><span className="text-ink-soft">The contract still enforces the agent's cap</span></span>
        <Toggle checked={draft.autoDraw} onChange={(v) => setDraft({ ...draft, autoDraw: v })} label="Auto-approve treasury draws" />
      </div>

      <h3 className="mb-1 flex items-center gap-2 text-base"><FileCheck2 size={16} />Contracts it may call</h3>
      <ul className="mb-4">
        {contracts.map((c) => {
          const on = c.fixed || draft.whitelistedContracts.includes(c.address);
          return (
            <li key={c.address} className="flex items-center gap-3 py-1.5">
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{c.name}</span><span className="block font-mono text-[11px] text-ink-faint">{short(c.address, 8, 6)}</span></span>
              {c.fixed ? <Chip tone="cosmic">Always</Chip> : (
                <Toggle checked={on} label={`Allow ${c.name}`} onChange={(v) => setDraft({ ...draft,
                  whitelistedContracts: v ? [...draft.whitelistedContracts, c.address] : draft.whitelistedContracts.filter((a) => a !== c.address) })} />
              )}
            </li>
          );
        })}
      </ul>

      <h3 className="mb-1 flex items-center gap-2 text-base"><Ban size={16} />Addresses it may never pay</h3>
      <ul className="mb-2">
        {draft.blockedAddresses.map((a) => (
          <li key={a} className="flex items-center gap-2 py-1 text-sm">
            <span className="min-w-0 flex-1 truncate font-mono text-[12px]">{a}</span>
            <button type="button" aria-label="Remove" onClick={() => setDraft({ ...draft, blockedAddresses: draft.blockedAddresses.filter((x) => x !== a) })}><X size={15} /></button>
          </li>
        ))}
        {!draft.blockedAddresses.length ? <li className="text-sm text-ink-faint">Only the operator's list applies.</li> : null}
      </ul>
      <div className="flex gap-2">
        <Input value={blockInput} onChange={(e) => setBlockInput(e.target.value)} placeholder="mn_addr_…" aria-label="Address to block for this agent" />
        <Button tone="soft" disabled={!blockInput.trim()} onClick={() => { setDraft({ ...draft, blockedAddresses: [...draft.blockedAddresses, blockInput.trim()] }); setBlockInput(""); }}><Plus size={16} /></Button>
      </div>
    </Panel>
  );
}

function TreasuryTerms({ w }: { w: Wallet }) {
  const { treasury } = useStore();
  const { open } = useNav();
  const t = treasury?.terms?.[w.wallet];
  return (
    <Panel title={<span className="flex items-center gap-2"><Landmark size={18} />Treasury terms</span>}
      action={treasury?.address ? <Button size="sm" tone="soft" onClick={() => open({ kind: "appoint", wallet: w.wallet })}>{t ? "Reappoint" : "Appoint"}</Button> : null}>
      {t ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1rem] bg-sunken p-3"><p className="text-[13px] text-ink-soft">Most per draw</p><p className="figure text-2xl">{units(t.capPerDraw)} <span className="text-base text-ink-soft">MCC</span></p></div>
          <div className="rounded-[1rem] bg-sunken p-3"><p className="text-[13px] text-ink-soft">Draws per period</p><p className="figure text-2xl">{t.drawsPerPeriod}</p></div>
          <p className="col-span-2 flex items-start gap-2 text-[13px] text-ink-soft"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-cosmic" />Enforced by the contract. The chain holds only a salted hash of these terms.</p>
        </div>
      ) : <p className="text-sm text-ink-soft">{treasury?.address ? "Not appointed yet." : "Deploy the treasury from the Operator tab first."}</p>}
    </Panel>
  );
}

function Sessions({ w }: { w: Wallet }) {
  const { policy, refresh } = useStore();
  const { open } = useNav();
  const [error, setError] = useState<string | null>(null);
  const list = policy?.sessions.filter((s) => s.wallet === w.wallet) ?? [];
  return (
    <Panel title={<span className="flex items-center gap-2"><Timer size={18} />Sessions</span>} action={<Button size="sm" tone="soft" onClick={() => open({ kind: "session", wallet: w.wallet })}><Plus size={15} />New</Button>}>
      <FormError message={error} />
      {list.length ? (
        <ul>
          {list.map((s) => (
            <li key={s.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0">
              <Gauge size={18} className={s.status === "active" ? "text-cosmic" : "text-ink-faint"} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{s.label}</p>
                <p className="text-[13px] text-ink-soft">{s.used.requests}/{s.maxRequests} requests, {s.used.night}/{s.maxNight} NIGHT, {s.status === "active" ? `ends ${new Date(s.expiresAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : `made ${ago(s.createdAt)}`}</p>
              </div>
              {s.status === "active" ? (
                <Button size="sm" tone="bad" onClick={async () => { try { await api.revokeSession(s.id); await refresh("all"); } catch (e) { setError((e as Error).message); } }}>Revoke</Button>
              ) : <Chip>{s.status === "revoked" ? "Revoked" : "Expired"}</Chip>}
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-ink-soft">A session gives the agent a token that expires, with its own request and NIGHT budget.</p>}
    </Panel>
  );
}

export function AgentsTab() {
  const { wallets, requests } = useStore();
  const { focus, go, open } = useNav();
  const agents = wallets.filter((w) => w.kind === "agent");
  const selected = agents.find((a) => a.wallet === focus) ?? null;

  if (!agents.length) {
    return <Panel><Empty icon={<Bot size={20} />} title="No agents yet" action={<Button onClick={() => open({ kind: "new-agent" })}><UserPlus size={16} />Launch agent</Button>} /></Panel>;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <div className={cn("space-y-3", selected && "hidden lg:block")}>
        <div className="flex items-center justify-between"><h1 className="text-3xl">Agents</h1>
          <Button size="sm" onClick={() => open({ kind: "new-agent" })}><UserPlus size={15} />New</Button></div>
        <ul className="overflow-hidden rounded-panel bg-surface">
          {agents.map((a) => (
            <li key={a.wallet}>
              <button type="button" onClick={() => go("agents", a.wallet)}
                className={cn("flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left last:border-0", a.wallet === focus ? "bg-cosmic-soft" : "hover:bg-sunken")}>
                <WalletAvatar wallet={a} />
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{a.name}</span>
                  <span className="block truncate text-[13px] text-ink-soft">{night(a.night, 0)} NIGHT</span></span>
                <ChevronRight size={16} className="text-ink-faint" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selected ? (
        <div className="min-w-0 space-y-5">
          <button type="button" onClick={() => go("agents")} className="text-sm font-semibold text-cosmic lg:hidden">All agents</button>
          <Balances w={selected} />
          <div className="grid gap-5 2xl:grid-cols-2">
            <Limits w={selected} />
            <div className="space-y-5">
              <TreasuryTerms w={selected} />
              <Sessions w={selected} />
            </div>
          </div>
          <Panel title="Recent requests" flush>
            {(() => {
              const mine = requests.filter((r) => r.wallet === selected.wallet).slice(0, 8);
              return mine.length ? <ul>{mine.map((r) => <RequestRow key={r.id} r={r} />)}</ul> : <p className="px-5 pb-5 text-sm text-ink-soft">None yet.</p>;
            })()}
          </Panel>
        </div>
      ) : (
        <Panel className="hidden lg:block"><Empty icon={<Bot size={20} />} title="Pick an agent">Its balances, limits, treasury terms and sessions open here.</Empty></Panel>
      )}
    </div>
  );
}
