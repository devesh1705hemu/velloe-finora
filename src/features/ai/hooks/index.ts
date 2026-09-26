"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiService } from "../services";

export const AI_CONVERSATIONS_KEY = ["ai", "conversations"] as const;

export function useConversations() {
  return useQuery({
    queryKey: AI_CONVERSATIONS_KEY,
    queryFn: async () => {
      const res = await aiService.getConversations();
      return res.data;
    },
  });
}

export function useClearConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aiService.clearConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_CONVERSATIONS_KEY });
    },
  });
}
