"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Laptop,
  Smartphone,
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordStrengthMeter } from "@/features/auth/components";
import {
  changePasswordSchema,
  deleteAccountSchema,
  type ChangePasswordInput,
  type DeleteAccountInput,
} from "@/features/auth/schemas";
import {
  useActiveSessions,
  useRevokeSession,
  useRevokeAllOtherSessions,
  useChangePassword,
  useDeleteAccount,
} from "@/features/auth/hooks";
import { formatDateTime } from "@/utils/date";
import { getUserFriendlyErrorMessage } from "@/utils/error";

export default function AccountSecurityPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Queries & Mutations
  const { data: sessions, isLoading: sessionsLoading } = useActiveSessions();
  const revokeSessionMutation = useRevokeSession();
  const revokeAllMutation = useRevokeAllOtherSessions();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  // Change Password Form
  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    watch: watchPass,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPasswordValue = watchPass("newPassword");

  const onPasswordSubmit = async (data: ChangePasswordInput) => {
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await changePasswordMutation.mutateAsync(data);
      setPasswordSuccess(true);
      resetPass();
    } catch (err) {
      setPasswordError(getUserFriendlyErrorMessage(err));
    }
  };

  // Delete Account Form
  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    formState: { errors: deleteErrors },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      confirmation: "" as unknown as "DELETE",
      currentPassword: "",
    },
  });

  const onDeleteSubmit = async (data: DeleteAccountInput) => {
    setDeleteError(null);
    try {
      await deleteAccountMutation.mutateAsync(data);
    } catch (err) {
      setDeleteError(getUserFriendlyErrorMessage(err));
    }
  };

  const hasSuspiciousSession = sessions?.some((s) => s.isSuspicious);

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
              <Link href="/dashboard">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
              </Link>
            </Button>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account Security & Access
            </span>
          </div>
          <Badge variant="growth" className="text-xs gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Zero-Trust Active
          </Badge>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Security & Session Controls
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your credentials, active authentication sessions, multi-factor policies, and data controls.
          </p>
        </div>

        {/* Suspicious Session Banner Alert if flagged */}
        {hasSuspiciousSession && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-500 flex items-start gap-3 animate-in fade-in-50">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-rose-500" />
            <div className="space-y-1">
              <span className="font-bold text-sm text-foreground block">
                Suspicious Login Detected
              </span>
              <p className="text-muted-foreground leading-relaxed">
                An active session from an unrecognized device or unusual location was flagged by Velloe-Finora Security Engine. We recommend revoking unfamiliar sessions immediately and rotating your password.
              </p>
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs"
                  onClick={() => revokeAllMutation.mutate()}
                  isLoading={revokeAllMutation.isPending}
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" /> Revoke All Other Sessions
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 1. Active Sessions & Suspicious Session Handling */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Laptop className="h-4 w-4 text-primary" /> Active Authentication Sessions
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Current devices with access to your financial intelligence workspace.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5"
              onClick={() => revokeAllMutation.mutate()}
              isLoading={revokeAllMutation.isPending}
              disabled={sessionsLoading || !sessions || sessions.length <= 1}
            >
              <LogOut className="h-3.5 w-3.5" /> Logout All Other Sessions
            </Button>
          </div>

          <div className="space-y-3">
            {sessionsLoading ? (
              <div className="p-4 text-xs text-muted-foreground text-center">Loading active sessions...</div>
            ) : !sessions || sessions.length === 0 ? (
              <div className="p-4 text-xs text-muted-foreground text-center">No active sessions detected.</div>
            ) : (
              sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                    sess.isSuspicious
                      ? "border-rose-500/40 bg-rose-500/5"
                      : sess.isCurrent
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/60 bg-muted/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border border-border text-muted-foreground mt-0.5">
                      {sess.device.toLowerCase().includes("mobile") ? (
                        <Smartphone className="h-4 w-4" />
                      ) : (
                        <Laptop className="h-4 w-4" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        <span>{sess.device} — {sess.browser}</span>
                        {sess.isCurrent && (
                          <Badge variant="growth" className="text-[9px] py-0 px-1">
                            Current Device
                          </Badge>
                        )}
                        {sess.isSuspicious && (
                          <Badge variant="risk" className="text-[9px] py-0 px-1 uppercase">
                            Suspicious
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-2">
                        <span>Location: {sess.location}</span>
                        <span>•</span>
                        {/* Redacted IP address: Never exposes internal IP or sensitive telemetry */}
                        <span className="font-mono">IP: {sess.ipRedacted}</span>
                        <span>•</span>
                        <span>Active: {formatDateTime(sess.lastActiveAt)}</span>
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 self-end sm:self-center text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      onClick={() => revokeSessionMutation.mutate(sess.id)}
                      isLoading={revokeSessionMutation.isPending}
                    >
                      Revoke Access
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Password Change */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
          <div className="border-b border-border/60 pb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" /> Change Master Password
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Requires your existing password to verify authorized ownership.
            </p>
          </div>

          {passwordSuccess && (
            <div className="rounded-lg border border-growth/30 bg-growth/10 p-3 text-xs text-growth flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Your password has been successfully updated. All active tokens refreshed.</span>
            </div>
          )}

          {passwordError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePassSubmit(onPasswordSubmit)} className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={changePasswordMutation.isPending}
                error={!!passErrors.currentPassword}
                {...registerPass("currentPassword")}
              />
              {passErrors.currentPassword && (
                <p className="text-[11px] text-destructive">{passErrors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={changePasswordMutation.isPending}
                error={!!passErrors.newPassword}
                {...registerPass("newPassword")}
              />
              {passErrors.newPassword && (
                <p className="text-[11px] text-destructive">{passErrors.newPassword.message}</p>
              )}
              <PasswordStrengthMeter password={newPasswordValue} className="pt-1" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={changePasswordMutation.isPending}
                error={!!passErrors.confirmNewPassword}
                {...registerPass("confirmNewPassword")}
              />
              {passErrors.confirmNewPassword && (
                <p className="text-[11px] text-destructive">{passErrors.confirmNewPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              className="h-9 gap-1.5"
              isLoading={changePasswordMutation.isPending}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Save New Password</span>
            </Button>
          </form>
        </div>

        {/* 3. Account Deletion Confirmation (Danger Zone) */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Danger Zone: Delete Account
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Permanently delete your user credentials, isolated workspaces, ledger entries, and historical simulations. This action is irreversible.
            </p>
          </div>

          <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-9 text-xs">
                Delete Velloe-Finora Account
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Irreversible Account Deletion
                </DialogTitle>
                <DialogDescription className="text-xs leading-relaxed text-muted-foreground pt-1">
                  This will immediately terminate your session, purge connected banking tokens from secure HSM memory, and permanently erase all financial records.
                </DialogDescription>
              </DialogHeader>

              {deleteError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                  {deleteError}
                </div>
              )}

              <form onSubmit={handleDeleteSubmit(onDeleteSubmit)} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="confirmation" className="text-xs">
                    Type <strong className="text-destructive">DELETE</strong> to confirm:
                  </Label>
                  <Input
                    id="confirmation"
                    type="text"
                    placeholder="DELETE"
                    error={!!deleteErrors.confirmation}
                    {...registerDelete("confirmation")}
                  />
                  {deleteErrors.confirmation && (
                    <p className="text-[11px] text-destructive">{deleteErrors.confirmation.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="deletePass" className="text-xs">Confirm your password:</Label>
                  <Input
                    id="deletePass"
                    type="password"
                    placeholder="••••••••"
                    error={!!deleteErrors.currentPassword}
                    {...registerDelete("currentPassword")}
                  />
                  {deleteErrors.currentPassword && (
                    <p className="text-[11px] text-destructive">{deleteErrors.currentPassword.message}</p>
                  )}
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    size="sm"
                    isLoading={deleteAccountMutation.isPending}
                  >
                    Permanently Delete
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
