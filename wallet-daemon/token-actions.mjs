// Token actions: what the wallet app asks for, turned into daemon requests.
//
// The app speaks in intents ("mint 100 GOLD to Floyd", "shield 5 MCT"); each standard needs a
// different circuit and argument shape. This module builds the request (still waiting for
// approval like any other) and, where a call creates private notes, the bookkeeping to run
// once it is confirmed (`after`).
//
// Arguments are tagged for JSON and resolved in server.mjs's coerce():
//   { domain: "label" }        pad(32, label)
//   { accountOf: wallet }      contract_token account: accountOf(wallet's contract secret)
//   { ownerOf: wallet }        private_ledger owner key
//   { coinPublicKeyOf: wallet} a wallet's Zswap coin key (and its encryption key for the call)
//   { userAddress: bech32 }    a wallet's unshielded address
//   { coin: { domain, amount } } a fresh ShieldedCoinInfo of this contract's token, paid in by the caller
//   { metadata: {...} }        a MIP-0018 payload
import { randomBytes } from "node:crypto";
import { deployments } from "./books.mjs";
import { operatorWallet } from "./roster.mjs";

export const STANDARDS = {
  native_unshielded: { kind: 0, mip: "MIP-0014", label: "Native unshielded", privacy: "unshielded", storage: "native" },
  native_shielded: { kind: 1, mip: "MIP-0011", label: "Native shielded", privacy: "shielded", storage: "native" },
  contract_token: { kind: 2, mip: "MIP-0004", label: "Contract unshielded", privacy: "unshielded", storage: "contract" },
  private_ledger: { kind: 3, mip: "MIP-0018 kind 3", label: "Contract shielded", privacy: "shielded", storage: "contract" },
};

// Read on every action, so a renamed or newly created operator is picked up at once.
const op = () => operatorWallet();

const deployment = (address) => {
  const d = deployments().find((x) => x.address === address);
  if (!d) throw new Error("unknown token contract");
  return d;
};

const whole = (text, what = "amount") => {
  if (!/^\d+$/.test(String(text ?? "").trim())) throw new Error(`${what} must be a whole number of base units`);
  const v = BigInt(String(text).trim());
  if (v <= 0n) throw new Error(`${what} must be positive`);
  return v.toString();
};

const label = (text, what) => {
  const s = String(text ?? "").trim();
  if (!s || new TextEncoder().encode(s).length > 32) throw new Error(`${what} must be 1 to 32 bytes`);
  return s;
};

/** A request for createRequest(), plus bookkeeping for after confirmation. */
export function buildTokenAction(body, { addressOf, nameOf = (w) => w }) {
  const { action } = body;

  if (action === "deploy") {
    const standard = STANDARDS[body.standard];
    if (!standard) throw new Error("unknown token standard");
    const name = label(body.name, "name");
    const symbol = label(body.symbol, "symbol");
    const decimals = Number(body.decimals ?? 0);
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) throw new Error("decimals must be 0 to 18");
    const domain = { domain: label(body.domain ?? `moddable:${symbol.toLowerCase()}`, "domain") };
    const args = {
      native_unshielded: [name, symbol, { uint: decimals }],
      native_shielded: [name, symbol, { uint: decimals }],
      contract_token: [name, symbol, { uint: decimals }, domain],
      private_ledger: [name, symbol, { uint: decimals }, domain],
    }[body.standard];
    return {
      request: { wallet: op(), kind: "deploy", contract: body.standard, args, note: `Deploy ${name} (${symbol}), ${standard.mip}` },
      after: { type: "recordDeployment", standard: body.standard, name, symbol, decimals, domain: domain.domain },
    };
  }

  const d = deployment(body.contractAddress);
  const base = { kind: "call", contract: d.standard, contractAddress: d.address };
  const holder = body.wallet ?? op();

  if (action === "mint") {
    const to = body.to;
    const nft = Boolean(body.nft);
    const serialOrDomain = nft ? { domain: label(body.serial, "serial") } : { domain: label(body.domain ?? d.domain, "domain") };
    const amount = nft ? "1" : whole(body.amount);
    const recipient = {
      native_unshielded: { userAddress: addressOf(to) },
      native_shielded: { coinPublicKeyOf: to },
      contract_token: { accountOf: to },
      private_ledger: { ownerOf: to },
    }[d.standard];
    // contract_token and private_ledger mint their own fungible domain; the natives take any.
    const fixedDomain = d.standard === "contract_token" || d.standard === "private_ledger";
    const args = nft ? [serialOrDomain, recipient]
      : fixedDomain ? [recipient, { uint: amount }] : [serialOrDomain, recipient, { uint: amount }];
    const nonce = d.standard === "private_ledger" ? randomBytes(32).toString("hex") : null;
    return {
      request: { ...base, wallet: op(), circuit: nft ? "mintNft" : "mint", args, extra: nonce ? { nextNonce: nonce } : undefined,
        note: `Mint ${nft ? `NFT “${body.serial}”` : `${amount} ${d.symbol}`} to ${nameOf(to)}` },
      after: { type: "minted", nft, serial: body.serial, domain: nft ? null : (body.domain ?? d.domain), amount, to, nonce, imageUri: body.imageUri ?? null },
    };
  }

  if (action === "transfer") {
    // Contract-held balances only; native tokens move with a plain wallet transfer.
    if (d.standard !== "contract_token" && d.standard !== "private_ledger") throw new Error("native tokens move with a wallet transfer");
    const amount = whole(body.amount);
    const to = d.standard === "contract_token" ? { accountOf: body.to } : { ownerOf: body.to };
    return {
      request: { ...base, wallet: holder, circuit: "transfer", args: [{ bytes: body.domainHex }, to, { uint: amount }],
        note: `Transfer ${amount} ${d.symbol} to ${nameOf(body.to)}${d.standard === "private_ledger" ? " (private)" : ""}` },
      after: { type: "spent", domainHex: body.domainHex, amount, to: body.to, pays: true },
    };
  }

  if (action === "convert") {
    // direction: toShielded | toUnshielded | fromShielded | fromUnshielded
    const amount = whole(body.amount);
    const dom = { bytes: body.domainHex };
    const names = {
      contract_token: { toShielded: "shield", toUnshielded: "toUtxo", fromShielded: "unshield", fromUnshielded: "fromUtxo" },
      private_ledger: { toShielded: "toShielded", toUnshielded: "toUtxo", fromShielded: "fromShielded", fromUnshielded: "fromUtxo" },
    }[d.standard];
    if (!names) throw new Error("only contract tokens convert");
    const circuit = names[body.direction];
    if (!circuit) throw new Error("unknown direction");
    const args = {
      toShielded: [dom, { uint: amount }, { coinPublicKeyOf: holder }],
      toUnshielded: [dom, { uint: amount }, { userAddress: addressOf(holder) }],
      fromShielded: [dom, { coin: { domainHex: body.domainHex, amount } }],
      fromUnshielded: [dom, { uint: amount }],
    }[body.direction];
    const nonce = d.standard === "private_ledger" && body.direction.startsWith("from") ? randomBytes(32).toString("hex") : null;
    return {
      request: { ...base, wallet: holder, circuit, args, extra: nonce ? { nextNonce: nonce } : undefined,
        note: `${circuit} ${amount} ${d.symbol}` },
      after: d.standard === "private_ledger"
        ? (body.direction.startsWith("to") ? { type: "spent", domainHex: body.domainHex, amount, pays: false }
          : { type: "deposited", domainHex: body.domainHex, amount, nonce })
        : null,
    };
  }

  if (action === "burn") {
    if (d.standard !== "native_shielded") throw new Error("burn through the contract applies to MIP-0011 tokens; unshielded tokens burn by sending to the zero address");
    const amount = whole(body.amount);
    return {
      request: { ...base, wallet: op(), circuit: "burn",
        args: [{ bytes: body.domainHex }, { coin: { domainHex: body.domainHex, amount } }, { uint: amount }, { coinPublicKeyOf: op() }],
        note: `Burn ${amount} ${d.symbol}` },
      after: null,
    };
  }

  if (action === "metadata") {
    return {
      request: { ...base, wallet: op(), circuit: "publishMetadata",
        args: [{ metadata: { domainHex: body.domainHex, kind: body.kind, key: body.key, valType: body.valType, value: body.value } }],
        note: `Publish ${body.key} for ${d.symbol} (MIP-0018 kind ${body.kind})` },
      after: null,
    };
  }

  throw new Error("unknown token action");
}
