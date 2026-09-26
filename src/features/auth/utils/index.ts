import { User, UserRole } from "../types";

export function hasPermission(user: User | null | undefined, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  return allowedRoles.includes(user.role);
}

export function formatUserInitials(fullName: string): string {
  if (!fullName) return "U";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1 && parts[0]) return parts[0].charAt(0).toUpperCase();
  const first = parts[0]?.charAt(0).toUpperCase() || "";
  const last = parts[parts.length - 1]?.charAt(0).toUpperCase() || "";
  return `${first}${last}`;
}
