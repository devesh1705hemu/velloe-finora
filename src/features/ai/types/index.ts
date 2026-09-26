import { ID, ISODateString } from "@/types/common";

export type MessageRole = "user" | "assistant" | "system";

export interface VerifiedMetricItem {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  verified: boolean;
  category?: string;
}

export interface VerifiedCalculatedData {
  type:
    | "spending_breakdown"
    | "period_comparison"
    | "leakage_opportunities"
    | "goal_progress"
    | "financial_health";
  title: string;
  sourceEngine: string; // e.g. "Velloe Deterministic Ledger v2.4"
  calculationTimestamp: ISODateString;
  auditBaseline: string;
  metrics: VerifiedMetricItem[];
  rawDataSummary?: string;
}

export interface FinoraAIMessage {
  id: ID;
  role: MessageRole;
  content: string; // The AI-generated explanation
  calculatedData?: VerifiedCalculatedData; // The separate, verified deterministic calculations
  timestamp: ISODateString;
  isStreaming?: boolean;
  error?: string;
  suggestedQuestions?: string[];
}

export interface AIConversation {
  id: ID;
  title: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  messages: FinoraAIMessage[];
}

export interface AIStreamChunk {
  deltaText: string;
  isComplete: boolean;
  calculatedData?: VerifiedCalculatedData;
  error?: string;
}
