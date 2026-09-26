import { Sparkles, MessageSquare, Receipt, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FinoraAISection() {
  const capabilities = [
    {
      title: "Contextual Ledger Chat",
      desc: "Ask complex natural-language queries like 'What was our blended customer acquisition cost across Stripe and Meta in Q3?' and receive instant, auditable calculations.",
      icon: MessageSquare,
    },
    {
      title: "Automated Receipt & Invoice Ingestion",
      desc: "Upload unstructured PDFs or images. Finora AI extracts line items, matches them to bank feeds, identifies tax-deductible categories, and flags missing receipts.",
      icon: Receipt,
    },
    {
      title: "Zero-Prompt Anomaly Alerts",
      desc: "Proactively alerts you before recurring billing spikes, merchant double-swipes, or cash flow crunches happen — before month-end reviews.",
      icon: Sparkles,
    },
    {
      title: "Private & Air-Gapped Reasoning",
      desc: "Your proprietary financial data is never trained into public LLM models. Queries execute against your isolated workspace with strict token redaction.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="ai" className="py-20 lg:py-28 border-t border-border/80 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: AI Conversation Demonstration */}
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-intelligence text-white shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">Velloe-Finora AI Co-pilot</span>
                </div>
                <Badge variant="growth" className="text-[10px]">
                  Online • Ledger Synced
                </Badge>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-primary px-4 py-2.5 text-primary-foreground shadow-xs">
                    Why did cloud hosting expenses surge 24% between August and September?
                  </div>
                </div>

                {/* Assistant Response */}
                <div className="flex justify-start items-start gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-intelligence text-white text-[10px] font-bold mt-1">
                    AI
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-none border border-border bg-muted/40 p-4 text-foreground space-y-2 shadow-xs leading-relaxed">
                    <p>
                      I analyzed your AWS and Datadog invoices for both months. The <strong>+$3,840.12 (24.2%)</strong> increase is attributed to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                      <li>
                        <strong className="text-foreground">Unattached EBS Volumes:</strong> 8 orphaned storage volumes added on Aug 28 ($1,420/mo).
                      </li>
                      <li>
                        <strong className="text-foreground">Cross-Region Egress:</strong> Database replication traffic spike during staging tests ($1,810).
                      </li>
                    </ul>
                    <div className="mt-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>Source: Invoices #INV-8891 & #INV-9204</span>
                      <span className="font-semibold text-growth">✓ 99.4% Confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Philosophy */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <Badge variant="intelligence" className="text-xs">
              05 • Autonomous Velloe-Finora AI
            </Badge>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              An intelligent co-pilot that understands financial causality.
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              Standard chatbots answer generic questions. Velloe-Finora AI connects directly to your verified ledger, contracts, and banking APIs to deliver context-grounded calculations and proactive advice.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {capabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-intelligence/10 text-intelligence">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
