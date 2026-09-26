import { ID, ISODateString } from "@/types/common";
import { Role } from "@/features/tenant/types";

export interface UserProfile {
  id: ID;
  email: string;
  fullName: string;
  title?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ActiveSession {
  id: ID;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: ISODateString;
  isCurrent: boolean;
}

export interface SecurityEvent {
  id: ID;
  eventType: string;
  description: string;
  ipAddress: string;
  location: string;
  timestamp: ISODateString;
  status: "success" | "warning" | "failure";
}

export interface MFASetup {
  isEnabled: boolean;
  secret: string;
  backupCodes: string[];
  verifiedAt?: ISODateString;
}

export interface PrivacyPreferences {
  analyticsTracking: boolean;
  aiModelTraining: boolean; // Always false by default in Finora
  thirdPartyDataSharing: boolean;
  marketingCommunications: boolean;
  transactionEnrichment: boolean;
}

export interface DataExportRequest {
  id: ID;
  status: "completed" | "processing" | "pending";
  format: "json" | "csv" | "archive";
  requestedAt: ISODateString;
  downloadUrl?: string;
  fileSizeBytes?: number;
  expiresAt?: ISODateString;
}

export interface ConnectedAccount {
  id: ID;
  institutionName: string;
  accountType: string;
  mask: string;
  status: "connected" | "syncing" | "error" | "disconnected";
  lastSyncedAt: ISODateString;
  provider: "Plaid" | "MX" | "Stripe Financial";
}

export interface ConsentRecord {
  id: ID;
  consentType: string;
  description: string;
  granted: boolean;
  timestamp: ISODateString;
  version: string;
}

export interface EnterpriseMember {
  id: ID;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited" | "suspended";
  joinedAt: ISODateString;
  avatarUrl?: string;
}

export type AuditActionType =
  | "user_added"
  | "role_changed"
  | "report_exported"
  | "transaction_imported"
  | "security_setting_changed"
  | "session_revoked"
  | "data_export_requested";

export interface AuditEvent {
  id: ID;
  timestamp: ISODateString;
  actor: {
    id: ID;
    name: string;
    email: string;
    role: Role;
  };
  action: AuditActionType;
  actionLabel: string;
  resource: string;
  ipAddress: string;
  status: "success" | "failure";
  details?: Record<string, unknown>;
}
