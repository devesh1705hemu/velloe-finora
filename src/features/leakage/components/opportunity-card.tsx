"use client";

import {
  HelpCircle,
  FileText,
  CheckCircle2,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";
import { PotentialOpportunity } from "../types";
import { ExplainabilityMetadata } from "@/features/insights/types";

export interface OpportunityCardProps {
  opportunity: PotentialOpportunity;
  onViewSupportingTransactions: (opp: PotentialOpportunity) => void;
  onOpenExplainability: (meta: ExplainabilityMetadata) => void;
  onOptimize: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function OpportunityCard({
  opportunity,
  onViewSupportingTransactions,
  onOpenExplainability,
  onOptimize,
  onDismiss,
}: OpportunityCardProps) {
  const isOptimized = opportunity.status === "optimized";
  const isDismissed = opportunity.status === "dismissed";
  const isUp = opportunity.changePercentage > 0;

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-sm ${
        isOptimized
          ? "border-growth/40 bg-growth/5 opacity-80"
          : isDismissed
          ? "border-border/60 bg-muted/20 opacity-60"
          : "border-border/80 bg-card hover:shadow-md"
      }`}
    >
      {/* Top Tag & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider">
            {opportunity.categoryLabel}
          </Badge>
          <Badge variant="growth" className="text-[10px] font-semibold">
            Potential Opportunity
          </Badge>
        </div>

        {isOptimized && (
          <Badge variant="growth" className="text-xs gap-1 py-0.5">
            <CheckCircle2 className="h-3 w-3" /> Optimization Captured
          </Badge>
        )}
        {isDismissed && (
          <Badge variant="secondary" className="text-xs py-0.5">
            Dismissed by Operator
          </Badge>
        )}
      </div>

      {/* Main Metric Presentation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-border/60">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">
            {opportunity.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>{opportunity.transactionCount} transactions</span>
            <span>•</span>
            <span className="font-bold text-foreground">
              {formatCurrency(opportunity.currentAmount, { currency: opportunity.currency })}
            </span>
            {opportunity.changePercentage !== 0 && (
              <>
                <span>•</span>
                <span
                  className={`inline-flex items-center font-bold ${
                    isUp ? "text-amber-500" : "text-growth"
                  }`}
                >
                  {isUp ? "+" : ""}
                  {opportunity.changePercentage.toFixed(1)}% vs previous period
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quantified Potential Savings Callout */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-left md:text-right shrink-0">
          <span className="text-[10px] uppercase font-mono text-muted-foreground block">
            Potential Savings Opportunity
          </span>
          <span className="text-xl font-extrabold text-foreground font-mono">
            {formatCurrency(opportunity.potentialSavings, { currency: opportunity.currency })}
            <span className="text-xs font-normal text-muted-foreground"> / month</span>
          </span>
        </div>
      </div>

      {/* Non-judgmental Explanation */}
      <div className="my-4 space-y-2 text-xs">
        <div className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Why this was flagged: </strong>
          {opportunity.whyFlagged}
        </div>
        <div className="text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/60">
          <strong className="text-foreground">Recommended approach: </strong>
          {opportunity.recommendedOptimization}
        </div>
      </div>

      {/* Footer: Triggers and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs">
        {/* Left Triggers: View Supporting Transactions + Why am I seeing this? */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onViewSupportingTransactions(opportunity)}
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>View {opportunity.supportingTransactions.length} supporting transactions</span>
          </button>

          <span className="text-muted-foreground/60">•</span>

          <button
            type="button"
            onClick={() => onOpenExplainability(opportunity.explainability)}
            className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span>Why am I seeing this?</span>
          </button>
        </div>

        {/* Right Actions */}
        {opportunity.status === "active" && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDismiss(opportunity.id)}
              className="text-xs h-8 text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onOptimize(opportunity.id)}
              className="text-xs h-8 gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Mark as Reviewed</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
