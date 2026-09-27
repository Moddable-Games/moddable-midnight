import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

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
}

export type ImpureCircuits<PS> = {
  name(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  symbol(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  decimals(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  tokenColor(context: __compactRuntime.CircuitContext<PS>, d_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mintNft(context: __compactRuntime.CircuitContext<PS>,
          serial_0: Uint8Array,
          to_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  shield(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  toUtxo(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  unshield(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): __compactRuntime.CircuitResults<PS, []>;
  fromUtxo(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  publishMetadata(context: __compactRuntime.CircuitContext<PS>,
                  payload_0: TokenMetadataPayload): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  name(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  symbol(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  decimals(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  tokenColor(context: __compactRuntime.CircuitContext<PS>, d_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mintNft(context: __compactRuntime.CircuitContext<PS>,
          serial_0: Uint8Array,
          to_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  shield(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  toUtxo(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  unshield(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): __compactRuntime.CircuitResults<PS, []>;
  fromUtxo(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  publishMetadata(context: __compactRuntime.CircuitContext<PS>,
                  payload_0: TokenMetadataPayload): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  metadataSlot(domainSep_0: Uint8Array, kind_0: bigint, key_0: Uint8Array): Uint8Array;
  accountOf(sk_0: Uint8Array): Uint8Array;
  nftDomain(serial_0: Uint8Array): Uint8Array;
  balanceSlot(d_0: Uint8Array, account_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  metadataSlot(context: __compactRuntime.CircuitContext<PS>,
               domainSep_0: Uint8Array,
               kind_0: bigint,
               key_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  accountOf(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  nftDomain(context: __compactRuntime.CircuitContext<PS>, serial_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  balanceSlot(context: __compactRuntime.CircuitContext<PS>,
              d_0: Uint8Array,
              account_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  name(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  symbol(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, string>;
  decimals(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  tokenColor(context: __compactRuntime.CircuitContext<PS>, d_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  mintNft(context: __compactRuntime.CircuitContext<PS>,
          serial_0: Uint8Array,
          to_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  shield(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  toUtxo(context: __compactRuntime.CircuitContext<PS>,
         d_0: Uint8Array,
         amount_0: bigint,
         recipient_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  unshield(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint }): __compactRuntime.CircuitResults<PS, []>;
  fromUtxo(context: __compactRuntime.CircuitContext<PS>,
           d_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
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
  readonly admin: Uint8Array;
  readonly minter: Uint8Array;
  balances: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  supplyByDomain: {
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
  readonly mintCounter: bigint;
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
