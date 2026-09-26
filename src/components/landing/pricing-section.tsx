import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const tiers = [
    {
      name: "Starter Intelligence",
      price: "$0",
      period: "forever free",
      desc: "For individuals seeking clarity over cash flows and basic leakage alerts.",
      features: [
        "Up to 2 connected financial accounts",
        "Autonomous money leakage scanning (Basic)",
        "Single-scenario runway modeling",
        "Community & documentation support",
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Professional Allocator",
      price: "$29",
      period: "per month",
      desc: "For high-earning individuals, founders, and lean operating teams.",
      features: [
        "Unlimited connected accounts & institutions",
        "Deep continuous leakage & vendor drift engine",
        "Multi-variable future simulation sandbox",
        "Velloe-Finora AI Co-pilot (Uncapped ledger queries)",
        "Automated tax provision & goal planning",
        "Priority encrypted sync & email support",
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Institutional & Platform",
      price: "Custom",
      period: "billed annually",
      desc: "For multi-entity businesses, wealth advisors, and fintech platforms.",
      features: [
        "Multi-tenant RBAC with custom audit trails",
        "Headless API Gateway access & webhooks",
        "Dedicated virtual private cloud deployment option",
        "Custom ERP & accounting ledger connectors",
        "Dedicated financial engineering architect",
      ],
      cta: "Contact Enterprise",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 border-t border-border/80 bg-muted/20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="growth" className="mb-3 text-xs">
            Predictable Value
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Transparent pricing for serious capital management.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed">
            Velloe-Finora typically uncovers more in preventable leakage within the first 30 days than an entire year of membership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all ${
                tier.highlighted
                  ? "border-primary bg-card shadow-xl ring-2 ring-primary/20 relative"
                  : "border-border/80 bg-card/60 hover:shadow-md"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="text-xs py-0.5 px-3 shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </Badge>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{tier.desc}</p>
                </div>

                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-foreground tabular-nums">{tier.price}</span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-medium">{tier.period}</span>
                </div>

                <div className="pt-4 border-t border-border/60 space-y-2.5">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs text-foreground font-medium">
                      <Check className="h-4 w-4 text-growth shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className={`w-full ${tier.highlighted ? "shadow-md shadow-primary/20" : ""}`}
                  variant={tier.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="#get-started">
                    <span>{tier.cta}</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
