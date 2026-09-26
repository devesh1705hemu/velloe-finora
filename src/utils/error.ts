import { ERROR_CODES, type ErrorCode } from "@/constants/error-codes";
import { type ApiErrorPayload } from "@/types/api";

export interface AppErrorOptions {
  statusCode?: number;
  code?: ErrorCode | string;
  details?: unknown;
  isOperational?: boolean;
}

/**
 * Standard enterprise application error class.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode | string;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? ERROR_CODES.INTERNAL_SERVER_ERROR;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Normalizes any caught unknown error into a typed AppError instance.
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, {
      code: ERROR_CODES.UNKNOWN_ERROR,
      statusCode: 500,
      details: { originalName: error.name },
    });
  }

  if (typeof error === "string") {
    return new AppError(error, {
      code: ERROR_CODES.UNKNOWN_ERROR,
      statusCode: 500,
    });
  }

  // Handle object-shaped API errors
  if (typeof error === "object" && error !== null) {
    const errObj = error as Partial<ApiErrorPayload>;
    return new AppError(errObj.message || "An unexpected error occurred", {
      code: errObj.code || ERROR_CODES.UNKNOWN_ERROR,
      statusCode: errObj.statusCode || 500,
      details: errObj.details,
    });
  }

  return new AppError("An unknown error occurred", {
    code: ERROR_CODES.UNKNOWN_ERROR,
    statusCode: 500,
  });
}

/**
 * Maps error codes to user-friendly readable explanations.
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const appError = normalizeError(error);

  switch (appError.code) {
    case ERROR_CODES.AUTH_UNAUTHORIZED:
    case ERROR_CODES.AUTH_TOKEN_EXPIRED:
      return "Your session has expired. Please sign in again.";
    case ERROR_CODES.AUTH_FORBIDDEN:
      return "You do not have permission to perform this financial operation.";
    case ERROR_CODES.GATEWAY_TIMEOUT:
      return "The financial gateway took too long to respond. Please try again.";
    case ERROR_CODES.NETWORK_DISCONNECTED:
      return "Network connection lost. Please check your internet connection.";
    case ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return "Too many requests. Please slow down and try again shortly.";
    case ERROR_CODES.LEAKAGE_ANOMALY_DETECTED:
      return "A transaction anomaly was flagged by Finora Leakage Engine.";
    default:
      return appError.message || "An unexpected issue occurred. Our engineers have been alerted.";
  }
}
