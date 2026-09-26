"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveScenarioFormSchema, SaveScenarioFormInput } from "../schemas";
import { ScenarioInputs } from "../types";

export interface SaveScenarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: ScenarioInputs;
  onSave: (name: string, description: string) => Promise<void>;
}

export function SaveScenarioDialog({
  isOpen,
  onClose,
  onSave,
}: SaveScenarioDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SaveScenarioFormInput>({
    resolver: zodResolver(saveScenarioFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  if (!isOpen) return null;

  const onFormSubmit = async (values: SaveScenarioFormInput) => {
    await onSave(values.name, values.description);
    reset();
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
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookmarkPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Save Simulation Scenario
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Persist current slider parameters for comparative analysis
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

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Scenario Name</label>
            <Input
              {...register("name")}
              placeholder="e.g. Q4 Aggressive R&D + Lean SaaS"
              className="text-xs"
            />
            {errors.name && (
              <p className="text-[10px] text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Scenario Rationale / Description</label>
            <Input
              {...register("description")}
              placeholder="e.g. Assumptions: 2 engineers hired, -15% cloud reserved pricing"
              className="text-xs"
            />
            {errors.description && (
              <p className="text-[10px] text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/80">
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
              {isSubmitting ? "Saving..." : "Save Scenario"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
