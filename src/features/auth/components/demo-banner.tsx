"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tokenStorage } from "@/services/token-storage";
import { useLogout } from "../hooks";

export function DemoBanner() {
  const isDemo = tokenStorage.isDemo();
  const logoutMutation = useLogout();

  if (!isDemo) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Badge variant="warning" className="uppercase font-bold tracking-wider text-[10px]">
          Demo Environment
        </Badge>
        <span className="text-foreground hidden sm:inline font-medium">
          You are exploring Velloe-Finora in an isolated guest sandbox with synthetic financial data.
        </span>
        <span className="text-muted-foreground hidden md:inline">
          (Zero access to external tenant records)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs border-amber-500/30 hover:bg-amber-500/20"
          onClick={() => logoutMutation.mutate()}
          isLoading={logoutMutation.isPending}
        >
          <LogOut className="mr-1 h-3 w-3" /> Exit Demo
        </Button>
      </div>
    </div>
  );
}
