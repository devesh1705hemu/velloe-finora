"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/features/auth/components";
import { verifyEmailSchema, type VerifyEmailInput } from "@/features/auth/schemas";
import { useVerifyEmail } from "@/features/auth/hooks";
import { getUserFriendlyErrorMessage } from "@/utils/error";

export default function VerifyEmailPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const verifyMutation = useVerifyEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifyEmailInput) => {
    setErrorMessage(null);
    try {
      await verifyMutation.mutateAsync(data);
    } catch (err: unknown) {
      setErrorMessage(getUserFriendlyErrorMessage(err));
    }
  };

  const handleResend = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <AuthCard
        title="Verify your Work Email"
        description="We sent a 6-digit verification code to your email. Enter it below to activate your workspace."
        footer={
          <p>
            Wrong email address?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create a new account
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
          <div className="space-y-1.5 text-center">
            <Label htmlFor="code" className="text-xs text-muted-foreground">
              6-Digit Verification Code
            </Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              autoComplete="one-time-code"
              disabled={verifyMutation.isPending}
              error={!!errors.code}
              className="text-center font-mono text-2xl tracking-[0.4em] h-12 uppercase"
              {...register("code")}
            />
            {errors.code && (
              <p className="text-[11px] text-destructive">{errors.code.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-10 shadow-md gap-1.5"
            isLoading={verifyMutation.isPending}
          >
            <MailCheck className="h-4 w-4" />
            <span>Verify & Enter Velloe-Finora</span>
          </Button>

          <div className="text-center pt-2">
            {resendCooldown > 0 ? (
              <span className="text-xs text-muted-foreground font-mono">
                Resend code in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Didn&apos;t receive code? Resend
              </button>
            )}
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
