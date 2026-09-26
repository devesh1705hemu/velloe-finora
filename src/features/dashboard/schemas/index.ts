import { z } from "zod";
import { dateRangeSchema } from "@/schemas/common";

export const dashboardFilterSchema = z.object({
  timeframe: z.enum(["7d", "30d", "90d", "ytd", "custom"]).default("30d"),
  customRange: dateRangeSchema.optional(),
  currency: z.string().default("USD"),
});

export type DashboardFilterInput = z.infer<typeof dashboardFilterSchema>;
