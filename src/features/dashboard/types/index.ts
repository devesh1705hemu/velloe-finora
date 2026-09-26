import { CurrencyCode, ISODateString } from "@/types/common";

export interface MetricCardData {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  percentageChange: number;
  trend: "up" | "down" | "neutral";
  currency?: CurrencyCode;
  formatAs: "currency" | "percent" | "number";
  status?: "growth" | "risk" | "neutral" | "warning";
}

export interface CashFlowTrendPoint {
  date: ISODateString;
  inflow: number;
  outflow: number;
  netCashFlow: number;
}

export interface DashboardSummary {
  totalLiquidity: number;
  monthlyRunwayMonths: number;
  activeLeakageAmount: number;
  netCashFlowMonth: number;
  metrics: MetricCardData[];
  cashFlowTrend: CashFlowTrendPoint[];
}
