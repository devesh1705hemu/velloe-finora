"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Shield,
  Lock,
  Eye,
  Building2,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/features/tenant";
import {
  useActiveSessions,
  useRevokeSession,
  useLogoutAllSessions,
  useSecurityEvents,
  useChangePassword,
  useMFASettings,
  usePrivacyPreferences,
  useUpdatePrivacyPreferences,
  useRequestDataExport,
  useConnectedAccounts,
  useConsentRecords,
  useEnterpriseMembers,
  useInviteMember,
  useUpdateMemberRole,
  useRemoveMember,
  useAuditLogs,
} from "@/features/settings/hooks";
import {
  SecuritySettingsTab,
  PrivacyTab,
  EnterpriseTab,
  AuditTab,
  DeleteAccountDialog,
  InviteMemberDialog,
  MFASetupDialog,
} from "@/features/settings/components";
import { Role } from "@/features/tenant/types";
import { ChangePasswordInput, InviteUserInput } from "@/features/settings/schemas";

export default function SettingsPage() {
  const { currentWorkspace, currentRole, permissions } = useTenant();
  const [activeTab, setActiveTab] = useState<"security" | "privacy" | "enterprise" | "audit">("security");

  // Modal dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMFAOpen, setIsMFAOpen] = useState(false);

  // Queries
  const { data: sessions = [] } = useActiveSessions();
  const { data: securityEvents = [] } = useSecurityEvents();
  const { data: mfa = { isEnabled: true, secret: "KNCW-X892-VM44-9012", backupCodes: [] } } = useMFASettings();
  const {
    data: privacyPrefs = {
      analyticsTracking: false,
      aiModelTraining: false,
      thirdPartyDataSharing: false,
      marketingCommunications: false,
      transactionEnrichment: true,
    },
  } = usePrivacyPreferences();
  const { data: connectedAccounts = [] } = useConnectedAccounts();
  const { data: consentRecords = [] } = useConsentRecords();
  const { data: members = [] } = useEnterpriseMembers();
  const { data: auditLogs = [] } = useAuditLogs();

  // Mutations
  const revokeSessionMutation = useRevokeSession();
  const logoutAllSessionsMutation = useLogoutAllSessions();
  const changePasswordMutation = useChangePassword();
  const updatePrivacyMutation = useUpdatePrivacyPreferences();
  const requestExportMutation = useRequestDataExport();
  const inviteMemberMutation = useInviteMember();
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();

  const handleRevokeSession = async (id: string) => {
    await revokeSessionMutation.mutateAsync(id);
  };

  const handleLogoutAllSessions = async () => {
    await logoutAllSessionsMutation.mutateAsync();
  };

  const handleChangePassword = async (input: ChangePasswordInput) => {
    await changePasswordMutation.mutateAsync(input);
  };

  const handleUpdatePrivacy = async (prefs: typeof privacyPrefs) => {
    await updatePrivacyMutation.mutateAsync(prefs);
  };

  const handleRequestExport = async (format: "json" | "csv" | "archive") => {
    const res = await requestExportMutation.mutateAsync(format);
    return res.data;
  };

  const handleInviteMember = async (input: InviteUserInput) => {
    await inviteMemberMutation.mutateAsync(input);
  };

  const handleUpdateRole = async (id: string, newRole: Role) => {
    await updateRoleMutation.mutateAsync({ id, role: newRole });
  };

  const handleRemoveMember = async (id: string) => {
    await removeMemberMutation.mutateAsync(id);
  };

  const handleDeleteAccountConfirm = async () => {
    alert("Account deletion scheduled. All active tokens and banking conduits revoked.");
  };

  const tabs = [
    { id: "security", label: "Security & Access", icon: Lock },
    { id: "privacy", label: "Privacy & Compliance", icon: Eye },
    { id: "enterprise", label: "Enterprise & Team", icon: Building2 },
    { id: "audit", label: "Audit Activity", icon: FileText },
  ] as const;

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] gap-1 font-mono">
                <Shield className="h-3 w-3 text-primary" /> Enterprise Trust Center
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Organization: <strong>{currentWorkspace.name}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Security & Privacy Center
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Cryptographic session management, privacy compliance, enterprise role governance, and audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="growth" className="text-xs capitalize font-mono px-3 py-1">
              Role: {currentRole.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border/60 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Security */}
        {activeTab === "security" && (
          <SecuritySettingsTab
            sessions={sessions}
            securityEvents={securityEvents}
            mfa={mfa}
            onRevokeSession={handleRevokeSession}
            onLogoutAllSessions={handleLogoutAllSessions}
            onChangePassword={handleChangePassword}
            onOpenDeleteAccount={() => setIsDeleteOpen(true)}
            onOpenMFASetup={() => setIsMFAOpen(true)}
          />
        )}

        {/* Tab 2: Privacy */}
        {activeTab === "privacy" && (
          <PrivacyTab
            preferences={privacyPrefs}
            connectedAccounts={connectedAccounts}
            consentRecords={consentRecords}
            onUpdatePreferences={handleUpdatePrivacy}
            onRequestExport={handleRequestExport}
          />
        )}

        {/* Tab 3: Enterprise & Team */}
        {activeTab === "enterprise" && (
          <EnterpriseTab
            members={members}
            onOpenInvite={() => setIsInviteOpen(true)}
            onUpdateRole={handleUpdateRole}
            onRemoveMember={handleRemoveMember}
          />
        )}

        {/* Tab 4: Audit Activity */}
        {activeTab === "audit" && (
          <AuditTab
            auditLogs={auditLogs}
            isAuthorized={permissions.canViewAuditLogs}
            userRole={currentRole.replace("_", " ")}
          />
        )}

        {/* Modals */}
        <DeleteAccountDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteAccountConfirm}
        />

        <InviteMemberDialog
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onInvite={handleInviteMember}
        />

        <MFASetupDialog
          isOpen={isMFAOpen}
          onClose={() => setIsMFAOpen(false)}
          mfa={mfa}
        />
      </div>
    </AppShell>
  );
}
