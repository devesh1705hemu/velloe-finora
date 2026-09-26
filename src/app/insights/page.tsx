"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Sparkles, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/features/tenant";
import { useFinancialIntelligence } from "@/features/insights/hooks";
import {
  PeriodComparisonBanner,
  CashFlowAnalysisCard,
  SpendingTrendsCard,
  CategoryAnalysisCard,
  SavingsTrendsCard,
  BehavioralPatternsCard,
  InsightsFeed,
} from "@/features/insights/components";
import { ExplainabilityDrawer } from "@/components/feedback/explainability-drawer";
import { ExplainabilityMetadata } from "@/features/insights/types";

export default function InsightsPage() {
  const { currentWorkspace } = useTenant();
  const [timeframe, setTimeframe] = useState<string>("30d");
  const [selectedExplainability, setSelectedExplainability] =
    useState<ExplainabilityMetadata | null>(null);
  const [isExplainDrawerOpen, setIsExplainDrawerOpen] = useState(false);

  const { data: report, refetch, isFetching } = useFinancialIntelligence(timeframe);

  const handleOpenExplainability = (meta: ExplainabilityMetadata) => {
    setSelectedExplainability(meta);
    setIsExplainDrawerOpen(true);
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="growth" className="text-[10px] gap-1">
                <Sparkles className="h-3 w-3 text-intelligence" /> Deterministic Ledger Intelligence
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground hidden sm:inline flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-growth" /> Trusted Canonical Calculations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Financial Intelligence & Velocity
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Reconciled spending trends, cash flows, and category analyses for <strong>{currentWorkspace.name}</strong>.
            </p>
          </div>

          {/* Timeframe Controls & Refresh */}
          <div className="flex items-center gap-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="30d">Trailing 30 Days</option>
              <option value="90d">Trailing 90 Days (Q3)</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 gap-1.5 text-xs"
              title="Refresh intelligence models"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </Button>
          </div>
        </div>

        {report && (
          <>
            {/* 1. Trusted Period Comparison Banner */}
            <PeriodComparisonBanner comparison={report.periodComparison} />

            {/* 2. Cash Flow Analysis & Savings Velocity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CashFlowAnalysisCard cashFlow={report.cashFlow} />
              <SavingsTrendsCard savingsTrends={report.savingsTrends} />
            </div>

            {/* 3. Spending Trends Trajectory & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingTrendsCard trends={report.spendingTrends} />
              <CategoryAnalysisCard categories={report.categoryBreakdown} />
            </div>

            {/* 4. Behavioral Patterns (with 'Why am I seeing this?' triggers) */}
            <BehavioralPatternsCard
              patterns={report.behavioralPatterns}
              onOpenExplainability={handleOpenExplainability}
            />

            {/* 5. Key Financial Findings & Explainable Intelligence */}
            <InsightsFeed
              insights={report.insights}
              onOpenExplainability={handleOpenExplainability}
            />
          </>
        )}

        {/* Global Explainability Drawer */}
        <ExplainabilityDrawer
          metadata={selectedExplainability}
          isOpen={isExplainDrawerOpen}
          onClose={() => {
            setIsExplainDrawerOpen(false);
            setSelectedExplainability(null);
          }}
        />
      </div>
    </AppShell>
  );
}
