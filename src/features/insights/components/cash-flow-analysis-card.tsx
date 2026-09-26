"use client";

import { Activity, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { CashFlowAnalysis } from "../types";

export interface CashFlowAnalysisCardProps {
  cashFlow: CashFlowAnalysis;
}

export function CashFlowAnalysisCard({ cashFlow }: CashFlowAnalysisCardProps) {
  const isPositive = cashFlow.netCashFlow > 0;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Cash Flow & Operating Yield
            </CardTitle>
          </div>
          <Badge variant={isPositive ? "growth" : "risk"} className="font-mono text-[10px]">
            {isPositive ? "+" : ""}
            {cashFlow.operatingMarginPercentage}% Margin
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 text-xs">
        {/* Inflow vs Outflow */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-growth/20 bg-growth/5 p-3">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] mb-1">
              <ArrowDownLeft className="h-3.5 w-3.5 text-growth" /> Total Inflows ({cashFlow.inflowCount})
            </span>
            <span className="text-lg font-bold text-growth font-mono">
              +{formatCurrency(cashFlow.totalInflow)}
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] mb-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" /> Total Outflows ({cashFlow.outflowCount})
            </span>
            <span className="text-lg font-bold text-foreground font-mono">
              -{formatCurrency(cashFlow.totalOutflow)}
            </span>
          </div>
        </div>

        {/* Net Cash Flow & Daily burn rate */}
        <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Net Cash Flow Generated</span>
            <span className="text-base font-extrabold text-growth font-mono">
              +{formatCurrency(cashFlow.netCashFlow)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60">
            <span className="text-muted-foreground">Daily Operating Burn Cadence</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(cashFlow.burnRatePerDay)} / day
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
