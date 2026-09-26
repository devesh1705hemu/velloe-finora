"use client";

import { useState } from "react";
import { Sparkles, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ConversationHeaderProps {
  title: string;
  onClear: () => void;
  isGenerating: boolean;
}

export function ConversationHeader({
  title,
  onClear,
  isGenerating,
}: ConversationHeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge variant="outline" className="text-[10px] gap-1 font-mono text-primary border-primary/30">
            <Sparkles className="h-3 w-3" /> Finora AI
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Your financial intelligence assistant
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
          <Badge variant="growth" className="text-[10px] gap-1">
            <ShieldCheck className="h-3 w-3" /> Backend Context Layer Active
          </Badge>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {showConfirm ? (
          <div className="flex items-center gap-1.5 animate-in fade-in-0">
            <span className="text-[11px] text-muted-foreground">Clear thread?</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setShowConfirm(false);
                onClear();
              }}
              className="h-8 text-xs px-2.5"
            >
              Confirm
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              className="h-8 text-xs px-2.5"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={isGenerating}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            title="Clear current conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Conversation</span>
          </Button>
        )}
      </div>
    </div>
  );
}
