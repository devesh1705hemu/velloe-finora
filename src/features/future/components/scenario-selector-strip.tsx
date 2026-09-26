"use client";

import { Check, Columns3, Trash2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimulationScenario } from "../types";

export interface ScenarioSelectorStripProps {
  scenarios: SimulationScenario[];
  activeScenarioId: string;
  onSelectScenario: (scenario: SimulationScenario | null) => void;
  onOpenCompare: () => void;
  onDeleteScenario: (scenarioId: string) => void;
}

export function ScenarioSelectorStrip({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onOpenCompare,
  onDeleteScenario,
}: ScenarioSelectorStripProps) {
  const isActualSelected = activeScenarioId === "actual";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card shadow-sm">
      {/* Left: Architecture Badge & Selector Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-growth" /> Scenario Isolation Architecture
          </Badge>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Actual Data is immutable. Sandbox adjustments are isolated.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Actual Baseline Button */}
          <button
            type="button"
            onClick={() => onSelectScenario(null)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActualSelected
                ? "bg-foreground text-background shadow-sm"
                : "border border-border/80 bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {isActualSelected && <Check className="h-3 w-3" />}
            <span>Actual Data (Baseline)</span>
          </button>

          {/* Scenario Tabs */}
          {scenarios.map((scen) => {
            const isSelected = activeScenarioId === scen.id;
            const isCustom = !scen.id.startsWith("scen-a") && !scen.id.startsWith("scen-b") && !scen.id.startsWith("scen-c");

            return (
              <div key={scen.id} className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => onSelectScenario(scen)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border/80 bg-muted/20 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                  <Sparkles className="h-3 w-3 opacity-70" />
                  <span>{scen.name}</span>
                </button>

                {isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteScenario(scen.id);
                    }}
                    className="ml-1 p-1 rounded-lg text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete custom scenario"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Compare Scenarios Action */}
      <div className="shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCompare}
          className="h-9 text-xs gap-1.5 border-border/80 shadow-sm"
        >
          <Columns3 className="h-3.5 w-3.5 text-primary" />
          <span>Compare Scenarios</span>
        </Button>
      </div>
    </div>
  );
}
