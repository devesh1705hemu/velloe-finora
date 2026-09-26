"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DeleteGoalDialogProps {
  goalId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (goalId: string) => Promise<void>;
}

export function DeleteGoalDialog({
  goalId,
  isOpen,
  onClose,
  onConfirm,
}: DeleteGoalDialogProps) {
  if (!isOpen || !goalId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-sm rounded-2xl border border-destructive/30 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Delete Strategic Goal
            </h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to remove this milestone?
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          This will permanently delete this financial goal, its target trajectory, and all associated contribution records. This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/80">
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
            type="button"
            variant="destructive"
            size="sm"
            onClick={async () => {
              await onConfirm(goalId);
              onClose();
            }}
            className="text-xs gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Goal</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
