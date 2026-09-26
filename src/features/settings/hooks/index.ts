"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../services";
import {
  ChangePasswordInput,
  InviteUserInput,
  PrivacyPreferencesInput,
} from "../schemas";
import { Role } from "@/features/tenant/types";

export const SETTINGS_QUERY_KEYS = {
  sessions: ["settings", "sessions"] as const,
  securityEvents: ["settings", "security-events"] as const,
  mfa: ["settings", "mfa"] as const,
  privacy: ["settings", "privacy"] as const,
  connectedAccounts: ["settings", "connected-accounts"] as const,
  consent: ["settings", "consent"] as const,
  members: ["settings", "members"] as const,
  audit: ["settings", "audit"] as const,
};

export function useActiveSessions() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.sessions,
    queryFn: async () => {
      const res = await settingsService.getActiveSessions();
      return res.data;
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.audit });
    },
  });
}

export function useLogoutAllSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => settingsService.logoutAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.audit });
    },
  });
}

export function useSecurityEvents() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.securityEvents,
    queryFn: async () => {
      const res = await settingsService.getSecurityEvents();
      return res.data;
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => settingsService.changePassword(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.securityEvents });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.audit });
    },
  });
}

export function useMFASettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.mfa,
    queryFn: async () => {
      const res = await settingsService.getMFASettings();
      return res.data;
    },
  });
}

export function usePrivacyPreferences() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.privacy,
    queryFn: async () => {
      const res = await settingsService.getPrivacyPreferences();
      return res.data;
    },
  });
}

export function useUpdatePrivacyPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prefs: PrivacyPreferencesInput) =>
      settingsService.updatePrivacyPreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.privacy });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.audit });
    },
  });
}

export function useRequestDataExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (format: "json" | "csv" | "archive") =>
      settingsService.requestDataExport(format),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.audit });
    },
  });
}

export function useConnectedAccounts() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.connectedAccounts,
    queryFn: async () => {
      const res = await settingsService.getConnectedAccounts();
      return res.data;
    },
  });
}

export function useConsentRecords() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.consent,
    queryFn: async () => {
      const res = await settingsService.getConsentRecords();
      return res.data;
    },
  });
}

export function useEnterpriseMembers() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.members,
    queryFn: async () => {
      const res = await settingsService.getMembers();
      return res.data;
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteUserInput) => settingsService.inviteMember(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.members });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.audit });
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      settingsService.updateMemberRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.members });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.audit });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.members });
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.audit });
    },
  });
}

export function useAuditLogs(filterAction?: string) {
  return useQuery({
    queryKey: [...SETTINGS_QUERY_KEYS.audit, filterAction],
    queryFn: async () => {
      const res = await settingsService.getAuditLogs(filterAction);
      return res.data;
    },
  });
}
