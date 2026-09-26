import { z } from "zod";

export const idSchema = z.string().min(1, "Identifier cannot be empty");

export const sortOrderSchema = z.enum(["asc", "desc"]);

export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: sortOrderSchema.default("desc"),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime({ message: "Invalid ISO start date" }),
  endDate: z.string().datetime({ message: "Invalid ISO end date" }),
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: "startDate must be before or equal to endDate",
    path: ["endDate"],
  }
);

export const currencyCodeSchema = z.enum([
  "USD",
  "EUR",
  "GBP",
  "INR",
  "CAD",
  "AUD",
  "JPY",
  "CHF",
]);

export type PaginationParamsInput = z.infer<typeof paginationParamsSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
