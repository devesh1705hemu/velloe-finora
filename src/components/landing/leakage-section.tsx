import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LeakageSection() {
  const leakageVectors = [
    {
      title: "Zombie Subscriptions & Seat Creep",
      desc: "Software licenses, inactive enterprise seats, and recurring memberships continuing to bill long after team members offboard.",
      impact: "Commonly $1,200 - $8,500/year",
      severity: "critical" as const,
    },
    {
      title: "Silent Gateway Surcharges & Hidden Fees",
      desc: "Foreign transaction markups, wire fees, and gradual payment processor rate increases buried within lumped reconciliation payouts.",
      impact: "0.2% - 0.8% of Gross Transaction Volume",
      severity: "high" as const,
    },
    {
      title: "Vendor Contract Price Drift",
      desc: "Annual auto-renewals that trigger unnotified 7–15% rate escalations deviating from your agreed master service contract terms.",
      impact: "Commonly 5% - 15% budget drift",
      severity: "medium" as const,
    },
    {
      title: "Duplicate & Split Charges",
      desc: "System errors, repeated POS swipes, or micro-invoices split across multiple credit cards that slip beneath single-invoice approval thresholds.",
      impact: "Immediate capital recovery",
      severity: "critical" as const,
    },
  ];

  return (
    <section id="leakage" className="py-20 lg:py-28 border-t border-border/80 bg-muted/20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Context */}
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="risk" className="text-xs">
              02 • Money Leakage Engine
            </Badge>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Stop losing capital to silent waste and fee drift.
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              Every growing balance sheet experiences friction: unnoticed rate increases, orphaned software seats,
              duplicate processor invoices, and creeping provider fees. Velloe-Finora continuously audits every ledger line
              to identify and quantify every dollar of preventable leakage.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                  ✓
                </div>
                <span>Continuous, non-invasive transaction pattern analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                  ✓
                </div>
                <span>Quantified dollar savings with exact merchant references</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                  ✓
                </div>
                <span>Single-click dispute and subscription cancellation workflows</span>
              </div>
            </div>
          </div>

          {/* Right Column: Leakage Vectors Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {leakageVectors.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/80 bg-card p-5 space-y-3 shadow-xs hover:border-rose-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={item.severity === "critical" ? "risk" : "warning"} className="text-[10px] uppercase">
                    {item.severity} severity
                  </Badge>
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                </div>

                <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>

                <div className="pt-2 border-t border-border/40 text-xs flex items-center justify-between">
                  <span className="text-muted-foreground">Observed exposure:</span>
                  <span className="font-semibold text-rose-500 tabular-nums">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
