"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";

export interface RateLimitBannerProps {
  cooldownSeconds: number;
  onCooldownComplete: () => void;
}

export function RateLimitBanner({
  cooldownSeconds: initialCooldown,
  onCooldownComplete,
}: RateLimitBannerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialCooldown);

  useEffect(() => {
    setSecondsRemaining(initialCooldown);
  }, [initialCooldown]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onCooldownComplete();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCooldownComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onCooldownComplete]);

  if (secondsRemaining <= 0) return null;

  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-center justify-between gap-3 animate-in fade-in-0">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          <strong>Inquiry Rate-Limit Active:</strong> Maximum API requests reached for this window.
        </span>
      </div>

      <div className="flex items-center gap-1 font-mono font-bold bg-amber-500/20 px-2.5 py-1 rounded-lg shrink-0">
        <Clock className="h-3 w-3" />
        <span>Resets in {secondsRemaining}s</span>
      </div>
    </div>
  );
}
