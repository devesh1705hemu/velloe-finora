"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthCard,
  OAuthProviders,
  PasswordStrengthMeter,
} from "@/features/auth/components";
import { signupSchema, type SignupInput } from "@/features/auth/schemas";
import { useSignup } from "@/features/auth/hooks";
import { getUserFriendlyErrorMessage } from "@/utils/error";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: SignupInput) => {
    setErrorMessage(null);
    try {
      await signupMutation.mutateAsync(data);
    } catch (err: unknown) {
      setErrorMessage(getUserFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <AuthCard
        title="Create your Velloe-Finora Account"
        description="Experience continuous financial intelligence and leakage defense."
        footer={
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        }
      >
        {errorMessage && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Vance"
              autoComplete="name"
              disabled={signupMutation.isPending}
              error={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[11px] text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Work Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@company.com"
              autoComplete="email"
              disabled={signupMutation.isPending}
              error={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={signupMutation.isPending}
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

            {/* Password strength UI communicating requirements without exposing secrets */}
            <PasswordStrengthMeter password={passwordValue} className="pt-1" />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={signupMutation.isPending}
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

          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-growth" />
            <span>Encrypted at rest with AES-256</span>
          </div>

          <Button
            type="submit"
            className="w-full h-10 shadow-md gap-1.5"
            isLoading={signupMutation.isPending}
          >
            <span>Create Account</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <OAuthProviders isLoading={signupMutation.isPending} />
      </AuthCard>
    </div>
  );
}
