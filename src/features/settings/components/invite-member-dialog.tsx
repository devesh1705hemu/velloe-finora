"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteUserSchema, InviteUserInput } from "../schemas";

export interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (input: InviteUserInput) => Promise<void>;
}

export function InviteMemberDialog({
  isOpen,
  onClose,
  onInvite,
}: InviteMemberDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "manager",
    },
  });

  if (!isOpen) return null;

  const onFormSubmit = async (values: InviteUserInput) => {
    await onInvite(values);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Invite Team Member
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Grant role-based access to workspace ledger & reports
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

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Full Name</label>
            <Input
              {...register("name")}
              placeholder="e.g. Sarah Connor"
              className="text-xs"
            />
            {errors.name && (
              <p className="text-[10px] text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Corporate Email</label>
            <Input
              type="email"
              {...register("email")}
              placeholder="sarah.connor@finora.internal"
              className="text-xs"
            />
            {errors.email && (
              <p className="text-[10px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Assigned Role</label>
            <select
              {...register("role")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="admin">Admin — User management & integrations</option>
              <option value="manager">Manager — Planning, modeling & approvals</option>
              <option value="financial_analyst">Analyst — Double-entry reconciliation</option>
              <option value="member">Member — Read-only access to briefings</option>
              <option value="viewer">Viewer — Read-only auditor inspection</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Inviting..." : "Send Invitation"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
