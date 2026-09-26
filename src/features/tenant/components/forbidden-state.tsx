"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "../context/tenant-context";
import { PermissionKey } from "../types";

export interface ForbiddenStateProps {
  requiredPermission?: PermissionKey;
  title?: string;
  description?: string;
  showBackAction?: boolean;
}

export function ForbiddenState({
  requiredPermission,
  title = "Access Restricted by Organization Policy",
  description,
  showBackAction = true,
}: ForbiddenStateProps) {
  const { currentRole, currentWorkspace, switchWorkspace, workspaces } = useTenant();

  const altWorkspace = workspaces.find((w) => w.id !== currentWorkspace.id);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-risk/10 text-risk border border-risk/20 mb-6 shadow-sm">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge variant="risk" className="uppercase tracking-wider text-[11px] font-bold">
          403 Forbidden
        </Badge>
        <Badge variant="outline" className="text-[11px] font-mono capitalize">
          Current Role: {currentRole}
        </Badge>
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl max-w-md">
        {title}
      </h3>

      <p className="mt-3 text-sm text-muted-foreground max-w-lg leading-relaxed">
        {description ??
          `Your role (${currentRole}) in "${currentWorkspace.name}" does not possess the required capability ${
            requiredPermission ? `("${requiredPermission}")` : ""
          } to view or modify this resource.`}
      </p>

      {/* Security Disclaimer Banner */}
      <div className="mt-6 max-w-md rounded-lg border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground text-left">
        <strong className="text-foreground block mb-1">Authoritative Security Notice:</strong>
        Frontend authorization prevents invalid actions locally. All API data queries and mutations are cryptographically validated by the Velloe-Finora backend API gateway.
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {showBackAction && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Dashboard
            </Link>
          </Button>
        )}

        {altWorkspace && (
          <Button
            variant="default"
            size="sm"
            onClick={() => switchWorkspace(altWorkspace.id)}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Switch to {altWorkspace.name}
          </Button>
        )}
      </div>
    </div>
  );
}
