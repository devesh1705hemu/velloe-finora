import { z } from "zod";

export const scenarioInputsSchema = z.object({
  discretionarySpendPctDelta: z.coerce.number().min(-100).max(100),
  cloudInfraSpendPctDelta: z.coerce.number().min(-50).max(200),
  softwareSaaSSpendPctDelta: z.coerce.number().min(-50).max(100),
  headcountDelta: z.coerce.number().int().min(0).max(25),
  monthlySavingsContribution: z.coerce.number().min(0).max(100000),
  monthlyGoalContribution: z.coerce.number().min(0).max(100000),
});

export const saveScenarioFormSchema = z.object({
  name: z.string().min(2, "Scenario name must be at least 2 characters").max(50),
  description: z.string().max(200),
});

export const saveScenarioSchema = z.object({
  name: z.string().min(2, "Scenario name must be at least 2 characters").max(50),
  description: z.string().max(200),
  inputs: scenarioInputsSchema,
});

export type ScenarioInputsInput = z.infer<typeof scenarioInputsSchema>;
export type SaveScenarioFormInput = z.infer<typeof saveScenarioFormSchema>;
export type SaveScenarioSchemaInput = z.infer<typeof saveScenarioSchema>;
