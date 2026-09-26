/**
 * Centralized API Type Definitions
 * Enforces typed contracts across all Finora microservice integrations.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[] | Record<string, unknown>;
  statusCode: number;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
  timestamp: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface RequestConfig extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  requiresAuth?: boolean;
  body?: unknown;
}
