"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronsUpDown,
  Building2,
  User,
  Check,
  Plus,
  Layers,
} from "lucide-react";
import { useTenant } from "@/features/tenant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

export function WorkspaceSwitcher({ collapsed = false }: WorkspaceSwitcherProps) {
  const { currentWorkspace, workspaces, organizations, switchWorkspace, createWorkspace } =
    useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsType, setNewWsType] = useState<"personal" | "organization">("organization");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const personalWorkspaces = workspaces.filter((w) => w.type === "personal");
  const orgWorkspaces = workspaces.filter((w) => w.type === "organization");

  const isPersonal = currentWorkspace.type === "personal";

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    createWorkspace({
      name: newWsName.trim(),
      type: newWsType,
      orgId: newWsType === "organization" ? organizations[0]?.id : undefined,
    });
    setNewWsName("");
    setShowCreateModal(false);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border border-border/80 bg-background/60 p-2 text-left transition-colors hover:bg-accent/60 focus:outline-none focus:ring-2 focus:ring-primary/20",
          collapsed && "justify-center p-2"
        )}
        aria-expanded={isOpen}
        aria-label="Select active financial workspace"
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-bold text-xs shadow-sm",
            isPersonal
              ? "bg-violet-500/10 text-violet-500 border border-violet-500/20"
              : "bg-primary/10 text-primary border border-primary/20"
          )}
        >
          {isPersonal ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
        </div>

        {!collapsed && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="truncate text-xs font-semibold text-foreground">
                {currentWorkspace.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="capitalize">{currentWorkspace.type}</span>
              <span>•</span>
              <span className="font-mono uppercase text-[9px] text-primary">
                {currentWorkspace.role.replace("_", " ")}
              </span>
            </div>
          </div>
        )}

        {!collapsed && (
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-72 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95",
            collapsed ? "left-full ml-2 top-0" : "left-0"
          )}
        >
          <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
            <span>Financial Workspaces</span>
            <Badge variant="outline" className="text-[9px] font-mono">
              Multi-tenant
            </Badge>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-3 py-1">
            {/* Personal Workspaces */}
            {personalWorkspaces.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
                  <User className="h-3 w-3" /> Personal Vault
                </div>
                <div className="space-y-0.5">
                  {personalWorkspaces.map((ws) => {
                    const isSelected = ws.id === currentWorkspace.id;
                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => {
                          switchWorkspace(ws.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-accent text-left",
                          isSelected && "bg-accent/80 font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-violet-500/10 text-violet-500 text-[10px]">
                            P
                          </div>
                          <span className="truncate">{ws.name}</span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Organization Workspaces */}
            {orgWorkspaces.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Organizations & Entities
                </div>
                <div className="space-y-0.5">
                  {orgWorkspaces.map((ws) => {
                    const isSelected = ws.id === currentWorkspace.id;
                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => {
                          switchWorkspace(ws.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-accent text-left",
                          isSelected && "bg-accent/80 font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary text-[10px]">
                            O
                          </div>
                          <div className="truncate">
                            <div className="truncate">{ws.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              Role: {ws.role.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 border-t border-border pt-1.5">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Simple Inline Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-2xl text-card-foreground">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-primary" /> Create Financial Workspace
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Create an isolated ledger boundary for a team, entity, or fund.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Series A Runway"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Workspace Type
                </label>
                <select
                  value={newWsType}
                  onChange={(e) => setNewWsType(e.target.value as "personal" | "organization")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="organization">Organization Workspace</option>
                  <option value="personal">Personal Vault Workspace</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Create Workspace
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
