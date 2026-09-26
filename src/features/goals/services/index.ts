import { ApiResponse } from "@/types/api";
import { FinancialGoal } from "../types";
import {
  CreateGoalInput,
  UpdateGoalInput,
  RecordContributionInput,
  GoalFilterInput,
} from "../schemas";
import { computeGoalProjection } from "../utils";

const STORAGE_KEY = "velloe_finora_goals_v1";

const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: "g-treasury-reserve",
    title: "18-Month Operating Treasury Reserve",
    category: "reserve_fund",
    priority: "critical",
    targetAmount: 500000,
    currentAmount: 420000,
    monthlyContribution: 12500,
    currency: "USD",
    targetDate: "2026-12-31T23:59:59.000Z",
    isCompleted: false,
    contributions: [
      { id: "c-1", amount: 25000, date: "2026-09-01T10:00:00.000Z", note: "Treasury allocation Q3", sourceAccount: "JPMorgan Reserve" },
      { id: "c-2", amount: 15000, date: "2026-08-15T14:30:00.000Z", note: "Operating surplus transfer", sourceAccount: "Silicon Valley Bank" },
    ],
    projection: computeGoalProjection(
      420000,
      500000,
      12500,
      "2026-12-31T23:59:59.000Z"
    ),
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "g-eng-expansion",
    title: "Q4 Engineering Expansion Capex",
    category: "capex",
    priority: "high",
    targetAmount: 150000,
    currentAmount: 85000,
    monthlyContribution: 15000,
    currency: "USD",
    targetDate: "2026-11-30T23:59:59.000Z",
    isCompleted: false,
    contributions: [
      { id: "c-3", amount: 20000, date: "2026-09-10T11:00:00.000Z", note: "Hardware & cloud tooling deposit", sourceAccount: "JPMorgan Reserve" },
    ],
    projection: computeGoalProjection(
      85000,
      150000,
      15000,
      "2026-11-30T23:59:59.000Z"
    ),
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-09-10T11:00:00.000Z",
  },
  {
    id: "g-tax-escrow",
    title: "Annual Federal & State Tax Escrow",
    category: "tax_provision",
    priority: "critical",
    targetAmount: 80000,
    currentAmount: 72000,
    monthlyContribution: 4000,
    currency: "USD",
    targetDate: "2027-04-15T23:59:59.000Z",
    isCompleted: false,
    contributions: [
      { id: "c-4", amount: 4000, date: "2026-09-15T09:00:00.000Z", note: "September automated escrow", sourceAccount: "Tax Reserve Account" },
    ],
    projection: computeGoalProjection(
      72000,
      80000,
      4000,
      "2027-04-15T23:59:59.000Z"
    ),
    createdAt: "2026-04-16T00:00:00.000Z",
    updatedAt: "2026-09-15T09:00:00.000Z",
  },
];

export class GoalsService {
  private getStore(): FinancialGoal[] {
    if (typeof window === "undefined") {
      return INITIAL_GOALS;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GOALS));
      return INITIAL_GOALS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Re-evaluate projections with current clock
      return parsed.map((g: FinancialGoal) => ({
        ...g,
        projection: computeGoalProjection(
          g.currentAmount,
          g.targetAmount,
          g.monthlyContribution,
          g.targetDate
        ),
      }));
    } catch {
      return INITIAL_GOALS;
    }
  }

  private saveStore(goals: FinancialGoal[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }
  }

  async getGoals(filter?: GoalFilterInput): Promise<ApiResponse<FinancialGoal[]>> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let list = this.getStore();

    if (filter?.category) {
      list = list.filter((g) => g.category === filter.category);
    }
    if (filter?.priority) {
      list = list.filter((g) => g.priority === filter.priority);
    }
    if (filter?.isCompleted !== undefined) {
      list = list.filter((g) => g.isCompleted === filter.isCompleted);
    }

    return {
      success: true,
      data: list,
      timestamp: new Date().toISOString(),
      message: "Goals retrieved successfully",
    };
  }

  async createGoal(payload: CreateGoalInput): Promise<ApiResponse<FinancialGoal>> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = this.getStore();

    const targetDateIso = new Date(payload.targetDate).toISOString();
    const initialAmount = payload.initialAmount || 0;
    const monthlyContribution = payload.monthlyContribution || 0;

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: payload.title,
      category: payload.category,
      priority: payload.priority,
      targetAmount: payload.targetAmount,
      currentAmount: initialAmount,
      monthlyContribution,
      currency: payload.currency || "USD",
      targetDate: targetDateIso,
      isCompleted: initialAmount >= payload.targetAmount,
      contributions: initialAmount > 0 ? [
        {
          id: `c-init-${Date.now()}`,
          amount: initialAmount,
          date: new Date().toISOString(),
          note: "Initial allocation at creation",
          sourceAccount: "Primary Treasury",
        },
      ] : [],
      projection: computeGoalProjection(
        initialAmount,
        payload.targetAmount,
        monthlyContribution,
        targetDateIso
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newGoal, ...list];
    this.saveStore(updated);

    return {
      success: true,
      data: newGoal,
      timestamp: new Date().toISOString(),
      message: "Goal created successfully",
    };
  }

  async updateGoal(payload: UpdateGoalInput): Promise<ApiResponse<FinancialGoal>> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = this.getStore();
    const index = list.findIndex((g) => g.id === payload.id);
    if (index === -1) {
      throw new Error(`Goal with ID ${payload.id} not found`);
    }

    const current = list[index];
    if (!current) {
      throw new Error(`Goal with ID ${payload.id} not found`);
    }

    const targetDate = payload.targetDate ? new Date(payload.targetDate).toISOString() : current.targetDate;
    const targetAmount = payload.targetAmount !== undefined ? payload.targetAmount : current.targetAmount;
    const monthlyContribution = payload.monthlyContribution !== undefined ? payload.monthlyContribution : current.monthlyContribution;

    const updatedGoal: FinancialGoal = {
      id: current.id,
      title: payload.title ?? current.title,
      category: payload.category ?? current.category,
      priority: payload.priority ?? current.priority,
      targetAmount,
      currentAmount: current.currentAmount,
      monthlyContribution,
      currency: payload.currency ?? current.currency,
      targetDate,
      isCompleted: payload.isCompleted ?? current.currentAmount >= targetAmount,
      contributions: current.contributions,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
      projection: computeGoalProjection(
        current.currentAmount,
        targetAmount,
        monthlyContribution,
        targetDate
      ),
    };

    list[index] = updatedGoal;
    this.saveStore(list);

    return {
      success: true,
      data: updatedGoal,
      timestamp: new Date().toISOString(),
      message: "Goal updated successfully",
    };
  }

  async deleteGoal(id: string): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const list = this.getStore();
    const filtered = list.filter((g) => g.id !== id);
    this.saveStore(filtered);

    return {
      success: true,
      data: undefined as unknown as void,
      timestamp: new Date().toISOString(),
      message: "Goal deleted successfully",
    };
  }

  async recordContribution(payload: RecordContributionInput): Promise<ApiResponse<FinancialGoal>> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = this.getStore();
    const index = list.findIndex((g) => g.id === payload.goalId);
    if (index === -1) {
      throw new Error(`Goal with ID ${payload.goalId} not found`);
    }

    const current = list[index];
    if (!current) {
      throw new Error(`Goal with ID ${payload.goalId} not found`);
    }

    const newCurrentAmount = current.currentAmount + payload.amount;
    const isCompleted = newCurrentAmount >= current.targetAmount;

    const contribution = {
      id: `contrib-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      amount: payload.amount,
      date: new Date(payload.date).toISOString(),
      note: payload.note || "Manual capital contribution",
      sourceAccount: payload.sourceAccount || "Treasury Reserve",
    };

    const updatedGoal: FinancialGoal = {
      id: current.id,
      title: current.title,
      category: current.category,
      priority: current.priority,
      targetAmount: current.targetAmount,
      currentAmount: newCurrentAmount,
      monthlyContribution: current.monthlyContribution,
      currency: current.currency,
      targetDate: current.targetDate,
      isCompleted,
      contributions: [contribution, ...current.contributions],
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
      projection: computeGoalProjection(
        newCurrentAmount,
        current.targetAmount,
        current.monthlyContribution,
        current.targetDate
      ),
    };

    list[index] = updatedGoal;
    this.saveStore(list);

    return {
      success: true,
      data: updatedGoal,
      timestamp: new Date().toISOString(),
      message: "Contribution recorded successfully",
    };
  }
}

export const goalsService = new GoalsService();
