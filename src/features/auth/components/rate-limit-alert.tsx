"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RateLimitAlertProps {
  initialSeconds?: number;
  onCooldownFinished?: () => void;
}

export function RateLimitAlert({
  initialSeconds = 60,
  onCooldownFinished,
}: RateLimitAlertProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onCooldownFinished?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onCooldownFinished]);

  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-500 space-y-2 animate-in fade-in-50">
      <div className="flex items-center gap-2 font-bold">
        <AlertCircle className="h-4 w-4" />
        <span>Rate Limit Exceeded</span>
      </div>
      <p className="text-foreground leading-relaxed">
        Too many consecutive authentication attempts from this client. For security, sign-in is temporarily throttled.
      </p>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 font-mono font-semibold">
          <Clock className="h-3.5 w-3.5" />
          <span>Retry in {secondsRemaining}s</span>
        </div>
        {secondsRemaining <= 0 && (
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onCooldownFinished}>
            Try Now
          </Button>
        )}
      </div>
    </div>
  );
}
