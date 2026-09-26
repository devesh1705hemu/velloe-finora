"use client";

import { ShieldCheck, Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground/80 py-1 px-2 border-t border-border/40">
      <div className="flex items-center gap-1.5">
        <Info className="h-3 w-3 text-muted-foreground shrink-0" />
        <span>
          Finora AI synthesizes verified facts from your reconciled double-entry ledger. Responses do not constitute licensed fiduciary, tax, or investment advice.
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-1 font-mono text-[9px] shrink-0 text-growth">
        <ShieldCheck className="h-3 w-3" />
        <span>Backend Context Layer Verified</span>
      </div>
    </div>
  );
}
