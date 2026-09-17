import type { ChargedState } from "@midnightntwrk/onchain-runtime-v4";
import {
  type CircuitContext,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger,
} from "./managed/tournament_pass/contract/index.js";
import {
  type TournamentPrivateState,
  createPrivateState,
  witnesses,
} from "./witnesses.js";

/**
 * In-memory harness for the tournament pass contract.
 *
 * Each participant (organiser, player) is a separate instance holding its own
 * private state, sharing one contract state. Circuit calls thread the shared
 * contract state forward, which is what lets a player's claim see the passes
 * the organiser issued.
 */
export class TournamentSimulator {
  readonly contract: Contract<TournamentPrivateState>;
  readonly contractAddress: string;
  private contractState: ChargedState;

  private constructor(
    contract: Contract<TournamentPrivateState>,
    contractAddress: string,
    contractState: ChargedState,
  ) {
    this.contract = contract;
    this.contractAddress = contractAddress;
    this.contractState = contractState;
  }

  /** Deploy: the caller of the constructor becomes the organiser. */
  static async deploy(
    organiserState: TournamentPrivateState,
    tournamentId: Uint8Array,
    prizePerClaim: bigint,
  ): Promise<TournamentSimulator> {
    const contract = new Contract<TournamentPrivateState>(witnesses);
    const { currentContractState } = await contract.initialState(
      createConstructorContext(organiserState, "0".repeat(64)),
      tournamentId,
      prizePerClaim,
    );
    return new TournamentSimulator(
      contract,
      sampleContractAddress(),
      currentContractState.data,
    );
  }

  /** Current public ledger state, as any observer would read it. */
  ledger(): Ledger {
    return ledger(this.contractState);
  }

  private context(
    circuitId: string,
    privateState: TournamentPrivateState,
  ): CircuitContext<TournamentPrivateState> {
    return createCircuitContext(
      circuitId,
      this.contractAddress,
      "0".repeat(64),
      this.contractState,
      privateState,
    );
  }

  private commit(result: {
    context: CircuitContext<TournamentPrivateState>;
  }): void {
    this.contractState = result.context.callContext.currentQueryContext.state;
  }

  /** Player-side: derive the commitment to hand to the organiser. */
  async makePassCommitment(
    playerState: TournamentPrivateState,
  ): Promise<Uint8Array> {
    const result = await this.contract.circuits.makePassCommitment(
      this.context("makePassCommitment", playerState),
    );
    return result.result;
  }

  async issuePass(
    organiserState: TournamentPrivateState,
    commitment: Uint8Array,
  ): Promise<void> {
    this.commit(
      await this.contract.circuits.issuePass(
        this.context("issuePass", organiserState),
        commitment,
      ),
    );
  }

  async fundPool(
    organiserState: TournamentPrivateState,
    amount: bigint,
  ): Promise<void> {
    this.commit(
      await this.contract.circuits.fundPool(
        this.context("fundPool", organiserState),
        amount,
      ),
    );
  }

  async claimPrize(playerState: TournamentPrivateState): Promise<void> {
    this.commit(
      await this.contract.circuits.claimPrize(
        this.context("claimPrize", playerState),
      ),
    );
  }

  /**
   * Adversarial path: a contract instance whose `findPassPath` witness lies,
   * returning the genuine authentication path for someone else's leaf.
   *
   * The witness layer is untrusted by design, so this is the attack the
   * contract has to survive. `claimPrize` keeps only the sibling entries and
   * rebinds the leaf to the commitment it recomputed from the caller's own
   * secret, so the recomputed root does not match and `checkRoot` rejects.
   */
  async claimPrizeWithStolenPath(
    attackerState: TournamentPrivateState,
    victimCommitment: Uint8Array,
  ): Promise<void> {
    const lying = new Contract<TournamentPrivateState>({
      ...witnesses,
      findPassPath: (context, _commitment) =>
        witnesses.findPassPath(context, victimCommitment),
    });
    this.commit(
      await lying.circuits.claimPrize(
        this.context("claimPrize", attackerState),
      ),
    );
  }
}

export { createPrivateState };
