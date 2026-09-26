import { ApiResponse } from "@/types/api";
import {
  ActualFinancialBaseline,
  SaveScenarioInput,
  ScenarioInputs,
  SimulationScenario,
} from "../types";
import { calculateSimulationOutputs } from "../utils";

const STORAGE_KEY = "velloe_finora_scenarios_v1";

export const ACTUAL_FINANCIAL_BASELINE: ActualFinancialBaseline = {
  monthlyRevenue: 52000,
  monthlyOperatingSpend: 38420,
  categorySpend: {
    discretionary: 2400,
    cloudInfra: 14900,
    softwareSaaS: 9840,
    operations: 11280,
  },
  monthlySavings: 13580,
  monthlyGoalContribution: 31500,
  treasuryReserveBalance: 348250,
  runwayMonths: 24.8,
};

export const DEFAULT_BASELINE_INPUTS: ScenarioInputs = {
  discretionarySpendPctDelta: 0,
  cloudInfraSpendPctDelta: 0,
  softwareSaaSSpendPctDelta: 0,
  headcountDelta: 0,
  monthlySavingsContribution: 13580,
  monthlyGoalContribution: 31500,
};

const INITIAL_SCENARIOS: SimulationScenario[] = [
  {
    id: "scen-a",
    name: "Scenario A: Lean Optimization",
    description: "Trim discretionary food/meals by 25%, consolidate SaaS tools by 15%, boost savings.",
    isBaseline: false,
    inputs: {
      discretionarySpendPctDelta: -25,
      cloudInfraSpendPctDelta: -10,
      softwareSaaSSpendPctDelta: -15,
      headcountDelta: 0,
      monthlySavingsContribution: 16500,
      monthlyGoalContribution: 35000,
    },
    outputs: calculateSimulationOutputs(ACTUAL_FINANCIAL_BASELINE, {
      discretionarySpendPctDelta: -25,
      cloudInfraSpendPctDelta: -10,
      softwareSaaSSpendPctDelta: -15,
      headcountDelta: 0,
      monthlySavingsContribution: 16500,
      monthlyGoalContribution: 35000,
    }),
    createdAt: "2026-09-20T10:00:00.000Z",
    updatedAt: "2026-09-20T10:00:00.000Z",
  },
  {
    id: "scen-b",
    name: "Scenario B: Engineering Expansion",
    description: "Add 2 Senior Systems Engineers (+$17k/mo) with +20% cloud compute allocation.",
    isBaseline: false,
    inputs: {
      discretionarySpendPctDelta: 10,
      cloudInfraSpendPctDelta: 20,
      softwareSaaSSpendPctDelta: 10,
      headcountDelta: 2,
      monthlySavingsContribution: 10000,
      monthlyGoalContribution: 28000,
    },
    outputs: calculateSimulationOutputs(ACTUAL_FINANCIAL_BASELINE, {
      discretionarySpendPctDelta: 10,
      cloudInfraSpendPctDelta: 20,
      softwareSaaSSpendPctDelta: 10,
      headcountDelta: 2,
      monthlySavingsContribution: 10000,
      monthlyGoalContribution: 28000,
    }),
    createdAt: "2026-09-22T14:00:00.000Z",
    updatedAt: "2026-09-22T14:00:00.000Z",
  },
  {
    id: "scen-c",
    name: "Scenario C: Treasury Accelerated Run",
    description: "Max out treasury goal allocations ($45k/mo) while keeping cloud and tooling flat.",
    isBaseline: false,
    inputs: {
      discretionarySpendPctDelta: -15,
      cloudInfraSpendPctDelta: 0,
      softwareSaaSSpendPctDelta: -5,
      headcountDelta: 0,
      monthlySavingsContribution: 20000,
      monthlyGoalContribution: 45000,
    },
    outputs: calculateSimulationOutputs(ACTUAL_FINANCIAL_BASELINE, {
      discretionarySpendPctDelta: -15,
      cloudInfraSpendPctDelta: 0,
      softwareSaaSSpendPctDelta: -5,
      headcountDelta: 0,
      monthlySavingsContribution: 20000,
      monthlyGoalContribution: 45000,
    }),
    createdAt: "2026-09-24T09:30:00.000Z",
    updatedAt: "2026-09-24T09:30:00.000Z",
  },
];

export class FutureService {
  private getStore(): SimulationScenario[] {
    if (typeof window === "undefined") {
      return INITIAL_SCENARIOS;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SCENARIOS));
      return INITIAL_SCENARIOS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SCENARIOS;
    }
  }

  private saveStore(scenarios: SimulationScenario[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    }
  }

  async getActualBaseline(): Promise<ApiResponse<ActualFinancialBaseline>> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      success: true,
      data: ACTUAL_FINANCIAL_BASELINE,
      timestamp: new Date().toISOString(),
      message: "Actual baseline retrieved",
    };
  }

  async getSavedScenarios(): Promise<ApiResponse<SimulationScenario[]>> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return {
      success: true,
      data: this.getStore(),
      timestamp: new Date().toISOString(),
      message: "Saved scenarios retrieved",
    };
  }

  async saveScenario(payload: SaveScenarioInput): Promise<ApiResponse<SimulationScenario>> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = this.getStore();

    const outputs = calculateSimulationOutputs(
      ACTUAL_FINANCIAL_BASELINE,
      payload.inputs
    );

    const newScenario: SimulationScenario = {
      id: `scen-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: payload.name,
      description: payload.description,
      isBaseline: false,
      inputs: payload.inputs,
      outputs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newScenario, ...list];
    this.saveStore(updated);

    return {
      success: true,
      data: newScenario,
      timestamp: new Date().toISOString(),
      message: "Scenario saved successfully",
    };
  }

  async deleteScenario(id: string): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const list = this.getStore();
    const filtered = list.filter((s) => s.id !== id);
    this.saveStore(filtered);

    return {
      success: true,
      data: undefined as unknown as void,
      timestamp: new Date().toISOString(),
      message: "Scenario deleted successfully",
    };
  }
}

export const futureService = new FutureService();
