"use client";

import { Sparkles, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FinancialInsight, ExplainabilityMetadata } from "../types";

export interface InsightsFeedProps {
  insights: FinancialInsight[];
  onOpenExplainability: (meta: ExplainabilityMetadata) => void;
}

export function InsightsFeed({ insights, onOpenExplainability }: InsightsFeedProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" /> Key Financial Insights
        </h3>
        <span className="text-[11px] text-muted-foreground font-mono">
          {insights.length} Reconciled Findings
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <Badge
                  variant={insight.impact === "high" ? "growth" : "secondary"}
                  className="text-[10px]"
                >
                  {insight.type.replace("_", " ")}
                </Badge>
                {insight.estimatedSavings && (
                  <span className="font-bold text-growth font-mono text-[11px]">
                    +${insight.estimatedSavings.toLocaleString()} Monthly Impact
                  </span>
                )}
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                {insight.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
                <button
                  type="button"
                  onClick={() => onOpenExplainability(insight.explainability)}
                  className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Why am I seeing this?</span>
                </button>

                <Badge variant="outline" className="text-[10px] font-mono">
                  {insight.explainability.modelOrEngine}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
