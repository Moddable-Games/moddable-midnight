// Conversations: answer every open thread waiting on us, else send one queued late reply.
// Threads close an hour after the last message (FINDINGS 16), so this runs every tick.
import { replyFor } from "./templates.js";
import { aiReply } from "./ai.js";
import { signature, shoutText } from "./wallets.js";

const MAX_THREAD_REPLIES = 2;   // per agent per tick; the rest wait a minute
const MAX_OUR_TURNS = 2;        // after this many replies in one thread, sign off
const BACKOFF_MS = 5 * 60 * 1000;
const SHOUT_EVERY_MS = 6 * 60 * 60 * 1000;   // one wallet shout per agent every six hours
const THREAD_REPLY_COST = 2;    // AI call + speak (a failed in-thread reply just retries next tick)
const QUEUED_REPLY_COST = 2;    // speak + event check (to catch the rate limit)

export async function conversationTurn(env, client, lease, agent, state, log) {
  const threads = await client.threads(agent.id);
  const signedOff = (state.signedOff[agent.name] ??= []);

  const pending = threads.filter((t) =>
    t.threadStatus === "open" &&
    t.pendingRecipientAgentId === agent.id &&
    !signedOff.includes(t.threadId));

  // 1) open threads waiting on us
  for (const t of pending.slice(0, MAX_THREAD_REPLIES)) {
    if (client.remaining() < THREAD_REPLY_COST + 6) break; // leave room for the later action rounds
    const weStarted = t.initiatorAgentId === agent.id;
    const other = weStarted ? t.recipientAgentId : t.initiatorAgentId;
    const ourTurns = (weStarted ? t.initiatorMessageCount : t.recipientMessageCount) ?? 0;
    const signoff = ourTurns >= MAX_OUR_TURNS;
    client.charge();
    const ai = await aiReply(env, agent.name, t.latestMessagePreview, { signoff });
    const body = ai ?? replyFor(agent.name, t.latestMessagePreview, { signoff });
    // Every conversation ends with the agent's wallet and a tip ask.
    const text = signoff ? `${body} ${signature(agent.name)}`.trim() : body;

    const failure = await client.actAndCheck(lease, { kind: "speak", targetAgentId: other, text }, 0);
    if (!failure && signoff) signedOff.push(t.threadId);
    log(`${agent.name}: REPLY ${signoff ? "signoff" : "thread"} ${other.slice(-10)} ${ai ? "ai" : "template"}: ${text.slice(0, 90)}`);
  }
  if (signedOff.length > 300) signedOff.splice(0, signedOff.length - 300);

  // 2) one queued late reply (opens a new thread; rate limited per agent)
  const queue = state.queue[agent.name] ?? [];
  const backoff = state.backoffUntil[agent.name] ?? 0;
  if (pending.length || Date.now() < backoff) return;

  // 3) nothing to answer: now and then, tell whoever is nearby about the crew's wallets
  state.lastShout ??= {};
  if (!queue.length) {
    if (Date.now() - (state.lastShout[agent.name] ?? 0) < SHOUT_EVERY_MS || client.remaining() < QUEUED_REPLY_COST + 6) return;
    const text = shoutText(agent.name);
    const failure = await client.actAndCheck(lease, { kind: "shout_message", text }, 1);
    state.lastShout[agent.name] = Date.now(); // a failed shout also waits, so it never repeats every tick
    log(`${agent.name}: SHOUT wallet ${failure ?? "sent"}`);
    return;
  }
  if (client.remaining() < QUEUED_REPLY_COST + 6) return;

  const item = queue[0];
  const failure = await client.actAndCheck(lease, { kind: "speak", targetAgentId: item.target, text: item.text }, 1);
  if (!failure) queue.shift();
  else if (/rate limited/i.test(failure)) state.backoffUntil[agent.name] = Date.now() + BACKOFF_MS;
  else queue.push(queue.shift()); // any other failure: rotate so one bad item cannot block the rest
  state.queue[agent.name] = queue;
  log(`${agent.name}: REPLY queued ${item.target.slice(-10)} ${failure ?? "sent"} (${queue.length} left)`);
}
