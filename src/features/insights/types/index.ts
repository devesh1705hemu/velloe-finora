import { CurrencyCode, ID, ISODateString } from "@/types/common";

export type InsightImpact = "high" | "medium" | "low";
export type InsightType = "optimization" | "anomalous_spend" | "yield_opportunity" | "tax_efficiency";

export interface ExplainabilityMetadata {
  title: string;
  insightSummary: string;
  dataUsed: string[];
  timePeriod: string;
  calculation: string;
  comparisonBaseline: string;
  confidenceScore: number;
  modelOrEngine: string;
}

export interface InsightAction {
  label: string;
  actionUrl?: string;
  type: "resolve" | "review" | "external";
}

export interface FinancialInsight {
  id: ID;
  title: string;
  description: string;
  type: InsightType;
  impact: InsightImpact;
  estimatedSavings?: number;
  currency?: CurrencyCode;
  action?: InsightAction;
  isDismissed: boolean;
  createdAt: ISODateString;
  explainability: ExplainabilityMetadata;
}

export interface SpendingTrendPoint {
  date: string;
  operatingSpend: number;
  discretionarySpend: number;
  totalSpend: number;
  baseline: number;
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  color: string;
  amount: number;
  percentageOfTotal: number;
  previousAmount: number;
  changePercentage: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface SavingsTrendPoint {
  date: string;
  savingsAmount: number;
  savingsRatePercentage: number;
  cumulativeReserve: number;
}

export interface CashFlowAnalysis {
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  operatingMarginPercentage: number;
  previousNetCashFlow: number;
  netChangePercentage: number;
  burnRatePerDay: number;
  inflowCount: number;
  outflowCount: number;
}

export interface BehavioralPattern {
  id: string;
  title: string;
  observation: string;
  impactLevel: "positive" | "neutral" | "attention";
  frequency: string;
  metric: string;
  explainability: ExplainabilityMetadata;
}

export interface PeriodComparison {
  currentPeriodLabel: string;
  previousPeriodLabel: string;
  currentTotal: number;
  previousTotal: number;
  percentageChange: number;
  absoluteChange: number;
}

export interface FinancialIntelligenceReport {
  periodComparison: PeriodComparison;
  cashFlow: CashFlowAnalysis;
  spendingTrends: SpendingTrendPoint[];
  categoryBreakdown: CategoryBreakdown[];
  savingsTrends: SavingsTrendPoint[];
  behavioralPatterns: BehavioralPattern[];
  insights: FinancialInsight[];
}
