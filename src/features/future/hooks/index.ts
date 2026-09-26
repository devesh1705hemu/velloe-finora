"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { futureService } from "../services";
import { SaveScenarioInput } from "../types";

export const FUTURE_QUERY_KEY = ["future", "scenarios"] as const;
export const BASELINE_QUERY_KEY = ["future", "baseline"] as const;

export function useActualBaseline() {
  return useQuery({
    queryKey: BASELINE_QUERY_KEY,
    queryFn: async () => {
      const res = await futureService.getActualBaseline();
      return res.data;
    },
  });
}

export function useSavedScenarios() {
  return useQuery({
    queryKey: FUTURE_QUERY_KEY,
    queryFn: async () => {
      const res = await futureService.getSavedScenarios();
      return res.data;
    },
  });
}

export function useSaveScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveScenarioInput) => futureService.saveScenario(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUTURE_QUERY_KEY });
    },
  });
}

export function useDeleteScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => futureService.deleteScenario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUTURE_QUERY_KEY });
    },
  });
}
