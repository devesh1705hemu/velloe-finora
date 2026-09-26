import { describe, it, expect } from "vitest";
import { calculateSimulationOutputs } from "@/features/future/utils";
import { ACTUAL_FINANCIAL_BASELINE } from "@/features/future/services";
import { ScenarioInputs } from "@/features/future/types";

describe("Future Simulator Calculation Engine", () => {
  it("preserves actual baseline data immutability during simulation", () => {
    const baselineCopy = JSON.parse(JSON.stringify(ACTUAL_FINANCIAL_BASELINE));

    const testInputs: ScenarioInputs = {
      discretionarySpendPctDelta: -50,
      cloudInfraSpendPctDelta: -20,
      softwareSaaSSpendPctDelta: -10,
      headcountDelta: 3,
      monthlySavingsContribution: 25000,
      monthlyGoalContribution: 40000,
    };

    const outputs = calculateSimulationOutputs(ACTUAL_FINANCIAL_BASELINE, testInputs);

    // Verify baseline itself remains completely unchanged
    expect(ACTUAL_FINANCIAL_BASELINE).toEqual(baselineCopy);
    expect(outputs.simulatedMonthlySpend).toBeDefined();
  });

  it("calculates annualized difference accurately as 12x monthly difference", () => {
    const testInputs: ScenarioInputs = {
      discretionarySpendPctDelta: -25,
      cloudInfraSpendPctDelta: -10,
      softwareSaaSSpendPctDelta: -15,
      headcountDelta: 0,
      monthlySavingsContribution: 16500,
      monthlyGoalContribution: 35000,
    };

    const outputs = calculateSimulationOutputs(ACTUAL_FINANCIAL_BASELINE, testInputs);

    expect(outputs.annualizedScenarioDifference).toBe(
      outputs.monthlyScenarioDifference * 12
    );
  });

  it("reflects headcount additions in monthly operational spend", () => {
    const inputsZeroHires: ScenarioInputs = {
      discretionarySpendPctDelta: 0,
      cloudInfraSpendPctDelta: 0,
      softwareSaaSSpendPctDelta: 0,
      headcountDelta: 0,
      monthlySavingsContribution: 13580,
      monthlyGoalContribution: 31500,
    };

    const inputsTwoHires: ScenarioInputs = {
      ...inputsZeroHires,
      headcountDelta: 2, // 2 * $8,500 = $17,000 increase
    };

    const outZero = calculateSimulationOutputs(ACTUAL_FINANCIAL_BASELINE, inputsZeroHires);
    const outTwo = calculateSimulationOutputs(ACTUAL_FINANCIAL_BASELINE, inputsTwoHires);

    expect(outTwo.simulatedMonthlySpend - outZero.simulatedMonthlySpend).toBe(17000);
    expect(outTwo.simulatedRunwayMonths).toBeLessThan(outZero.simulatedRunwayMonths);
  });

  it("projects milestone timeline accelerations when goal contributions increase", () => {
    const higherGoalContribution: ScenarioInputs = {
      discretionarySpendPctDelta: 0,
      cloudInfraSpendPctDelta: 0,
      softwareSaaSSpendPctDelta: 0,
      headcountDelta: 0,
      monthlySavingsContribution: 13580,
      monthlyGoalContribution: 50000, // significantly higher than baseline $31,500
    };

    const outputs = calculateSimulationOutputs(ACTUAL_FINANCIAL_BASELINE, higherGoalContribution);

    const primaryGoal = outputs.goalTimelineImpacts[0];
    expect(primaryGoal).toBeDefined();
    expect(primaryGoal?.status).toBe("accelerated");
    expect(primaryGoal?.monthsDifference).toBeGreaterThan(0);
  });
});
