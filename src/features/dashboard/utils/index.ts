export function calculateBurnRate(outflowTotal: number, days: number): number {
  if (days <= 0) return 0;
  return (outflowTotal / days) * 30; // 30-day normalized monthly burn rate
}

export function calculateRunwayMonths(totalCash: number, monthlyBurnRate: number): number {
  if (monthlyBurnRate <= 0) return 999; // infinite or cash flow positive
  return Number((totalCash / monthlyBurnRate).toFixed(1));
}
