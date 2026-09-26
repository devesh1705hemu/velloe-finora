"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  CheckCheck,
  TrendingUp,
  RefreshCw,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "leakage" | "sync" | "ai" | "goal";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    title: "Preventable Software Leakage Detected",
    message: "4 inactive seats on Datadog APM flagged. Potential savings: $380/mo.",
    category: "leakage",
    timestamp: "12m ago",
    isRead: false,
    actionUrl: "/leakage",
    actionLabel: "Inspect Leakage",
  },
  {
    id: "notif-02",
    title: "Mercury Operating Sync Reconciled",
    message: "18 transactions synchronized via read-only Plaid conduit with zero ledger drift.",
    category: "sync",
    timestamp: "35m ago",
    isRead: false,
    actionUrl: "/transactions",
    actionLabel: "View Ledger",
  },
  {
    id: "notif-03",
    title: "Finora AI Scenario Ready",
    message: "Q4 Capex stress test completed: cash runway remains healthy at 24.8 months.",
    category: "ai",
    timestamp: "2h ago",
    isRead: false,
    actionUrl: "/future",
    actionLabel: "Open Simulation",
  },
  {
    id: "notif-04",
    title: "Goal Milestone Achieved",
    message: "Tax Escrow Reserve target crossed 85% completion threshold.",
    category: "goal",
    timestamp: "1d ago",
    isRead: true,
    actionUrl: "/goals",
    actionLabel: "View Goals",
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "leakage" | "sync" | "ai">("all");
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.category === activeFilter;
  });

  const getCategoryIcon = (category: NotificationItem["category"]) => {
    switch (category) {
      case "leakage":
        return <AlertTriangle className="h-4 w-4 text-risk" />;
      case "sync":
        return <RefreshCw className="h-4 w-4 text-primary" />;
      case "ai":
        return <Sparkles className="h-4 w-4 text-intelligence" />;
      case "goal":
        return <TrendingUp className="h-4 w-4 text-growth" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-risk px-1 text-[9px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-popover p-0 shadow-2xl text-popover-foreground backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="risk" className="text-[10px] py-0 px-1.5 font-bold">
                  {unreadCount} New
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 border-b border-border/60 px-4 py-2 bg-muted/20 text-xs overflow-x-auto">
            {(
              [
                { id: "all", label: "All" },
                { id: "leakage", label: "Leakage" },
                { id: "sync", label: "Sync" },
                { id: "ai", label: "AI Co-pilot" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors shrink-0",
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-border/60">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No notifications in this category.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-3.5 text-xs transition-colors hover:bg-accent/40 relative group",
                    !notif.isRead && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 rounded-lg p-1.5 bg-muted/60">
                      {getCategoryIcon(notif.category)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className={cn("font-medium text-foreground", !notif.isRead && "font-bold")}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        {notif.actionUrl && (
                          <Link
                            href={notif.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                          >
                            <span>{notif.actionLabel ?? "View Details"}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground text-[10px] ml-auto p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/80 p-2 text-center bg-muted/30">
            <Link
              href="/insights"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              View Full Audit Log & Intelligence Feed
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
