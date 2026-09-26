"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services";
import { DashboardFilterInput } from "../schemas";

export const DASHBOARD_QUERY_KEYS = {
  summary: (filter?: DashboardFilterInput) => ["dashboard", "summary", filter] as const,
  cashFlowTrend: (timeframe: string) => ["dashboard", "trend", timeframe] as const,
};

export function useDashboardSummary(filter?: DashboardFilterInput) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary(filter),
    queryFn: async () => {
      const res = await dashboardService.getSummary(filter);
      return res.data;
    },
  });
}

export function useCashFlowTrend(timeframe: string = "30d") {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.cashFlowTrend(timeframe),
    queryFn: async () => {
      const res = await dashboardService.getCashFlowTrend(timeframe);
      return res.data;
    },
  });
}
