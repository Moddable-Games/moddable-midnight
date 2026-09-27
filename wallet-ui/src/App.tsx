import { Activity, Bot, Coins, KeyRound, LayoutGrid, Settings as Cog, WifiOff } from "lucide-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { RequestRow } from "@/components/request-row";
import { Chip, Empty, IconButton } from "@/components/ui/primitives";
import { cn } from "@/lib/format";
import { useStore } from "@/lib/store";
import { ActivityTab } from "@/tabs/Activity";
import { AgentsTab } from "@/tabs/Agents";
import { DashboardTab } from "@/tabs/Dashboard";
import { OperatorTab } from "@/tabs/Operator";
import { SettingsTab } from "@/tabs/Settings";
import { TokensTab } from "@/tabs/Tokens";
import { Sheets, type SheetRequest } from "@/sheets";

export type Tab = "dashboard" | "operator" | "agents" | "activity" | "tokens" | "settings";

const TABS: { id: Tab; label: string; icon: typeof LayoutGrid; mobile: boolean }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, mobile: true },
  { id: "operator", label: "Operator", icon: KeyRound, mobile: true },
  { id: "agents", label: "Agents", icon: Bot, mobile: true },
  { id: "activity", label: "Activity", icon: Activity, mobile: true },
  { id: "tokens", label: "Tokens", icon: Coins, mobile: true },
  { id: "settings", label: "Settings", icon: Cog, mobile: false },
];

// ---------------------------------------------------------------------------
// Navigation and sheets, shared through context
// ---------------------------------------------------------------------------

type Nav = { tab: Tab; go: (tab: Tab, focus?: string) => void; focus: string | null; open: (sheet: SheetRequest) => void };
const NavCtx = createContext<Nav | null>(null);
export const useNav = () => {
  const n = useContext(NavCtx);
  if (!n) throw new Error("useNav outside App");
  return n;
};

const readHash = (): [Tab, string | null] => {
  const [tab, focus] = location.hash.replace(/^#\/?/, "").split("/");
  return [TABS.some((t) => t.id === tab) ? (tab as Tab) : "dashboard", focus || null];
};

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-[0.8rem] bg-vault">
        <svg viewBox="0 0 24 24" className="size-5 text-glow" aria-hidden="true">
          <path fill="currentColor" d="M12 2 21 7v10l-9 5-9-5V7l9-5Zm0 3.2L6 8.5v7l6 3.3 6-3.3v-7l-6-3.3Z" />
        </svg>
      </span>
      {compact ? null : <span className="font-display text-lg font-bold">Moddable <span className="text-ink-faint">Wallet</span></span>}
    </span>
  );
}

function NavButton({ t, active, onClick, variant, badge }: {
  t: (typeof TABS)[number]; active: boolean; onClick: () => void; variant: "side" | "rail" | "bar"; badge?: number;
}) {
  const Icon = t.icon;
  const dot = badge ? (
    <span className={cn("grid min-w-5 place-items-center rounded-full bg-wait px-1 text-[11px] font-bold text-white",
      variant === "side" ? "ml-auto" : "absolute -right-1 -top-1")}>{badge}</span>
  ) : null;
  if (variant === "side") {
    return (
      <button type="button" onClick={onClick} aria-current={active ? "page" : undefined}
        className={cn("flex h-11 w-full items-center gap-3 rounded-control px-3 font-semibold transition-colors",
          active ? "bg-ink text-white" : "text-ink-soft hover:bg-surface hover:text-ink")}>
        <Icon size={19} />{t.label}{dot}
      </button>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-current={active ? "page" : undefined} aria-label={t.label}
      className={cn("flex flex-col items-center gap-1 text-[11px] font-semibold",
        variant === "rail" ? "w-14 py-1" : "flex-1 py-1.5", active ? "text-ink" : "text-ink-faint hover:text-ink-soft")}>
      <span className={cn("relative grid h-8 w-12 place-items-center rounded-full transition-colors", active && "bg-ink text-white")}>
        <Icon size={19} />{dot}
      </span>
      {t.label}
    </button>
  );
}

// ---------------------------------------------------------------------------

export default function App() {
  const store = useStore();
  const [[tab, focus], setRoute] = useState(readHash);
  const [sheet, setSheet] = useState<SheetRequest | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(readHash());
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const go = (t: Tab, f?: string) => { location.hash = `/${t}${f ? `/${f}` : ""}`; window.scrollTo({ top: 0 }); };
  const nav: Nav = { tab, go, focus, open: setSheet };
  const waiting = store.pending.length;
  const badgeFor = (t: Tab) => (t === "activity" ? waiting : undefined);

  let body: ReactNode;
  if (!store.online && !store.wallets.length) {
    body = (
      <div className="rounded-panel bg-surface">
        <Empty icon={<WifiOff size={20} />} title="The wallet daemon is not running">
          Start it with <code className="font-mono text-[13px]">node wallet-daemon/server.mjs</code>. Keys and approvals live there; this page only talks to it.
        </Empty>
      </div>
    );
  } else {
    body = {
      dashboard: <DashboardTab />, operator: <OperatorTab />, agents: <AgentsTab />,
      activity: <ActivityTab />, tokens: <TokensTab />, settings: <SettingsTab />,
    }[tab];
  }

  return (
    <NavCtx.Provider value={nav}>
      <div className="min-h-dvh md:flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-58 shrink-0 flex-col gap-1 px-4 py-5 lg:flex">
          <div className="mb-6 px-2"><Logo /></div>
          {TABS.map((t) => <NavButton key={t.id} t={t} variant="side" active={tab === t.id} onClick={() => go(t.id)} badge={badgeFor(t.id)} />)}
          <div className="mt-auto rounded-panel bg-surface p-3 text-[13px] text-ink-soft">
            <div className="mb-1 flex items-center gap-2 font-semibold text-ink">
              <span className={cn("size-2 rounded-full", store.online ? "bg-ok" : "bg-bad")} />
              {store.online ? "Daemon connected" : "Daemon offline"}
            </div>
            Preview network. Values in USD are simulated.
          </div>
        </aside>

        {/* Tablet rail */}
        <aside className="sticky top-0 hidden h-dvh w-20 shrink-0 flex-col items-center gap-2 py-5 md:flex lg:hidden">
          <div className="mb-4"><Logo compact /></div>
          {TABS.map((t) => <NavButton key={t.id} t={t} variant="rail" active={tab === t.id} onClick={() => go(t.id)} badge={badgeFor(t.id)} />)}
        </aside>

        <div className="min-w-0 flex-1">
          {/* Phone top bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between bg-paper/90 px-4 py-3 backdrop-blur md:hidden">
            <Logo />
            <div className="flex items-center gap-1">
              {!store.online ? <Chip tone="bad">Offline</Chip> : null}
              <IconButton label="Settings" onClick={() => go("settings")}><Cog size={19} /></IconButton>
            </div>
          </header>

          <div className="mx-auto flex max-w-[1320px] gap-5 px-4 pb-28 pt-2 md:px-6 md:pb-10 md:pt-6">
            <main className="min-w-0 flex-1">{body}</main>

            {/* The approval queue stays in view on wide screens */}
            {tab !== "activity" && store.online ? (
              <aside className="sticky top-6 hidden h-fit w-[340px] shrink-0 xl:block">
                <section className="rounded-panel bg-surface">
                  <header className="flex items-center justify-between px-5 pt-5">
                    <h2 className="text-lg">Waiting for you</h2>
                    {waiting ? <Chip tone="wait">{waiting}</Chip> : null}
                  </header>
                  {waiting ? (
                    <ul className="mt-2">{store.pending.slice(0, 6).map((r) => <RequestRow key={r.id} r={r} compact />)}</ul>
                  ) : (
                    <p className="px-5 pb-5 pt-2 text-sm text-ink-soft">Nothing to approve. Agent requests over their limits land here.</p>
                  )}
                </section>
              </aside>
            ) : null}
          </div>
        </div>

        {/* Phone tab bar */}
        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface/95 px-2 pt-1 backdrop-blur md:hidden">
          {TABS.filter((t) => t.mobile).map((t) => <NavButton key={t.id} t={t} variant="bar" active={tab === t.id} onClick={() => go(t.id)} badge={badgeFor(t.id)} />)}
        </nav>
      </div>
      <Sheets sheet={sheet} onClose={() => setSheet(null)} />
    </NavCtx.Provider>
  );
}
