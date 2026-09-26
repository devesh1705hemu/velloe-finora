import { GoalProjection, ProjectionStatus } from "../types";

export function calculateGoalProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const ratio = (current / target) * 100;
  return Math.min(Math.round(ratio * 10) / 10, 100);
}

export function computeGoalProjection(
  currentAmount: number,
  targetAmount: number,
  monthlyContribution: number,
  targetDateStr: string
): GoalProjection {
  const actualProgressPercentage = calculateGoalProgress(currentAmount, targetAmount);
  const remainingAmount = Math.max(0, targetAmount - currentAmount);

  const now = new Date();
  const targetDate = new Date(targetDateStr);
  const monthsRemainingToTarget = Math.max(
    1,
    Math.round(
      (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
    )
  );

  const projectedMonthsToComplete =
    monthlyContribution > 0
      ? Math.ceil(remainingAmount / monthlyContribution)
      : 999;

  // Monthly required to hit target date precisely
  const monthlyRequiredToHitTarget = Math.round(
    remainingAmount / monthsRemainingToTarget
  );

  // Projected progress at target date
  const projectedTotalAtTarget =
    currentAmount + monthlyContribution * monthsRemainingToTarget;
  const projectedProgressPercentage = Math.min(
    100,
    Math.round((projectedTotalAtTarget / targetAmount) * 1000) / 10
  );

  // Projected completion date
  const completionDate = new Date(now);
  completionDate.setMonth(completionDate.getMonth() + projectedMonthsToComplete);
  const projectedCompletionDate = completionDate.toISOString();

  let status: ProjectionStatus = "on_track";
  let statusMessage = "Pacing on track with scheduled target date.";

  if (actualProgressPercentage >= 100) {
    status = "ahead_of_schedule";
    statusMessage = "Goal target fully achieved.";
  } else if (projectedMonthsToComplete <= monthsRemainingToTarget - 2) {
    status = "ahead_of_schedule";
    statusMessage = `Projected to achieve ${monthsRemainingToTarget - projectedMonthsToComplete} months ahead of target.`;
  } else if (projectedMonthsToComplete <= monthsRemainingToTarget) {
    status = "on_track";
    statusMessage = "On track to complete within target horizon.";
  } else if (projectedMonthsToComplete <= monthsRemainingToTarget + 3) {
    status = "behind_schedule";
    statusMessage = `Pacing requires +$${Math.max(0, monthlyRequiredToHitTarget - monthlyContribution).toLocaleString()}/mo to maintain original schedule.`;
  } else {
    status = "at_risk";
    statusMessage = "Pacing significantly behind schedule. Review monthly allocation.";
  }

  return {
    projectedCompletionDate,
    projectedProgressPercentage,
    actualProgressPercentage,
    monthsRemainingToTarget,
    projectedMonthsToComplete,
    monthlyRequiredToHitTarget,
    status,
    statusMessage,
  };
}
