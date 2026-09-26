"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currency";
import { SpendingTrendPoint } from "../types";

export interface SpendingTrendsCardProps {
  trends: SpendingTrendPoint[];
}

export function SpendingTrendsCard({ trends }: SpendingTrendsCardProps) {
  const maxSpend = Math.max(...trends.map((t) => t.totalSpend), 14000);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Spending Trajectory (Operating vs Discretionary)
            </CardTitle>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" /> Operating
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-intelligence" /> Discretionary
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 text-xs">
        {/* Trajectory Bar Visualizer */}
        <div className="space-y-3 pt-2">
          {trends.map((pt) => {
            const opPct = (pt.operatingSpend / maxSpend) * 100;
            const discPct = (pt.discretionarySpend / maxSpend) * 100;

            return (
              <div key={pt.date} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-muted-foreground">{pt.date}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-foreground font-bold">
                      {formatCurrency(pt.totalSpend)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      (Op: {formatCurrency(pt.operatingSpend)})
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden flex">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${opPct}%` }}
                    title={`Operating: ${formatCurrency(pt.operatingSpend)}`}
                  />
                  <div
                    className="h-full bg-intelligence transition-all duration-300"
                    style={{ width: `${discPct}%` }}
                    title={`Discretionary: ${formatCurrency(pt.discretionarySpend)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/20 p-2.5 text-[11px] text-muted-foreground">
          Operating disbursements remain 96.8% aligned with approved enterprise vendor contracts.
        </div>
      </CardContent>
    </Card>
  );
}
