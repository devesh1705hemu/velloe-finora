import { z } from "zod";
import { currencyCodeSchema } from "@/schemas/common";

export const createGoalSchema = z.object({
  title: z.string().min(2, "Goal title must be at least 2 characters"),
  category: z.enum([
    "reserve_fund",
    "debt_paydown",
    "capex",
    "runway_expansion",
    "tax_provision",
  ]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  targetAmount: z.coerce
    .number()
    .positive("Target amount must be a positive number"),
  initialAmount: z.coerce
    .number()
    .min(0, "Initial amount cannot be negative"),
  monthlyContribution: z.coerce
    .number()
    .min(0, "Monthly contribution cannot be negative"),
  currency: currencyCodeSchema,
  targetDate: z.string().min(1, "Target date is required"),
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  id: z.string(),
  isCompleted: z.boolean().optional(),
});

export const recordContributionSchema = z.object({
  goalId: z.string(),
  amount: z.coerce.number().positive("Contribution amount must be greater than zero"),
  date: z.string().min(1, "Date is required"),
  note: z.string().max(200, "Note must be under 200 characters").optional(),
  sourceAccount: z.string().optional(),
});

export const goalFilterSchema = z.object({
  category: z
    .enum([
      "reserve_fund",
      "debt_paydown",
      "capex",
      "runway_expansion",
      "tax_provision",
    ])
    .optional(),
  priority: z.enum(["critical", "high", "medium", "low"]).optional(),
  isCompleted: z.boolean().optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type RecordContributionInput = z.infer<typeof recordContributionSchema>;
export type GoalFilterInput = z.infer<typeof goalFilterSchema>;
