"use client";

import { X, Columns3, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { ActualFinancialBaseline, SimulationScenario } from "../types";

export interface ScenarioComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseline: ActualFinancialBaseline;
  scenarios: SimulationScenario[];
}

export function ScenarioComparisonModal({
  isOpen,
  onClose,
  baseline,
  scenarios,
}: ScenarioComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[90vh] overflow-hidden text-foreground"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Columns3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Multi-Scenario Comparative Matrix
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Side-by-side evaluation of Actual Data vs Isolated Scenario Projections
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close comparison"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto py-4 flex-1">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80">
                <th className="p-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider w-48">
                  Financial Metric
                </th>
                {/* Column 1: Actual Baseline */}
                <th className="p-3 bg-muted/40 rounded-t-xl min-w-[180px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant="outline" className="text-[9px] font-mono">
                      Immutable
                    </Badge>
                  </div>
                  <span className="font-bold text-foreground text-sm block">
                    Actual Baseline
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Reconciled Treasury
                  </span>
                </th>

                {/* Scenario Columns */}
                {scenarios.map((scen) => (
                  <th key={scen.id} className="p-3 min-w-[200px]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant="growth" className="text-[9px] uppercase">
                        Scenario
                      </Badge>
                    </div>
                    <span className="font-bold text-foreground text-sm block truncate">
                      {scen.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground block line-clamp-1">
                      {scen.description}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {/* Row: Monthly Operating Spend */}
              <tr>
                <td className="p-3 font-medium text-muted-foreground">
                  Monthly Operating Spend
                </td>
                <td className="p-3 bg-muted/40 font-mono font-bold text-foreground">
                  {formatCurrency(baseline.monthlyOperatingSpend)}
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="p-3 font-mono">
                    <span className="font-bold text-foreground">
                      {formatCurrency(s.outputs.simulatedMonthlySpend)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      ({s.inputs.headcountDelta} new hires)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Monthly Savings & Surplus */}
              <tr>
                <td className="p-3 font-medium text-muted-foreground">
                  Monthly Savings Rate
                </td>
                <td className="p-3 bg-muted/40 font-mono font-bold text-growth">
                  {formatCurrency(baseline.monthlySavings)} / mo
                </td>
                {scenarios.map((s) => {
                  const isUp = s.outputs.monthlyScenarioDifference >= 0;
                  return (
                    <td key={s.id} className="p-3 font-mono">
                      <span className="font-bold text-growth block">
                        {formatCurrency(s.outputs.simulatedMonthlySavings)} / mo
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          isUp ? "text-growth" : "text-amber-500"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {formatCurrency(s.outputs.monthlyScenarioDifference)} vs actual
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Annualized Scenario Delta */}
              <tr>
                <td className="p-3 font-medium text-muted-foreground">
                  Annualized Net Difference
                </td>
                <td className="p-3 bg-muted/40 font-mono text-muted-foreground">
                  $0 (Baseline)
                </td>
                {scenarios.map((s) => {
                  const isUp = s.outputs.annualizedScenarioDifference >= 0;
                  return (
                    <td key={s.id} className="p-3 font-mono">
                      <span
                        className={`font-bold ${
                          isUp ? "text-growth" : "text-amber-500"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {formatCurrency(s.outputs.annualizedScenarioDifference)} / yr
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Forecasted Runway */}
              <tr>
                <td className="p-3 font-medium text-muted-foreground">
                  Forecasted Runway
                </td>
                <td className="p-3 bg-muted/40 font-mono font-bold text-foreground">
                  {baseline.runwayMonths} Months
                </td>
                {scenarios.map((s) => {
                  const isUp = s.outputs.runwayDeltaMonths >= 0;
                  return (
                    <td key={s.id} className="p-3 font-mono">
                      <span className="font-bold text-foreground">
                        {s.outputs.simulatedRunwayMonths} Months
                      </span>
                      <span
                        className={`text-[10px] block ${
                          isUp ? "text-growth" : "text-amber-500"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {s.outputs.runwayDeltaMonths} mo vs baseline
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Primary Goal Timeline Impact */}
              <tr>
                <td className="p-3 font-medium text-muted-foreground">
                  18-Mo Treasury Reserve
                </td>
                <td className="p-3 bg-muted/40 font-mono text-foreground">
                  6.4 Months Target
                </td>
                {scenarios.map((s) => {
                  const impact = s.outputs.goalTimelineImpacts[0];
                  if (!impact) {
                    return <td key={s.id} className="p-3 font-mono text-muted-foreground">-</td>;
                  }
                  return (
                    <td key={s.id} className="p-3 font-mono">
                      <span className="font-bold text-foreground">
                        {impact.scenarioMonths} Months
                      </span>
                      {impact.monthsDifference > 0 && (
                        <span className="text-[10px] text-growth font-bold block">
                          +{impact.monthsDifference} mo earlier
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Cloud & SaaS Delta */}
              <tr>
                <td className="p-3 font-medium text-muted-foreground">
                  Cloud & Tooling Posture
                </td>
                <td className="p-3 bg-muted/40 font-mono text-muted-foreground">
                  Baseline Rates
                </td>
                {scenarios.map((s) => (
                  <td key={s.id} className="p-3 text-[11px] font-mono text-muted-foreground">
                    Cloud: {s.inputs.cloudInfraSpendPctDelta > 0 ? "+" : ""}{s.inputs.cloudInfraSpendPctDelta}% | SaaS: {s.inputs.softwareSaaSSpendPctDelta > 0 ? "+" : ""}{s.inputs.softwareSaaSSpendPctDelta}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-primary shrink-0" />
            <span>
              All comparisons are mathematical projections based on assumed parameters.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}
