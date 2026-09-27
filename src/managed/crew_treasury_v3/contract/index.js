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

const _descriptor_1 = __compactRuntime.CompactTypeBoolean;

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_3 = new __compactRuntime.CompactTypeBytes(189);

class _TokenMetadataPayload_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_3.alignment())))));
  }
  fromValue(value_0) {
    return {
      domainSep: _descriptor_0.fromValue(value_0),
      kind: _descriptor_2.fromValue(value_0),
      key: _descriptor_0.fromValue(value_0),
      valType: _descriptor_2.fromValue(value_0),
      valLen: _descriptor_2.fromValue(value_0),
      value: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.domainSep).concat(_descriptor_2.toValue(value_0.kind).concat(_descriptor_0.toValue(value_0.key).concat(_descriptor_2.toValue(value_0.valType).concat(_descriptor_2.toValue(value_0.valLen).concat(_descriptor_3.toValue(value_0.value))))));
  }
}

const _descriptor_4 = new _TokenMetadataPayload_0();

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

const _descriptor_6 = __compactRuntime.CompactTypeField;

class _MerkleTreeDigest_0 {
  alignment() {
    return _descriptor_6.alignment();
  }
  fromValue(value_0) {
    return {
      field: _descriptor_6.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.field);
  }
}

const _descriptor_7 = new _MerkleTreeDigest_0();

const _descriptor_8 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

const _descriptor_10 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

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

const _descriptor_11 = new _UserAddress_0();

class _MandateTerms_0 {
  alignment() {
    return _descriptor_10.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      capPerDraw: _descriptor_10.fromValue(value_0),
      drawsPerPeriod: _descriptor_2.fromValue(value_0),
      salt: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_10.toValue(value_0.capPerDraw).concat(_descriptor_2.toValue(value_0.drawsPerPeriod).concat(_descriptor_0.toValue(value_0.salt)));
  }
}

const _descriptor_12 = new _MandateTerms_0();

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

const _descriptor_13 = new _ZswapCoinPublicKey_0();

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

const _descriptor_14 = new _ContractAddress_0();

class _MerkleTreePathEntry_0 {
  alignment() {
    return _descriptor_7.alignment().concat(_descriptor_1.alignment());
  }
  fromValue(value_0) {
    return {
      sibling: _descriptor_7.fromValue(value_0),
      goes_left: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_7.toValue(value_0.sibling).concat(_descriptor_1.toValue(value_0.goes_left));
  }
}

const _descriptor_15 = new _MerkleTreePathEntry_0();

const _descriptor_16 = new __compactRuntime.CompactTypeVector(16, _descriptor_15);

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

const _descriptor_18 = new __compactRuntime.CompactTypeEnum(10, 1);

class _ContractEvent_0 {
  alignment() {
    return _descriptor_18.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_5.alignment().concat(_descriptor_0.alignment()))));
  }
  fromValue(value_0) {
    return {
      eventType: _descriptor_18.fromValue(value_0),
      domainSep: _descriptor_0.fromValue(value_0),
      tokenType: _descriptor_0.fromValue(value_0),
      amount: _descriptor_5.fromValue(value_0),
      subject: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_18.toValue(value_0.eventType).concat(_descriptor_0.toValue(value_0.domainSep).concat(_descriptor_0.toValue(value_0.tokenType).concat(_descriptor_5.toValue(value_0.amount).concat(_descriptor_0.toValue(value_0.subject)))));
  }
}

const _descriptor_19 = new _ContractEvent_0();

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

const _descriptor_20 = new _ShieldedCoinInfo_0();

class _Either_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_13.alignment().concat(_descriptor_14.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_1.fromValue(value_0),
      left: _descriptor_13.fromValue(value_0),
      right: _descriptor_14.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_left).concat(_descriptor_13.toValue(value_0.left).concat(_descriptor_14.toValue(value_0.right)));
  }
}

const _descriptor_21 = new _Either_0();

class _MetadataSlot_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      tag: _descriptor_0.fromValue(value_0),
      domainSep: _descriptor_0.fromValue(value_0),
      kind: _descriptor_2.fromValue(value_0),
      key: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.tag).concat(_descriptor_0.toValue(value_0.domainSep).concat(_descriptor_2.toValue(value_0.kind).concat(_descriptor_0.toValue(value_0.key))));
  }
}

const _descriptor_22 = new _MetadataSlot_0();

const _descriptor_23 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

class _DrawTicket_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment()))));
  }
  fromValue(value_0) {
    return {
      tag: _descriptor_0.fromValue(value_0),
      crew: _descriptor_0.fromValue(value_0),
      period: _descriptor_0.fromValue(value_0),
      secret: _descriptor_0.fromValue(value_0),
      slot: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.tag).concat(_descriptor_0.toValue(value_0.crew).concat(_descriptor_0.toValue(value_0.period).concat(_descriptor_0.toValue(value_0.secret).concat(_descriptor_2.toValue(value_0.slot)))));
  }
}

const _descriptor_24 = new _DrawTicket_0();

const _descriptor_25 = new __compactRuntime.CompactTypeBytes(6);

class _LeafPreimage_0 {
  alignment() {
    return _descriptor_25.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_25.fromValue(value_0),
      data: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_25.toValue(value_0.domain_sep).concat(_descriptor_0.toValue(value_0.data));
  }
}

const _descriptor_26 = new _LeafPreimage_0();

const _descriptor_27 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

const _descriptor_28 = new __compactRuntime.CompactTypeBytes(21);

class _CoinPreimage_0 {
  alignment() {
    return _descriptor_28.alignment().concat(_descriptor_20.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_28.fromValue(value_0),
      info: _descriptor_20.fromValue(value_0),
      dataType: _descriptor_1.fromValue(value_0),
      data: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_28.toValue(value_0.domain_sep).concat(_descriptor_20.toValue(value_0.info).concat(_descriptor_1.toValue(value_0.dataType).concat(_descriptor_0.toValue(value_0.data))));
  }
}

const _descriptor_29 = new _CoinPreimage_0();

class _Appointment_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_9.alignment()));
  }
  fromValue(value_0) {
    return {
      tag: _descriptor_0.fromValue(value_0),
      key: _descriptor_0.fromValue(value_0),
      epoch: _descriptor_9.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.tag).concat(_descriptor_0.toValue(value_0.key).concat(_descriptor_9.toValue(value_0.epoch)));
  }
}

const _descriptor_30 = new _Appointment_0();

const _descriptor_31 = new __compactRuntime.CompactTypeVector(2, _descriptor_6);

class _MandateLeaf_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_9.alignment().concat(_descriptor_12.alignment()))));
  }
  fromValue(value_0) {
    return {
      tag: _descriptor_0.fromValue(value_0),
      crew: _descriptor_0.fromValue(value_0),
      key: _descriptor_0.fromValue(value_0),
      epoch: _descriptor_9.fromValue(value_0),
      terms: _descriptor_12.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.tag).concat(_descriptor_0.toValue(value_0.crew).concat(_descriptor_0.toValue(value_0.key).concat(_descriptor_9.toValue(value_0.epoch).concat(_descriptor_12.toValue(value_0.terms)))));
  }
}

const _descriptor_32 = new _MandateLeaf_0();

class _Either_1 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_1.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_33 = new _Either_1();

class _Either_2 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_14.alignment().concat(_descriptor_11.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_1.fromValue(value_0),
      left: _descriptor_14.fromValue(value_0),
      right: _descriptor_11.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_left).concat(_descriptor_14.toValue(value_0.left).concat(_descriptor_11.toValue(value_0.right)));
  }
}

const _descriptor_34 = new _Either_2();

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
    if (typeof(witnesses_0.mandateTerms) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named mandateTerms');
    }
    if (typeof(witnesses_0.findMandatePath) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named findMandatePath');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      metadataSlot(context, ...args_1) {
        return { result: pureCircuits.metadataSlot(...args_1), context };
      },
      organiserKey(context, ...args_1) {
        return { result: pureCircuits.organiserKey(...args_1), context };
      },
      agentKey(context, ...args_1) {
        return { result: pureCircuits.agentKey(...args_1), context };
      },
      mandateLeaf(context, ...args_1) {
        return { result: pureCircuits.mandateLeaf(...args_1), context };
      },
      mintTreasury: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`mintTreasury: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const amount_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('mintTreasury',
                                     'argument 1 (as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 167 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('mintTreasury',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 167 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amount_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_10.toValue(amount_0),
            alignment: _descriptor_10.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._mintTreasury_0(context,
                                              partialProofData,
                                              amount_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      issueMandate: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`issueMandate: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const key_0 = args_1[1];
        const terms_0 = args_1[2];
        const holder_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('issueMandate',
                                     'argument 1 (as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 182 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('issueMandate',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 182 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        if (!(typeof(terms_0) === 'object' && typeof(terms_0.capPerDraw) === 'bigint' && terms_0.capPerDraw >= 0n && terms_0.capPerDraw <= 18446744073709551615n && typeof(terms_0.drawsPerPeriod) === 'bigint' && terms_0.drawsPerPeriod >= 0n && terms_0.drawsPerPeriod <= 255n && terms_0.salt.buffer instanceof ArrayBuffer && terms_0.salt.BYTES_PER_ELEMENT === 1 && terms_0.salt.length === 32)) {
          __compactRuntime.typeError('issueMandate',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 182 char 1',
                                     'struct MandateTerms<capPerDraw: Uint<0..18446744073709551616>, drawsPerPeriod: Uint<0..256>, salt: Bytes<32>>',
                                     terms_0)
        }
        if (!(typeof(holder_0) === 'object' && holder_0.bytes.buffer instanceof ArrayBuffer && holder_0.bytes.BYTES_PER_ELEMENT === 1 && holder_0.bytes.length === 32)) {
          __compactRuntime.typeError('issueMandate',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 182 char 1',
                                     'struct ZswapCoinPublicKey<bytes: Bytes<32>>',
                                     holder_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(key_0).concat(_descriptor_12.toValue(terms_0).concat(_descriptor_13.toValue(holder_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_12.alignment().concat(_descriptor_13.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._issueMandate_0(context,
                                              partialProofData,
                                              key_0,
                                              terms_0,
                                              holder_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      openPeriod: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`openPeriod: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const period_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('openPeriod',
                                     'argument 1 (as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 204 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(period_0.buffer instanceof ArrayBuffer && period_0.BYTES_PER_ELEMENT === 1 && period_0.length === 32)) {
          __compactRuntime.typeError('openPeriod',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 204 char 1',
                                     'Bytes<32>',
                                     period_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(period_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._openPeriod_0(context, partialProofData, period_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      setPaused: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`setPaused: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const value_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setPaused',
                                     'argument 1 (as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 212 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(value_0) === 'boolean')) {
          __compactRuntime.typeError('setPaused',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 212 char 1',
                                     'Boolean',
                                     value_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(value_0),
            alignment: _descriptor_1.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._setPaused_0(context, partialProofData, value_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revokeAll: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`revokeAll: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revokeAll',
                                     'argument 1 (as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 223 char 1',
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
        const result_0 = this._revokeAll_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      blockPayee: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`blockPayee: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const payee_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('blockPayee',
                                     'argument 1 (as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 229 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(payee_0) === 'object' && payee_0.bytes.buffer instanceof ArrayBuffer && payee_0.bytes.BYTES_PER_ELEMENT === 1 && payee_0.bytes.length === 32)) {
          __compactRuntime.typeError('blockPayee',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 229 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     payee_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_11.toValue(payee_0),
            alignment: _descriptor_11.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._blockPayee_0(context, partialProofData, payee_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      unblockPayee: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`unblockPayee: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const payee_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('unblockPayee',
                                     'argument 1 (as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 235 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(payee_0) === 'object' && payee_0.bytes.buffer instanceof ArrayBuffer && payee_0.bytes.BYTES_PER_ELEMENT === 1 && payee_0.bytes.length === 32)) {
          __compactRuntime.typeError('unblockPayee',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 235 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     payee_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_11.toValue(payee_0),
            alignment: _descriptor_11.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._unblockPayee_0(context, partialProofData, payee_0);
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
                                     'crew_treasury_v3.compact line 243 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(payload_0) === 'object' && payload_0.domainSep.buffer instanceof ArrayBuffer && payload_0.domainSep.BYTES_PER_ELEMENT === 1 && payload_0.domainSep.length === 32 && typeof(payload_0.kind) === 'bigint' && payload_0.kind >= 0n && payload_0.kind <= 255n && payload_0.key.buffer instanceof ArrayBuffer && payload_0.key.BYTES_PER_ELEMENT === 1 && payload_0.key.length === 32 && typeof(payload_0.valType) === 'bigint' && payload_0.valType >= 0n && payload_0.valType <= 255n && typeof(payload_0.valLen) === 'bigint' && payload_0.valLen >= 0n && payload_0.valLen <= 255n && payload_0.value.buffer instanceof ArrayBuffer && payload_0.value.BYTES_PER_ELEMENT === 1 && payload_0.value.length === 189)) {
          __compactRuntime.typeError('publishMetadata',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 243 char 1',
                                     'struct TokenMetadataPayload<domainSep: Bytes<32>, kind: Uint<0..256>, key: Bytes<32>, valType: Uint<0..256>, valLen: Uint<0..256>, value: Bytes<189>>',
                                     payload_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(payload_0),
            alignment: _descriptor_4.alignment()
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
      },
      draw: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`draw: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const amount_0 = args_1[1];
        const slot_0 = args_1[2];
        const recipient_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('draw',
                                     'argument 1 (as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 256 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('draw',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 256 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amount_0)
        }
        if (!(typeof(slot_0) === 'bigint' && slot_0 >= 0n && slot_0 <= 255n)) {
          __compactRuntime.typeError('draw',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 256 char 1',
                                     'Uint<0..256>',
                                     slot_0)
        }
        if (!(typeof(recipient_0) === 'object' && recipient_0.bytes.buffer instanceof ArrayBuffer && recipient_0.bytes.BYTES_PER_ELEMENT === 1 && recipient_0.bytes.length === 32)) {
          __compactRuntime.typeError('draw',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'crew_treasury_v3.compact line 256 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     recipient_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_10.toValue(amount_0).concat(_descriptor_2.toValue(slot_0).concat(_descriptor_11.toValue(recipient_0))),
            alignment: _descriptor_10.alignment().concat(_descriptor_2.alignment().concat(_descriptor_11.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._draw_0(context,
                                      partialProofData,
                                      amount_0,
                                      slot_0,
                                      recipient_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      mintTreasury: this.circuits.mintTreasury,
      issueMandate: this.circuits.issueMandate,
      openPeriod: this.circuits.openPeriod,
      setPaused: this.circuits.setPaused,
      revokeAll: this.circuits.revokeAll,
      blockPayee: this.circuits.blockPayee,
      unblockPayee: this.circuits.unblockPayee,
      publishMetadata: this.circuits.publishMetadata,
      draw: this.circuits.draw
    };
    this.provableCircuits = {
      mintTreasury: this.circuits.mintTreasury,
      issueMandate: this.circuits.issueMandate,
      openPeriod: this.circuits.openPeriod,
      setPaused: this.circuits.setPaused,
      revokeAll: this.circuits.revokeAll,
      blockPayee: this.circuits.blockPayee,
      unblockPayee: this.circuits.unblockPayee,
      publishMetadata: this.circuits.publishMetadata,
      draw: this.circuits.draw
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const cid_0 = args_0[1];
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
    if (!(cid_0.buffer instanceof ArrayBuffer && cid_0.BYTES_PER_ELEMENT === 1 && cid_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'crew_treasury_v3.compact line 158 char 1',
                                 'Bytes<32>',
                                 cid_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    let stateValue_2 = __compactRuntime.StateValue.newArray();
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(stateValue_2);
    let stateValue_1 = __compactRuntime.StateValue.newArray();
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(stateValue_1);
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('mintTreasury', new __compactRuntime.ContractOperation());
    state_0.setOperation('issueMandate', new __compactRuntime.ContractOperation());
    state_0.setOperation('openPeriod', new __compactRuntime.ContractOperation());
    state_0.setOperation('setPaused', new __compactRuntime.ContractOperation());
    state_0.setOperation('revokeAll', new __compactRuntime.ContractOperation());
    state_0.setOperation('blockPayee', new __compactRuntime.ContractOperation());
    state_0.setOperation('unblockPayee', new __compactRuntime.ContractOperation());
    state_0.setOperation('publishMetadata', new __compactRuntime.ContractOperation());
    state_0.setOperation('draw', new __compactRuntime.ContractOperation());
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
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(4n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newArray()
                                                          .arrayPush(__compactRuntime.StateValue.newBoundedMerkleTree(
                                                                       new __compactRuntime.StateBoundedMerkleTree(16)
                                                                     )).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                                                        alignment: _descriptor_10.alignment() })).arrayPush(__compactRuntime.StateValue.newMap(
                                                                                                                                                                              new __compactRuntime.StateMap()
                                                                                                                                                                            ))
                                                          .encode() } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(2n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       'root',
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(5n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(7n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(0n),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(11n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(false),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(12n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(13n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(14n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = this._organiserKey_0(this._localSecretKey_0(context,
                                                              partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(cid_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
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
    return { is_left: true, left: value_0, right: { bytes: new Uint8Array(32) } };
  }
  _left_2(value_0) {
    return { is_left: true, left: value_0, right: new Uint8Array(32) };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _merkleTreePathRoot_0(path_0) {
    return { field:
               this._folder_0((...args_0) =>
                                this._merkleTreePathEntryRoot_0(...args_0),
                              this._degradeToTransient_0(this._persistentHash_6({ domain_sep:
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
                                         _descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 2 } },
                                                                                                     { idx: { cached: true,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_2.toValue(0n),
                                                                                                                                alignment: _descriptor_2.alignment() } }] } },
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
                                                         value: { value: _descriptor_2.toValue(4n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_sep_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(value_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
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
                                                         value: { value: _descriptor_2.toValue(2n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
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
                      _descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
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
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
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
  _coinCommitment_0(coin_0, recipient_0) {
    return this._persistentHash_4({ domain_sep:
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
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domainSep_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(amount_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
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
                                      _descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                 partialProofData,
                                                                                                 [
                                                                                                  { dup: { n: 2 } },
                                                                                                  { idx: { cached: true,
                                                                                                           pushPath: false,
                                                                                                           path: [
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                                  { popeq: { cached: true,
                                                                                                             result: undefined } }]).value));
    const tmp_0 = this._left_2(color_0);
    const tmp_1 = amount_0;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(8n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_33.toValue(tmp_0),
                                                                                                alignment: _descriptor_33.alignment() },
                                                                                              { value: _descriptor_34.toValue(recipient_0),
                                                                                                alignment: _descriptor_34.alignment() }
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
                      _descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_2(color_0);
      const tmp_3 = amount_0;
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(6n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_33.toValue(tmp_2),
                                                                                                alignment: _descriptor_33.alignment() }).encode() } },
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
  _sendUnshielded_0(context, partialProofData, color_0, amount_0, recipient_0) {
    const tmp_0 = this._left_2(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(7n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_33.toValue(tmp_0),
                                                                                              alignment: _descriptor_33.alignment() }).encode() } },
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
    const tmp_1 = this._left_2(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(8n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_33.toValue(tmp_1),
                                                                                                alignment: _descriptor_33.alignment() },
                                                                                              { value: _descriptor_34.toValue(recipient_0),
                                                                                                alignment: _descriptor_34.alignment() }
                                                                                            )).encode() } },
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
    if (recipient_0.is_left
        &&
        this._equal_2(recipient_0.left.bytes,
                      _descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_2(color_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(6n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_33.toValue(tmp_2),
                                                                                                alignment: _descriptor_33.alignment() }).encode() } },
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
    }
    return [];
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_31, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_32, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_30, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_23, value_0);
    return result_0;
  }
  _persistentHash_3(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_27, value_0);
    return result_0;
  }
  _persistentHash_4(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_29, value_0);
    return result_0;
  }
  _persistentHash_5(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_24, value_0);
    return result_0;
  }
  _persistentHash_6(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_26, value_0);
    return result_0;
  }
  _persistentHash_7(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_22, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
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
    const tmp_0 = _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(0n),
                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                         alignment: _descriptor_2.alignment() } }] } },
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
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(tmp_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(tmp_1),
                                                                                              alignment: _descriptor_19.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    const tmp_2 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_8.toValue(tmp_2),
                                                                alignment: _descriptor_8.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  _metadataSlot_0(domainSep_0, kind_0, key_0) {
    return this._persistentHash_7({ tag:
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
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(2n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(payload_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
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
                                 'crew_treasury_v3.compact line 101 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _mandateTerms_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.mandateTerms(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.capPerDraw) === 'bigint' && result_0.capPerDraw >= 0n && result_0.capPerDraw <= 18446744073709551615n && typeof(result_0.drawsPerPeriod) === 'bigint' && result_0.drawsPerPeriod >= 0n && result_0.drawsPerPeriod <= 255n && result_0.salt.buffer instanceof ArrayBuffer && result_0.salt.BYTES_PER_ELEMENT === 1 && result_0.salt.length === 32)) {
      __compactRuntime.typeError('mandateTerms',
                                 'return value',
                                 'crew_treasury_v3.compact line 105 char 1',
                                 'struct MandateTerms<capPerDraw: Uint<0..18446744073709551616>, drawsPerPeriod: Uint<0..256>, salt: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_12.toValue(result_0),
      alignment: _descriptor_12.alignment()
    });
    return result_0;
  }
  _findMandatePath_0(context, partialProofData, leaf_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.findMandatePath(witnessContext_0,
                                                                          leaf_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.leaf.buffer instanceof ArrayBuffer && result_0.leaf.BYTES_PER_ELEMENT === 1 && result_0.leaf.length === 32 && Array.isArray(result_0.path) && result_0.path.length === 16 && result_0.path.every((t) => typeof(t) === 'object' && typeof(t.sibling) === 'object' && typeof(t.sibling.field) === 'bigint' && t.sibling.field >= 0 && t.sibling.field <= __compactRuntime.MAX_FIELD && typeof(t.goes_left) === 'boolean'))) {
      __compactRuntime.typeError('findMandatePath',
                                 'return value',
                                 'crew_treasury_v3.compact line 107 char 1',
                                 'struct MerkleTreePath<leaf: Bytes<32>, path: Vector<16, struct MerkleTreePathEntry<sibling: struct MerkleTreeDigest<field: Field>, goes_left: Boolean>>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_17.toValue(result_0),
      alignment: _descriptor_17.alignment()
    });
    return result_0;
  }
  _organiserKey_0(sk_0) {
    return this._persistentHash_2([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 111, 114, 103, 97, 110, 105, 115, 101, 114, 58, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  _agentKey_0(sk_0, cid_0) {
    return this._persistentHash_3([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 97, 103, 101, 110, 116, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   cid_0,
                                   sk_0]);
  }
  _mandateLeaf_0(cid_0, key_0, e_0, terms_0) {
    return this._persistentHash_0({ tag:
                                      new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 109, 97, 110, 100, 97, 116, 101, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    crew: cid_0,
                                    key: key_0,
                                    epoch: e_0,
                                    terms: terms_0 });
  }
  _drawNullifier_0(cid_0, period_0, sk_0, slot_0) {
    return this._persistentHash_5({ tag:
                                      new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 100, 114, 97, 119, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    crew: cid_0,
                                    period: period_0,
                                    secret: sk_0,
                                    slot: slot_0 });
  }
  _assertOrganiser_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_8(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_2.toValue(1n),
                                                                                                                                alignment: _descriptor_2.alignment() } },
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_2.toValue(0n),
                                                                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          this._organiserKey_0(this._localSecretKey_0(context,
                                                                                      partialProofData))),
                            'Caller is not the organiser');
    return [];
  }
  _mintTreasury_0(context, partialProofData, amount_0) {
    this._assertOrganiser_0(context, partialProofData);
    const value_0 = amount_0;
    __compactRuntime.assert(value_0 > 0n, 'Mint amount must be positive');
    const domain_0 = new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 116, 114, 101, 97, 115, 117, 114, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const color_0 = this._mintUnshieldedToken_0(context,
                                                partialProofData,
                                                domain_0,
                                                value_0,
                                                this._left_0(_descriptor_14.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                        partialProofData,
                                                                                                                        [
                                                                                                                         { dup: { n: 2 } },
                                                                                                                         { idx: { cached: true,
                                                                                                                                  pushPath: false,
                                                                                                                                  path: [
                                                                                                                                         { tag: 'value',
                                                                                                                                           value: { value: _descriptor_2.toValue(0n),
                                                                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                                                                         { popeq: { cached: true,
                                                                                                                                    result: undefined } }]).value)));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(color_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('crew_treasury_v3.compact line 174 char 20: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(3n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     +
                     value_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     6,
                     domain_0,
                     color_0,
                     value_0,
                     new Uint8Array(32));
    return color_0;
  }
  _issueMandate_0(context, partialProofData, key_0, terms_0, holder_0) {
    this._assertOrganiser_0(context, partialProofData);
    let t_0;
    __compactRuntime.assert((t_0 = terms_0.capPerDraw, t_0 > 0n),
                            'Cap must be positive');
    let t_1;
    __compactRuntime.assert((t_1 = terms_0.drawsPerPeriod, t_1 > 0n),
                            'At least one draw per period');
    const appointment_0 = this._persistentHash_1({ tag:
                                                     new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 97, 112, 112, 111, 105, 110, 116, 101, 100, 58, 0, 0, 0, 0, 0, 0, 0]),
                                                   key: key_0,
                                                   epoch:
                                                     _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                               partialProofData,
                                                                                                               [
                                                                                                                { dup: { n: 0 } },
                                                                                                                { idx: { cached: false,
                                                                                                                         pushPath: false,
                                                                                                                         path: [
                                                                                                                                { tag: 'value',
                                                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                                                { tag: 'value',
                                                                                                                                  value: { value: _descriptor_2.toValue(9n),
                                                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                                                { popeq: { cached: false,
                                                                                                                           result: undefined } }]).value) });
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(7n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(appointment_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Agent already appointed this epoch');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(7n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(appointment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    const leaf_0 = this._mandateLeaf_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                 partialProofData,
                                                                                                 [
                                                                                                  { dup: { n: 0 } },
                                                                                                  { idx: { cached: false,
                                                                                                           pushPath: false,
                                                                                                           path: [
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(1n),
                                                                                                                             alignment: _descriptor_2.alignment() } },
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(1n),
                                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                                  { popeq: { cached: false,
                                                                                                             result: undefined } }]).value),
                                       key_0,
                                       _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                 partialProofData,
                                                                                                 [
                                                                                                  { dup: { n: 0 } },
                                                                                                  { idx: { cached: false,
                                                                                                           pushPath: false,
                                                                                                           path: [
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(1n),
                                                                                                                             alignment: _descriptor_2.alignment() } },
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(9n),
                                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                                  { popeq: { cached: false,
                                                                                                             result: undefined } }]).value),
                                       terms_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(6n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(leaf_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Mandate already issued');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(6n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(leaf_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(4n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.leafHash(
                                                                                              { value: _descriptor_0.toValue(leaf_0),
                                                                                                alignment: _descriptor_0.alignment() }
                                                                                            )).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: 1 } },
                                       { ins: { cached: true, n: 1 } },
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(2n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: false,
                                                pushPath: false,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       'root',
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 3 } }]);
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_8.toValue(tmp_0),
                                                                alignment: _descriptor_8.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 2 } }]);
    const domain_0 = this._persistentHash_2([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 109, 97, 110, 100, 97, 116, 101, 45, 110, 102, 116, 58, 0, 0, 0, 0, 0]),
                                             leaf_0]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(8n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(domain_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    const nonce_0 = this._persistentHash_3([new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 110, 102, 116, 45, 110, 111, 110, 99, 101, 58, 0, 0, 0, 0, 0, 0, 0]),
                                            this._localSecretKey_0(context,
                                                                   partialProofData),
                                            leaf_0]);
    const coin_0 = this._mintShieldedToken_0(context,
                                             partialProofData,
                                             domain_0,
                                             1n,
                                             nonce_0,
                                             this._left_1(holder_0));
    this._logEvent_0(context,
                     partialProofData,
                     2,
                     domain_0,
                     coin_0.color,
                     1n,
                     new Uint8Array(32));
    return coin_0.color;
  }
  _openPeriod_0(context, partialProofData, period_0) {
    this._assertOrganiser_0(context, partialProofData);
    const p_0 = period_0;
    __compactRuntime.assert(!this._equal_9(p_0, new Uint8Array(32)),
                            'A period cannot be all zeros');
    __compactRuntime.assert(!this._equal_10(p_0,
                                            _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(10n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value)),
                            'That period is already open');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _setPaused_0(context, partialProofData, value_0) {
    this._assertOrganiser_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(11n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(value_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    if (value_0) {
      this._logEvent_0(context,
                       partialProofData,
                       8,
                       new Uint8Array(32),
                       new Uint8Array(32),
                       0n,
                       new Uint8Array(32));
    } else {
      this._logEvent_0(context,
                       partialProofData,
                       9,
                       new Uint8Array(32),
                       new Uint8Array(32),
                       0n,
                       new Uint8Array(32));
    }
    return [];
  }
  _revokeAll_0(context, partialProofData) {
    this._assertOrganiser_0(context, partialProofData);
    const tmp_0 = ((t1) => {
                    if (t1 > 4294967295n) {
                      throw new __compactRuntime.CompactError('crew_treasury_v3.compact line 225 char 11: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                    }
                    return t1;
                  })(_descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(9n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     +
                     1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(tmp_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     10,
                     new Uint8Array(32),
                     new Uint8Array(32),
                     _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(9n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value),
                     new Uint8Array([99, 114, 101, 119, 51, 58, 114, 101, 118, 111, 107, 101, 45, 97, 108, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    return [];
  }
  _blockPayee_0(context, partialProofData, payee_0) {
    this._assertOrganiser_0(context, partialProofData);
    const tmp_0 = payee_0.bytes;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(14n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     10,
                     new Uint8Array(32),
                     new Uint8Array(32),
                     0n,
                     new Uint8Array([99, 114, 101, 119, 51, 58, 98, 108, 111, 99, 107, 45, 112, 97, 121, 101, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    return [];
  }
  _unblockPayee_0(context, partialProofData, payee_0) {
    this._assertOrganiser_0(context, partialProofData);
    const tmp_0 = payee_0.bytes;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(14n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    this._logEvent_0(context,
                     partialProofData,
                     10,
                     new Uint8Array(32),
                     new Uint8Array(32),
                     0n,
                     new Uint8Array([99, 114, 101, 119, 51, 58, 117, 110, 98, 108, 111, 99, 107, 45, 112, 97, 121, 101, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    return [];
  }
  _publishMetadata_0(context, partialProofData, payload_0) {
    this._assertOrganiser_0(context, partialProofData);
    const p_0 = payload_0;
    let tmp_0;
    __compactRuntime.assert(this._equal_11(p_0.kind, 0n)
                            &&
                            this._equal_12(p_0.domainSep,
                                           new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 116, 114, 101, 97, 115, 117, 114, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
                            ||
                            this._equal_13(p_0.kind, 1n)
                            &&
                            (tmp_0 = p_0.domainSep,
                             _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(8n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value)),
                            'Not a token this treasury issued');
    this._publishTokenMetadata_0(context, partialProofData, p_0, 0n, 1n);
    return [];
  }
  _draw_0(context, partialProofData, amount_0, slot_0, recipient_0) {
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(11n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value),
                            'Draws are paused');
    __compactRuntime.assert(!this._equal_14(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(10n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value),
                                            new Uint8Array(32)),
                            'No period open');
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(3n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_0 > 0n),
                            'Treasury not funded');
    const value_0 = amount_0;
    const payee_0 = recipient_0;
    __compactRuntime.assert(value_0 > 0n, 'Amount must be positive');
    __compactRuntime.assert(!this._equal_15(payee_0.bytes, new Uint8Array(32)),
                            'Payee is the zero address');
    let tmp_0;
    __compactRuntime.assert(!(tmp_0 = payee_0.bytes,
                              _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_2.toValue(1n),
                                                                                                                    alignment: _descriptor_2.alignment() } },
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_2.toValue(14n),
                                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value)),
                            'Payee is blocked');
    const sk_0 = this._localSecretKey_0(context, partialProofData);
    const terms_0 = this._mandateTerms_0(context, partialProofData);
    const leaf_0 = this._mandateLeaf_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                 partialProofData,
                                                                                                 [
                                                                                                  { dup: { n: 0 } },
                                                                                                  { idx: { cached: false,
                                                                                                           pushPath: false,
                                                                                                           path: [
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(1n),
                                                                                                                             alignment: _descriptor_2.alignment() } },
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(1n),
                                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                                  { popeq: { cached: false,
                                                                                                             result: undefined } }]).value),
                                       this._agentKey_0(sk_0,
                                                        _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                  partialProofData,
                                                                                                                  [
                                                                                                                   { dup: { n: 0 } },
                                                                                                                   { idx: { cached: false,
                                                                                                                            pushPath: false,
                                                                                                                            path: [
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_2.toValue(1n),
                                                                                                                                              alignment: _descriptor_2.alignment() } },
                                                                                                                                   { tag: 'value',
                                                                                                                                     value: { value: _descriptor_2.toValue(1n),
                                                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                                                   { popeq: { cached: false,
                                                                                                                              result: undefined } }]).value)),
                                       _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                 partialProofData,
                                                                                                 [
                                                                                                  { dup: { n: 0 } },
                                                                                                  { idx: { cached: false,
                                                                                                           pushPath: false,
                                                                                                           path: [
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(1n),
                                                                                                                             alignment: _descriptor_2.alignment() } },
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(9n),
                                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                                  { popeq: { cached: false,
                                                                                                             result: undefined } }]).value),
                                       terms_0);
    const supplied_0 = this._findMandatePath_0(context, partialProofData, leaf_0);
    const bound_0 = { leaf: leaf_0, path: supplied_0.path };
    let tmp_1;
    __compactRuntime.assert((tmp_1 = this._merkleTreePathRoot_0(bound_0),
                             _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(4n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(2n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_1),
                                                                                                                                               alignment: _descriptor_7.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value)),
                            'No current mandate');
    __compactRuntime.assert(value_0 <= terms_0.capPerDraw,
                            "Over this mandate's cap per draw");
    __compactRuntime.assert(slot_0 < terms_0.drawsPerPeriod,
                            'No draws left this period');
    const nullifier_0 = this._drawNullifier_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                        partialProofData,
                                                                                                        [
                                                                                                         { dup: { n: 0 } },
                                                                                                         { idx: { cached: false,
                                                                                                                  pushPath: false,
                                                                                                                  path: [
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_2.toValue(1n),
                                                                                                                                    alignment: _descriptor_2.alignment() } },
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_2.toValue(1n),
                                                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                                                         { popeq: { cached: false,
                                                                                                                    result: undefined } }]).value),
                                              _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                        partialProofData,
                                                                                                        [
                                                                                                         { dup: { n: 0 } },
                                                                                                         { idx: { cached: false,
                                                                                                                  pushPath: false,
                                                                                                                  path: [
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_2.toValue(1n),
                                                                                                                                    alignment: _descriptor_2.alignment() } },
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_2.toValue(10n),
                                                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                                                         { popeq: { cached: false,
                                                                                                                    result: undefined } }]).value),
                                              sk_0,
                                              slot_0);
    __compactRuntime.assert(!_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(12n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'That draw slot is used this period');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(12n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    const tmp_2 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(13n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_8.toValue(tmp_2),
                                                                alignment: _descriptor_8.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 2 } }]);
    this._sendUnshielded_0(context,
                           partialProofData,
                           _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_2.toValue(2n),
                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                      { popeq: { cached: false,
                                                                                                 result: undefined } }]).value),
                           value_0,
                           this._right_0(payee_0));
    this._logEvent_0(context,
                     partialProofData,
                     4,
                     new Uint8Array([109, 111, 100, 100, 97, 98, 108, 101, 58, 99, 114, 101, 119, 51, 58, 116, 114, 101, 97, 115, 117, 114, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                     _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(2n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value),
                     value_0,
                     payee_0.bytes);
    return [];
  }
  _folder_0(f, x, a0) {
    for (let i = 0; i < 16; i++) { x = f(x, a0[i]); }
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
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
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
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_12(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_13(x0, y0) {
    if (x0 !== y0) { return false; }
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
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
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
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(key_0),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
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
        return _descriptor_19.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_10.toValue(key_0),
                                                                                                      alignment: _descriptor_10.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0].asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_10.fromValue(key.value),      _descriptor_19.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get eventCount() {
      return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_2.toValue(0n),
                                                                                                    alignment: _descriptor_2.alignment() } },
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_2.toValue(1n),
                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                         { popeq: { cached: true,
                                                                                    result: undefined } }]).value);
    },
    tokenMetadata: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(2n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
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
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
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
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
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
        const self_0 = state.asArray()[0].asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_4.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get organiser() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get crewId() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get treasuryColor() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(2n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get treasuryMinted() {
      return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(3n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    mandates: {
      isFull(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isFull: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(65536n),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
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
                                     'crew_treasury_v3.compact line 59 char 1',
                                     'struct MerkleTreeDigest<field: Field>',
                                     rt_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(rt_0),
                                                                                                                                 alignment: _descriptor_7.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      root(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`root: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[4];
        return ((result) => result             ? __compactRuntime.CompactTypeMerkleTreeDigest.fromValue(result)             : undefined)(self_0.asArray()[0].asBoundedMerkleTree().rehash().root()?.value);
      },
      firstFree(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`first_free: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[4];
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
                                     'crew_treasury_v3.compact line 59 char 1',
                                     'Field',
                                     index_0)
        }
        if (!(leaf_0.buffer instanceof ArrayBuffer && leaf_0.BYTES_PER_ELEMENT === 1 && leaf_0.length === 32)) {
          __compactRuntime.typeError('path_for_leaf',
                                     'argument 2',
                                     'crew_treasury_v3.compact line 59 char 1',
                                     'Bytes<32>',
                                     leaf_0)
        }
        const self_0 = state.asArray()[1].asArray()[4];
        return ((result) => result             ? new __compactRuntime.CompactTypeMerkleTreePath(16, _descriptor_0).fromValue(result)             : undefined)(  self_0.asArray()[0].asBoundedMerkleTree().rehash().pathForLeaf(    index_0,    {      value: _descriptor_0.toValue(leaf_0),      alignment: _descriptor_0.alignment()    }  )?.value);
      },
      findPathForLeaf(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`find_path_for_leaf: expected 1 argument, received ${args_0.length}`);
        }
        const leaf_0 = args_0[0];
        if (!(leaf_0.buffer instanceof ArrayBuffer && leaf_0.BYTES_PER_ELEMENT === 1 && leaf_0.length === 32)) {
          __compactRuntime.typeError('find_path_for_leaf',
                                     'argument 1',
                                     'crew_treasury_v3.compact line 59 char 1',
                                     'Bytes<32>',
                                     leaf_0)
        }
        const self_0 = state.asArray()[1].asArray()[4];
        return ((result) => result             ? new __compactRuntime.CompactTypeMerkleTreePath(16, _descriptor_0).fromValue(result)             : undefined)(  self_0.asArray()[0].asBoundedMerkleTree().rehash().findPathForLeaf(    {      value: _descriptor_0.toValue(leaf_0),      alignment: _descriptor_0.alignment()    }  )?.value);
      },
      history(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`history: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[4];
        return self_0.asArray()[2].asMap().keys().map(  (elem) => __compactRuntime.CompactTypeMerkleTreeDigest.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    get mandateCount() {
      return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_2.toValue(1n),
                                                                                                    alignment: _descriptor_2.alignment() } },
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_2.toValue(5n),
                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                         { popeq: { cached: true,
                                                                                    result: undefined } }]).value);
    },
    issued: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(6n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(6n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
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
                                     'crew_treasury_v3.compact line 64 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(6n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
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
        const self_0 = state.asArray()[1].asArray()[6];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    appointed: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(7n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(7n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
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
                                     'crew_treasury_v3.compact line 68 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(7n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
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
        const self_0 = state.asArray()[1].asArray()[7];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    mandateNfts: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(8n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(8n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
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
                                     'crew_treasury_v3.compact line 71 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(8n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
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
        const self_0 = state.asArray()[1].asArray()[8];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    get epoch() {
      return _descriptor_9.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(9n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get currentPeriod() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(10n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get paused() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(11n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    spentDraws: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(12n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(12n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
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
                                     'crew_treasury_v3.compact line 82 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(12n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
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
        const self_0 = state.asArray()[1].asArray()[12];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    get drawCount() {
      return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_2.toValue(1n),
                                                                                                    alignment: _descriptor_2.alignment() } },
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_2.toValue(13n),
                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                         { popeq: { cached: true,
                                                                                    result: undefined } }]).value);
    },
    blockedPayees: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(14n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                                                                                 alignment: _descriptor_10.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(14n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
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
                                     'crew_treasury_v3.compact line 87 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(14n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
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
        const self_0 = state.asArray()[1].asArray()[14];
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
  mandateTerms: (...args) => undefined,
  findMandatePath: (...args) => undefined
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
  organiserKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`organiserKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('organiserKey',
                                 'argument 1',
                                 'crew_treasury_v3.compact line 113 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._organiserKey_0(sk_0);
  },
  agentKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`agentKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    const cid_0 = args_0[1];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('agentKey',
                                 'argument 1',
                                 'crew_treasury_v3.compact line 119 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    if (!(cid_0.buffer instanceof ArrayBuffer && cid_0.BYTES_PER_ELEMENT === 1 && cid_0.length === 32)) {
      __compactRuntime.typeError('agentKey',
                                 'argument 2',
                                 'crew_treasury_v3.compact line 119 char 1',
                                 'Bytes<32>',
                                 cid_0)
    }
    return _dummyContract._agentKey_0(sk_0, cid_0);
  },
  mandateLeaf: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`mandateLeaf: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const cid_0 = args_0[0];
    const key_0 = args_0[1];
    const e_0 = args_0[2];
    const terms_0 = args_0[3];
    if (!(cid_0.buffer instanceof ArrayBuffer && cid_0.BYTES_PER_ELEMENT === 1 && cid_0.length === 32)) {
      __compactRuntime.typeError('mandateLeaf',
                                 'argument 1',
                                 'crew_treasury_v3.compact line 131 char 1',
                                 'Bytes<32>',
                                 cid_0)
    }
    if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
      __compactRuntime.typeError('mandateLeaf',
                                 'argument 2',
                                 'crew_treasury_v3.compact line 131 char 1',
                                 'Bytes<32>',
                                 key_0)
    }
    if (!(typeof(e_0) === 'bigint' && e_0 >= 0n && e_0 <= 4294967295n)) {
      __compactRuntime.typeError('mandateLeaf',
                                 'argument 3',
                                 'crew_treasury_v3.compact line 131 char 1',
                                 'Uint<0..4294967296>',
                                 e_0)
    }
    if (!(typeof(terms_0) === 'object' && typeof(terms_0.capPerDraw) === 'bigint' && terms_0.capPerDraw >= 0n && terms_0.capPerDraw <= 18446744073709551615n && typeof(terms_0.drawsPerPeriod) === 'bigint' && terms_0.drawsPerPeriod >= 0n && terms_0.drawsPerPeriod <= 255n && terms_0.salt.buffer instanceof ArrayBuffer && terms_0.salt.BYTES_PER_ELEMENT === 1 && terms_0.salt.length === 32)) {
      __compactRuntime.typeError('mandateLeaf',
                                 'argument 4',
                                 'crew_treasury_v3.compact line 131 char 1',
                                 'struct MandateTerms<capPerDraw: Uint<0..18446744073709551616>, drawsPerPeriod: Uint<0..256>, salt: Bytes<32>>',
                                 terms_0)
    }
    return _dummyContract._mandateLeaf_0(cid_0, key_0, e_0, terms_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
