import { Ban, Check, Circle, Copy, Fuel, KeyRound, Landmark, Pause, Play, Plus, RotateCcw, Timer, UserPlus, Wallet as WalletIcon, X } from "lucide-react";
import { useState } from "react";
import { useNav } from "@/App";
import { WalletAvatar } from "@/components/glyphs";
import { Button, Chip, Empty, FormError, Input, Panel } from "@/components/ui/primitives";
import { api, type Wallet } from "@/lib/api";
import { cn, dust, night, short, units } from "@/lib/format";
import { useStore } from "@/lib/store";

function CopyText({ text }: { text: string | null }) {
  const [done, setDone] = useState(false);
  if (!text) return <span className="text-ink-faint">—</span>;
  return (
    <button type="button" className="inline-flex max-w-full items-center gap-1.5 font-mono text-[12px] text-ink-soft hover:text-ink"
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      <span className="truncate">{short(text, 16, 8)}</span>{done ? <Check size={13} className="text-ok" /> : <Copy size={13} />}
    </button>
  );
}

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
  return (
    <section className="vault p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <WalletAvatar wallet={w} size={48} />
        <div>
          <h1 className="text-2xl">Operator</h1>
          <p className="text-sm text-white/70">Holds the master key. Every agent answers to it.</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div><p className="text-[13px] text-white/60">NIGHT</p><p className="figure text-2xl">{night(w.night, 0)}</p></div>
        <div><p className="text-[13px] text-white/60">DUST for fees</p><p className="figure text-2xl">{dust(w.dust)}</p></div>
        <div className="col-span-2 space-y-1 text-white/80 [&_button]:text-white/80">
          <p className="text-[13px] text-white/60">Public address</p><CopyText text={w.address} />
          <p className="text-[13px] text-white/60">Private address</p><CopyText text={w.shieldedAddress} />
        </div>
      </div>
    </section>
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
  const { wallets, treasury, policy } = useStore();
  const { open, go } = useNav();
  const { busy, error, act } = useAct();
  const agents = wallets.filter((w) => w.kind === "agent");
  return (
    <Panel title="Agents" action={<Button size="sm" onClick={() => open({ kind: "new-agent" })}><UserPlus size={15} />Launch agent</Button>}>
      <FormError message={error} />
      <div className="grid gap-3 sm:grid-cols-2">
        {agents.map((a) => {
          const funded = BigInt(a.night ?? 0) > 0n;
          const appointed = Boolean(treasury?.terms?.[a.wallet]);
          const sessions = policy?.sessions.filter((s) => s.wallet === a.wallet && s.status === "active").length ?? 0;
          return (
            <div key={a.wallet} className="rounded-[1rem] bg-sunken p-4">
              <button type="button" onClick={() => go("agents", a.wallet)} className="flex w-full items-center gap-3 text-left">
                <WalletAvatar wallet={a} size={32} />
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{a.name}</span>
                  <span className="block truncate text-[13px] text-ink-soft">{a.status === "ready" ? `${night(a.night, 0)} NIGHT` : a.status}</span></span>
              </button>
              <ul className="mt-2">
                <Step done={funded} label="Funded with NIGHT" action={<Button size="sm" tone="soft" disabled={busy !== null} onClick={() => act(`fund-${a.wallet}`, () => api.agentStep(a.wallet, "fund", { amount: "100" }))}><WalletIcon size={14} />Send 100</Button>} />
                <Step done={Boolean(a.dustRegistered)} label="Generating DUST" action={<Button size="sm" tone="soft" disabled={!funded || busy !== null} onClick={() => act(`dust-${a.wallet}`, () => api.agentStep(a.wallet, "dust", {}))}><Fuel size={14} />Register</Button>} />
                <Step done={appointed} label="Appointed to the treasury" action={<Button size="sm" tone="soft" disabled={!treasury?.address} onClick={() => open({ kind: "appoint", wallet: a.wallet })}><Landmark size={14} />Appoint</Button>} />
                <Step done={sessions > 0} label={sessions ? `${sessions} active session${sessions > 1 ? "s" : ""}` : "Session for the agent"} action={<Button size="sm" tone="soft" onClick={() => open({ kind: "session", wallet: a.wallet })}><Timer size={14} />Create</Button>} />
              </ul>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Treasury() {
  const { treasury } = useStore();
  const { busy, error, act } = useAct();
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 10));
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
  return (
    <Panel title="Crew treasury" action={t.paused ? <Chip tone="bad">Paused</Chip> : <Chip tone="ok">Open</Chip>}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["MCC", units(t.minted)], ["Mandates", t.mandates], ["Draws", t.draws], ["Epoch", String(t.epoch)]].map(([k, v]) => (
          <div key={k} className="rounded-[1rem] bg-sunken p-3"><p className="text-[13px] text-ink-soft">{k}</p><p className="figure text-xl">{v}</p></div>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-soft">Current period <span className="font-semibold text-ink">{t.period || "none"}</span></p>
      <FormError message={error} />
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="flex gap-2">
          <Input value={period} onChange={(e) => setPeriod(e.target.value)} className="h-9 w-36" aria-label="Period" />
          <Button size="sm" tone="soft" disabled={busy !== null} onClick={() => act("period", () => api.treasuryAction({ action: "openPeriod", period }))}>Open period</Button>
        </div>
        <Button size="sm" tone="soft" disabled={busy !== null} onClick={() => act("pause", () => api.treasuryAction({ action: "pause", paused: !t.paused }))}>
          {t.paused ? <><Play size={14} />Resume draws</> : <><Pause size={14} />Pause draws</>}
        </Button>
        <Button size="sm" tone="bad" disabled={busy !== null} onClick={() => confirm("Revoke every mandate? Agents stop drawing until you appoint them again.") && act("revoke", () => api.treasuryAction({ action: "revokeAll" }))}>
          <RotateCcw size={14} />Revoke all
        </Button>
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
    <Panel title="Blocked addresses">
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
  const { wallets } = useStore();
  const organiser = wallets.find((w) => w.kind === "human");
  return (
    <div className="space-y-5">
      {organiser ? <Identity w={organiser} /> : <Panel><Empty icon={<KeyRound size={20} />} title="The operator wallet is still opening" /></Panel>}
      <AgentSetup />
      <div className="grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
        <Treasury />
        <BlockedList />
      </div>
    </div>
  );
}
