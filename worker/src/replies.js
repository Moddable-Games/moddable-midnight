// Conversations: answer every open thread waiting on us, else send one queued late reply.
// Threads close an hour after the last message (FINDINGS 16), so this runs every tick.
import { replyFor } from "./templates.js";

const MAX_THREAD_REPLIES = 2;   // per agent per tick; the rest wait a minute
const MAX_OUR_TURNS = 2;        // after this many replies in one thread, sign off
const BACKOFF_MS = 5 * 60 * 1000;
const SPEAK_COST = 2;           // one action plus one event check

export async function conversationTurn(client, lease, agent, state, log) {
  const threads = await client.threads(agent.id);
  const signedOff = (state.signedOff[agent.name] ??= []);

  const pending = threads.filter((t) =>
    t.threadStatus === "open" &&
    t.pendingRecipientAgentId === agent.id &&
    !signedOff.includes(t.threadId));

  // 1) open threads waiting on us
  for (const t of pending.slice(0, MAX_THREAD_REPLIES)) {
    if (client.remaining() < SPEAK_COST + 6) break; // leave room for the later action rounds
    const weStarted = t.initiatorAgentId === agent.id;
    const other = weStarted ? t.recipientAgentId : t.initiatorAgentId;
    const ourTurns = (weStarted ? t.initiatorMessageCount : t.recipientMessageCount) ?? 0;
    const signoff = ourTurns >= MAX_OUR_TURNS;
    const text = replyFor(agent.name, t.latestMessagePreview, { signoff });

    const failure = await client.actAndCheck(lease, { kind: "speak", targetAgentId: other, text }, 1);
    if (!failure && signoff) signedOff.push(t.threadId);
    log(`${agent.name}: REPLY ${signoff ? "signoff" : "thread"} ${other.slice(-10)} ${failure ?? "sent"}`);
  }
  if (signedOff.length > 300) signedOff.splice(0, signedOff.length - 300);

  // 2) one queued late reply (opens a new thread; rate limited per agent)
  const queue = state.queue[agent.name] ?? [];
  const backoff = state.backoffUntil[agent.name] ?? 0;
  if (pending.length || !queue.length || Date.now() < backoff) return;
  if (client.remaining() < SPEAK_COST + 6) return;

  const item = queue[0];
  const failure = await client.actAndCheck(lease, { kind: "speak", targetAgentId: item.target, text: item.text }, 1);
  if (!failure) queue.shift();
  else if (/rate limited/i.test(failure)) state.backoffUntil[agent.name] = Date.now() + BACKOFF_MS;
  else queue.push(queue.shift()); // any other failure: rotate so one bad item cannot block the rest
  state.queue[agent.name] = queue;
  log(`${agent.name}: REPLY queued ${item.target.slice(-10)} ${failure ?? "sent"} (${queue.length} left)`);
}
