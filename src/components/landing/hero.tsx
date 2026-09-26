"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Play,
  Layers,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const [activeScenario, setActiveScenario] = useState<"baseline" | "optimized" | "stress">("optimized");

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32">
      {/* Background radial glow effect */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/20 to-indigo-500/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Copy */}
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm animate-in fade-in-50 duration-500">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Autonomous Financial Intelligence</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground">Beyond Expense Tracking</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
            Your money has a future.{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 bg-clip-text text-transparent">
              See it.
            </span>
          </h1>

          <p className="text-base text-muted-foreground sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Velloe-Finora transforms financial activity into actionable insights, potential savings
            opportunities, and future scenarios.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20 gap-2" asChild>
              <Link href="#get-started">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-7 text-base gap-2 bg-background/50 backdrop-blur-sm" asChild>
              <Link href="#product">
                <Play className="h-4 w-4 text-primary fill-primary/20" />
                <span>Explore Demo</span>
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-growth" /> No sensitive third-party API exposure
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-growth" /> Privacy-first architecture
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-growth" /> Double-entry ledger accuracy
            </span>
          </div>
        </div>

        {/* High-Quality Product Dashboard Preview */}
        <div className="mt-12 lg:mt-16 relative mx-auto max-w-5xl rounded-2xl border border-border/80 bg-card/60 p-2 sm:p-4 shadow-2xl backdrop-blur-xl">
          {/* Top Window Chrome */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3 px-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                velloe-finora.intelligence.internal/overview
              </span>
            </div>

            {/* Scenario toggle inside mockup */}
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveScenario("baseline")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeScenario === "baseline"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Baseline
              </button>
              <button
                type="button"
                onClick={() => setActiveScenario("optimized")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeScenario === "optimized"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Leakage Eliminated
              </button>
              <button
                type="button"
                onClick={() => setActiveScenario("stress")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeScenario === "stress"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Stress Test
              </button>
            </div>
          </div>

          {/* Main Dashboard Screen Inside Mockup */}
          <div className="p-3 sm:p-6 space-y-6">
            {/* Top Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Total Capital Liquidity</span>
                  <Badge variant="growth" className="text-[10px] py-0 px-1">
                    +14.2%
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-foreground tabular-nums">
                  {activeScenario === "optimized" ? "$842,500.00" : activeScenario === "baseline" ? "$789,120.00" : "$684,200.00"}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-growth" /> 4 Connected Accounts
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Projected Runway</span>
                  <Badge variant={activeScenario === "stress" ? "warning" : "growth"} className="text-[10px] py-0 px-1">
                    {activeScenario === "optimized" ? "+4.2 mo" : activeScenario === "stress" ? "-2.1 mo" : "Target"}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-foreground tabular-nums">
                  {activeScenario === "optimized" ? "26.4 Months" : activeScenario === "baseline" ? "22.2 Months" : "17.8 Months"}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Burn rate: <span className="font-semibold text-foreground">$31,900 / mo</span>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Identified Money Leakage</span>
                  <Badge variant="risk" className="text-[10px] py-0 px-1">
                    Recoverable
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-rose-500 tabular-nums">
                  $3,420.00<span className="text-xs font-normal text-muted-foreground">/mo</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-rose-500" /> 5 Anomalies Detected
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Goal Attainment Index</span>
                  <Badge variant="intelligence" className="text-[10px] py-0 px-1">
                    High Probability
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-foreground tabular-nums">
                  94.8%
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Target Reserve: <span className="font-semibold text-foreground">Dec 2027</span>
                </div>
              </div>
            </div>

            {/* Split Visual: Simulation Projection + Real-time Leakage Detection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Simulation Graph Canvas */}
              <div className="lg:col-span-2 rounded-xl border border-border/60 bg-background/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Compass className="h-4 w-4 text-primary" /> Future Trajectory Model
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Continuous Monte Carlo capital simulation based on dynamic burn and inflow velocity
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Forecast</span>
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 ml-2" />
                    <span className="text-muted-foreground">Optimized</span>
                  </div>
                </div>

                {/* SVG Financial Chart */}
                <div className="h-48 w-full relative pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="primaryGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                    {/* Area under curve */}
                    <path
                      d="M0,110 Q120,95 240,70 T500,20 L500,150 L0,150 Z"
                      fill="url(#emeraldGlow)"
                    />
                    <path
                      d="M0,110 Q120,105 240,90 T500,60 L500,150 L0,150 Z"
                      fill="url(#primaryGlow)"
                    />

                    {/* Baseline Line */}
                    <path
                      d="M0,110 Q120,105 240,90 T500,60"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="2.5"
                      strokeDasharray={activeScenario === "stress" ? "4 4" : "none"}
                    />

                    {/* Optimized Line */}
                    <path
                      d="M0,110 Q120,95 240,70 T500,20"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />

                    {/* Markers */}
                    <circle cx="500" cy="20" r="4.5" fill="#10B981" />
                    <circle cx="500" cy="60" r="4" fill="#6366F1" />
                  </svg>

                  {/* Chart X-axis Labels */}
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono pt-2">
                    <span>Current Q1</span>
                    <span>Q2 (+3m)</span>
                    <span>Q3 (+6m)</span>
                    <span>Q4 (+9m)</span>
                    <span>Horizon (+12m)</span>
                  </div>
                </div>
              </div>

              {/* Anomaly & Leakage Live Feed */}
              <div className="rounded-xl border border-border/60 bg-background/60 p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-intelligence" /> Autonomous Insights
                    </h3>
                    <Badge variant="risk" className="text-[10px]">
                      High Urgency
                    </Badge>
                  </div>

                  <div className="space-y-2.5">
                    <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs">
                      <div className="flex items-center justify-between font-semibold text-rose-500">
                        <span>Zombie SaaS Seat Creep</span>
                        <span className="tabular-nums">+$1,840/yr</span>
                      </div>
                      <p className="text-muted-foreground mt-1">
                        14 unutilized seats identified on Cloud Infrastructure billing.
                      </p>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
                      <div className="flex items-center justify-between font-semibold text-amber-500">
                        <span>Hidden Payment Gateway Surcharge</span>
                        <span className="tabular-nums">+0.45%</span>
                      </div>
                      <p className="text-muted-foreground mt-1">
                        Contract drift detected against original master service agreement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Autonomous engine:</span>
                  <span className="font-semibold text-growth flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-growth animate-ping" /> Continuous Monitoring
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
