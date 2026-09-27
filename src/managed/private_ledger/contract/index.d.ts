import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Note = { domain: Uint8Array; owner: Uint8Array; amount: bigint };

export type NoteOpening = { domain: Uint8Array;
                            amount: bigint;
                            nonce: Uint8Array
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
  freshNonce(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  noteToSpend(context: __compactRuntime.WitnessContext<Ledger, PS>,
              d_0: Uint8Array,
              atLeast_0: bigint): [PS, NoteOpening];
  findNotePath(context: __compactRuntime.WitnessContext<Ledger, PS>,
               commitment_0: Uint8Array): [PS, MerkleTreePath<Uint8Array>];
}

export type ImpureCircuits<PS> = {
  name(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  symbol(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  decimals(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  tokenColor(context: __compactRuntime.CircuitContext<PS>, d_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mintNft(context: __compactRuntime.CircuitContext<PS>,
          serial_0: Uint8Array,
          to_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  toUtxo(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  toShielded(context: __compactRuntime.CircuitContext<PS>,
             d_0: Uint8Array,
             amount_0: bigint,
             recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  fromUtxo(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  fromShielded(context: __compactRuntime.CircuitContext<PS>,
               d_0: Uint8Array,
               coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): __compactRuntime.CircuitResults<PS, []>;
  publishMetadata(context: __compactRuntime.CircuitContext<PS>,
                  payload_0: TokenMetadataPayload): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  name(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  symbol(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  decimals(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  tokenColor(context: __compactRuntime.CircuitContext<PS>, d_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mintNft(context: __compactRuntime.CircuitContext<PS>,
          serial_0: Uint8Array,
          to_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  toUtxo(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  toShielded(context: __compactRuntime.CircuitContext<PS>,
             d_0: Uint8Array,
             amount_0: bigint,
             recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  fromUtxo(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  fromShielded(context: __compactRuntime.CircuitContext<PS>,
               d_0: Uint8Array,
               coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): __compactRuntime.CircuitResults<PS, []>;
  publishMetadata(context: __compactRuntime.CircuitContext<PS>,
                  payload_0: TokenMetadataPayload): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  metadataSlot(domainSep_0: Uint8Array, kind_0: bigint, key_0: Uint8Array): Uint8Array;
  ownerKey(sk_0: Uint8Array): Uint8Array;
  issuerKey(sk_0: Uint8Array): Uint8Array;
  noteCommitment(note_0: Note, nonce_0: Uint8Array): Uint8Array;
  nftDomain(serial_0: Uint8Array): Uint8Array;
  nullifierOf(sk_0: Uint8Array, commitment_0: Uint8Array): Uint8Array;
  outputNonce(tag_0: Uint8Array, sk_0: Uint8Array, spentNonce_0: Uint8Array): Uint8Array;
  tagged(tag_0: Uint8Array, seed_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  metadataSlot(context: __compactRuntime.CircuitContext<PS>,
               domainSep_0: Uint8Array,
               kind_0: bigint,
               key_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  ownerKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  issuerKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  noteCommitment(context: __compactRuntime.CircuitContext<PS>,
                 note_0: Note,
                 nonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  nftDomain(context: __compactRuntime.CircuitContext<PS>, serial_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  nullifierOf(context: __compactRuntime.CircuitContext<PS>,
              sk_0: Uint8Array,
              commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  outputNonce(context: __compactRuntime.CircuitContext<PS>,
              tag_0: Uint8Array,
              sk_0: Uint8Array,
              spentNonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  tagged(context: __compactRuntime.CircuitContext<PS>,
         tag_0: Uint8Array,
         seed_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  name(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  symbol(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  decimals(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  tokenColor(context: __compactRuntime.CircuitContext<PS>, d_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mintNft(context: __compactRuntime.CircuitContext<PS>,
          serial_0: Uint8Array,
          to_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  toUtxo(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  toShielded(context: __compactRuntime.CircuitContext<PS>,
             d_0: Uint8Array,
             amount_0: bigint,
             recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  fromUtxo(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  fromShielded(context: __compactRuntime.CircuitContext<PS>,
               d_0: Uint8Array,
               coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): __compactRuntime.CircuitResults<PS, []>;
  publishMetadata(context: __compactRuntime.CircuitContext<PS>,
                  payload_0: TokenMetadataPayload): __compactRuntime.CircuitResults<PS, []>;
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
  readonly _name: string;
  readonly _symbol: string;
  readonly _decimals: bigint;
  readonly domain: Uint8Array;
  readonly issuer: Uint8Array;
  notes: {
    isFull(): boolean;
    checkRoot(rt_0: { field: bigint }): boolean;
    root(): __compactRuntime.MerkleTreeDigest;
    firstFree(): bigint;
    pathForLeaf(index_0: bigint, leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array>;
    findPathForLeaf(leaf_0: Uint8Array): __compactRuntime.MerkleTreePath<Uint8Array> | undefined;
    history(): Iterator<__compactRuntime.MerkleTreeDigest>
  };
  spent: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  commitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  usedNonces: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  mintedByDomain: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  utxoSupplyByDomain: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  nftDomains: {
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
               tokenName_0: string,
               tokenSymbol_0: string,
               tokenDecimals_0: bigint,
               domainSep_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
