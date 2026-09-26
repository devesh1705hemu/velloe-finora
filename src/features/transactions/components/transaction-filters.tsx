"use client";

import React from "react";
import {
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransactionFilterState, DateRangePreset, TransactionType, TransactionStatus } from "../types";
import { TRANSACTION_CATEGORIES } from "../constants";

export interface TransactionFiltersProps {
  filter: TransactionFilterState;
  onChange: (filter: TransactionFilterState) => void;
  onReset: () => void;
}

export function TransactionFilters({ filter, onChange, onReset }: TransactionFiltersProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const activeFiltersCount = [
    filter.search ? 1 : 0,
    filter.type !== "all" ? 1 : 0,
    filter.categoryId !== "all" && filter.categoryId ? 1 : 0,
    filter.status !== "all" ? 1 : 0,
    filter.dateRangePreset !== "all" ? 1 : 0,
    filter.isLeakage ? 1 : 0,
    filter.minAmount !== undefined || filter.maxAmount !== undefined ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const datePresets: Array<{ id: DateRangePreset; label: string }> = [
    { id: "all", label: "All Time" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "this_month", label: "This Month" },
    { id: "last_month", label: "Last Month" },
    { id: "custom", label: "Custom Range" },
  ];

  return (
    <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      {/* Top Search & Primary Type Pills */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search merchant, category, account, or description..."
            value={filter.search}
            onChange={(e) => onChange({ ...filter, search: e.target.value, page: 1 })}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filter, search: "", page: 1 })}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
          {(
            [
              { id: "all", label: "All Types" },
              { id: "income", label: "Inflows (+)" },
              { id: "expense", label: "Outflows (-)" },
              { id: "transfer", label: "Transfers" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                onChange({
                  ...filter,
                  type: tab.id as "all" | TransactionType,
                  page: 1,
                })
              }
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                filter.type === tab.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border/60"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Toggle Leakage Button */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filter,
                isLeakage: !filter.isLeakage,
                page: 1,
              })
            }
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors shrink-0 border ${
              filter.isLeakage
                ? "bg-risk/15 text-risk border-risk font-semibold"
                : "text-muted-foreground border-border/60 hover:bg-accent"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Leakage Only</span>
          </button>

          {/* Advanced toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-8 gap-1.5 text-xs shrink-0 rounded-xl border-border/80"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="growth" className="text-[10px] py-0 px-1.5 ml-0.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filter Row (Collapsible) */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border/60 text-xs animate-in fade-in-0">
          {/* Category Dropdown */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">
              Category
            </label>
            <select
              value={filter.categoryId}
              onChange={(e) => onChange({ ...filter, categoryId: e.target.value, page: 1 })}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">
              Reconciliation Status
            </label>
            <select
              value={filter.status}
              onChange={(e) =>
                onChange({
                  ...filter,
                  status: e.target.value as "all" | TransactionStatus,
                  page: 1,
                })
              }
              className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="settled">Settled</option>
              <option value="reconciled">Reconciled</option>
              <option value="flagged">Flagged</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Date Range Preset */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">
              Date Horizon
            </label>
            <select
              value={filter.dateRangePreset}
              onChange={(e) =>
                onChange({
                  ...filter,
                  dateRangePreset: e.target.value as DateRangePreset,
                  page: 1,
                })
              }
              className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {datePresets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Action */}
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={activeFiltersCount === 0}
              className="h-8 w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </Button>
          </div>

          {/* Custom Date Inputs if 'custom' is selected */}
          {filter.dateRangePreset === "custom" && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dashed border-border/60">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filter.startDate || ""}
                  onChange={(e) => onChange({ ...filter, startDate: e.target.value, page: 1 })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filter.endDate || ""}
                  onChange={(e) => onChange({ ...filter, endDate: e.target.value, page: 1 })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
