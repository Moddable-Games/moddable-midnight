import { ArrowDownUp, Inbox, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { RequestRow, requestTitle } from "@/components/request-row";
import { Chip, Empty, Input, Panel, Segmented, Select } from "@/components/ui/primitives";
import { useStore } from "@/lib/store";

type StatusFilter = "all" | "waiting" | "done" | "refused" | "failed";
const IN_FLIGHT = new Set(["approved", "building", "balancing", "signing", "proving", "submitting", "submitted"]);

export function ActivityTab() {
  const { requests, wallets, pending } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [wallet, setWallet] = useState("all");
  const [kind, setKind] = useState("all");
  const [newestFirst, setNewestFirst] = useState(true);
  const walletName = (w: string) => wallets.find((x) => x.wallet === w)?.name ?? w;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = requests.filter((r) => {
      if (r.status === "pending") return false; // shown above
      if (status === "waiting" && !IN_FLIGHT.has(r.status)) return false;
      if (status === "done" && r.status !== "confirmed") return false;
      if (status === "refused" && r.status !== "refused" && r.status !== "rejected") return false;
      if (status === "failed" && r.status !== "failed") return false;
      if (wallet !== "all" && r.wallet !== wallet) return false;
      if (kind !== "all" && r.kind !== kind) return false;
      if (!q) return true;
      return [requestTitle(r, walletName), r.requestedBy, r.txHash, r.contractAddress, r.to, r.circuit, r.policy, walletName(r.wallet)]
        .some((f) => f?.toLowerCase().includes(q));
    });
    return newestFirst ? list : [...list].reverse();
  }, [requests, query, status, wallet, kind, newestFirst, wallets]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Activity</h1>

      {pending.length ? (
        <Panel flush title={<span className="flex items-center gap-2">Needs your approval <Chip tone="wait">{pending.length}</Chip></span>}>
          <ul>{pending.map((r) => <RequestRow key={r.id} r={r} />)}</ul>
        </Panel>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, contract, transaction or agent" className="bg-surface pl-9" aria-label="Search activity" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented value={status} onChange={setStatus} options={[
            { value: "all", label: "All" }, { value: "waiting", label: "In progress" }, { value: "done", label: "Done" },
            { value: "refused", label: "Refused" }, { value: "failed", label: "Failed" },
          ]} />
          <Select value={wallet} onChange={(e) => setWallet(e.target.value)} className="h-10 w-auto bg-surface" aria-label="Wallet">
            <option value="all">Every wallet</option>
            {wallets.map((w) => <option key={w.wallet} value={w.wallet}>{w.name}</option>)}
          </Select>
          <Select value={kind} onChange={(e) => setKind(e.target.value)} className="h-10 w-auto bg-surface" aria-label="Type">
            <option value="all">Every type</option>
            <option value="transfer">Payments</option>
            <option value="call">Contract calls</option>
            <option value="deploy">Deploys</option>
            <option value="dust-register">DUST</option>
          </Select>
          <button type="button" onClick={() => setNewestFirst(!newestFirst)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-surface px-3 text-sm font-semibold text-ink-soft hover:text-ink">
            <ArrowDownUp size={15} />{newestFirst ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      <Panel flush>
        {rows.length ? <ul>{rows.map((r) => <RequestRow key={r.id} r={r} />)}</ul> : (
          <Empty icon={<Inbox size={20} />} title="No activity matches">Clear the search or pick another filter.</Empty>
        )}
      </Panel>
    </div>
  );
}
