"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import {
  Transaction,
  SortField,
  SortOrder,
  PaginatedTransactions,
} from "../types";
import { getStatusBadgeVariant } from "../utils";
import { PermissionGate } from "@/features/tenant";
import { cn } from "@/lib/utils";

export interface TransactionTableProps {
  data?: PaginatedTransactions;
  isLoading?: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onViewDetails: (tx: Transaction) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export function TransactionTable({
  data,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const pageSize = data?.pageSize ?? 10;
  const totalPages = data?.totalPages ?? 1;
  const summary = data?.summary;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 shrink-0 ml-1" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-primary shrink-0 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary shrink-0 ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary KPI Strip */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border/80 bg-card p-3 shadow-sm">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Filtered Inflows
            </span>
            <span className="text-lg font-bold text-growth tabular-nums">
              +{formatCurrency(summary.totalIncome)}
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-3 shadow-sm">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Filtered Outflows
            </span>
            <span className="text-lg font-bold text-foreground tabular-nums">
              -{formatCurrency(summary.totalExpense)}
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-3 shadow-sm">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Net Cash Flow
            </span>
            <span
              className={cn(
                "text-lg font-bold tabular-nums",
                summary.netCashFlow >= 0 ? "text-growth" : "text-risk"
              )}
            >
              {summary.netCashFlow >= 0 ? "+" : ""}
              {formatCurrency(summary.netCashFlow)}
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-3 shadow-sm">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Leakage Flags
            </span>
            <span className="text-lg font-bold text-risk tabular-nums flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> {summary.leakageCount}
            </span>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            {/* Table Head */}
            <thead className="bg-muted/40 border-b border-border/80 text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedIds.length === items.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                    aria-label="Select all transactions on page"
                  />
                </th>

                <th
                  onClick={() => onSort("postedAt")}
                  className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {renderSortIndicator("postedAt")}
                  </div>
                </th>

                <th
                  onClick={() => onSort("merchantName")}
                  className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <span>Entity / Merchant</span>
                    {renderSortIndicator("merchantName")}
                  </div>
                </th>

                <th
                  onClick={() => onSort("category")}
                  className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors hidden md:table-cell"
                >
                  <div className="flex items-center">
                    <span>Category</span>
                    {renderSortIndicator("category")}
                  </div>
                </th>

                <th className="py-3 px-3 hidden lg:table-cell">Account</th>

                <th
                  onClick={() => onSort("status")}
                  className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    {renderSortIndicator("status")}
                  </div>
                </th>

                <th
                  onClick={() => onSort("amount")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center justify-end">
                    <span>Amount</span>
                    {renderSortIndicator("amount")}
                  </div>
                </th>

                <th className="py-3 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skel-${idx}`} className="animate-pulse">
                    <td className="py-3.5 px-4 text-center">
                      <Skeleton className="h-4 w-4 mx-auto rounded" />
                    </td>
                    <td className="py-3.5 px-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="py-3.5 px-3">
                      <Skeleton className="h-4 w-36" />
                    </td>
                    <td className="py-3.5 px-3 hidden md:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3.5 px-3 hidden lg:table-cell">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="py-3.5 px-3">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Skeleton className="h-6 w-14 ml-auto rounded" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-xs">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                items.map((tx) => {
                  const isIncome = tx.type === "income";
                  const isSelected = selectedIds.includes(tx.id);

                  return (
                    <tr
                      key={tx.id}
                      className={cn(
                        "transition-colors hover:bg-accent/40 group",
                        isSelected && "bg-primary/5"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(tx.id)}
                          className="rounded border-input text-primary focus:ring-primary"
                          aria-label={`Select transaction ${tx.merchantName}`}
                        />
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                        {formatDate(tx.postedAt)}
                      </td>

                      {/* Merchant & Description */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                            {tx.merchantName}
                          </span>
                          {tx.isFlaggedAsLeakage && (
                            <Badge variant="risk" className="text-[9px] py-0 px-1 font-bold">
                              Leakage
                            </Badge>
                          )}
                        </div>
                        {tx.description && (
                          <span className="text-[11px] text-muted-foreground truncate block max-w-[200px] sm:max-w-sm">
                            {tx.description}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/60">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: tx.category.color || "#6366F1" }}
                          />
                          <span className="truncate max-w-[120px]">{tx.category.name}</span>
                        </span>
                      </td>

                      {/* Account */}
                      <td className="py-3.5 px-3 hidden lg:table-cell text-muted-foreground text-[11px] truncate max-w-[140px]">
                        {tx.accountName}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <Badge
                          variant={getStatusBadgeVariant(tx.status)}
                          className="text-[10px] py-0 px-1.5 capitalize font-medium"
                        >
                          {tx.status}
                        </Badge>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold tabular-nums">
                        <span className={isIncome ? "text-growth" : "text-foreground"}>
                          {isIncome ? "+" : "-"}
                          {formatCurrency(tx.amount, { currency: tx.currency })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onViewDetails(tx)}
                            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            title="View audit details"
                            aria-label="View transaction details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <PermissionGate permission="canEditTransactions">
                            <button
                              type="button"
                              onClick={() => onEdit(tx)}
                              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                              title="Edit record"
                              aria-label="Edit transaction"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDelete(tx)}
                              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                              title="Delete record"
                              aria-label="Delete transaction"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </PermissionGate>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Scalable Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          {/* Items count & Page Size selector */}
          <div className="flex items-center gap-4">
            <span>
              Showing{" "}
              <strong className="text-foreground">
                {total === 0 ? 0 : (page - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.min(page * pageSize, total)}
              </strong>{" "}
              of <strong className="text-foreground">{total}</strong> records
            </span>

            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Select rows per page"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="px-3 text-xs">
              Page <strong className="text-foreground">{page}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
