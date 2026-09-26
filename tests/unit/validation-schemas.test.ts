import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema } from "@/features/auth/schemas";
import { transactionFormSchema, csvRowSchema } from "@/features/transactions/schemas";
import { createGoalSchema } from "@/features/goals/schemas";
import { changePasswordSchema } from "@/features/settings/schemas";

describe("Validation Schemas Specification", () => {
  describe("Authentication Schemas", () => {
    it("validates compliant login inputs", () => {
      const valid = loginSchema.safeParse({
        email: "finance.director@finora.internal",
        password: "ValidSecurePassword123!",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects invalid emails in login", () => {
      const invalid = loginSchema.safeParse({
        email: "not-an-email",
        password: "ValidSecurePassword123!",
      });
      expect(invalid.success).toBe(false);
    });

    it("enforces password confirmation match in signup", () => {
      const mismatch = signupSchema.safeParse({
        name: "Alex Morgan",
        email: "alex@finora.internal",
        password: "StrongPassword123!",
        confirmPassword: "DifferentPassword456!",
      });
      expect(mismatch.success).toBe(false);
    });
  });

  describe("Transaction Schemas", () => {
    it("validates standard transaction creation payload", () => {
      const valid = transactionFormSchema.safeParse({
        postedAt: "2026-09-26",
        amount: 2450.75,
        currency: "USD",
        type: "expense",
        categoryId: "cat-cloud",
        merchantName: "Amazon Web Services",
        accountId: "acc-mercury-01",
        status: "settled",
        description: "Monthly production compute egress",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects zero or negative transaction amounts", () => {
      const zeroAmount = transactionFormSchema.safeParse({
        postedAt: "2026-09-26",
        amount: 0,
        currency: "USD",
        type: "expense",
        categoryId: "cat-tools",
        merchantName: "Test Merchant",
        accountId: "acc-mercury-01",
        status: "settled",
      });
      expect(zeroAmount.success).toBe(false);
    });

    it("validates CSV row imports", () => {
      const validRow = csvRowSchema.safeParse({
        postedAt: "2026-09-26",
        merchantName: "GitHub Enterprise",
        amount: 420.00,
        type: "expense",
        category: "Software & SaaS",
        accountName: "Mercury Operating",
        status: "settled",
      });
      expect(validRow.success).toBe(true);
    });
  });

  describe("Goal Planning Schemas", () => {
    it("validates legitimate financial goal inputs", () => {
      const valid = createGoalSchema.safeParse({
        title: "18-Month Operating Treasury Reserve",
        category: "reserve_fund",
        priority: "critical",
        targetAmount: 500000,
        initialAmount: 420000,
        monthlyContribution: 12500,
        currency: "USD",
        targetDate: "2026-12-31",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects goals missing a title or negative target", () => {
      const invalid = createGoalSchema.safeParse({
        title: "A", // too short
        category: "reserve_fund",
        priority: "critical",
        targetAmount: -500,
        initialAmount: 0,
        monthlyContribution: 1000,
        currency: "USD",
        targetDate: "2026-12-31",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("Security Settings Schemas", () => {
    it("enforces strong password policy (10+ chars, upper, lower, number, symbol)", () => {
      const weak = changePasswordSchema.safeParse({
        currentPassword: "OldPassword123!",
        newPassword: "short",
        confirmPassword: "short",
      });
      expect(weak.success).toBe(false);

      const strong = changePasswordSchema.safeParse({
        currentPassword: "OldPassword123!",
        newPassword: "Argon2HashedPassword2026!",
        confirmPassword: "Argon2HashedPassword2026!",
      });
      expect(strong.success).toBe(true);
    });
  });
});
