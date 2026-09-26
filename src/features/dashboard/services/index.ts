import { BaseService } from "@/services/base-service";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { ApiResponse } from "@/types/api";
import { DashboardSummary, CashFlowTrendPoint } from "../types";
import { DashboardFilterInput } from "../schemas";

export class DashboardService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.FINANCE.METRICS);
  }

  async getSummary(filter?: DashboardFilterInput): Promise<ApiResponse<DashboardSummary>> {
    return this.client.get<DashboardSummary>(this.basePath, {
      params: {
        timeframe: filter?.timeframe,
        currency: filter?.currency,
      },
    });
  }

  async getCashFlowTrend(timeframe: string = "30d"): Promise<ApiResponse<CashFlowTrendPoint[]>> {
    return this.client.get<CashFlowTrendPoint[]>(`${this.basePath}/cashflow-trend`, {
      params: { timeframe },
    });
  }
}

export const dashboardService = new DashboardService();
