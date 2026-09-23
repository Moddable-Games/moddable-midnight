// One Midnight wallet, built in our own process from the same SDK packages the wallet CLI
// uses (its transfers work on preview). Owning the process is the point: no terminal
// prompts, one sync per wallet for the life of the daemon, and state saved to disk so a
// restart resumes in seconds instead of minutes.
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import * as ledger from "@midnight-ntwrk/ledger-v8";
import { HDWallet, Roles } from "@midnight-ntwrk/wallet-sdk-hd";
import { ShieldedWallet } from "@midnight-ntwrk/wallet-sdk-shielded";
import { UnshieldedWallet, createKeystore, PublicKey } from "@midnight-ntwrk/wallet-sdk-unshielded-wallet";
import { DustWallet } from "@midnight-ntwrk/wallet-sdk-dust-wallet";
import { WalletFacade } from "@midnight-ntwrk/wallet-sdk-facade";
import { NetworkId, InMemoryTransactionHistoryStorage, TransactionHistoryStorage } from "@midnight-ntwrk/wallet-sdk-abstractions";

export const PREVIEW = {
  networkId: NetworkId.NetworkId.Preview,
  indexer: "https://indexer.preview.midnight.network/api/v4/graphql",
  indexerWS: "wss://indexer.preview.midnight.network/api/v4/graphql/ws",
  node: "wss://rpc.preview.midnight.network",
  proofServer: "http://localhost:6300",
};

const STATE_DIR = new URL("./state/", import.meta.url).pathname;

function deriveKey(seed, role) {
  const hd = HDWallet.fromSeed(seed);
  if (hd.type !== "seedOk") throw new Error("invalid seed");
  const key = hd.hdWallet.selectAccount(0).selectRole(role).deriveKeyAt(0);
  if (key.type === "keyOutOfBounds") throw new Error("key derivation out of bounds");
  return key.key;
}

/** Reads a wallet file written by `midnight wallet generate`. The seed never leaves here. */
export function loadSeed(name) {
  const file = join(homedir(), ".midnight", "wallets", `${name}.json`);
  const doc = JSON.parse(readFileSync(file, "utf8"));
  return { seed: Buffer.from(doc.seed, "hex"), address: doc.addresses.preview };
}

/**
 * Synced enough to act on. Deliberately does not require DUST to report "strictly
 * complete": Midnight's own tutorial warns it may never do so on public networks, and the
 * CLI's deploy hangs for exactly that reason (friction log finding 40). DUST counts as
 * ready once it has applied every event relevant to this wallet.
 */
export function isUsable(state) {
  const unshielded = state.unshielded?.progress?.isStrictlyComplete() ?? false;
  const shielded = state.shielded?.state?.progress?.isStrictlyComplete() ?? false;
  const p = state.dust?.state?.progress;
  const dust = (p?.isStrictlyComplete?.() ?? false) ||
    (p && p.highestRelevantWalletIndex > 0 && p.appliedIndex >= p.highestRelevantWalletIndex) ||
    (p && p.highestRelevantWalletIndex === 0 && p.appliedIndex === 0);
  return { unshielded, shielded, dust: Boolean(dust), all: unshielded && shielded && Boolean(dust) };
}

export async function openWallet(name, config = PREVIEW) {
  const { seed, address } = loadSeed(name);
  const zswapKeys = ledger.ZswapSecretKeys.fromSeed(deriveKey(seed, Roles.Zswap));
  const dustKey = ledger.DustSecretKey.fromSeed(deriveKey(seed, Roles.Dust));
  const keystore = createKeystore(deriveKey(seed, Roles.NightExternal), config.networkId);

  const configuration = {
    networkId: config.networkId,
    indexerClientConnection: { indexerHttpUrl: config.indexer, indexerWsUrl: config.indexerWS },
    costParameters: { additionalFeeOverhead: 300000000000000n, feeBlocksMargin: 5 },
    txHistoryStorage: new InMemoryTransactionHistoryStorage(TransactionHistoryStorage.TransactionHistoryCommonSchema),
    provingServerUrl: new URL(config.proofServer),
    relayURL: new URL(config.node),
  };

  const saved = readState(name, address);
  const fresh = () => WalletFacade.init({
    configuration,
    shielded: (c) => ShieldedWallet(c).startWithSecretKeys(zswapKeys),
    unshielded: (c) => UnshieldedWallet(c).startWithPublicKey(PublicKey.fromKeyStore(keystore)),
    dust: (c) => DustWallet(c).startWithSecretKey(dustKey, ledger.LedgerParameters.initialParameters().dust),
  });

  let facade;
  let restored = false;
  if (saved) {
    try {
      facade = await WalletFacade.init({
        configuration,
        shielded: (c) => ShieldedWallet(c).restore(saved.shielded),
        unshielded: (c) => UnshieldedWallet(c).restore(saved.unshielded),
        dust: (c) => DustWallet(c).restore(saved.dust),
      });
      restored = true;
    } catch {
      facade = await fresh();
    }
  } else {
    facade = await fresh();
  }
  await facade.start(zswapKeys, dustKey);
  return { name, address, facade, keystore, zswapKeys, dustKey, restored, restoredFrom: restored ? saved.from : null };
}

function statePath(name) { return join(STATE_DIR, `${name}.json`); }

function readState(name, address) {
  // Two possible starting points with the same {shielded, unshielded, dust} format: our own
  // saved state, and whatever the wallet CLI last synced for this address. The newer one
  // wins; either way the wallet resumes instead of scanning the chain from genesis.
  const candidates = [];
  try {
    if (existsSync(statePath(name))) {
      const own = JSON.parse(readFileSync(statePath(name), "utf8"));
      candidates.push({ ...own, from: "daemon state", at: Date.parse(own.savedAt ?? 0) || 0 });
    }
  } catch { /* ignore */ }
  try {
    const cli = join(homedir(), ".midnight", "cache", "preview", `${address.slice(0, 20)}.json`);
    if (existsSync(cli)) {
      const doc = JSON.parse(readFileSync(cli, "utf8"));
      candidates.push({ ...doc.wallets, from: "wallet CLI cache", at: Date.parse(doc.timestamp ?? 0) || 0 });
    }
  } catch { /* ignore */ }
  return candidates.sort((a, b) => b.at - a.at)[0] ?? null;
}

/** Persist sync progress so the next start resumes instead of replaying from genesis. */
export async function saveState(wallet) {
  const f = wallet.facade;
  const [shielded, unshielded, dust] = await Promise.all([
    f.shielded.serializeState(), f.unshielded.serializeState(), f.dust.serializeState(),
  ]);
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  const tmp = statePath(wallet.name) + ".tmp";
  writeFileSync(tmp, JSON.stringify({ shielded, unshielded, dust, savedAt: new Date().toISOString() }), { mode: 0o600 });
  renameSync(tmp, statePath(wallet.name));
}
