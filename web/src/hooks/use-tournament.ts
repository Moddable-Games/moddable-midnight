import { useCallback, useEffect, useState } from "react";
import { fetchTournament, type TournamentSnapshot } from "@/lib/tournament";

const REFRESH_MS = 15_000;

/** Poll the public indexer for the contract's state and activity. */
export function useTournament() {
  const [snapshot, setSnapshot] = useState<TournamentSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setSnapshot(await fetchTournament());
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
