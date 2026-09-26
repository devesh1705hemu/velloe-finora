"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Plus, Target, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/features/tenant";
import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useRecordContribution,
} from "@/features/goals/hooks";
import {
  GoalCard,
  GoalSummaryStrip,
  GoalFormDialog,
  ContributionDialog,
  DeleteGoalDialog,
} from "@/features/goals/components";
import { FinancialGoal, GoalCategory } from "@/features/goals/types";
import { CreateGoalInput, RecordContributionInput } from "@/features/goals/schemas";

export default function GoalsPage() {
  const { currentWorkspace } = useTenant();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  const [contributionGoal, setContributionGoal] = useState<FinancialGoal | null>(null);
  const [isContributionOpen, setIsContributionOpen] = useState(false);

  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries & Mutations
  const { data: goals = [], isLoading, refetch, isFetching } = useGoals(
    selectedCategory === "all"
      ? undefined
      : { category: selectedCategory as GoalCategory }
  );

  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();
  const recordContributionMutation = useRecordContribution();

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleOpenContribute = (goal: FinancialGoal) => {
    setContributionGoal(goal);
    setIsContributionOpen(true);
  };

  const handleOpenDelete = (goalId: string) => {
    setDeletingGoalId(goalId);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: CreateGoalInput, editingId?: string) => {
    if (editingId) {
      await updateGoalMutation.mutateAsync({
        ...data,
        id: editingId,
      });
    } else {
      await createGoalMutation.mutateAsync(data);
    }
  };

  const handleRecordContribution = async (data: RecordContributionInput) => {
    await recordContributionMutation.mutateAsync(data);
  };

  const handleDeleteConfirm = async (goalId: string) => {
    await deleteGoalMutation.mutateAsync(goalId);
  };

  const categories = [
    { id: "all", label: "All Milestones" },
    { id: "reserve_fund", label: "Treasury Reserves" },
    { id: "capex", label: "Capex & Tools" },
    { id: "tax_provision", label: "Tax Escrow" },
    { id: "runway_expansion", label: "Runway Extension" },
    { id: "debt_paydown", label: "Debt Paydown" },
  ];

  if (isLoading && goals.length === 0) {
    return (
      <AppShell>
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 w-64 bg-muted/60 rounded-lg" />
          <div className="h-28 bg-muted/40 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-muted/30 rounded-2xl" />
            <div className="h-64 bg-muted/30 rounded-2xl" />
            <div className="h-64 bg-muted/30 rounded-2xl" />
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
              <Badge variant="growth" className="text-[10px] gap-1">
                <Target className="h-3 w-3" /> Capital Planning Horizons
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Dual-Track Actual vs Projected Trajectory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Goal Planning & Projections
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track actual capital reserves against forward milestone schedules for <strong>{currentWorkspace.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 gap-1.5 text-xs"
              title="Refresh goals and recalculate projections"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="h-9 text-xs gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Goal</span>
            </Button>
          </div>
        </div>

        {/* Top Summary KPI Strip */}
        <GoalSummaryStrip goals={goals} />

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/60">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto text-muted-foreground">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">No Goals in this Category</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Define capital targets and monthly pacing to project milestone completion dates accurately.
              </p>
              <Button size="sm" onClick={handleOpenCreate} className="text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Create First Goal
              </Button>
            </div>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onContribute={handleOpenContribute}
              />
            ))
          )}
        </div>

        {/* Create / Edit Goal Modal */}
        <GoalFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialGoal={editingGoal}
        />

        {/* Record Contribution Modal */}
        <ContributionDialog
          goal={contributionGoal}
          isOpen={isContributionOpen}
          onClose={() => {
            setIsContributionOpen(false);
            setContributionGoal(null);
          }}
          onSubmit={handleRecordContribution}
        />

        {/* Safe Deletion Modal */}
        <DeleteGoalDialog
          goalId={deletingGoalId}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingGoalId(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </AppShell>
  );
}
