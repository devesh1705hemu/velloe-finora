/**
 * Common Domain Types used across features
 */

export type ID = string;
export type ISODateString = string;

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "CAD" | "AUD" | "JPY" | "CHF";

export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export type FinancialPeriod = "day" | "week" | "month" | "quarter" | "year" | "custom";

export interface DateRange {
  startDate: ISODateString;
  endDate: ISODateString;
}

export type Result<T, E = Error> =
  | { success: true; data: T; error?: never }
  | { success: false; error: E; data?: never };
