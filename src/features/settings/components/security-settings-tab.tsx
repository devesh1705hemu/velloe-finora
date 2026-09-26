"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Key,
  Shield,
  Smartphone,
  Laptop,
  AlertTriangle,
  Lock,
  LogOut,
  CheckCircle2,
  Trash2,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ActiveSession,
  MFASetup,
  SecurityEvent,
} from "../types";
import { changePasswordSchema, ChangePasswordInput } from "../schemas";
import { formatDate } from "@/utils/date";

export interface SecuritySettingsTabProps {
  sessions: ActiveSession[];
  securityEvents: SecurityEvent[];
  mfa: MFASetup;
  onRevokeSession: (sessionId: string) => Promise<void>;
  onLogoutAllSessions: () => Promise<void>;
  onChangePassword: (input: ChangePasswordInput) => Promise<void>;
  onOpenDeleteAccount: () => void;
  onOpenMFASetup: () => void;
}

export function SecuritySettingsTab({
  sessions,
  securityEvents,
  mfa,
  onRevokeSession,
  onLogoutAllSessions,
  onChangePassword,
  onOpenDeleteAccount,
  onOpenMFASetup,
}: SecuritySettingsTabProps) {
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (values: ChangePasswordInput) => {
    await onChangePassword(values);
    reset();
    setShowPasswordSuccess(true);
    setTimeout(() => setShowPasswordSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. PASSWORD MANAGEMENT */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Password Management
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Secure your account using hardware-resistant Argon2id hashed credentials
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Argon2id Enforced
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-lg text-xs">
            {showPasswordSuccess && (
              <div className="rounded-xl border border-growth/40 bg-growth/10 p-3 text-growth flex items-center gap-2 animate-in fade-in-0">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Password updated successfully across all authorization nodes.</span>
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("currentPassword")}
                  placeholder="Enter current password"
                  className="text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[10px] text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder="Minimum 10 chars, uppercase, lowercase, numbers, symbol"
                  className="text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[10px] text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Confirm New Password</label>
              <Input
                type="password"
                {...register("confirmPassword")}
                placeholder="Re-enter new password"
                className="text-xs"
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Updating..." : "Update Password"}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. MULTI-FACTOR AUTHENTICATION (MFA) */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-growth/10 text-growth">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Multi-Factor Authentication (MFA)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Protect sensitive corporate treasury transfers using TOTP authenticator tokens
                </p>
              </div>
            </div>
            <Badge variant={mfa.isEnabled ? "growth" : "risk"} className="text-[10px]">
              {mfa.isEnabled ? "Enforced & Active" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/20 p-4">
            <div className="space-y-1">
              <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-growth" />
                Authenticator App (TOTP)
              </span>
              <p className="text-muted-foreground text-[11px]">
                Google Authenticator, 1Password, or YubiKey configured. Verified on {formatDate(mfa.verifiedAt || new Date().toISOString())}.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMFASetup}
              className="text-xs h-8 shrink-0"
            >
              Reconfigure MFA & Backup Codes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. ACTIVE SESSIONS */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Laptop className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Active User Sessions
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Devices and locations currently authorized with workspace cryptographic tokens
                </p>
              </div>
            </div>

            {/* Logout all sessions */}
            {showLogoutAllConfirm ? (
              <div className="flex items-center gap-2 animate-in fade-in-0">
                <span className="text-[11px] text-destructive font-semibold">Terminate all others?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    await onLogoutAllSessions();
                    setShowLogoutAllConfirm(false);
                  }}
                  className="h-8 text-xs"
                >
                  Yes, Terminate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogoutAllConfirm(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutAllConfirm(true)}
                className="h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout All Other Sessions</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="divide-y divide-border/60 rounded-xl border border-border/80 overflow-hidden">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-card hover:bg-accent/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{sess.device}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{sess.browser} on {sess.os}</span>
                    {sess.isCurrent && (
                      <Badge variant="growth" className="text-[9px] uppercase font-mono">
                        This Session
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground font-mono">
                    <span>IP: {sess.ipAddress}</span>
                    <span>•</span>
                    <span>{sess.location}</span>
                    <span>•</span>
                    <span>Last active: {formatDate(sess.lastActive)}</span>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRevokeSession(sess.id)}
                    className="h-8 text-xs text-destructive hover:bg-destructive/10 w-fit self-end sm:self-center"
                  >
                    Revoke Session
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. SECURITY EVENTS LOG */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Security Events Log
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Immutable chronological audit of authentication, credential rotation, and challenge records
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Live Security Telemetry
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {securityEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{event.eventType}</span>
                    <Badge variant="growth" className="text-[9px] py-0 font-mono">
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {event.description}
                  </p>
                  <div className="text-[10px] text-muted-foreground font-mono pt-0.5">
                    {event.ipAddress} • {event.location}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                  {formatDate(event.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. ACCOUNT DELETION (DANGER ZONE) */}
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="text-base font-bold text-destructive">
              Danger Zone: Account Deletion
            </h3>
          </div>
          <Badge variant="risk" className="text-[10px]">
            Irreversible Action
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Deleting your account will immediately revoke all access tokens, disconnect connected bank conduits, purge active workspace membership, and schedule all associated private financial models for cryptographic destruction.
        </p>

        <div className="pt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={onOpenDeleteAccount}
            className="text-xs gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Account & Purge Data</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
