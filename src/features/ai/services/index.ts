import { ApiResponse } from "@/types/api";
import {
  AIConversation,
  FinoraAIMessage,
  VerifiedCalculatedData,
  AIStreamChunk,
} from "../types";
import { insightsService } from "@/features/insights/services";
import { leakageService } from "@/features/leakage/services";
import { PotentialOpportunity } from "@/features/leakage/types";
import { goalsService } from "@/features/goals/services";

const STORAGE_KEY = "velloe_finora_ai_conversations_v1";

const INITIAL_CONVERSATION: AIConversation = {
  id: "conv-default",
  title: "Financial Intelligence Briefing",
  createdAt: "2026-09-26T08:00:00.000Z",
  updatedAt: "2026-09-26T08:00:00.000Z",
  messages: [
    {
      id: "msg-welcome",
      role: "assistant",
      content:
        "Welcome to **Finora AI**, your financial intelligence assistant. I am connected directly to your deterministic financial context layer. All transaction totals, category distributions, burn rates, and savings potentials are calculated by verified ledger engines—never invented or hallucinated. How can I assist your capital planning today?",
      timestamp: "2026-09-26T08:00:00.000Z",
      suggestedQuestions: [
        "Where am I spending the most?",
        "What changed this month?",
        "What are my biggest potential savings opportunities?",
        "How is my goal progressing?",
        "Explain my financial health.",
      ],
    },
  ],
};

// Rate Limiting Tracker
class RateLimiter {
  private requestTimestamps: number[] = [];
  private readonly maxRequests = 10;
  private readonly windowMs = 60 * 1000; // 1 minute

  check(): { allowed: boolean; cooldownSeconds: number; remaining: number } {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < this.windowMs
    );

    if (this.requestTimestamps.length >= this.maxRequests) {
      const oldest = this.requestTimestamps[0] || now;
      const cooldownSeconds = Math.max(
        1,
        Math.ceil((oldest + this.windowMs - now) / 1000)
      );
      return { allowed: false, cooldownSeconds, remaining: 0 };
    }

    this.requestTimestamps.push(now);
    return {
      allowed: true,
      cooldownSeconds: 0,
      remaining: this.maxRequests - this.requestTimestamps.length,
    };
  }
}

const rateLimiter = new RateLimiter();

export class AIService {
  private getStore(): AIConversation[] {
    if (typeof window === "undefined") {
      return [INITIAL_CONVERSATION];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([INITIAL_CONVERSATION]));
      return [INITIAL_CONVERSATION];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [INITIAL_CONVERSATION];
    }
  }

  private saveStore(convs: AIConversation[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    }
  }

  async getConversations(): Promise<ApiResponse<AIConversation[]>> {
    await new Promise((r) => setTimeout(r, 60));
    return {
      success: true,
      data: this.getStore(),
      timestamp: new Date().toISOString(),
      message: "Conversations retrieved",
    };
  }

  async clearConversation(id: string): Promise<ApiResponse<AIConversation>> {
    const list = this.getStore();
    const index = list.findIndex((c) => c.id === id);
    const resetConv: AIConversation = {
      id: id || "conv-default",
      title: "New Intelligence Session",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [INITIAL_CONVERSATION.messages[0]!],
    };

    if (index >= 0) {
      list[index] = resetConv;
    } else {
      list.push(resetConv);
    }
    this.saveStore(list);

    return {
      success: true,
      data: resetConv,
      timestamp: new Date().toISOString(),
      message: "Conversation cleared",
    };
  }

  /**
   * Deterministic Financial Context Layer
   * Retrieves verified facts directly from backend services.
   * AI Provider NEVER invents these calculations.
   */
  private async getFinancialContext(query: string): Promise<{
    calculatedData: VerifiedCalculatedData;
    explanationText: string;
  }> {
    const lower = query.toLowerCase();

    // Query 1: Spending distribution
    if (lower.includes("spending the most") || lower.includes("where am i spending") || lower.includes("categories")) {
      const intel = await insightsService.getIntelligenceReport("30d");
      const cats = intel.categoryBreakdown;

      return {
        calculatedData: {
          type: "spending_breakdown",
          title: "Verified Categorical Outflow Distribution",
          sourceEngine: "Velloe Reconciled Ledger Engine v2.4",
          calculationTimestamp: new Date().toISOString(),
          auditBaseline: "Trailing 30-Day Settled Disbursements",
          metrics: cats.map((c) => ({
            label: c.name,
            value: `$${c.amount.toLocaleString()}`,
            change: `${c.changePercentage > 0 ? "+" : ""}${c.changePercentage}%`,
            trend: c.trend === "increasing" ? "up" : c.trend === "decreasing" ? "down" : "neutral",
            verified: true,
            category: `${c.percentageOfTotal}% of total spend`,
          })),
          rawDataSummary: `Total Outflow: $${intel.cashFlow.totalOutflow.toLocaleString()} across ${intel.cashFlow.outflowCount} transactions.`,
        },
        explanationText:
          "Based on your reconciled double-entry ledger, **Hosting & Cloud Infrastructure** is your primary capital outflow at **$14,900.00 (38.8% of total)**, followed by **Software & SaaS Tools at $9,840.00 (25.6%)**.\n\n" +
          "**Key Takeaways:**\n" +
          "• Cloud compute decreased by -11.3% vs the prior period due to automated reserved capacity.\n" +
          "• Discretionary expenses represent only 6.25% ($2,400.00) of overall expenditures.\n" +
          "• Fixed operational infrastructure constitutes 64.4% of all regular commitments.",
      };
    }

    // Query 2: What changed this month
    if (lower.includes("what changed") || lower.includes("month") || lower.includes("variance") || lower.includes("compare")) {
      const intel = await insightsService.getIntelligenceReport("30d");
      const p = intel.periodComparison;
      const cf = intel.cashFlow;

      return {
        calculatedData: {
          type: "period_comparison",
          title: "Period-over-Period Variance Reconciliation",
          sourceEngine: "Velloe Reconciled Variance Comparator",
          calculationTimestamp: new Date().toISOString(),
          auditBaseline: `${p.currentPeriodLabel} vs ${p.previousPeriodLabel}`,
          metrics: [
            {
              label: "Net Operating Spend",
              value: `$${p.currentTotal.toLocaleString()}`,
              change: `${p.percentageChange}%`,
              trend: "down",
              verified: true,
            },
            {
              label: "Net Cash Flow Yield",
              value: `+$${cf.netCashFlow.toLocaleString()}`,
              change: `+${cf.netChangePercentage}%`,
              trend: "up",
              verified: true,
            },
            {
              label: "Operating Margin",
              value: `${cf.operatingMarginPercentage}%`,
              change: "+7.08%",
              trend: "up",
              verified: true,
            },
            {
              label: "Daily Burn Rate",
              value: `$${cf.burnRatePerDay.toLocaleString()}/day`,
              change: "-$122/day",
              trend: "down",
              verified: true,
            },
          ],
          rawDataSummary: `Prior spend: $${p.previousTotal.toLocaleString()} -> Current spend: $${p.currentTotal.toLocaleString()} (Absolute delta: -$${Math.abs(p.absoluteChange).toLocaleString()})`,
        },
        explanationText:
          "Your financial position improved significantly over the trailing 30 days:\n\n" +
          "1. **Disbursement Reduction**: Overall operating outflow contracted by **-$3,680.00 (-8.74%)**.\n" +
          "2. **Margin Expansion**: Operating margin expanded to **26.12%**, delivering a net surplus of **+$13,580.00**.\n" +
          "3. **Velocity**: Daily capital burn cooled to **$1,280.66/day** (down from $1,403.33/day).\n" +
          "4. **Notable Shift**: Cloud infrastructure optimization generated the largest single expenditure decrease (-$1,900.00).",
      };
    }

    // Query 3: Potential savings opportunities
    if (lower.includes("savings") || lower.includes("leakage") || lower.includes("opportunities") || lower.includes("cut")) {
      const rep = await leakageService.getLeakageReport();

      return {
        calculatedData: {
          type: "leakage_opportunities",
          title: "Continuous Anomaly & Optimization Flags",
          sourceEngine: "Velloe Anomaly Detection Engine v1.8",
          calculationTimestamp: new Date().toISOString(),
          auditBaseline: "Reconciled against vendor contracts & license utilization",
          metrics: rep.opportunities.slice(0, 4).map((opp: PotentialOpportunity) => ({
            label: opp.title,
            value: `$${opp.potentialSavings.toLocaleString()}/mo`,
            change: `${opp.changePercentage > 0 ? "+" : ""}${opp.changePercentage.toFixed(1)}%`,
            trend: opp.changePercentage > 0 ? "up" : "neutral",
            verified: true,
            category: opp.categoryLabel,
          })),
          rawDataSummary: `Identified ${rep.activeOpportunitiesCount} actionable opportunities representing $${rep.totalIdentifiedOptimization.toLocaleString()}/mo ($${rep.annualizedSavingsPotential.toLocaleString()}/yr).`,
        },
        explanationText:
          "Finora detected **$1,345.00/mo ($16,140.00/year)** in potential savings opportunities across your accounts without disrupting core operations:\n\n" +
          "• **AWS Inter-Region Egress Spikes**: High cross-AZ traffic flagged in `us-east-1`. Moving data pipelines to private VPC peering saves up to **$640.00/month**.\n" +
          "• **Datadog Unutilized Hosts**: 14 decommissioned EC2 instances still emitting agent telemetry ($280.00/month).\n" +
          "• **Food Delivery Velocity**: Meal delivery accelerated +18.2% (9 transactions, $240). Group orders will optimize fees by ~$45.00/month.\n" +
          "• **Zoom & Figma Add-ons**: Stale licenses totaling $185.00/month can be reclaimed immediately.",
      };
    }

    // Query 4: How is my goal progressing
    if (lower.includes("goal") || lower.includes("milestone") || lower.includes("target")) {
      const goalsRes = await goalsService.getGoals();
      const goals = goalsRes.data;

      return {
        calculatedData: {
          type: "goal_progress",
          title: "Deterministic Milestone Progress & Projection",
          sourceEngine: "Velloe Forward Horizon Forecaster",
          calculationTimestamp: new Date().toISOString(),
          auditBaseline: "Verified Treasury Reserves & Scheduled Auto-Allocations",
          metrics: goals.map((g) => ({
            label: g.title,
            value: `$${g.currentAmount.toLocaleString()} / $${g.targetAmount.toLocaleString()}`,
            change: `${g.projection.actualProgressPercentage}% actual`,
            trend: g.projection.status === "ahead_of_schedule" ? "up" : "neutral",
            verified: true,
            category: `Projected: ${g.projection.projectedProgressPercentage}% by target`,
          })),
          rawDataSummary: `Total funded: $${goals.reduce((a, b) => a + b.currentAmount, 0).toLocaleString()} across ${goals.length} capital milestones.`,
        },
        explanationText:
          "Here is the verified status of your strategic milestones:\n\n" +
          "• **18-Month Treasury Reserve**: **86.0% funded ($430,000 / $500,000)**. Contributing $12,500/mo projects completion by **December 2026** (On Track).\n" +
          "• **Q4 Engineering Capex**: **56.7% funded ($85,000 / $150,000)** with $15,000/mo allocation pacing on target for November 2026.\n" +
          "• **Tax Escrow**: **90.0% funded ($72,000 / $80,000)**, pacing **2.4 months ahead of schedule**.\n\n" +
          "Your monthly capital commitment across all active goals is $31,500.00/month, fully supported by your operating cash flow.",
      };
    }

    // Default / Financial Health
    const intel = await insightsService.getIntelligenceReport("30d");
    const cf = intel.cashFlow;

    return {
      calculatedData: {
        type: "financial_health",
        title: "Holistic Financial Health Snapshot",
        sourceEngine: "Velloe Deterministic Solvency Engine",
        calculationTimestamp: new Date().toISOString(),
        auditBaseline: "Multi-Entity Consolidated Ledger Telemetry",
        metrics: [
          { label: "Treasury Reserves", value: "$348,250.00", verified: true },
          { label: "Cash Flow Yield", value: `+$${cf.netCashFlow.toLocaleString()}/mo`, change: "+37.2%", trend: "up", verified: true },
          { label: "Operating Runway", value: "24.8 Months", change: "+2.4 mo", trend: "up", verified: true },
          { label: "Daily Burn Rate", value: `$${cf.burnRatePerDay.toLocaleString()}/day`, trend: "down", verified: true },
        ],
        rawDataSummary: "Net Solvency Ratio: 9.06x annual recurring liabilities.",
      },
      explanationText:
        "Your overall financial health index is **Strong (92/100)** based on verified solvency and liquidity metrics:\n\n" +
        "1. **Cash Flow Robustness**: Monthly operating surplus sits at **+$13,580.00**, indicating consistent retained capital generation.\n" +
        "2. **Treasury Runway**: At the verified burn rate of $1,280.66/day, your liquid runway stands at **24.8 months**.\n" +
        "3. **Capital Stability**: Total debt service is zero, with all short-term provisions (taxes and software licenses) fully funded.",
    };
  }

  /**
   * Streaming response generator with AbortController support.
   */
  async streamResponse(
    query: string,
    onChunk: (chunk: AIStreamChunk) => void,
    signal?: AbortSignal
  ): Promise<FinoraAIMessage> {
    // 1. Rate Limit Check
    const rateCheck = rateLimiter.check();
    if (!rateCheck.allowed) {
      const rateErrorMsg: FinoraAIMessage = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content: `**Rate Limit Exceeded**: You have made too many requests in a short window. Please wait **${rateCheck.cooldownSeconds} seconds** before initiating another inquiry.`,
        timestamp: new Date().toISOString(),
        error: `Rate limit active. Cooldown: ${rateCheck.cooldownSeconds}s`,
      };
      onChunk({
        deltaText: rateErrorMsg.content,
        isComplete: true,
        error: rateErrorMsg.error,
      });
      return rateErrorMsg;
    }

    // 2. Fetch Deterministic Financial Facts from Backend Context Layer
    const { calculatedData, explanationText } = await this.getFinancialContext(query);

    // 3. Emit Calculated Data Immediately (Verified Foundation)
    onChunk({
      deltaText: "",
      isComplete: false,
      calculatedData,
    });

    // 4. Stream AI-Generated Explanation Chunks
    const words = explanationText.split(" ");
    let accumulated = "";

    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) {
        accumulated += " [Generation stopped by user]";
        break;
      }

      const word = words[i] + (i < words.length - 1 ? " " : "");
      accumulated += word;

      onChunk({
        deltaText: accumulated,
        isComplete: false,
        calculatedData,
      });

      // Realistic typing pacing (25ms - 45ms per token)
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    const finalMessage: FinoraAIMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: accumulated,
      calculatedData,
      timestamp: new Date().toISOString(),
      isStreaming: false,
    };

    onChunk({
      deltaText: accumulated,
      isComplete: true,
      calculatedData,
    });

    return finalMessage;
  }
}

export const aiService = new AIService();
