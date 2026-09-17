import { ContractState } from "@midnight-ntwrk/compact-runtime";
import { ledger } from "@contract";

/**
 * Read-only access to the deployed tournament pass contract.
 *
 * Everything here comes from Midnight's public indexer, needs no wallet, and
 * is visible to anyone. The raw state is decoded with the compiled contract's
 * own `ledger()` function, which is what turns the indexer's bytes into named
 * fields. Nothing private (secret keys, pass nonces) ever reaches this code.
 */

export const NETWORK = "preview";

export const CONTRACT_ADDRESS: string =
  import.meta.env.VITE_CONTRACT_ADDRESS ??
  "2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191";

export const INDEXER_URL: string =
  import.meta.env.VITE_INDEXER_URL ??
  "https://indexer.preview.midnight.network/api/v4/graphql";

/**
 * Three independent explorers, so a reader can check this page against sources
 * it does not control. URL formats confirmed by rendering each one on
 * 17 September 2026.
 */
export const EXPLORER = {
  contract: (address: string) =>
    `https://preview.midnightexplorer.com/contracts/${address}`,
  transaction: (hash: string) =>
    `https://preview.midnightexplorer.com/transactions/0x${hash}`,
  block: (height: number) =>
    `https://preview.midnightexplorer.com/blocks/${height}`,
};

export const SUBSCAN = {
  contract: (address: string) =>
    `https://midnight-preview.subscan.io/contract/${address}`,
  transaction: (hash: string) =>
    `https://midnight-preview.subscan.io/tx/0x${hash}`,
};

export const ONE_AM_EXPLORER = {
  contract: (address: string) =>
    `https://explorer.1am.xyz/contract/${address}?network=preview`,
  transaction: (hash: string) =>
    `https://explorer.1am.xyz/tx/${hash}?network=preview`,
};

const SNAPSHOT_QUERY = `
  query Tournament($address: HexEncoded!) {
    contract(address: $address) {
      state
      actions {
        __typename
        transaction { hash block { height timestamp } }
        ... on ContractCall { entryPoint }
      }
    }
  }
`;

export type ActionKind = "deploy" | "fundPool" | "issuePass" | "claimPrize";

export interface ContractActivity {
  kind: ActionKind | string;
  hash: string;
  blockHeight: number;
  timestamp: Date;
}

export interface TournamentSnapshot {
  address: string;
  tournamentId: string;
  organiser: string;
  prizePool: bigint;
  prizePerClaim: bigint;
  passCount: bigint;
  claimCount: bigint;
  merkleRoot: string;
  spentNullifiers: string[];
  stateBytes: number;
  activity: ContractActivity[];
  fetchedAt: Date;
}

interface GraphQlAction {
  __typename: "ContractDeploy" | "ContractCall" | "ContractUpdate";
  entryPoint?: string;
  transaction: { hash: string; block: { height: number; timestamp: number } };
}

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

const fromHex = (hex: string): Uint8Array => {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
};

export async function fetchTournament(
  address: string = CONTRACT_ADDRESS,
): Promise<TournamentSnapshot> {
  const response = await fetch(INDEXER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: SNAPSHOT_QUERY, variables: { address } }),
  });
  if (!response.ok) {
    throw new Error(`Indexer responded ${response.status}`);
  }
  const body = await response.json();
  if (body.errors?.length) {
    throw new Error(body.errors[0].message ?? "Indexer query failed");
  }
  const contract = body.data?.contract;
  if (!contract?.state) {
    throw new Error(`No contract found at ${address} on ${NETWORK}`);
  }

  const raw = fromHex(contract.state as string);
  const decoded = ledger(ContractState.deserialize(raw).data);

  const activity = (contract.actions as GraphQlAction[]).map((action) => ({
    kind:
      action.__typename === "ContractDeploy"
        ? "deploy"
        : (action.entryPoint ?? action.__typename),
    hash: action.transaction.hash,
    blockHeight: action.transaction.block.height,
    timestamp: new Date(action.transaction.block.timestamp),
  }));

  return {
    address,
    tournamentId: toHex(decoded.tournamentId),
    organiser: toHex(decoded.organiser),
    prizePool: decoded.prizePool,
    prizePerClaim: decoded.prizePerClaim,
    passCount: decoded.passCount,
    claimCount: decoded.claimCount,
    merkleRoot: String(decoded.passes.root().field),
    spentNullifiers: Array.from(decoded.spentPasses, toHex),
    stateBytes: raw.length,
    activity,
    fetchedAt: new Date(),
  };
}
