// Live balances straight from the public Midnight indexer: no key, no account, nothing of
// ours in the middle, so nothing can go stale.
//
// There is no "balance of address" query. The balance comes from the per-address event
// stream, `unshieldedTransactions(address, transactionId)`, folded created minus spent.
// Replaying from transactionId 0 gives the current balance and then keeps it live.

const WS_URL = "wss://indexer.preview.midnight.network/api/v4/graphql/ws";
export const NIGHT_TOKEN = "0".repeat(64);

const SUBSCRIPTION = `subscription Balances($address: UnshieldedAddress!) {
  unshieldedTransactions(address: $address, transactionId: 0) {
    __typename
    ... on UnshieldedTransactionsProgress { highestTransactionId }
    ... on UnshieldedTransaction {
      transaction { hash id }
      createdUtxos { value owner tokenType }
      spentUtxos { value owner tokenType }
    }
  }
}`;

/**
 * Watches one address. onUpdate({ night, transactions, caughtUp }) fires as events arrive.
 * Returns a stop function.
 */
export function watchAddress(address, onUpdate, onError) {
  let created = 0n;
  let spent = 0n;
  let tokens = new Map(); // token type -> balance, for everything that is not NIGHT
  let transactions = 0;
  let caughtUp = false;
  let socket;
  let closed = false;
  let retry;

  const emit = () => onUpdate({
    night: (created - spent).toString(),
    tokens: [...tokens].filter(([, v]) => v !== 0n).map(([type, v]) => ({ type, amount: v.toString() })),
    transactions,
    caughtUp,
  });

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
          // The indexer reports where the stream has reached; past it we are live.
          caughtUp = true;
          emit();
          return;
        }
        transactions += 1;
        for (const utxo of payload.createdUtxos ?? []) {
          if (utxo.owner !== address) continue;
          if (utxo.tokenType === NIGHT_TOKEN) created += BigInt(utxo.value);
          else tokens.set(utxo.tokenType, (tokens.get(utxo.tokenType) ?? 0n) + BigInt(utxo.value));
        }
        for (const utxo of payload.spentUtxos ?? []) {
          if (utxo.owner !== address) continue;
          if (utxo.tokenType === NIGHT_TOKEN) spent += BigInt(utxo.value);
          else tokens.set(utxo.tokenType, (tokens.get(utxo.tokenType) ?? 0n) - BigInt(utxo.value));
        }
        emit();
        return;
      }
      if (message.type === "error") {
        onError?.(new Error(JSON.stringify(message.payload).slice(0, 200)));
      }
    };

    socket.onerror = () => onError?.(new Error("indexer unreachable"));
    socket.onclose = () => {
      if (closed) return;
      // The stream ends when the indexer drops idle sockets; pick up where we left off.
      retry = setTimeout(() => { created = 0n; spent = 0n; tokens = new Map(); transactions = 0; open(); }, 5000);
    };
  };

  open();
  return () => { closed = true; clearTimeout(retry); socket?.close(); };
}
