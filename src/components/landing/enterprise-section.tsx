import { User, Building2, Landmark, Code, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EnterpriseSection() {
  const audiences = [
    {
      title: "For Individuals & Founders",
      role: "Personal & Early-Stage Capital",
      icon: User,
      desc: "Holistic multi-account visibility, forward net worth simulations, emergency runway reserves, and autonomous subscription leakage elimination.",
      capabilities: [
        "Consolidated personal & business bank accounts",
        "Predictive cash runway and tax reserve calculator",
        "Zero-prompt recurring charge anomaly alerts",
      ],
    },
    {
      title: "For Employers & Businesses",
      role: "Corporate Governance & Wellness",
      icon: Building2,
      desc: "Provide teams with corporate card expense controls, department budget variance modeling, and confidential financial wellness tools for employees.",
      capabilities: [
        "Department-level burn rate and budget tracking",
        "Vendor drift & duplicate invoice prevention",
        "Employee confidential financial health benefits",
      ],
    },
    {
      title: "For Financial Institutions",
      role: "Advisory & Portfolio Intelligence",
      icon: Landmark,
      desc: "Equip wealth advisors, private bankers, and credit risk analysts with real-time holistic cash flow diagnostics rather than 90-day stale statements.",
      capabilities: [
        "Dynamic debt-service coverage ratio (DSCR) scoring",
        "Predictive liquidity stress testing for credit facilities",
        "White-glove advisory co-pilot interface",
      ],
    },
    {
      title: "For Fintech Platforms",
      role: "Embedded Intelligence APIs",
      icon: Code,
      desc: "Integrate Velloe-Finora's autonomous categorization, leakage detection algorithms, and simulation models directly into your modern neobank or SaaS application.",
      capabilities: [
        "Headless REST & GraphQL API endpoints",
        "Real-time webhook triggers on detected leakage anomalies",
        "SOC2/ISO27001-ready data isolation architecture",
      ],
    },
  ];

  return (
    <section id="platform-scope" className="py-20 lg:py-28 border-t border-border/80 bg-muted/20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <Badge variant="outline" className="mb-3 text-xs">
            Architectural Horizon
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Engineered to scale from individual founders to institutional platforms.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed">
            Velloe-Finora&apos;s modular microservice architecture is built from first principles to support single-operator agility while providing the strict tenant isolation, auditability, and API scale required by enterprise ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {audiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.role}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

                  <div className="pt-2 space-y-2 border-t border-border/40">
                    {item.capabilities.map((cap) => (
                      <div key={cap} className="flex items-center gap-2 text-xs text-foreground font-medium">
                        <CheckCircle2 className="h-4 w-4 text-growth shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
