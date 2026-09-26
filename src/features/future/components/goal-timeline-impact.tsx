"use client";

import { Target, FastForward, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GoalTimelineImpact } from "../types";

export interface GoalTimelineImpactProps {
  impacts: GoalTimelineImpact[];
}

export function GoalTimelineImpactCard({ impacts }: GoalTimelineImpactProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Goal Timeline Impact
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Simulated milestone acceleration or delay under this scenario
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] font-mono">
          Milestone Velocity
        </Badge>
      </div>

      <div className="space-y-3">
        {impacts.map((impact) => {
          const isAccelerated = impact.status === "accelerated";
          const isDelayed = impact.status === "delayed";

          return (
            <div
              key={impact.goalId}
              className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-foreground">
                  {impact.goalTitle}
                </span>

                {isAccelerated && (
                  <Badge variant="growth" className="text-[10px] gap-1 py-0.5 w-fit">
                    <FastForward className="h-3 w-3" />
                    <span>{impact.monthsDifference} mo earlier</span>
                  </Badge>
                )}

                {isDelayed && (
                  <Badge variant="risk" className="text-[10px] gap-1 py-0.5 w-fit">
                    <Clock className="h-3 w-3" />
                    <span>{Math.abs(impact.monthsDifference)} mo delay</span>
                  </Badge>
                )}

                {!isAccelerated && !isDelayed && (
                  <Badge variant="secondary" className="text-[10px] py-0.5 w-fit">
                    Pacing matches baseline
                  </Badge>
                )}
              </div>

              {/* Progress Horizon Comparative Markers */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-muted-foreground border-t border-border/40">
                <span>
                  Actual Baseline:{" "}
                  <strong className="text-foreground">{impact.baselineMonths} mo</strong>
                </span>
                <span>→</span>
                <span>
                  Scenario Timeline:{" "}
                  <strong
                    className={
                      isAccelerated
                        ? "text-growth font-bold"
                        : isDelayed
                        ? "text-destructive font-bold"
                        : "text-foreground"
                    }
                  >
                    {impact.scenarioMonths} mo
                  </strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
