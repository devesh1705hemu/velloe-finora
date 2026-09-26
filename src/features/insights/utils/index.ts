import { InsightImpact } from "../types";

export function getImpactBadgeVariant(impact: InsightImpact): "risk" | "warning" | "growth" {
  switch (impact) {
    case "high":
      return "risk";
    case "medium":
      return "warning";
    case "low":
      return "growth";
  }
}
