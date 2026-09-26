"use client";

import { useState } from "react";
import {
  Bot,
  User,
  Check,
  Copy,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FinoraAIMessage } from "../types";

export interface ChatMessageBubbleProps {
  message: FinoraAIMessage;
  onRetry?: () => void;
  isLatestAssistant?: boolean;
}

export function ChatMessageBubble({
  message,
  onRetry,
  isLatestAssistant,
}: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`flex items-start gap-3 sm:gap-4 transition-opacity duration-200 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary border border-primary/20"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5" />}
      </div>

      {/* Message Card */}
      <div className={`space-y-3 max-w-[90%] sm:max-w-[80%] ${isUser ? "text-right" : "text-left"}`}>
        {/* User Bubble */}
        {isUser ? (
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-xs sm:text-sm text-primary-foreground shadow-sm leading-relaxed inline-block text-left">
            {message.content}
          </div>
        ) : (
          <div className="rounded-2xl rounded-tl-sm border border-border/80 bg-card p-4 sm:p-5 text-foreground shadow-sm space-y-4">
            {/* Header: AI Identity & Trust Provenance */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] font-mono gap-1 text-primary border-primary/30">
                  <Sparkles className="h-3 w-3" /> Finora AI
                </Badge>
                <span className="text-xs font-bold text-foreground">
                  Financial Intelligence Assistant
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                <ShieldCheck className="h-3 w-3 text-growth" />
                <span>Zero Hallucination Context</span>
              </div>
            </div>

            {/* CRUCIAL SECTION 1: CALCULATED DATA (DETERMINISTIC & VERIFIED) */}
            {message.calculatedData && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-primary/20 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      {message.calculatedData.title}
                    </span>
                  </div>
                  <Badge variant="growth" className="text-[9px] uppercase font-mono tracking-wider w-fit">
                    Verified Calculation
                  </Badge>
                </div>

                {/* Grid of Verified Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                  {message.calculatedData.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/70 bg-card/80 p-2.5 space-y-0.5"
                    >
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {metric.label}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-foreground text-xs sm:text-sm">
                          {metric.value}
                        </span>
                        {metric.change && (
                          <span
                            className={`text-[10px] font-mono font-bold flex items-center ${
                              metric.trend === "up"
                                ? "text-growth"
                                : metric.trend === "down"
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {metric.trend === "up" && <TrendingUp className="h-2.5 w-2.5 mr-0.5" />}
                            {metric.trend === "down" && <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                            {metric.change}
                          </span>
                        )}
                      </div>
                      {metric.category && (
                        <span className="text-[9px] text-muted-foreground/80 block font-mono">
                          {metric.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Audit Baseline Line */}
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-primary/15">
                  <span>Engine: {message.calculatedData.sourceEngine}</span>
                  <span className="hidden sm:inline">Baseline: {message.calculatedData.auditBaseline}</span>
                </div>
              </div>
            )}

            {/* CRUCIAL SECTION 2: AI-GENERATED EXPLANATION */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[9px] uppercase font-mono tracking-wider">
                  AI Analysis & Synthesis
                </Badge>
              </div>

              <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
                {message.content}
                {message.isStreaming && (
                  <span className="inline-block h-3.5 w-2 bg-primary ml-0.5 animate-pulse align-middle" />
                )}
              </div>
            </div>

            {/* Error Message if present */}
            {message.error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{message.error}</span>
              </div>
            )}

            {/* Footer Actions: Copy & Retry */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <div className="text-[10px] text-muted-foreground">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                  title="Copy explanation"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-growth" />
                      <span className="text-growth font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {isLatestAssistant && onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                    title="Regenerate analysis"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Retry</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
