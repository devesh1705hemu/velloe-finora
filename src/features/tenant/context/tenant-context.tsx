"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Workspace,
  Organization,
  Role,
  PermissionsMap,
  TenantContextValue,
  WorkspaceType,
} from "../types";
import {
  ROLE_PERMISSIONS,
  INITIAL_ORGANIZATIONS,
  INITIAL_WORKSPACES,
} from "../constants/permissions";
import { STORAGE_KEYS } from "@/constants/storage-keys";

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [organizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(
    INITIAL_WORKSPACES[0]?.id ?? "ws-personal-01"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore saved workspace preference on mount
  useEffect(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID);
      if (savedId && workspaces.some((w) => w.id === savedId)) {
        setActiveWorkspaceId(savedId);
      }
    } catch {
      // LocalStorage access restricted in private browsing, keep default
    } finally {
      setIsLoading(false);
    }
  }, [workspaces]);

  const currentWorkspace = useMemo(() => {
    return (
      workspaces.find((w) => w.id === activeWorkspaceId) ??
      workspaces[0] ?? {
        id: "ws-personal-01",
        name: "Personal Wealth",
        slug: "personal",
        type: "personal" as WorkspaceType,
        role: "owner" as Role,
        currency: "USD",
        metrics: {
          totalBalance: 0,
          monthlyBurn: 0,
          runwayMonths: 0,
          teamMembersCount: 1,
          activeCurrencies: ["USD"],
        },
      }
    );
  }, [workspaces, activeWorkspaceId]);

  const currentRole: Role = currentWorkspace.role;
  const permissions: PermissionsMap = useMemo(() => {
    return ROLE_PERMISSIONS[currentRole] ?? ROLE_PERMISSIONS.viewer;
  }, [currentRole]);

  const switchWorkspace = (workspaceId: string) => {
    const exists = workspaces.some((w) => w.id === workspaceId);
    if (exists) {
      setActiveWorkspaceId(workspaceId);
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID, workspaceId);
      } catch {
        // Ignore storage errors
      }
    }
  };

  const createWorkspace = (data: { name: string; type: WorkspaceType; orgId?: string }) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      orgId: data.orgId,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      type: data.type,
      role: "owner",
      currency: "USD",
      metrics: {
        totalBalance: 0,
        monthlyBurn: 0,
        runwayMonths: 0,
        teamMembersCount: 1,
        activeCurrencies: ["USD"],
      },
    };
    setWorkspaces((prev) => [...prev, newWs]);
    switchWorkspace(newWs.id);
  };

  const value = useMemo<TenantContextValue>(
    () => ({
      currentWorkspace,
      workspaces,
      organizations,
      currentRole,
      permissions,
      switchWorkspace,
      createWorkspace,
      isLoading,
    }),
    [currentWorkspace, workspaces, organizations, currentRole, permissions, isLoading]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
