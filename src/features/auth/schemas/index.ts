import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});


export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(70, "Name must be less than 70 characters"),
    email: z.string().trim().email("Please provide a valid work email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Requires at least one uppercase letter")
      .regex(/[0-9]/, "Requires at least one number")
      .regex(/[^A-Za-z0-9]/, "Requires at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please provide a valid registered email"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Requires at least one uppercase letter")
      .regex(/[0-9]/, "Requires at least one number")
      .regex(/[^A-Za-z0-9]/, "Requires at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must contain numbers only"),
});

export const mfaVerificationSchema = z.object({
  mfaTicket: z.string().min(1, "MFA ticket is required"),
  code: z
    .string()
    .length(6, "Security code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must be numeric"),
  isBackupCode: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Requires at least one uppercase letter")
      .regex(/[0-9]/, "Requires at least one number")
      .regex(/[^A-Za-z0-9]/, "Requires at least one special character"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const deleteAccountSchema = z.object({
  confirmation: z.literal("DELETE"),
  currentPassword: z.string().min(1, "Password verification is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type MfaVerificationInput = z.infer<typeof mfaVerificationSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
