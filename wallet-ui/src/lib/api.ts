// The wallet daemon's API (wallet-daemon/server.mjs). It listens on 127.0.0.1:9900 and answers
// only this page's origin, so everything here is local.

export const DAEMON = "http://127.0.0.1:9900";
export const NIGHT = "0".repeat(64);

export type Wallet = {
  wallet: string;
  name: string;
  kind: "human" | "agent";
  role: string;
  agentId: string | null;
  operator: boolean;
  archived: boolean;
  address: string | null;
  shieldedAddress: string | null;
  status: "queued" | "opening" | "syncing" | "ready" | "error";
  error: string | null;
  night: string | null;
  unshielded: Record<string, string> | null;
  shielded: Record<string, string> | null;
  dust: string | null;
  dustRegistered: boolean | null;
  unregisteredNight: number | null;
  sync: { unshielded: boolean; shielded: boolean; dust: boolean; all: boolean } | null;
  shieldedProgress: { applied: number; target: number } | null;
};

export type RequestStatus =
  | "pending" | "approved" | "building" | "balancing" | "signing" | "proving" | "submitting" | "submitted"
  | "confirmed" | "failed" | "rejected" | "refused";

export type WalletRequest = {
  id: string;
  wallet: string;
  kind: "transfer" | "deploy" | "call" | "dust-register";
  to: string | null;
  amount: string | null;
  token: string | null;
  shielded: boolean;
  contract: string | null;
  contractAddress: string | null;
  circuit: string | null;
  requestedBy: string;
  note: string;
  status: RequestStatus;
  policy?: string;
  autoApproved?: boolean;
  txId?: string;
  txHash?: string;
  block?: number;
  chainStatus?: string;
  error?: string;
  createdAt: string;
  decidedAt?: string;
  completedAt?: string;
};

export type Standard = "native_unshielded" | "native_shielded" | "contract_token" | "private_ledger";

export type StandardInfo = { kind: 0 | 1 | 2 | 3; mip: string; label: string; privacy: "shielded" | "unshielded"; storage: "native" | "contract" };

export type TokenInfo = {
  domain: string;
  label: string;
  nft: boolean;
  color: string;
  minted: string;
  burned: string;
  inNativeForm: string;
  supply: string;
};

export type ContractEvent = { index: number; type: string; domain: string; tokenType: string; amount: string; subject: string };
export type MetadataEntry = { domain: string; kind: number; key: string; type: string; value: string | null };

export type Deployment = {
  address: string;
  standard: Standard;
  kind: 0 | 1 | 2 | 3;
  mip: string;
  label: string;
  privacy: "shielded" | "unshielded";
  storage: "native" | "contract";
  name: string;
  symbol: string;
  decimals: number;
  deployedBlock: number | null;
  deployTx: string | null;
  tokens: TokenInfo[];
  events: ContractEvent[];
  metadata: MetadataEntry[];
  error?: string;
};

export type Holdings = Record<string, { unshielded: Record<string, string>; shielded: Record<string, string>; contract: Record<string, string> }>;

export type AgentPolicy = {
  spendCaps: { perTransferNight: string; dailyNight: string };
  whitelistedContracts: string[];
  blockedAddresses: string[];
  autoDraw: boolean;
  paused: boolean;
};

export type Session = {
  id: string;
  wallet: string;
  label: string;
  createdAt: string;
  expiresAt: string;
  maxRequests: number;
  maxNight: string;
  used: { requests: number; night: string };
  revokedAt: string | null;
  status: "active" | "expired" | "revoked";
};

export type Policy = {
  crewTreasury: string;
  crewTreasuryV3: string | null;
  blockedAddresses: { address: string; note: string }[];
  agents: Record<string, AgentPolicy>;
  sessions: Session[];
};

export type TreasuryV3 = {
  address: string | null;
  treasuryColor?: string;
  minted?: string;
  mandates?: string;
  draws?: string;
  epoch?: number;
  paused?: boolean;
  period?: string;
  blocked?: string[];
  terms?: Record<string, { capPerDraw: string; drawsPerPeriod: string; epoch: number }>;
};

export type ChatMessage = { id: string; from: "operator" | "assistant"; text: string; requests: string[]; status: "working" | "done" | null; at: string };
export type Chat = { messages: ChatMessage[]; assistant: { online: boolean; lastSeen: string | null } };

export type Prices = { night: { usd: number; change24h: number | null; source: string; at: string | null }; tokens: Record<string, string>; simulated: true };

export type Settings = { currency: string; livePrices: boolean; tokenPrices: Record<string, string>; nightFallbackUsd: string; approvalSound: boolean };

export type LegacyMetadata = { contract: string; tokens: Record<string, {
  name: string; ticker: string; description: string; shielded: boolean; document: string; image: string; imageData: string | null; verified: boolean;
}> };

// ---------------------------------------------------------------------------

async function get<T>(path: string): Promise<T> {
  const res = await fetch(DAEMON + path);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(DAEMON + path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out.error ?? `HTTP ${res.status}`);
  return out as T;
}

export const api = {
  wallets: () => get<Wallet[]>("/api/wallets"),
  requests: () => get<WalletRequest[]>("/api/requests"),
  tokens: (fresh = false) => get<{ standards: Record<Standard, StandardInfo>; deployments: Deployment[] }>(`/api/tokens${fresh ? "?fresh" : ""}`),
  holdings: () => get<Holdings>("/api/holdings"),
  policy: () => get<Policy>("/api/policy"),
  treasuryV3: () => get<TreasuryV3>("/api/treasury-v3"),
  prices: () => get<Prices>("/api/prices"),
  settings: () => get<Settings>("/api/settings"),
  legacyMetadata: () => get<LegacyMetadata>("/api/metadata"),
  chat: () => get<Chat>("/api/chat"),
  say: (text: string) => post("/api/chat", { text }),
  createAccount: (body: { name: string; purpose: string }) => post<Wallet>("/api/accounts", body),

  approve: (id: string) => post<WalletRequest>(`/api/requests/${id}/approve`),
  reject: (id: string) => post<WalletRequest>(`/api/requests/${id}/reject`),
  send: (body: { wallet: string; kind: "transfer"; to: string; amount: string; token?: string; note?: string }) =>
    post<WalletRequest>("/api/requests", body),
  tokenAction: (body: Record<string, unknown>) => post<WalletRequest>("/api/token-actions", body),
  treasuryAction: (body: Record<string, unknown>) => post<WalletRequest>("/api/treasury-v3", body),
  createAgent: (body: { name: string; role: string }) => post<Wallet>("/api/agents", body),
  agentStep: <T = WalletRequest>(wallet: string, step: "fund" | "dust" | "appoint" | "policy" | "sessions" | "pause" | "revoke" | "remove", body: Record<string, unknown>) =>
    post<T>(`/api/agents/${wallet}/${step}`, body),
  revokeSession: (id: string) => post<Session>(`/api/sessions/${id}/revoke`),
  setBlocked: (blocked: { address: string; note: string }[]) => post("/api/policy/blocked", { blocked }),
  saveSettings: (body: Partial<Settings>) => post<Settings>("/api/settings", body),
};

/** An NFT image: the daemon's local copy of an IPFS file, with a public gateway as fallback. */
export const mediaUrl = (uri: string) => {
  const cid = uri.replace(/^ipfs:\/\//, "");
  return { local: `${DAEMON}/api/media/${cid}`, gateway: `https://ipfs.io/ipfs/${cid}`, cid };
};

