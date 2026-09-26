import { CurrencyCode, ID, ISODateString } from "@/types/common";

export type TransactionType = "income" | "expense" | "transfer";
export type TransactionStatus = "settled" | "pending" | "flagged" | "reconciled";

export interface TransactionCategory {
  id: ID;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface Transaction {
  id: ID;
  accountId: ID;
  accountName: string;
  amount: number;
  currency: CurrencyCode;
  type: TransactionType;
  category: TransactionCategory;
  merchantName: string;
  description?: string;
  status: TransactionStatus;
  isFlaggedAsLeakage: boolean;
  leakageReason?: string;
  postedAt: ISODateString;
  createdAt: ISODateString;
  checksum?: string;
  operatorId?: string;
}

export type SortField = "postedAt" | "amount" | "merchantName" | "category" | "status";
export type SortOrder = "asc" | "desc";

export type DateRangePreset = "all" | "7d" | "30d" | "this_month" | "last_month" | "custom";

export interface TransactionFilterState {
  search: string;
  type: "all" | TransactionType;
  categoryId: string;
  status: "all" | TransactionStatus;
  dateRangePreset: DateRangePreset;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  isLeakage?: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: {
    totalIncome: number;
    totalExpense: number;
    netCashFlow: number;
    leakageCount: number;
  };
}

export interface CSVImportRow {
  rowNumber: number;
  postedAt: string;
  merchantName: string;
  amount: string;
  type: string;
  category: string;
  accountName: string;
  description?: string;
  status?: string;
}

export interface CSVValidatedRow {
  rowNumber: number;
  isValid: boolean;
  data: {
    postedAt: string;
    merchantName: string;
    amount: number;
    type: TransactionType;
    categoryName: string;
    accountName: string;
    description?: string;
    status: TransactionStatus;
  };
  errors: Record<string, string>;
}

export interface CSVValidationReport {
  totalRows: number;
  validCount: number;
  errorCount: number;
  rows: CSVValidatedRow[];
}
