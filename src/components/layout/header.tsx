"use client";

import { Menu, Activity } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { GlobalSearch } from "./global-search";
import { NotificationCenter } from "./notification-center";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";
import { useTenant } from "@/features/tenant";
import { Badge } from "@/components/ui/badge";

export interface HeaderProps {
  onOpenMobileDrawer?: () => void;
}

export function Header({ onOpenMobileDrawer }: HeaderProps) {
  const { currentWorkspace, currentRole } = useTenant();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Mobile drawer toggle or Desktop Breadcrumbs & Sync indicator */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile current workspace badge */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-hidden">
          <span className="truncate text-xs font-bold text-foreground max-w-[120px] sm:max-w-[180px]">
            {currentWorkspace.name}
          </span>
          <Badge variant="outline" className="text-[9px] font-mono uppercase px-1 py-0 shrink-0">
            {currentRole.replace("_", " ")}
          </Badge>
        </div>

        {/* Desktop dynamic breadcrumbs */}
        <div className="hidden lg:flex items-center gap-4">
          <Breadcrumbs />

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-growth shrink-0" />
            <span className="font-medium text-foreground">Ledger Sync:</span>
            <span className="font-mono text-growth font-semibold">Active</span>
          </div>
        </div>
      </div>

      {/* Right side: Global Search, Notifications, Theme switcher, User menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search command palette trigger */}
        <GlobalSearch />

        {/* Notification center */}
        <NotificationCenter />

        {/* Theme switcher */}
        <ThemeToggle />

        {/* User profile dropdown menu */}
        <UserMenu />
      </div>
    </header>
  );
}
