"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalsService } from "../services";
import {
  CreateGoalInput,
  UpdateGoalInput,
  RecordContributionInput,
  GoalFilterInput,
} from "../schemas";

export const GOALS_QUERY_KEY = ["goals", "list"] as const;

export function useGoals(filter?: GoalFilterInput) {
  return useQuery({
    queryKey: [...GOALS_QUERY_KEY, filter],
    queryFn: async () => {
      const res = await goalsService.getGoals(filter);
      return res.data;
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGoalInput) => goalsService.createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["future"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateGoalInput) => goalsService.updateGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["future"] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["future"] });
    },
  });
}

export function useRecordContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordContributionInput) =>
      goalsService.recordContribution(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["future"] });
    },
  });
}
