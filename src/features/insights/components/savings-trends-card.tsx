"use client";

import { Vault } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { SavingsTrendPoint } from "../types";

export interface SavingsTrendsCardProps {
  savingsTrends: SavingsTrendPoint[];
}

export function SavingsTrendsCard({ savingsTrends }: SavingsTrendsCardProps) {
  const currentSavings = savingsTrends[savingsTrends.length - 1];

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vault className="h-4 w-4 text-growth" />
            <CardTitle className="text-sm font-bold text-foreground">
              Savings Velocity & Reserve Accumulation
            </CardTitle>
          </div>
          {currentSavings && (
            <Badge variant="growth" className="font-mono text-[10px]">
              {currentSavings.savingsRatePercentage}% Savings Rate
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-growth/20 bg-growth/5 p-3">
            <span className="text-muted-foreground block text-[11px] mb-1">
              Monthly Retained Capital
            </span>
            <span className="text-lg font-bold text-growth font-mono">
              {currentSavings ? formatCurrency(currentSavings.savingsAmount) : "$0.00"}
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
            <span className="text-muted-foreground block text-[11px] mb-1">
              Cumulative Reserve Base
            </span>
            <span className="text-lg font-bold text-foreground font-mono">
              {currentSavings ? formatCurrency(currentSavings.cumulativeReserve) : "$0.00"}
            </span>
          </div>
        </div>

        {/* 5-Month Trajectory Pills */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Trailing 5-Month Reserve Velocity
          </span>
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {savingsTrends.map((pt) => (
              <div
                key={pt.date}
                className="rounded-lg border border-border/80 bg-muted/30 p-2 text-[11px]"
              >
                <span className="text-muted-foreground block text-[10px] truncate">{pt.date.split(" ")[0]}</span>
                <span className="font-bold text-growth font-mono block mt-0.5">
                  +{pt.savingsRatePercentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
