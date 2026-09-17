import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
}

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <Card>
      <CardContent className="space-y-1 p-5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="font-display text-4xl font-semibold tabular-nums">{value}</p>
        {detail && <div className="text-sm text-muted-foreground">{detail}</div>}
      </CardContent>
    </Card>
  );
}
