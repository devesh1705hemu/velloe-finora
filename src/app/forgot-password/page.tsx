"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/features/auth/components";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schemas";
import { useForgotPassword } from "@/features/auth/hooks";
import { getUserFriendlyErrorMessage } from "@/utils/error";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const forgotMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setErrorMessage(null);
    try {
      await forgotMutation.mutateAsync(data);
      setIsSubmitted(true);
    } catch (err: unknown) {
      setErrorMessage(getUserFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <AuthCard
        title="Reset your password"
        description="Enter your registered work email to receive password recovery instructions."
        footer={
          <Link
            href="/login"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        }
      >
        {isSubmitted ? (
          <div className="text-center space-y-4 py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-growth/15 text-growth">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Recovery email dispatched</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If an account exists for <span className="font-semibold text-foreground">{getValues("email")}</span>,
                you will receive a time-limited recovery link within a few moments.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setIsSubmitted(false)}
              >
                Send to a different email
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                disabled={forgotMutation.isPending}
                error={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[11px] text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 shadow-md gap-1.5"
              isLoading={forgotMutation.isPending}
            >
              <Mail className="h-4 w-4" />
              <span>Send Recovery Link</span>
            </Button>
          </form>
        )}
      </AuthCard>
    </div>
  );
}
