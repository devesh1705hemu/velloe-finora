"use client";

import React from "react";
import { PermissionKey } from "../types";
import { usePermissions } from "../hooks/use-permissions";

export interface PermissionGateProps {
  permission?: PermissionKey;
  anyPermissions?: PermissionKey[];
  allPermissions?: PermissionKey[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * PermissionGate renders children only if current workspace role satisfies the permission requirement.
 * Can be used inline for buttons (e.g. Export Ledger, Invite User) or for whole page sections.
 */
export function PermissionGate({
  permission,
  anyPermissions,
  allPermissions,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let isAllowed = true;

  if (permission && !hasPermission(permission)) {
    isAllowed = false;
  }

  if (anyPermissions && anyPermissions.length > 0 && !hasAnyPermission(anyPermissions)) {
    isAllowed = false;
  }

  if (allPermissions && allPermissions.length > 0 && !hasAllPermissions(allPermissions)) {
    isAllowed = false;
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
