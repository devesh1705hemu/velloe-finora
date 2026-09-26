"use client";

import { useTenant } from "../context/tenant-context";
import { PermissionKey, Role, PermissionsMap } from "../types";

export interface UsePermissionsResult {
  hasPermission: (permission: PermissionKey) => boolean;
  hasAnyPermission: (permissions: PermissionKey[]) => boolean;
  hasAllPermissions: (permissions: PermissionKey[]) => boolean;
  permissions: PermissionsMap;
  role: Role;
  isOwner: boolean;
  isAdmin: boolean;
  canEdit: boolean;
}

/**
 * Frontend authorization hook
 * Enforces UX gating and role-aware element visibility.
 * WARNING: Backend microservices perform authoritative cryptographic authorization on all requests.
 */
export function usePermissions(): UsePermissionsResult {
  const { permissions, currentRole } = useTenant();

  const hasPermission = (key: PermissionKey): boolean => {
    return Boolean(permissions[key]);
  };

  const hasAnyPermission = (keys: PermissionKey[]): boolean => {
    return keys.some((key) => Boolean(permissions[key]));
  };

  const hasAllPermissions = (keys: PermissionKey[]): boolean => {
    return keys.every((key) => Boolean(permissions[key]));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    role: currentRole,
    isOwner: currentRole === "owner",
    isAdmin: currentRole === "admin" || currentRole === "owner",
    canEdit: Boolean(permissions.canEditTransactions),
  };
}

export function usePermission(key: PermissionKey): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(key);
}
