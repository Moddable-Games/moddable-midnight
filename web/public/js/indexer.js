// Live balances for any preview address, straight from Midnight's public indexer: no key, no
// account, and nothing of ours in the middle. A copy of the wallet page's watcher
// (wallet-ui/js/indexer.js) that also reports which NIGHT is generating DUST.
//
// There is no "balance of address" query. The indexer streams every transaction touching an
// address, `unshieldedTransactions(address, transactionId)`; replaying it from 0 and keeping
// the coins created minus the coins spent gives the current balance, and it stays live.
//
// DUST itself is not public per address: only the wallet can compute its DUST balance. What
// the indexer does show is whether each NIGHT coin is registered to generate DUST.

const WS_URL = "wss://indexer.preview.midnight.network/api/v4/graphql/ws";
export const NIGHT_TOKEN = "0".repeat(64);
export const MCC_TOKEN = "eed99c9a56f4f3d719ff295eab2fcd59713233c71d34437284347c992b54a366";

const SUBSCRIPTION = `subscription Balances($address: UnshieldedAddress!) {
  unshieldedTransactions(address: $address, transactionId: 0) {
    __typename
    ... on UnshieldedTransactionsProgress { highestTransactionId }
    ... on UnshieldedTransaction {
      createdUtxos { owner tokenType value intentHash outputIndex registeredForDustGeneration }
      spentUtxos { owner tokenType value intentHash outputIndex }
    }
  }
}`;

/**
 * Watches one address. onUpdate({ night, mcc, nightForDust, tokens, transactions, caughtUp })
 * fires as events arrive; amounts are BigInts in the token's smallest unit. Returns a stop
 * function.
 */
export function watchAddress(address, onUpdate, onError) {
  let coins = new Map(); // intentHash:outputIndex -> { tokenType, value, dust }
  let transactions = 0;
  let caughtUp = false;
  let socket;
  let closed = false;
  let retry;

  const emit = () => {
    const sum = (filter) => [...coins.values()].filter(filter).reduce((total, c) => total + c.value, 0n);
    onUpdate({
      night: sum((c) => c.tokenType === NIGHT_TOKEN),
      nightForDust: sum((c) => c.tokenType === NIGHT_TOKEN && c.dust),
      mcc: sum((c) => c.tokenType === MCC_TOKEN),
      transactions,
      caughtUp,
    });
  };

  const open = () => {
    if (closed) return;
    socket = new WebSocket(WS_URL, "graphql-transport-ws");
    socket.onopen = () => socket.send(JSON.stringify({ type: "connection_init" }));

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "connection_ack") {
        socket.send(JSON.stringify({
          id: "balances",
          type: "subscribe",
          payload: { query: SUBSCRIPTION, variables: { address } },
        }));
        return;
      }
      if (message.type === "next") {
        const payload = message.payload?.data?.unshieldedTransactions;
        if (!payload) return;
        if (payload.__typename === "UnshieldedTransactionsProgress") {
          caughtUp = true; // the stream has reached the chain tip; from here it is live
          emit();
          return;
        }
        transactions += 1;
        for (const u of payload.createdUtxos ?? []) {
          if (u.owner !== address) continue;
          coins.set(`${u.intentHash}:${u.outputIndex}`, {
            tokenType: u.tokenType, value: BigInt(u.value), dust: Boolean(u.registeredForDustGeneration),
          });
        }
        for (const u of payload.spentUtxos ?? []) {
          if (u.owner === address) coins.delete(`${u.intentHash}:${u.outputIndex}`);
        }
        emit();
        return;
      }
      if (message.type === "error") onError?.(new Error(JSON.stringify(message.payload).slice(0, 200)));
    };

    socket.onerror = () => onError?.(new Error("indexer unreachable"));
    socket.onclose = () => {
      if (closed) return;
      // The indexer drops idle sockets; replay from the start and carry on.
      retry = setTimeout(() => { coins = new Map(); transactions = 0; caughtUp = false; open(); }, 5000);
    };
  };

  open();
  return () => { closed = true; clearTimeout(retry); socket?.close(); };
}
