export * from "./transaction-table";
export * from "./transaction-filters";
export * from "./transaction-detail-sheet";
export * from "./transaction-form-modal";
export * from "./transaction-delete-dialog";
export * from "./transaction-import-modal";
export * from "./transaction-export-modal";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { Transaction } from "../types";
import { cn } from "@/lib/utils";

export interface TransactionRowProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
  className?: string;
}

export function TransactionRow({ transaction, onClick, className }: TransactionRowProps) {
  const isIncome = transaction.type === "income";

  return (
    <div
      onClick={() => onClick?.(transaction)}
      className={cn(
        "flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-accent/40 transition-colors cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold",
            isIncome ? "bg-growth/15 text-growth" : "bg-muted text-muted-foreground"
          )}
        >
          {transaction.merchantName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span>{transaction.merchantName}</span>
            {transaction.isFlaggedAsLeakage && (
              <Badge variant="risk" className="text-[10px] py-0 px-1 font-bold">
                Leakage
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span>{transaction.category.name}</span>
            <span>•</span>
            <span>{formatDate(transaction.postedAt)}</span>
          </div>
        </div>
      </div>

      <div className="text-right font-mono">
        <div
          className={cn(
            "text-sm font-bold tabular-nums",
            isIncome ? "text-growth" : "text-foreground"
          )}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount, { currency: transaction.currency })}
        </div>
        <div className="text-[10px] text-muted-foreground capitalize">
          {transaction.status}
        </div>
      </div>
    </div>
  );
}
