"use client";

import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Filter,
  UserCheck,
  UserCog,
  FileSpreadsheet,
  Download,
  Settings2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AuditEvent } from "../types";
import { formatDate } from "@/utils/date";

export interface AuditTabProps {
  auditLogs: AuditEvent[];
  isAuthorized: boolean;
  userRole: string;
}

export function AuditTab({
  auditLogs,
  isAuthorized,
  userRole,
}: AuditTabProps) {
  const [filterAction, setFilterAction] = useState<string>("all");

  // ACCESS GATE: NEVER EXPOSE AUDIT DATA TO UNAUTHORIZED USERS
  if (!isAuthorized) {
    return (
      <Card className="border-destructive/30 bg-card p-12 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base font-bold text-foreground">
            Audit Activity Access Restricted
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your current role (<strong>{userRole}</strong>) lacks the <code>canViewAuditLogs</code> capability. In compliance with enterprise financial governance, audit activity is restricted strictly to Workspace Owners, Administrators, and Managers.
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-destructive/30 text-destructive">
          HTTP 403 Forbidden: Insufficient Audit Clearance
        </Badge>
      </Card>
    );
  }

  const actionFilters = [
    { id: "all", label: "All Audit Events" },
    { id: "user_added", label: "User Added" },
    { id: "role_changed", label: "Role Changed" },
    { id: "report_exported", label: "Report Exported" },
    { id: "transaction_imported", label: "Transaction Imported" },
    { id: "security_setting_changed", label: "Security Setting Changed" },
  ];

  const filteredLogs =
    filterAction === "all"
      ? auditLogs
      : auditLogs.filter((log) => log.action === filterAction);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "user_added":
        return (
          <Badge variant="secondary" className="text-[10px] gap-1 text-primary">
            <UserCheck className="h-3 w-3" /> User added
          </Badge>
        );
      case "role_changed":
        return (
          <Badge variant="outline" className="text-[10px] gap-1 text-amber-500 border-amber-500/30">
            <UserCog className="h-3 w-3" /> Role changed
          </Badge>
        );
      case "report_exported":
        return (
          <Badge variant="outline" className="text-[10px] gap-1 text-sky-500 border-sky-500/30">
            <Download className="h-3 w-3" /> Report exported
          </Badge>
        );
      case "transaction_imported":
        return (
          <Badge variant="growth" className="text-[10px] gap-1">
            <FileSpreadsheet className="h-3 w-3" /> Transaction imported
          </Badge>
        );
      case "security_setting_changed":
      default:
        return (
          <Badge variant="outline" className="text-[10px] gap-1 text-foreground border-border/80">
            <Settings2 className="h-3 w-3" /> Security setting changed
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Compliance & Security Audit Trail
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Tamper-evident log of administrative mutations, export requests, and credential events
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-[10px] font-mono">
            {filteredLogs.length} Records Verified
          </Badge>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0 mr-1" />
          {actionFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterAction(f.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                filterAction === f.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-[10px] uppercase font-mono text-muted-foreground">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Resource / Detail</th>
                <th className="p-3">Network IP</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No audit records matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/30 transition-colors">
                    <td className="p-3 font-mono text-muted-foreground whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{log.actor.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {log.actor.email} ({log.actor.role})
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="p-3 text-foreground font-medium max-w-xs truncate" title={log.resource}>
                      {log.resource}
                    </td>
                    <td className="p-3 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Badge variant="growth" className="text-[9px] uppercase font-mono">
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
