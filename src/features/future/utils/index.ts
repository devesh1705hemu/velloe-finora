import {
  ActualFinancialBaseline,
  GoalTimelineImpact,
  ProjectionPoint,
  ScenarioInputs,
  ScenarioOutputs,
} from "../types";

export function evaluateScenarioRisk(riskScore: number): {
  label: string;
  variant: "growth" | "secondary" | "risk";
} {
  if (riskScore < 35) return { label: "Conservative", variant: "growth" };
  if (riskScore < 70) return { label: "Moderate Risk", variant: "secondary" };
  return { label: "Aggressive", variant: "risk" };
}

export function calculateSimulationOutputs(
  baseline: ActualFinancialBaseline,
  inputs: ScenarioInputs
): ScenarioOutputs {
  // 1. Calculate Simulated Monthly Spend
  const discSpend =
    baseline.categorySpend.discretionary *
    (1 + inputs.discretionarySpendPctDelta / 100);
  const cloudSpend =
    baseline.categorySpend.cloudInfra *
    (1 + inputs.cloudInfraSpendPctDelta / 100);
  const saasSpend =
    baseline.categorySpend.softwareSaaS *
    (1 + inputs.softwareSaaSSpendPctDelta / 100);
  const payrollAddition = inputs.headcountDelta * 8500;
  const operationsSpend = baseline.categorySpend.operations + payrollAddition;

  const simulatedMonthlySpend = Math.round(
    discSpend + cloudSpend + saasSpend + operationsSpend
  );

  // 2. Calculate Simulated Monthly Savings & Surplus
  const netOperatingMargin = baseline.monthlyRevenue - simulatedMonthlySpend;
  const simulatedMonthlySavings = Math.max(
    0,
    Math.round(netOperatingMargin + inputs.monthlySavingsContribution)
  );

  // 3. Scenario Differences vs Actual Baseline
  const monthlyScenarioDifference = Math.round(
    simulatedMonthlySavings - baseline.monthlySavings
  );
  const annualizedScenarioDifference = monthlyScenarioDifference * 12;

  // 4. Runway in Months
  const simulatedRunwayMonths =
    simulatedMonthlySpend > 0
      ? Math.round(
          (baseline.treasuryReserveBalance / simulatedMonthlySpend) * 10
        ) / 10
      : 99.9;
  const runwayDeltaMonths =
    Math.round((simulatedRunwayMonths - baseline.runwayMonths) * 10) / 10;

  // 5. Goal Timeline Impacts
  const baselineGoalBudget = baseline.monthlyGoalContribution || 31500;
  const scenarioGoalBudget = Math.max(500, inputs.monthlyGoalContribution);
  const goalAllocationRatio = scenarioGoalBudget / baselineGoalBudget;

  const defaultGoals = [
    { id: "g-1", title: "18-Month Operating Treasury Reserve", baselineMonths: 6.4 },
    { id: "g-2", title: "Q4 Engineering Expansion Capex", baselineMonths: 4.3 },
    { id: "g-3", title: "Annual Federal & State Tax Escrow", baselineMonths: 2.0 },
  ];

  const goalTimelineImpacts: GoalTimelineImpact[] = defaultGoals.map((g) => {
    const scenarioMonths = Math.max(
      0.5,
      Math.round((g.baselineMonths / goalAllocationRatio) * 10) / 10
    );
    const monthsDifference = Math.round((g.baselineMonths - scenarioMonths) * 10) / 10;

    let status: "accelerated" | "delayed" | "unchanged" = "unchanged";
    if (monthsDifference > 0.2) status = "accelerated";
    else if (monthsDifference < -0.2) status = "delayed";

    return {
      goalId: g.id,
      goalTitle: g.title,
      baselineMonths: g.baselineMonths,
      scenarioMonths,
      monthsDifference,
      status,
    };
  });

  // 6. 12-Month Projection Points
  const monthNames = [
    "Month 1",
    "Month 2",
    "Month 3",
    "Month 4",
    "Month 5",
    "Month 6",
    "Month 7",
    "Month 8",
    "Month 9",
    "Month 10",
    "Month 11",
    "Month 12",
  ];

  let currentBaselineCap = baseline.treasuryReserveBalance;
  let currentScenarioCap = baseline.treasuryReserveBalance;

  const projectionPoints: ProjectionPoint[] = monthNames.map((m, idx) => {
    currentBaselineCap += baseline.monthlySavings;
    currentScenarioCap += simulatedMonthlySavings;

    return {
      month: m,
      monthIndex: idx + 1,
      baselineCapital: Math.round(currentBaselineCap),
      scenarioCapital: Math.round(currentScenarioCap),
      potentialNetDifference: Math.round(
        currentScenarioCap - currentBaselineCap
      ),
    };
  });

  return {
    simulatedMonthlySpend,
    simulatedMonthlySavings,
    monthlyScenarioDifference,
    annualizedScenarioDifference,
    simulatedRunwayMonths,
    runwayDeltaMonths,
    goalTimelineImpacts,
    projectionPoints,
  };
}
