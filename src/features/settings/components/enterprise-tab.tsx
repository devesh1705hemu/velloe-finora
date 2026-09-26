"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  Shield,
  UserPlus,
  Trash2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EnterpriseMember } from "../types";
import { Role } from "@/features/tenant/types";
import { ROLE_PERMISSIONS } from "@/features/tenant/constants/permissions";
import { formatDate } from "@/utils/date";

export interface EnterpriseTabProps {
  members: EnterpriseMember[];
  onOpenInvite: () => void;
  onUpdateRole: (id: string, newRole: Role) => Promise<void>;
  onRemoveMember: (id: string) => Promise<void>;
}

export function EnterpriseTab({
  members,
  onOpenInvite,
  onUpdateRole,
  onRemoveMember,
}: EnterpriseTabProps) {
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<Role>("manager");

  const roles: { id: Role; label: string; description: string }[] = [
    { id: "owner", label: "Owner", description: "Full billing ownership, security governance, and organization tenancy." },
    { id: "admin", label: "Admin", description: "Manages team members, integrations, and workspace permissions." },
    { id: "manager", label: "Manager", description: "Directs financial planning, scenario modeling, and user oversight." },
    { id: "financial_analyst", label: "Analyst", description: "Reconciles double-entry transactions and executes AI simulations." },
    { id: "member", label: "Member", description: "Read-only access to reports and financial intelligence briefings." },
    { id: "viewer", label: "Viewer", description: "Auditor view restricted strictly to balance and transaction inspection." },
  ];

  const permissionsList = [
    { key: "canViewTransactions", label: "View Transactions & Ledger" },
    { key: "canEditTransactions", label: "Create / Edit Transactions" },
    { key: "canExportData", label: "Export Portability Archives" },
    { key: "canManageUsers", label: "Invite & Manage Team Users" },
    { key: "canViewReports", label: "Access Financial Reports" },
    { key: "canConfigureIntegrations", label: "Connect Banking Conduits" },
    { key: "canExecuteAIQueries", label: "Query Finora AI Assistant" },
    { key: "canRunSimulations", label: "Run Future Sandbox Simulations" },
    { key: "canDismissLeakage", label: "Dismiss Leakage Opportunities" },
    { key: "canViewAuditLogs", label: "Access Security & Compliance Audit Log" },
    { key: "canManageBilling", label: "Manage Enterprise Billing & Invoices" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* 1. ORGANIZATION CONTEXT */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Enterprise Organization Context
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Apex Horizon Technologies Inc. (Enterprise Multi-Tenant Tenant)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono">
                Tenant ID: org-apex-01
              </Badge>
              <Badge variant="growth" className="text-[10px]">
                Enterprise Tier
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
              <span className="text-muted-foreground block text-[11px] mb-1">
                Single Sign-On (SSO)
              </span>
              <span className="font-bold text-growth font-mono">
                SAML 2.0 / Okta Active
              </span>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
              <span className="text-muted-foreground block text-[11px] mb-1">
                Security Enforcements
              </span>
              <span className="font-bold text-foreground font-mono">
                Enforced MFA & SCIM
              </span>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
              <span className="text-muted-foreground block text-[11px] mb-1">
                Data Residency
              </span>
              <span className="font-bold text-foreground font-mono">
                US-East (AWS KMS Isolated)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. TEAM USERS & ROLE ASSIGNMENT */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Workspace Team & Roles
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Manage user access, role delegations, and enterprise seat allocations
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={onOpenInvite}
              className="text-xs gap-1.5 h-8 shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Invite Team Member</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="divide-y divide-border/60 rounded-xl border border-border/80 overflow-hidden">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-card hover:bg-accent/30 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{member.name}</span>
                    <Badge variant="outline" className="text-[10px] font-mono capitalize">
                      {member.role.replace("_", " ")}
                    </Badge>
                    {member.status === "invited" && (
                      <Badge variant="secondary" className="text-[10px]">
                        Invite Pending
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {member.email} • Joined {formatDate(member.joinedAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Role Selector */}
                  <select
                    value={member.role}
                    disabled={member.role === "owner"}
                    onChange={(e) => onUpdateRole(member.id, e.target.value as Role)}
                    className="rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="financial_analyst">Analyst</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                  </select>

                  {member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveMember(member.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      title="Remove member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. GRANULAR PERMISSION MATRIX & SECURITY PHILOSOPHY */}
      <Card>
        <CardHeader className="pb-4 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-growth/10 text-growth">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Role Capabilities & Authorization Matrix
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Inspect server-enforced permissions per workspace role
                </p>
              </div>
            </div>

            {/* Role Tab Selector */}
            <div className="flex flex-wrap items-center gap-1">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoleForMatrix(r.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    selectedRoleForMatrix === r.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          {/* Authorization Philosophy Banner */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-[11px] text-muted-foreground flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-foreground">Architectural Security Principle: </strong>
              Never assume that frontend role checks provide security. Frontend checks serve purely for UI ergonomical gating. All ledger mutations, data exports, and team management endpoints remain strictly authorized by backend authorization middleware.
            </div>
          </div>

          {/* Matrix Checklist */}
          <div className="rounded-xl border border-border/80 divide-y divide-border/60">
            {permissionsList.map((perm) => {
              const isAllowed = ROLE_PERMISSIONS[selectedRoleForMatrix][perm.key];

              return (
                <div
                  key={perm.key}
                  className="p-3 flex items-center justify-between hover:bg-accent/20 transition-colors"
                >
                  <span className="font-medium text-foreground">
                    {perm.label}
                  </span>

                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    {isAllowed ? (
                      <span className="inline-flex items-center gap-1 text-growth font-bold">
                        <Check className="h-3.5 w-3.5" /> Allowed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground/60 font-medium">
                        <X className="h-3.5 w-3.5 text-destructive/70" /> Restricted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
