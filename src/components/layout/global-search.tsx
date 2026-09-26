"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
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
  Download,
  Building2,
  X,
  CornerDownLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/features/tenant";
import { cn } from "@/lib/utils";

interface SearchAction {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "AI Query" | "Settings";
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  handler?: () => void;
  permission?: "canExportData" | "canExecuteAIQueries" | "canManageBilling";
  shortcut?: string;
  badge?: string;
}

export interface GlobalSearchProps {
  triggerClassName?: string;
}

export function GlobalSearch({ triggerClassName }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { hasPermission } = usePermissions();

  const actions: SearchAction[] = [
    {
      id: "nav-dash",
      title: "Dashboard Overview",
      category: "Navigation",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "nav-tx",
      title: "Transactions Ledger",
      category: "Navigation",
      icon: ArrowLeftRight,
      href: "/transactions",
    },
    {
      id: "nav-insights",
      title: "Financial Intelligence Insights",
      category: "Navigation",
      icon: TrendingUp,
      href: "/insights",
    },
    {
      id: "nav-leakage",
      title: "Money Leakage Engine & Drift Audits",
      category: "Navigation",
      icon: AlertTriangle,
      href: "/leakage",
      badge: "3 Alerts",
    },
    {
      id: "nav-goals",
      title: "Goal Planning & Milestone Horizons",
      category: "Navigation",
      icon: Target,
      href: "/goals",
    },
    {
      id: "nav-future",
      title: "Future Simulator & Runway Scenarios",
      category: "Navigation",
      icon: Compass,
      href: "/future",
    },
    {
      id: "nav-ai",
      title: "Finora AI Co-pilot",
      category: "Navigation",
      icon: Sparkles,
      href: "/ai",
      badge: "Autonomous",
    },
    {
      id: "nav-reports",
      title: "Financial Statements & Variance Reports",
      category: "Navigation",
      icon: FileSpreadsheet,
      href: "/reports",
    },
    {
      id: "nav-settings",
      title: "Workspace & Member Settings",
      category: "Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      id: "nav-security",
      title: "Security, MFA & Session Keys",
      category: "Settings",
      icon: Shield,
      href: "/settings/security",
    },
    {
      id: "act-ai-audit",
      title: "Ask Finora AI: Audit SaaS seat renewals",
      category: "AI Query",
      icon: Sparkles,
      href: "/ai?prompt=Audit%20all%20SaaS%20seats%20due%20for%20renewal%20next%20month",
      permission: "canExecuteAIQueries",
    },
    {
      id: "act-ai-burn",
      title: "Ask Finora AI: Calculate runway under -15% MRR shock",
      category: "AI Query",
      icon: Sparkles,
      href: "/future?scenario=revenue-drop",
      permission: "canExecuteAIQueries",
    },
    {
      id: "act-export",
      title: "Export Ledger Transactions (CSV / JSON format)",
      category: "Action",
      icon: Download,
      href: "/transactions?action=export",
      permission: "canExportData",
    },
    {
      id: "act-switch-org",
      title: "Manage Organization Tenant Hierarchy",
      category: "Action",
      icon: Building2,
      href: "/settings?tab=workspaces",
    },
  ];

  // Filter actions based on search query and permissions
  const filteredActions = actions.filter((action) => {
    if (action.permission && !hasPermission(action.permission)) {
      return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      action.title.toLowerCase().includes(q) ||
      action.category.toLowerCase().includes(q)
    );
  });

  // Global keydown listener for ⌘K / Ctrl+K and ESC
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (action: SearchAction) => {
    setIsOpen(false);
    if (action.handler) {
      action.handler();
    } else if (action.href) {
      router.push(action.href);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (filteredActions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredActions[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-9 w-64 justify-between border-border/80 bg-background/60 text-xs text-muted-foreground hover:bg-accent/70 hover:text-foreground",
          triggerClassName
        )}
        aria-label="Search ledger and actions"
      >
        <span className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate">Search commands, ledger...</span>
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      {/* Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 sm:pt-20 backdrop-blur-md animate-in fade-in-0">
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl text-popover-foreground zoom-in-95 duration-150 animate-in"
            role="dialog"
            aria-modal="true"
          >
            {/* Search Input Box */}
            <div className="flex items-center border-b border-border/80 px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command, search transactions, or ask Finora AI..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {filteredActions.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No commands or ledger views matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredActions.map((action, idx) => {
                  const Icon = action.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <div
                      key={action.id}
                      onClick={() => handleSelect(action)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary text-primary-foreground font-medium shadow-sm"
                          : "text-foreground hover:bg-accent/80"
                      )}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs",
                            isSelected
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate">{action.title}</span>
                        {action.badge && (
                          <Badge
                            variant={isSelected ? "secondary" : "growth"}
                            className="text-[10px] py-0 px-1.5"
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            "text-[10px] uppercase font-mono tracking-wider",
                            isSelected ? "text-primary-foreground/80" : "text-muted-foreground/70"
                          )}
                        >
                          {action.category}
                        </span>
                        {isSelected && (
                          <CornerDownLeft className="h-3 w-3 text-primary-foreground/80" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Keyboard hints */}
            <div className="flex items-center justify-between border-t border-border/80 px-4 py-2.5 bg-muted/30 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1 text-[10px]">↑</kbd>
                  <kbd className="rounded border bg-background px-1 text-[10px]">↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1 text-[10px]">↵</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1 text-[10px]">ESC</kbd> Close
                </span>
              </div>
              <span className="text-[10px] font-medium text-primary">Velloe-Finora Global Command</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
