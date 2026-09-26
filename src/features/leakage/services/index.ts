import {
  PotentialLeakageReport,
  PotentialOpportunity,
  OpportunityStatus,
} from "../types";

export class LeakageService {
  private opportunities: PotentialOpportunity[] = [
    {
      id: "opp-food-delivery",
      title: "Food Delivery & Team Catering",
      category: "spending_anomaly",
      categoryLabel: "Spending Anomaly",
      transactionCount: 9,
      currentAmount: 240.0,
      previousAmount: 203.0,
      changePercentage: 18.22,
      potentialSavings: 60.0,
      currency: "USD",
      whyFlagged:
        "Discretionary meal velocity accelerated +18.2% over prior period across 9 separate transactions. Reviewing order consolidation or corporate meal programs represents a potential budget optimization opportunity.",
      recommendedOptimization:
        "Consider consolidating individual ad-hoc meal orders into scheduled weekly team catering to capture volume discounts.",
      status: "active",
      detectedAt: "2026-09-24T12:00:00Z",
      supportingTransactions: [
        { id: "tx-s1", date: "2026-09-24", merchant: "DoorDash Corporate", amount: 34.5, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
        { id: "tx-s2", date: "2026-09-22", merchant: "Uber Eats Order", amount: 28.2, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
        { id: "tx-s3", date: "2026-09-19", merchant: "Sweetgreen", amount: 22.0, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
        { id: "tx-s4", date: "2026-09-17", merchant: "DoorDash Late Night", amount: 41.8, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
        { id: "tx-s5", date: "2026-09-14", merchant: "Caviar Delivery", amount: 36.5, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
        { id: "tx-s6", date: "2026-09-11", merchant: "Chipotle Online", amount: 19.4, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
        { id: "tx-s7", date: "2026-09-08", merchant: "Uber Eats Delivery", amount: 26.1, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
        { id: "tx-s8", date: "2026-09-05", merchant: "DoorDash Lunch Pod", amount: 18.5, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
        { id: "tx-s9", date: "2026-09-02", merchant: "Blue Bottle Coffee", amount: 13.0, currency: "USD", category: "Meals", accountName: "Chase Corporate Card" },
      ],
      explainability: {
        title: "Food Delivery & Team Catering Acceleration",
        insightSummary: "9 discretionary meal debit transactions totaled $240.00 (+18.2% vs previous 30-day baseline).",
        dataUsed: [
          "9 Chase Corporate Platinum card debit line items",
          "Merchant code 5812 (Eating Places and Restaurants)",
          "Reconciled ledger category: Meals & Discretionary",
        ],
        timePeriod: "Aug 27, 2026 – Sep 26, 2026 vs Jul 28, 2026 – Aug 26, 2026",
        calculation: "Variance = (Current $240.00 - Prior $203.00) / Prior $203.00 = +18.22%. Exceeds the +15% quarterly discretionary threshold.",
        comparisonBaseline: "Trailing 90-day median expenditure of $201.50/month across identical team cards.",
        confidenceScore: 92,
        modelOrEngine: "Velloe-Finora Discretionary Velocity Model",
      },
    },
    {
      id: "opp-datadog",
      title: "Datadog APM Host Allocation",
      category: "subscription_pattern",
      categoryLabel: "Subscription Pattern",
      transactionCount: 2,
      currentAmount: 420.0,
      previousAmount: 325.0,
      changePercentage: 29.23,
      potentialSavings: 190.0,
      currency: "USD",
      whyFlagged:
        "4 host agents have not emitted telemetry or container metrics for >30 consecutive days, but continue to bill at standard on-demand seat rates ($95/seat).",
      recommendedOptimization:
        "Decommission the 4 idle host agents or downgrade the cluster tier to save $190/month ($2,280/year).",
      status: "active",
      detectedAt: "2026-09-23T14:30:00Z",
      supportingTransactions: [
        { id: "tx-d1", date: "2026-09-23", merchant: "Datadog Cloud Monitoring", amount: 420.0, currency: "USD", category: "Hosting & Cloud Infra", accountName: "Mercury Operating Checking" },
        { id: "tx-d2", date: "2026-08-23", merchant: "Datadog Cloud Monitoring", amount: 325.0, currency: "USD", category: "Hosting & Cloud Infra", accountName: "Mercury Operating Checking" },
      ],
      explainability: {
        title: "Datadog APM Unutilized Host Allocation",
        insightSummary: "4 host agent licenses are billed without active telemetry traffic in production logs.",
        dataUsed: [
          "Mercury Operating Checking recurring debit",
          "Datadog API subscription manifest & active node ping counts",
        ],
        timePeriod: "Trailing 30 Days (Aug 24 – Sep 23, 2026)",
        calculation: "Idle Seat Cost = 2 idle host agents * $95.00/mo = $190.00/mo potential recurring recovery.",
        comparisonBaseline: "Allocated capacity (8 hosts) vs Verified Active Workload (4 hosts).",
        confidenceScore: 97,
        modelOrEngine: "Velloe-Finora SaaS Utilization Scanner",
      },
    },
    {
      id: "opp-aws-egress",
      title: "AWS Inter-Region Cloud Data Transfer",
      category: "budget_drift",
      categoryLabel: "Budget Drift",
      transactionCount: 3,
      currentAmount: 1250.0,
      previousAmount: 980.0,
      changePercentage: 27.55,
      potentialSavings: 380.0,
      currency: "USD",
      whyFlagged:
        "Cross-region S3 replication traffic increased by 27.5% without a corresponding increase in production API ingress requests.",
      recommendedOptimization:
        "Enable S3 Same-Region replication or review backup policies to prevent cross-continental egress charges.",
      status: "active",
      detectedAt: "2026-09-21T00:01:00Z",
      supportingTransactions: [
        { id: "tx-a1", date: "2026-09-21", merchant: "AWS Cloud Infrastructure US-East", amount: 12500.0, currency: "USD", category: "Hosting & Cloud Infra", accountName: "Mercury Operating Checking" },
      ],
      explainability: {
        title: "AWS Inter-Region Data Transfer Drift",
        insightSummary: "Inter-region data egress line item grew disproportionately to active user concurrency.",
        dataUsed: [
          "AWS CloudWatch detailed billing reports",
          "Production transaction throughput logs",
        ],
        timePeriod: "September 2026 Billing Cycle",
        calculation: "Egress Delta = (Current $1,250 - Baseline $980) = +$270.00/mo anomalous replication overhead.",
        comparisonBaseline: "Trailing 6-month historical baseline of $0.08 per active session.",
        confidenceScore: 94,
        modelOrEngine: "Velloe-Finora Cloud Cost Anomaly Detector",
      },
    },
    {
      id: "opp-zoom-dup",
      title: "Zoom Communications Duplicate Add-on",
      category: "recurring_spend",
      categoryLabel: "Recurring Spend",
      transactionCount: 2,
      currentAmount: 145.0,
      previousAmount: 145.0,
      changePercentage: 0.0,
      potentialSavings: 145.0,
      currency: "USD",
      whyFlagged:
        "Identical webinar capacity was purchased on a secondary corporate card while the organization already maintains an enterprise workspace license covering all active seats.",
      recommendedOptimization:
        "Cancel the standalone subscription and assign the existing enterprise webinar add-on seat to the host user.",
      status: "active",
      detectedAt: "2026-09-15T11:20:00Z",
      supportingTransactions: [
        { id: "tx-z1", date: "2026-09-15", merchant: "Duplicate Zoom Video Add-on", amount: 145.0, currency: "USD", category: "Communications", accountName: "Chase Corporate Card" },
        { id: "tx-z2", date: "2026-08-15", merchant: "Duplicate Zoom Video Add-on", amount: 145.0, currency: "USD", category: "Communications", accountName: "Chase Corporate Card" },
      ],
      explainability: {
        title: "Zoom Communications Duplicate License",
        insightSummary: "Overlapping subscription detected across distinct card conduits for the same provider.",
        dataUsed: [
          "Chase Corporate card statements",
          "Organization Enterprise master agreement",
        ],
        timePeriod: "Trailing 60 Days",
        calculation: "Redundant License Cost = 1 redundant seat * $145.00/mo = $145.00/mo.",
        comparisonBaseline: "Single unified enterprise vendor contract agreement.",
        confidenceScore: 99,
        modelOrEngine: "Velloe-Finora Vendor Duplication Matcher",
      },
    },
    {
      id: "opp-figma-orphaned",
      title: "Orphaned Figma Design Seat",
      category: "potential_savings",
      categoryLabel: "Potential Savings",
      transactionCount: 1,
      currentAmount: 45.0,
      previousAmount: 45.0,
      changePercentage: 0.0,
      potentialSavings: 45.0,
      currency: "USD",
      whyFlagged:
        "Design editor license assigned to contractor who completed their contract 42 days ago without subsequent workspace activity.",
      recommendedOptimization:
        "Downgrade departed contractor to free viewer role to save $45/month ($540/year).",
      status: "active",
      detectedAt: "2026-09-22T08:00:00Z",
      supportingTransactions: [
        { id: "tx-f1", date: "2026-09-22", merchant: "Orphaned Figma Design Seat", amount: 45.0, currency: "USD", category: "Software & SaaS Tools", accountName: "Chase Corporate Card" },
      ],
      explainability: {
        title: "Orphaned Figma Editor Seat",
        insightSummary: "Paid editor role assigned to an inactive contractor user account.",
        dataUsed: [
          "Figma workspace audit log",
          "HR offboarding timestamp records",
        ],
        timePeriod: "Inactive for 42 days",
        calculation: "1 editor seat * $45.00/mo = $45.00/mo ($540.00/yr).",
        comparisonBaseline: "Active contributor status threshold of at least 1 file edit per 30 days.",
        confidenceScore: 98,
        modelOrEngine: "Velloe-Finora SaaS Seat Reconciler",
      },
    },
  ];

  async getLeakageReport(categoryFilter?: string): Promise<PotentialLeakageReport> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    let items = [...this.opportunities];
    if (categoryFilter && categoryFilter !== "all") {
      items = items.filter((o) => o.category === categoryFilter);
    }

    const activeItems = items.filter((o) => o.status === "active");
    const totalIdentifiedOptimization = activeItems.reduce((acc, o) => acc + o.potentialSavings, 0);

    return {
      totalIdentifiedOptimization,
      annualizedSavingsPotential: totalIdentifiedOptimization * 12,
      activeOpportunitiesCount: activeItems.length,
      auditedSubscriptionsCount: 28,
      currency: "USD",
      opportunities: items,
    };
  }

  async updateOpportunityStatus(id: string, status: OpportunityStatus): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.opportunities = this.opportunities.map((o) =>
      o.id === id ? { ...o, status } : o
    );
  }
}

export const leakageService = new LeakageService();
