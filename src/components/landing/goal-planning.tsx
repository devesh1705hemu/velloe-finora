import { Target, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GoalPlanningSection() {
  const sampleGoals = [
    {
      title: "Operating Emergency Reserve (6 Months)",
      category: "Runway Cushion",
      target: "$180,000",
      current: "$142,500",
      pct: 79,
      forecastDate: "Nov 2026 (On Schedule)",
      confidence: "High",
      status: "growth" as const,
    },
    {
      title: "Equipment & CapEx Infrastructure",
      category: "Expansion",
      target: "$75,000",
      current: "$48,000",
      pct: 64,
      forecastDate: "Feb 2027 (Ahead by 14 days)",
      confidence: "High",
      status: "growth" as const,
    },
    {
      title: "Corporate Tax Withholding Provision",
      category: "Compliance",
      target: "$45,000",
      current: "$39,200",
      pct: 87,
      forecastDate: "Dec 2026 (Fully Funded)",
      confidence: "Optimal",
      status: "growth" as const,
    },
  ];

  return (
    <section id="goals" className="py-20 lg:py-28 border-t border-border/80 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Interactive Goal Cards */}
          <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
            {sampleGoals.map((goal) => (
              <div
                key={goal.title}
                className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{goal.title}</h3>
                      <span className="text-xs text-muted-foreground">{goal.category}</span>
                    </div>
                  </div>
                  <Badge variant={goal.status} className="text-[10px]">
                    {goal.pct}% Funded
                  </Badge>
                </div>

                {/* Progress track */}
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-700"
                    style={{ width: `${goal.pct}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>
                    Accumulated: <strong className="text-foreground tabular-nums">{goal.current}</strong> of {goal.target}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-growth">
                    <Calendar className="h-3.5 w-3.5" /> {goal.forecastDate}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <Badge variant="growth" className="text-xs">
              03 • Goal Planning
            </Badge>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Capital goals backed by continuous probability.
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              Setting targets without knowing your forward velocity is guesswork. Velloe-Finora models every financial milestone against realistic cash flows, factoring in fixed commitments, seasonal variance, and anticipated expenditure.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Dynamic Horizon Estimation</h4>
                  <p className="text-xs text-muted-foreground">Automatically updates completion dates when revenue accelerates or costs fluctuate.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Automated Surplus Sweep Recommendations</h4>
                  <p className="text-xs text-muted-foreground">Suggests optimal capital reallocation from idle operating accounts into high-yield reserves.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
