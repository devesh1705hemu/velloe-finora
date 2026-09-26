"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/features/tenant";
import {
  useActualBaseline,
  useSavedScenarios,
  useSaveScenario,
  useDeleteScenario,
} from "@/features/future/hooks";
import {
  ACTUAL_FINANCIAL_BASELINE,
  DEFAULT_BASELINE_INPUTS,
} from "@/features/future/services";
import {
  ScenarioControls,
  ScenarioImpactCards,
  ProjectionChart,
  GoalTimelineImpactCard,
  ScenarioSelectorStrip,
  ScenarioComparisonModal,
  SaveScenarioDialog,
} from "@/features/future/components";
import { ScenarioInputs, SimulationScenario } from "@/features/future/types";
import { calculateSimulationOutputs } from "@/features/future/utils";

export default function FuturePage() {
  const { currentWorkspace } = useTenant();

  // Queries & Mutations
  const { data: baseline = ACTUAL_FINANCIAL_BASELINE } = useActualBaseline();
  const { data: scenarios = [] } = useSavedScenarios();
  const saveScenarioMutation = useSaveScenario();
  const deleteScenarioMutation = useDeleteScenario();

  // Active state: activeScenarioId can be "actual", or a scenario ID
  const [activeScenarioId, setActiveScenarioId] = useState<string>("scen-a");
  const [inputs, setInputs] = useState<ScenarioInputs>({
    discretionarySpendPctDelta: -25,
    cloudInfraSpendPctDelta: -10,
    softwareSaaSSpendPctDelta: -15,
    headcountDelta: 0,
    monthlySavingsContribution: 16500,
    monthlyGoalContribution: 35000,
  });

  // Dialog states
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  // Compute outputs dynamically from inputs against immutable baseline
  const outputs = useMemo(() => {
    return calculateSimulationOutputs(baseline, inputs);
  }, [baseline, inputs]);

  // Check if modified from Actual Data baseline
  const isModifiedFromBaseline = useMemo(() => {
    return (
      inputs.discretionarySpendPctDelta !== 0 ||
      inputs.cloudInfraSpendPctDelta !== 0 ||
      inputs.softwareSaaSSpendPctDelta !== 0 ||
      inputs.headcountDelta !== 0 ||
      inputs.monthlySavingsContribution !== baseline.monthlySavings ||
      inputs.monthlyGoalContribution !== baseline.monthlyGoalContribution
    );
  }, [inputs, baseline]);

  // Handle scenario selection from strip
  const handleSelectScenario = (scen: SimulationScenario | null) => {
    if (!scen) {
      // Revert to Actual Baseline
      setActiveScenarioId("actual");
      setInputs({
        discretionarySpendPctDelta: 0,
        cloudInfraSpendPctDelta: 0,
        softwareSaaSSpendPctDelta: 0,
        headcountDelta: 0,
        monthlySavingsContribution: baseline.monthlySavings,
        monthlyGoalContribution: baseline.monthlyGoalContribution,
      });
    } else {
      setActiveScenarioId(scen.id);
      setInputs({ ...scen.inputs });
    }
  };

  const handleResetToBaseline = () => {
    setActiveScenarioId("actual");
    setInputs({
      ...DEFAULT_BASELINE_INPUTS,
      monthlySavingsContribution: baseline.monthlySavings,
      monthlyGoalContribution: baseline.monthlyGoalContribution,
    });
  };

  const handleSaveScenario = async (name: string, description: string) => {
    const res = await saveScenarioMutation.mutateAsync({
      name,
      description,
      inputs,
    });
    if (res.data) {
      setActiveScenarioId(res.data.id);
    }
  };

  const handleDeleteScenario = async (id: string) => {
    await deleteScenarioMutation.mutateAsync(id);
    if (activeScenarioId === id) {
      handleSelectScenario(null);
    }
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] gap-1 font-mono">
                <Sparkles className="h-3 w-3 text-primary" /> Interactive Scenario Engine
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground hidden sm:inline flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-growth" /> Immutable Actual Data Baseline
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Future Simulator & Scenario Modeling
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Simulate forward cash trajectories, capital allocations, and milestone velocity for <strong>{currentWorkspace.name}</strong>.
            </p>
          </div>
        </div>

        {/* Scenario Architecture Selector Strip (Actual Baseline vs Scenarios A, B, C) */}
        <ScenarioSelectorStrip
          scenarios={scenarios}
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
          onOpenCompare={() => setIsCompareOpen(true)}
          onDeleteScenario={handleDeleteScenario}
        />

        {/* Top KPI Impact Cards (Scenario, Projection, Potential) */}
        <ScenarioImpactCards outputs={outputs} />

        {/* Main 2-Column Grid: Controls on Left, Visualizations on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Sliders & Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <ScenarioControls
              inputs={inputs}
              onChange={(newInputs) => {
                setInputs(newInputs);
                if (activeScenarioId !== "custom" && activeScenarioId !== "actual") {
                  setActiveScenarioId("custom");
                }
              }}
              onReset={handleResetToBaseline}
              onSaveScenario={() => setIsSaveOpen(true)}
              isModifiedFromBaseline={isModifiedFromBaseline}
            />
          </div>

          {/* Right Column: 12-Month Projection Chart & Goal Timeline Impact */}
          <div className="lg:col-span-7 space-y-6">
            <ProjectionChart data={outputs.projectionPoints} />
            <GoalTimelineImpactCard impacts={outputs.goalTimelineImpacts} />
          </div>
        </div>

        {/* Side-by-Side Multi-Scenario Comparison Modal */}
        <ScenarioComparisonModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          baseline={baseline}
          scenarios={scenarios}
        />

        {/* Save Scenario Modal */}
        <SaveScenarioDialog
          isOpen={isSaveOpen}
          onClose={() => setIsSaveOpen(false)}
          inputs={inputs}
          onSave={handleSaveScenario}
        />
      </div>
    </AppShell>
  );
}
