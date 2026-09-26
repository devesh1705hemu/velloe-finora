"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/features/tenant";
import {
  usePotentialLeakage,
  useUpdateOpportunityStatus,
} from "@/features/leakage/hooks";
import {
  OpportunityCard,
  LeakageSummaryStrip,
  LeakageCategoryTabs,
  SupportingTransactionsDrawer,
} from "@/features/leakage/components";
import { ExplainabilityDrawer } from "@/components/feedback/explainability-drawer";
import { PotentialOpportunity } from "@/features/leakage/types";
import { ExplainabilityMetadata } from "@/features/insights/types";

export default function LeakagePage() {
  const { currentWorkspace } = useTenant();
  const [activeTab, setActiveTab] = useState<string>("all");

  // Drawers State
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<PotentialOpportunity | null>(null);
  const [isSupportingDrawerOpen, setIsSupportingDrawerOpen] = useState(false);

  const [selectedExplainability, setSelectedExplainability] =
    useState<ExplainabilityMetadata | null>(null);
  const [isExplainDrawerOpen, setIsExplainDrawerOpen] = useState(false);

  // Queries & Mutations
  const { data: report, isLoading, refetch, isFetching } = usePotentialLeakage(activeTab);
  const updateStatusMutation = useUpdateOpportunityStatus();

  const handleViewSupportingTransactions = (opp: PotentialOpportunity) => {
    setSelectedOpportunity(opp);
    setIsSupportingDrawerOpen(true);
  };

  const handleOpenExplainability = (meta: ExplainabilityMetadata) => {
    setSelectedExplainability(meta);
    setIsExplainDrawerOpen(true);
  };

  const handleOptimize = async (id: string) => {
    await updateStatusMutation.mutateAsync({ id, status: "optimized" });
  };

  const handleDismiss = async (id: string) => {
    await updateStatusMutation.mutateAsync({ id, status: "dismissed" });
  };

  if (isLoading && !report) {
    return (
      <AppShell>
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 w-64 bg-muted/60 rounded-lg" />
          <div className="h-28 bg-muted/40 rounded-2xl" />
          <div className="h-10 bg-muted/30 rounded-xl" />
          <div className="space-y-4">
            <div className="h-44 bg-muted/30 rounded-2xl" />
            <div className="h-44 bg-muted/30 rounded-2xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="risk" className="text-[10px] gap-1">
                <AlertTriangle className="h-3 w-3" /> Continuous Capital Optimization
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground hidden sm:inline flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-growth" /> Non-judgmental Anomaly Detection
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Potential Leakage & Savings Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Pattern analysis across recurring software, vendor rate drift, and discretionary spend for <strong>{currentWorkspace.name}</strong>.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5 text-xs"
            title="Re-run anomaly detection scanner"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Re-scan</span>
          </Button>
        </div>

        {/* Top Summary KPI Strip */}
        {report && <LeakageSummaryStrip report={report} />}

        {/* Category Navigation Tabs */}
        <LeakageCategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Opportunities List */}
        <div className="space-y-4">
          {report?.opportunities.length === 0 ? (
            <div className="rounded-2xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground">
              No potential leakage anomalies detected in this category. All recurring disbursements match verified baselines.
            </div>
          ) : (
            report?.opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onViewSupportingTransactions={handleViewSupportingTransactions}
                onOpenExplainability={handleOpenExplainability}
                onOptimize={handleOptimize}
                onDismiss={handleDismiss}
              />
            ))
          )}
        </div>

        {/* Supporting Transactions Drawer */}
        <SupportingTransactionsDrawer
          opportunity={selectedOpportunity}
          isOpen={isSupportingDrawerOpen}
          onClose={() => {
            setIsSupportingDrawerOpen(false);
            setSelectedOpportunity(null);
          }}
        />

        {/* Explainability 'Why am I seeing this?' Drawer */}
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
