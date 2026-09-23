import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type MerkleTreeDigest = { field: bigint };

export type MerkleTreePath<T> = { leaf: T;
                                  path: { sibling: MerkleTreeDigest,
                                          goes_left: boolean
                                        }[]
                                };

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  mandateNonce(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  findMandatePath(context: __compactRuntime.WitnessContext<Ledger, PS>,
                  commitment_0: Uint8Array): [PS, MerkleTreePath<Uint8Array>];
}

export type ImpureCircuits<PS> = {
  mintTreasury(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  issueMandate(context: __compactRuntime.CircuitContext<PS>,
               commitment_0: Uint8Array,
               holder_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  openPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>, value_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  setDrawAmount(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  setMetadata(context: __compactRuntime.CircuitContext<PS>,
              treasuryDigest_0: Uint8Array,
              mandateDigest_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  makeMandateCommitment(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, Uint8Array>;
  draw(context: __compactRuntime.CircuitContext<PS>,
       recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  mintTreasury(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  issueMandate(context: __compactRuntime.CircuitContext<PS>,
               commitment_0: Uint8Array,
               holder_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  openPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>, value_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  setDrawAmount(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  setMetadata(context: __compactRuntime.CircuitContext<PS>,
              treasuryDigest_0: Uint8Array,
              mandateDigest_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  makeMandateCommitment(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, Uint8Array>;
  draw(context: __compactRuntime.CircuitContext<PS>,
       recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  mintTreasury(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  issueMandate(context: __compactRuntime.CircuitContext<PS>,
               commitment_0: Uint8Array,
               holder_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  openPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>, value_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  setDrawAmount(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  setMetadata(context: __compactRuntime.CircuitContext<PS>,
              treasuryDigest_0: Uint8Array,
              mandateDigest_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  makeMandateCommitment(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, Uint8Array>;
  draw(context: __compactRuntime.CircuitContext<PS>,
       recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly organiser: Uint8Array;
  readonly crewId: Uint8Array;
  readonly treasuryColor: Uint8Array;
  readonly treasuryMinted: bigint;
  readonly drawAmount: bigint;
  mandates: {
    isFull(): boolean;
    checkRoot(rt_0: MerkleTreeDigest): boolean;
    root(): __compactRuntime.MerkleTreeDigest;
    firstFree(): bigint;
    pathForLeaf(index_0: bigint, leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array>;
    findPathForLeaf(leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array> | undefined;
    history(): Iterator<__compactRuntime.MerkleTreeDigest>
  };
  readonly mandateCount: bigint;
  issued: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly currentPeriod: Uint8Array;
  readonly paused: boolean;
  spentDraws: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly drawCount: bigint;
  readonly treasuryMetadata: Uint8Array;
  readonly mandateMetadata: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               cid_0: Uint8Array,
               amountPerDraw_0: bigint): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
