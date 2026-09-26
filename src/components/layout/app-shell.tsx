"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileDrawer } from "./mobile-drawer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { ErrorBoundary } from "@/components/feedback/error-boundary";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Desktop Sticky/Collapsible Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navigation */}
        <Header onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav onOpenDrawer={() => setMobileDrawerOpen(true)} />
      </div>
    </div>
  );
}
