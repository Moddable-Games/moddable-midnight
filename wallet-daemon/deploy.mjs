// Contract deployment and calls, using a wallet the daemon already holds.
//
// The wallet CLI's `contract deploy` starts its own wallet server and waits for a full sync
// every time, which never finishes because shielded progress is not saved between runs
// (friction log finding 40). Here the providers are the standard midnight-js ones, and the
// wallet provider is our already-synced facade, so a deploy starts immediately.
//
// Contracts are loaded from wallet-daemon/contracts/<name>/ so that they resolve the same
// single copy of compact-runtime and the ledger as the wallet itself (finding 25).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { pathToFileURL } from "node:url";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { deployContract, findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { CompiledContract } from "@midnight-ntwrk/compact-js";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { PREVIEW } from "./wallet.mjs";

setNetworkId("preview");

const CONTRACTS_DIR = new URL("./contracts/", import.meta.url).pathname;
const STATE_DIR = new URL("./state/", import.meta.url).pathname;

/** The private-state store is encrypted; its password lives only in the daemon's state dir. */
function storagePassword() {
  const file = STATE_DIR + "private-state-password";
  if (!existsSync(file)) {
    mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
    // The store requires three of: upper, lower, digits, symbols. Hex alone has only two.
    const password = `Md-${randomBytes(18).toString("base64url")}-7x`;
    writeFileSync(file, password, { mode: 0o600 });
  }
  return readFileSync(file, "utf8").trim();
}

/** midnight-js wallet and submission providers, backed by one of the daemon's facades. */
export function walletProviders(handle, onPhase = () => {}) {
  const { facade, zswapKeys, dustKey, keystore } = handle;
  const walletProvider = {
    getCoinPublicKey: () => zswapKeys.coinPublicKey,
    getEncryptionPublicKey: () => zswapKeys.encryptionPublicKey,
    // Same steps as the wallet CLI's balanceUnsealedTransaction: balance, sign, prove.
    async balanceTx(tx, ttl) {
      onPhase("balancing");
      const recipe = await facade.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: zswapKeys, dustSecretKey: dustKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60_000) },
      );
      onPhase("signing");
      const signed = await facade.signRecipe(recipe, (data) => keystore.signData(data));
      onPhase("proving");
      return facade.finalizeRecipe(signed);
    },
  };
  const midnightProvider = {
    async submitTx(tx) {
      onPhase("submitting");
      await facade.submitTransaction(tx);
      const id = tx.identifiers()[0];
      // Recorded now, so a failure in any later step cannot lose track of a live transaction.
      onPhase("submitted", id);
      return id;
    },
  };
  return { walletProvider, midnightProvider };
}

export async function loadContract(name) {
  const managedDir = CONTRACTS_DIR + name;
  if (!existsSync(managedDir + "/contract/index.js")) throw new Error(`no compiled contract at ${managedDir}`);
  const module = await import(pathToFileURL(managedDir + "/contract/index.js").href);
  const compiledContract = CompiledContract.make(name, module.Contract).pipe(
    CompiledContract.withVacantWitnesses,
    (c) => CompiledContract.withCompiledFileAssets(c, managedDir),
  );
  return { managedDir, compiledContract, module };
}

function providersFor(handle, managedDir, name, onPhase) {
  const zkConfigProvider = new NodeZkConfigProvider(managedDir);
  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: STATE_DIR + `private-${name}`,
      privateStoragePasswordProvider: () => Promise.resolve(storagePassword()),
      accountId: handle.name,
    }),
    publicDataProvider: indexerPublicDataProvider(PREVIEW.indexer, PREVIEW.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(PREVIEW.proofServer, zkConfigProvider),
    ...walletProviders(handle, onPhase),
  };
}

/** Deploys a contract with no witnesses. Returns its address and the deploy transaction. */
export async function deploy(handle, name, { args = [], onPhase = () => {} } = {}) {
  const { managedDir, compiledContract } = await loadContract(name);
  const providers = providersFor(handle, managedDir, name, onPhase);
  onPhase("building");
  const deployed = await deployContract(providers, {
    compiledContract,
    privateStateId: `${name}PrivateState`,
    initialPrivateState: {},
    args,
  });
  const pub = deployed.deployTxData.public;
  return { contractAddress: pub.contractAddress, txId: pub.txId, txHash: pub.txHash, block: pub.blockHeight, status: pub.status };
}

/** Calls a circuit on a deployed contract. Returns the transaction and the circuit's result. */
export async function call(handle, name, contractAddress, circuit, args = [], { onPhase = () => {} } = {}) {
  const { managedDir, compiledContract } = await loadContract(name);
  const providers = providersFor(handle, managedDir, name, onPhase);
  onPhase("building");
  const found = await findDeployedContract(providers, {
    contractAddress,
    compiledContract,
    privateStateId: `${name}PrivateState`,
    initialPrivateState: {},
  });
  const result = await found.callTx[circuit](...args);
  const pub = result.public;
  return { txId: pub.txId, txHash: pub.txHash, block: pub.blockHeight, status: pub.status, result: result.private?.result };
}
