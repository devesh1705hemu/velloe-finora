import { CurrencyCode, ID, ISODateString } from "@/types/common";

export type GoalPriority = "critical" | "high" | "medium" | "low";
export type GoalCategory =
  | "reserve_fund"
  | "debt_paydown"
  | "capex"
  | "runway_expansion"
  | "tax_provision";

export interface GoalContribution {
  id: ID;
  amount: number;
  date: ISODateString;
  note?: string;
  sourceAccount?: string;
}

export type ProjectionStatus =
  | "ahead_of_schedule"
  | "on_track"
  | "behind_schedule"
  | "at_risk";

export interface GoalProjection {
  projectedCompletionDate: ISODateString;
  projectedProgressPercentage: number;
  actualProgressPercentage: number;
  monthsRemainingToTarget: number;
  projectedMonthsToComplete: number;
  monthlyRequiredToHitTarget: number;
  status: ProjectionStatus;
  statusMessage: string;
}

export interface FinancialGoal {
  id: ID;
  title: string;
  category: GoalCategory;
  priority: GoalPriority;
  targetAmount: number;
  currentAmount: number; // Actual funded progress
  monthlyContribution: number; // Planned recurring allocation
  currency: CurrencyCode;
  targetDate: ISODateString;
  isCompleted: boolean;
  contributions: GoalContribution[];
  projection: GoalProjection;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
