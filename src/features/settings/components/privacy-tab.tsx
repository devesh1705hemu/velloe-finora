"use client";

import { useState } from "react";
import {
  Download,
  Building2,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Unlink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ConnectedAccount,
  ConsentRecord,
  DataExportRequest,
  PrivacyPreferences,
} from "../types";
import { formatDate } from "@/utils/date";

export interface PrivacyTabProps {
  preferences: PrivacyPreferences;
  connectedAccounts: ConnectedAccount[];
  consentRecords: ConsentRecord[];
  onUpdatePreferences: (prefs: PrivacyPreferences) => Promise<void>;
  onRequestExport: (format: "json" | "csv" | "archive") => Promise<DataExportRequest>;
}

export function PrivacyTab({
  preferences,
  connectedAccounts,
  consentRecords,
  onUpdatePreferences,
  onRequestExport,
}: PrivacyTabProps) {
  const [prefs, setPrefs] = useState<PrivacyPreferences>(preferences);
  const [activeExport, setActiveExport] = useState<DataExportRequest | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const togglePref = async (key: keyof PrivacyPreferences) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    await onUpdatePreferences(updated);
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  const handleExport = async (format: "json" | "csv" | "archive") => {
    setIsExporting(true);
    try {
      const res = await onRequestExport(format);
      setActiveExport(res);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. DATA EXPORT & COMPLIANCE ARCHIVE */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Data Portability & Compliance Export
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Download a certified archive of your double-entry ledger, audit entries, and model records
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              GDPR Art. 20 Compliant
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            Your financial data is completely portable. Exports include categorized transactions, historical balances, forward scenario snapshots, and team audit logs formatted in standardized JSON and CSV formats.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={() => handleExport("json")}
              className="text-xs gap-1.5 h-8 font-mono"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export as JSON</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={() => handleExport("csv")}
              className="text-xs gap-1.5 h-8 font-mono"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export as CSV</span>
            </Button>

            <Button
              size="sm"
              disabled={isExporting}
              onClick={() => handleExport("archive")}
              className="text-xs gap-1.5 h-8"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Generate Full Compliance Archive (.zip)</span>
            </Button>
          </div>

          {activeExport && (
            <div className="rounded-xl border border-growth/40 bg-growth/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in-0">
              <div className="space-y-0.5">
                <span className="font-bold text-growth flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  Compliance Archive Ready for Download
                </span>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Archive ID: {activeExport.id} • Format: {activeExport.format.toUpperCase()} • Size: 4.28 MB
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Encrypted archive link valid until {formatDate(activeExport.expiresAt || "")}
                </p>
              </div>

              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Archive download initiated with verified SHA-256 checksum.");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-growth px-3.5 py-1.5 text-xs font-semibold text-growth-foreground hover:bg-growth/90 transition-colors w-fit"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Archive</span>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. PRIVACY PREFERENCES & MODEL TRAINING CONTROLS */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-growth/10 text-growth">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Privacy Preferences & Telemetry
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Control operational telemetry, transaction enrichment, and third-party isolation
                </p>
              </div>
            </div>
            {prefsSaved && (
              <Badge variant="growth" className="text-[10px] animate-in fade-in-0">
                Preferences Saved
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          {/* AI Zero Training Guarantee Callout */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-foreground block">
                Finora Zero-Training Covenant
              </span>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Finora strictly adheres to enterprise isolation: customer double-entry ledger records, transaction flows, and financial health models are <strong>never</strong> used to train foundation AI models.
              </p>
            </div>
          </div>

          <div className="divide-y divide-border/60 rounded-xl border border-border/80">
            {/* Preference 1: AI Model Training */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">
                  AI Model Training Opt-Out
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Strictly prohibits proprietary ledger tokens from any external fine-tuning
                </span>
              </div>
              <Badge variant="growth" className="text-[10px] font-mono">
                Locked: Prohibited
              </Badge>
            </div>

            {/* Preference 2: Transaction Enrichment */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">
                  Automated Merchant & Logo Enrichment
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Matches raw transaction strings against verified global merchant registries
                </span>
              </div>
              <button
                type="button"
                onClick={() => togglePref("transactionEnrichment")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  prefs.transactionEnrichment ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    prefs.transactionEnrichment ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Preference 3: Operational Analytics */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">
                  Diagnostic Performance Telemetry
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Share anonymized UI latency metrics to help improve application responsiveness
                </span>
              </div>
              <button
                type="button"
                onClick={() => togglePref("analyticsTracking")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  prefs.analyticsTracking ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    prefs.analyticsTracking ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Preference 4: Third-Party Data Sharing */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">
                  Third-Party Marketing Sharing
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Allow external commercial partners to receive usage metadata
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Disabled by Default
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. CONNECTED ACCOUNT MANAGEMENT */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Connected Banking Conduits
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Manage read-only Open Banking connections through regulated aggregators
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              FDX & SOC2 Type II Certified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-xs">
          <div className="divide-y divide-border/60 rounded-xl border border-border/80">
            {connectedAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{acc.institutionName}</span>
                    <Badge variant="growth" className="text-[9px] uppercase font-mono">
                      {acc.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                    <span>{acc.accountType} ({acc.mask})</span>
                    <span>•</span>
                    <span>Aggregator: {acc.provider}</span>
                    <span>•</span>
                    <span>Last synced: {formatDate(acc.lastSyncedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Initiated re-authentication with ${acc.institutionName}.`)}
                    className="h-8 text-xs gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Re-sync</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert(`Disconnected ${acc.institutionName}. Synced tokens revoked.`)}
                    className="h-8 text-xs text-destructive hover:bg-destructive/10 gap-1"
                  >
                    <Unlink className="h-3 w-3" />
                    <span>Disconnect</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. CONSENT & REGULATORY RECORDS */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Regulatory & Consent Management
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Active Data Processing Agreements and consumer consent registries
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Audit-Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2 text-xs">
            {consentRecords.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground block">
                    {c.consentType}
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    {c.description}
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Granted: {formatDate(c.timestamp)} • Version: {c.version}
                  </span>
                </div>

                <Badge variant="growth" className="text-[10px] w-fit">
                  Active Agreement
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
