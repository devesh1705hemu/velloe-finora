"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  insights: "Insights",
  leakage: "Leakage Engine",
  goals: "Goals",
  future: "Future Simulator",
  ai: "Finora AI",
  reports: "Reports",
  settings: "Settings",
  security: "Security & MFA",
  workspace: "Workspace",
  billing: "Billing & Plans",
  unauthorized: "Unauthorized",
  forbidden: "Forbidden",
};

export interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // If on landing or root
  if (!pathname || pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1.5 text-xs text-muted-foreground", className)}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors p-1 rounded hover:bg-accent"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label =
          SEGMENT_LABELS[segment.toLowerCase()] ??
          segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[140px] sm:max-w-none">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors truncate max-w-[100px] sm:max-w-none"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
