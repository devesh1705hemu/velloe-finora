"use client";

import Link from "next/link";
import { Download, Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/features/dashboard/components";
import { TransactionRow } from "@/features/transactions/components";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTenant, PermissionGate } from "@/features/tenant";
import { Transaction } from "@/features/transactions/types";

export default function DashboardPage() {
  const { currentWorkspace, currentRole } = useTenant();

  const metrics = [
    {
      id: "m-1",
      label: "Total Liquid Capital",
      value: currentWorkspace.metrics.totalBalance,
      previousValue: currentWorkspace.metrics.totalBalance * 0.94,
      percentageChange: 6.4,
      trend: "up" as const,
      formatAs: "currency" as const,
      currency: "USD" as const,
      status: "growth" as const,
    },
    {
      id: "m-2",
      label: "Estimated Runway",
      value: currentWorkspace.metrics.runwayMonths,
      previousValue: currentWorkspace.metrics.runwayMonths - 1.2,
      percentageChange: 5.1,
      trend: "up" as const,
      formatAs: "number" as const,
      status: "growth" as const,
    },
    {
      id: "m-3",
      label: "Active Monthly Burn",
      value: currentWorkspace.metrics.monthlyBurn,
      previousValue: currentWorkspace.metrics.monthlyBurn * 1.03,
      percentageChange: -3.2,
      trend: "down" as const,
      formatAs: "currency" as const,
      currency: "USD" as const,
      status: "growth" as const,
    },
    {
      id: "m-4",
      label: "Identified Leakage",
      value: 1420.0,
      previousValue: 1850.0,
      percentageChange: -23.2,
      trend: "down" as const,
      formatAs: "currency" as const,
      currency: "USD" as const,
      status: "risk" as const,
    },
  ];

  const now = new Date().toISOString();

  const recentTransactions: Transaction[] = [
    {
      id: "tx-01",
      accountId: "acc-mercury-01",
      accountName: "Mercury Operating Checking",
      amount: 14500.0,
      currency: "USD",
      type: "income",
      status: "settled",
      merchantName: "Stripe Recurring Platform Inflow",
      category: { id: "cat-rev", name: "SaaS Subscriptions", slug: "revenue" },
      postedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      createdAt: now,
      isFlaggedAsLeakage: false,
    },
    {
      id: "tx-02",
      accountId: "acc-mercury-01",
      accountName: "Mercury Operating Checking",
      amount: 420.0,
      currency: "USD",
      type: "expense",
      status: "settled",
      merchantName: "Datadog Cloud Monitoring",
      category: { id: "cat-cloud", name: "Infrastructure & DevOps", slug: "devops" },
      postedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      createdAt: now,
      isFlaggedAsLeakage: true,
    },
    {
      id: "tx-03",
      accountId: "acc-chase-corp",
      accountName: "Chase Corporate Card",
      amount: 38.0,
      currency: "USD",
      type: "expense",
      status: "settled",
      merchantName: "Orphaned Figma Design Seat",
      category: { id: "cat-tools", name: "Design Software", slug: "software" },
      postedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      createdAt: now,
      isFlaggedAsLeakage: true,
    },
    {
      id: "tx-04",
      accountId: "acc-mercury-01",
      accountName: "Mercury Operating Checking",
      amount: 12500.0,
      currency: "USD",
      type: "expense",
      status: "settled",
      merchantName: "AWS Cloud Infrastructure US-East",
      category: { id: "cat-cloud", name: "Hosting & CDN", slug: "hosting" },
      postedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      createdAt: now,
      isFlaggedAsLeakage: false,
    },
  ];

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Workspace Banner */}
        <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {currentWorkspace.name}
                </h1>
                <Badge
                  variant={currentWorkspace.type === "personal" ? "secondary" : "default"}
                  className="capitalize font-mono text-[10px]"
                >
                  {currentWorkspace.type}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                <span>Active Role: <strong className="text-foreground capitalize">{currentRole.replace("_", " ")}</strong></span>
                <span>•</span>
                <span>Currency: <strong className="text-foreground">{currentWorkspace.currency}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-growth">
                  <ShieldCheck className="h-3.5 w-3.5" /> Double-entry verified
                </span>
              </p>
            </div>

            {/* Quick Actions with Permission Gating */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <PermissionGate
                permission="canExportData"
                fallback={
                  <Button variant="outline" size="sm" disabled className="text-xs">
                    Export (Role Restricted)
                  </Button>
                }
              >
                <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
                  <Link href="/transactions?action=export">
                    <Download className="h-3.5 w-3.5" /> Export Ledger
                  </Link>
                </Button>
              </PermissionGate>

              <Button asChild size="sm" className="text-xs gap-1.5">
                <Link href="/ai">
                  <Sparkles className="h-3.5 w-3.5" /> Ask Finora AI
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 4 Core Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} data={metric} />
          ))}
        </div>

        {/* Intelligence Insights & Recent Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: Recent Transactions */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-bold text-foreground">
                  Recent Ledger Activity
                </CardTitle>
                <Link
                  href="/transactions"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {recentTransactions.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Side: Autonomous Recommendations */}
          <div className="space-y-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold text-foreground">
                    Finora AI Recommendation
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  Consolidating your 2 monitoring subscriptions into an annual commitment could recover <strong>$1,420/yr</strong> in recurring leakage.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button asChild size="sm" variant="default" className="text-xs h-8">
                    <Link href="/leakage">Review Anomalies</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="text-xs h-8">
                    <Link href="/future">Simulate Impact</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Workspace Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Runway Projection</span>
                  <span className="font-semibold text-growth tabular-nums">
                    {currentWorkspace.metrics.runwayMonths} Months
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reconciled Feeds</span>
                  <span className="font-semibold text-foreground">3 Accounts (Mercury, Chase, Stripe)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Team Access</span>
                  <span className="font-semibold text-foreground">
                    {currentWorkspace.metrics.teamMembersCount} Member{currentWorkspace.metrics.teamMembersCount > 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
