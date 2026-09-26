/**
 * Centralized API Endpoints
 * Maps exactly to the production microservice architecture:
 * Gateway -> Auth API, Finance API, AI API
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    MFA_VERIFY: "/auth/mfa/verify",
    PASSWORD_RESET: "/auth/password-reset",
  },
  FINANCE: {
    ACCOUNTS: "/finance/accounts",
    ACCOUNT_BY_ID: (id: string) => `/finance/accounts/${id}`,
    TRANSACTIONS: "/finance/transactions",
    TRANSACTION_BY_ID: (id: string) => `/finance/transactions/${id}`,
    BATCH_TRANSACTIONS: "/finance/transactions/batch",
    CATEGORIES: "/finance/categories",
    BUDGETS: "/finance/budgets",
    LEDGER: "/finance/ledger",
    METRICS: "/finance/metrics",
    LEAKAGE_DETECT: "/finance/leakage/detect",
    LEAKAGE_RESOLVE: (id: string) => `/finance/leakage/${id}/resolve`,
    GOALS: "/finance/goals",
    GOAL_BY_ID: (id: string) => `/finance/goals/${id}`,
  },
  AI: {
    INSIGHTS: "/ai/insights",
    INSIGHT_BY_ID: (id: string) => `/ai/insights/${id}`,
    CHAT: "/ai/copilot/chat",
    FORECAST: "/ai/future/forecast",
    SIMULATION: "/ai/future/simulation",
    CATEGORIZE_TRANSACTION: "/ai/categorize",
    RECEIPT_PARSE: "/ai/receipts/parse",
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
    PREFERENCES: "/settings/preferences",
    SECURITY: "/settings/security",
    API_KEYS: "/settings/api-keys",
    NOTIFICATIONS: "/settings/notifications",
  },
} as const;
