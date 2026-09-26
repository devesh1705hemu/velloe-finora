"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CSVValidatedRow, CSVValidationReport } from "../types";
import { csvRowSchema } from "../schemas";

export interface TransactionImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportConfirmed: (
    validRows: Array<{
      postedAt: string;
      merchantName: string;
      amount: number;
      type: "income" | "expense" | "transfer";
      categoryName: string;
      accountName: string;
      description?: string;
      status: "settled" | "pending" | "flagged" | "reconciled";
    }>
  ) => Promise<void>;
  isLoading?: boolean;
}

type ImportStep = "upload" | "preview" | "resolve" | "confirming";

const SAMPLE_CSV = `postedAt,merchantName,amount,type,category,accountName,description,status
2026-09-20,GitHub Team Enterprise,84.00,expense,Software & SaaS Tools,Mercury Operating Checking,Developer organization seat subscription,settled
2026-09-19,Customer Inflow TechCorp,12500.00,income,Enterprise Licenses,Mercury Treasury Liquidity,Annual enterprise contract license,reconciled
2026-09-18,Stripe Fee Adjustment,-45.20,expense,Hosting & Cloud Infra,Chase Corporate Card,Invalid negative amount example for error demo,settled
2026-09-17,Anthropic Claude API,620.00,expense,Hosting & Cloud Infra,Mercury Operating Checking,Production LLM token usage,settled`;

export function TransactionImportModal({
  isOpen,
  onClose,
  onImportConfirmed,
  isLoading = false,
}: TransactionImportModalProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [report, setReport] = useState<CSVValidationReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const downloadSampleTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "velloe-finora-sample-import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseAndValidateCSV = (text: string) => {
    const lines = text
      .split(/\r\n|\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length <= 1) {
      alert("The CSV file must contain a header row and at least one transaction row.");
      return;
    }

    const headers = lines[0]!.split(",").map((h) => h.trim().toLowerCase());
    const dataRows = lines.slice(1);

    const validatedRows: CSVValidatedRow[] = [];

    dataRows.forEach((line, idx) => {
      // Split by comma ignoring commas inside quotes
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) =>
        v.trim().replace(/^"|"$/g, "")
      );

      const rowObj: Record<string, string> = {};
      headers.forEach((h, hIdx) => {
        rowObj[h] = values[hIdx] ?? "";
      });

      const candidate = {
        postedAt: rowObj["postedat"] || rowObj["date"] || "",
        merchantName: rowObj["merchantname"] || rowObj["merchant"] || rowObj["description"] || "",
        amount: rowObj["amount"] || "0",
        type: (rowObj["type"] || "expense").toLowerCase(),
        category: rowObj["category"] || "General",
        accountName: rowObj["accountname"] || rowObj["account"] || "Mercury Operating Checking",
        description: rowObj["description"] || "",
        status: (rowObj["status"] || "settled").toLowerCase(),
      };

      const result = csvRowSchema.safeParse(candidate);

      if (result.success) {
        validatedRows.push({
          rowNumber: idx + 2, // 1-indexed, accounting for header row
          isValid: true,
          data: {
            postedAt: result.data.postedAt,
            merchantName: result.data.merchantName,
            amount: result.data.amount,
            type: result.data.type,
            categoryName: result.data.category,
            accountName: result.data.accountName,
            description: result.data.description,
            status: result.data.status,
          },
          errors: {},
        });
      } else {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path.join(".");
          errors[field] = issue.message;
        });

        validatedRows.push({
          rowNumber: idx + 2,
          isValid: false,
          data: {
            postedAt: candidate.postedAt,
            merchantName: candidate.merchantName || `Row ${idx + 2}`,
            amount: Number(candidate.amount) || 0,
            type: "expense",
            categoryName: candidate.category,
            accountName: candidate.accountName,
            description: candidate.description,
            status: "settled",
          },
          errors,
        });
      }
    });

    const validCount = validatedRows.filter((r) => r.isValid).length;
    const errorCount = validatedRows.length - validCount;

    setReport({
      totalRows: validatedRows.length,
      validCount,
      errorCount,
      rows: validatedRows,
    });

    setStep(errorCount > 0 ? "resolve" : "preview");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) parseAndValidateCSV(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) parseAndValidateCSV(text);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (!report) return;
    const validData = report.rows.filter((r) => r.isValid).map((r) => r.data);
    if (validData.length === 0) {
      alert("No valid rows available to import.");
      return;
    }
    setStep("confirming");
    await onImportConfirmed(validData);
    onClose();
  };

  const discardInvalidRows = () => {
    if (!report) return;
    const filteredRows = report.rows.filter((r) => r.isValid);
    setReport({
      totalRows: filteredRows.length,
      validCount: filteredRows.length,
      errorCount: 0,
      rows: filteredRows,
    });
    setStep("preview");
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
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-foreground"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Step Progress */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Batch CSV Ledger Import
              </h3>
              <p className="text-xs text-muted-foreground">
                Ingest bank feeds or ERP statements with row-by-row Zod validation.
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

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4 text-xs font-medium text-muted-foreground">
          <span className={step === "upload" ? "text-primary font-bold" : ""}>
            1. Upload
          </span>
          <ArrowRight className="h-3 w-3" />
          <span className={step === "resolve" ? "text-risk font-bold" : ""}>
            2. Validate & Resolve
          </span>
          <ArrowRight className="h-3 w-3" />
          <span className={step === "preview" ? "text-growth font-bold" : ""}>
            3. Preview
          </span>
          <ArrowRight className="h-3 w-3" />
          <span className={step === "confirming" ? "text-primary font-bold" : ""}>
            4. Ingest
          </span>
        </div>

        {/* STEP 1: Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-foreground">
                Click to browse or drag and drop CSV statement
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Supported columns: postedAt, merchantName, amount, type, category, accountName.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSampleTemplate}
                className="text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Sample CSV Template
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => parseAndValidateCSV(SAMPLE_CSV)}
                className="text-xs gap-1.5"
              >
                Load Sample Test Batch
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Resolve Errors */}
        {step === "resolve" && report && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-risk/30 bg-risk/5 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-risk font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Validation flagged {report.errorCount} row{report.errorCount > 1 ? "s" : ""} with syntax or boundary errors.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={discardInvalidRows}
                className="text-xs h-7 border-risk/30 hover:bg-risk/10 text-risk"
              >
                Discard {report.errorCount} Invalid Row{report.errorCount > 1 ? "s" : ""} & Proceed
              </Button>
            </div>

            {/* Error Table */}
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border/80 divide-y divide-border/60">
              {report.rows
                .filter((r) => !r.isValid)
                .map((row) => (
                  <div key={row.rowNumber} className="p-3 bg-card space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        Row #{row.rowNumber}: {row.data.merchantName}
                      </span>
                      <Badge variant="risk" className="text-[10px]">
                        Invalid Row
                      </Badge>
                    </div>
                    <div className="space-y-0.5 text-[11px] text-risk font-mono">
                      {Object.entries(row.errors).map(([field, msg]) => (
                        <div key={field}>
                          • [{field}]: {msg}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => setStep("upload")}>
                Upload Different File
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={discardInvalidRows}
                disabled={report.validCount === 0}
              >
                Proceed with {report.validCount} Valid Row{report.validCount > 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Preview */}
        {step === "preview" && report && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-growth/30 bg-growth/5 p-3 text-growth font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  All {report.validCount} transaction records passed double-entry validation.
                </span>
              </div>
              <Badge variant="growth" className="font-mono text-[10px]">
                Ready to Ingest
              </Badge>
            </div>

            {/* Preview List */}
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border/80 divide-y divide-border/60">
              {report.rows
                .filter((r) => r.isValid)
                .map((row) => (
                  <div key={row.rowNumber} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">
                        {row.data.merchantName}
                      </span>
                      <div className="text-[10px] text-muted-foreground">
                        {row.data.postedAt} • {row.data.categoryName} • {row.data.accountName}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold">
                      <span className={row.data.type === "income" ? "text-growth" : "text-foreground"}>
                        {row.data.type === "income" ? "+" : "-"}${row.data.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleConfirmImport}
                isLoading={isLoading}
              >
                Commit {report.validCount} Records to Ledger
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
