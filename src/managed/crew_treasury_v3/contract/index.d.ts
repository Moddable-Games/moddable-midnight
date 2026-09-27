import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type MandateTerms = { capPerDraw: bigint;
                             drawsPerPeriod: bigint;
                             salt: Uint8Array
                           };

export type MerkleTreePath<T> = { leaf: T;
                                  path: { sibling: { field: bigint },
                                          goes_left: boolean
                                        }[]
                                };

export enum EventType { ShieldedSpend = 0,
                        ShieldedReceive = 1,
                        ShieldedMint = 2,
                        ShieldedBurn = 3,
                        UnshieldedSpend = 4,
                        UnshieldedReceive = 5,
                        UnshieldedMint = 6,
                        UnshieldedBurn = 7,
                        Paused = 8,
                        Unpaused = 9,
                        Misc = 10
}

export type ContractEvent = { eventType: EventType;
                              domainSep: Uint8Array;
                              tokenType: Uint8Array;
                              amount: bigint;
                              subject: Uint8Array
                            };

export type TokenMetadataPayload = { domainSep: Uint8Array;
                                     kind: bigint;
                                     key: Uint8Array;
                                     valType: bigint;
                                     valLen: bigint;
                                     value: Uint8Array
                                   };

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  mandateTerms(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, MandateTerms];
  findMandatePath(context: __compactRuntime.WitnessContext<Ledger, PS>,
                  leaf_0: Uint8Array): [PS, MerkleTreePath<Uint8Array>];
}

export type ImpureCircuits<PS> = {
  mintTreasury(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  issueMandate(context: __compactRuntime.CircuitContext<PS>,
               key_0: Uint8Array,
               terms_0: MandateTerms,
               holder_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  openPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>, value_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  revokeAll(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  blockPayee(context: __compactRuntime.CircuitContext<PS>,
             payee_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
  unblockPayee(context: __compactRuntime.CircuitContext<PS>,
               payee_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
  publishMetadata(context: __compactRuntime.CircuitContext<PS>,
                  payload_0: TokenMetadataPayload): __compactRuntime.CircuitResults<PS, []>;
  draw(context: __compactRuntime.CircuitContext<PS>,
       amount_0: bigint,
       slot_0: bigint,
       recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  mintTreasury(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  issueMandate(context: __compactRuntime.CircuitContext<PS>,
               key_0: Uint8Array,
               terms_0: MandateTerms,
               holder_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  openPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>, value_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  revokeAll(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  blockPayee(context: __compactRuntime.CircuitContext<PS>,
             payee_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
  unblockPayee(context: __compactRuntime.CircuitContext<PS>,
               payee_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
  publishMetadata(context: __compactRuntime.CircuitContext<PS>,
                  payload_0: TokenMetadataPayload): __compactRuntime.CircuitResults<PS, []>;
  draw(context: __compactRuntime.CircuitContext<PS>,
       amount_0: bigint,
       slot_0: bigint,
       recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  metadataSlot(domainSep_0: Uint8Array, kind_0: bigint, key_0: Uint8Array): Uint8Array;
  organiserKey(sk_0: Uint8Array): Uint8Array;
  agentKey(sk_0: Uint8Array, cid_0: Uint8Array): Uint8Array;
  mandateLeaf(cid_0: Uint8Array,
              key_0: Uint8Array,
              e_0: bigint,
              terms_0: MandateTerms): Uint8Array;
}

export type Circuits<PS> = {
  metadataSlot(context: __compactRuntime.CircuitContext<PS>,
               domainSep_0: Uint8Array,
               kind_0: bigint,
               key_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  organiserKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  agentKey(context: __compactRuntime.CircuitContext<PS>,
           sk_0: Uint8Array,
           cid_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  mandateLeaf(context: __compactRuntime.CircuitContext<PS>,
              cid_0: Uint8Array,
              key_0: Uint8Array,
              e_0: bigint,
              terms_0: MandateTerms): __compactRuntime.CircuitResults<PS, Uint8Array>;
  mintTreasury(context: __compactRuntime.CircuitContext<PS>, amount_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  issueMandate(context: __compactRuntime.CircuitContext<PS>,
               key_0: Uint8Array,
               terms_0: MandateTerms,
               holder_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  openPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setPaused(context: __compactRuntime.CircuitContext<PS>, value_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  revokeAll(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  blockPayee(context: __compactRuntime.CircuitContext<PS>,
             payee_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
  unblockPayee(context: __compactRuntime.CircuitContext<PS>,
               payee_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
  publishMetadata(context: __compactRuntime.CircuitContext<PS>,
                  payload_0: TokenMetadataPayload): __compactRuntime.CircuitResults<PS, []>;
  draw(context: __compactRuntime.CircuitContext<PS>,
       amount_0: bigint,
       slot_0: bigint,
       recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  eventLog: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): ContractEvent;
    [Symbol.iterator](): Iterator<[bigint, ContractEvent]>
  };
  readonly eventCount: bigint;
  tokenMetadata: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): TokenMetadataPayload;
    [Symbol.iterator](): Iterator<[Uint8Array, TokenMetadataPayload]>
  };
  readonly organiser: Uint8Array;
  readonly crewId: Uint8Array;
  readonly treasuryColor: Uint8Array;
  readonly treasuryMinted: bigint;
  mandates: {
    isFull(): boolean;
    checkRoot(rt_0: { field: bigint }): boolean;
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
  appointed: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  mandateNfts: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly epoch: bigint;
  readonly currentPeriod: Uint8Array;
  readonly paused: boolean;
  spentDraws: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly drawCount: bigint;
  blockedPayees: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
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
               cid_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
