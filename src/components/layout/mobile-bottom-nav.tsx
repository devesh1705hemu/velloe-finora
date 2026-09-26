"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Sparkles,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileBottomNavProps {
  onOpenDrawer: () => void;
}

export function MobileBottomNav({ onOpenDrawer }: MobileBottomNavProps) {
  const pathname = usePathname();

  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Ledger",
      href: "/transactions",
      icon: ArrowLeftRight,
    },
    {
      title: "AI Co-pilot",
      href: "/ai",
      icon: Sparkles,
      highlight: true,
    },
    {
      title: "Leakage",
      href: "/leakage",
      icon: AlertTriangle,
      badge: "3",
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border bg-card/95 backdrop-blur-lg px-2 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const isAi = item.highlight;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-1.5 px-1 text-[10px] font-medium transition-colors relative",
                isActive
                  ? "text-primary font-bold"
                  : isAi
                  ? "text-intelligence"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 mb-0.5 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-risk text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="truncate max-w-[64px]">{item.title}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-1 flex-col items-center justify-center py-1.5 px-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open full navigation drawer"
        >
          <Menu className="h-5 w-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
