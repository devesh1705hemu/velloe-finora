import {
  Database,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FinancialIntelligenceSection() {
  const comparison = [
    {
      feature: "Orientation",
      tracker: "Backward-looking history (Where did money go?)",
      finora: "Forward-looking intelligence (Where will capital be?)",
    },
    {
      feature: "Data Model",
      tracker: "Basic receipt tagging & single-entry lists",
      finora: "Institutional double-entry ledger with real-time velocity",
    },
    {
      feature: "Actionability",
      tracker: "Static pie charts & monthly budget alerts",
      finora: "Predictive scenario modeling, runway forecasting & automated leakage capture",
    },
    {
      feature: "AI Integration",
      tracker: "Keyword rules and simple auto-categorization",
      finora: "Autonomous reasoning engine over transactional and contextual contracts",
    },
  ];

  return (
    <section id="product" className="py-20 lg:py-28 border-t border-border/80 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="growth" className="mb-3 text-xs">
            01 • Financial Intelligence
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Not an expense tracker. <br className="hidden sm:inline" />
            A continuous capital intelligence engine.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed">
            Most software records what you already spent. Velloe-Finora treats financial operations as a living system,
            synthesizing multi-account cash flows into real-time capital velocity and strategic foresight.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Multi-Account Unified Ledger</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Consolidates operational checking, savings reserves, credit facilities, and investment accounts into a synchronized ledger with strict reconciliation integrity.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-growth/15 text-growth">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Cash Flow Velocity & Burn</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Measures true burn rate, capital turnover speed, and liquidity distribution without lagging manual month-end spreadsheets.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Dynamic Net Capital Positioning</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Calculates net position while adjusting for impending liabilities, deferred tax provisions, and variable contract commitments.
            </p>
          </div>
        </div>

        {/* Comparison Table: Expense Tracker vs Finora */}
        <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/60 bg-muted/30">
            <h3 className="text-lg font-bold text-foreground">
              The Paradigm Shift: From Passive Logging to Predictive Intelligence
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Why leading capital allocators outgrow basic personal finance applications
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase font-semibold">
                  <th className="py-3.5 px-6 w-1/4">Dimension</th>
                  <th className="py-3.5 px-6 w-3/8 text-muted-foreground">Standard Expense Tracker</th>
                  <th className="py-3.5 px-6 w-3/8 text-primary font-bold">Velloe-Finora Financial Intelligence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparison.map((item) => (
                  <tr key={item.feature} className="hover:bg-accent/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-foreground">{item.feature}</td>
                    <td className="py-4 px-6 text-muted-foreground flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{item.tracker}</span>
                    </td>
                    <td className="py-4 px-6 text-foreground font-medium">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-growth shrink-0 mt-0.5" />
                        <span>{item.finora}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
