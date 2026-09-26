import {
  Transaction,
  TransactionFilterState,
  PaginatedTransactions,
  TransactionCategory,
} from "../types";
import { TransactionFormValues, transactionFormSchema } from "../schemas";
import {
  INITIAL_TRANSACTIONS,
  TRANSACTION_CATEGORIES,
  CONNECTED_ACCOUNTS,
} from "../constants";

class TransactionService {
  private transactions: Transaction[] = [...INITIAL_TRANSACTIONS];

  /**
   * Retrieves paginated, sorted, and filtered transaction records
   */
  async getTransactions(filter: TransactionFilterState): Promise<PaginatedTransactions> {
    // Simulate realistic async microservice gateway latency
    await new Promise((resolve) => setTimeout(resolve, 60));

    let items = [...this.transactions];

    // 1. Text Search Filter
    if (filter.search?.trim()) {
      const q = filter.search.toLowerCase().trim();
      items = items.filter(
        (tx) =>
          tx.merchantName.toLowerCase().includes(q) ||
          tx.category.name.toLowerCase().includes(q) ||
          tx.accountName.toLowerCase().includes(q) ||
          (tx.description && tx.description.toLowerCase().includes(q))
      );
    }

    // 2. Type Filter
    if (filter.type && filter.type !== "all") {
      items = items.filter((tx) => tx.type === filter.type);
    }

    // 3. Category Filter
    if (filter.categoryId && filter.categoryId !== "all") {
      items = items.filter((tx) => tx.category.id === filter.categoryId);
    }

    // 4. Status Filter
    if (filter.status && filter.status !== "all") {
      items = items.filter((tx) => tx.status === filter.status);
    }

    // 5. Leakage Filter
    if (filter.isLeakage !== undefined && filter.isLeakage) {
      items = items.filter((tx) => tx.isFlaggedAsLeakage);
    }

    // 6. Min/Max Amount Filter
    if (filter.minAmount !== undefined && !isNaN(filter.minAmount)) {
      items = items.filter((tx) => tx.amount >= filter.minAmount!);
    }
    if (filter.maxAmount !== undefined && !isNaN(filter.maxAmount)) {
      items = items.filter((tx) => tx.amount <= filter.maxAmount!);
    }

    // 7. Date Range Filter
    const now = new Date();
    if (filter.dateRangePreset === "7d") {
      const cutoff = new Date(now.getTime() - 7 * 86400000);
      items = items.filter((tx) => new Date(tx.postedAt) >= cutoff);
    } else if (filter.dateRangePreset === "30d") {
      const cutoff = new Date(now.getTime() - 30 * 86400000);
      items = items.filter((tx) => new Date(tx.postedAt) >= cutoff);
    } else if (filter.dateRangePreset === "this_month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      items = items.filter((tx) => new Date(tx.postedAt) >= startOfMonth);
    } else if (filter.dateRangePreset === "last_month") {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      items = items.filter((tx) => {
        const d = new Date(tx.postedAt);
        return d >= startOfLastMonth && d <= endOfLastMonth;
      });
    } else if (filter.dateRangePreset === "custom") {
      if (filter.startDate) {
        const start = new Date(filter.startDate);
        items = items.filter((tx) => new Date(tx.postedAt) >= start);
      }
      if (filter.endDate) {
        const end = new Date(filter.endDate);
        end.setHours(23, 59, 59, 999);
        items = items.filter((tx) => new Date(tx.postedAt) <= end);
      }
    }

    // Compute Summary of filtered dataset before pagination
    let totalIncome = 0;
    let totalExpense = 0;
    let leakageCount = 0;

    items.forEach((tx) => {
      if (tx.type === "income") totalIncome += tx.amount;
      if (tx.type === "expense") totalExpense += tx.amount;
      if (tx.isFlaggedAsLeakage) leakageCount += 1;
    });

    const netCashFlow = totalIncome - totalExpense;

    // 8. Sorting
    const sortBy = filter.sortBy || "postedAt";
    const sortOrder = filter.sortOrder || "desc";

    items.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "postedAt") {
        comparison = new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "merchantName") {
        comparison = a.merchantName.localeCompare(b.merchantName);
      } else if (sortBy === "category") {
        comparison = a.category.name.localeCompare(b.category.name);
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    // 9. Pagination
    const page = Math.max(1, filter.page || 1);
    const pageSize = Math.max(1, filter.pageSize || 10);
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
      summary: {
        totalIncome,
        totalExpense,
        netCashFlow,
        leakageCount,
      },
    };
  }

  /**
   * Retrieves single transaction by ID with full audit details
   */
  async getTransactionById(id: string): Promise<Transaction | null> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return this.transactions.find((tx) => tx.id === id) ?? null;
  }

  /**
   * Creates a new transaction with strict Zod validation
   */
  async createTransaction(payload: TransactionFormValues): Promise<Transaction> {
    // 1. Zod Validation
    const validated = transactionFormSchema.parse(payload);

    await new Promise((resolve) => setTimeout(resolve, 60));

    const category: TransactionCategory =
      TRANSACTION_CATEGORIES.find((c) => c.id === validated.categoryId) ?? {
        id: validated.categoryId,
        name: "General Operating",
        slug: "general",
      };

    const account = CONNECTED_ACCOUNTS.find((a) => a.id === validated.accountId);
    const accountName = account ? account.name : "Operating Checking Account";

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      accountId: validated.accountId,
      accountName,
      amount: validated.amount,
      currency: validated.currency,
      type: validated.type,
      category,
      merchantName: validated.merchantName,
      description: validated.description,
      status: validated.status,
      isFlaggedAsLeakage: Boolean(validated.isFlaggedAsLeakage),
      leakageReason: validated.leakageReason,
      postedAt: new Date(validated.postedAt).toISOString(),
      createdAt: new Date().toISOString(),
      checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
      operatorId: "usr_operator_active",
    };

    this.transactions.unshift(newTx);
    return newTx;
  }

  /**
   * Updates an existing transaction with strict Zod validation
   */
  async updateTransaction(id: string, payload: Partial<TransactionFormValues>): Promise<Transaction> {
    const existing = this.transactions.find((tx) => tx.id === id);
    if (!existing) {
      throw new Error(`Transaction with id "${id}" does not exist.`);
    }

    await new Promise((resolve) => setTimeout(resolve, 60));

    let updatedCategory = existing.category;
    if (payload.categoryId) {
      const found = TRANSACTION_CATEGORIES.find((c) => c.id === payload.categoryId);
      if (found) updatedCategory = found;
    }

    let updatedAccountName = existing.accountName;
    if (payload.accountId) {
      const foundAcc = CONNECTED_ACCOUNTS.find((a) => a.id === payload.accountId);
      if (foundAcc) updatedAccountName = foundAcc.name;
    }

    const updatedTx: Transaction = {
      ...existing,
      merchantName: payload.merchantName ?? existing.merchantName,
      amount: payload.amount !== undefined ? payload.amount : existing.amount,
      currency: payload.currency ?? existing.currency,
      type: payload.type ?? existing.type,
      category: updatedCategory,
      accountId: payload.accountId ?? existing.accountId,
      accountName: updatedAccountName,
      status: payload.status ?? existing.status,
      postedAt: payload.postedAt ? new Date(payload.postedAt).toISOString() : existing.postedAt,
      description: payload.description !== undefined ? payload.description : existing.description,
      isFlaggedAsLeakage:
        payload.isFlaggedAsLeakage !== undefined
          ? payload.isFlaggedAsLeakage
          : existing.isFlaggedAsLeakage,
      leakageReason: payload.leakageReason !== undefined ? payload.leakageReason : existing.leakageReason,
      checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
    };

    this.transactions = this.transactions.map((tx) => (tx.id === id ? updatedTx : tx));
    return updatedTx;
  }

  /**
   * Permanently deletes a transaction
   */
  async deleteTransaction(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const initialLen = this.transactions.length;
    this.transactions = this.transactions.filter((tx) => tx.id !== id);
    return this.transactions.length < initialLen;
  }

  /**
   * Batch imports validated transaction rows
   */
  async importTransactions(
    rows: Array<{
      postedAt: string;
      merchantName: string;
      amount: number;
      type: "income" | "expense" | "transfer";
      categoryName: string;
      accountName: string;
      description?: string;
      status: "settled" | "pending" | "flagged" | "reconciled";
    }>
  ): Promise<{ importedCount: number }> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newItems: Transaction[] = rows.map((row, idx) => {
      const matchedCat = TRANSACTION_CATEGORIES.find(
        (c) => c.name.toLowerCase() === row.categoryName.toLowerCase()
      ) ?? {
        id: `cat-custom-${idx}`,
        name: row.categoryName,
        slug: row.categoryName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        color: "#6366F1",
      };

      return {
        id: `tx-import-${Date.now()}-${idx}`,
        accountId: "acc-imported-batch",
        accountName: row.accountName || "Imported Ledger Conduit",
        amount: row.amount,
        currency: "USD",
        type: row.type,
        category: matchedCat,
        merchantName: row.merchantName,
        description: row.description || "Imported via CSV batch conduit",
        status: row.status,
        isFlaggedAsLeakage: false,
        postedAt: new Date(row.postedAt).toISOString(),
        createdAt: new Date().toISOString(),
        checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
        operatorId: "usr_csv_importer",
      };
    });

    this.transactions = [...newItems, ...this.transactions];
    return { importedCount: newItems.length };
  }

  /**
   * Generates export data string (CSV or JSON format)
   */
  async exportTransactions(filter: TransactionFilterState, format: "csv" | "json"): Promise<string> {
    const result = await this.getTransactions({ ...filter, page: 1, pageSize: 10000 });
    const items = result.items;

    if (format === "json") {
      return JSON.stringify(items, null, 2);
    }

    // CSV format
    const headers = [
      "ID",
      "Date",
      "Merchant",
      "Amount",
      "Currency",
      "Type",
      "Category",
      "Account",
      "Status",
      "Leakage Flag",
      "Description",
      "Checksum",
    ];

    const csvRows = items.map((tx) => [
      `"${tx.id}"`,
      `"${tx.postedAt.split("T")[0]}"`,
      `"${tx.merchantName.replace(/"/g, '""')}"`,
      tx.amount.toFixed(2),
      `"${tx.currency}"`,
      `"${tx.type}"`,
      `"${tx.category.name.replace(/"/g, '""')}"`,
      `"${tx.accountName.replace(/"/g, '""')}"`,
      `"${tx.status}"`,
      `"${tx.isFlaggedAsLeakage ? "YES" : "NO"}"`,
      `"${(tx.description || "").replace(/"/g, '""')}"`,
      `"${tx.checksum || ""}"`,
    ]);

    return [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
  }
}

export const transactionService = new TransactionService();
