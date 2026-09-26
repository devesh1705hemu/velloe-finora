import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export const inviteUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid corporate email required"),
  role: z.enum(["owner", "admin", "manager", "financial_analyst", "member", "viewer"]),
});

export const deleteAccountSchema = z.object({
  confirmationPhrase: z.literal("DELETE MY ACCOUNT", {
    errorMap: () => ({ message: 'Please type "DELETE MY ACCOUNT" to confirm' }),
  }),
  password: z.string().min(1, "Password required for authentication confirmation"),
});

export const privacyPreferencesSchema = z.object({
  analyticsTracking: z.boolean(),
  aiModelTraining: z.boolean(),
  thirdPartyDataSharing: z.boolean(),
  marketingCommunications: z.boolean(),
  transactionEnrichment: z.boolean(),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type PrivacyPreferencesInput = z.infer<typeof privacyPreferencesSchema>;
