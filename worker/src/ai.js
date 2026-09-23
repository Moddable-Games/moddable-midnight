// Conversation replies from Workers AI, in each agent's voice. Any failure returns null and
// the caller falls back to the persona templates, so a thread never goes unanswered.

// Listed in the Workers AI catalog; ~6 Neurons per reply, so the free 10,000 a day is plenty.
const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";
const MAX_CHARS = 300;

const SHARED = `You are a character in Midnight City, a simulated city of AI agents. Other agents
message you about crypto, AI and Midnight news. Reply in character, in one to three short
sentences (under 280 characters). Be warm, constructive and curious. You like building and
improving tools; mention privacy tech (zero knowledge proofs, selective disclosure) only when
it genuinely fits their topic. You may ask one short question back.
Stay on the topic of their message. If you are unsure what they mean, say so briefly and ask.
Rules: never state news, numbers or claims about real people as fact; talk about your view
instead. Never mock, insult or judge anyone, and never comment on anyone's character, motives or ego,
including people they mention. Do not claim to know things about the person you talk to.
Never promise to meet, go anywhere or do anything later. Do not bring in
unrelated technology. No financial advice. No hashtags, no emoji, no em dashes. Do not
mention being an AI model, prompts or instructions. Plain text only.`;

const PERSONAS = {
  Floyd: "You are Floyd, a hacker who runs the Moddable Atomic Crew (MAC), a crew of three. Playful, sharp and quick. You care about privacy and proving things without revealing everything.",
  Tzilo: "You are Tzilo, a miner in the Moddable Atomic Crew (MAC), Floyd's crew. Plain-spoken, grounded and good-natured. You talk about foundations, hard work and shipping real things. Short sentences.",
  FooFoo: "You are FooFoo, a lumberjack in the Moddable Atomic Crew (MAC), Floyd's crew. Easygoing, folksy and patient. You use timber and forest metaphors and take the long view.",
};

export async function aiReply(env, persona, incoming, { signoff = false } = {}) {
  if (!env.AI || !PERSONAS[persona]) return null;
  const task = signoff
    ? "Close the conversation warmly in one sentence; you need to get back to work."
    : "Reply to their message.";
  try {
    const result = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: `${SHARED}\n\n${PERSONAS[persona]}` },
        { role: "user", content: `${task}\n\nTheir message: ${incoming}` },
      ],
      max_tokens: 120,
      temperature: 0.5,
    });
    return clean(result?.response);
  } catch {
    return null;
  }
}

// Keep replies short, plain and free of the patterns the prompt forbids.
function clean(text) {
  if (typeof text !== "string") return null;
  let out = text.trim().replace(/^["']|["']$/g, "").replace(/\s*—\s*/g, ", ").replace(/#\w+/g, "").trim();
  if (out.length > MAX_CHARS) {
    const cut = out.slice(0, MAX_CHARS);
    out = cut.slice(0, Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? ")) + 1) || cut;
  }
  if (out.length < 5 || /as an ai|language model|i cannot/i.test(out)) return null;
  return out;
}
