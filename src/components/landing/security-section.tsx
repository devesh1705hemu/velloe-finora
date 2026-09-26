import {
  Lock,
  KeyRound,
  Shield,
  FileCheck2,
  Database,
  EyeOff,
  Server,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SecuritySection() {
  const securityPillars = [
    {
      title: "Privacy-First Architecture",
      desc: "Zero monetization of customer transactional data. Finora does not sell, broker, or train public AI models on your private financial information.",
      icon: EyeOff,
    },
    {
      title: "Secure Authentication & MFA",
      desc: "Multi-factor authentication (TOTP/WebAuthn hardware keys), ephemeral JWT sessions with automated token rotation, and brute-force lockouts.",
      icon: KeyRound,
    },
    {
      title: "Encryption-Ready Infrastructure",
      desc: "TLS 1.3 encryption in transit with forward secrecy and AES-256 encryption at rest for all database volumes, ledger tables, and object storage.",
      icon: Lock,
    },
    {
      title: "Granular Role-Based Access (RBAC)",
      desc: "Strict separation of privileges: separate permissions for Administrators, Financial Analysts, Internal Auditors, and Read-Only Viewers.",
      icon: Shield,
    },
    {
      title: "Tamper-Evident Auditability",
      desc: "Every query, adjustment, and configuration change generates an immutable cryptographic audit log for complete accountability.",
      icon: FileCheck2,
    },
    {
      title: "Absolute Data Controls & Portability",
      desc: "Complete tenant data ownership. Export your entire raw ledger in standard formats anytime or purge account records with verified deletion guarantees.",
      icon: Database,
    },
  ];

  return (
    <section id="security" className="py-20 lg:py-28 border-t border-border/80 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <Badge variant="growth" className="mb-3 text-xs">
            Zero-Trust Foundation
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Institutional-grade security from the core up.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed">
            Financial intelligence demands uncompromised privacy. Finora is engineered from the ground up to adhere to zero-trust principles, cryptographic safeguards, and strict data sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Compliance & Standards Note */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Server className="h-4 w-4 text-growth" /> Standards & Compliance Roadmap
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Finora&apos;s technical controls, access policies, and infrastructure boundaries are architected for strict alignment with SOC 2 Type II, ISO 27001, and GDPR standards. Continuous compliance testing and third-party security audits are built into our deployment pipeline.
            </p>
          </div>
          <Badge variant="outline" className="text-xs py-1 px-3 whitespace-nowrap">
            Zero-Trust Design Model
          </Badge>
        </div>
      </div>
    </section>
  );
}
