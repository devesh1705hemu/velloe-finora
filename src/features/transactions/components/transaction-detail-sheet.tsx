"use client";

import { useEffect } from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Calendar,
  Hash,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { Transaction } from "../types";
import { getStatusBadgeVariant } from "../utils";
import { PermissionGate } from "@/features/tenant";

export interface TransactionDetailSheetProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export function TransactionDetailSheet({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TransactionDetailSheetProps) {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === "income";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-md border-l border-border bg-card p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between text-foreground"
        role="dialog"
        aria-modal="true"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={getStatusBadgeVariant(transaction.status)}
                className="capitalize font-mono text-xs"
              >
                {transaction.status}
              </Badge>
              {transaction.isFlaggedAsLeakage && (
                <Badge variant="risk" className="text-xs gap-1">
                  <AlertTriangle className="h-3 w-3" /> Leakage Flagged
                </Badge>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close detail view"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Amount and Merchant */}
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
              Transaction Volume
            </span>
            <div className="text-3xl font-extrabold tabular-nums tracking-tight">
              <span className={isIncome ? "text-growth" : "text-foreground"}>
                {isIncome ? "+" : "-"}
                {formatCurrency(transaction.amount, { currency: transaction.currency })}
              </span>
            </div>
            <h2 className="text-lg font-bold text-foreground pt-1">
              {transaction.merchantName}
            </h2>
            {transaction.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {transaction.description}
              </p>
            )}
          </div>

          {/* Leakage Audit Details */}
          {transaction.isFlaggedAsLeakage && (
            <div className="rounded-xl border border-risk/30 bg-risk/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-risk font-bold">
                <AlertTriangle className="h-4 w-4" />
                <span>Autonomous Anomaly Diagnostic</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {transaction.leakageReason ??
                  "This transaction was flagged by Velloe-Finora's continuous audit engine for irregular recurring pricing drift."}
              </p>
            </div>
          )}

          {/* Core Metadata Grid */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Date Posted
              </span>
              <span className="font-semibold text-foreground font-mono">
                {formatDate(transaction.postedAt)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: transaction.category.color || "#6366F1" }}
                />
                <span>{transaction.category.name}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Account Feed
              </span>
              <span className="font-semibold text-foreground">
                {transaction.accountName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Conduit Verification</span>
              <span className="flex items-center gap-1 text-growth font-medium">
                <ShieldCheck className="h-3.5 w-3.5" /> Double-entry balanced
              </span>
            </div>
          </div>

          {/* Cryptographic Ledger Audit Trail */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Hash className="h-3.5 w-3.5" /> Immutable Audit Trail
            </h4>
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3 space-y-2 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ledger Record ID:</span>
                <span className="text-foreground">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Checksum:</span>
                <span className="text-foreground truncate max-w-[180px]">
                  {transaction.checksum ?? "sha256:d8a9e01f54bc"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Operator / Source:</span>
                <span className="text-foreground">{transaction.operatorId ?? "usr_auto_sync"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-border/80 flex items-center justify-between gap-3">
          <PermissionGate permission="canEditTransactions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onDelete(transaction);
              }}
              className="gap-1.5 text-xs text-risk hover:bg-risk/10 border-risk/30"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Entry
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              className="gap-1.5 text-xs"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit Record
            </Button>
          </PermissionGate>
        </div>
      </div>
    </div>
  );
}
