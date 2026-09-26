"use client";

import { ArrowDownRight, ArrowUpRight, Calendar, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { PeriodComparison } from "../types";

export interface PeriodComparisonBannerProps {
  comparison: PeriodComparison;
}

export function PeriodComparisonBanner({ comparison }: PeriodComparisonBannerProps) {
  const isSpendingReduced = comparison.percentageChange < 0;

  return (
    <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <GitCompare className="h-3.5 w-3.5 text-primary" /> Period-Over-Period Variance
            </span>
            <Badge
              variant={isSpendingReduced ? "growth" : "risk"}
              className="font-mono text-[10px]"
            >
              {isSpendingReduced ? (
                <ArrowDownRight className="h-3 w-3 mr-0.5 inline" />
              ) : (
                <ArrowUpRight className="h-3 w-3 mr-0.5 inline" />
              )}
              {Math.abs(comparison.percentageChange)}% vs Prior Period
            </Badge>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            {isSpendingReduced ? "Expenditure Reduced" : "Expenditure Accelerated"} by{" "}
            {formatCurrency(Math.abs(comparison.absoluteChange))}
          </h2>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {comparison.currentPeriodLabel}
            </span>
            <span>vs</span>
            <span>{comparison.previousPeriodLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-xl border border-border/60">
          <div>
            <span className="text-[10px] text-muted-foreground block">Current 30d</span>
            <span className="text-base font-bold text-foreground font-mono">
              {formatCurrency(comparison.currentTotal)}
            </span>
          </div>
          <div className="h-8 w-px bg-border/80" />
          <div>
            <span className="text-[10px] text-muted-foreground block">Prior 30d</span>
            <span className="text-base font-bold text-muted-foreground font-mono">
              {formatCurrency(comparison.previousTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
