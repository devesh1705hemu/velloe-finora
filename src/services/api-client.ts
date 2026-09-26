import { env } from "@/config/env";
import { ERROR_CODES } from "@/constants/error-codes";
import { tokenStorage } from "@/services/token-storage";
import { type ApiResponse, type RequestConfig } from "@/types/api";
import { AppError } from "@/utils/error";
import { logger } from "@/utils/logger";

const apiLogger = logger.for("ApiClient");

export interface InterceptorCallbacks {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onResponse?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  onError?: (error: AppError) => AppError | Promise<AppError>;
}

export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private interceptors: InterceptorCallbacks;

  constructor(
    baseUrl: string = env.NEXT_PUBLIC_API_URL,
    defaultTimeout: number = env.NEXT_PUBLIC_API_TIMEOUT_MS,
    interceptors: InterceptorCallbacks = {}
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.defaultTimeout = defaultTimeout;
    this.interceptors = interceptors;
  }

  /**
   * Builds the full URL with query parameters.
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Executes a typed HTTP request with timeout, auth injection, and error normalization.
   */
  async request<T>(path: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    let effectiveConfig = { ...config };

    if (this.interceptors.onRequest) {
      effectiveConfig = await this.interceptors.onRequest(effectiveConfig);
    }

    const {
      params,
      timeoutMs = this.defaultTimeout,
      requiresAuth = true,
      body,
      headers: customHeaders,
      ...fetchOptions
    } = effectiveConfig;

    const url = this.buildUrl(path, params);

    const headers = new Headers(customHeaders);
    if (!headers.has("Content-Type") && body !== undefined && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    // Auto-inject JWT Bearer Token if required
    if (requiresAuth) {
      const token = tokenStorage.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // Unique Request ID for distributed tracing
    if (!headers.has("X-Request-ID")) {
      headers.set("X-Request-ID", `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      apiLogger.debug(`${fetchOptions.method || "GET"} ${path}`, { url, hasBody: !!body });

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: body !== undefined && !(body instanceof FormData) ? JSON.stringify(body) : (body as BodyInit),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON or empty response (e.g. 204 No Content)
      if (response.status === 204) {
        return {
          success: true,
          data: {} as T,
          timestamp: new Date().toISOString(),
        };
      }

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const rawData = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const errorPayload = typeof rawData === "object" && rawData !== null && "error" in rawData
          ? (rawData as { error: { code?: string; message?: string; details?: unknown } }).error
          : null;

        if (response.status === 401) {
          tokenStorage.notifySessionExpired();
        }

        const errorCode = errorPayload?.code || (response.status === 401 ? ERROR_CODES.AUTH_UNAUTHORIZED : ERROR_CODES.INTERNAL_SERVER_ERROR);
        const errorMessage = errorPayload?.message || (typeof rawData === "string" ? rawData : `HTTP ${response.status}: Request failed`);

        throw new AppError(errorMessage, {
          statusCode: response.status,
          code: errorCode,
          details: errorPayload?.details,
        });
      }

      // Check if standard ApiResponse format was returned by API Gateway
      const result: ApiResponse<T> =
        typeof rawData === "object" && rawData !== null && "data" in rawData
          ? (rawData as ApiResponse<T>)
          : {
              success: true,
              data: rawData as T,
              timestamp: new Date().toISOString(),
            };

      if (this.interceptors.onResponse) {
        return await this.interceptors.onResponse<T>(result);
      }

      return result;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      let appError: AppError;

      if (err instanceof AppError) {
        appError = err;
      } else if (err instanceof DOMException && err.name === "AbortError") {
        appError = new AppError("Request timeout exceeded", {
          statusCode: 504,
          code: ERROR_CODES.GATEWAY_TIMEOUT,
        });
      } else if (err instanceof TypeError && err.message.includes("fetch")) {
        appError = new AppError("Network failure or connection refused", {
          statusCode: 503,
          code: ERROR_CODES.NETWORK_DISCONNECTED,
        });
      } else {
        appError = new AppError(err instanceof Error ? err.message : "Unexpected request error", {
          statusCode: 500,
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        });
      }

      apiLogger.error(`Request failed [${fetchOptions.method || "GET"} ${path}]`, appError);

      if (this.interceptors.onError) {
        throw await this.interceptors.onError(appError);
      }

      throw appError;
    }
  }

  get<T>(path: string, config?: Omit<RequestConfig, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: "GET" });
  }

  post<T>(path: string, body?: unknown, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: "POST", body });
  }

  put<T>(path: string, body?: unknown, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: "PUT", body });
  }

  patch<T>(path: string, body?: unknown, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: "PATCH", body });
  }

  delete<T>(path: string, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
