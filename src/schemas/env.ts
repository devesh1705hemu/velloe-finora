import { z } from "zod";

/**
 * Public Client-side Environment Schema
 * Only variables with NEXT_PUBLIC_ prefix are allowed here.
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Velloe-Finora"),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().default("http://localhost:3000/api/v1"),
  NEXT_PUBLIC_API_TIMEOUT_MS: z.coerce.number().positive().default(15000),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  NEXT_PUBLIC_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

/**
 * Private Server-only Environment Schema
 * NEVER expose these to the browser!
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  AUTH_SECRET: z.string().min(16).default("dev-insecure-secret-key-finora-local-only"),
  API_GATEWAY_INTERNAL_URL: z.string().url().default("http://localhost:8000"),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
