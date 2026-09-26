"use client";

import { useState } from "react";
import { RefreshCw, AlertCircle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface RetryUIProps {
  title?: string;
  message?: string;
  error?: Error | unknown;
  errorCode?: string;
  onRetry: () => void | Promise<void>;
  className?: string;
  compact?: boolean;
}

export function RetryUI({
  title = "Failed to load financial records",
  message = "An unexpected interruption occurred while syncing with the ledger service.",
  error,
  errorCode = "ERR_GATEWAY_TIMEOUT",
  onRetry,
  className,
  compact = false,
}: RetryUIProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const hasError = Boolean(error);
  const errorString =
    error instanceof Error
      ? `${error.name}: ${error.message}\n${error.stack ?? ""}`
      : typeof error === "string"
      ? error
      : error
      ? JSON.stringify(error, null, 2)
      : "";

  const handleCopyDiagnostics = () => {
    navigator.clipboard.writeText(`Error Code: ${errorCode}\n${errorString}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs",
          className
        )}
      >
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium">{title}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRetry}
          isLoading={isRetrying}
          className="h-7 text-xs border-destructive/30 hover:bg-destructive/10"
        >
          <RefreshCw className="mr-1.5 h-3 w-3" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 text-center shadow-sm max-w-lg mx-auto",
        className
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4 shadow-sm">
        <AlertCircle className="h-7 w-7" />
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <Badge variant="risk" className="font-mono text-[10px] uppercase">
          {errorCode}
        </Badge>
      </div>

      <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {title}
      </h3>

      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="default"
          onClick={handleRetry}
          isLoading={isRetrying}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} />
          <span>Try Again</span>
        </Button>

        {hasError && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="gap-1.5 text-xs"
          >
            <span>{showDetails ? "Hide Diagnostics" : "View Diagnostics"}</span>
            {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        )}
      </div>

      {showDetails && hasError && (
        <div className="mt-4 text-left rounded-xl border border-border/80 bg-muted/40 p-3.5 animate-in fade-in-0">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
            <span className="font-mono">Stack Trace / Diagnostics</span>
            <button
              type="button"
              onClick={handleCopyDiagnostics}
              className="flex items-center gap-1 text-primary hover:underline text-[10px]"
            >
              {copied ? <Check className="h-3 w-3 text-growth" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy Trace"}</span>
            </button>
          </div>
          <pre className="max-h-36 overflow-x-auto text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all">
            {errorString}
          </pre>
        </div>
      )}
    </div>
  );
}
