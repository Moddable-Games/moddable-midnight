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

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_2 = new __compactRuntime.CompactTypeBytes(189);

class _TokenMetadataPayload_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment())))));
  }
  fromValue(value_0) {
    return {
      domainSep: _descriptor_0.fromValue(value_0),
      kind: _descriptor_1.fromValue(value_0),
      key: _descriptor_0.fromValue(value_0),
      valType: _descriptor_1.fromValue(value_0),
      valLen: _descriptor_1.fromValue(value_0),
      value: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domainSep).concat(_descriptor_1.toValue(value_0.kind).concat(_descriptor_0.toValue(value_0.key).concat(_descriptor_1.toValue(value_0.valType).concat(_descriptor_1.toValue(value_0.valLen).concat(_descriptor_2.toValue(value_0.value))))));
  }
}

const _descriptor_3 = new _TokenMetadataPayload_0();

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

const _descriptor_4 = new _ContractAddress_0();

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ShieldedCoinInfo_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_5.alignment()));
  }
  fromValue(value_0) {
    return {
      nonce: _descriptor_0.fromValue(value_0),
      color: _descriptor_0.fromValue(value_0),
      value: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.nonce).concat(_descriptor_0.toValue(value_0.color).concat(_descriptor_5.toValue(value_0.value)));
  }
}

const _descriptor_6 = new _ShieldedCoinInfo_0();

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

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

const _descriptor_8 = new _ZswapCoinPublicKey_0();

class _UserAddress_0 {
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

const _descriptor_9 = new _UserAddress_0();

const _descriptor_10 = __compactRuntime.CompactTypeBoolean;

const _descriptor_11 = __compactRuntime.CompactTypeOpaqueString;

const _descriptor_12 = __compactRuntime.CompactTypeField;

class _MerkleTreeDigest_0 {
  alignment() {
    return _descriptor_12.alignment();
  }
  fromValue(value_0) {
    return {
      field: _descriptor_12.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_12.toValue(value_0.field);
  }
}

const _descriptor_13 = new _MerkleTreeDigest_0();

class _Note_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_5.alignment()));
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_0.fromValue(value_0),
      owner: _descriptor_0.fromValue(value_0),
      amount: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domain).concat(_descriptor_0.toValue(value_0.owner).concat(_descriptor_5.toValue(value_0.amount)));
  }
}

const _descriptor_14 = new _Note_0();

class _MerkleTreePathEntry_0 {
  alignment() {
    return _descriptor_13.alignment().concat(_descriptor_10.alignment());
  }
  fromValue(value_0) {
    return {
      sibling: _descriptor_13.fromValue(value_0),
      goes_left: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_13.toValue(value_0.sibling).concat(_descriptor_10.toValue(value_0.goes_left));
  }
}

const _descriptor_15 = new _MerkleTreePathEntry_0();

const _descriptor_16 = new __compactRuntime.CompactTypeVector(20, _descriptor_15);

class _MerkleTreePath_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_16.alignment());
  }
  fromValue(value_0) {
    return {
      leaf: _descriptor_0.fromValue(value_0),
      path: _descriptor_16.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.leaf).concat(_descriptor_16.toValue(value_0.path));
  }
}

const _descriptor_17 = new _MerkleTreePath_0();

class _NoteOpening_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_5.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      domain: _descriptor_0.fromValue(value_0),
      amount: _descriptor_5.fromValue(value_0),
      nonce: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domain).concat(_descriptor_5.toValue(value_0.amount).concat(_descriptor_0.toValue(value_0.nonce)));
  }
}

const _descriptor_18 = new _NoteOpening_0();

const _descriptor_19 = new __compactRuntime.CompactTypeEnum(10, 1);

class _ContractEvent_0 {
  alignment() {
    return _descriptor_19.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_5.alignment().concat(_descriptor_0.alignment()))));
  }
  fromValue(value_0) {
    return {
      eventType: _descriptor_19.fromValue(value_0),
      domainSep: _descriptor_0.fromValue(value_0),
      tokenType: _descriptor_0.fromValue(value_0),
      amount: _descriptor_5.fromValue(value_0),
      subject: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_19.toValue(value_0.eventType).concat(_descriptor_0.toValue(value_0.domainSep).concat(_descriptor_0.toValue(value_0.tokenType).concat(_descriptor_5.toValue(value_0.amount).concat(_descriptor_0.toValue(value_0.subject)))));
  }
}

const _descriptor_20 = new _ContractEvent_0();

const _descriptor_21 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _Either_0 {
  alignment() {
    return _descriptor_10.alignment().concat(_descriptor_8.alignment().concat(_descriptor_4.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_10.fromValue(value_0),
      left: _descriptor_8.fromValue(value_0),
      right: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_10.toValue(value_0.is_left).concat(_descriptor_8.toValue(value_0.left).concat(_descriptor_4.toValue(value_0.right)));
  }
}

const _descriptor_22 = new _Either_0();

const _descriptor_23 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_24 = new __compactRuntime.CompactTypeBytes(21);

class _CoinPreimage_0 {
  alignment() {
    return _descriptor_24.alignment().concat(_descriptor_6.alignment().concat(_descriptor_10.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_24.fromValue(value_0),
      info: _descriptor_6.fromValue(value_0),
      dataType: _descriptor_10.fromValue(value_0),
      data: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_24.toValue(value_0.domain_sep).concat(_descriptor_6.toValue(value_0.info).concat(_descriptor_10.toValue(value_0.dataType).concat(_descriptor_0.toValue(value_0.data))));
  }
}

const _descriptor_25 = new _CoinPreimage_0();

class _MetadataSlot_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      tag: _descriptor_0.fromValue(value_0),
      domainSep: _descriptor_0.fromValue(value_0),
      kind: _descriptor_1.fromValue(value_0),
      key: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.tag).concat(_descriptor_0.toValue(value_0.domainSep).concat(_descriptor_1.toValue(value_0.kind).concat(_descriptor_0.toValue(value_0.key))));
  }
}

const _descriptor_26 = new _MetadataSlot_0();

const _descriptor_27 = new __compactRuntime.CompactTypeBytes(6);

class _LeafPreimage_0 {
  alignment() {
    return _descriptor_27.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_27.fromValue(value_0),
      data: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_27.toValue(value_0.domain_sep).concat(_descriptor_0.toValue(value_0.data));
  }
}

const _descriptor_28 = new _LeafPreimage_0();

const _descriptor_29 = new __compactRuntime.CompactTypeVector(2, _descriptor_12);

const _descriptor_30 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

class _Either_1 {
  alignment() {
    return _descriptor_10.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_10.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_10.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_31 = new _Either_1();

class _Either_2 {
  alignment() {
    return _descriptor_10.alignment().concat(_descriptor_4.alignment().concat(_descriptor_9.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_10.fromValue(value_0),
      left: _descriptor_4.fromValue(value_0),
      right: _descriptor_9.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_10.toValue(value_0.is_left).concat(_descriptor_4.toValue(value_0.left).concat(_descriptor_9.toValue(value_0.right)));
  }
}

const _descriptor_32 = new _Either_2();

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
    if (typeof(witnesses_0.freshNonce) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named freshNonce');
    }
    if (typeof(witnesses_0.noteToSpend) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named noteToSpend');
    }
    if (typeof(witnesses_0.findNotePath) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named findNotePath');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      metadataSlot(context, ...args_1) {
        return { result: pureCircuits.metadataSlot(...args_1), context };
      },
      ownerKey(context, ...args_1) {
        return { result: pureCircuits.ownerKey(...args_1), context };
      },
      issuerKey(context, ...args_1) {
        return { result: pureCircuits.issuerKey(...args_1), context };
      },
      noteCommitment(context, ...args_1) {
        return { result: pureCircuits.noteCommitment(...args_1), context };
      },
      nftDomain(context, ...args_1) {
        return { result: pureCircuits.nftDomain(...args_1), context };
      },
      nullifierOf(context, ...args_1) {
        return { result: pureCircuits.nullifierOf(...args_1), context };
      },
      outputNonce(context, ...args_1) {
        return { result: pureCircuits.outputNonce(...args_1), context };
      },
      tagged(context, ...args_1) {
        return { result: pureCircuits.tagged(...args_1), context };
      },
      name: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`name: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('name',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 190 char 1',
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
                                     'private_ledger.compact line 194 char 1',
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
                                     'private_ledger.compact line 198 char 1',
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
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      tokenColor: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`tokenColor: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const d_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('tokenColor',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 202 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(d_0.buffer instanceof ArrayBuffer && d_0.BYTES_PER_ELEMENT === 1 && d_0.length === 32)) {
          __compactRuntime.typeError('tokenColor',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 202 char 1',
                                     'Bytes<32>',
                                     d_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(d_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._tokenColor_0(context, partialProofData, d_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      mint: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`mint: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const to_0 = args_1[1];
        const amount_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('mint',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 222 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(to_0.buffer instanceof ArrayBuffer && to_0.BYTES_PER_ELEMENT === 1 && to_0.length === 32)) {
          __compactRuntime.typeError('mint',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 222 char 1',
                                     'Bytes<32>',
                                     to_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('mint',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'private_ledger.compact line 222 char 1',
                                     'Uint<0..340282366920938463463374607431768211456>',
                                     amount_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(to_0).concat(_descriptor_5.toValue(amount_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_5.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._mint_0(context, partialProofData, to_0, amount_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      mintNft: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`mintNft: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const serial_0 = args_1[1];
        const to_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('mintNft',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 232 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(serial_0.buffer instanceof ArrayBuffer && serial_0.BYTES_PER_ELEMENT === 1 && serial_0.length === 32)) {
          __compactRuntime.typeError('mintNft',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 232 char 1',
                                     'Bytes<32>',
                                     serial_0)
        }
        if (!(to_0.buffer instanceof ArrayBuffer && to_0.BYTES_PER_ELEMENT === 1 && to_0.length === 32)) {
          __compactRuntime.typeError('mintNft',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'private_ledger.compact line 232 char 1',
                                     'Bytes<32>',
                                     to_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(serial_0).concat(_descriptor_0.toValue(to_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._mintNft_0(context,
                                         partialProofData,
                                         serial_0,
                                         to_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      transfer: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`transfer: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const d_0 = args_1[1];
        const to_0 = args_1[2];
        const amount_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('transfer',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 252 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(d_0.buffer instanceof ArrayBuffer && d_0.BYTES_PER_ELEMENT === 1 && d_0.length === 32)) {
          __compactRuntime.typeError('transfer',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 252 char 1',
                                     'Bytes<32>',
                                     d_0)
        }
        if (!(to_0.buffer instanceof ArrayBuffer && to_0.BYTES_PER_ELEMENT === 1 && to_0.length === 32)) {
          __compactRuntime.typeError('transfer',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'private_ledger.compact line 252 char 1',
                                     'Bytes<32>',
                                     to_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('transfer',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'private_ledger.compact line 252 char 1',
                                     'Uint<0..340282366920938463463374607431768211456>',
                                     amount_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(d_0).concat(_descriptor_0.toValue(to_0).concat(_descriptor_5.toValue(amount_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_5.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._transfer_0(context,
                                          partialProofData,
                                          d_0,
                                          to_0,
                                          amount_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      toUtxo: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`toUtxo: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const d_0 = args_1[1];
        const amount_0 = args_1[2];
        const recipient_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('toUtxo',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 263 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(d_0.buffer instanceof ArrayBuffer && d_0.BYTES_PER_ELEMENT === 1 && d_0.length === 32)) {
          __compactRuntime.typeError('toUtxo',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 263 char 1',
                                     'Bytes<32>',
                                     d_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('toUtxo',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'private_ledger.compact line 263 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amount_0)
        }
        if (!(typeof(recipient_0) === 'object' && recipient_0.bytes.buffer instanceof ArrayBuffer && recipient_0.bytes.BYTES_PER_ELEMENT === 1 && recipient_0.bytes.length === 32)) {
          __compactRuntime.typeError('toUtxo',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'private_ledger.compact line 263 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     recipient_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(d_0).concat(_descriptor_7.toValue(amount_0).concat(_descriptor_9.toValue(recipient_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_9.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._toUtxo_0(context,
                                        partialProofData,
                                        d_0,
                                        amount_0,
                                        recipient_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      toShielded: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`toShielded: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const d_0 = args_1[1];
        const amount_0 = args_1[2];
        const recipient_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('toShielded',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 276 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(d_0.buffer instanceof ArrayBuffer && d_0.BYTES_PER_ELEMENT === 1 && d_0.length === 32)) {
          __compactRuntime.typeError('toShielded',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 276 char 1',
                                     'Bytes<32>',
                                     d_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('toShielded',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'private_ledger.compact line 276 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amount_0)
        }
        if (!(typeof(recipient_0) === 'object' && recipient_0.bytes.buffer instanceof ArrayBuffer && recipient_0.bytes.BYTES_PER_ELEMENT === 1 && recipient_0.bytes.length === 32)) {
          __compactRuntime.typeError('toShielded',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'private_ledger.compact line 276 char 1',
                                     'struct ZswapCoinPublicKey<bytes: Bytes<32>>',
                                     recipient_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(d_0).concat(_descriptor_7.toValue(amount_0).concat(_descriptor_8.toValue(recipient_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_8.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._toShielded_0(context,
                                            partialProofData,
                                            d_0,
                                            amount_0,
                                            recipient_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      fromUtxo: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`fromUtxo: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const d_0 = args_1[1];
        const amount_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('fromUtxo',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 299 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(d_0.buffer instanceof ArrayBuffer && d_0.BYTES_PER_ELEMENT === 1 && d_0.length === 32)) {
          __compactRuntime.typeError('fromUtxo',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 299 char 1',
                                     'Bytes<32>',
                                     d_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('fromUtxo',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'private_ledger.compact line 299 char 1',
                                     'Uint<0..340282366920938463463374607431768211456>',
                                     amount_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(d_0).concat(_descriptor_5.toValue(amount_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_5.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._fromUtxo_0(context,
                                          partialProofData,
                                          d_0,
                                          amount_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      fromShielded: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`fromShielded: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const d_0 = args_1[1];
        const coin_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('fromShielded',
                                     'argument 1 (as invoked from Typescript)',
                                     'private_ledger.compact line 310 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(d_0.buffer instanceof ArrayBuffer && d_0.BYTES_PER_ELEMENT === 1 && d_0.length === 32)) {
          __compactRuntime.typeError('fromShielded',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 310 char 1',
                                     'Bytes<32>',
                                     d_0)
        }
        if (!(typeof(coin_0) === 'object' && coin_0.nonce.buffer instanceof ArrayBuffer && coin_0.nonce.BYTES_PER_ELEMENT === 1 && coin_0.nonce.length === 32 && coin_0.color.buffer instanceof ArrayBuffer && coin_0.color.BYTES_PER_ELEMENT === 1 && coin_0.color.length === 32 && typeof(coin_0.value) === 'bigint' && coin_0.value >= 0n && coin_0.value <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.typeError('fromShielded',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'private_ledger.compact line 310 char 1',
                                     'struct ShieldedCoinInfo<nonce: Bytes<32>, color: Bytes<32>, value: Uint<0..340282366920938463463374607431768211456>>',
                                     coin_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(d_0).concat(_descriptor_6.toValue(coin_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_6.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._fromShielded_0(context,
                                              partialProofData,
                                              d_0,
                                              coin_0);
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
                                     'private_ledger.compact line 326 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(payload_0) === 'object' && payload_0.domainSep.buffer instanceof ArrayBuffer && payload_0.domainSep.BYTES_PER_ELEMENT === 1 && payload_0.domainSep.length === 32 && typeof(payload_0.kind) === 'bigint' && payload_0.kind >= 0n && payload_0.kind <= 255n && payload_0.key.buffer instanceof ArrayBuffer && payload_0.key.BYTES_PER_ELEMENT === 1 && payload_0.key.length === 32 && typeof(payload_0.valType) === 'bigint' && payload_0.valType >= 0n && payload_0.valType <= 255n && typeof(payload_0.valLen) === 'bigint' && payload_0.valLen >= 0n && payload_0.valLen <= 255n && payload_0.value.buffer instanceof ArrayBuffer && payload_0.value.BYTES_PER_ELEMENT === 1 && payload_0.value.length === 189)) {
          __compactRuntime.typeError('publishMetadata',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'private_ledger.compact line 326 char 1',
                                     'struct TokenMetadataPayload<domainSep: Bytes<32>, kind: Uint<0..256>, key: Bytes<32>, valType: Uint<0..256>, valLen: Uint<0..256>, value: Bytes<189>>',
                                     payload_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(payload_0),
            alignment: _descriptor_3.alignment()
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
      mint: this.circuits.mint,
      mintNft: this.circuits.mintNft,
      transfer: this.circuits.transfer,
      toUtxo: this.circuits.toUtxo,
      toShielded: this.circuits.toShielded,
      fromUtxo: this.circuits.fromUtxo,
      fromShielded: this.circuits.fromShielded,
      publishMetadata: this.circuits.publishMetadata
    };
    this.provableCircuits = {
      name: this.circuits.name,
      symbol: this.circuits.symbol,
      decimals: this.circuits.decimals,
      tokenColor: this.circuits.tokenColor,
      mint: this.circuits.mint,
      mintNft: this.circuits.mintNft,
      transfer: this.circuits.transfer,
      toUtxo: this.circuits.toUtxo,
      toShielded: this.circuits.toShielded,
      fromUtxo: this.circuits.fromUtxo,
      fromShielded: this.circuits.fromShielded,
      publishMetadata: this.circuits.publishMetadata
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const tokenName_0 = args_0[1];
    const tokenSymbol_0 = args_0[2];
    const tokenDecimals_0 = args_0[3];
    const domainSep_0 = args_0[4];
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
                                 'private_ledger.compact line 182 char 1',
                                 'Uint<0..256>',
                                 tokenDecimals_0)
    }
    if (!(domainSep_0.buffer instanceof ArrayBuffer && domainSep_0.BYTES_PER_ELEMENT === 1 && domainSep_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 4 (argument 5 as invoked from Typescript)',
                                 'private_ledger.compact line 182 char 1',
                                 'Bytes<32>',
                                 domainSep_0)
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
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('name', new __compactRuntime.ContractOperation());
    state_0.setOperation('symbol', new __compactRuntime.ContractOperation());
    state_0.setOperation('decimals', new __compactRuntime.ContractOperation());
    state_0.setOperation('tokenColor', new __compactRuntime.ContractOperation());
    state_0.setOperation('mint', new __compactRuntime.ContractOperation());
    state_0.setOperation('mintNft', new __compactRuntime.ContractOperation());
    state_0.setOperation('transfer', new __compactRuntime.ContractOperation());
    state_0.setOperation('toUtxo', new __compactRuntime.ContractOperation());
    state_0.setOperation('toShielded', new __compactRuntime.ContractOperation());
    state_0.setOperation('fromUtxo', new __compactRuntime.ContractOperation());
    state_0.setOperation('fromShielded', new __compactRuntime.ContractOperation());
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
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(1n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(2n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(3n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(''),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(4n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(''),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(5n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(6n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(7n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(8n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newArray()
                                                          .arrayPush(__compactRuntime.StateValue.newBoundedMerkleTree(
                                                                       new __compactRuntime.StateBoundedMerkleTree(20)
                                                                     )).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                        alignment: _descriptor_7.alignment() })).arrayPush(__compactRuntime.StateValue.newMap(
                                                                                                                                                                             new __compactRuntime.StateMap()
                                                                                                                                                                           ))
                                                          .encode() } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(2n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       'root',
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(9n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(10n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(11n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(12n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(13n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(14n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(3n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(tokenName_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(4n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(tokenSymbol_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(5n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tokenDecimals_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(6n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domainSep_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._issuerKey_0(this._localSecretKey_0(context,
                                                           partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(7n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
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
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: { bytes: new Uint8Array(32) } };
  }
  _left_1(value_0) {
    return { is_left: true, left: value_0, right: new Uint8Array(32) };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _right_1(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _merkleTreePathRoot_0(path_0) {
    return { field:
               this._folder_0((...args_0) =>
                                this._merkleTreePathEntryRoot_0(...args_0),
                              this._degradeToTransient_0(this._persistentHash_1({ domain_sep:
                                                                                    new Uint8Array([109, 100, 110, 58, 108, 104]),
                                                                                  data:
                                                                                    path_0.leaf })),
                              path_0.path) };
  }
  _merkleTreePathEntryRoot_0(recursiveDigest_0, entry_0) {
    const left_0 = entry_0.goes_left ? recursiveDigest_0 : entry_0.sibling.field;
    const right_0 = entry_0.goes_left ?
                    entry_0.sibling.field :
                    recursiveDigest_0;
    return this._transientHash_0([left_0, right_0]);
  }
  _tokenType_0(domain_sep_0, contractAddress_0) {
    return this._persistentCommit_1([domain_sep_0, contractAddress_0.bytes],
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
                                         _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                   partialProofData,
                                                                                                   [
                                                                                                    { dup: { n: 2 } },
                                                                                                    { idx: { cached: true,
                                                                                                             pushPath: false,
                                                                                                             path: [
                                                                                                                    { tag: 'value',
                                                                                                                      value: { value: _descriptor_1.toValue(0n),
                                                                                                                               alignment: _descriptor_1.alignment() } }] } },
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
                                                         value: { value: _descriptor_1.toValue(4n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_sep_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(value_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_1.toValue(2n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
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
                      _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 2 } },
                                                                                 { idx: { cached: true,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                            alignment: _descriptor_1.alignment() } }] } },
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
                                                           value: { value: _descriptor_1.toValue(1n),
                                                                    alignment: _descriptor_1.alignment() } }] } },
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
  _receiveShielded_0(context, partialProofData, coin_0) {
    const recipient_0 = this._right_1(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 2 } },
                                                                                                 { idx: { cached: true,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                                            alignment: _descriptor_1.alignment() } }] } },
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
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _coinCommitment_0(coin_0, recipient_0) {
    return this._persistentHash_3({ domain_sep:
                                      new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 122, 115, 119, 97, 112, 45, 99, 99, 91, 118, 49, 93]),
                                    info: coin_0,
                                    dataType: recipient_0.is_left,
                                    data:
                                      recipient_0.is_left ?
                                      recipient_0.left.bytes :
                                      recipient_0.right.bytes });
  }
  _mintUnshieldedToken_0(context,
                         partialProofData,
                         domainSep_0,
                         amount_0,
                         recipient_0)
  {
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(5n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domainSep_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(amount_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
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
    const color_0 = this._tokenType_0(domainSep_0,
                                      _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 2 } },
                                                                                                 { idx: { cached: true,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                                 { popeq: { cached: true,
                                                                                                            result: undefined } }]).value));
    const tmp_0 = this._left_1(color_0);
    const tmp_1 = amount_0;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(8n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_31.toValue(tmp_0),
                                                                                                alignment: _descriptor_31.alignment() },
                                                                                              { value: _descriptor_32.toValue(recipient_0),
                                                                                                alignment: _descriptor_32.alignment() }
                                                                                            )).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_1),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
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
    if (recipient_0.is_left
        &&
        this._equal_1(recipient_0.left.bytes,
                      _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 2 } },
                                                                                 { idx: { cached: true,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                 { popeq: { cached: true,
                                                                                            result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_1(color_0);
      const tmp_3 = amount_0;
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_1.toValue(6n),
                                                                    alignment: _descriptor_1.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_31.toValue(tmp_2),
                                                                                                alignment: _descriptor_31.alignment() }).encode() } },
                                         { dup: { n: 1 } },
                                         { dup: { n: 1 } },
                                         'member',
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_3),
                                                                                                alignment: _descriptor_5.alignment() }).encode() } },
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
    }
    return color_0;
  }
  _receiveUnshielded_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_1(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(6n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_31.toValue(tmp_0),
                                                                                              alignment: _descriptor_31.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(amount_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
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
    return [];
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_29, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_30, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_28, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_23, value_0);
    return result_0;
  }
  _persistentHash_3(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_25, value_0);
    return result_0;
  }
  _persistentHash_4(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_26, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_14,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _persistentCommit_1(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_23,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _degradeToTransient_0(x_0) {
    const result_0 = __compactRuntime.degradeToTransient(x_0);
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
    const tmp_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(1n),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
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
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_20.toValue(tmp_1),
                                                                                              alignment: _descriptor_20.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_21.toValue(tmp_2),
                                                                alignment: _descriptor_21.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _metadataSlot_0(domainSep_0, kind_0, key_0) {
    return this._persistentHash_4({ tag:
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
    __compactRuntime.assert(this._equal_2(payload_0.kind, allowedKindA_0)
                            ||
                            this._equal_3(payload_0.kind, allowedKindB_0),
                            'This contract does not issue that kind');
    let t_0;
    __compactRuntime.assert((t_0 = payload_0.valType, t_0 <= 5n),
                            'Reserved val-type');
    let t_1;
    __compactRuntime.assert((t_1 = payload_0.valLen, t_1 <= 189n),
                            'val-len over 189');
    __compactRuntime.assert(!this._equal_4(payload_0.key, new Uint8Array(32)),
                            'Empty key');
    __compactRuntime.assert(!this._equal_5(payload_0.valType, 5n)
                            ||
                            this._equal_6(payload_0.valLen, 0n),
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
                                                         value: { value: _descriptor_1.toValue(2n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(payload_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
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
                                 'private_ledger.compact line 93 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _freshNonce_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.freshNonce(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('freshNonce',
                                 'return value',
                                 'private_ledger.compact line 96 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _noteToSpend_0(context, partialProofData, d_0, atLeast_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.noteToSpend(witnessContext_0,
                                                                      d_0,
                                                                      atLeast_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.domain.buffer instanceof ArrayBuffer && result_0.domain.BYTES_PER_ELEMENT === 1 && result_0.domain.length === 32 && typeof(result_0.amount) === 'bigint' && result_0.amount >= 0n && result_0.amount <= 340282366920938463463374607431768211455n && result_0.nonce.buffer instanceof ArrayBuffer && result_0.nonce.BYTES_PER_ELEMENT === 1 && result_0.nonce.length === 32)) {
      __compactRuntime.typeError('noteToSpend',
                                 'return value',
                                 'private_ledger.compact line 99 char 1',
                                 'struct NoteOpening<domain: Bytes<32>, amount: Uint<0..340282366920938463463374607431768211456>, nonce: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_18.toValue(result_0),
      alignment: _descriptor_18.alignment()
    });
    return result_0;
  }
  _findNotePath_0(context, partialProofData, commitment_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.findNotePath(witnessContext_0,
                                                                       commitment_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.leaf.buffer instanceof ArrayBuffer && result_0.leaf.BYTES_PER_ELEMENT === 1 && result_0.leaf.length === 32 && Array.isArray(result_0.path) && result_0.path.length === 20 && result_0.path.every((t) => typeof(t) === 'object' && typeof(t.sibling) === 'object' && typeof(t.sibling.field) === 'bigint' && t.sibling.field >= 0 && t.sibling.field <= __compactRuntime.MAX_FIELD && typeof(t.goes_left) === 'boolean'))) {
      __compactRuntime.typeError('findNotePath',
                                 'return value',
                                 'private_ledger.compact line 102 char 1',
                                 'struct MerkleTreePath<leaf: Bytes<32>, path: Vector<20, struct MerkleTreePathEntry<sibling: struct MerkleTreeDigest<field: Field>, goes_left: Boolean>>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_17.toValue(result_0),
      alignment: _descriptor_17.alignment()
    });
    return result_0;
  }
  _ownerKey_0(sk_0) {
    return this._persistentHash_2([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 111, 119, 110, 101, 114, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  _issuerKey_0(sk_0) {
    return this._persistentHash_2([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 105, 115, 115, 117, 101, 114, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  _noteCommitment_0(note_0, nonce_0) {
    return this._persistentCommit_0(note_0, nonce_0);
  }
  _nftDomain_0(serial_0) {
    return this._persistentHash_2([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 110, 102, 116, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   serial_0]);
  }
  _nullifierOf_0(sk_0, commitment_0) {
    return this._persistentHash_0([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 110, 117, 108, 108, 105, 102, 105, 101, 114, 58, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0,
                                   commitment_0]);
  }
  _outputNonce_0(tag_0, sk_0, spentNonce_0) {
    return this._persistentHash_0([tag_0, sk_0, spentNonce_0]);
  }
  _tagged_0(tag_0, seed_0) { return this._persistentHash_2([tag_0, seed_0]); }
  _freshUniqueNonce_0(context, partialProofData) {
    const nonce_0 = this._freshNonce_0(context, partialProofData);
    const seen_0 = this._persistentHash_2([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 117, 115, 101, 100, 45, 110, 111, 110, 99, 101, 58, 0, 0, 0, 0, 0, 0]),
                                           nonce_0]);
    __compactRuntime.assert(!_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(11n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(seen_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                            'Nonce already used');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(11n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(seen_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return nonce_0;
  }
  _addNote_0(context, partialProofData, note_0, nonce_0) {
    const commitment_0 = this._noteCommitment_0(note_0, nonce_0);
    __compactRuntime.assert(!_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(10n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitment_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                            'Note already exists');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(10n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(8n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.leafHash(
                                                                                              { value: _descriptor_0.toValue(commitment_0),
                                                                                                alignment: _descriptor_0.alignment() }
                                                                                            )).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(1n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { addi: { immediate: 1 } },
                                       { ins: { cached: true, n: 1 } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(2n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       'root',
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  _spend_0(context, partialProofData, d_0, amount_0) {
    __compactRuntime.assert(amount_0 > 0n, 'Amount must be positive');
    const sk_0 = this._localSecretKey_0(context, partialProofData);
    const me_0 = this._ownerKey_0(sk_0);
    const opening_0 = this._noteToSpend_0(context,
                                          partialProofData,
                                          d_0,
                                          amount_0);
    __compactRuntime.assert(this._equal_7(opening_0.domain, d_0),
                            'Note is for another token');
    let t_0;
    __compactRuntime.assert((t_0 = opening_0.amount, t_0 >= amount_0),
                            'Note is too small');
    const commitment_0 = this._noteCommitment_0({ domain: d_0,
                                                  owner: me_0,
                                                  amount: opening_0.amount },
                                                opening_0.nonce);
    const supplied_0 = this._findNotePath_0(context,
                                            partialProofData,
                                            commitment_0);
    const bound_0 = { leaf: commitment_0, path: supplied_0.path };
    let tmp_0;
    __compactRuntime.assert((tmp_0 = this._merkleTreePathRoot_0(bound_0),
                             _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(8n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(2n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(tmp_0),
                                                                                                                                                alignment: _descriptor_13.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value)),
                            'No such note');
    const nullifier_0 = this._nullifierOf_0(sk_0, commitment_0);
    __compactRuntime.assert(!_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(9n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                            'Note already spent');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(9n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    let t_1;
    this._addNote_0(context,
                    partialProofData,
                    { domain: d_0,
                      owner: me_0,
                      amount:
                        (t_1 = opening_0.amount,
                         (__compactRuntime.assert(t_1 >= amount_0,
                                                  'result of subtraction would be negative'),
                          t_1 - amount_0)) },
                    this._outputNonce_0(new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 99, 104, 97, 110, 103, 101, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                        sk_0,
                                        opening_0.nonce));
    return this._outputNonce_0(new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 111, 117, 116, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                               sk_0,
                               opening_0.nonce);
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
                                                                                                                       value: { value: _descriptor_1.toValue(7n),
                                                                                                                                alignment: _descriptor_1.alignment() } }] } },
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
                                                                                         value: { value: _descriptor_1.toValue(3n),
                                                                                                  alignment: _descriptor_1.alignment() } }] } },
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
                                                                                         value: { value: _descriptor_1.toValue(4n),
                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                       { popeq: { cached: false,
                                                                                  result: undefined } }]).value);
  }
  _decimals_0(context, partialProofData) {
    return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(5n),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  _tokenColor_0(context, partialProofData, d_0) {
    return this._tokenType_0(d_0,
                             _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 2 } },
                                                                                        { idx: { cached: true,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(0n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value));
  }
  _known_0(context, partialProofData, d_0) {
    __compactRuntime.assert(this._equal_9(d_0,
                                          _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_1.toValue(6n),
                                                                                                                                alignment: _descriptor_1.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value))
                            ||
                            _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(14n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Unknown token');
    return [];
  }
  _readMap_0(context, partialProofData, d_0, which_0) {
    if (this._equal_10(which_0, 0n)) {
      if (_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(12n),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value))
      {
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(12n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(d_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      } else {
        return 0n;
      }
    } else {
      if (_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(13n),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value))
      {
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(13n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(d_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      } else {
        return 0n;
      }
    }
  }
  _mint_0(context, partialProofData, to_0, amount_0) {
    this._assertIssuer_0(context, partialProofData);
    const value_0 = amount_0;
    __compactRuntime.assert(value_0 > 0n, 'Amount must be positive');
    __compactRuntime.assert(!this._equal_11(to_0, new Uint8Array(32)),
                            'Recipient is the zero key');
    this._addNote_0(context,
                    partialProofData,
                    { domain:
                        _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_1.toValue(6n),
                                                                                                              alignment: _descriptor_1.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value),
                      owner: to_0,
                      amount: value_0 },
                    this._freshUniqueNonce_0(context, partialProofData));
    const tmp_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                            partialProofData,
                                                                            [
                                                                             { dup: { n: 0 } },
                                                                             { idx: { cached: false,
                                                                                      pushPath: false,
                                                                                      path: [
                                                                                             { tag: 'value',
                                                                                               value: { value: _descriptor_1.toValue(6n),
                                                                                                        alignment: _descriptor_1.alignment() } }] } },
                                                                             { popeq: { cached: false,
                                                                                        result: undefined } }]).value);
    const tmp_1 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('private_ledger.compact line 228 char 33: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(this._readMap_0(context,
                                     partialProofData,
                                     _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                               partialProofData,
                                                                                               [
                                                                                                { dup: { n: 0 } },
                                                                                                { idx: { cached: false,
                                                                                                         pushPath: false,
                                                                                                         path: [
                                                                                                                { tag: 'value',
                                                                                                                  value: { value: _descriptor_1.toValue(6n),
                                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                                { popeq: { cached: false,
                                                                                                           result: undefined } }]).value),
                                     0n)
                     +
                     value_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(12n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_1),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     10,
                     _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(6n),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value),
                     new Uint8Array(32),
                     value_0,
                     new Uint8Array([107, 105, 110, 100, 51, 58, 109, 105, 110, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    return [];
  }
  _mintNft_0(context, partialProofData, serial_0, to_0) {
    this._assertIssuer_0(context, partialProofData);
    const d_0 = this._nftDomain_0(serial_0);
    __compactRuntime.assert(!this._equal_12(d_0,
                                            _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_1.toValue(6n),
                                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value)),
                            'Serial collides with the fungible domain');
    __compactRuntime.assert(!_descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_1.toValue(14n),
                                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                            'That token already exists');
    __compactRuntime.assert(!this._equal_13(to_0, new Uint8Array(32)),
                            'Recipient is the zero key');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(14n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._addNote_0(context,
                    partialProofData,
                    { domain: d_0, owner: to_0, amount: 1n },
                    this._freshUniqueNonce_0(context, partialProofData));
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(12n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     10,
                     d_0,
                     new Uint8Array(32),
                     1n,
                     new Uint8Array([107, 105, 110, 100, 51, 58, 109, 105, 110, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    return d_0;
  }
  _transfer_0(context, partialProofData, d_0, to_0, amount_0) {
    __compactRuntime.assert(!this._equal_14(to_0, new Uint8Array(32)),
                            'Recipient is the zero key');
    const seed_0 = this._spend_0(context, partialProofData, d_0, amount_0);
    this._addNote_0(context,
                    partialProofData,
                    { domain: d_0, owner: to_0, amount: amount_0 },
                    this._tagged_0(new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 112, 97, 121, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   seed_0));
    this._logEvent_0(context,
                     partialProofData,
                     10,
                     new Uint8Array(32),
                     new Uint8Array(32),
                     0n,
                     new Uint8Array([107, 105, 110, 100, 51, 58, 116, 114, 97, 110, 115, 102, 101, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    return [];
  }
  _toUtxo_0(context, partialProofData, d_0, amount_0, recipient_0) {
    const dd_0 = d_0;
    const value_0 = amount_0;
    const to_0 = recipient_0;
    this._known_0(context, partialProofData, dd_0);
    __compactRuntime.assert(!this._equal_15(to_0.bytes, new Uint8Array(32)),
                            'Recipient is the zero address');
    this._spend_0(context, partialProofData, dd_0, value_0);
    const tmp_0 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('private_ledger.compact line 270 char 33: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(this._readMap_0(context, partialProofData, dd_0, 1n)
                     +
                     value_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(13n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(dd_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const color_0 = this._mintUnshieldedToken_0(context,
                                                partialProofData,
                                                dd_0,
                                                value_0,
                                                this._right_0(to_0));
    this._logEvent_0(context,
                     partialProofData,
                     6,
                     dd_0,
                     color_0,
                     value_0,
                     to_0.bytes);
    return color_0;
  }
  _toShielded_0(context, partialProofData, d_0, amount_0, recipient_0) {
    const dd_0 = d_0;
    const value_0 = amount_0;
    const to_0 = recipient_0;
    this._known_0(context, partialProofData, dd_0);
    __compactRuntime.assert(!this._equal_16(to_0.bytes, new Uint8Array(32)),
                            'Recipient is the zero key');
    const seed_0 = this._spend_0(context, partialProofData, dd_0, value_0);
    const tmp_0 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('private_ledger.compact line 283 char 33: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(this._readMap_0(context, partialProofData, dd_0, 1n)
                     +
                     value_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(13n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(dd_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const coinNonce_0 = this._tagged_0(new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 107, 105, 110, 100, 51, 58, 99, 111, 105, 110, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                       seed_0);
    const coin_0 = this._mintShieldedToken_0(context,
                                             partialProofData,
                                             dd_0,
                                             value_0,
                                             coinNonce_0,
                                             this._left_0(to_0));
    this._logEvent_0(context,
                     partialProofData,
                     2,
                     dd_0,
                     coin_0.color,
                     value_0,
                     new Uint8Array(32));
    return coin_0.color;
  }
  _returned_0(context, partialProofData, d_0, amount_0) {
    const out_0 = this._readMap_0(context, partialProofData, d_0, 1n);
    __compactRuntime.assert(out_0 >= amount_0, 'More than is out in native form');
    const tmp_0 = (__compactRuntime.assert(out_0 >= amount_0,
                                           'result of subtraction would be negative'),
                   out_0 - amount_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(13n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(d_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._addNote_0(context,
                    partialProofData,
                    { domain: d_0,
                      owner:
                        this._ownerKey_0(this._localSecretKey_0(context,
                                                                partialProofData)),
                      amount: amount_0 },
                    this._freshUniqueNonce_0(context, partialProofData));
    return [];
  }
  _fromUtxo_0(context, partialProofData, d_0, amount_0) {
    const dd_0 = d_0;
    const value_0 = amount_0;
    this._known_0(context, partialProofData, dd_0);
    __compactRuntime.assert(value_0 > 0n, 'Amount must be positive');
    const color_0 = this._tokenType_0(dd_0,
                                      _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { dup: { n: 2 } },
                                                                                                 { idx: { cached: true,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_1.toValue(0n),
                                                                                                                            alignment: _descriptor_1.alignment() } }] } },
                                                                                                 { popeq: { cached: true,
                                                                                                            result: undefined } }]).value));
    this._receiveUnshielded_0(context, partialProofData, color_0, value_0);
    this._returned_0(context, partialProofData, dd_0, value_0);
    this._logEvent_0(context,
                     partialProofData,
                     5,
                     dd_0,
                     color_0,
                     value_0,
                     new Uint8Array(32));
    return [];
  }
  _fromShielded_0(context, partialProofData, d_0, coin_0) {
    const dd_0 = d_0;
    const c_0 = coin_0;
    this._known_0(context, partialProofData, dd_0);
    let t_0;
    __compactRuntime.assert((t_0 = c_0.value, t_0 > 0n),
                            'Amount must be positive');
    __compactRuntime.assert(this._equal_17(c_0.color,
                                           this._tokenType_0(dd_0,
                                                             _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                       partialProofData,
                                                                                                                       [
                                                                                                                        { dup: { n: 2 } },
                                                                                                                        { idx: { cached: true,
                                                                                                                                 pushPath: false,
                                                                                                                                 path: [
                                                                                                                                        { tag: 'value',
                                                                                                                                          value: { value: _descriptor_1.toValue(0n),
                                                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                                                        { popeq: { cached: true,
                                                                                                                                   result: undefined } }]).value))),
                            'Coin is not this token');
    this._receiveShielded_0(context, partialProofData, c_0);
    this._returned_0(context, partialProofData, dd_0, c_0.value);
    this._logEvent_0(context,
                     partialProofData,
                     1,
                     dd_0,
                     c_0.color,
                     c_0.value,
                     new Uint8Array(32));
    return [];
  }
  _publishMetadata_0(context, partialProofData, payload_0) {
    this._assertIssuer_0(context, partialProofData);
    const p_0 = payload_0;
    __compactRuntime.assert(this._equal_18(p_0.kind, 0n)
                            ||
                            this._equal_19(p_0.kind, 1n)
                            ||
                            this._equal_20(p_0.kind, 3n),
                            'This contract does not issue that kind');
    this._known_0(context, partialProofData, p_0.domainSep);
    this._publishTokenMetadata_0(context, partialProofData, p_0, p_0.kind, 3n);
    return [];
  }
  _folder_0(f, x, a0) {
    for (let i = 0; i < 20; i++) { x = f(x, a0[i]); }
    return x;
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
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
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
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_11(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_12(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_13(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_14(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_15(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_16(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_17(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_18(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_19(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_20(x0, y0) {
    if (x0 !== y0) { return false; }
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
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(0n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(0n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(key_0),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
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
        return _descriptor_20.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(0n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_7.toValue(key_0),
                                                                                                      alignment: _descriptor_7.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_7.fromValue(key.value),      _descriptor_20.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get eventCount() {
      return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(1n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    tokenMetadata: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(2n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(2n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(2n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
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
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(2n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
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
                                                                                           value: { value: _descriptor_1.toValue(3n),
                                                                                                    alignment: _descriptor_1.alignment() } }] } },
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
                                                                                           value: { value: _descriptor_1.toValue(4n),
                                                                                                    alignment: _descriptor_1.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    },
    get _decimals() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(5n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get domain() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(6n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
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
                                                                                          value: { value: _descriptor_1.toValue(7n),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    notes: {
      isFull(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isFull: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(8n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(1n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1048576n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'lt',
                                                                           'neg',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      checkRoot(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`checkRoot: expected 1 argument, received ${args_0.length}`);
        }
        const rt_0 = args_0[0];
        if (!(typeof(rt_0) === 'object' && typeof(rt_0.field) === 'bigint' && rt_0.field >= 0 && rt_0.field <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('checkRoot',
                                     'argument 1',
                                     'private_ledger.compact line 56 char 1',
                                     'struct MerkleTreeDigest<field: Field>',
                                     rt_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(8n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(2n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(rt_0),
                                                                                                                                  alignment: _descriptor_13.alignment() }).encode() } },
                                                                           'member',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      root(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`root: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[8];
        return ((result) => result             ? __compactRuntime.CompactTypeMerkleTreeDigest.fromValue(result)             : undefined)(self_0.asArray()[0].asBoundedMerkleTree().rehash().root()?.value);
      },
      firstFree(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`first_free: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[8];
        return __compactRuntime.CompactTypeField.fromValue(self_0.asArray()[1].asCell().value);
      },
      pathForLeaf(...args_0) {
        if (args_0.length !== 2) {
          throw new __compactRuntime.CompactError(`path_for_leaf: expected 2 arguments, received ${args_0.length}`);
        }
        const index_0 = args_0[0];
        const leaf_0 = args_0[1];
        if (!(typeof(index_0) === 'bigint' && index_0 >= 0 && index_0 <= __compactRuntime.MAX_FIELD)) {
          __compactRuntime.typeError('path_for_leaf',
                                     'argument 1',
                                     'private_ledger.compact line 56 char 1',
                                     'Field',
                                     index_0)
        }
        if (!(leaf_0.buffer instanceof ArrayBuffer && leaf_0.BYTES_PER_ELEMENT === 1 && leaf_0.length === 32)) {
          __compactRuntime.typeError('path_for_leaf',
                                     'argument 2',
                                     'private_ledger.compact line 56 char 1',
                                     'Bytes<32>',
                                     leaf_0)
        }
        const self_0 = state.asArray()[8];
        return ((result) => result             ? new __compactRuntime.CompactTypeMerkleTreePath(20, _descriptor_0).fromValue(result)             : undefined)(  self_0.asArray()[0].asBoundedMerkleTree().rehash().pathForLeaf(    index_0,    {      value: _descriptor_0.toValue(leaf_0),      alignment: _descriptor_0.alignment()    }  )?.value);
      },
      findPathForLeaf(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`find_path_for_leaf: expected 1 argument, received ${args_0.length}`);
        }
        const leaf_0 = args_0[0];
        if (!(leaf_0.buffer instanceof ArrayBuffer && leaf_0.BYTES_PER_ELEMENT === 1 && leaf_0.length === 32)) {
          __compactRuntime.typeError('find_path_for_leaf',
                                     'argument 1',
                                     'private_ledger.compact line 56 char 1',
                                     'Bytes<32>',
                                     leaf_0)
        }
        const self_0 = state.asArray()[8];
        return ((result) => result             ? new __compactRuntime.CompactTypeMerkleTreePath(20, _descriptor_0).fromValue(result)             : undefined)(  self_0.asArray()[0].asBoundedMerkleTree().rehash().findPathForLeaf(    {      value: _descriptor_0.toValue(leaf_0),      alignment: _descriptor_0.alignment()    }  )?.value);
      },
      history(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`history: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[8];
        return self_0.asArray()[2].asMap().keys().map(  (elem) => __compactRuntime.CompactTypeMerkleTreeDigest.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    spent: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(9n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(9n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
                                     'private_ledger.compact line 59 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(9n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
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
        const self_0 = state.asArray()[9];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    commitments: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(10n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(10n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
                                     'private_ledger.compact line 63 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(10n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
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
    },
    usedNonces: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(11n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(11n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
                                     'private_ledger.compact line 67 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(11n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
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
        const self_0 = state.asArray()[11];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    mintedByDomain: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(12n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(12n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
                                     'private_ledger.compact line 70 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(12n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
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
                                     'private_ledger.compact line 70 char 1',
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
                                                                                            value: { value: _descriptor_1.toValue(12n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
        const self_0 = state.asArray()[12];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    utxoSupplyByDomain: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(13n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(13n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
                                     'private_ledger.compact line 72 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(13n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
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
                                     'private_ledger.compact line 72 char 1',
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
                                                                                            value: { value: _descriptor_1.toValue(13n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
        const self_0 = state.asArray()[13];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    nftDomains: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(14n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           'size',
                                                                           { push: { storage: false,
                                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                                           'eq',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(14n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
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
                                     'private_ledger.compact line 74 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(14n),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
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
        const self_0 = state.asArray()[14];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  localSecretKey: (...args) => undefined,
  freshNonce: (...args) => undefined,
  noteToSpend: (...args) => undefined,
  findNotePath: (...args) => undefined
});
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
  ownerKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`ownerKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('ownerKey',
                                 'argument 1',
                                 'private_ledger.compact line 104 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._ownerKey_0(sk_0);
  },
  issuerKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`issuerKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('issuerKey',
                                 'argument 1',
                                 'private_ledger.compact line 108 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._issuerKey_0(sk_0);
  },
  noteCommitment: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`noteCommitment: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const note_0 = args_0[0];
    const nonce_0 = args_0[1];
    if (!(typeof(note_0) === 'object' && note_0.domain.buffer instanceof ArrayBuffer && note_0.domain.BYTES_PER_ELEMENT === 1 && note_0.domain.length === 32 && note_0.owner.buffer instanceof ArrayBuffer && note_0.owner.BYTES_PER_ELEMENT === 1 && note_0.owner.length === 32 && typeof(note_0.amount) === 'bigint' && note_0.amount >= 0n && note_0.amount <= 340282366920938463463374607431768211455n)) {
      __compactRuntime.typeError('noteCommitment',
                                 'argument 1',
                                 'private_ledger.compact line 112 char 1',
                                 'struct Note<domain: Bytes<32>, owner: Bytes<32>, amount: Uint<0..340282366920938463463374607431768211456>>',
                                 note_0)
    }
    if (!(nonce_0.buffer instanceof ArrayBuffer && nonce_0.BYTES_PER_ELEMENT === 1 && nonce_0.length === 32)) {
      __compactRuntime.typeError('noteCommitment',
                                 'argument 2',
                                 'private_ledger.compact line 112 char 1',
                                 'Bytes<32>',
                                 nonce_0)
    }
    return _dummyContract._noteCommitment_0(note_0, nonce_0);
  },
  nftDomain: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`nftDomain: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const serial_0 = args_0[0];
    if (!(serial_0.buffer instanceof ArrayBuffer && serial_0.BYTES_PER_ELEMENT === 1 && serial_0.length === 32)) {
      __compactRuntime.typeError('nftDomain',
                                 'argument 1',
                                 'private_ledger.compact line 116 char 1',
                                 'Bytes<32>',
                                 serial_0)
    }
    return _dummyContract._nftDomain_0(serial_0);
  },
  nullifierOf: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`nullifierOf: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    const commitment_0 = args_0[1];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('nullifierOf',
                                 'argument 1',
                                 'private_ledger.compact line 121 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
      __compactRuntime.typeError('nullifierOf',
                                 'argument 2',
                                 'private_ledger.compact line 121 char 1',
                                 'Bytes<32>',
                                 commitment_0)
    }
    return _dummyContract._nullifierOf_0(sk_0, commitment_0);
  },
  outputNonce: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`outputNonce: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const tag_0 = args_0[0];
    const sk_0 = args_0[1];
    const spentNonce_0 = args_0[2];
    if (!(tag_0.buffer instanceof ArrayBuffer && tag_0.BYTES_PER_ELEMENT === 1 && tag_0.length === 32)) {
      __compactRuntime.typeError('outputNonce',
                                 'argument 1',
                                 'private_ledger.compact line 128 char 1',
                                 'Bytes<32>',
                                 tag_0)
    }
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('outputNonce',
                                 'argument 2',
                                 'private_ledger.compact line 128 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    if (!(spentNonce_0.buffer instanceof ArrayBuffer && spentNonce_0.BYTES_PER_ELEMENT === 1 && spentNonce_0.length === 32)) {
      __compactRuntime.typeError('outputNonce',
                                 'argument 3',
                                 'private_ledger.compact line 128 char 1',
                                 'Bytes<32>',
                                 spentNonce_0)
    }
    return _dummyContract._outputNonce_0(tag_0, sk_0, spentNonce_0);
  },
  tagged: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`tagged: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const tag_0 = args_0[0];
    const seed_0 = args_0[1];
    if (!(tag_0.buffer instanceof ArrayBuffer && tag_0.BYTES_PER_ELEMENT === 1 && tag_0.length === 32)) {
      __compactRuntime.typeError('tagged',
                                 'argument 1',
                                 'private_ledger.compact line 133 char 1',
                                 'Bytes<32>',
                                 tag_0)
    }
    if (!(seed_0.buffer instanceof ArrayBuffer && seed_0.BYTES_PER_ELEMENT === 1 && seed_0.length === 32)) {
      __compactRuntime.typeError('tagged',
                                 'argument 2',
                                 'private_ledger.compact line 133 char 1',
                                 'Bytes<32>',
                                 seed_0)
    }
    return _dummyContract._tagged_0(tag_0, seed_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
