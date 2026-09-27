import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var EventType;
(function (EventType) {
  EventType[EventType['ShieldedSpend'] = 0] = 'ShieldedSpend';
  EventType[EventType['ShieldedReceive'] = 1] = 'ShieldedReceive';
  EventType[EventType['ShieldedMint'] = 2] = 'ShieldedMint';
  EventType[EventType['ShieldedBurn'] = 3] = 'ShieldedBurn';
  EventType[EventType['UnshieldedSpend'] = 4] = 'UnshieldedSpend';
  EventType[EventType['UnshieldedReceive'] = 5] = 'UnshieldedReceive';
  EventType[EventType['UnshieldedMint'] = 6] = 'UnshieldedMint';
  EventType[EventType['UnshieldedBurn'] = 7] = 'UnshieldedBurn';
  EventType[EventType['Paused'] = 8] = 'Paused';
  EventType[EventType['Unpaused'] = 9] = 'Unpaused';
  EventType[EventType['Misc'] = 10] = 'Misc';
})(EventType || (EventType = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

const _descriptor_2 = __compactRuntime.CompactTypeBoolean;

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_4 = new __compactRuntime.CompactTypeBytes(189);

class _TokenMetadataPayload_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_4.alignment())))));
  }
  fromValue(value_0) {
    return {
      domainSep: _descriptor_0.fromValue(value_0),
      kind: _descriptor_3.fromValue(value_0),
      key: _descriptor_0.fromValue(value_0),
      valType: _descriptor_3.fromValue(value_0),
      valLen: _descriptor_3.fromValue(value_0),
      value: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domainSep).concat(_descriptor_3.toValue(value_0.kind).concat(_descriptor_0.toValue(value_0.key).concat(_descriptor_3.toValue(value_0.valType).concat(_descriptor_3.toValue(value_0.valLen).concat(_descriptor_4.toValue(value_0.value))))));
  }
}

const _descriptor_5 = new _TokenMetadataPayload_0();

class _ZswapCoinPublicKey_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_6 = new _ZswapCoinPublicKey_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_7 = new _ContractAddress_0();

class _ShieldedCoinInfo_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment()));
  }
  fromValue(value_0) {
    return {
      nonce: _descriptor_0.fromValue(value_0),
      color: _descriptor_0.fromValue(value_0),
      value: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.nonce).concat(_descriptor_0.toValue(value_0.color).concat(_descriptor_1.toValue(value_0.value)));
  }
}

const _descriptor_8 = new _ShieldedCoinInfo_0();

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_10 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_11 = __compactRuntime.CompactTypeOpaqueString;

class _Either_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_6.alignment().concat(_descriptor_7.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_6.fromValue(value_0),
      right: _descriptor_7.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_6.toValue(value_0.left).concat(_descriptor_7.toValue(value_0.right)));
  }
}

const _descriptor_12 = new _Either_0();

const _descriptor_13 = new __compactRuntime.CompactTypeEnum(10, 1);

class _ContractEvent_0 {
  alignment() {
    return _descriptor_13.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment()))));
  }
  fromValue(value_0) {
    return {
      eventType: _descriptor_13.fromValue(value_0),
      domainSep: _descriptor_0.fromValue(value_0),
      tokenType: _descriptor_0.fromValue(value_0),
      amount: _descriptor_1.fromValue(value_0),
      subject: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_13.toValue(value_0.eventType).concat(_descriptor_0.toValue(value_0.domainSep).concat(_descriptor_0.toValue(value_0.tokenType).concat(_descriptor_1.toValue(value_0.amount).concat(_descriptor_0.toValue(value_0.subject)))));
  }
}

const _descriptor_14 = new _ContractEvent_0();

const _descriptor_15 = __compactRuntime.CompactTypeField;

class _QualifiedShieldedCoinInfo_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_9.alignment())));
  }
  fromValue(value_0) {
    return {
      nonce: _descriptor_0.fromValue(value_0),
      color: _descriptor_0.fromValue(value_0),
      value: _descriptor_1.fromValue(value_0),
      mt_index: _descriptor_9.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.nonce).concat(_descriptor_0.toValue(value_0.color).concat(_descriptor_1.toValue(value_0.value).concat(_descriptor_9.toValue(value_0.mt_index))));
  }
}

const _descriptor_16 = new _QualifiedShieldedCoinInfo_0();

const _descriptor_17 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_18 = new __compactRuntime.CompactTypeBytes(21);

class _CoinPreimage_0 {
  alignment() {
    return _descriptor_18.alignment().concat(_descriptor_8.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_18.fromValue(value_0),
      info: _descriptor_8.fromValue(value_0),
      dataType: _descriptor_2.fromValue(value_0),
      data: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_18.toValue(value_0.domain_sep).concat(_descriptor_8.toValue(value_0.info).concat(_descriptor_2.toValue(value_0.dataType).concat(_descriptor_0.toValue(value_0.data))));
  }
}

const _descriptor_19 = new _CoinPreimage_0();

class _MetadataSlot_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      tag: _descriptor_0.fromValue(value_0),
      domainSep: _descriptor_0.fromValue(value_0),
      kind: _descriptor_3.fromValue(value_0),
      key: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.tag).concat(_descriptor_0.toValue(value_0.domainSep).concat(_descriptor_3.toValue(value_0.kind).concat(_descriptor_0.toValue(value_0.key))));
  }
}

const _descriptor_20 = new _MetadataSlot_0();

class _NonceInput_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_9.alignment()));
  }
  fromValue(value_0) {
    return {
      tag: _descriptor_0.fromValue(value_0),
      secret: _descriptor_0.fromValue(value_0),
      index: _descriptor_9.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.tag).concat(_descriptor_0.toValue(value_0.secret).concat(_descriptor_9.toValue(value_0.index)));
  }
}

const _descriptor_21 = new _NonceInput_0();

const _descriptor_22 = new __compactRuntime.CompactTypeVector(2, _descriptor_15);

class _Maybe_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_8.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_2.fromValue(value_0),
      value: _descriptor_8.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_some).concat(_descriptor_8.toValue(value_0.value));
  }
}

const _descriptor_23 = new _Maybe_0();

class _ShieldedSendResult_0 {
  alignment() {
    return _descriptor_23.alignment().concat(_descriptor_8.alignment());
  }
  fromValue(value_0) {
    return {
      change: _descriptor_23.fromValue(value_0),
      sent: _descriptor_8.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_23.toValue(value_0.change).concat(_descriptor_8.toValue(value_0.sent));
  }
}

const _descriptor_24 = new _ShieldedSendResult_0();

class _Either_1 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_25 = new _Either_1();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.localSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localSecretKey');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      metadataSlot(context, ...args_1) {
        return { result: pureCircuits.metadataSlot(...args_1), context };
      },
      issuerKey(context, ...args_1) {
        return { result: pureCircuits.issuerKey(...args_1), context };
      },
      name: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`name: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('name',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 85 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._name_0(context, partialProofData);
        partialProofData.output = { value: _descriptor_11.toValue(result_0), alignment: _descriptor_11.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      symbol: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`symbol: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('symbol',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 89 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._symbol_0(context, partialProofData);
        partialProofData.output = { value: _descriptor_11.toValue(result_0), alignment: _descriptor_11.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      decimals: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`decimals: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('decimals',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 93 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._decimals_0(context, partialProofData);
        partialProofData.output = { value: _descriptor_3.toValue(result_0), alignment: _descriptor_3.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      tokenColor: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`tokenColor: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const domain_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('tokenColor',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 97 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(domain_0.buffer instanceof ArrayBuffer && domain_0.BYTES_PER_ELEMENT === 1 && domain_0.length === 32)) {
          __compactRuntime.typeError('tokenColor',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'native_shielded.compact line 97 char 1',
                                     'Bytes<32>',
                                     domain_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(domain_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._tokenColor_0(context, partialProofData, domain_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      nftDomain(context, ...args_1) {
        return { result: pureCircuits.nftDomain(...args_1), context };
      },
      totalSupply: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`totalSupply: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const domain_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('totalSupply',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 106 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(domain_0.buffer instanceof ArrayBuffer && domain_0.BYTES_PER_ELEMENT === 1 && domain_0.length === 32)) {
          __compactRuntime.typeError('totalSupply',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'native_shielded.compact line 106 char 1',
                                     'Bytes<32>',
                                     domain_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(domain_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._totalSupply_0(context, partialProofData, domain_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      mint: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`mint: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const domain_0 = args_1[1];
        const recipient_0 = args_1[2];
        const amount_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('mint',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 142 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(domain_0.buffer instanceof ArrayBuffer && domain_0.BYTES_PER_ELEMENT === 1 && domain_0.length === 32)) {
          __compactRuntime.typeError('mint',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'native_shielded.compact line 142 char 1',
                                     'Bytes<32>',
                                     domain_0)
        }
        if (!(typeof(recipient_0) === 'object' && recipient_0.bytes.buffer instanceof ArrayBuffer && recipient_0.bytes.BYTES_PER_ELEMENT === 1 && recipient_0.bytes.length === 32)) {
          __compactRuntime.typeError('mint',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'native_shielded.compact line 142 char 1',
                                     'struct ZswapCoinPublicKey<bytes: Bytes<32>>',
                                     recipient_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('mint',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'native_shielded.compact line 142 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amount_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(domain_0).concat(_descriptor_6.toValue(recipient_0).concat(_descriptor_9.toValue(amount_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_9.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._mint_0(context,
                                      partialProofData,
                                      domain_0,
                                      recipient_0,
                                      amount_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      mintNft: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`mintNft: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const serial_0 = args_1[1];
        const recipient_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('mintNft',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 148 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(serial_0.buffer instanceof ArrayBuffer && serial_0.BYTES_PER_ELEMENT === 1 && serial_0.length === 32)) {
          __compactRuntime.typeError('mintNft',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'native_shielded.compact line 148 char 1',
                                     'Bytes<32>',
                                     serial_0)
        }
        if (!(typeof(recipient_0) === 'object' && recipient_0.bytes.buffer instanceof ArrayBuffer && recipient_0.bytes.BYTES_PER_ELEMENT === 1 && recipient_0.bytes.length === 32)) {
          __compactRuntime.typeError('mintNft',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'native_shielded.compact line 148 char 1',
                                     'struct ZswapCoinPublicKey<bytes: Bytes<32>>',
                                     recipient_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(serial_0).concat(_descriptor_6.toValue(recipient_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_6.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._mintNft_0(context,
                                         partialProofData,
                                         serial_0,
                                         recipient_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      burn: (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`burn: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const domain_0 = args_1[1];
        const coin_0 = args_1[2];
        const amount_0 = args_1[3];
        const refundTo_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('burn',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 164 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(domain_0.buffer instanceof ArrayBuffer && domain_0.BYTES_PER_ELEMENT === 1 && domain_0.length === 32)) {
          __compactRuntime.typeError('burn',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'native_shielded.compact line 164 char 1',
                                     'Bytes<32>',
                                     domain_0)
        }
        if (!(typeof(coin_0) === 'object' && coin_0.nonce.buffer instanceof ArrayBuffer && coin_0.nonce.BYTES_PER_ELEMENT === 1 && coin_0.nonce.length === 32 && coin_0.color.buffer instanceof ArrayBuffer && coin_0.color.BYTES_PER_ELEMENT === 1 && coin_0.color.length === 32 && typeof(coin_0.value) === 'bigint' && coin_0.value >= 0n && coin_0.value <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('burn',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'native_shielded.compact line 164 char 1',
                                     'struct ShieldedCoinInfo<nonce: Bytes<32>, color: Bytes<32>, value: Uint<0..340282366920938463463374607431768211456>>',
                                     coin_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('burn',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'native_shielded.compact line 164 char 1',
                                     'Uint<0..340282366920938463463374607431768211456>',
                                     amount_0)
        }
        if (!(typeof(refundTo_0) === 'object' && refundTo_0.bytes.buffer instanceof ArrayBuffer && refundTo_0.bytes.BYTES_PER_ELEMENT === 1 && refundTo_0.bytes.length === 32)) {
          __compactRuntime.typeError('burn',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'native_shielded.compact line 164 char 1',
                                     'struct ZswapCoinPublicKey<bytes: Bytes<32>>',
                                     refundTo_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(domain_0).concat(_descriptor_8.toValue(coin_0).concat(_descriptor_1.toValue(amount_0).concat(_descriptor_6.toValue(refundTo_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_8.alignment().concat(_descriptor_1.alignment().concat(_descriptor_6.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._burn_0(context,
                                      partialProofData,
                                      domain_0,
                                      coin_0,
                                      amount_0,
                                      refundTo_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      publishMetadata: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`publishMetadata: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const payload_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('publishMetadata',
                                     'argument 1 (as invoked from Typescript)',
                                     'native_shielded.compact line 189 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(payload_0) === 'object' && payload_0.domainSep.buffer instanceof ArrayBuffer && payload_0.domainSep.BYTES_PER_ELEMENT === 1 && payload_0.domainSep.length === 32 && typeof(payload_0.kind) === 'bigint' && payload_0.kind >= 0n && payload_0.kind <= 255n && payload_0.key.buffer instanceof ArrayBuffer && payload_0.key.BYTES_PER_ELEMENT === 1 && payload_0.key.length === 32 && typeof(payload_0.valType) === 'bigint' && payload_0.valType >= 0n && payload_0.valType <= 255n && typeof(payload_0.valLen) === 'bigint' && payload_0.valLen >= 0n && payload_0.valLen <= 255n && payload_0.value.buffer instanceof ArrayBuffer && payload_0.value.BYTES_PER_ELEMENT === 1 && payload_0.value.length === 189)) {
          __compactRuntime.typeError('publishMetadata',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'native_shielded.compact line 189 char 1',
                                     'struct TokenMetadataPayload<domainSep: Bytes<32>, kind: Uint<0..256>, key: Bytes<32>, valType: Uint<0..256>, valLen: Uint<0..256>, value: Bytes<189>>',
                                     payload_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(payload_0),
            alignment: _descriptor_5.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._publishMetadata_0(context,
                                                 partialProofData,
                                                 payload_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      name: this.circuits.name,
      symbol: this.circuits.symbol,
      decimals: this.circuits.decimals,
      tokenColor: this.circuits.tokenColor,
      totalSupply: this.circuits.totalSupply,
      mint: this.circuits.mint,
      mintNft: this.circuits.mintNft,
      burn: this.circuits.burn,
      publishMetadata: this.circuits.publishMetadata
    };
    this.provableCircuits = {
      name: this.circuits.name,
      symbol: this.circuits.symbol,
      decimals: this.circuits.decimals,
      tokenColor: this.circuits.tokenColor,
      totalSupply: this.circuits.totalSupply,
      mint: this.circuits.mint,
      mintNft: this.circuits.mintNft,
      burn: this.circuits.burn,
      publishMetadata: this.circuits.publishMetadata
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const tokenName_0 = args_0[1];
    const tokenSymbol_0 = args_0[2];
    const tokenDecimals_0 = args_0[3];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(typeof(tokenDecimals_0) === 'bigint' && tokenDecimals_0 >= 0n && tokenDecimals_0 <= 255n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 3 (argument 4 as invoked from Typescript)',
                                 'native_shielded.compact line 74 char 1',
                                 'Uint<0..256>',
                                 tokenDecimals_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('name', new __compactRuntime.ContractOperation());
    state_0.setOperation('symbol', new __compactRuntime.ContractOperation());
    state_0.setOperation('decimals', new __compactRuntime.ContractOperation());
    state_0.setOperation('tokenColor', new __compactRuntime.ContractOperation());
    state_0.setOperation('totalSupply', new __compactRuntime.ContractOperation());
    state_0.setOperation('mint', new __compactRuntime.ContractOperation());
    state_0.setOperation('mintNft', new __compactRuntime.ContractOperation());
    state_0.setOperation('burn', new __compactRuntime.ContractOperation());
    state_0.setOperation('publishMetadata', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(1n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(0n),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(2n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(3n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(''),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(4n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(''),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(5n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(6n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(7n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(0n),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(8n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(9n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(10n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(3n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(tokenName_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(4n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(tokenSymbol_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(5n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tokenDecimals_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._issuerKey_0(this._localSecretKey_0(context,
                                                           partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(6n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _some_0(value_0) { return { is_some: true, value: value_0 }; }
  _none_0() {
    return { is_some: false,
             value:
               { nonce: new Uint8Array(32), color: new Uint8Array(32), value: 0n } };
  }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: { bytes: new Uint8Array(32) } };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _tokenType_0(domain_sep_0, contractAddress_0) {
    return this._persistentCommit_0([domain_sep_0, contractAddress_0.bytes],
                                    new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 100, 101, 114, 105, 118, 101, 95, 116, 111, 107, 101, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  _mintShieldedToken_0(context,
                       partialProofData,
                       domain_sep_0,
                       value_0,
                       nonce_0,
                       recipient_0)
  {
    const coin_0 = { nonce: nonce_0,
                     color:
                       this._tokenType_0(domain_sep_0,
                                         _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                   partialProofData,
                                                                                                   [
                                                                                                    { dup: { n: 2 } },
                                                                                                    { idx: { cached: true,
                                                                                                             pushPath: false,
                                                                                                             path: [
                                                                                                                    { tag: 'value',
                                                                                                                      value: { value: _descriptor_3.toValue(0n),
                                                                                                                               alignment: _descriptor_3.alignment() } }] } },
                                                                                                    { popeq: { cached: true,
                                                                                                               result: undefined } }]).value)),
                     value: value_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(4n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_sep_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(value_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    this._createZswapOutput_0(context, partialProofData, coin_0, recipient_0);
    const cm_0 = this._coinCommitment_0(coin_0, recipient_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(2n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(cm_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (!recipient_0.is_left
        &&
        this._equal_0(recipient_0.right.bytes,
                      _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 2 } },
                                                                                 { idx: { cached: true,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_3.toValue(0n),
                                                                                                            alignment: _descriptor_3.alignment() } }] } },
                                                                                 { popeq: { cached: true,
                                                                                            result: undefined } }]).value).bytes))
    {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_3.toValue(1n),
                                                                    alignment: _descriptor_3.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(cm_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newNull().encode() } },
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return coin_0;
  }
  _shieldedBurnAddress_0() {
    return this._left_0({ bytes: new Uint8Array(32) });
  }
  _receiveShielded_0(context, partialProofData, coin_0) {
    const recipient_0 = this._right_0(_descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 2 } },
                                                                                                 { idx: { cached: true,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_3.toValue(0n),
                                                                                                                            alignment: _descriptor_3.alignment() } }] } },
                                                                                                 { popeq: { cached: true,
                                                                                                            result: undefined } }]).value));
    this._createZswapOutput_0(context, partialProofData, coin_0, recipient_0);
    const tmp_0 = this._coinCommitment_0(coin_0, recipient_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(1n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _sendShielded_0(context, partialProofData, input_0, recipient_0, value_0) {
    const selfAddr_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_3.toValue(0n),
                                                                                                             alignment: _descriptor_3.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value);
    this._createZswapInput_0(context, partialProofData, input_0);
    const tmp_0 = this._coinNullifier_0(this._downcastQualifiedCoin_0(input_0),
                                        selfAddr_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(0n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    let t_0;
    const change_0 = (t_0 = input_0.value,
                      (__compactRuntime.assert(t_0 >= value_0,
                                               'result of subtraction would be negative'),
                       t_0 - value_0));
    const output_0 = { nonce:
                         this._upgradeFromTransient_0(this._transientHash_0([__compactRuntime.convertBytesToField(28,
                                                                                                                  new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 107, 101, 114, 110, 101, 108, 58, 110, 111, 110, 99, 101, 95, 101, 118, 111, 108, 118, 101]),
                                                                                                                  '<standard library>'),
                                                                             this._degradeToTransient_0(input_0.nonce)])),
                       color: input_0.color,
                       value: value_0 };
    this._createZswapOutput_0(context, partialProofData, output_0, recipient_0);
    const tmp_1 = this._coinCommitment_0(output_0, recipient_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(2n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (!recipient_0.is_left
        &&
        this._equal_1(recipient_0.right.bytes, selfAddr_0.bytes))
    {
      const tmp_2 = this._coinCommitment_0(output_0, recipient_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_3.toValue(1n),
                                                                    alignment: _descriptor_3.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newNull().encode() } },
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    if (this._equal_2(change_0, 0n)) {
      return { change: this._none_0(), sent: output_0 };
    } else {
      const changeCoin_0 = { nonce:
                               this._upgradeFromTransient_0(this._transientHash_0([__compactRuntime.convertBytesToField(30,
                                                                                                                        new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 107, 101, 114, 110, 101, 108, 58, 110, 111, 110, 99, 101, 95, 101, 118, 111, 108, 118, 101, 47, 50]),
                                                                                                                        '<standard library>'),
                                                                                   this._degradeToTransient_0(input_0.nonce)])),
                             color: input_0.color,
                             value: change_0 };
      this._createZswapOutput_0(context,
                                partialProofData,
                                changeCoin_0,
                                this._right_0(selfAddr_0));
      const cm_0 = this._coinCommitment_0(changeCoin_0,
                                          this._right_0(selfAddr_0));
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_3.toValue(2n),
                                                                    alignment: _descriptor_3.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(cm_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newNull().encode() } },
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_3.toValue(1n),
                                                                    alignment: _descriptor_3.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(cm_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newNull().encode() } },
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
      return { change: this._some_0(changeCoin_0), sent: output_0 };
    }
  }
  _sendImmediateShielded_0(context, partialProofData, input_0, target_0, value_0)
  {
    return this._sendShielded_0(context,
                                partialProofData,
                                this._upcastQualifiedCoin_0(input_0),
                                target_0,
                                value_0);
  }
  _downcastQualifiedCoin_0(coin_0) {
    return { nonce: coin_0.nonce, color: coin_0.color, value: coin_0.value };
  }
  _upcastQualifiedCoin_0(coin_0) {
    return { nonce: coin_0.nonce,
             color: coin_0.color,
             value: coin_0.value,
             mt_index: 0n };
  }
  _coinCommitment_0(coin_0, recipient_0) {
    return this._persistentHash_2({ domain_sep:
                                      new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 122, 115, 119, 97, 112, 45, 99, 99, 91, 118, 49, 93]),
                                    info: coin_0,
                                    dataType: recipient_0.is_left,
                                    data:
                                      recipient_0.is_left ?
                                      recipient_0.left.bytes :
                                      recipient_0.right.bytes });
  }
  _coinNullifier_0(coin_0, addr_0) {
    return this._persistentHash_2({ domain_sep:
                                      new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 122, 115, 119, 97, 112, 45, 99, 110, 91, 118, 49, 93]),
                                    info: coin_0,
                                    dataType: false,
                                    data: addr_0.bytes });
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_22, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_17, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_21, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_19, value_0);
    return result_0;
  }
  _persistentHash_3(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_20, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_17,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _degradeToTransient_0(x_0) {
    const result_0 = __compactRuntime.degradeToTransient(x_0);
    return result_0;
  }
  _upgradeFromTransient_0(x_0) {
    const result_0 = __compactRuntime.upgradeFromTransient(x_0);
    return result_0;
  }
  _createZswapInput_0(context, partialProofData, coin_0) {
    const result_0 = __compactRuntime.createZswapInput(context, coin_0);
    partialProofData.privateTranscriptOutputs.push({
      value: [],
      alignment: []
    });
    return result_0;
  }
  _createZswapOutput_0(context, partialProofData, coin_0, recipient_0) {
    const result_0 = __compactRuntime.createZswapOutput(context,
                                                        coin_0,
                                                        recipient_0);
    partialProofData.privateTranscriptOutputs.push({
      value: [],
      alignment: []
    });
    return result_0;
  }
  _logEvent_0(context,
              partialProofData,
              eventType_0,
              domainSep_0,
              tokenType_0,
              amount_0,
              subject_0)
  {
    const tmp_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_3.toValue(1n),
                                                                                                        alignment: _descriptor_3.alignment() } }] } },
                                                                             { popeq: { cached: true,
                                                                                        result: undefined } }]).value);
    const tmp_1 = { eventType: eventType_0,
                    domainSep: domainSep_0,
                    tokenType: tokenType_0,
                    amount: amount_0,
                    subject: subject_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(0n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_14.toValue(tmp_1),
                                                                                              alignment: _descriptor_14.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(1n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_10.toValue(tmp_2),
                                                                alignment: _descriptor_10.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _metadataSlot_0(domainSep_0, kind_0, key_0) {
    return this._persistentHash_3({ tag:
                                      new Uint8Array([109, 105, 112, 45, 48, 48, 49, 56, 58, 115, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    domainSep: domainSep_0,
                                    kind: kind_0,
                                    key: key_0 });
  }
  _publishTokenMetadata_0(context,
                          partialProofData,
                          p_0,
                          allowedKindA_0,
                          allowedKindB_0)
  {
    const payload_0 = p_0;
    __compactRuntime.assert(this._equal_3(payload_0.kind, allowedKindA_0)
                            ||
                            this._equal_4(payload_0.kind, allowedKindB_0),
                            'This contract does not issue that kind');
    let t_0;
    __compactRuntime.assert((t_0 = payload_0.valType, t_0 <= 5n),
                            'Reserved val-type');
    let t_1;
    __compactRuntime.assert((t_1 = payload_0.valLen, t_1 <= 189n),
                            'val-len over 189');
    __compactRuntime.assert(!this._equal_5(payload_0.key, new Uint8Array(32)),
                            'Empty key');
    __compactRuntime.assert(!this._equal_6(payload_0.valType, 5n)
                            ||
                            this._equal_7(payload_0.valLen, 0n),
                            'Null carries no bytes');
    const tmp_0 = this._metadataSlot_0(payload_0.domainSep,
                                       payload_0.kind,
                                       payload_0.key);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(2n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(payload_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     10,
                     payload_0.domainSep,
                     new Uint8Array(32),
                     0n,
                     new Uint8Array([109, 105, 112, 45, 48, 48, 49, 56, 58, 116, 111, 107, 101, 110, 45, 109, 101, 116, 97, 100, 97, 116, 97, 91, 118, 49, 93, 0, 0, 0, 0, 0]));
    return [];
  }
  _localSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localSecretKey(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localSecretKey',
                                 'return value',
                                 'native_shielded.compact line 64 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _issuerKey_0(sk_0) {
    return this._persistentHash_0([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 109, 105, 112, 49, 49, 58, 105, 115, 115, 117, 101, 114, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  _assertIssuer_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_8(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_3.toValue(6n),
                                                                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          this._issuerKey_0(this._localSecretKey_0(context,
                                                                                   partialProofData))),
                            'Caller is not the issuer');
    return [];
  }
  _name_0(context, partialProofData) {
    return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                      partialProofData,
                                                                      [
                                                                       { dup: { n: 0 } },
                                                                       { idx: { cached: false,
                                                                                pushPath: false,
                                                                                path: [
                                                                                       { tag: 'value',
                                                                                         value: { value: _descriptor_3.toValue(3n),
                                                                                                  alignment: _descriptor_3.alignment() } }] } },
                                                                       { popeq: { cached: false,
                                                                                  result: undefined } }]).value);
  }
  _symbol_0(context, partialProofData) {
    return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                      partialProofData,
                                                                      [
                                                                       { dup: { n: 0 } },
                                                                       { idx: { cached: false,
                                                                                pushPath: false,
                                                                                path: [
                                                                                       { tag: 'value',
                                                                                         value: { value: _descriptor_3.toValue(4n),
                                                                                                  alignment: _descriptor_3.alignment() } }] } },
                                                                       { popeq: { cached: false,
                                                                                  result: undefined } }]).value);
  }
  _decimals_0(context, partialProofData) {
    return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_3.toValue(5n),
                                                                                                 alignment: _descriptor_3.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  _tokenColor_0(context, partialProofData, domain_0) {
    return this._tokenType_0(domain_0,
                             _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 2 } },
                                                                                        { idx: { cached: true,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_3.toValue(0n),
                                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value));
  }
  _nftDomain_0(serial_0) {
    return this._persistentHash_0([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 109, 105, 112, 49, 49, 58, 110, 102, 116, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   serial_0]);
  }
  _totalSupply_0(context, partialProofData, domain_0) {
    const d_0 = domain_0;
    const minted_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(8n),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                                                                       alignment: _descriptor_0.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value)
                     ?
                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(8n),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(d_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     :
                     0n;
    const burned_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(9n),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                                                                       alignment: _descriptor_0.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value)
                     ?
                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(9n),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(d_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     :
                     0n;
    __compactRuntime.assert(minted_0 >= burned_0,
                            'result of subtraction would be negative');
    return minted_0 - burned_0;
  }
  _nextNonce_0(context, partialProofData) {
    const index_0 = _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 0 } },
                                                                               { idx: { cached: false,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_3.toValue(7n),
                                                                                                          alignment: _descriptor_3.alignment() } }] } },
                                                                               { popeq: { cached: true,
                                                                                          result: undefined } }]).value);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(7n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_10.toValue(tmp_0),
                                                                alignment: _descriptor_10.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return this._persistentHash_1({ tag:
                                      new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 109, 105, 112, 49, 49, 58, 110, 111, 110, 99, 101, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    secret:
                                      this._localSecretKey_0(context,
                                                             partialProofData),
                                    index: index_0 });
  }
  _issue_0(context, partialProofData, domain_0, recipient_0, amount_0) {
    __compactRuntime.assert(!this._equal_9(recipient_0.bytes, new Uint8Array(32)),
                            'Recipient is the zero key');
    __compactRuntime.assert(amount_0 > 0n, 'Amount must be positive');
    const coin_0 = this._mintShieldedToken_0(context,
                                             partialProofData,
                                             domain_0,
                                             amount_0,
                                             this._nextNonce_0(context,
                                                               partialProofData),
                                             this._left_0(recipient_0));
    const before_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(8n),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_0),
                                                                                                                                       alignment: _descriptor_0.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value)
                     ?
                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(8n),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(domain_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     :
                     0n;
    const tmp_0 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('native_shielded.compact line 136 char 33: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(before_0 + amount_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(8n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     2,
                     domain_0,
                     coin_0.color,
                     amount_0,
                     new Uint8Array(32));
    return coin_0.color;
  }
  _mint_0(context, partialProofData, domain_0, recipient_0, amount_0) {
    this._assertIssuer_0(context, partialProofData);
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_3.toValue(10n),
                                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'That domain is a one-of-a-kind token');
    return this._issue_0(context,
                         partialProofData,
                         domain_0,
                         recipient_0,
                         amount_0);
  }
  _mintNft_0(context, partialProofData, serial_0, recipient_0) {
    this._assertIssuer_0(context, partialProofData);
    const domain_0 = this._nftDomain_0(serial_0);
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_3.toValue(10n),
                                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'That token already exists');
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_3.toValue(8n),
                                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'That domain already has fungible supply');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(10n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return this._issue_0(context, partialProofData, domain_0, recipient_0, 1n);
  }
  _burn_0(context, partialProofData, domain_0, coin_0, amount_0, refundTo_0) {
    this._assertIssuer_0(context, partialProofData);
    const d_0 = domain_0;
    const c_0 = coin_0;
    const a_0 = amount_0;
    const refund_0 = refundTo_0;
    __compactRuntime.assert(this._equal_10(c_0.color,
                                           this._tokenType_0(d_0,
                                                             _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                       partialProofData,
                                                                                                                       [
                                                                                                                        { dup: { n: 2 } },
                                                                                                                        { idx: { cached: true,
                                                                                                                                 pushPath: false,
                                                                                                                                 path: [
                                                                                                                                        { tag: 'value',
                                                                                                                                          value: { value: _descriptor_3.toValue(0n),
                                                                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                                                                        { popeq: { cached: true,
                                                                                                                                   result: undefined } }]).value))),
                            'Coin is not this token');
    __compactRuntime.assert(a_0 > 0n, 'Amount must be positive');
    __compactRuntime.assert(a_0 <= c_0.value, 'Amount exceeds the coin');
    __compactRuntime.assert(!this._equal_11(refund_0.bytes, new Uint8Array(32)),
                            'Refund would burn the change');
    this._receiveShielded_0(context, partialProofData, c_0);
    const sent_0 = this._sendImmediateShielded_0(context,
                                                 partialProofData,
                                                 c_0,
                                                 this._shieldedBurnAddress_0(),
                                                 a_0);
    if (sent_0.change.is_some) {
      this._sendImmediateShielded_0(context,
                                    partialProofData,
                                    sent_0.change.value,
                                    this._left_0(refund_0),
                                    sent_0.change.value.value);
    }
    const before_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(9n),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                                                                       alignment: _descriptor_0.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value)
                     ?
                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(9n),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(d_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     :
                     0n;
    const tmp_0 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('native_shielded.compact line 180 char 28: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(before_0 + a_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_3.toValue(9n),
                                                                  alignment: _descriptor_3.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     3,
                     d_0,
                     c_0.color,
                     a_0,
                     new Uint8Array(32));
    return [];
  }
  _publishMetadata_0(context, partialProofData, payload_0) {
    this._assertIssuer_0(context, partialProofData);
    let tmp_0;
    __compactRuntime.assert((tmp_0 = payload_0.domainSep,
                             _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_3.toValue(8n),
                                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value)),
                            'No token under that domain');
    this._publishTokenMetadata_0(context, partialProofData, payload_0, 1n, 1n);
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_9(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_10(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_11(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    eventLog: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(0n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(0n),
                                                                                                                                 alignment: _descriptor_9.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(0n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'Events.compact line 46 char 3',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(0n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(key_0),
                                                                                                                                 alignment: _descriptor_9.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'Events.compact line 46 char 3',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_3.toValue(0n),
                                                                                                      alignment: _descriptor_3.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_9.toValue(key_0),
                                                                                                      alignment: _descriptor_9.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_9.fromValue(key.value),      _descriptor_14.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get eventCount() {
      return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_3.toValue(1n),
                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    tokenMetadata: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(2n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(0n),
                                                                                                                                 alignment: _descriptor_9.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(2n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'TokenMetadata.compact line 29 char 3',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(2n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'TokenMetadata.compact line 29 char 3',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(2n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get _name() {
      return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_3.toValue(3n),
                                                                                                    alignment: _descriptor_3.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    },
    get _symbol() {
      return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_3.toValue(4n),
                                                                                                    alignment: _descriptor_3.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    },
    get _decimals() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_3.toValue(5n),
                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get issuer() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_3.toValue(6n),
                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get nonceCounter() {
      return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_3.toValue(7n),
                                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    mintedByDomain: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(8n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(0n),
                                                                                                                                 alignment: _descriptor_9.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(8n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'native_shielded.compact line 54 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(8n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'native_shielded.compact line 54 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(8n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[8];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    burnedByDomain: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(9n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(0n),
                                                                                                                                 alignment: _descriptor_9.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(9n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'native_shielded.compact line 56 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(9n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'native_shielded.compact line 56 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(9n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[9];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    nftDomains: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(10n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(0n),
                                                                                                                                 alignment: _descriptor_9.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(10n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'native_shielded.compact line 58 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(10n),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[10];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({ localSecretKey: (...args) => undefined });
export const pureCircuits = {
  metadataSlot: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`metadataSlot: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const domainSep_0 = args_0[0];
    const kind_0 = args_0[1];
    const key_0 = args_0[2];
    if (!(domainSep_0.buffer instanceof ArrayBuffer && domainSep_0.BYTES_PER_ELEMENT === 1 && domainSep_0.length === 32)) {
      __compactRuntime.typeError('metadataSlot',
                                 'argument 1',
                                 'TokenMetadata.compact line 38 char 3',
                                 'Bytes<32>',
                                 domainSep_0)
    }
    if (!(typeof(kind_0) === 'bigint' && kind_0 >= 0n && kind_0 <= 255n)) {
      __compactRuntime.typeError('metadataSlot',
                                 'argument 2',
                                 'TokenMetadata.compact line 38 char 3',
                                 'Uint<0..256>',
                                 kind_0)
    }
    if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
      __compactRuntime.typeError('metadataSlot',
                                 'argument 3',
                                 'TokenMetadata.compact line 38 char 3',
                                 'Bytes<32>',
                                 key_0)
    }
    return _dummyContract._metadataSlot_0(domainSep_0, kind_0, key_0);
  },
  issuerKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`issuerKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('issuerKey',
                                 'argument 1',
                                 'native_shielded.compact line 66 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._issuerKey_0(sk_0);
  },
  nftDomain: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`nftDomain: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const serial_0 = args_0[0];
    if (!(serial_0.buffer instanceof ArrayBuffer && serial_0.BYTES_PER_ELEMENT === 1 && serial_0.length === 32)) {
      __compactRuntime.typeError('nftDomain',
                                 'argument 1',
                                 'native_shielded.compact line 101 char 1',
                                 'Bytes<32>',
                                 serial_0)
    }
    return _dummyContract._nftDomain_0(serial_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
