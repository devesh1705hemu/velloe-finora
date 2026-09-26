import { CurrencyCode, ID, ISODateString } from "@/types/common";
import { ExplainabilityMetadata } from "@/features/insights/types";

export type LeakageCategory =
  | "recurring_spend"
  | "subscription_pattern"
  | "spending_anomaly"
  | "budget_drift"
  | "potential_savings";

export type LeakageSeverity = "critical" | "high" | "medium" | "low";

export type OpportunityStatus = "active" | "optimized" | "dismissed";

export interface SupportingTransactionRef {
  id: ID;
  date: string;
  merchant: string;
  amount: number;
  currency: CurrencyCode;
  category: string;
  accountName: string;
}

export interface PotentialOpportunity {
  id: ID;
  title: string;
  category: LeakageCategory;
  categoryLabel: string;
  transactionCount: number;
  currentAmount: number;
  previousAmount: number;
  changePercentage: number;
  potentialSavings: number;
  currency: CurrencyCode;
  whyFlagged: string;
  recommendedOptimization: string;
  status: OpportunityStatus;
  detectedAt: ISODateString;
  supportingTransactions: SupportingTransactionRef[];
  explainability: ExplainabilityMetadata;
}

export interface PotentialLeakageReport {
  totalIdentifiedOptimization: number;
  annualizedSavingsPotential: number;
  activeOpportunitiesCount: number;
  auditedSubscriptionsCount: number;
  currency: CurrencyCode;
  opportunities: PotentialOpportunity[];
}
