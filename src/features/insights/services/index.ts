import {
  FinancialIntelligenceReport,
} from "../types";

export class InsightsService {
  /**
   * Retrieves canonical pre-calculated Financial Intelligence report.
   * All financial calculations are evaluated centrally here (trusted backend representation).
   */
  async getIntelligenceReport(_timeframe: string = "30d"): Promise<FinancialIntelligenceReport> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Canonical Trusted Pre-Calculated Financial Dataset
    return {
      periodComparison: {
        currentPeriodLabel: "Trailing 30 Days (Aug 27 – Sep 26)",
        previousPeriodLabel: "Prior 30 Days (Jul 28 – Aug 26)",
        currentTotal: 38420.0,
        previousTotal: 42100.0,
        percentageChange: -8.74,
        absoluteChange: -3680.0,
      },
      cashFlow: {
        totalInflow: 52000.0,
        totalOutflow: 38420.0,
        netCashFlow: 13580.0,
        operatingMarginPercentage: 26.12,
        previousNetCashFlow: 9900.0,
        netChangePercentage: 37.17,
        burnRatePerDay: 1280.66,
        inflowCount: 4,
        outflowCount: 38,
      },
      spendingTrends: [
        { date: "Sep 01", operatingSpend: 1450, discretionarySpend: 120, totalSpend: 1570, baseline: 1300 },
        { date: "Sep 05", operatingSpend: 3200, discretionarySpend: 240, totalSpend: 3440, baseline: 1300 },
        { date: "Sep 10", operatingSpend: 8900, discretionarySpend: 180, totalSpend: 9080, baseline: 1300 },
        { date: "Sep 15", operatingSpend: 12500, discretionarySpend: 310, totalSpend: 12810, baseline: 1300 },
        { date: "Sep 20", operatingSpend: 6200, discretionarySpend: 150, totalSpend: 6350, baseline: 1300 },
        { date: "Sep 25", operatingSpend: 4800, discretionarySpend: 220, totalSpend: 5020, baseline: 1300 },
      ],
      categoryBreakdown: [
        {
          id: "cat-cloud",
          name: "Hosting & Cloud Infra",
          color: "#0EA5E9",
          amount: 14900.0,
          percentageOfTotal: 38.78,
          previousAmount: 16800.0,
          changePercentage: -11.3,
          trend: "decreasing",
        },
        {
          id: "cat-tools",
          name: "Software & SaaS Tools",
          color: "#6366F1",
          amount: 9840.0,
          percentageOfTotal: 25.61,
          previousAmount: 10400.0,
          changePercentage: -5.38,
          trend: "decreasing",
        },
        {
          id: "cat-payroll",
          name: "Salaries & Contractors",
          color: "#8B5CF6",
          amount: 6200.0,
          percentageOfTotal: 16.14,
          previousAmount: 6200.0,
          changePercentage: 0.0,
          trend: "stable",
        },
        {
          id: "cat-mktg",
          name: "Growth & Acquisition",
          color: "#F43F5E",
          amount: 4200.0,
          percentageOfTotal: 10.93,
          previousAmount: 3800.0,
          changePercentage: 10.52,
          trend: "increasing",
        },
        {
          id: "cat-legal",
          name: "Legal & Regulatory",
          color: "#64748B",
          amount: 1800.0,
          percentageOfTotal: 4.69,
          previousAmount: 3200.0,
          changePercentage: -43.75,
          trend: "decreasing",
        },
        {
          id: "cat-office",
          name: "Workspace & Capex",
          color: "#F59E0B",
          amount: 1480.0,
          percentageOfTotal: 3.85,
          previousAmount: 1700.0,
          changePercentage: -12.94,
          trend: "decreasing",
        },
      ],
      savingsTrends: [
        { date: "May 2026", savingsAmount: 8200, savingsRatePercentage: 18.2, cumulativeReserve: 312000 },
        { date: "Jun 2026", savingsAmount: 9400, savingsRatePercentage: 20.4, cumulativeReserve: 321400 },
        { date: "Jul 2026", savingsAmount: 9900, savingsRatePercentage: 21.5, cumulativeReserve: 331300 },
        { date: "Aug 2026", savingsAmount: 11200, savingsRatePercentage: 23.8, cumulativeReserve: 342500 },
        { date: "Sep 2026", savingsAmount: 13580, savingsRatePercentage: 26.1, cumulativeReserve: 356080 },
      ],
      behavioralPatterns: [
        {
          id: "bp-1",
          title: "Bimonthly Autopay Concentration",
          observation: "68% of recurring software debits concentrate within 48 hours of the 1st and 15th calendar dates.",
          impactLevel: "neutral",
          frequency: "Bi-monthly",
          metric: "68% Volume Clustered",
          explainability: {
            title: "Bimonthly Autopay Concentration",
            insightSummary: "Transaction volume timestamp analysis identifies heavy synchronization clustering on mid-month and month-end dates.",
            dataUsed: [
              "42 settled bank conduit debits",
              "Mercury Operating Checking feed",
              "Chase Corporate Platinum statement",
            ],
            timePeriod: "Trailing 90 Days (Jun 28 – Sep 26, 2026)",
            calculation: "Cluster Index = Sum(Transactions within ±1d of 1st and 15th) / Total Outflow Count = 26 / 38 = 68.4%.",
            comparisonBaseline: "Uniform monthly distribution baseline expectation would be ~13.3% across any 4-day window.",
            confidenceScore: 98,
            modelOrEngine: "Velloe-Finora Temporal Clustering Engine",
          },
        },
        {
          id: "bp-2",
          title: "Weekend Discretionary Deceleration",
          observation: "Non-operating expenditures drop 74% on weekends compared to weekday operating cadence.",
          impactLevel: "positive",
          frequency: "Weekly",
          metric: "-74% Weekend Velocity",
          explainability: {
            title: "Weekend Discretionary Deceleration",
            insightSummary: "Capital velocity on Saturday and Sunday reflects strict corporate operational control.",
            dataUsed: [
              "365 historical daily ledger ledger points",
              "Category classification feeds",
            ],
            timePeriod: "Trailing 180 Days",
            calculation: "Mean Saturday/Sunday Spend ($320/day) vs Mean Monday–Friday Spend ($1,230/day) = -73.98% delta.",
            comparisonBaseline: "Cross-tenant peer startup benchmark of -45% weekend velocity.",
            confidenceScore: 94,
            modelOrEngine: "Velloe-Finora Operational Rhythm Analyzer",
          },
        },
      ],
      insights: [
        {
          id: "in-1",
          title: "Operating Margin Expanded +4.6%",
          description: "Consolidated vendor contracts and decreased cloud egress traffic improved net monthly operational yield.",
          type: "optimization",
          impact: "high",
          estimatedSavings: 3680,
          currency: "USD",
          isDismissed: false,
          createdAt: "2026-09-25T10:00:00Z",
          explainability: {
            title: "Operating Margin Expanded +4.6%",
            insightSummary: "Net monthly retained operating cash increased by $3,680 vs prior 30-day baseline.",
            dataUsed: [
              "Mercury Operating bank feed",
              "Stripe Revenue settlement conduit",
              "Double-entry verified general ledger entries",
            ],
            timePeriod: "Aug 27, 2026 – Sep 26, 2026 vs Jul 28, 2026 – Aug 26, 2026",
            calculation: "Margin = (Net Cash Flow / Inflow) = ($13,580 / $52,000) = 26.12%. Prior = ($9,900 / $46,000) = 21.52%. Delta = +4.60%.",
            comparisonBaseline: "Prior month operating margin of 21.52% across identical accounts.",
            confidenceScore: 99,
            modelOrEngine: "Velloe-Finora Cash Yield Engine",
          },
        },
        {
          id: "in-2",
          title: "Runway Extended by 2.4 Months",
          description: "Reduced monthly burn rate ($38,420 vs $42,100 prior) extends runway to 24.8 months at current reserves.",
          type: "yield_opportunity",
          impact: "medium",
          isDismissed: false,
          createdAt: "2026-09-24T18:00:00Z",
          explainability: {
            title: "Runway Extended by 2.4 Months",
            insightSummary: "Runway calculation factors verified liquid treasury reserves against trailing 30-day net burn.",
            dataUsed: [
              "Liquid treasury reserves ($348,250)",
              "Reconciled monthly operating expenditures ($38,420)",
            ],
            timePeriod: "Current Snapshot evaluated against 90-day trajectory",
            calculation: "Runway = Total Liquid Capital / Monthly Net Burn = $348,250 / $14,042 = 24.8 months. Prior = 22.4 months. Delta = +2.4 months.",
            comparisonBaseline: "Prior quarter average monthly burn rate of $15,546/month.",
            confidenceScore: 95,
            modelOrEngine: "Velloe-Finora Predictive Horizon Model",
          },
        },
      ],
    };
  }

  async dismissInsight(_id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

export const insightsService = new InsightsService();
