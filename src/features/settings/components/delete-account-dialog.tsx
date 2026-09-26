"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteAccountSchema, DeleteAccountInput } from "../schemas";

export interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountDialog({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      confirmationPhrase: undefined,
      password: "",
    },
  });

  if (!isOpen) return null;

  const onFormSubmit = async () => {
    await onConfirm();
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
        className="relative w-full max-w-md rounded-2xl border border-destructive/50 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold">Permanently Delete Account</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          This is an irreversible, destructive enterprise action. All personal and organizational associations, bank tokens, and simulation snapshots will be purged.
        </p>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">
              Type <strong className="text-destructive font-mono">&ldquo;DELETE MY ACCOUNT&rdquo;</strong> to confirm:
            </label>
            <Input
              type="text"
              {...register("confirmationPhrase")}
              placeholder="DELETE MY ACCOUNT"
              className="text-xs font-mono"
            />
            {errors.confirmationPhrase && (
              <p className="text-[10px] text-destructive">
                {errors.confirmationPhrase.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Account Password</label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Confirm account password"
              className="text-xs"
            />
            {errors.password && (
              <p className="text-[10px] text-destructive">{errors.password.message}</p>
            )}
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
              variant="destructive"
              size="sm"
              disabled={isSubmitting}
              className="text-xs gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Purging..." : "Confirm Deletion"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
