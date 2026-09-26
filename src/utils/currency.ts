import { CurrencyCode } from "@/types/common";

export interface FormatCurrencyOptions {
  currency?: CurrencyCode;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
  showSign?: boolean;
}

/**
 * Standard enterprise currency formatter.
 * Handles precision, compact representation ($1.4M), and negative values.
 */
export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = "USD",
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
    showSign = false,
  } = options;

  if (isNaN(amount)) {
    return "--";
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: compact ? 0 : minimumFractionDigits,
    maximumFractionDigits: compact ? 1 : maximumFractionDigits,
    notation: compact ? "compact" : "standard",
    signDisplay: showSign ? "always" : "auto",
  });

  return formatter.format(amount);
}

/**
 * Formats a basis points or percentage difference (e.g. +3.45% or -1.20%).
 */
export function formatPercentage(
  percent: number,
  options: { locale?: string; decimals?: number; showSign?: boolean } = {}
): string {
  const { locale = "en-US", decimals = 2, showSign = true } = options;
  if (isNaN(percent)) return "0.00%";

  const formatted = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: showSign ? "always" : "auto",
  }).format(percent / 100);

  return formatted;
}

/**
 * Computes percentage change between two values.
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Formats compact enterprise currency e.g. $1.5M or $250K
 */
export function formatCompactCurrency(
  amount: number,
  currency: CurrencyCode = "USD"
): string {
  return formatCurrency(amount, { currency, compact: true });
}

