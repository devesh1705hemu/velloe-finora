"use client";

import { Compass, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BehavioralPattern, ExplainabilityMetadata } from "../types";

export interface BehavioralPatternsCardProps {
  patterns: BehavioralPattern[];
  onOpenExplainability: (meta: ExplainabilityMetadata) => void;
}

export function BehavioralPatternsCard({
  patterns,
  onOpenExplainability,
}: BehavioralPatternsCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Behavioral Rhythm & Temporal Patterns
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            Autonomous Discovery
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 text-xs">
        {patterns.map((bp) => (
          <div
            key={bp.id}
            className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-foreground">{bp.title}</h4>
                <p className="text-muted-foreground mt-0.5 leading-relaxed text-[11px]">
                  {bp.observation}
                </p>
              </div>

              <Badge
                variant={bp.impactLevel === "positive" ? "growth" : "secondary"}
                className="font-mono text-[10px] shrink-0"
              >
                {bp.metric}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[11px]">
              <span className="text-muted-foreground">Cadence: {bp.frequency}</span>

              {/* Explainability Trigger */}
              <button
                type="button"
                onClick={() => onOpenExplainability(bp.explainability)}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                <HelpCircle className="h-3 w-3" />
                <span>Why am I seeing this?</span>
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
