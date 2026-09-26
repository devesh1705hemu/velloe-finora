import { DateRange } from "@/types/common";

/**
 * Enterprise date formatting utility.
 */
export function formatDate(
  dateInput: string | Date | number,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
  locale: string = "en-US"
): string {
  try {
    const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return String(dateInput);
  }
}

/**
 * Returns formatted date and time for financial ledger records.
 */
export function formatDateTime(
  dateInput: string | Date | number,
  locale: string = "en-US"
): string {
  return formatDate(
    dateInput,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    },
    locale
  );
}

/**
 * Returns preset date ranges for financial reporting.
 */
export function getFinancialPeriodRange(period: "mtd" | "ytd" | "last30" | "last90"): DateRange {
  const now = new Date();
  const endDate = now.toISOString();

  let start: Date;
  switch (period) {
    case "mtd":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "ytd":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "last30":
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "last90":
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
  }

  return {
    startDate: start.toISOString(),
    endDate,
  };
}
