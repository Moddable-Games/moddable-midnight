import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXPLORER, type ContractActivity } from "@/lib/tournament";
import { ACTION_LABELS, formatTime, shortHex } from "@/lib/format";

export function ActivityFeed({ activity }: { activity: ContractActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl">Contract activity</CardTitle>
        <CardDescription>
          Every transaction that touched this contract, newest first.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
              <th className="py-2 pr-4 font-medium">Action</th>
              <th className="py-2 pr-4 font-medium">Circuit</th>
              <th className="py-2 pr-4 font-medium">Block</th>
              <th className="py-2 pr-4 font-medium">Time</th>
              <th className="py-2 font-medium">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item) => (
              <tr key={item.hash} className="border-b last:border-0">
                <td className="py-3 pr-4 whitespace-nowrap">
                  {ACTION_LABELS[item.kind] ?? item.kind}
                </td>
                <td className="py-3 pr-4">
                  <Badge variant="secondary" className="font-mono">
                    {item.kind}
                  </Badge>
                </td>
                <td className="py-3 pr-4 font-mono tabular-nums">
                  {item.blockHeight.toLocaleString()}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                  {formatTime(item.timestamp)}
                </td>
                <td className="py-3">
                  <a
                    href={EXPLORER.transaction(item.hash)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 font-mono text-primary underline-offset-4 hover:underline"
                  >
                    {shortHex(item.hash)}
                    <ExternalLink className="size-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
