import { ArrowUp, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { ago, cn } from "@/lib/format";
import { useStore } from "@/lib/store";
import { requestTitle, statusChip } from "./request-row";
import { FormError } from "./ui/primitives";

const SUGGESTIONS = ["What does each agent hold?", "Send 5 NIGHT to Floyd", "Mint an NFT for Tzilo", "Pause FooFoo"];

/**
 * The operator's line to the assistant that runs this wallet. Messages go to the daemon; an
 * assistant session on this machine answers there, and links the requests it queues so their
 * progress shows here.
 */
export function ChatPanel({ className }: { className?: string }) {
  const { chat, requests, wallets, refresh } = useStore();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const messages = chat?.messages ?? [];
  const online = chat?.assistant.online ?? false;
  const lastIsOperator = messages.at(-1)?.from === "operator";
  const walletName = (w: string) => wallets.find((x) => x.wallet === w)?.name ?? w;

  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [messages.length]);

  const send = async (text = draft) => {
    if (!text.trim()) return;
    setSending(true); setError(null);
    try { await api.say(text.trim()); setDraft(""); await refresh(); }
    catch (e) { setError((e as Error).message); }
    setSending(false);
  };

  return (
    <section className={cn("flex flex-col rounded-panel bg-surface", className)}>
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <h2 className="flex items-center gap-2 text-lg"><MessageSquare size={18} />Assistant</h2>
        <span className="flex items-center gap-1.5 text-[13px] text-ink-soft">
          <span className={cn("size-2 rounded-full", online ? "bg-ok" : "bg-ink-faint")} />
          {online ? "Online" : "Away"}
        </span>
      </header>

      <div className="max-h-[26rem] min-h-40 flex-1 space-y-3 overflow-y-auto px-5 py-2">
        {messages.length === 0 ? (
          <div className="space-y-2 pt-1">
            <p className="text-sm text-ink-soft">Ask about balances, or ask for something done. Anything that moves value still waits for your approval.</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setDraft(s)} className="rounded-full bg-sunken px-3 py-1 text-[13px] font-semibold text-ink-soft hover:text-ink">{s}</button>
              ))}
            </div>
          </div>
        ) : null}
        {messages.map((m) => {
          const mine = m.from === "operator";
          const linked = m.requests.map((id) => requests.find((r) => r.id === id)).filter(Boolean);
          return (
            <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
              <div className={cn("max-w-[88%] whitespace-pre-wrap rounded-[1.1rem] px-3.5 py-2 text-[14px]",
                mine ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-sunken text-ink")}>
                {m.text}
              </div>
              {linked.length ? (
                <ul className="mt-1.5 w-[88%] space-y-1">
                  {linked.map((r) => (
                    <li key={r!.id} className="flex items-center justify-between gap-2 rounded-control border border-line px-2.5 py-1.5 text-[13px]">
                      <span className="min-w-0 truncate">{requestTitle(r!, walletName)}</span>{statusChip(r!)}
                    </li>
                  ))}
                </ul>
              ) : null}
              <span className="mt-0.5 px-1 text-[11px] text-ink-faint">{m.status === "working" ? "Working on it, " : ""}{ago(m.at)}</span>
            </div>
          );
        })}
        {lastIsOperator ? (
          <p className="flex items-center gap-2 text-[13px] text-ink-soft">
            {online ? <><Loader2 size={13} className="animate-spin" />The assistant has your message</> : "Waiting for the assistant to come back online"}
          </p>
        ) : null}
        <div ref={end} />
      </div>

      <div className="px-4 pb-4 pt-2">
        <FormError message={error} />
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-end gap-2 rounded-[1.1rem] border border-line bg-sunken p-1.5 focus-within:border-cosmic">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={1} placeholder="Message the assistant" aria-label="Message the assistant"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-[14px] placeholder:text-ink-faint focus:outline-none" />
          <button type="submit" aria-label="Send" disabled={sending || !draft.trim()}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-cosmic text-white disabled:opacity-40">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={17} />}
          </button>
        </form>
      </div>
    </section>
  );
}
