"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  AlertTriangle,
  Target,
  Compass,
  Sparkles,
  FileSpreadsheet,
  Settings,
  Shield,
  LogOut,
  LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { ThemeToggle } from "./theme-toggle";
import { useTenant } from "@/features/tenant";
import { useLogout } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  AlertTriangle,
  Target,
  Compass,
  Sparkles,
  FileSpreadsheet,
  Settings,
};

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { currentRole } = useTenant();
  const logoutMutation = useLogout();

  // Close drawer on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] border-r border-border bg-card p-0 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border/80">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close navigation drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="p-4 border-b border-border/60">
          <WorkspaceSwitcher />
        </div>

        {/* Categorized Nav items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {siteConfig.navGroups.map((group, groupIdx) => (
            <div key={group.title ?? `mobile-group-${groupIdx}`} className="space-y-1">
              {group.title && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </div>
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  const isAi = item.highlight;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
                        isAi && !isActive && "text-intelligence"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "risk"}
                          className="ml-auto text-[10px] py-0 px-1.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {isAi && (
                        <span className="ml-auto text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-intelligence/20 text-intelligence">
                          AI
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Account & Actions Footer */}
        <div className="border-t border-border/80 p-4 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                DA
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-foreground leading-none">Devesh Arya</span>
                <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
                  {currentRole.replace("_", " ")}
                </span>
              </div>
            </div>

            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-border/40">
            <Link
              href="/settings/security"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Security</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                onClose();
                logoutMutation.mutate();
              }}
              disabled={logoutMutation.isPending}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-risk/30 bg-risk/5 py-1.5 text-xs text-risk hover:bg-risk/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
