import { TransactionStatus } from "../types";

export function getStatusBadgeVariant(status: TransactionStatus): "growth" | "risk" | "warning" | "secondary" {
  switch (status) {
    case "settled":
    case "reconciled":
      return "growth";
    case "flagged":
      return "risk";
    case "pending":
      return "warning";
    default:
      return "secondary";
  }
}
