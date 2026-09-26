"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthCard,
  OAuthProviders,
  RateLimitAlert,
} from "@/features/auth/components";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { useLogin, useGuestDemoLogin } from "@/features/auth/hooks";
import { ERROR_CODES } from "@/constants/error-codes";
import { normalizeError, getUserFriendlyErrorMessage } from "@/utils/error";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLogin();
  const guestDemoMutation = useGuestDemoLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setErrorMessage(null);
    try {
      await loginMutation.mutateAsync(data);
    } catch (err: unknown) {
      const appErr = normalizeError(err);
      if (appErr.code === ERROR_CODES.RATE_LIMIT_EXCEEDED) {
        setIsRateLimited(true);
      } else {
        setErrorMessage(getUserFriendlyErrorMessage(appErr));
      }
    }
  };

  const handleGuestDemo = async () => {
    setErrorMessage(null);
    try {
      await guestDemoMutation.mutateAsync();
    } catch (err) {
      setErrorMessage(getUserFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <AuthCard
        title="Sign In to Velloe-Finora"
        description="Access institutional-grade capital intelligence and leakage monitoring."
        footer={
          <div className="space-y-3">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Create one now
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
              <span>Protected by End-to-End Cryptographic Handshake</span>
            </div>
          </div>
        }
      >
        {/* Rate Limit Notice */}
        {isRateLimited && (
          <RateLimitAlert
            initialSeconds={45}
            onCooldownFinished={() => setIsRateLimited(false)}
          />
        )}

        {/* Authentication Error Banner */}
        {errorMessage && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Guest Demo One-Click Access */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Explore Demo Environment</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Isolated sandbox session with synthetic capital data.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-xs h-8 border-primary/30 hover:bg-primary/10 shrink-0 ml-2"
            onClick={handleGuestDemo}
            isLoading={guestDemoMutation.isPending}
            disabled={isRateLimited || loginMutation.isPending}
          >
            Explore Demo
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Work Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              disabled={loginMutation.isPending || isRateLimited}
              error={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                tabIndex={-1}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loginMutation.isPending || isRateLimited}
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
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary cursor-pointer"
              disabled={loginMutation.isPending || isRateLimited}
              {...register("rememberMe")}
            />
            <label
              htmlFor="rememberMe"
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              Remember this session on trusted device
            </label>
          </div>

          <Button
            type="submit"
            className="w-full h-10 shadow-md gap-1.5"
            isLoading={loginMutation.isPending}
            disabled={isRateLimited}
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* OAuth SSO Options */}
        <OAuthProviders isLoading={loginMutation.isPending || isRateLimited} />
      </AuthCard>
    </div>
  );
}
