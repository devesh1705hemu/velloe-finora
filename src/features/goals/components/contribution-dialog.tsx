"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recordContributionSchema, RecordContributionInput } from "../schemas";
import { FinancialGoal } from "../types";
import { formatCurrency } from "@/utils/currency";

export interface ContributionDialogProps {
  goal: FinancialGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecordContributionInput) => Promise<void>;
}

export function ContributionDialog({
  goal,
  isOpen,
  onClose,
  onSubmit,
}: ContributionDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecordContributionInput>({
    resolver: zodResolver(recordContributionSchema),
    defaultValues: {
      goalId: goal?.id || "",
      amount: 1000,
      date: new Date().toISOString().split("T")[0],
      sourceAccount: "JPMorgan Chase Treasury Reserve",
      note: "Monthly strategic allocation",
    },
  });

  if (!isOpen || !goal) return null;

  const onFormSubmit = async (values: RecordContributionInput) => {
    await onSubmit({
      ...values,
      goalId: goal.id,
    });
    reset();
    onClose();
  };

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-growth/10 text-growth">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Record Capital Contribution
              </h3>
              <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                Allocating towards <strong>{goal.title}</strong>
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

        {/* Current status summary */}
        <div className="my-4 rounded-xl border border-border/80 bg-muted/20 p-3 text-xs flex justify-between">
          <div>
            <span className="text-muted-foreground block text-[11px]">Current Funded</span>
            <span className="font-bold text-growth font-mono">
              {formatCurrency(goal.currentAmount, { currency: goal.currency })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground block text-[11px]">Remaining to Target</span>
            <span className="font-bold text-foreground font-mono">
              {formatCurrency(remaining, { currency: goal.currency })}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-xs">
          <input type="hidden" {...register("goalId")} value={goal.id} />

          {/* Amount */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Contribution Amount ($)</label>
            <Input
              type="number"
              step="50"
              {...register("amount")}
              placeholder="e.g. 5000"
              className="text-xs font-mono"
            />
            {errors.amount && (
              <p className="text-[10px] text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Date & Source Account */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Effective Date</label>
              <Input
                type="date"
                {...register("date")}
                className="text-xs font-mono"
              />
              {errors.date && (
                <p className="text-[10px] text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Source Account</label>
              <Input
                type="text"
                {...register("sourceAccount")}
                placeholder="Treasury / Bank"
                className="text-xs"
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Memo / Reference Note</label>
            <Input
              type="text"
              {...register("note")}
              placeholder="e.g. Q3 Surplus Reallocation"
              className="text-xs"
            />
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
              className="text-xs gap-1.5 bg-growth hover:bg-growth/90 text-growth-foreground"
            >
              {isSubmitting ? "Recording..." : "Record Contribution"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
