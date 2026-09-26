"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TenantProvider } from "@/features/tenant";

export interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <TenantProvider>
          <TooltipProvider delayDuration={200}>
            {children}
          </TooltipProvider>
        </TenantProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
