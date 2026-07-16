// ============================================================
// ZAFIRO — Core Type System
// ============================================================

// --- System Status ---
export type ZafiroSystemStatus =
  | "BOOTING" | "ACTIVE" | "OFFLINE" | "SYNCING"
  | "DEGRADED" | "PROTECTED" | "ERROR" | "MAINTENANCE"

export type NetworkStatus = "ONLINE" | "OFFLINE" | "LIMITED"

// --- Legacy Auth Types (kept for backward compat) ---
export type LegacyUserRole = "OWNER" | "CASHIER" | "VIEWER"

// ============================================================
// NEW: Unified Identity System
// ============================================================

// --- Role del sistema (QUIÉN eres en el sistema) ---
export type UserRole =
  | "OWNER_SUPERADMIN"
  | "ADMIN"
  | "COMPLIANCE_REVIEWER"
  | "SUPPORT_AGENT"
  | "ENTREPRENEUR"
  | "USER"

// --- Nivel de membresía (QUÉ beneficios tienes) ---
export type MembershipTier =
  | "STANDARD"
  | "VIP"
  | "ENTREPRENEUR_VIP"

// --- Estado de verificación (QUÉ tan verificado estás) ---
export type VerificationStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "MORE_INFORMATION_REQUIRED"
  | "EXPIRED"
  | "SUSPENDED"

// --- Nivel de riesgo ---
export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "PROHIBITED"
  | "MANUAL_REVIEW"

// --- Estado de membresía VIP ---
export type VipStatus =
  | "VIP_PENDING_PAYMENT"
  | "VIP_ACTIVE"
  | "VIP_PAST_DUE"
  | "VIP_CANCEL_AT_PERIOD_END"
  | "VIP_SUSPENDED"
  | "VIP_EXPIRED"

// --- Estado de cuenta ---
export type AccountStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "CLOSED"

// ============================================================
// PERFILES
// ============================================================

export interface Profile {
  id: string
  authUserId: string
  publicHandle: string
  displayName: string
  preferredName?: string
  profilePhotoUrl?: string
  biography?: string
  businessCategory?: string
  role: UserRole
  membershipTier: MembershipTier
  vipStatus?: VipStatus
  accountStatus: AccountStatus
  verificationStatus: VerificationStatus
  language: string
  timezone?: string
  marketingConsent: boolean
  whatsappConsent: boolean
  privacyVersion: string
  termsVersion: string
  createdAt: string
  updatedAt: string
}

export interface ProfilePrivateData {
  id: string
  profileId: string
  legalFirstName?: string
  legalMiddleName?: string
  legalLastName?: string
  dateOfBirth?: string
  email: string
  phoneE164?: string
  countryCode?: string
  provinceRegion?: string
  municipalityCity?: string
  addressLine1?: string
  addressLine2?: string
  postalCode?: string
  encryptedIdentifierReference?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// KYC
// ============================================================

export interface KycCase {
  id: string
  profileId: string
  status: VerificationStatus
  riskLevel?: RiskLevel
  provider?: string
  providerReference?: string
  assuranceLevel?: string
  consentRecordId?: string
  submittedAt?: string
  reviewedAt?: string
  expiresAt?: string
  nextReviewAt?: string
  createdAt: string
  updatedAt: string
}

export interface KycDocument {
  id: string
  kycCaseId: string
  documentType: string
  providerReference?: string
  storageReference?: string
  fileName?: string
  fileHash?: string
  status: string
  reviewedAt?: string
  reviewNote?: string
  createdAt: string
}

export interface KycReview {
  id: string
  kycCaseId: string
  reviewerProfileId: string
  decision: VerificationStatus
  reasonCode?: string
  internalNote?: string
  providerReference?: string
  decidedAt: string
  nextReviewAt?: string
  auditEventId: string
  createdAt: string
}

// ============================================================
// KYB (Business)
// ============================================================

export interface BusinessProfile {
  id: string
  ownerProfileId: string
  legalBusinessName: string
  tradingName?: string
  entityType?: string
  registrationNumber?: string
  taxIdentifierReference?: string
  incorporationCountry?: string
  incorporationRegion?: string
  registeredAddress: Record<string, unknown>
  operatingAddress?: Record<string, unknown>
  businessCategory?: string
  businessDescription?: string
  website?: string
  supportEmail?: string
  supportPhone?: string
  expectedMonthlyVolume?: number
  expectedTransactionCount?: number
  operatingCountries?: string[]
  sourceOfFundsCategory?: string
  marketplaceCategory?: string
  verificationStatus: VerificationStatus
  riskLevel?: RiskLevel
  createdAt: string
  updatedAt: string
}

export interface BusinessMember {
  id: string
  businessProfileId: string
  userProfileId?: string
  fullName: string
  ownershipPercentage?: number
  controlRole: string
  kycStatus: VerificationStatus
  verificationReference?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// CONSENT & AUDIT
// ============================================================

export interface ConsentRecord {
  id: string
  profileId: string
  consentType: string
  consentVersion: string
  granted: boolean
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface VerificationEvent {
  id: string
  entityType: string
  entityId: string
  eventType: string
  actorProfileId?: string
  previousStatus?: string
  newStatus?: string
  reasonCode?: string
  metadata: Record<string, unknown>
  operationId: string
  createdAt: string
}

export interface AdminAction {
  id: string
  actorProfileId: string
  actionType: string
  targetType: string
  targetId: string
  reason: string
  mfaVerified: boolean
  operationId: string
  metadata: Record<string, unknown>
  createdAt: string
}

// ============================================================
// BADGES
// ============================================================

export interface Badge {
  id: string
  profileId: string
  badgeType: BadgeType
  earnedAt: string
  expiresAt?: string
  metadata?: Record<string, unknown>
}

export type BadgeType =
  | "ADMINISTRADOR_OFICIAL"
  | "VIP"
  | "IDENTIDAD_VERIFICADA"
  | "EMPRENDEDOR_VIP"
  | "NEGOCIO_VERIFICADO"
  | "FUNDADOR"
  | "EQUIPO_MSM"

// ============================================================
// PROVIDER INTERFACE
// ============================================================

export interface KycProviderSession {
  sessionId: string
  url?: string
  expiresAt?: string
  providerReference: string
}

export interface KycProviderResult {
  providerReference: string
  status: string
  assuranceLevel?: string
  riskLevel?: RiskLevel
  reasonCodes?: string[]
  rawResult?: Record<string, unknown>
}

// ============================================================
// PERMISSION SYSTEM
// ============================================================

export type Permission =
  | "users.read"
  | "users.update"
  | "users.suspend"
  | "roles.manage"
  | "memberships.manage"
  | "kyc.read"
  | "kyc.review"
  | "kyc.approve"
  | "kyc.reject"
  | "kyb.review"
  | "kyb.approve"
  | "audit.read"
  | "system.configure"
  | "plans.manage"
  | "marketplace.manage"
  | "economy.manage"
  | "security.manage"

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER_SUPERADMIN: [
    "users.read", "users.update", "users.suspend",
    "roles.manage", "memberships.manage",
    "kyc.read", "kyc.review", "kyc.approve", "kyc.reject",
    "kyb.review", "kyb.approve",
    "audit.read", "system.configure",
    "plans.manage", "marketplace.manage", "economy.manage", "security.manage",
  ],
  ADMIN: [
    "users.read", "users.update",
    "memberships.manage",
    "kyc.read", "kyc.review",
    "kyb.review",
    "audit.read",
    "plans.manage", "marketplace.manage",
  ],
  COMPLIANCE_REVIEWER: [
    "kyc.read", "kyc.review", "kyc.approve", "kyc.reject",
    "kyb.review", "kyb.approve",
    "audit.read",
  ],
  SUPPORT_AGENT: [
    "users.read",
    "kyc.read",
  ],
  ENTREPRENEUR: [
    "users.read",
    "marketplace.manage",
  ],
  USER: [
    "users.read",
  ],
}

// ============================================================
// LEGACY TYPES (backward compat — kept for existing code)
// ============================================================

export interface ZafiroUser {
  id: string
  name: string
  email: string
  phone?: string
  passwordHash: string
  displayName?: string
  avatar?: string
  role: LegacyUserRole
  permissions: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ZafiroSession {
  email: string
  name: string
  id: string
  role?: LegacyUserRole
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
