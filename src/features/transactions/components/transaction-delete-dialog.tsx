"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { Transaction } from "../types";

export interface TransactionDeleteDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export function TransactionDeleteDialog({
  transaction,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: TransactionDeleteDialogProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-foreground"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Delete Ledger Entry?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This action permanently removes this record from Velloe-Finora. Connected double-entry balance aggregates and cash flow metrics will be recomputed immediately.
            </p>
          </div>
        </div>

        {/* Transaction Summary Card */}
        <div className="my-4 rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Entity:</span>
            <strong className="text-foreground">{transaction.merchantName}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <strong className="text-foreground font-mono">
              {formatCurrency(transaction.amount, { currency: transaction.currency })}
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="text-foreground font-mono">{formatDate(transaction.postedAt)}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Record ID:</span>
            <span className="text-muted-foreground font-mono">{transaction.id}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Confirm Deletion</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
