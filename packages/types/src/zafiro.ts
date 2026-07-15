export type ZafiroSystemStatus =
  | "BOOTING" | "ACTIVE" | "OFFLINE" | "SYNCING"
  | "DEGRADED" | "PROTECTED" | "ERROR" | "MAINTENANCE"

export type NetworkStatus = "ONLINE" | "OFFLINE" | "LIMITED"
export type UserRole = "OWNER" | "CASHIER" | "VIEWER"

export interface ZafiroUser {
  id: string
  name: string
  email: string
  phone?: string
  passwordHash: string
  displayName?: string
  avatar?: string
  role: UserRole
  permissions: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ZafiroSession {
  email: string
  name: string
  id: string
  role?: UserRole
}

export interface ZafiroCoreState {
  systemId: string
  version: string
  status: ZafiroSystemStatus
  activeUserId?: string
  batteryLevel?: number
  networkStatus: NetworkStatus
  pendingOperations: number
  lastSyncAt?: string
  modules: ZafiroModuleState[]
  guardians: GuardianState[]
}

export interface ZafiroModuleState {
  id: string
  name: string
  version: string
  status: "ACTIVE" | "INACTIVE" | "DEGRADED" | "ERROR"
  permissions: string[]
  lastHeartbeatAt?: string
}

export interface GuardianAlert {
  id: string
  severity: "INFO" | "WARNING" | "CRITICAL"
  message: string
  createdAt: string
  resolved: boolean
}

export interface GuardianState {
  id:
    | "communications" | "infrastructure" | "mobility"
    | "home" | "multimedia" | "security" | "family"
  name: string
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "OFFLINE"
  healthScore: number
  alerts: GuardianAlert[]
  lastUpdatedAt: string
}

export interface UserProject {
  id: string
  name: string
  description: string
  url: string
  status: "activo" | "beta" | "proximamente"
  icon: string
  color: string
  tags: string[]
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  label: string
}

export interface UserProfile {
  userId: string
  name: string
  publicName: string
  username: string
  title: string
  company: string
  location: string
  website: string
  linktree: string
  roles: string[]
  bioShort: string
  bioLong: string
  avatar: string
  coverImage: string
  email: string
  joinedAt: string
  points: number
  streak: number
  level: string
  followers: number
  following: number
  questions: number
  answers: number
  communities: number
  achievements: number
  sponsors: number
  projects: number
  visits: number
  customProjects: UserProject[]
  socialLinks: SocialLink[]
}
