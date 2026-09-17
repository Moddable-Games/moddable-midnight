export const shortHex = (hex: string, head = 8, tail = 6): string =>
  hex.length <= head + tail ? hex : `${hex.slice(0, head)}…${hex.slice(-tail)}`;

export const formatTime = (date: Date): string =>
  date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const ACTION_LABELS: Record<string, string> = {
  deploy: "Contract deployed",
  fundPool: "Prize pool funded",
  issuePass: "Entry pass issued",
  claimPrize: "Prize claimed privately",
};
