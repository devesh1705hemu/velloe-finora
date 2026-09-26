"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, QrCode, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MFASetup } from "../types";

export interface MFASetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mfa: MFASetup;
}

export function MFASetupDialog({
  isOpen,
  onClose,
  mfa,
}: MFASetupDialogProps) {
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  if (!isOpen) return null;

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(mfa.secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyCodes = async () => {
    await navigator.clipboard.writeText(mfa.backupCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleVerify = () => {
    if (verifyCode.trim().length === 6) {
      setIsVerified(true);
      setTimeout(() => {
        setIsVerified(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-4 text-xs"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-growth/10 text-growth">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Two-Factor Authentication (TOTP)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Configure your authenticator app (Google Authenticator, 1Password, Duo)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Scan QR or copy Secret Key */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
          <span className="font-bold text-foreground block">
            Step 1: Scan QR code or enter secret key
          </span>

          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-slate-900 shadow-sm">
              <QrCode className="h-16 w-16" />
            </div>

            <div className="space-y-1.5 flex-1">
              <span className="text-muted-foreground block text-[11px]">Manual Entry Secret:</span>
              <div className="flex items-center gap-2">
                <code className="rounded bg-muted px-2 py-1 font-mono text-[11px] font-bold text-foreground border border-border/60">
                  {mfa.secret}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopySecret}
                  className="h-7 text-[10px] px-2"
                >
                  {copiedSecret ? <Check className="h-3 w-3 text-growth" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <span className="text-[10px] text-muted-foreground block">
                Time-based one-time password (TOTP), 30s interval
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Emergency Backup Codes */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              Step 2: Emergency Recovery Codes
            </span>
            <button
              type="button"
              onClick={handleCopyCodes}
              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {copiedCodes ? <Check className="h-3 w-3 text-growth" /> : <Copy className="h-3 w-3" />}
              <span>{copiedCodes ? "Copied!" : "Copy all"}</span>
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Save these single-use recovery codes in a secure vault in case you lose access to your authenticator.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[11px]">
            {mfa.backupCodes.map((code, idx) => (
              <span key={idx} className="rounded bg-card border border-border/60 p-1.5 text-center text-foreground font-semibold">
                {code}
              </span>
            ))}
          </div>
        </div>

        {/* Step 3: Verify 6-digit code */}
        <div className="space-y-2 pt-1">
          <span className="font-bold text-foreground block">
            Step 3: Verify 6-digit code from authenticator
          </span>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="font-mono text-center tracking-widest text-sm h-9 max-w-[140px]"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleVerify}
              disabled={verifyCode.length !== 6 || isVerified}
              className="h-9 text-xs gap-1.5 bg-growth hover:bg-growth/90 text-growth-foreground"
            >
              {isVerified ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Enrolled!</span>
                </>
              ) : (
                <span>Verify & Activate</span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
