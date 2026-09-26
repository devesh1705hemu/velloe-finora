"use client";

import { AlertTriangle, TrendingUp, Sparkles, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { PotentialLeakageReport } from "../types";

export interface LeakageSummaryStripProps {
  report: PotentialLeakageReport;
}

export function LeakageSummaryStrip({ report }: LeakageSummaryStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Monthly Potential Optimization */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Identified Monthly Optimization</span>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="text-2xl font-extrabold text-foreground font-mono">
          {formatCurrency(report.totalIdentifiedOptimization, { currency: report.currency })}
          <span className="text-xs font-normal text-muted-foreground"> / mo</span>
        </div>
      </div>

      {/* Annualized Recovery */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Annualized Potential Yield</span>
          <TrendingUp className="h-4 w-4 text-growth" />
        </div>
        <div className="text-2xl font-extrabold text-growth font-mono">
          {formatCurrency(report.annualizedSavingsPotential, { currency: report.currency })}
          <span className="text-xs font-normal text-muted-foreground"> / yr</span>
        </div>
      </div>

      {/* Active Opportunities */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Active Opportunities</span>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </div>
        <div className="text-2xl font-extrabold text-foreground font-mono">
          {report.activeOpportunitiesCount}{" "}
          <span className="text-xs font-normal text-muted-foreground">Items Flagged</span>
        </div>
      </div>

      {/* Audited Conduits */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Subscriptions Under Audit</span>
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-extrabold text-foreground font-mono">
          {report.auditedSubscriptionsCount}{" "}
          <span className="text-xs font-normal text-muted-foreground">Vendors</span>
        </div>
      </div>
    </div>
  );
}
