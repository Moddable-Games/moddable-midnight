import { Ban, Check, ChevronDown, Circle, Fuel, KeyRound, Landmark, Pause, Play, Plus, RotateCcw, Timer, UserPlus, Users, Wallet as WalletIcon, X } from "lucide-react";
import { useState } from "react";
import { useNav } from "@/App";
import { WalletAvatar } from "@/components/glyphs";
import { AgentControls, AssetList, CopyAddress, MoneyActions } from "@/components/wallet-parts";
import { Button, Chip, Empty, FormError, Input, Panel } from "@/components/ui/primitives";
import { api, type Wallet } from "@/lib/api";
import { cn, dust, night, units, usd } from "@/lib/format";
import { useStore } from "@/lib/store";
import { groupByAsset, totalUsd } from "@/lib/totals";

/** Run an action, refresh, report failure: the same shape for every button here. */
function useAct() {
  const { refresh } = useStore();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const act = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key); setError(null);
    try { await fn(); await refresh("all"); } catch (e) { setError((e as Error).message); }
    setBusy(null);
  };
  return { busy, error, act };
}

function Identity({ w }: { w: Wallet }) {
  const { holdingsList, priceOf } = useStore();
  const value = totalUsd(groupByAsset(holdingsList, priceOf, w.wallet));
  return (
    <section className="vault p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <WalletAvatar wallet={w} size={48} />
          <div>
            <h1 className="text-2xl">{w.name}</h1>
            <p className="text-sm text-white/70">Holds the master key. Every agent answers to it.</p>
          </div>
        </div>
        <MoneyActions w={w} />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-end [&>*]:min-w-0">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          <div className="min-w-0"><p className="text-[13px] text-white/60">Worth</p><p className="figure truncate text-2xl sm:text-3xl">{usd(value)}</p></div>
          <div className="min-w-0"><p className="text-[13px] text-white/60">NIGHT</p><p className="figure truncate text-2xl sm:text-3xl">{night(w.night, 0)}</p></div>
          <div className="min-w-0"><p className="text-[13px] text-white/60">DUST</p><p className="figure truncate text-2xl sm:text-3xl">{dust(w.dust)}</p></div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 [&>*]:min-w-0">
          <CopyAddress dark label="Public address" value={w.address} />
          <CopyAddress dark label="Private address" value={w.shieldedAddress} />
        </div>
      </div>
    </section>
  );
}

function Accounts() {
  const { active, holdingsList, priceOf } = useStore();
  const { open } = useNav();
  const [expanded, setExpanded] = useState<string | null>(null);
  const accounts = active.filter((w) => w.kind === "human" && !w.operator);
  return (
    <Panel flush title={<span className="flex items-center gap-2"><Users size={18} />Accounts</span>}
      action={<Button size="sm" tone="soft" onClick={() => open({ kind: "new-account" })}><Plus size={15} />New account</Button>}>
      {accounts.length ? (
        <ul className="pb-2">
          {accounts.map((a) => {
            const isOpen = expanded === a.wallet;
            return (
              <li key={a.wallet} className="border-b border-line last:border-0">
                <button type="button" onClick={() => setExpanded(isOpen ? null : a.wallet)} aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-sunken sm:px-5">
                  <WalletAvatar wallet={a} size={32} />
                  <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{a.name}</span>
                    <span className="block truncate text-[13px] text-ink-soft">{a.role}</span></span>
                  <span className="figure">{usd(totalUsd(groupByAsset(holdingsList, priceOf, a.wallet)))}</span>
                  <ChevronDown size={16} className={cn("text-ink-faint transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen ? (
                  <div className="space-y-3 px-4 pb-4 sm:px-5">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <CopyAddress label="Public address" value={a.address} />
                      <CopyAddress label="Private address" value={a.shieldedAddress} />
                    </div>
                    <div className="-mx-4 sm:-mx-5"><AssetList wallet={a.wallet} empty="Nothing here yet. Send it NIGHT from the operator." /></div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => open({ kind: "send", from: a.wallet })}>Send from {a.name}</Button>
                      <Button size="sm" tone="soft" onClick={() => open({ kind: "receive", wallet: a.wallet })}>Receive</Button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-5 pb-5 text-sm text-ink-soft">Accounts for people and purposes, such as payroll, grants or a team budget. Each is its own wallet on this machine.</p>
      )}
    </Panel>
  );
}

function Treasury() {
  const { treasury, active } = useStore();
  const { open } = useNav();
  const { busy, error, act } = useAct();
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 10));
  const [mint, setMint] = useState("");
  if (!treasury?.address) {
    return (
      <Panel title="Crew treasury">
        <Empty icon={<Landmark size={20} />} title="The treasury is not deployed">
          It holds the crew's MCC and pays each agent within private limits the chain enforces.
        </Empty>
        <FormError message={error} />
        <Button className="w-full" disabled={busy !== null} onClick={() => act("deploy", () => api.treasuryAction({ action: "deploy" }))}>Deploy treasury</Button>
      </Panel>
    );
  }
  const t = treasury;
  const appointed = Object.entries(t.terms ?? {}).map(([wallet, terms]) => ({ w: active.find((x) => x.wallet === wallet), wallet, terms }));
  return (
    <Panel title={<span className="flex items-center gap-2"><Landmark size={18} />Crew treasury</span>}
      action={t.paused ? <Chip tone="bad">Draws paused</Chip> : <Chip tone="ok">Draws open</Chip>}>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[["MCC minted", units(t.minted)], ["Draws", t.draws], ["Epoch", String(t.epoch)]].map(([k, v]) => (
              <div key={k} className="rounded-[1rem] bg-sunken p-3"><p className="text-[13px] text-ink-soft">{k}</p><p className="figure text-xl">{v}</p></div>
            ))}
          </div>
          <p className="text-sm text-ink-soft">Current period <span className="font-semibold text-ink">{t.period || "none"}</span>. Each agent draws within its own cap, up to its draws per period.</p>
          <FormError message={error} />
          <div className="flex flex-wrap gap-2">
            <Input value={period} onChange={(e) => setPeriod(e.target.value)} className="h-9 w-36" aria-label="Period" />
            <Button size="sm" tone="soft" disabled={busy !== null} onClick={() => act("period", () => api.treasuryAction({ action: "openPeriod", period }))}>Open period</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input value={mint} onChange={(e) => setMint(e.target.value)} inputMode="numeric" placeholder="MCC" className="h-9 w-36" aria-label="MCC to mint" />
            <Button size="sm" tone="soft" disabled={busy !== null || !/^\d+$/.test(mint)} onClick={() => act("mint", () => api.treasuryAction({ action: "mint", amount: mint }))}>Mint into treasury</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" tone="soft" disabled={busy !== null} onClick={() => act("pause", () => api.treasuryAction({ action: "pause", paused: !t.paused }))}>
              {t.paused ? <><Play size={14} />Resume draws</> : <><Pause size={14} />Pause draws</>}
            </Button>
            <Button size="sm" tone="bad" disabled={busy !== null} onClick={() => confirm("Revoke every mandate? No agent can draw until you appoint it again.") && act("revoke", () => api.treasuryAction({ action: "revokeAll" }))}>
              <RotateCcw size={14} />Revoke all
            </Button>
          </div>
        </div>
        <div>
          <h3 className="mb-1 text-base">Appointed agents <span className="font-sans text-sm font-medium text-ink-faint">{appointed.length}</span></h3>
          <p className="mb-2 text-[13px] text-ink-soft">The chain holds only a salted hash of each agent's terms, and cannot tell which agent drew.</p>
          <ul className="overflow-hidden rounded-[1rem] border border-line">
            {appointed.map(({ w, wallet, terms }) => (
              <li key={wallet} className="flex items-center gap-3 border-b border-line px-3 py-2.5 last:border-0">
                {w ? <WalletAvatar wallet={w} size={32} /> : null}
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{w?.name ?? wallet}</span>
                  <span className="block text-[13px] text-ink-soft">Up to <span className="figure text-ink">{units(terms.capPerDraw)}</span> MCC a draw, {terms.drawsPerPeriod} a period</span></span>
                <Button size="sm" tone="ghost" onClick={() => open({ kind: "appoint", wallet })}>Change</Button>
              </li>
            ))}
            {!appointed.length ? <li className="px-3 py-3 text-sm text-ink-faint">No agent is appointed in this epoch.</li> : null}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

function Step({ done, label, action }: { done: boolean; label: string; action?: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 py-1 text-sm">
      {done ? <Check size={16} className="text-ok" /> : <Circle size={16} className="text-ink-faint" />}
      <span className={cn("flex-1", done ? "text-ink-soft" : "font-semibold")}>{label}</span>
      {!done ? action : null}
    </li>
  );
}

function AgentSetup() {
  const { active, treasury, policy } = useStore();
  const { open, go } = useNav();
  const { busy, error, act } = useAct();
  const agents = active.filter((w) => w.kind === "agent");
  return (
    <Panel title="Agents" action={<Button size="sm" onClick={() => open({ kind: "new-agent" })}><UserPlus size={15} />Launch agent</Button>}>
      <FormError message={error} />
      <div className="grid gap-3 md:grid-cols-2">
        {agents.map((a) => {
          const funded = BigInt(a.night ?? 0) > 0n;
          const appointed = Boolean(treasury?.terms?.[a.wallet]);
          const sessions = policy?.sessions.filter((s) => s.wallet === a.wallet && s.status === "active").length ?? 0;
          const paused = policy?.agents[a.wallet]?.paused;
          return (
            <div key={a.wallet} className="rounded-[1rem] bg-sunken p-4">
              <button type="button" onClick={() => go("agents", a.wallet)} className="flex w-full items-center gap-3 text-left">
                <WalletAvatar wallet={a} size={32} />
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{a.name}</span>
                  <span className="block truncate text-[13px] text-ink-soft">{a.status === "ready" ? `${night(a.night, 0)} NIGHT` : a.status}</span></span>
                {paused ? <Chip tone="wait">Paused</Chip> : null}
              </button>
              <ul className="mt-2">
                <Step done={funded} label="Funded with NIGHT" action={<Button size="sm" tone="soft" disabled={busy !== null} onClick={() => act(`fund-${a.wallet}`, () => api.agentStep(a.wallet, "fund", { amount: "100" }))}><WalletIcon size={14} />Send 100</Button>} />
                <Step done={Boolean(a.dustRegistered)} label="Generating DUST" action={<Button size="sm" tone="soft" disabled={!funded || busy !== null} onClick={() => act(`dust-${a.wallet}`, () => api.agentStep(a.wallet, "dust", {}))}><Fuel size={14} />Register</Button>} />
                <Step done={appointed} label="Appointed to the treasury" action={<Button size="sm" tone="soft" disabled={!treasury?.address} onClick={() => open({ kind: "appoint", wallet: a.wallet })}><Landmark size={14} />Appoint</Button>} />
                <Step done={sessions > 0} label={sessions ? `${sessions} active session${sessions > 1 ? "s" : ""}` : "Session for the agent"} action={<Button size="sm" tone="soft" onClick={() => open({ kind: "session", wallet: a.wallet })}><Timer size={14} />Create</Button>} />
              </ul>
              <div className="mt-3 border-t border-line pt-3"><AgentControls w={a} compact /></div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function BlockedList() {
  const { policy, treasury } = useStore();
  const { busy, error, act } = useAct();
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const list = policy?.blockedAddresses ?? [];
  const add = () => act("add", async () => {
    await api.setBlocked([...list, { address: address.trim(), note }]);
    if (treasury?.address && address.startsWith("mn_addr")) await api.treasuryAction({ action: "block", address: address.trim() });
    setAddress(""); setNote("");
  });
  return (
    <Panel title={<span className="flex items-center gap-2"><Ban size={18} />Blocked addresses</span>}>
      <p className="mb-3 text-sm text-ink-soft">No agent may pay these. Public addresses are also blocked in the treasury contract itself.</p>
      <FormError message={error} />
      <ul className="mb-3">
        {list.map((b) => (
          <li key={b.address} className="flex items-center gap-2 border-b border-line py-2 last:border-0">
            <Ban size={16} className="text-bad" />
            <span className="min-w-0 flex-1"><span className="block truncate font-mono text-[12px]">{b.address}</span>{b.note ? <span className="text-[13px] text-ink-soft">{b.note}</span> : null}</span>
            <button type="button" aria-label="Unblock" className="text-ink-faint hover:text-ink" disabled={busy !== null}
              onClick={() => act("rm", async () => {
                await api.setBlocked(list.filter((x) => x.address !== b.address));
                if (treasury?.address && b.address.startsWith("mn_addr")) await api.treasuryAction({ action: "unblock", address: b.address });
              })}><X size={16} /></button>
          </li>
        ))}
        {!list.length ? <li className="text-sm text-ink-faint">None yet.</li> : null}
      </ul>
      <div className="space-y-2">
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="mn_addr_… or mn_shield-addr_…" aria-label="Address to block" />
        <div className="flex gap-2">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why (optional)" aria-label="Note" className="min-w-0 flex-1" />
          <Button disabled={!address.trim() || busy !== null} onClick={add}><Plus size={16} />Block</Button>
        </div>
      </div>
    </Panel>
  );
}

export function OperatorTab() {
  const { operator } = useStore();
  return (
    <div className="space-y-5">
      {operator ? <Identity w={operator} /> : <Panel><Empty icon={<KeyRound size={20} />} title="The operator account is still opening" /></Panel>}
      <div className="grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
        <Panel flush title="What the operator holds">{operator ? <AssetList wallet={operator.wallet} /> : null}</Panel>
        <Accounts />
      </div>
      <Treasury />
      <AgentSetup />
      <BlockedList />
    </div>
  );
}
