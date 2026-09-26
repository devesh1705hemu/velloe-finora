"use client";

import { Sparkles } from "lucide-react";

export interface SuggestedQuestionsPillProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestionsPill({
  questions,
  onSelect,
  disabled,
}: SuggestedQuestionsPillProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        <Sparkles className="h-3 w-3 text-primary" />
        <span>Suggested Intelligence Inquiries</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(q)}
            className="rounded-xl border border-border/80 bg-card hover:bg-accent px-3 py-1.5 text-xs text-foreground font-medium shadow-sm transition-all hover:border-primary/40 disabled:opacity-50 text-left"
          >
            &ldquo;{q}&rdquo;
          </button>
        ))}
      </div>
    </div>
  );
}
