import { describe, it, expect } from "vitest";
import { calculateGoalProgress, computeGoalProjection } from "@/features/goals/utils";

describe("Goal Progress & Projection Engine", () => {
  it("calculates actual funded progress percentage accurately", () => {
    expect(calculateGoalProgress(430000, 500000)).toBe(86);
    expect(calculateGoalProgress(85000, 150000)).toBe(56.7);
    expect(calculateGoalProgress(0, 100000)).toBe(0);
    expect(calculateGoalProgress(120000, 100000)).toBe(100); // capped at 100%
  });

  it("handles zero or negative target amount safely", () => {
    expect(calculateGoalProgress(500, 0)).toBe(0);
    expect(calculateGoalProgress(500, -100)).toBe(0);
  });

  it("strictly separates actual progress from projected progress", () => {
    // 6 months remaining, $50k needed, contributing $20k/mo (completes in 3 months -> ahead of schedule)
    const targetDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
    const projection = computeGoalProjection(
      50000, // actual current
      100000, // target
      20000, // monthly contribution
      targetDate
    );

    // Actual progress is strictly 50% funded right now
    expect(projection.actualProgressPercentage).toBe(50);

    // Projected progress factors in the monthly contribution over the remaining horizon
    expect(projection.projectedProgressPercentage).toBeGreaterThan(50);
    expect(projection.projectedProgressPercentage).toBe(100);
    expect(projection.status).toBe("ahead_of_schedule");
  });

  it("identifies when a goal is behind schedule", () => {
    // 3 months remaining, $80k needed, but only contributing $5k/mo
    const targetDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const projection = computeGoalProjection(
      20000,
      100000,
      5000,
      targetDate
    );

    expect(projection.actualProgressPercentage).toBe(20);
    expect(["behind_schedule", "at_risk"]).toContain(projection.status);
    expect(projection.monthlyRequiredToHitTarget).toBeGreaterThan(5000);
  });
});
