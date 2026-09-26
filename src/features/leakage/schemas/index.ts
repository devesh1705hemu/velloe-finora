import { z } from "zod";

export const resolveLeakageSchema = z.object({
  status: z.enum(["resolved", "ignored", "in_review"]),
  resolutionNotes: z.string().max(500).optional(),
});

export const leakageFilterSchema = z.object({
  severity: z.enum(["critical", "high", "medium", "low"]).optional(),
  status: z.enum(["open", "resolved", "ignored", "in_review"]).optional(),
  type: z.enum(["duplicate_charge", "hidden_fee", "unwanted_recurring", "contract_drift", "pricing_anomaly"]).optional(),
});

export type ResolveLeakageInput = z.infer<typeof resolveLeakageSchema>;
export type LeakageFilterInput = z.infer<typeof leakageFilterSchema>;
