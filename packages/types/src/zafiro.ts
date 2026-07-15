export type ZafiroSystemStatus =
  | "BOOTING" | "ACTIVE" | "OFFLINE" | "SYNCING"
  | "DEGRADED" | "PROTECTED" | "ERROR" | "MAINTENANCE";

export type NetworkStatus = "ONLINE" | "OFFLINE" | "LIMITED";
export type UserRole = "OWNER" | "CASHIER" | "VIEWER";

export interface ZafiroUser {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  role: UserRole;
  permissions: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ZafiroCoreState {
  systemId: string;
  version: string;
  status: ZafiroSystemStatus;
  activeUserId?: string;
  batteryLevel?: number;
  networkStatus: NetworkStatus;
  pendingOperations: number;
  lastSyncAt?: string;
  modules: ZafiroModuleState[];
  guardians: GuardianState[];
}

export interface ZafiroModuleState {
  id: string;
  name: string;
  version: string;
  status: "ACTIVE" | "INACTIVE" | "DEGRADED" | "ERROR";
  permissions: string[];
  lastHeartbeatAt?: string;
}

export interface GuardianAlert {
  id: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  createdAt: string;
  resolved: boolean;
}

export interface GuardianState {
  id:
    | "communications" | "infrastructure" | "mobility"
    | "home" | "multimedia" | "security" | "family";
  name: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "OFFLINE";
  healthScore: number;
  alerts: GuardianAlert[];
  lastUpdatedAt: string;
}
