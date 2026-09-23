import { useCallback, useEffect, useState } from "react";
import { type CrewSnapshot, fetchCrewTreasury } from "@/lib/crew-treasury";

const REFRESH_MS = 30_000;

/** Poll the public indexer, and re-verify the metadata, for the crew treasury. */
export function useCrewTreasury() {
  const [snapshot, setSnapshot] = useState<CrewSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setSnapshot(await fetchCrewTreasury());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  return { snapshot, error, loading, refresh };
}
