import { z } from "zod";

export const transactionFormSchema = z.object({
  merchantName: z
    .string()
    .min(2, "Merchant or entity name must be at least 2 characters")
    .max(100, "Merchant name is too long"),
  amount: z
    .coerce
    .number({ invalid_type_error: "Amount must be a valid number" })
    .positive("Amount must be greater than zero"),
  currency: z.enum(["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "CHF"]),
  type: z.enum(["income", "expense", "transfer"]),
  categoryId: z.string().min(1, "Please select a category"),
  accountId: z.string().min(1, "Please select an account"),
  status: z.enum(["settled", "pending", "flagged", "reconciled"]),
  postedAt: z.string().min(1, "Date is required"),
  description: z.string().max(250, "Description must not exceed 250 characters").optional(),
  isFlaggedAsLeakage: z.boolean().optional(),
  leakageReason: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const csvRowSchema = z.object({
  postedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Use YYYY-MM-DD or standard ISO date.",
  }),
  merchantName: z.string().min(1, "Merchant name is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  type: z.enum(["income", "expense", "transfer"], {
    errorMap: () => ({ message: "Type must be 'income', 'expense', or 'transfer'" }),
  }),
  category: z.string().min(1, "Category is required"),
  accountName: z.string().min(1, "Account name is required"),
  description: z.string().optional(),
  status: z.enum(["settled", "pending", "flagged", "reconciled"]).default("settled"),
});

export type CSVRowInput = z.infer<typeof csvRowSchema>;
