import { ID, ISODateString } from "@/types/common";

export interface ActualFinancialBaseline {
  monthlyRevenue: number;
  monthlyOperatingSpend: number;
  categorySpend: {
    discretionary: number;
    cloudInfra: number;
    softwareSaaS: number;
    operations: number;
  };
  monthlySavings: number;
  monthlyGoalContribution: number;
  treasuryReserveBalance: number;
  runwayMonths: number;
}

export interface ScenarioInputs {
  discretionarySpendPctDelta: number; // e.g. -20% or +15%
  cloudInfraSpendPctDelta: number; // e.g. -15% or +30%
  softwareSaaSSpendPctDelta: number; // e.g. -25% or +10%
  headcountDelta: number; // e.g. 0 to +10 engineers ($8,500/mo each)
  monthlySavingsContribution: number; // user slider e.g. $15,000/mo
  monthlyGoalContribution: number; // user slider e.g. $32,000/mo
}

export interface GoalTimelineImpact {
  goalId: string;
  goalTitle: string;
  baselineMonths: number;
  scenarioMonths: number;
  monthsDifference: number; // positive = accelerated (earlier)
  status: "accelerated" | "delayed" | "unchanged";
}

export interface ProjectionPoint {
  month: string;
  monthIndex: number;
  baselineCapital: number;
  scenarioCapital: number;
  potentialNetDifference: number;
}

export interface ScenarioOutputs {
  simulatedMonthlySpend: number;
  simulatedMonthlySavings: number;
  monthlyScenarioDifference: number;
  annualizedScenarioDifference: number;
  simulatedRunwayMonths: number;
  runwayDeltaMonths: number;
  goalTimelineImpacts: GoalTimelineImpact[];
  projectionPoints: ProjectionPoint[];
}

export interface SimulationScenario {
  id: ID;
  name: string;
  description: string;
  isBaseline: boolean;
  inputs: ScenarioInputs;
  outputs: ScenarioOutputs;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SaveScenarioInput {
  name: string;
  description: string;
  inputs: ScenarioInputs;
}
