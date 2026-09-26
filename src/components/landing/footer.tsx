import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="resources" className="border-t border-border/80 bg-background text-foreground">
      {/* Pre-Footer Call to Action */}
      <div id="get-started" className="border-b border-border/80 py-16 lg:py-20 bg-primary/5 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Start Your Financial Intelligence Journey
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Ready to see where your capital is actually heading?
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Connect your accounts in read-only mode, scan for immediate leakage anomalies, and model your first 24-month scenario.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
            >
              Get Started with Velloe-Finora
            </Link>
            <Link
              href="#product"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-6 text-sm font-medium hover:bg-accent transition-colors"
            >
              Read Architecture Whitepaper
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Velloe-Finora transforms financial activity into actionable insights, potential savings opportunities, and future scenarios. Built on microservices, double-entry accuracy, and privacy-first architecture.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-growth" />
              <span>Zero data selling • Zero plaintext tokens</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#product" className="hover:text-foreground transition-colors">
                  Financial Intelligence
                </Link>
              </li>
              <li>
                <Link href="#leakage" className="hover:text-foreground transition-colors">
                  Money Leakage Engine
                </Link>
              </li>
              <li>
                <Link href="#goals" className="hover:text-foreground transition-colors">
                  Goal Planning
                </Link>
              </li>
              <li>
                <Link href="#platform" className="hover:text-foreground transition-colors">
                  Future Simulator
                </Link>
              </li>
              <li>
                <Link href="#ai" className="hover:text-foreground transition-colors">
                  Velloe-Finora AI Co-pilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#security" className="hover:text-foreground transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <Link href="#platform-scope" className="hover:text-foreground transition-colors">
                  Enterprise Scope
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  App Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#resources" className="hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#resources" className="hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#resources" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#resources" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {currentYear} Velloe-Finora Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono">v{siteConfig.version} • Production Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
