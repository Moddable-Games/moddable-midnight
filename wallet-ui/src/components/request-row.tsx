import { ArrowUpRight, Bot, Check, ChevronDown, Code2, ExternalLink, Fuel, Loader2, Rocket, ShieldBan, X } from "lucide-react";
import { useState } from "react";
import { api, NIGHT, type WalletRequest } from "@/lib/api";
import { ago, cn, explorer, night, short } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Button, Chip } from "./ui/primitives";

const IN_FLIGHT = new Set(["approved", "building", "balancing", "signing", "proving", "submitting", "submitted"]);

export function statusChip(r: WalletRequest) {
  if (r.status === "pending") return <Chip tone="wait">Waiting</Chip>;
  if (r.status === "confirmed") return <Chip tone="ok">{r.autoApproved ? "Auto-approved" : "Done"}</Chip>;
  if (r.status === "refused") return <Chip tone="bad">Refused</Chip>;
  if (r.status === "rejected") return <Chip>Rejected</Chip>;
  if (r.status === "failed") return <Chip tone="bad">Failed</Chip>;
  return <Chip tone="cosmic"><Loader2 size={11} className="animate-spin" />{r.status[0].toUpperCase() + r.status.slice(1)}</Chip>;
}

function kindIcon(r: WalletRequest) {
  if (r.status === "refused") return <ShieldBan size={18} />;
  if (r.kind === "transfer") return <ArrowUpRight size={18} />;
  if (r.kind === "deploy") return <Rocket size={18} />;
  if (r.kind === "dust-register") return <Fuel size={18} />;
  return <Code2 size={18} />;
}

export function requestTitle(r: WalletRequest, walletName: (w: string) => string) {
  if (r.note) return r.note;
  if (r.kind === "transfer") return `Send ${(r.token ?? NIGHT) === NIGHT ? `${night(r.amount)} NIGHT` : `${r.amount} ${r.amount === "1" ? "token" : "tokens"}`}`;
  if (r.kind === "deploy") return `Deploy ${r.contract}`;
  if (r.kind === "dust-register") return `${walletName(r.wallet)} registers for DUST`;
  return `${r.contract}.${r.circuit}`;
}

export function RequestRow({ r, compact = false }: { r: WalletRequest; compact?: boolean }) {
  const { wallets, refresh } = useStore();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const walletName = (w: string) => wallets.find((x) => x.wallet === w)?.name ?? w;
  const byAgent = r.requestedBy.startsWith("agent:");

  const decide = async (approve: boolean) => {
    setBusy(true);
    setError(null);
    try {
      await (approve ? api.approve(r.id) : api.reject(r.id));
      await refresh();
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };

  return (
    <li className="border-b border-line last:border-0">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-full",
          r.status === "pending" ? "bg-wait-soft text-wait" : r.status === "refused" || r.status === "failed" ? "bg-bad-soft text-bad"
            : IN_FLIGHT.has(r.status) ? "bg-cosmic-soft text-cosmic" : "bg-sunken text-ink-soft")}>
          {kindIcon(r)}
        </span>
        <button type="button" onClick={() => setOpen(!open)} className="min-w-0 flex-1 text-left" aria-expanded={open}>
          <span className="block truncate font-semibold">{requestTitle(r, walletName)}</span>
          <span className="flex items-center gap-1.5 text-[13px] text-ink-soft">
            {byAgent ? <Bot size={13} /> : null}
            <span className="truncate">{walletName(r.wallet)}</span>
            <span className="text-ink-faint">{ago(r.createdAt)}</span>
          </span>
        </button>
        {r.status === "pending" && !compact ? (
          <div className="flex shrink-0 gap-1.5">
            <Button size="sm" tone="bad" onClick={() => decide(false)} disabled={busy} aria-label="Reject"><X size={15} /></Button>
            <Button size="sm" tone="ok" onClick={() => decide(true)} disabled={busy}><Check size={15} />Approve</Button>
          </div>
        ) : (
          <span className="shrink-0">{statusChip(r)}</span>
        )}
        <ChevronDown size={16} className={cn("hidden shrink-0 text-ink-faint transition-transform sm:block", open && "rotate-180")} />
      </div>
      {r.status === "pending" && compact ? (
        <div className="flex gap-2 px-4 pb-3 sm:px-5">
          <Button size="sm" tone="bad" onClick={() => decide(false)} disabled={busy}>Reject</Button>
          <Button size="sm" tone="ok" className="flex-1" onClick={() => decide(true)} disabled={busy}><Check size={15} />Approve</Button>
        </div>
      ) : null}
      {error ? <p className="px-5 pb-3 text-sm text-bad">{error}</p> : null}
      {open ? (
        <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-1.5 bg-sunken px-5 py-3 text-[13px]">
          {r.policy ? (<><dt className="text-ink-faint">Policy</dt><dd>{r.policy}</dd></>) : null}
          <dt className="text-ink-faint">Requested by</dt><dd>{r.requestedBy === "browser" ? "Operator (this app)" : r.requestedBy}</dd>
          {r.to ? (<><dt className="text-ink-faint">To</dt><dd className="break-all font-mono text-[12px]">{short(r.to, 18, 8)}</dd></>) : null}
          {r.contractAddress ? (<><dt className="text-ink-faint">Contract</dt><dd>
            <a className="inline-flex items-center gap-1 font-mono text-[12px] text-cosmic" href={explorer.contract(r.contractAddress)} target="_blank" rel="noopener">{short(r.contractAddress)}<ExternalLink size={12} /></a>
          </dd></>) : null}
          {r.txHash ? (<><dt className="text-ink-faint">Transaction</dt><dd>
            <a className="inline-flex items-center gap-1 font-mono text-[12px] text-cosmic" href={explorer.tx(r.txHash)} target="_blank" rel="noopener">{short(r.txHash)}<ExternalLink size={12} /></a>
          </dd></>) : null}
          {r.block ? (<><dt className="text-ink-faint">Block</dt><dd className="figure">{r.block.toLocaleString("en-GB")}</dd></>) : null}
          {r.error ? (<><dt className="text-ink-faint">Error</dt><dd className="text-bad">{r.error.split("\n")[0]}</dd></>) : null}
        </dl>
      ) : null}
    </li>
  );
}
