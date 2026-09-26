"use client";

import { useState } from "react";
import { Compass, Sparkles, TrendingUp, Users, DollarSign, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FutureSimulationSection() {
  const [revenueChange, setRevenueChange] = useState<number>(0);
  const [headcount, setHeadcount] = useState<number>(1);
  const [capexSpend, setCapexSpend] = useState<number>(20000);

  // Baseline assumption: Starting cash $500,000, monthly baseline burn $30,000
  const startingCash = 500000;
  const baselineMonthlyBurn = 30000;
  const costPerHead = 8500; // monthly fully loaded
  const netMonthlyBurn = Math.max(
    5000,
    baselineMonthlyBurn + headcount * costPerHead - (baselineMonthlyBurn * (revenueChange / 100))
  );
  const remainingCashAfterCapex = startingCash - capexSpend;
  const calculatedRunway = Math.max(1, Math.round((remainingCashAfterCapex / netMonthlyBurn) * 10) / 10);

  const isHealthy = calculatedRunway >= 12;

  return (
    <section id="platform" className="py-20 lg:py-28 border-t border-border/80 bg-muted/20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <Badge variant="growth" className="mb-3 text-xs">
            04 • Future Simulation
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Stress-test your financial destiny before you commit capital.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed">
            Move beyond static budgets into dynamic &ldquo;What-If&rdquo; sandbox modeling. Simulate new hires, economic downturns, marketing scale, or major capital expenditures in seconds.
          </p>
        </div>

        {/* Interactive Scenario Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column */}
          <div className="lg:col-span-6 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" /> Scenario Parameters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 gap-1"
                onClick={() => {
                  setRevenueChange(0);
                  setHeadcount(1);
                  setCapexSpend(20000);
                }}
              >
                <RefreshCw className="h-3 w-3" /> Reset
              </Button>
            </div>

            {/* Parameter 1: Revenue Change */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" /> Expected Revenue Shift
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    revenueChange > 0 ? "text-growth" : revenueChange < 0 ? "text-rose-500" : "text-foreground"
                  }`}
                >
                  {revenueChange > 0 ? `+${revenueChange}%` : `${revenueChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                step="5"
                value={revenueChange}
                onChange={(e) => setRevenueChange(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>-50% (Downturn)</span>
                <span>0% (Flat)</span>
                <span>+100% (High Growth)</span>
              </div>
            </div>

            {/* Parameter 2: Headcount Addition */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" /> Additional Key Hires
                </span>
                <span className="font-bold text-foreground tabular-nums">+{headcount} team members</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>0</span>
                <span>4 hires</span>
                <span>8 hires</span>
              </div>
            </div>

            {/* Parameter 3: One-time Capital Expenditure */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-muted-foreground" /> One-Time CapEx / Investment
                </span>
                <span className="font-bold text-foreground tabular-nums">${capexSpend.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={capexSpend}
                onChange={(e) => setCapexSpend(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>$0</span>
                <span>$50,000</span>
                <span>$100,000</span>
              </div>
            </div>
          </div>

          {/* Real-time Computed Projection Output */}
          <div className="lg:col-span-6 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  Simulated Outcome
                </span>
                <Badge variant={isHealthy ? "growth" : "risk"} className="text-xs">
                  {isHealthy ? "Sustainable Runway" : "Caution: Short Runway"}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-medium">Computed Runway Horizon</div>
                <div className="text-4xl sm:text-5xl font-extrabold text-foreground tabular-nums">
                  {calculatedRunway} <span className="text-xl sm:text-2xl font-bold text-muted-foreground">Months</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border/60">
                <div className="rounded-lg bg-muted/40 p-3.5 border border-border/40">
                  <span className="text-xs text-muted-foreground block mb-1">Simulated Net Burn</span>
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    ${Math.round(netMonthlyBurn).toLocaleString()}
                    <span className="text-xs text-muted-foreground font-normal">/mo</span>
                  </span>
                </div>
                <div className="rounded-lg bg-muted/40 p-3.5 border border-border/40">
                  <span className="text-xs text-muted-foreground block mb-1">Adjusted Cash Base</span>
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    ${remainingCashAfterCapex.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Velloe-Finora Insight:</strong> Under this simulated scenario, current reserves support your planned hires for {calculatedRunway} months without requiring external bridge financing.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
