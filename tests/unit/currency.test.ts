import { describe, it, expect } from "vitest";
import { formatCurrency, formatCompactCurrency } from "@/utils/currency";

describe("Currency Formatting Engine", () => {
  it("formats positive USD amounts correctly", () => {
    const formatted = formatCurrency(12500.5);
    expect(formatted).toContain("12,500.50");
    expect(formatted).toContain("$");
  });

  it("formats zero amount accurately", () => {
    const formatted = formatCurrency(0);
    expect(formatted).toContain("0.00");
  });

  it("formats negative amounts with sign", () => {
    const formatted = formatCurrency(-3400.25);
    expect(formatted).toContain("3,400.25");
    expect(formatted).toMatch(/-|\(/);
  });

  it("supports INR currency code with standard currency identifier", () => {
    const formatted = formatCurrency(2400, { currency: "INR" });
    expect(formatted).toMatch(/₹|INR/);
    expect(formatted).toContain("2,400");
  });

  it("supports EUR currency code", () => {
    const formatted = formatCurrency(5000, { currency: "EUR" });
    expect(formatted).toMatch(/€|EUR/);
    expect(formatted).toContain("5,000");
  });

  it("handles compact formatting for large numbers", () => {
    expect(formatCompactCurrency(1500000)).toMatch(/1\.5M|\$1\.5M/);
    expect(formatCompactCurrency(250000)).toMatch(/250K|\$250K/);
  });
});
