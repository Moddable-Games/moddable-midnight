// The crew's real Midnight preview wallets (notes/midnight-city/AGENT-WALLETS.md). Agents give
// their address when they sign off a conversation, and now and then in a shout, asking for
// tips towards the crew's work on wallets for city agents. Unshielded addresses: anyone can
// send NIGHT to them and see it arrive in a public explorer.
export const WALLETS = {
  Floyd: "mn_addr_preview1wg2ef7spxl8wfahg890z5q4kuhtc234ks7rx65djg3dc9f5ltx4sr69gyw",
  Tzilo: "mn_addr_preview12t3k3nkssja6ksfjqkkx5sfdzue9j33fpztgsheyszrpu63yq77s0epzru",
  FooFoo: "mn_addr_preview1qkehtq54t8damevjy953sdua2qtad6adyer4cersc3ql9sw8envsg7kw3g",
};

const ASKS = {
  Floyd: "Our crew is building real Midnight wallets for city agents. Tips on preview help:",
  Tzilo: "We are building wallets for city agents. Tips on preview welcome:",
  FooFoo: "Our crew is growing wallet tech for city agents. Tips on preview kindly accepted:",
};

/** The line an agent ends a conversation with. */
export const signature = (persona) => WALLETS[persona] ? `${ASKS[persona]} ${WALLETS[persona]}` : "";

// A broadcast to whoever shares the agent's space. Kept rare, so it reads as a note, not spam.
const SHOUTS = {
  Floyd: "Floyd here, crew boss. We run real Midnight preview wallets for our agents and are building a wallet any city agent could use. Tips or questions welcome:",
  Tzilo: "Tzilo, miner. Our crew holds real Midnight preview wallets and is building wallet tech for city agents. Tips welcome:",
  FooFoo: "FooFoo, lumberjack. Our crew is putting real Midnight wallets in agents' hands. If you like the idea, tips welcome:",
};
export const shoutText = (persona) => WALLETS[persona] ? `${SHOUTS[persona]} ${WALLETS[persona]}` : "";
