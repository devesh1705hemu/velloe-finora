"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Shield,
  Key,
  LogOut,
  ChevronDown,
  Building2,
  RefreshCw,
} from "lucide-react";
import { useTenant } from "@/features/tenant";
import { useLogout } from "@/features/auth/hooks";
import { tokenStorage } from "@/services/token-storage";
import { Badge } from "@/components/ui/badge";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentWorkspace, currentRole, switchWorkspace, workspaces } = useTenant();
  const logoutMutation = useLogout();
  const isDemo = tokenStorage.isDemo();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const altWorkspace = workspaces.find((w) => w.id !== currentWorkspace.id);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={isOpen}
        aria-label="User navigation menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-sm">
          DA
        </div>
        <div className="hidden md:flex flex-col text-left text-xs">
          <span className="font-semibold text-foreground leading-none">Devesh Arya</span>
          <span className="text-[10px] text-muted-foreground mt-0.5 capitalize">
            {currentRole.replace("_", " ")}
          </span>
        </div>
        <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-popover p-1.5 shadow-2xl text-popover-foreground backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
          {/* User Profile summary */}
          <div className="p-3 border-b border-border/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-foreground">Devesh Arya</span>
              <Badge variant="growth" className="text-[9px] py-0 px-1 font-mono uppercase">
                {currentRole.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">devesh@finora.internal</p>

            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/40 p-1.5 rounded-lg border border-border/60">
              <Building2 className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate">{currentWorkspace.name}</span>
            </div>

            {isDemo && (
              <div className="mt-1.5 text-[10px] text-amber-500 font-medium">
                • Isolated Guest Demo Active
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="py-1 space-y-0.5 text-xs">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Workspace Settings</span>
            </Link>

            <Link
              href="/settings/security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Security & MFA</span>
            </Link>

            <Link
              href="/settings?tab=api"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Key className="h-4 w-4" />
              <span>API Gateway Tokens</span>
            </Link>

            {altWorkspace && (
              <button
                type="button"
                onClick={() => {
                  switchWorkspace(altWorkspace.id);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-primary hover:bg-accent transition-colors text-left"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="truncate">Switch to {altWorkspace.name}</span>
              </button>
            )}
          </div>

          {/* Sign Out */}
          <div className="border-t border-border/80 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logoutMutation.mutate();
              }}
              disabled={logoutMutation.isPending}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-risk hover:bg-risk/10 transition-colors text-left font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
