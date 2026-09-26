"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services";
import { TransactionFilterState } from "../types";
import { TransactionFormValues } from "../schemas";

export const TRANSACTION_QUERY_KEYS = {
  all: ["transactions"] as const,
  list: (filter: TransactionFilterState) => ["transactions", "list", filter] as const,
  detail: (id: string) => ["transactions", "detail", id] as const,
};

export function useTransactions(filter: TransactionFilterState) {
  return useQuery({
    queryKey: TRANSACTION_QUERY_KEYS.list(filter),
    queryFn: () => transactionService.getTransactions(filter),
    staleTime: 1000 * 30, // 30 seconds fresh
  });
}

export function useTransactionById(id: string | null) {
  return useQuery({
    queryKey: TRANSACTION_QUERY_KEYS.detail(id ?? ""),
    queryFn: () => (id ? transactionService.getTransactionById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransactionFormValues) => transactionService.createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TransactionFormValues> }) =>
      transactionService.updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useImportTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      rows: Array<{
        postedAt: string;
        merchantName: string;
        amount: number;
        type: "income" | "expense" | "transfer";
        categoryName: string;
        accountName: string;
        description?: string;
        status: "settled" | "pending" | "flagged" | "reconciled";
      }>
    ) => transactionService.importTransactions(rows),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}
