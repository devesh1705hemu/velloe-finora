"use client";

import { RotateCcw, BookmarkPlus, Sliders, Users, Layers, Cloud, Wallet, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScenarioInputs } from "../types";
import { formatCurrency } from "@/utils/currency";

export interface ScenarioControlsProps {
  inputs: ScenarioInputs;
  onChange: (inputs: ScenarioInputs) => void;
  onReset: () => void;
  onSaveScenario: () => void;
  isModifiedFromBaseline: boolean;
}

export function ScenarioControls({
  inputs,
  onChange,
  onReset,
  onSaveScenario,
  isModifiedFromBaseline,
}: ScenarioControlsProps) {
  const updateField = <K extends keyof ScenarioInputs>(
    key: K,
    value: ScenarioInputs[K]
  ) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Interactive Scenario Inputs
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Adjust categorical spend & capital contributions to project outcomes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!isModifiedFromBaseline}
            className="h-8 text-xs gap-1.5"
            title="Reset variables to Actual Data baseline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onSaveScenario}
            className="h-8 text-xs gap-1.5 shadow-sm"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            <span>Save Scenario</span>
          </Button>
        </div>
      </div>

      {/* SECTION 1: SPENDING CATEGORIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Spending Categories (Adjustments vs Baseline)
          </span>
          <Badge variant="outline" className="text-[10px] font-mono">
            Isolated Sandbox
          </Badge>
        </div>

        {/* Discretionary Spend Delta */}
        <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-foreground">
              Discretionary & Meal Velocity
            </span>
            <span
              className={`font-mono font-bold ${
                inputs.discretionarySpendPctDelta < 0
                  ? "text-growth"
                  : inputs.discretionarySpendPctDelta > 0
                  ? "text-amber-500"
                  : "text-foreground"
              }`}
            >
              {inputs.discretionarySpendPctDelta > 0 ? "+" : ""}
              {inputs.discretionarySpendPctDelta}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={inputs.discretionarySpendPctDelta}
            onChange={(e) =>
              updateField("discretionarySpendPctDelta", Number(e.target.value))
            }
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>-50% (Lean)</span>
            <span>0% (Actual Baseline)</span>
            <span>+50% (Discretionary Push)</span>
          </div>
        </div>

        {/* Cloud & Infrastructure Delta */}
        <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1">
              <Cloud className="h-3 w-3 text-sky-500" />
              Hosting & Cloud Infrastructure
            </span>
            <span
              className={`font-mono font-bold ${
                inputs.cloudInfraSpendPctDelta < 0
                  ? "text-growth"
                  : inputs.cloudInfraSpendPctDelta > 0
                  ? "text-amber-500"
                  : "text-foreground"
              }`}
            >
              {inputs.cloudInfraSpendPctDelta > 0 ? "+" : ""}
              {inputs.cloudInfraSpendPctDelta}%
            </span>
          </div>
          <input
            type="range"
            min="-40"
            max="60"
            step="5"
            value={inputs.cloudInfraSpendPctDelta}
            onChange={(e) =>
              updateField("cloudInfraSpendPctDelta", Number(e.target.value))
            }
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>-40% (Reserved instances)</span>
            <span>0% (Actual)</span>
            <span>+60% (Cluster expansion)</span>
          </div>
        </div>

        {/* Software & SaaS Tools Delta */}
        <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-foreground">
              Software & SaaS Subscriptions
            </span>
            <span
              className={`font-mono font-bold ${
                inputs.softwareSaaSSpendPctDelta < 0
                  ? "text-growth"
                  : inputs.softwareSaaSSpendPctDelta > 0
                  ? "text-amber-500"
                  : "text-foreground"
              }`}
            >
              {inputs.softwareSaaSSpendPctDelta > 0 ? "+" : ""}
              {inputs.softwareSaaSSpendPctDelta}%
            </span>
          </div>
          <input
            type="range"
            min="-40"
            max="40"
            step="5"
            value={inputs.softwareSaaSSpendPctDelta}
            onChange={(e) =>
              updateField("softwareSaaSSpendPctDelta", Number(e.target.value))
            }
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>-40% (Seat pruning)</span>
            <span>0% (Actual)</span>
            <span>+40% (Enterprise suite)</span>
          </div>
        </div>

        {/* Engineering / Operations Headcount Additions */}
        <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1">
              <Users className="h-3 w-3 text-indigo-500" />
              Headcount Additions ($8,500/mo per engineer)
            </span>
            <span className="font-mono font-bold text-foreground">
              +{inputs.headcountDelta} Hires (+{formatCurrency(inputs.headcountDelta * 8500)}/mo)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={inputs.headcountDelta}
            onChange={(e) =>
              updateField("headcountDelta", Number(e.target.value))
            }
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>0 (Freeze)</span>
            <span>+5 Hires</span>
            <span>+10 Hires</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: SAVINGS & GOAL CONTRIBUTIONS */}
      <div className="space-y-4 pt-2 border-t border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 text-growth" />
          Capital Allocations & Commitments
        </span>

        {/* Monthly Savings Contribution */}
        <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-foreground">
              Monthly Savings Contribution
            </span>
            <span className="font-mono font-bold text-growth">
              {formatCurrency(inputs.monthlySavingsContribution)} / mo
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30000"
            step="1000"
            value={inputs.monthlySavingsContribution}
            onChange={(e) =>
              updateField(
                "monthlySavingsContribution",
                Number(e.target.value)
              )
            }
            className="w-full accent-growth cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>$0/mo</span>
            <span>$15,000/mo</span>
            <span>$30,000/mo</span>
          </div>
        </div>

        {/* Monthly Goal Contribution */}
        <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1">
              <Target className="h-3 w-3 text-primary" />
              Monthly Strategic Goal Contribution
            </span>
            <span className="font-mono font-bold text-primary">
              {formatCurrency(inputs.monthlyGoalContribution)} / mo
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="50000"
            step="2500"
            value={inputs.monthlyGoalContribution}
            onChange={(e) =>
              updateField(
                "monthlyGoalContribution",
                Number(e.target.value)
              )
            }
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>$5,000/mo</span>
            <span>$25,000/mo</span>
            <span>$50,000/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
