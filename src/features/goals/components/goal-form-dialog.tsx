"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGoalSchema, CreateGoalInput } from "../schemas";
import { FinancialGoal } from "../types";

export interface GoalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalInput, editingId?: string) => Promise<void>;
  initialGoal?: FinancialGoal | null;
}

export function GoalFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialGoal,
}: GoalFormDialogProps) {
  const isEditing = Boolean(initialGoal);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateGoalInput>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      title: "",
      category: "reserve_fund",
      priority: "medium",
      targetAmount: 50000,
      initialAmount: 0,
      monthlyContribution: 1000,
      currency: "USD",
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  useEffect(() => {
    if (initialGoal) {
      reset({
        title: initialGoal.title,
        category: initialGoal.category,
        priority: initialGoal.priority,
        targetAmount: initialGoal.targetAmount,
        initialAmount: initialGoal.currentAmount,
        monthlyContribution: initialGoal.monthlyContribution,
        currency: initialGoal.currency,
        targetDate: initialGoal.targetDate.split("T")[0] || "",
      });
    } else {
      reset({
        title: "",
        category: "reserve_fund",
        priority: "medium",
        targetAmount: 50000,
        initialAmount: 0,
        monthlyContribution: 1000,
        currency: "USD",
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
    }
  }, [initialGoal, reset]);

  if (!isOpen) return null;

  const onFormSubmit = async (values: CreateGoalInput) => {
    await onSubmit(values, initialGoal?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isEditing ? "Edit Financial Goal" : "Create New Strategic Goal"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Define capital targets, target dates, and monthly contribution pacing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Goal Title</label>
            <Input
              {...register("title")}
              placeholder="e.g. 12-Month Payroll Reserve"
              className="text-xs"
            />
            {errors.title && (
              <p className="text-[10px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Category</label>
              <select
                {...register("category")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="reserve_fund">Treasury Reserve</option>
                <option value="capex">Capital Expenditure (Capex)</option>
                <option value="runway_expansion">Runway Expansion</option>
                <option value="tax_provision">Tax Escrow / Provision</option>
                <option value="debt_paydown">Debt Paydown</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Priority</label>
              <select
                {...register("priority")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Target Amount & Initial Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Target Amount ($)</label>
              <Input
                type="number"
                step="100"
                {...register("targetAmount")}
                className="text-xs font-mono"
              />
              {errors.targetAmount && (
                <p className="text-[10px] text-destructive">{errors.targetAmount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">
                {isEditing ? "Current Funded ($)" : "Initial Capital ($)"}
              </label>
              <Input
                type="number"
                step="100"
                {...register("initialAmount")}
                className="text-xs font-mono"
              />
              {errors.initialAmount && (
                <p className="text-[10px] text-destructive">{errors.initialAmount.message}</p>
              )}
            </div>
          </div>

          {/* Monthly Contribution & Target Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Planned Monthly Contribution ($)</label>
              <Input
                type="number"
                step="50"
                {...register("monthlyContribution")}
                className="text-xs font-mono"
              />
              {errors.monthlyContribution && (
                <p className="text-[10px] text-destructive">{errors.monthlyContribution.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Target Horizon Date</label>
              <Input
                type="date"
                {...register("targetDate")}
                className="text-xs font-mono"
              />
              {errors.targetDate && (
                <p className="text-[10px] text-destructive">{errors.targetDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs gap-1.5"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Goal" : "Create Goal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
