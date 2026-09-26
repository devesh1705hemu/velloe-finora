/**
 * Multi-tenant Core Types & Permission Models
 * Designed to support enterprise organizations, multiple workspaces, role-based access control,
 * and granular capability gating without hardcoding tenant specifics into UI components.
 */

export type WorkspaceType = "personal" | "organization";

export type Role = "owner" | "admin" | "manager" | "financial_analyst" | "member" | "viewer";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  tier: "starter" | "growth" | "enterprise";
  plan: string;
  createdAt: string;
}

export interface WorkspaceMetrics {
  totalBalance: number;
  monthlyBurn: number;
  runwayMonths: number;
  teamMembersCount: number;
  activeCurrencies: string[];
}

export interface Workspace {
  id: string;
  orgId?: string; // Present if part of an organization, undefined for purely personal workspaces
  name: string;
  slug: string;
  type: WorkspaceType;
  role: Role;
  currency: string;
  avatar?: string;
  metrics: WorkspaceMetrics;
}

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  activeWorkspaceId: string;
}

/**
 * Granular Permission Matrix Keys
 */
export type PermissionKey =
  | "canViewTransactions"
  | "canEditTransactions"
  | "canExportData"
  | "canManageUsers"
  | "canViewReports"
  | "canConfigureIntegrations"
  | "canExecuteAIQueries"
  | "canManageBilling"
  | "canRunSimulations"
  | "canDismissLeakage"
  | "canViewAuditLogs";

export type PermissionsMap = Record<PermissionKey, boolean>;

export interface TenantContextValue {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  organizations: Organization[];
  currentRole: Role;
  permissions: PermissionsMap;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (data: { name: string; type: WorkspaceType; orgId?: string }) => void;
  isLoading: boolean;
}
