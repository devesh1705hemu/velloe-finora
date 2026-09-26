"use client";

import { useEffect } from "react";
import { X, Building2, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { PotentialOpportunity } from "../types";

export interface SupportingTransactionsDrawerProps {
  opportunity: PotentialOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SupportingTransactionsDrawer({
  opportunity,
  isOpen,
  onClose,
}: SupportingTransactionsDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !opportunity) return null;

  const totalSum = opportunity.supportingTransactions.reduce(
    (acc, tx) => acc + tx.amount,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-lg border-l border-border bg-card p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between text-foreground"
        role="dialog"
        aria-modal="true"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Supporting Transactions
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {opportunity.supportingTransactions.length} reconciled entries matching this pattern
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close supporting transactions drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Opportunity Summary Card */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{opportunity.title}</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {opportunity.categoryLabel}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-muted-foreground">Combined Observation Volume:</span>
              <span className="font-mono font-bold text-foreground">
                {formatCurrency(totalSum, { currency: opportunity.currency })}
              </span>
            </div>
          </div>

          {/* List of supporting transactions */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Itemized Records
            </span>

            <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-card overflow-hidden">
              {opportunity.supportingTransactions.map((tx) => (
                <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-accent/40 transition-colors">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground block">
                      {tx.merchant}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" /> {formatDate(tx.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {tx.accountName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-foreground block">
                      {formatCurrency(tx.amount, { currency: tx.currency })}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {tx.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/80 text-right">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
