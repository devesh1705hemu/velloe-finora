import { z } from "zod";

export const insightFilterSchema = z.object({
  impact: z.enum(["high", "medium", "low"]).optional(),
  type: z.enum(["optimization", "anomalous_spend", "yield_opportunity", "tax_efficiency"]).optional(),
  includeDismissed: z.boolean().default(false),
});

export type InsightFilterInput = z.infer<typeof insightFilterSchema>;
