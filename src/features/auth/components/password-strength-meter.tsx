"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export function PasswordStrengthMeter({ password = "", className }: PasswordStrengthMeterProps) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedCount = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  const strengthLabel =
    passedCount === 0
      ? ""
      : passedCount <= 2
      ? "Weak"
      : passedCount === 3
      ? "Moderate"
      : "Strong & Enterprise Ready";

  const barColor =
    passedCount <= 2
      ? "bg-rose-500"
      : passedCount === 3
      ? "bg-amber-500"
      : "bg-growth";

  if (!password) {
    return (
      <div className={cn("text-xs text-muted-foreground space-y-1.5", className)}>
        <p className="font-medium text-[11px] text-muted-foreground">Password requirements:</p>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          <span>• 8+ characters</span>
          <span>• Uppercase letter</span>
          <span>• Number (0-9)</span>
          <span>• Special character</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 text-xs", className)}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Strength:</span>
          <span className={cn("font-semibold", passedCount === 4 ? "text-growth" : passedCount === 3 ? "text-amber-500" : "text-rose-500")}>
            {strengthLabel}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-full flex-1 rounded-full transition-all duration-300",
                i < passedCount ? barColor : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirement Badges */}
      <div className="grid grid-cols-2 gap-1 text-[11px]">
        <div className={cn("flex items-center gap-1", hasMinLength ? "text-growth" : "text-muted-foreground")}>
          {hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-50" />}
          <span>8+ characters</span>
        </div>
        <div className={cn("flex items-center gap-1", hasUppercase ? "text-growth" : "text-muted-foreground")}>
          {hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-50" />}
          <span>Uppercase letter</span>
        </div>
        <div className={cn("flex items-center gap-1", hasNumber ? "text-growth" : "text-muted-foreground")}>
          {hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-50" />}
          <span>Number (0-9)</span>
        </div>
        <div className={cn("flex items-center gap-1", hasSpecial ? "text-growth" : "text-muted-foreground")}>
          {hasSpecial ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-50" />}
          <span>Special character</span>
        </div>
      </div>
    </div>
  );
}
