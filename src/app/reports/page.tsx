"use client";

import { AppShell } from "@/components/layout/app-shell";
import { FileSpreadsheet, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTenant, PermissionGate } from "@/features/tenant";

export default function ReportsPage() {
  const { currentWorkspace } = useTenant();

  const reports = [
    {
      id: "rep-1",
      title: "Monthly Cash Flow Variance Statement",
      period: "August 2026",
      generatedAt: "Sep 01, 2026",
      status: "Finalized",
    },
    {
      id: "rep-2",
      title: "Consolidated Profit & Loss (P&L)",
      period: "Q2 2026",
      generatedAt: "Jul 05, 2026",
      status: "Audited",
    },
    {
      id: "rep-3",
      title: "Vendor Drift & Preventable Leakage Audit",
      period: "Trailing 90 Days",
      generatedAt: "Sep 20, 2026",
      status: "Automated",
    },
  ];

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px]">
                GAAP Compliant
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Financial Statements & Reports
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Exportable audit records and cash flow reconciliations for <strong>{currentWorkspace.name}</strong>.
            </p>
          </div>

          <PermissionGate
            permission="canExportData"
            fallback={
              <Button variant="outline" size="sm" disabled className="text-xs">
                Export Data (Restricted)
              </Button>
            }
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => alert("Downloading consolidated financial package...")}
            >
              <Download className="h-3.5 w-3.5" /> Download Package
            </Button>
          </PermissionGate>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{report.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>Period: {report.period}</span>
                      <span>•</span>
                      <span>Generated: {report.generatedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <Badge variant="growth" className="text-[10px]">
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="text-xs gap-1">
                    <span>View Statement</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
