import { env } from "@/config/env";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_PRIORITIES: Record<LogLevel, number> = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "refreshtoken",
  "accesstoken",
  "authorization",
  "secret",
  "apikey",
  "api_key",
  "cvv",
  "creditcard",
  "ssn",
  "pin",
]);

/**
 * Recursively redacts sensitive keys from log payloads to guarantee no credential leaks.
 */
function sanitizePayload(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizePayload(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

class Logger {
  private moduleName: string;

  constructor(moduleName: string = "App") {
    this.moduleName = moduleName;
  }

  private shouldLog(level: LogLevel): boolean {
    const configuredLevel = (env.NEXT_PUBLIC_LOG_LEVEL || "info") as LogLevel;
    const configuredPriority = LOG_LEVEL_PRIORITIES[configuredLevel] ?? 2;
    const currentPriority = LOG_LEVEL_PRIORITIES[level] ?? 2;
    return currentPriority >= configuredPriority;
  }

  formatMessage(level: LogLevel, message: string, payload?: unknown) {
    return {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      module: this.moduleName,
      message,
      ...(payload !== undefined ? { data: sanitizePayload(payload) } : {}),
    };
  }

  debug(message: string, payload?: unknown): void {
    if (this.shouldLog("debug")) {
      const entry = this.formatMessage("debug", message, payload);
      console.debug(`[${this.moduleName}] 🔍 ${entry.message}`, entry.data ?? "");
    }
  }

  info(message: string, payload?: unknown): void {
    if (this.shouldLog("info")) {
      const entry = this.formatMessage("info", message, payload);
      console.info(`[${this.moduleName}] ℹ️ ${entry.message}`, entry.data ?? "");
    }
  }

  warn(message: string, payload?: unknown): void {
    if (this.shouldLog("warn")) {
      const entry = this.formatMessage("warn", message, payload);
      console.warn(`[${this.moduleName}] ⚠️ ${entry.message}`, entry.data ?? "");
    }
  }

  error(message: string, error?: unknown, payload?: unknown): void {
    if (this.shouldLog("error")) {
      const entry = this.formatMessage("error", message, payload);
      const errorDetails =
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error;

      console.error(
        `[${this.moduleName}] 🚨 ${entry.message}`,
        { error: errorDetails, payload: entry.data }
      );
    }
  }

  for(module: string): Logger {
    return new Logger(module);
  }
}

export const logger = new Logger("Finora");
