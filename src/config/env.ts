import { clientEnvSchema, serverEnvSchema, type ClientEnv, type ServerEnv } from "@/schemas/env";

/**
 * Validates and provides typed access to client-side environment variables.
 */
function validateClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_TIMEOUT_MS: process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
  });

  if (!result.success) {
    const issues = result.error.format();
    console.error("❌ Invalid client environment variables:", JSON.stringify(issues, null, 2));
    throw new Error("Invalid client environment variables configuration");
  }

  return result.data;
}

/**
 * Validates and provides typed access to server-only environment variables.
 * Calling this in client-side code will safely throw an error.
 */
function validateServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("🚨 Critical Security Violation: Attempted to access server environment variables from client-side code!");
  }

  const result = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    API_GATEWAY_INTERNAL_URL: process.env.API_GATEWAY_INTERNAL_URL,
  });

  if (!result.success) {
    const issues = result.error.format();
    console.error("❌ Invalid server environment variables:", JSON.stringify(issues, null, 2));
    throw new Error("Invalid server environment variables configuration");
  }

  return result.data;
}

export const env = validateClientEnv();

/**
 * Use getServerEnv() ONLY in Server Components, Route Handlers, or Server Actions.
 */
export function getServerEnv(): ServerEnv {
  return validateServerEnv();
}
