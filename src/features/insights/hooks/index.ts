"use client";

import { useQuery } from "@tanstack/react-query";
import { insightsService } from "../services";

export const INSIGHTS_QUERY_KEYS = {
  all: ["financial-intelligence"] as const,
  report: (timeframe: string) => ["financial-intelligence", "report", timeframe] as const,
};

export function useFinancialIntelligence(timeframe: string = "30d") {
  return useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.report(timeframe),
    queryFn: () => insightsService.getIntelligenceReport(timeframe),
    staleTime: 1000 * 60, // 1 minute fresh
  });
}
