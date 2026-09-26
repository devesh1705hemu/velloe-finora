"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Layers, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "../types";
import { transactionFormSchema, TransactionFormValues } from "../schemas";
import { TRANSACTION_CATEGORIES, CONNECTED_ACCOUNTS } from "../constants";

export interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormValues) => Promise<void> | void;
  initialData?: Transaction | null;
  isLoading?: boolean;
}

export function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: TransactionFormModalProps) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      merchantName: "",
      amount: 0,
      currency: "USD",
      type: "expense",
      categoryId: TRANSACTION_CATEGORIES[0]?.id ?? "cat-tools",
      accountId: CONNECTED_ACCOUNTS[0]?.id ?? "acc-mercury-01",
      status: "settled",
      postedAt: new Date().toISOString().split("T")[0],
      description: "",
      isFlaggedAsLeakage: false,
      leakageReason: "",
    },
  });

  const isLeakageChecked = watch("isFlaggedAsLeakage");

  useEffect(() => {
    if (initialData) {
      reset({
        merchantName: initialData.merchantName,
        amount: initialData.amount,
        currency: initialData.currency,
        type: initialData.type,
        categoryId: initialData.category.id,
        accountId: initialData.accountId,
        status: initialData.status,
        postedAt: initialData.postedAt.split("T")[0] ?? "",
        description: initialData.description ?? "",
        isFlaggedAsLeakage: initialData.isFlaggedAsLeakage,
        leakageReason: initialData.leakageReason ?? "",
      });
    } else {
      reset({
        merchantName: "",
        amount: 0,
        currency: "USD",
        type: "expense",
        categoryId: TRANSACTION_CATEGORIES[0]?.id ?? "cat-tools",
        accountId: CONNECTED_ACCOUNTS[0]?.id ?? "acc-mercury-01",
        status: "settled",
        postedAt: new Date().toISOString().split("T")[0],
        description: "",
        isFlaggedAsLeakage: false,
        leakageReason: "",
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-foreground"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isEditing ? "Edit Ledger Record" : "Record New Transaction"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Input double-entry parameters validated against schema rules.
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          {/* Merchant and Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-foreground block mb-1">
                Merchant / Entity Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Stripe Platform Inflow, AWS Cloud"
                {...register("merchantName")}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.merchantName && (
                <span className="text-[11px] text-risk mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.merchantName.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount")}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.amount && (
                <span className="text-[11px] text-risk mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.amount.message}
                </span>
              )}
            </div>
          </div>

          {/* Type, Currency & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Direction / Type *
              </label>
              <select
                {...register("type")}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="expense">Expense (-)</option>
                <option value="income">Income (+)</option>
                <option value="transfer">Internal Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Currency *
              </label>
              <select
                {...register("currency")}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Posted Date *
              </label>
              <input
                type="date"
                {...register("postedAt")}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Category and Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Category *
              </label>
              <select
                {...register("categoryId")}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Connected Account Feed *
              </label>
              <select
                {...register("accountId")}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CONNECTED_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.maskedNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Reconciliation Status
            </label>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="settled">Settled (Funds cleared)</option>
              <option value="pending">Pending (In-flight conduit)</option>
              <option value="reconciled">Reconciled (Audited balance)</option>
              <option value="flagged">Flagged (Requires review)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Description / Memo (Optional)
            </label>
            <input
              type="text"
              placeholder="Context notes, invoice reference, or PO number..."
              {...register("description")}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Leakage flag */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isFlaggedAsLeakage")}
                className="rounded border-input text-risk focus:ring-risk"
              />
              <span className="text-xs font-semibold text-foreground">
                Flag this item as Preventable Money Leakage
              </span>
            </label>

            {isLeakageChecked && (
              <input
                type="text"
                placeholder="Reason (e.g. Orphaned seat, creeping fee rate, duplicate invoice)"
                {...register("leakageReason")}
                className="w-full rounded-lg border border-risk/40 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-risk"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/80">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading}>
              {isEditing ? "Save Changes" : "Commit Record"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
