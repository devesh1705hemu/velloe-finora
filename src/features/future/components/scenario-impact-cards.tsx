"use client";

import { AlertCircle, ArrowDownRight, ArrowUpRight, Clock, Sparkles, Vault } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { ScenarioOutputs } from "../types";

export interface ScenarioImpactCardsProps {
  outputs: ScenarioOutputs;
}

export function ScenarioImpactCards({ outputs }: ScenarioImpactCardsProps) {
  const isSavingsPositive = outputs.monthlyScenarioDifference >= 0;
  const isRunwayPositive = outputs.runwayDeltaMonths >= 0;

  return (
    <div className="space-y-4">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Scenario Savings */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Badge variant="growth" className="text-[9px] uppercase font-bold tracking-wider">
                Scenario
              </Badge>
              <span className="text-xs font-semibold text-foreground">Monthly Savings</span>
            </div>
            <Vault className="h-4 w-4 text-growth" />
          </div>

          <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono pt-1">
            {formatCurrency(outputs.simulatedMonthlySavings)}
            <span className="text-xs text-muted-foreground font-normal"> / mo</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] pt-1">
            <span
              className={`inline-flex items-center font-bold font-mono ${
                isSavingsPositive ? "text-growth" : "text-destructive"
              }`}
            >
              {isSavingsPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              )}
              {isSavingsPositive ? "+" : ""}
              {formatCurrency(outputs.monthlyScenarioDifference)}/mo
            </span>
            <span className="text-muted-foreground">vs Actual Data</span>
          </div>
        </div>

        {/* Metric 2: Annualized Scenario Difference */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-wider text-primary">
                Potential
              </Badge>
              <span className="text-xs font-semibold text-foreground">Annualized Delta</span>
            </div>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>

          <div
            className={`text-xl sm:text-2xl font-extrabold font-mono pt-1 ${
              outputs.annualizedScenarioDifference >= 0
                ? "text-growth"
                : "text-amber-500"
            }`}
          >
            {outputs.annualizedScenarioDifference >= 0 ? "+" : ""}
            {formatCurrency(outputs.annualizedScenarioDifference)}
            <span className="text-xs text-muted-foreground font-normal"> / yr</span>
          </div>

          <div className="text-[11px] text-muted-foreground pt-1">
            Net capital variance across 12 calendar months
          </div>
        </div>

        {/* Metric 3: Projected Runway */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wider">
                Projection
              </Badge>
              <span className="text-xs font-semibold text-foreground">Forecasted Runway</span>
            </div>
            <Clock className="h-4 w-4 text-intelligence" />
          </div>

          <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono pt-1">
            {outputs.simulatedRunwayMonths}{" "}
            <span className="text-xs text-muted-foreground font-normal">Months</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] pt-1">
            <span
              className={`inline-flex items-center font-bold font-mono ${
                isRunwayPositive ? "text-growth" : "text-amber-500"
              }`}
            >
              {isRunwayPositive ? "+" : ""}
              {outputs.runwayDeltaMonths} mo
            </span>
            <span className="text-muted-foreground">trajectory shift</span>
          </div>
        </div>
      </div>

      {/* Mandatory Non-Guarantee Transparency Disclosure */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-foreground">Modeling Assumption Disclosure: </strong>
          All figures displayed above represent <strong>Scenario Projections</strong> and <strong>Potential Outcomes</strong> derived from user-adjusted parameters and historical operational baselines. Projections are never financial guarantees and do not constitute advisory representation.
        </div>
      </div>
    </div>
  );
}
