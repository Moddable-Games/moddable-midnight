// A client for the wallet CLI's DApp Connector server (`midnight serve`), which speaks
// JSON-RPC over a WebSocket on localhost:9932.
//
// This is the piece that makes a browser wallet possible on Firefox, where no Midnight
// wallet extension exists (friction log findings 35 and 36). The keys stay in the CLI
// wallet; this only asks it for state and for signatures, and every write prompts the
// person running the server for approval.
//
// The same client runs in Node, so the deploy tooling can use the wallet the CLI has
// already synced instead of the CLI's own deploy path, which times out (finding 40).

export type ConnectorMethod =
  // reads, auto-approved by the server
  | "getConnectionStatus"
  | "getConfiguration"
  | "getUnshieldedAddress"
  | "getShieldedAddresses"
  | "getDustAddress"
  | "getUnshieldedBalances"
  | "getShieldedBalances"
  | "getDustBalance"
  | "getTxHistory"
  // writes, which prompt for approval in the server's terminal
  | "connect"
  | "balanceSealedTransaction"
  | "balanceUnsealedTransaction"
  | "signData"
  | "submitTransaction";

export interface ConnectorOptions {
  url?: string;
  networkId?: string;
  requestTimeoutMs?: number;
}

export class ConnectorError extends Error {
  constructor(message: string, readonly code?: number, readonly data?: unknown) {
    super(message);
    this.name = "ConnectorError";
  }
}

/** One JSON-RPC connection to the wallet server. */
export class WalletConnector {
  private socket?: WebSocket;
  private nextId = 0;
  private readonly pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }>();

  constructor(private readonly options: ConnectorOptions = {}) {}

  private get url() { return this.options.url ?? "ws://localhost:9932"; }
  private get timeoutMs() { return this.options.requestTimeoutMs ?? 120_000; }

  /** Opens the socket and performs the network handshake. */
  async open(): Promise<{ networkId: string }> {
    await new Promise<void>((resolve, reject) => {
      const socket = new WebSocket(this.url);
      this.socket = socket;
      socket.onopen = () => resolve();
      socket.onerror = () => reject(new ConnectorError(
        `Cannot reach the wallet server at ${this.url}. Start it with: midnight serve --wallet <name> --network preview`,
      ));
      socket.onclose = () => this.failAll(new ConnectorError("Wallet server connection closed"));
      socket.onmessage = (event) => this.receive(String(event.data));
    });
    // The server rejects a connect without a matching network, so this doubles as a check.
    const networkId = this.options.networkId ?? "preview";
    const result = await this.call("connect", { networkId }) as { networkId: string };
    return result;
  }

  close() {
    this.socket?.close();
    this.socket = undefined;
  }

  async call(method: ConnectorMethod, params?: unknown): Promise<unknown> {
    const socket = this.socket;
    if (!socket || socket.readyState !== 1) throw new ConnectorError("Not connected to the wallet server");
    const id = ++this.nextId;
    const message = JSON.stringify({ jsonrpc: "2.0", id, method, params });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new ConnectorError(`${method} timed out after ${this.timeoutMs}ms (a write may be waiting for approval in the wallet server's terminal)`));
      }, this.timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      socket.send(message);
    });
  }

  private receive(raw: string) {
    let message: { id?: number; result?: unknown; error?: { code: number; message: string; data?: unknown } };
    try { message = JSON.parse(raw); } catch { return; }
    if (typeof message.id !== "number") return; // server notification
    const entry = this.pending.get(message.id);
    if (!entry) return;
    this.pending.delete(message.id);
    clearTimeout(entry.timer);
    if (message.error) entry.reject(new ConnectorError(message.error.message, message.error.code, message.error.data));
    else entry.resolve(message.result);
  }

  private failAll(error: Error) {
    for (const [id, entry] of this.pending) {
      clearTimeout(entry.timer);
      entry.reject(error);
      this.pending.delete(id);
    }
  }
}

/** Everything the wallet panel shows, in one round trip set. */
export interface WalletSnapshot {
  networkId: string;
  unshieldedAddress: string;
  shieldedAddress: string;
  balances: Record<string, string>;
  dust: { balance: string; cap: string };
  configuration: Record<string, string>;
}

export async function readWallet(connector: WalletConnector): Promise<WalletSnapshot> {
  const [status, configuration, unshielded, shielded, balances, dust] = await Promise.all([
    connector.call("getConnectionStatus") as Promise<{ networkId: string }>,
    connector.call("getConfiguration") as Promise<Record<string, string>>,
    connector.call("getUnshieldedAddress") as Promise<{ unshieldedAddress: string }>,
    connector.call("getShieldedAddresses") as Promise<{ shieldedAddress: string }>,
    connector.call("getUnshieldedBalances") as Promise<Record<string, string>>,
    connector.call("getDustBalance") as Promise<{ balance: string; cap: string }>,
  ]);
  return {
    networkId: status.networkId,
    unshieldedAddress: unshielded.unshieldedAddress,
    shieldedAddress: shielded.shieldedAddress,
    balances,
    dust,
    configuration,
  };
}

/** NIGHT is the all-zero token type; balances come back as raw STAR strings. */
export const NIGHT_TOKEN_TYPE = "0".repeat(64);

export function formatNight(raw: string | undefined): string {
  if (!raw) return "0";
  const star = BigInt(raw);
  const whole = star / 1_000_000n;
  const fraction = (star % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : `${whole}`;
}
