import { ID, ISODateString } from "@/types/common";

export type UserRole = "super_admin" | "org_admin" | "financial_analyst" | "auditor" | "viewer";

export interface User {
  id: ID;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  mfaEnabled: boolean;
  isDemo?: boolean;
  createdAt: ISODateString;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: ISODateString;
  isDemo?: boolean;
}

export interface LoginResponse {
  session?: AuthSession;
  requiresMfa?: boolean;
  mfaTicket?: string;
}

export type OAuthProvider = "google" | "github" | "microsoft";

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ipRedacted: string;
  location: string;
  lastActiveAt: ISODateString;
  isCurrent: boolean;
  isSuspicious: boolean;
}

export interface SecurityEvent {
  id: string;
  type: "login_success" | "login_failed" | "password_changed" | "mfa_enabled" | "suspicious_attempt";
  description: string;
  timestamp: ISODateString;
  ipRedacted: string;
}
