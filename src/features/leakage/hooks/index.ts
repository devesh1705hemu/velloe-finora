"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leakageService } from "../services";
import { OpportunityStatus } from "../types";

export const LEAKAGE_QUERY_KEYS = {
  all: ["potential-leakage"] as const,
  report: (categoryFilter?: string) => ["potential-leakage", "report", categoryFilter] as const,
};

export function usePotentialLeakage(categoryFilter: string = "all") {
  return useQuery({
    queryKey: LEAKAGE_QUERY_KEYS.report(categoryFilter),
    queryFn: () => leakageService.getLeakageReport(categoryFilter),
    staleTime: 1000 * 60,
  });
}

export function useUpdateOpportunityStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OpportunityStatus }) =>
      leakageService.updateOpportunityStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAKAGE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
