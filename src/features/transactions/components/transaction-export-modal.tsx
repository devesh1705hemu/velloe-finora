"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Code, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transactionService } from "../services";
import { TransactionFilterState } from "../types";

export interface TransactionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: TransactionFilterState;
  totalFilteredRecords: number;
}

export function TransactionExportModal({
  isOpen,
  onClose,
  currentFilter,
  totalFilteredRecords,
}: TransactionExportModalProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const output = await transactionService.exportTransactions(currentFilter, format);
      const mimeType = format === "csv" ? "text/csv;charset=utf-8;" : "application/json";
      const blob = new Blob([output], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      link.href = url;
      link.setAttribute("download", `velloe-finora-ledger-${dateStr}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

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
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-foreground"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Export Ledger Records
              </h3>
              <p className="text-xs text-muted-foreground">
                Download verified financial transaction records.
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

        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-muted-foreground leading-relaxed">
            Exports <strong>{totalFilteredRecords}</strong> transaction record{totalFilteredRecords > 1 ? "s" : ""} matching your active search, category, and date range parameters.
          </div>

          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground block">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  format === "csv"
                    ? "border-primary bg-primary/5 text-foreground font-semibold"
                    : "border-border/80 text-muted-foreground hover:bg-accent"
                }`}
              >
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs">CSV Spreadsheet</div>
                  <div className="text-[10px] text-muted-foreground">Excel, Sheets, ERP</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("json")}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  format === "json"
                    ? "border-primary bg-primary/5 text-foreground font-semibold"
                    : "border-border/80 text-muted-foreground hover:bg-accent"
                }`}
              >
                <Code className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs">JSON Object</div>
                  <div className="text-[10px] text-muted-foreground">API, Data pipelines</div>
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/80">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDownload}
              isLoading={isExporting}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download {format.toUpperCase()}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
