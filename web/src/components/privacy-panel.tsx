import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TournamentSnapshot } from "@/lib/tournament";
import { shortHex } from "@/lib/format";

/**
 * Side by side: what this page can read from the chain, and what never leaves
 * a player's device. The right-hand column is described, not fetched, because
 * there is nothing public to fetch.
 */
export function PrivacyPanel({ snapshot }: { snapshot: TournamentSnapshot }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Eye className="size-4" /> On the public ledger
          </CardTitle>
          <CardDescription>
            Read live from the indexer by this page. Anyone can see it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Field label="Pass commitments (Merkle root)">
            {shortHex(snapshot.merkleRoot, 12, 10)}
          </Field>
          <Field label={`Spent nullifiers (${snapshot.spentNullifiers.length})`}>
            {snapshot.spentNullifiers.length === 0
              ? "None yet"
              : snapshot.spentNullifiers.map((n) => (
                  <span key={n} className="block">
                    {shortHex(n, 16, 12)}
                  </span>
                ))}
          </Field>
          <Field label="Organiser (hash of a secret key)">
            {shortHex(snapshot.organiser, 16, 12)}
          </Field>
          <Field label="Counters" muted>
            {plural(snapshot.passCount, "pass", "passes")},{" "}
            {plural(snapshot.claimCount, "claim", "claims")}, pool of{" "}
            {snapshot.prizePool.toString()}
          </Field>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <EyeOff className="size-4" /> Only on the player's device
          </CardTitle>
          <CardDescription>
            Used to build zero-knowledge proofs locally. Never sent to the chain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Field label="Secret key" muted>
            32 random bytes. Derives both the pass commitment and the nullifier.
          </Field>
          <Field label="Pass nonce" muted>
            Blinds the commitment, so two passes for one player look unrelated.
          </Field>
          <Field label="Which pass was claimed" muted>
            The claim proves membership of the Merkle tree without naming a leaf.
          </Field>
          <Field label="Who claimed" muted>
            The contract call carries no address or public key. Fee payment was not analysed.
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

const plural = (n: bigint, one: string, many: string): string =>
  `${n.toString()} ${n === 1n ? one : many}`;

function Field({
  label,
  muted = false,
  children,
}: {
  label: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className={muted ? "mt-1" : "mt-1 font-mono break-all"}>{children}</p>
    </div>
  );
}
