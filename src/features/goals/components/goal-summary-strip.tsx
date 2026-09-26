"use client";

import { Target, CheckCircle2, TrendingUp, Vault } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { FinancialGoal } from "../types";

export interface GoalSummaryStripProps {
  goals: FinancialGoal[];
}

export function GoalSummaryStrip({ goals }: GoalSummaryStripProps) {
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalActual = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalMonthlyCommitment = goals.reduce(
    (acc, g) => acc + g.monthlyContribution,
    0
  );
  const completedCount = goals.filter((g) => g.isCompleted).length;
  const overallActualPercentage =
    totalTarget > 0 ? Math.round((totalActual / totalTarget) * 1000) / 10 : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Target */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">Total Capital Targets</span>
          <Target className="h-4 w-4 text-primary" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
          {formatCurrency(totalTarget)}
        </div>
        <div className="text-[11px] text-muted-foreground">
          Across {goals.length} tracked strategic goals
        </div>
      </div>

      {/* Actual Progress Funded */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">Actual Capital Funded</span>
          <Vault className="h-4 w-4 text-growth" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-growth font-mono">
          {formatCurrency(totalActual)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <strong className="text-growth font-mono font-bold">
            {overallActualPercentage}%
          </strong>
          <span>actual realized funding</span>
        </div>
      </div>

      {/* Monthly Capital Allocation */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">Monthly Allocation</span>
          <TrendingUp className="h-4 w-4 text-intelligence" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
          {formatCurrency(totalMonthlyCommitment)}
          <span className="text-xs text-muted-foreground font-normal"> / mo</span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          Active automated & planned transfers
        </div>
      </div>

      {/* Completed Goals */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">Milestones Achieved</span>
          <CheckCircle2 className="h-4 w-4 text-growth" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
          {completedCount} <span className="text-sm text-muted-foreground font-normal">/ {goals.length}</span>
        </div>
        <div className="text-[11px] text-muted-foreground">
          {goals.length - completedCount} active capital horizons
        </div>
      </div>
    </div>
  );
}
