"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ChatInputBarProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export function ChatInputBar({
  onSend,
  onStop,
  isGenerating,
  disabled,
}: ChatInputBarProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isGenerating && !disabled) {
      inputRef.current?.focus();
    }
  }, [isGenerating, disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isGenerating || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            isGenerating
              ? "Finora AI is synthesizing ledger context..."
              : "Ask Finora AI about spend, changes, leakage, goals, or health..."
          }
          disabled={isGenerating || disabled}
          className="w-full rounded-2xl border border-input bg-card pl-4 pr-12 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:opacity-60 transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isGenerating ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onStop}
              className="h-8 gap-1 text-[11px] font-semibold px-2.5 rounded-xl shadow-sm"
              title="Stop generating"
            >
              <Square className="h-3 w-3 fill-current" />
              <span className="hidden sm:inline">Stop</span>
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!value.trim() || disabled}
              className="h-8 w-8 rounded-xl shadow-sm"
              aria-label="Send inquiry"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
