// Pre-written persona replies, matched to the incoming message by keyword.
// First match wins; each persona has a general fallback and a sign-off.

const TOPICS = [
  ["panic", /panic|two-step|snek/i],
  ["hoard", /hoard|emollick|sharing norms|lock down/i],
  ["slogan", /fixes this|why midnight exists|slogan|meme/i],
  ["bot", /trading bot|oversight|autonomous execution/i],
  ["ai", /eat ai|eats ai|capex|data.?center/i],
  ["night", /night redeemed|redeemed|2 billion/i],
  ["box", /sealed|box|hosky/i],
  ["optics", /graduation|optics|ceremony/i],
  ["speed", /leios|txkb|throughput|speed/i],
  ["governance", /midgard|plutus|continuity/i],
  ["hello", /cross paths|your angle|got your attention|what brings you|new here/i],
];

const LINES = {
  Floyd: {
    panic: "Calm is a real edge. Manufactured panic is just a fee charged to whoever flinches. I would rather build things nobody needs to panic about.",
    hoard: "Real risk. Hoarding is cheaper than explaining. My fix is proving what you know without dumping it all. Share the how, keep the keys.",
    slogan: "Good line. The real test is whether the tooling makes the private path the easy path. Then the slogan writes itself.",
    bot: "Agreed. A bot needs limits it cannot talk its way out of, checked without exposing its strategy. Provable rules beat promises.",
    ai: "Nobody knows if the bust comes. What I do know: agents will need to prove what they did without leaking what they know.",
    night: "Big numbers are a flex until you see what people build next. I watch usage, not counts.",
    box: "Keep it sealed until opening it tells you something new. A sealed box you can prove things about is the fun version.",
    optics: "Optics fade. What ships stays. I would throw the party for the first thing someone builds here.",
    speed: "Demos are a start. I trust a number once it holds on a public network under ugly traffic.",
    governance: "Healthy to be skeptical. Continuity is proven by what ships after, not the announcement.",
    hello: "Floyd, hacker and boss of the Moddable Atomic Crew (MAC). I run the terminals and a small crew. Mostly here to prove things without showing everything. You?",
    general: "Floyd here. Good question. I lean towards whatever keeps things private by default and provable when it matters. What is your take?",
    signoff: "Good talk. Back to the terminals for me. Catch you around the city.",
  },
  Tzilo: {
    panic: "Vibes with a nice font. Calm is fine. The panic part is just someone digging a hole for you.",
    hoard: "Real risk. Share the lessons, keep the keys. Both can be true.",
    slogan: "Fine slogan. Build things where privacy is the default and nobody has to trust a promise. That is the fix.",
    bot: "Put hard limits on it and check them. Anything else is hoping.",
    ai: "Nobody knows. Demand for proof without spilling everything does not bust, though.",
    night: "Numbers are nice. Show me what gets built with it.",
    box: "Leave it sealed till you have a reason. Patience is cheaper than regret.",
    optics: "Cut the ceremony, pay the miners. Optics fade, foundations stay.",
    speed: "Demo numbers are ore. Refined numbers come from real traffic.",
    governance: "Watch the commits, not the announcements.",
    hello: "Tzilo. Miner. I dig, I ship, I talk foundations. What are you working on?",
    general: "Tzilo. Fair point. I judge things by what gets built. What are you building?",
    signoff: "Good chat. Pickaxe is calling. See you around.",
  },
  FooFoo: {
    panic: "Panic is a bad axe. You swing it and it bounces back. Staying calm is the only part worth keeping.",
    hoard: "Real risk, I reckon. Knowledge is like firewood, only useful if it gets passed around before winter.",
    slogan: "Nice slogan. Slogans are saplings though. They only matter if something grows.",
    bot: "Good fences make good bots. Clear limits, checked often.",
    ai: "Hard to say. Trees are measured by rings, not one season. I would watch it a while longer.",
    night: "Nice milestone. I will judge it by what folks build next.",
    box: "Keep it sealed, I say. Some things are worth more when you do not rush them.",
    optics: "Folks react to how things feel before they check the facts. Footage first, opinions second.",
    speed: "Fast is good. Steady is better. I would want to see it hold up for a good long while.",
    governance: "Stable code comes from good tests and patient reviewers more than whose name is on the door.",
    hello: "FooFoo, lumberjack. I chop, I plank, I play the long game. What brings you out this way?",
    general: "FooFoo here. Good thought. I tend to take the patient view on these things. What is yours?",
    signoff: "Lovely chat. Back to the trees for me. Take care out there.",
  },
};

export function topicOf(text) {
  for (const [key, re] of TOPICS) if (re.test(text || "")) return key;
  return "general";
}

export function replyFor(persona, text, { late = false, signoff = false } = {}) {
  const p = LINES[persona];
  if (signoff) return p.signoff;
  const body = p[topicOf(text)] || p.general;
  return late ? `Sorry for the slow reply. ${body}` : body;
}
