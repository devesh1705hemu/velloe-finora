import { describe, it, expect } from "vitest";
import { formatPercentage } from "@/utils/currency";

describe("Percentage Formatting & Calculation Engine", () => {
  it("formats positive percentages with explicit sign", () => {
    const res = formatPercentage(18.22);
    expect(res).toMatch(/\+18\.22%/);
  });

  it("formats negative percentage contractions", () => {
    const res = formatPercentage(-8.74);
    expect(res).toMatch(/-8\.74%/);
  });

  it("handles zero percentage gracefully", () => {
    const res = formatPercentage(0);
    expect(res).toMatch(/0\.00%/);
  });

  it("handles NaN safely without throwing", () => {
    const res = formatPercentage(NaN);
    expect(res).toBe("0.00%");
  });

  it("supports custom decimal precision", () => {
    const res = formatPercentage(12.3456, { decimals: 1 });
    expect(res).toMatch(/\+12\.3%/);
  });
});
