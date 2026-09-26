import { ApiResponse } from "@/types/api";
import {
  ActiveSession,
  AuditEvent,
  ConnectedAccount,
  ConsentRecord,
  DataExportRequest,
  EnterpriseMember,
  MFASetup,
  PrivacyPreferences,
  SecurityEvent,
} from "../types";
import {
  ChangePasswordInput,
  InviteUserInput,
  PrivacyPreferencesInput,
} from "../schemas";
import { Role } from "@/features/tenant/types";

const SESSIONS_STORAGE_KEY = "velloe_finora_sessions_v1";
const AUDIT_STORAGE_KEY = "velloe_finora_audit_v1";
const PRIVACY_STORAGE_KEY = "velloe_finora_privacy_v1";
const MEMBERS_STORAGE_KEY = "velloe_finora_members_v1";

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: "sess-curr",
    device: "MacBook Pro 16-inch",
    browser: "Chrome 128.0",
    os: "macOS Sonoma",
    ipAddress: "198.51.100.42",
    location: "San Francisco, CA, US",
    lastActive: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: "sess-2",
    device: "iPhone 15 Pro",
    browser: "Finora Mobile PWA",
    os: "iOS 18.0",
    ipAddress: "198.51.100.89",
    location: "San Francisco, CA, US",
    lastActive: "2026-09-25T21:14:00Z",
    isCurrent: false,
  },
  {
    id: "sess-3",
    device: "Dell Precision Workstation",
    browser: "Firefox Enterprise",
    os: "Windows 11 Enterprise",
    ipAddress: "192.0.2.14",
    location: "New York, NY, US",
    lastActive: "2026-09-24T16:30:00Z",
    isCurrent: false,
  },
];

const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: "sec-1",
    eventType: "MFA Verification",
    description: "Hardware token (TOTP) successfully challenged for session authorization.",
    ipAddress: "198.51.100.42",
    location: "San Francisco, CA, US",
    timestamp: "2026-09-26T07:45:00Z",
    status: "success",
  },
  {
    id: "sec-2",
    eventType: "Password Authentication",
    description: "Account credentials validated via Argon2id hashing.",
    ipAddress: "198.51.100.42",
    location: "San Francisco, CA, US",
    timestamp: "2026-09-26T07:44:00Z",
    status: "success",
  },
  {
    id: "sec-3",
    eventType: "New Device Enrolled",
    description: "MacBook Pro 16-inch registered with workspace fingerprint.",
    ipAddress: "198.51.100.42",
    location: "San Francisco, CA, US",
    timestamp: "2026-09-25T11:20:00Z",
    status: "success",
  },
  {
    id: "sec-4",
    eventType: "API Credential Rotation",
    description: "Automated rotation of production treasury read token.",
    ipAddress: "10.0.4.12",
    location: "Internal VPC (us-east-1)",
    timestamp: "2026-09-23T04:00:00Z",
    status: "success",
  },
];

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: "aud-1",
    timestamp: "2026-09-26T07:30:00Z",
    actor: { id: "u-1", name: "Alex Morgan", email: "alex.morgan@finora.internal", role: "owner" },
    action: "security_setting_changed",
    actionLabel: "Security setting changed",
    resource: "Enforced mandatory TOTP MFA for all workspace managers",
    ipAddress: "198.51.100.42",
    status: "success",
  },
  {
    id: "aud-2",
    timestamp: "2026-09-25T18:15:00Z",
    actor: { id: "u-2", name: "David Kim", email: "david.kim@finora.internal", role: "admin" },
    action: "role_changed",
    actionLabel: "Role changed",
    resource: "Marcus Vance: member -> manager",
    ipAddress: "198.51.100.18",
    status: "success",
  },
  {
    id: "aud-3",
    timestamp: "2026-09-25T14:00:00Z",
    actor: { id: "u-1", name: "Alex Morgan", email: "alex.morgan@finora.internal", role: "owner" },
    action: "report_exported",
    actionLabel: "Report exported",
    resource: "Q3 Consolidated Financial Intelligence Audit (PDF)",
    ipAddress: "198.51.100.42",
    status: "success",
  },
  {
    id: "aud-4",
    timestamp: "2026-09-24T09:40:00Z",
    actor: { id: "u-3", name: "Elena Rostova", email: "elena.rostova@finora.internal", role: "financial_analyst" },
    action: "transaction_imported",
    actionLabel: "Transaction imported",
    resource: "JPMorgan Chase Treasury Ledger CSV (142 line items reconciled)",
    ipAddress: "198.51.100.67",
    status: "success",
  },
  {
    id: "aud-5",
    timestamp: "2026-09-23T16:20:00Z",
    actor: { id: "u-2", name: "David Kim", email: "david.kim@finora.internal", role: "admin" },
    action: "user_added",
    actionLabel: "User added",
    resource: "Elena Rostova (financial_analyst) invited to workspace",
    ipAddress: "198.51.100.18",
    status: "success",
  },
];

const INITIAL_MEMBERS: EnterpriseMember[] = [
  {
    id: "m-1",
    name: "Alex Morgan",
    email: "alex.morgan@finora.internal",
    role: "owner",
    status: "active",
    joinedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "m-2",
    name: "David Kim",
    email: "david.kim@finora.internal",
    role: "admin",
    status: "active",
    joinedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "m-3",
    name: "Marcus Vance",
    email: "marcus.vance@finora.internal",
    role: "manager",
    status: "active",
    joinedAt: "2025-06-15T14:30:00Z",
  },
  {
    id: "m-4",
    name: "Elena Rostova",
    email: "elena.rostova@finora.internal",
    role: "financial_analyst",
    status: "active",
    joinedAt: "2026-09-23T16:20:00Z",
  },
  {
    id: "m-5",
    name: "Jordan Lee",
    email: "jordan.lee@finora.internal",
    role: "viewer",
    status: "active",
    joinedAt: "2026-07-10T09:00:00Z",
  },
];

const INITIAL_CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  {
    id: "conn-1",
    institutionName: "JPMorgan Chase Commercial",
    accountType: "Treasury Checking",
    mask: "•••• 8921",
    status: "connected",
    lastSyncedAt: new Date().toISOString(),
    provider: "Plaid",
  },
  {
    id: "conn-2",
    institutionName: "Silicon Valley Bank (First Citizens)",
    accountType: "Reserve Money Market",
    mask: "•••• 4410",
    status: "connected",
    lastSyncedAt: new Date().toISOString(),
    provider: "MX",
  },
  {
    id: "conn-3",
    institutionName: "Brex Corporate Conduits",
    accountType: "Corporate Credit Cards",
    mask: "•••• 1029",
    status: "connected",
    lastSyncedAt: new Date().toISOString(),
    provider: "Stripe Financial",
  },
];

const INITIAL_CONSENT_RECORDS: ConsentRecord[] = [
  {
    id: "cs-1",
    consentType: "Enterprise Data Processing Agreement (DPA)",
    description: "Standard contractual clauses for enterprise double-entry ledger processing.",
    granted: true,
    timestamp: "2024-01-15T08:05:00Z",
    version: "v3.2",
  },
  {
    id: "cs-2",
    consentType: "CCPA / CPRA Consumer Rights",
    description: "Explicit privacy policy consent ensuring zero sale of corporate financial data.",
    granted: true,
    timestamp: "2024-01-15T08:05:00Z",
    version: "v2.0",
  },
  {
    id: "cs-3",
    consentType: "GDPR Storage & Retention",
    description: "Encrypted data residency in US-East with EU-US Data Privacy Framework adherence.",
    granted: true,
    timestamp: "2024-01-15T08:05:00Z",
    version: "v1.4",
  },
];

export class SettingsService {
  // --- Sessions ---
  async getActiveSessions(): Promise<ApiResponse<ActiveSession[]>> {
    await new Promise((r) => setTimeout(r, 60));
    const raw = typeof window !== "undefined" ? localStorage.getItem(SESSIONS_STORAGE_KEY) : null;
    const data = raw ? JSON.parse(raw) : INITIAL_SESSIONS;
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  async revokeSession(id: string): Promise<ApiResponse<void>> {
    await new Promise((r) => setTimeout(r, 80));
    const res = await this.getActiveSessions();
    const filtered = res.data.filter((s) => s.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
    }
    await this.logAuditEvent({
      action: "session_revoked",
      actionLabel: "Security setting changed",
      resource: `Revoked session: ${id}`,
    });
    return {
      success: true,
      data: undefined as unknown as void,
      timestamp: new Date().toISOString(),
      message: "Session terminated successfully",
    };
  }

  async logoutAllSessions(): Promise<ApiResponse<void>> {
    await new Promise((r) => setTimeout(r, 100));
    const current = INITIAL_SESSIONS.filter((s) => s.isCurrent);
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(current));
    }
    await this.logAuditEvent({
      action: "security_setting_changed",
      actionLabel: "Security setting changed",
      resource: "Logged out all concurrent active sessions",
    });
    return {
      success: true,
      data: undefined as unknown as void,
      timestamp: new Date().toISOString(),
      message: "All other sessions have been terminated",
    };
  }

  // --- Security Events & MFA ---
  async getSecurityEvents(): Promise<ApiResponse<SecurityEvent[]>> {
    await new Promise((r) => setTimeout(r, 50));
    return {
      success: true,
      data: INITIAL_SECURITY_EVENTS,
      timestamp: new Date().toISOString(),
    };
  }

  async changePassword(_input: ChangePasswordInput): Promise<ApiResponse<void>> {
    await new Promise((r) => setTimeout(r, 120));
    await this.logAuditEvent({
      action: "security_setting_changed",
      actionLabel: "Security setting changed",
      resource: "User account password updated",
    });
    return {
      success: true,
      data: undefined as unknown as void,
      timestamp: new Date().toISOString(),
      message: "Password updated successfully",
    };
  }

  async getMFASettings(): Promise<ApiResponse<MFASetup>> {
    await new Promise((r) => setTimeout(r, 50));
    return {
      success: true,
      data: {
        isEnabled: true,
        secret: "KNCW-X892-VM44-9012",
        backupCodes: [
          "9821-4401",
          "5512-8890",
          "3301-7729",
          "6614-2209",
          "1198-3382",
        ],
        verifiedAt: "2026-09-01T10:00:00Z",
      },
      timestamp: new Date().toISOString(),
    };
  }

  // --- Privacy & Data Export ---
  async getPrivacyPreferences(): Promise<ApiResponse<PrivacyPreferences>> {
    await new Promise((r) => setTimeout(r, 50));
    const raw = typeof window !== "undefined" ? localStorage.getItem(PRIVACY_STORAGE_KEY) : null;
    const defaults: PrivacyPreferences = {
      analyticsTracking: false,
      aiModelTraining: false, // Finora guarantees zero training on customer financial data
      thirdPartyDataSharing: false,
      marketingCommunications: false,
      transactionEnrichment: true,
    };
    return {
      success: true,
      data: raw ? JSON.parse(raw) : defaults,
      timestamp: new Date().toISOString(),
    };
  }

  async updatePrivacyPreferences(prefs: PrivacyPreferencesInput): Promise<ApiResponse<PrivacyPreferences>> {
    await new Promise((r) => setTimeout(r, 80));
    if (typeof window !== "undefined") {
      localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(prefs));
    }
    await this.logAuditEvent({
      action: "security_setting_changed",
      actionLabel: "Security setting changed",
      resource: "Updated enterprise privacy preferences",
    });
    return {
      success: true,
      data: prefs as PrivacyPreferences,
      timestamp: new Date().toISOString(),
      message: "Privacy preferences updated",
    };
  }

  async requestDataExport(format: "json" | "csv" | "archive"): Promise<ApiResponse<DataExportRequest>> {
    await new Promise((r) => setTimeout(r, 100));
    const request: DataExportRequest = {
      id: `exp-${Date.now()}`,
      status: "completed",
      format,
      requestedAt: new Date().toISOString(),
      downloadUrl: "#",
      fileSizeBytes: 4280000, // 4.28 MB
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    await this.logAuditEvent({
      action: "report_exported",
      actionLabel: "Report exported",
      resource: `Complete financial archive compliance export (${format.toUpperCase()})`,
    });
    return {
      success: true,
      data: request,
      timestamp: new Date().toISOString(),
      message: "Export archive compiled successfully",
    };
  }

  async getConnectedAccounts(): Promise<ApiResponse<ConnectedAccount[]>> {
    await new Promise((r) => setTimeout(r, 60));
    return {
      success: true,
      data: INITIAL_CONNECTED_ACCOUNTS,
      timestamp: new Date().toISOString(),
    };
  }

  async getConsentRecords(): Promise<ApiResponse<ConsentRecord[]>> {
    await new Promise((r) => setTimeout(r, 50));
    return {
      success: true,
      data: INITIAL_CONSENT_RECORDS,
      timestamp: new Date().toISOString(),
    };
  }

  // --- Enterprise Team & RBAC ---
  async getMembers(): Promise<ApiResponse<EnterpriseMember[]>> {
    await new Promise((r) => setTimeout(r, 60));
    const raw = typeof window !== "undefined" ? localStorage.getItem(MEMBERS_STORAGE_KEY) : null;
    const data = raw ? JSON.parse(raw) : INITIAL_MEMBERS;
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  async inviteMember(input: InviteUserInput): Promise<ApiResponse<EnterpriseMember>> {
    await new Promise((r) => setTimeout(r, 100));
    const res = await this.getMembers();
    const newMember: EnterpriseMember = {
      id: `m-${Date.now()}`,
      name: input.name,
      email: input.email,
      role: input.role as Role,
      status: "invited",
      joinedAt: new Date().toISOString(),
    };
    const updated = [...res.data, newMember];
    if (typeof window !== "undefined") {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(updated));
    }
    await this.logAuditEvent({
      action: "user_added",
      actionLabel: "User added",
      resource: `${input.name} (${input.role}) invited to workspace`,
    });
    return {
      success: true,
      data: newMember,
      timestamp: new Date().toISOString(),
      message: "Invitation sent successfully",
    };
  }

  async updateMemberRole(id: string, newRole: Role): Promise<ApiResponse<EnterpriseMember>> {
    await new Promise((r) => setTimeout(r, 90));
    const res = await this.getMembers();
    const index = res.data.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Member not found");

    const current = res.data[index]!;
    const updated: EnterpriseMember = { ...current, role: newRole };
    res.data[index] = updated;

    if (typeof window !== "undefined") {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(res.data));
    }
    await this.logAuditEvent({
      action: "role_changed",
      actionLabel: "Role changed",
      resource: `${current.name}: ${current.role} -> ${newRole}`,
    });
    return {
      success: true,
      data: updated,
      timestamp: new Date().toISOString(),
      message: "Role updated successfully",
    };
  }

  async removeMember(id: string): Promise<ApiResponse<void>> {
    await new Promise((r) => setTimeout(r, 80));
    const res = await this.getMembers();
    const member = res.data.find((m) => m.id === id);
    const filtered = res.data.filter((m) => m.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(filtered));
    }
    if (member) {
      await this.logAuditEvent({
        action: "security_setting_changed",
        actionLabel: "Security setting changed",
        resource: `Removed user: ${member.name} (${member.email})`,
      });
    }
    return {
      success: true,
      data: undefined as unknown as void,
      timestamp: new Date().toISOString(),
      message: "Member removed from workspace",
    };
  }

  // --- Audit Logging Interface ---
  async getAuditLogs(filterAction?: string): Promise<ApiResponse<AuditEvent[]>> {
    await new Promise((r) => setTimeout(r, 70));
    const raw = typeof window !== "undefined" ? localStorage.getItem(AUDIT_STORAGE_KEY) : null;
    let list: AuditEvent[] = raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;

    if (filterAction && filterAction !== "all") {
      list = list.filter((e) => e.action === filterAction);
    }

    return {
      success: true,
      data: list,
      timestamp: new Date().toISOString(),
    };
  }

  private async logAuditEvent(event: {
    action: AuditEvent["action"];
    actionLabel: string;
    resource: string;
  }) {
    const raw = typeof window !== "undefined" ? localStorage.getItem(AUDIT_STORAGE_KEY) : null;
    const list: AuditEvent[] = raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;

    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: {
        id: "u-curr",
        name: "Alex Morgan",
        email: "alex.morgan@finora.internal",
        role: "owner",
      },
      action: event.action,
      actionLabel: event.actionLabel,
      resource: event.resource,
      ipAddress: "198.51.100.42",
      status: "success",
    };

    const updated = [newLog, ...list];
    if (typeof window !== "undefined") {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    }
  }
}

export const settingsService = new SettingsService();
