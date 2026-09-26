"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MoreVertical,
  PlusCircle,
  Pencil,
  Trash2,
  History,
  Target,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { FinancialGoal } from "../types";

export interface GoalCardProps {
  goal: FinancialGoal;
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (goalId: string) => void;
  onContribute: (goal: FinancialGoal) => void;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onContribute,
}: GoalCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { projection } = goal;
  const actualPct = Math.min(100, projection.actualProgressPercentage);
  const projPct = Math.min(100, projection.projectedProgressPercentage);

  const getStatusBadge = () => {
    switch (projection.status) {
      case "ahead_of_schedule":
        return <Badge variant="growth" className="text-[10px]">Ahead of Schedule</Badge>;
      case "on_track":
        return <Badge variant="secondary" className="text-[10px] text-primary border-primary/20">On Track</Badge>;
      case "behind_schedule":
        return <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">Behind Schedule</Badge>;
      case "at_risk":
        return <Badge variant="risk" className="text-[10px]">At Risk</Badge>;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "reserve_fund":
        return "Treasury Reserve";
      case "capex":
        return "Capital Expenditure";
      case "tax_provision":
        return "Tax Escrow";
      case "debt_paydown":
        return "Debt Amortization";
      case "runway_expansion":
        return "Runway Extension";
      default:
        return cat;
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4">
      {/* Header & Meta */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider">
              {getCategoryLabel(goal.category)}
            </Badge>
            {getStatusBadge()}
            {goal.priority === "critical" && (
              <Badge variant="risk" className="text-[10px]">Critical</Badge>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {goal.title}
          </h3>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Goal options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {showMenu && (
            <div
              className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 text-xs"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(goal);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-foreground hover:bg-accent"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Goal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onContribute(goal);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-foreground hover:bg-accent"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Funds</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(goal.id);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Target & Contribution Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-border/60 text-xs">
        <div>
          <span className="text-[11px] text-muted-foreground block">Target Amount</span>
          <span className="text-base font-extrabold text-foreground font-mono">
            {formatCurrency(goal.targetAmount, { currency: goal.currency })}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Monthly Contribution</span>
          <span className="text-base font-extrabold text-foreground font-mono">
            {formatCurrency(goal.monthlyContribution, { currency: goal.currency })}
            <span className="text-[10px] text-muted-foreground font-normal"> / mo</span>
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[11px] text-muted-foreground block">Target Horizon</span>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{formatDate(goal.targetDate)}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            ({projection.monthsRemainingToTarget} mo remaining)
          </span>
        </div>
      </div>

      {/* DUAL-TRACK PROGRESS: CLEAR SEPARATION OF ACTUAL VS PROJECTED PROGRESS */}
      <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Target className="h-3.5 w-3.5 text-primary" />
            <span>Actual Progress vs Projected Progress</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            Target: 100%
          </span>
        </div>

        {/* Dual Track Bar Visualizer */}
        <div className="space-y-1.5">
          {/* Track 1: Actual Progress (Solid) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-growth inline-block" />
                Actual Progress (Funded)
              </span>
              <span className="font-mono font-bold text-growth">
                {formatCurrency(goal.currentAmount, { currency: goal.currency })} ({actualPct}%)
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-growth transition-all duration-500"
                style={{ width: `${actualPct}%` }}
              />
            </div>
          </div>

          {/* Track 2: Projected Progress (Striped / Accent) */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary inline-block" />
                Projected Progress (Paced at {formatCurrency(goal.monthlyContribution)}/mo)
              </span>
              <span className="font-mono font-bold text-primary">
                {projPct}% by target date
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted/80 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-primary/70 transition-all duration-500"
                style={{ width: `${projPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Projection Narrative Callout */}
        <div className="flex items-start gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border/50">
          <Clock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="text-foreground">Projection status: </strong>
            {projection.statusMessage} Estimated milestone completion:{" "}
            <span className="font-mono text-foreground font-semibold">
              {formatDate(projection.projectedCompletionDate)}
            </span>.
          </div>
        </div>
      </div>

      {/* Footer Controls: Contribute + Toggle Contribution History */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium"
        >
          <History className="h-3.5 w-3.5" />
          <span>{goal.contributions.length} Contributions</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(goal)}
            className="h-8 text-xs"
          >
            Edit
          </Button>
          <Button
            size="sm"
            onClick={() => onContribute(goal)}
            className="h-8 gap-1.5 text-xs bg-growth hover:bg-growth/90 text-growth-foreground"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Contribute</span>
          </Button>
        </div>
      </div>

      {/* Expandable Contribution History Drawer / Accordion */}
      {showHistory && (
        <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2 text-xs animate-in fade-in-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Contribution History</span>
            <span>Allocation</span>
          </div>
          {goal.contributions.length === 0 ? (
            <p className="text-[11px] text-muted-foreground py-2 text-center">
              No historical contributions recorded yet.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {goal.contributions.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-1 border-b border-border/40 last:border-none text-[11px]"
                >
                  <div>
                    <span className="font-medium text-foreground block">
                      {c.note || "Capital Contribution"}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {formatDate(c.date)} • {c.sourceAccount || "Treasury"}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-growth">
                    +{formatCurrency(c.amount, { currency: goal.currency })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
