import { LeakageSeverity } from "../types";

export function getLeakageSeverityVariant(severity: LeakageSeverity): "risk" | "warning" | "secondary" {
  switch (severity) {
    case "critical":
    case "high":
      return "risk";
    case "medium":
      return "warning";
    default:
      return "secondary";
  }
}
