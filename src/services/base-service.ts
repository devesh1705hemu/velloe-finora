import { apiClient, ApiClient } from "./api-client";
import { type ApiResponse, type RequestConfig } from "@/types/api";

/**
 * BaseService
 * Inherited by feature services to encapsulate API interactions.
 */
export abstract class BaseService {
  protected client: ApiClient;
  protected basePath: string;

  constructor(basePath: string, client: ApiClient = apiClient) {
    this.basePath = basePath.replace(/\/+$/, "");
    this.client = client;
  }

  protected endpoint(subPath: string = ""): string {
    const cleanSub = subPath ? (subPath.startsWith("/") ? subPath : `/${subPath}`) : "";
    return `${this.basePath}${cleanSub}`;
  }

  protected get<T>(subPath: string = "", config?: Omit<RequestConfig, "method" | "body">): Promise<ApiResponse<T>> {
    return this.client.get<T>(this.endpoint(subPath), config);
  }

  protected post<T>(subPath: string = "", body?: unknown, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.client.post<T>(this.endpoint(subPath), body, config);
  }

  protected put<T>(subPath: string = "", body?: unknown, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.client.put<T>(this.endpoint(subPath), body, config);
  }

  protected patch<T>(subPath: string = "", body?: unknown, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.client.patch<T>(this.endpoint(subPath), body, config);
  }

  protected delete<T>(subPath: string = "", config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.client.delete<T>(this.endpoint(subPath), config);
  }
}
