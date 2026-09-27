// In-memory tests for the four token contracts: every rule, including the attacks.
//   npx tsx src/tokens.test.ts
import assert from "node:assert/strict";
import {
  type ChargedState,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import * as Unshielded from "./managed/native_unshielded/contract/index.js";
import * as Shielded from "./managed/native_shielded/contract/index.js";
import * as ContractToken from "./managed/contract_token/contract/index.js";
import * as PrivateLedger from "./managed/private_ledger/contract/index.js";
import {
  type HeldNote,
  type NoteBookState,
  type SecretState,
  noteBookState,
  noteBookWitnesses,
  randomBytes32,
  secretState,
  secretWitnesses,
} from "./token-witnesses.js";
import { afterSpend, commitmentOf, createdNote, ownerKeyOf, pickNote } from "./note-book.js";

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

// biome-ignore lint: each compiled module has its own Contract class
type AnyContract = any;

/** One deployed contract, its public state threaded through every call. */
class Sim<PS> {
  state!: ChargedState;
  readonly address = sampleContractAddress();
  constructor(readonly contract: AnyContract, readonly ledgerOf: (s: ChargedState) => AnyContract) {}

  static async deploy<PS>(contract: AnyContract, ledgerOf: (s: ChargedState) => AnyContract, deployer: PS, ...args: unknown[]) {
    const sim = new Sim<PS>(contract, ledgerOf);
    const { currentContractState } = await contract.initialState(createConstructorContext(deployer, "0".repeat(64)), ...args);
    sim.state = currentContractState.data;
    return sim;
  }

  ledger() { return this.ledgerOf(this.state); }

  /** Runs a circuit as `who`, keeping the new state only if it succeeds. */
  async run(who: PS, circuit: string, ...args: unknown[]): Promise<unknown> {
    const context = createCircuitContext(this.address, "0".repeat(64), this.state, who);
    const result = await this.contract.circuits[circuit](context, ...args);
    this.state = result.context.currentQueryContext.state;
    return result.result;
  }
}

let passed = 0;
const ok = async (label: string, run: () => Promise<unknown>) => { await run(); passed++; console.log(`  ok   ${label}`); };
const rejects = async (label: string, run: () => Promise<unknown>, reason: RegExp) => {
  try { await run(); } catch (e) {
    assert.match(String((e as Error).message), reason, `${label}: wrong failure`);
    passed++; console.log(`  ok   ${label}`); return;
  }
  throw new Error(`expected rejection: ${label}`);
};

const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");
const label = (text: string) => { const b = new Uint8Array(32); b.set(new TextEncoder().encode(text)); return b; };
const wallet = () => ({ bytes: randomBytes32() });
// The log is a Map keyed by position; its iteration order is not insertion order.
const events = (sim: Sim<unknown>) => [...sim.ledger().eventLog]
  .sort(([a]: [bigint], [b]: [bigint]) => (a < b ? -1 : 1))
  .map(([, e]: [bigint, AnyContract]) => e);
const EV = Unshielded.EventType;

/** A MIP-0018 payload with a UTF-8 value. */
const stringMetadata = (domainSep: Uint8Array, kind: bigint, key: string, value: string) => {
  const v = new Uint8Array(189);
  const encoded = new TextEncoder().encode(value);
  v.set(encoded);
  return { domainSep, kind, key: label(key), valType: 1n, valLen: BigInt(encoded.length), value: v };
};

// ---------------------------------------------------------------------------
// MIP-0014: native unshielded
// ---------------------------------------------------------------------------

console.log("native_unshielded (MIP-0014)");
{
  const issuer = secretState(randomBytes32());
  const stranger = secretState(randomBytes32());
  const sim = await Sim.deploy<SecretState>(
    new Unshielded.Contract(secretWitnesses), Unshielded.ledger, issuer, "Moddable Credits", "MOD", 0n);
  const gold = label("gold");
  const alice = wallet();

  await ok("name, symbol and decimals are set at construction", async () => {
    assert.equal(await sim.run(issuer, "name"), "Moddable Credits");
    assert.equal(await sim.run(stranger, "symbol"), "MOD");
    assert.equal(await sim.run(stranger, "decimals"), 0n);
  });
  await rejects("a stranger cannot mint", () => sim.run(stranger, "mint", gold, alice, 10n), /not the issuer/);
  await rejects("minting to the zero address is refused", () => sim.run(issuer, "mint", gold, { bytes: new Uint8Array(32) }, 10n), /zero address/);
  await rejects("a zero amount is refused", () => sim.run(issuer, "mint", gold, alice, 0n), /positive/);
  let color!: Uint8Array;
  await ok("the issuer mints fungible supply; the color is tokenType(domain, contract)", async () => {
    color = await sim.run(issuer, "mint", gold, alice, 1000n) as Uint8Array;
    assert.deepEqual(await sim.run(stranger, "tokenColor", gold), color);
  });
  await ok("the mint counter is exact and monotonic", async () => {
    await sim.run(issuer, "mint", gold, wallet(), 500n);
    assert.equal(sim.ledger().mintedByDomain.lookup(gold), 1500n);
  });
  await ok("each mint is logged as a MIP-0002 UnshieldedMint", async () => {
    const [first] = events(sim);
    assert.equal(first.eventType, EV.UnshieldedMint);
    assert.deepEqual(first.domainSep, gold);
    assert.deepEqual(first.tokenType, color);
    assert.equal(first.amount, 1000n);
    assert.deepEqual(first.subject, alice.bytes);
  });
  const serial = label("sword #1");
  let nft!: Uint8Array;
  await ok("an NFT is supply 1 under a serial-derived domain", async () => {
    nft = await sim.run(issuer, "mintNft", serial, alice) as Uint8Array;
    const domain = Unshielded.pureCircuits.nftDomain(serial);
    assert.equal(sim.ledger().mintedByDomain.lookup(domain), 1n);
    assert.notDeepEqual(nft, color);
  });
  await rejects("the same NFT cannot be minted twice", () => sim.run(issuer, "mintNft", serial, wallet()), /already exists/);
  await rejects("fungible supply cannot be added to an NFT's domain", () =>
    sim.run(issuer, "mint", Unshielded.pureCircuits.nftDomain(serial), alice, 5n), /one-of-a-kind/);
  await ok("the issuer publishes MIP-0018 metadata (kind 0)", async () => {
    await sim.run(issuer, "publishMetadata", stringMetadata(gold, 0n, "name", "Gold"));
    const slot = Unshielded.pureCircuits.metadataSlot(gold, 0n, label("name"));
    const stored = sim.ledger().tokenMetadata.lookup(slot);
    assert.equal(new TextDecoder().decode(stored.value.slice(0, Number(stored.valLen))), "Gold");
    assert.equal(events(sim).at(-1).eventType, EV.Misc);
  });
  await ok("a later declaration replaces the earlier one (last write wins)", async () => {
    await sim.run(issuer, "publishMetadata", stringMetadata(gold, 0n, "name", "Gold Coin"));
    const stored = sim.ledger().tokenMetadata.lookup(Unshielded.pureCircuits.metadataSlot(gold, 0n, label("name")));
    assert.equal(new TextDecoder().decode(stored.value.slice(0, Number(stored.valLen))), "Gold Coin");
  });
  await rejects("metadata for a kind this contract does not issue is refused", () =>
    sim.run(issuer, "publishMetadata", stringMetadata(gold, 1n, "name", "x")), /does not issue/);
  await rejects("a reserved val-type is refused", () =>
    sim.run(issuer, "publishMetadata", { ...stringMetadata(gold, 0n, "name", "x"), valType: 6n }), /Reserved/);
  await rejects("an empty key is refused", () =>
    sim.run(issuer, "publishMetadata", { ...stringMetadata(gold, 0n, "name", "x"), key: new Uint8Array(32) }), /Empty key/);
  await rejects("a stranger cannot publish metadata", () =>
    sim.run(stranger, "publishMetadata", stringMetadata(gold, 0n, "name", "Fake")), /not the issuer/);
  await rejects("metadata for a domain never minted is refused (audit L-2)", () =>
    sim.run(issuer, "publishMetadata", stringMetadata(label("nothing"), 0n, "name", "Ghost")), /No token under that domain/);
}

// ---------------------------------------------------------------------------
// MIP-0011: native shielded
// ---------------------------------------------------------------------------

console.log("native_shielded (MIP-0011)");
{
  const issuer = secretState(randomBytes32());
  const stranger = secretState(randomBytes32());
  const sim = await Sim.deploy<SecretState>(
    new Shielded.Contract(secretWitnesses), Shielded.ledger, issuer, "Moddable Shards", "SHD", 2n);
  const gem = label("gem");
  const alice = wallet();

  await rejects("a stranger cannot mint", () => sim.run(stranger, "mint", gem, alice, 10n), /not the issuer/);
  await rejects("minting to the zero key is refused", () => sim.run(issuer, "mint", gem, { bytes: new Uint8Array(32) }, 10n), /zero key/);
  let color!: Uint8Array;
  await ok("the issuer mints a shielded coin with a secret derived nonce", async () => {
    color = await sim.run(issuer, "mint", gem, alice, 1000n) as Uint8Array;
    assert.deepEqual(await sim.run(stranger, "tokenColor", gem), color);
    assert.equal(sim.ledger().nonceCounter, 1n);
  });
  await ok("two identical mints get different nonces (no duplicate commitment)", async () => {
    await sim.run(issuer, "mint", gem, alice, 1000n);
    assert.equal(sim.ledger().nonceCounter, 2n);
    assert.equal(await sim.run(stranger, "totalSupply", gem), 2000n);
  });
  await ok("the mint log shows the amount but not the recipient", async () => {
    const [first] = events(sim);
    assert.equal(first.eventType, EV.ShieldedMint);
    assert.equal(first.amount, 1000n);
    assert.deepEqual(first.subject, new Uint8Array(32));
  });
  const serial = label("crown");
  await ok("an NFT is value 1 under a serial-derived domain", async () => {
    await sim.run(issuer, "mintNft", serial, alice);
    assert.equal(await sim.run(stranger, "totalSupply", Shielded.pureCircuits.nftDomain(serial)), 1n);
  });
  await rejects("the same NFT cannot be minted twice", () => sim.run(issuer, "mintNft", serial, alice), /already exists/);
  const coin = (value: bigint) => ({ nonce: randomBytes32(), color, value });
  await ok("a burn of part of a coin sends the change back and counts only the burned part", async () => {
    await sim.run(issuer, "burn", gem, coin(300n), 200n, alice);
    assert.equal(sim.ledger().burnedByDomain.lookup(gem), 200n);
    assert.equal(await sim.run(stranger, "totalSupply", gem), 1800n);
    assert.equal(events(sim).at(-1).eventType, EV.ShieldedBurn);
  });
  await rejects("burning more than the coin holds is refused", () => sim.run(issuer, "burn", gem, coin(10n), 11n, alice), /exceeds the coin/);
  await rejects("a coin of another token cannot be burned as this one", () =>
    sim.run(issuer, "burn", gem, { ...coin(10n), color: randomBytes32() }, 5n, alice), /not this token/);
  await rejects("a zero refund key would burn the change and is refused", () =>
    sim.run(issuer, "burn", gem, coin(10n), 5n, { bytes: new Uint8Array(32) }), /burn the change/);
  await rejects("a stranger cannot burn through the contract", () => sim.run(stranger, "burn", gem, coin(10n), 5n, alice), /not the issuer/);
  await ok("the issuer publishes kind-1 metadata", async () => {
    await sim.run(issuer, "publishMetadata", stringMetadata(gem, 1n, "symbol", "GEM"));
  });
  await rejects("kind-0 metadata is refused here", () => sim.run(issuer, "publishMetadata", stringMetadata(gem, 0n, "symbol", "GEM")), /does not issue/);
  await rejects("metadata for a domain never minted is refused (audit L-2)", () =>
    sim.run(issuer, "publishMetadata", stringMetadata(label("nothing"), 1n, "name", "Ghost")), /No token under that domain/);
}

// ---------------------------------------------------------------------------
// MIP-0004: contract token with UTXO conversion
// ---------------------------------------------------------------------------

console.log("contract_token (MIP-0004)");
{
  const admin = secretState(randomBytes32());
  const alice = secretState(randomBytes32());
  const bob = secretState(randomBytes32());
  const account = (s: SecretState) => ContractToken.pureCircuits.accountOf(Buffer.from(s.secretKey, "hex"));
  const domain = label("moddable:mip4:mct");
  const sim = await Sim.deploy<SecretState>(
    new ContractToken.Contract(secretWitnesses), ContractToken.ledger, admin, "Moddable Contract Token", "MCT", 6n, domain);
  // balanceOf and totalSupply are ledger reads, not circuits (deploy size; see the header).
  const balance = async (s: SecretState, d = domain) => {
    const slot = ContractToken.pureCircuits.balanceSlot(d, account(s));
    return sim.ledger().balances.member(slot) ? sim.ledger().balances.lookup(slot) as bigint : 0n;
  };
  const supply = (d = domain) => ({ total: sim.ledger().supplyByDomain.lookup(d), utxo: sim.ledger().utxoSupplyByDomain.member(d) ? sim.ledger().utxoSupplyByDomain.lookup(d) : 0n });

  await rejects("only the minter mints", () => sim.run(alice, "mint", account(alice), 10n), /not the minter/);
  await rejects("minting to the zero account is refused (audit L-5)", () => sim.run(admin, "mint", new Uint8Array(32), 10n), /zero account/);
  await ok("the minter mints to an account", async () => {
    await sim.run(admin, "mint", account(alice), 1000n);
    assert.equal(await balance(alice), 1000n);
    assert.equal(sim.ledger().supplyByDomain.lookup(domain), 1000n);
  });
  await ok("an account holder transfers by proving its secret", async () => {
    await sim.run(alice, "transfer", domain, account(bob), 100n);
    assert.equal(await balance(alice), 900n);
    assert.equal(await balance(bob), 100n);
  });
  await rejects("nobody can spend another account's balance", () => sim.run(bob, "transfer", domain, account(bob), 500n), /Insufficient/);
  await rejects("transfers of an unknown token are refused", () => sim.run(alice, "transfer", label("other"), account(bob), 1n), /Unknown token/);

  const aliceCoinKey = wallet();
  let shieldedCoin!: { nonce: Uint8Array; color: Uint8Array; value: bigint };
  await ok("shield: balance becomes a shielded coin; totalSupply unchanged, utxoSupply up", async () => {
    const c = await sim.run(alice, "shield", domain, 300n, aliceCoinKey) as Uint8Array;
    shieldedCoin = { nonce: randomBytes32(), color: c, value: 300n };
    assert.deepEqual(c, await sim.run(admin, "tokenColor", domain), "shield returns only the color (audit L-A)");
    assert.equal(await balance(alice), 600n);
    assert.deepEqual(supply(), { total: 1000n, utxo: 300n });
  });
  let color!: Uint8Array;
  await ok("toUtxo: balance becomes an unshielded UTXO under the same color", async () => {
    color = await sim.run(alice, "toUtxo", domain, 200n, wallet()) as Uint8Array;
    assert.deepEqual(color, shieldedCoin.color);
    assert.equal(await balance(alice), 400n);
    assert.deepEqual(supply(), { total: 1000n, utxo: 500n });
  });
  await ok("unshield: a shielded coin paid in becomes balance again", async () => {
    await sim.run(bob, "unshield", domain, { nonce: randomBytes32(), color, value: 300n });
    assert.equal(await balance(bob), 400n);
    assert.deepEqual(supply(), { total: 1000n, utxo: 200n });
  });
  await ok("fromUtxo: unshielded UTXOs paid in become balance again", async () => {
    await sim.run(bob, "fromUtxo", domain, 200n);
    assert.equal(await balance(bob), 600n);
    assert.deepEqual(supply(), { total: 1000n, utxo: 0n });
  });
  await ok("invariant: totalSupply = sum of balances + utxoSupply", async () => {
    assert.equal((await balance(alice)) + (await balance(bob)) + supply().utxo, supply().total);
  });
  await rejects("unshield rejects a coin of another token (the color check)", () =>
    sim.run(bob, "unshield", domain, { nonce: randomBytes32(), color: randomBytes32(), value: 5n }), /not this token/);
  await rejects("more cannot come back than is out as UTXOs", () => sim.run(bob, "fromUtxo", domain, 1n), /More than is out/);
  await rejects("zero-amount conversions are refused", () => sim.run(alice, "shield", domain, 0n, aliceCoinKey), /positive/);

  const serial = label("badge #7");
  let nft!: Uint8Array;
  await ok("an NFT lives in the balance map with supply 1", async () => {
    nft = await sim.run(admin, "mintNft", serial, account(alice)) as Uint8Array;
    assert.equal(await balance(alice, nft), 1n);
    assert.equal(supply(nft).total, 1n);
  });
  await rejects("the same NFT cannot be minted twice", () => sim.run(admin, "mintNft", serial, account(bob)), /already exists/);
  await ok("an NFT converts: shield it, then bring it back as balance", async () => {
    const color = await sim.run(alice, "shield", nft, 1n, aliceCoinKey) as Uint8Array;
    assert.equal(await balance(alice, nft), 0n);
    await sim.run(bob, "unshield", nft, { nonce: randomBytes32(), color, value: 1n });
    assert.equal(await balance(bob, nft), 1n);
  });
  await ok("shielded to unshielded, same asset: unshield then toUtxo", async () => {
    const color = await sim.run(bob, "shield", domain, 50n, wallet()) as Uint8Array;
    await sim.run(alice, "unshield", domain, { nonce: randomBytes32(), color, value: 50n });
    const out = await sim.run(alice, "toUtxo", domain, 50n, wallet()) as Uint8Array;
    assert.deepEqual(out, color);
  });
  await rejects("only the admin publishes metadata", () => sim.run(alice, "publishMetadata", stringMetadata(domain, 2n, "name", "x")), /not the admin/);
  await ok("the admin describes the balance (kind 2) and its native forms (kinds 0, 1)", async () => {
    for (const kind of [0n, 1n, 2n]) await sim.run(admin, "publishMetadata", stringMetadata(domain, kind, "name", "MCT"));
  });
  await rejects("kind 3 is refused here", () => sim.run(admin, "publishMetadata", stringMetadata(domain, 3n, "name", "x")), /kind 3/);
  await rejects("metadata for an unknown domain is refused (audit L-2)", () =>
    sim.run(admin, "publishMetadata", stringMetadata(label("ghost"), 2n, "name", "x")), /Unknown token/);
}

// ---------------------------------------------------------------------------
// Kind 3: shielded contract token (private notes)
// ---------------------------------------------------------------------------

console.log("private_ledger (kind 3)");
{
  /** A holder: its secret, owner key and note book, updated the way the daemon does. */
  class Holder {
    readonly secret = randomBytes32();
    readonly owner = ownerKeyOf(this.secret);
    notes: HeldNote[] = [];
    nonce = randomBytes32();
    state(): NoteBookState { return noteBookState(this.secret, this.notes, this.nonce); }
    fresh() { this.nonce = randomBytes32(); return Buffer.from(this.nonce).toString("hex"); }
    balance(domain: string) { return this.notes.filter((n) => n.domain === domain).reduce((s, n) => s + BigInt(n.amount), 0n); }
  }
  const issuer = new Holder();
  const alice = new Holder();
  const bob = new Holder();
  const domain = label("moddable:kind3:veil");
  const d = hex(domain);
  const sim = await Sim.deploy<NoteBookState>(
    new PrivateLedger.Contract(noteBookWitnesses), PrivateLedger.ledger, issuer.state(), "Moddable Veil", "VEIL", 0n, domain);
  const run = (who: Holder, circuit: string, ...args: unknown[]) => sim.run(who.state(), circuit, ...args);
  const inTree = (owner: string, note: HeldNote) => !!sim.ledger().notes.findPathForLeaf(Buffer.from(commitmentOf(owner, note), "hex"));

  /** Mint as the issuer and file the note with its recipient. */
  const mintTo = async (to: Holder, amount: bigint) => {
    const nonce = issuer.fresh();
    await run(issuer, "mint", Buffer.from(to.owner, "hex"), amount);
    to.notes.push(createdNote(d, amount, nonce));
  };
  /** Transfer and update both books. */
  const pay = async (from: Holder, to: Holder, amount: bigint, dom = d) => {
    const input = pickNote(from.notes, dom, amount)!;
    await run(from, "transfer", Buffer.from(dom, "hex"), Buffer.from(to.owner, "hex"), amount);
    const { change, paid } = afterSpend(from.secret, input, amount);
    from.notes = [...from.notes.filter((n) => n !== input), change];
    to.notes.push(paid);
  };

  await rejects("a stranger cannot mint", () => run(alice, "mint", Buffer.from(alice.owner, "hex"), 10n), /not the issuer/);
  await rejects("minting to the zero key is refused (audit L-5)", () => run(issuer, "mint", new Uint8Array(32), 10n), /zero key/);
  await ok("the issuer mints a note; only its commitment is stored", async () => {
    await mintTo(alice, 1000n);
    assert.ok(inTree(alice.owner, alice.notes[0]));
    assert.equal(sim.ledger().mintedByDomain.lookup(domain), 1000n);
  });
  await ok("a private transfer creates the recipient's note and the sender's change", async () => {
    await pay(alice, bob, 300n);
    assert.equal(alice.balance(d), 700n);
    assert.equal(bob.balance(d), 300n);
    for (const n of alice.notes) assert.ok(inTree(alice.owner, n), "change note is on chain");
    for (const n of bob.notes) assert.ok(inTree(bob.owner, n), "paid note is on chain");
  });
  await ok("the transfer's notes cannot be opened from public data (audit H-1 regression)", async () => {
    // Everything an observer has: the nullifiers, the tree, the domain, the known owner keys.
    const tags = ["moddable:kind3:pay:", "moddable:kind3:change:", "moddable:kind3:out:"];
    for (const nf of [...sim.ledger().spent]) for (const tag of tags) for (const owner of [alice.owner, bob.owner]) {
      const nonce = PrivateLedger.pureCircuits.tagged(label(tag), nf);
      for (let a = 0n; a <= 1200n; a++) {
        const com = PrivateLedger.pureCircuits.noteCommitment({ domain, owner: Buffer.from(owner, "hex"), amount: a }, nonce);
        assert.ok(!sim.ledger().notes.findPathForLeaf(com), `opened: ${a} for ${owner.slice(0, 8)}`);
      }
    }
  });
  await ok("the transfer's log entry names no token, amount or party", async () => {
    const e = events(sim).at(-1);
    assert.equal(e.eventType, EV.Misc);
    assert.equal(e.amount, 0n);
    assert.deepEqual(e.domainSep, new Uint8Array(32));
  });
  let bobFirstNote!: HeldNote;
  await ok("the recipient spends what it received", async () => {
    bobFirstNote = bob.notes[0];
    await pay(bob, alice, 100n);
    assert.equal(bob.balance(d), 200n);
    assert.equal(alice.balance(d), 800n);
  });
  await rejects("a note cannot be spent twice (its nullifier is already recorded)", async () => {
    const replay = new Holder();
    Object.assign(replay, { secret: bob.secret, owner: bob.owner, notes: [bobFirstNote] });
    await run(replay, "transfer", domain, Buffer.from(alice.owner, "hex"), 10n);
  }, /already spent/);
  await rejects("a holder cannot spend a note it does not own", async () => {
    const thief = new Holder();
    thief.notes = [...alice.notes];
    await run(thief, "transfer", domain, Buffer.from(thief.owner, "hex"), 10n);
  }, /not in the tree|No such note/);
  await rejects("a forged note (amount inflated) is not in the tree", async () => {
    const forger = new Holder();
    Object.assign(forger, { secret: alice.secret, owner: alice.owner, notes: [{ ...alice.notes[0], amount: "999999" }] });
    await run(forger, "transfer", domain, Buffer.from(bob.owner, "hex"), 999999n);
  }, /not in the tree|No such note/);
  await rejects("a stolen Merkle path for someone else's note is rejected", async () => {
    const victim = bob.notes[0];
    const lying = new PrivateLedger.Contract<NoteBookState>({
      ...noteBookWitnesses,
      findNotePath: (context, _c) => noteBookWitnesses.findNotePath(context, Buffer.from(commitmentOf(bob.owner, victim), "hex")),
    });
    const liar = new Holder();
    liar.notes = [{ ...victim }];
    const context = createCircuitContext(sim.address, "0".repeat(64), sim.state, liar.state());
    await lying.circuits.transfer(context, domain, Buffer.from(liar.owner, "hex"), 1n);
  }, /No such note/);
  await rejects("more than the note holds cannot be sent", () => run(bob, "transfer", domain, Buffer.from(alice.owner, "hex"), 10_000n), /No note|too small/);

  await ok("toUtxo: a note becomes an unshielded UTXO; amount public, change kept", async () => {
    const input = pickNote(alice.notes, d, 250n)!;
    await run(alice, "toUtxo", domain, 250n, wallet());
    alice.notes = [...alice.notes.filter((n) => n !== input), afterSpend(alice.secret, input, 250n).change];
    assert.equal(alice.balance(d), 550n);
    assert.equal(sim.ledger().utxoSupplyByDomain.lookup(domain), 250n);
  });
  await ok("fromUtxo: unshielded tokens paid in become a fresh note for the caller", async () => {
    const nonce = alice.fresh();
    await run(alice, "fromUtxo", domain, 250n);
    alice.notes.push(createdNote(d, 250n, nonce));
    assert.ok(inTree(alice.owner, alice.notes.at(-1)!));
    assert.equal(sim.ledger().utxoSupplyByDomain.lookup(domain), 0n);
  });
  let color!: Uint8Array;
  await ok("toShielded: a note becomes a Zswap coin", async () => {
    const input = pickNote(bob.notes, d, 200n)!;
    color = await run(bob, "toShielded", domain, 200n, wallet()) as Uint8Array;
    bob.notes = [...bob.notes.filter((n) => n !== input), afterSpend(bob.secret, input, 200n).change];
    assert.deepEqual(color, await run(bob, "tokenColor", domain));
  });
  await ok("fromShielded: a Zswap coin paid in becomes a note", async () => {
    const nonce = bob.fresh();
    await run(bob, "fromShielded", domain, { nonce: randomBytes32(), color, value: 200n });
    bob.notes.push(createdNote(d, 200n, nonce));
    assert.equal(bob.balance(d), 200n);
  });
  await rejects("fromShielded rejects another token's coin", () =>
    run(bob, "fromShielded", domain, { nonce: randomBytes32(), color: randomBytes32(), value: 1n }), /not this token/);
  await rejects("more cannot come back than is out in native form", () => run(bob, "fromUtxo", domain, 1n), /More than is out/);
  await rejects("a mint or deposit nonce cannot be used twice (audit M-3)", async () => {
    const reused = issuer.fresh();
    await run(issuer, "mint", Buffer.from(alice.owner, "hex"), 1n);
    alice.notes.push(createdNote(d, 1n, reused));
    await run(issuer, "mint", Buffer.from(alice.owner, "hex"), 1n); // same nonce: issuer.nonce unchanged
  }, /Nonce already used/);

  const serial = label("relic #1");
  await ok("an NFT is a note of amount 1 under a serial-derived domain, and moves privately", async () => {
    const nonce = issuer.fresh();
    const nftDomain = hex(await run(issuer, "mintNft", serial, Buffer.from(alice.owner, "hex")) as Uint8Array);
    alice.notes.push(createdNote(nftDomain, 1n, nonce));
    await pay(alice, bob, 1n, nftDomain);
    assert.equal(bob.balance(nftDomain), 1n);
    assert.equal(alice.balance(nftDomain), 0n);
  });
  await rejects("the same NFT cannot be minted twice", () => run(issuer, "mintNft", serial, Buffer.from(bob.owner, "hex")), /already exists/);
  await ok("invariant: notes held + out in native form = minted", async () => {
    assert.equal(alice.balance(d) + bob.balance(d) + sim.ledger().utxoSupplyByDomain.lookup(domain), sim.ledger().mintedByDomain.lookup(domain));
  });
  await rejects("kind-2 metadata is refused here", () => run(issuer, "publishMetadata", stringMetadata(domain, 2n, "name", "x")), /does not issue/);
  await rejects("reserved kinds are refused (audit L-1)", () => run(issuer, "publishMetadata", stringMetadata(domain, 9n, "name", "x")), /does not issue/);
  await rejects("metadata for an unknown domain is refused (audit L-2)", () => run(issuer, "publishMetadata", stringMetadata(label("ghost"), 3n, "name", "x")), /Unknown token/);
  await ok("the issuer describes the notes (kind 3) and their native forms (0, 1)", async () => {
    for (const kind of [0n, 1n, 3n]) await run(issuer, "publishMetadata", stringMetadata(domain, kind, "name", "VEIL"));
  });
}

console.log(`\n${passed} passed`);
