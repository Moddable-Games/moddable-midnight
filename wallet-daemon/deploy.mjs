// Contract deployment and calls, using a wallet the daemon already holds.
//
// The wallet CLI's `contract deploy` starts its own wallet server and waits for a full sync
// every time, which never finishes because shielded progress is not saved between runs
// (friction log finding 40). Here the providers are the standard midnight-js ones, and the
// wallet provider is our already-synced facade, so a deploy starts immediately.
//
// Contracts resolve the repo's single copy of compact-runtime and the ledger, the same one
// the wallet uses (finding 25). Each wallet keeps its own private state per contract.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { pathToFileURL } from "node:url";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { deployContract, submitCallTx } from "@midnight-ntwrk/midnight-js-contracts";
import { createCircuitContext } from "@midnight-ntwrk/compact-runtime";
import { crewWitnesses, createCrewPrivateState } from "../src/crew-witnesses.ts";
import { CompiledContract } from "@midnight-ntwrk/compact-js";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { PREVIEW } from "./wallet.mjs";

setNetworkId("preview");

const CONTRACTS_DIR = new URL("./contracts/", import.meta.url).pathname;
const ROOT = new URL("../", import.meta.url).pathname;
const STATE_DIR = new URL("./state/", import.meta.url).pathname;
const CREW_SECRETS_FILE = STATE_DIR + "crew-secrets.json";

/** Every contract the daemon can deploy or call, and where each wallet's private state comes from. */
const CONTRACTS = {
  mint_spike: { dir: CONTRACTS_DIR + "mint_spike", witnesses: null, privateState: () => ({}) },
  crew_treasury: {
    dir: ROOT + "src/managed/crew_treasury",
    witnesses: crewWitnesses,
    privateState: (walletName) => crewSecrets(walletName),
  },
};

/**
 * Each wallet's crew secret and mandate nonce, made once and kept only in the daemon's state
 * dir. The organiser's secret is what makes it the organiser; an agent's is its mandate.
 */
function crewSecrets(walletName) {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
  const all = existsSync(CREW_SECRETS_FILE) ? JSON.parse(readFileSync(CREW_SECRETS_FILE, "utf8")) : {};
  if (!all[walletName]) {
    all[walletName] = { secretKey: randomBytes(32).toString("hex"), mandateNonce: randomBytes(32).toString("hex") };
    writeFileSync(CREW_SECRETS_FILE, JSON.stringify(all, null, 2), { mode: 0o600 });
  }
  const { secretKey, mandateNonce } = all[walletName];
  return createCrewPrivateState(Buffer.from(secretKey, "hex"), Buffer.from(mandateNonce, "hex"));
}

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
  const entry = CONTRACTS[name];
  if (!entry) throw new Error(`unknown contract ${name}`);
  const managedDir = entry.dir;
  if (!existsSync(managedDir + "/contract/index.js")) throw new Error(`no compiled contract at ${managedDir}`);
  const module = await import(pathToFileURL(managedDir + "/contract/index.js").href);
  const compiledContract = CompiledContract.make(name, module.Contract).pipe(
    entry.witnesses ? (c) => CompiledContract.withWitnesses(c, entry.witnesses) : CompiledContract.withVacantWitnesses,
    (c) => CompiledContract.withCompiledFileAssets(c, managedDir),
  );
  return { entry, managedDir, compiledContract, module };
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

const privateStateIdFor = (name, handle) => `${name}:${handle.name}`;

/** Deploys a contract. Returns its address and the deploy transaction. */
export async function deploy(handle, name, { args = [], onPhase = () => {} } = {}) {
  const { entry, managedDir, compiledContract } = await loadContract(name);
  const providers = providersFor(handle, managedDir, name, onPhase);
  onPhase("building");
  const deployed = await deployContract(providers, {
    compiledContract,
    privateStateId: privateStateIdFor(name, handle),
    initialPrivateState: entry.privateState(handle.name),
    args,
  });
  const pub = deployed.deployTxData.public;
  return { contractAddress: pub.contractAddress, txId: pub.txId, txHash: pub.txHash, block: pub.blockHeight, status: pub.status };
}

/**
 * Calls a circuit on a deployed contract as `handle`. `recipients` are other wallets that the
 * call sends shielded coins to: without their encryption keys the coins are created but the
 * recipients can never see them (notes/KAPA-QUERIES.md, query 11).
 */
export async function call(handle, name, contractAddress, circuit, args = [], { onPhase = () => {}, recipients = [] } = {}) {
  const { entry, managedDir, compiledContract } = await loadContract(name);
  const providers = providersFor(handle, managedDir, name, onPhase);
  const privateStateId = privateStateIdFor(name, handle);
  providers.privateStateProvider.setContractAddress(contractAddress);
  if (!(await providers.privateStateProvider.get(privateStateId))) {
    await providers.privateStateProvider.set(privateStateId, entry.privateState(handle.name));
  }
  const additionalCoinEncPublicKeyMappings = recipients.length
    ? new Map(recipients.map((r) => [r.zswapKeys.coinPublicKey, r.zswapKeys.encryptionPublicKey]))
    : undefined;
  onPhase("building");
  const result = await submitCallTx(providers, {
    compiledContract, contractAddress, circuitId: circuit, privateStateId, args, additionalCoinEncPublicKeyMappings,
  });
  const pub = result.public;
  return { txId: pub.txId, txHash: pub.txHash, block: pub.blockHeight, status: pub.status, result: result.private?.result };
}

/**
 * The mandate commitment an agent hands the organiser, computed locally by running the
 * contract's makeMandateCommitment circuit against the deployed contract's current state.
 * Nothing is submitted; the agent's secret never leaves this process.
 */
export async function mandateCommitment(agentName, contractAddress) {
  const { module } = await loadContract("crew_treasury");
  const publicData = indexerPublicDataProvider(PREVIEW.indexer, PREVIEW.indexerWS);
  const onChain = await publicData.queryContractState(contractAddress);
  if (!onChain) throw new Error(`no contract at ${contractAddress}`);
  const contract = new module.Contract(crewWitnesses);
  const context = createCircuitContext(contractAddress, "0".repeat(64), onChain.data, crewSecrets(agentName));
  const out = await contract.circuits.makeMandateCommitment(context);
  return out.result;
}
