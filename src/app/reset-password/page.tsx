"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard, PasswordStrengthMeter } from "@/features/auth/components";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/auth/schemas";
import { useResetPassword } from "@/features/auth/hooks";
import { getUserFriendlyErrorMessage } from "@/utils/error";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: ResetPasswordInput) => {
    setErrorMessage(null);
    try {
      await resetMutation.mutateAsync(data);
    } catch (err: unknown) {
      setErrorMessage(getUserFriendlyErrorMessage(err));
    }
  };

  return (
    <AuthCard
      title="Create New Password"
      description="Choose a strong, complex password to secure your financial workspace."
      footer={
        <Link
          href="/login"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden or token input if not present in URL */}
        {!token && (
          <div className="space-y-1.5">
            <Label htmlFor="token">Security Reset Token</Label>
            <Input
              id="token"
              type="text"
              placeholder="Paste token from reset email"
              disabled={resetMutation.isPending}
              error={!!errors.token}
              {...register("token")}
            />
            {errors.token && (
              <p className="text-[11px] text-destructive">{errors.token.message}</p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={resetMutation.isPending}
              error={!!errors.password}
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password.message}</p>
          )}

          <PasswordStrengthMeter password={passwordValue} className="pt-1" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={resetMutation.isPending}
              error={!!errors.confirmPassword}
              className="pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-10 shadow-md gap-1.5"
          isLoading={resetMutation.isPending}
        >
          <Lock className="h-4 w-4" />
          <span>Update Password</span>
        </Button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <Suspense fallback={<div className="text-xs text-muted-foreground">Loading session state...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
