/**
 * Print the pass commitment for the private state the wallet CLI stored when
 * it deployed or called the contract.
 *
 * `makePassCommitment` runs locally (proof: false), so this never touches the
 * network. The organiser then issues the pass on-chain with:
 *
 *   midnight contract call --circuit issuePass --args '{"commitment": [...]}'
 *
 * Usage: npx tsx scripts/pass-commitment.ts <contract-address>
 */
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import {
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import { Contract } from "../src/managed/tournament_pass/contract/index.js";
import {
  type TournamentPrivateState,
  createPrivateState,
  witnesses,
} from "../src/witnesses.js";

// Names and password used by midnight-wallet-cli 0.5.2 (read from its source).
const PRIVATE_STATE_ID = "tournament_passPrivateState";

const provider = levelPrivateStateProvider<string, TournamentPrivateState>({
  privateStateStoreName: PRIVATE_STATE_ID,
  privateStoragePasswordProvider: () =>
    Promise.resolve("mn-contract-default-pwd-16ch"),
  accountId: "mn-contract-runner",
});

const address = process.argv[2];
if (!address) {
  throw new Error("Usage: npx tsx scripts/pass-commitment.ts <contract-address>");
}
// Private state is scoped per contract in midnight-js 4.x.
provider.setContractAddress(address);

const stored = await provider.get(PRIVATE_STATE_ID);
if (!stored) {
  throw new Error(
    "No stored private state. Deploy or call the contract with the wallet CLI first.",
  );
}

// Rebuild from the secret key alone, exactly as the CLI does on its next call.
const state = createPrivateState(stored.secretKey);

const contract = new Contract<TournamentPrivateState>(witnesses);
const { currentContractState } = await contract.initialState(
  createConstructorContext(state, "0".repeat(64)),
  new Uint8Array(32),
  0n,
);
const { result } = await contract.circuits.makePassCommitment(
  createCircuitContext(
    sampleContractAddress(),
    "0".repeat(64),
    currentContractState.data,
    state,
  ),
);

console.log(JSON.stringify(Array.from(result)));
process.exit(0);
