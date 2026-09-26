"use client";

import { useEffect } from "react";
import {
  X,
  ShieldCheck,
  Calendar,
  Database,
  Calculator,
  GitCompare,
  Cpu,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExplainabilityMetadata } from "@/features/insights/types";

export interface ExplainabilityDrawerProps {
  metadata: ExplainabilityMetadata | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExplainabilityDrawer({
  metadata,
  isOpen,
  onClose,
}: ExplainabilityDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !metadata) return null;

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
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Why am I seeing this?
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Transparent reasoning, evaluation criteria, and mathematical baselines.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close explainability drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Target Title & Summary */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{metadata.title}</span>
              <Badge variant="growth" className="text-[10px] font-mono">
                {metadata.confidenceScore}% Model Confidence
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {metadata.insightSummary}
            </p>
          </div>

          {/* 4 Pillars of Financial Trust */}
          <div className="space-y-4 text-xs">
            {/* 1. Time Period */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Time Period Evaluated</span>
              </div>
              <p className="text-muted-foreground pl-6 font-mono text-[11px]">
                {metadata.timePeriod}
              </p>
            </div>

            {/* 2. Data Used */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Database className="h-4 w-4 text-primary" />
                <span>Input Data Sources</span>
              </div>
              <div className="pl-6 space-y-1 text-muted-foreground text-[11px]">
                {metadata.dataUsed.map((source, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span>{source}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Mathematical & Algorithmic Calculation */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Calculator className="h-4 w-4 text-primary" />
                <span>Calculation & Criteria</span>
              </div>
              <div className="pl-6 text-[11px] font-mono text-muted-foreground bg-background/60 p-2.5 rounded-lg border border-border/60 leading-relaxed whitespace-pre-wrap">
                {metadata.calculation}
              </div>
            </div>

            {/* 4. Comparison Baseline */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <GitCompare className="h-4 w-4 text-primary" />
                <span>Comparison Baseline Reference</span>
              </div>
              <p className="text-muted-foreground pl-6 text-[11px] leading-relaxed">
                {metadata.comparisonBaseline}
              </p>
            </div>
          </div>

          {/* Model info footer */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-3">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              <span>Engine: {metadata.modelOrEngine}</span>
            </span>
            <span className="flex items-center gap-1 text-growth">
              <ShieldCheck className="h-3.5 w-3.5" /> Deterministic
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-border/80 text-right">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
