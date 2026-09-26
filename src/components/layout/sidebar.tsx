"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  AlertTriangle,
  Target,
  Compass,
  Sparkles,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { cn } from "@/lib/utils";
import { STORAGE_KEYS } from "@/constants/storage-keys";

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

export interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Restore collapsed preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      if (saved === "true") {
        setCollapsed(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
    } catch {
      // Ignore
    }
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card/60 backdrop-blur-md transition-all duration-300 relative select-none",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Brand & collapse trigger */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/80">
        <Link href="/dashboard" className="flex items-center overflow-hidden">
          <Logo size="sm" showText={!collapsed} />
        </Link>

        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 bg-background/60 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Workspace Switcher */}
      <div className="p-3 border-b border-border/60">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {siteConfig.navGroups.map((group, groupIdx) => (
          <div key={group.title ?? `group-${groupIdx}`} className="space-y-1">
            {group.title && !collapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const isAi = item.highlight;

                const linkElement = (
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
                      isAi && !isActive && "text-intelligence hover:bg-intelligence/10",
                      collapsed && "justify-center px-0 py-2.5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                        isActive
                          ? "text-primary-foreground"
                          : isAi
                          ? "text-intelligence"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />

                    {!collapsed && (
                      <>
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
                          <span
                            className={cn(
                              "ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded font-mono",
                              isActive
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-intelligence/20 text-intelligence"
                            )}
                          >
                            AI
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={10}>
                        <div className="flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="risk" className="text-[9px] py-0 px-1">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <React.Fragment key={item.href}>{linkElement}</React.Fragment>;
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer system status */}
      <div className="border-t border-border/80 p-3">
        {!collapsed ? (
          <div className="rounded-xl border border-border/80 bg-background/50 p-2.5 text-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1 text-[11px]">
              <span>API Gateway</span>
              <span className="font-semibold text-growth font-mono">14ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-growth animate-pulse" />
              <span className="text-[10px] text-muted-foreground">Double-entry verified</span>
            </div>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center p-2 rounded-lg bg-background/50 border border-border/80">
                <span className="h-2 w-2 rounded-full bg-growth animate-pulse" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>All Systems Operational • 14ms Latency</span>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}
