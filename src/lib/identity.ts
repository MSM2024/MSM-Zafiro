'use client'

import { getSupabaseClient, isSupabaseAvailable } from './supabase'
import { getSession } from './auth'
import type {
  Profile, ProfilePrivateData, MembershipTier, VerificationStatus,
  RiskLevel, UserRole, VipStatus, AccountStatus, Badge, BadgeType,
  KycCase, KycDocument, KycReview, BusinessProfile, BusinessMember,
  ConsentRecord, VerificationEvent, AdminAction, Permission,
  ROLE_PERMISSIONS, KycProviderSession, KycProviderResult,
} from '../../packages/types/src/zafiro'

export type { Profile, ProfilePrivateData, BusinessProfile, BusinessMember, KycCase, KycDocument, KycReview, VerificationEvent, UserRole, MembershipTier, VerificationStatus, RiskLevel, Permission, Badge, VipStatus, BadgeType }

// ============================================================
// localStorage keys
// ============================================================
const PROFILES_KEY = 'zafiro_v2_profiles'
const PRIVATE_KEY = 'zafiro_v2_private'
const KYC_CASES_KEY = 'zafiro_v2_kyc_cases'
const KYC_DOCS_KEY = 'zafiro_v2_kyc_docs'
const KYC_REVIEWS_KEY = 'zafiro_v2_kyc_reviews'
const BUSINESS_KEY = 'zafiro_v2_business'
const BUSINESS_MEMBERS_KEY = 'zafiro_v2_business_members'
const CONSENTS_KEY = 'zafiro_v2_consents'
const EVENTS_KEY = 'zafiro_v2_events'
const ADMINS_KEY = 'zafiro_v2_admin_actions'
const BADGES_KEY = 'zafiro_v2_badges'

// ============================================================
// UTILITY
// ============================================================
function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

function now(): string {
  return new Date().toISOString()
}

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function lsSet(key: string, value: unknown) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value))
}

function genOperationId(): string {
  return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ============================================================
// 1. PROFILE CRUD
// ============================================================

export function getProfiles(): Profile[] {
  return lsGet<Profile[]>(PROFILES_KEY, [])
}

export function saveProfiles(profiles: Profile[]) {
  lsSet(PROFILES_KEY, profiles)
}

export function getProfileByAuthId(authUserId: string): Profile | undefined {
  return getProfiles().find(p => p.authUserId === authUserId)
}

export function getProfileById(id: string): Profile | undefined {
  return getProfiles().find(p => p.id === id)
}

export function getProfileByHandle(handle: string): Profile | undefined {
  return getProfiles().find(p => p.publicHandle === handle)
}

export function createProfile(
  authUserId: string,
  displayName: string,
  email: string,
  role: UserRole = 'USER',
  tier: MembershipTier = 'STANDARD',
): Profile {
  const profiles = getProfiles()
  const existing = profiles.find(p => p.authUserId === authUserId)
  if (existing) return existing

  const handle = displayName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + '_' + authUserId.slice(0, 6)
  const profile: Profile = {
    id: genId(),
    authUserId,
    publicHandle: handle,
    displayName,
    role,
    membershipTier: tier,
    accountStatus: 'ACTIVE',
    verificationStatus: 'NOT_STARTED',
    language: 'es',
    marketingConsent: false,
    whatsappConsent: false,
    privacyVersion: '1.0',
    termsVersion: '1.0',
    createdAt: now(),
    updatedAt: now(),
  }
  profiles.push(profile)
  saveProfiles(profiles)
  createPrivateData(profile.id, email)
  return profile
}

export function updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
  const profiles = getProfiles()
  const idx = profiles.findIndex(p => p.id === id)
  if (idx === -1) return undefined
  profiles[idx] = { ...profiles[idx], ...updates, updatedAt: now() }
  saveProfiles(profiles)
  return profiles[idx]
}

// ============================================================
// 2. PRIVATE DATA
// ============================================================

export function getPrivateData(profileId: string): ProfilePrivateData | undefined {
  const all = lsGet<ProfilePrivateData[]>(PRIVATE_KEY, [])
  return all.find(d => d.profileId === profileId)
}

function createPrivateData(profileId: string, email: string): ProfilePrivateData {
  const all = lsGet<ProfilePrivateData[]>(PRIVATE_KEY, [])
  const data: ProfilePrivateData = {
    id: genId(),
    profileId,
    email,
    createdAt: now(),
    updatedAt: now(),
  }
  all.push(data)
  lsSet(PRIVATE_KEY, all)
  return data
}

export function updatePrivateData(profileId: string, updates: Partial<ProfilePrivateData>): ProfilePrivateData | undefined {
  const all = lsGet<ProfilePrivateData[]>(PRIVATE_KEY, [])
  const idx = all.findIndex(d => d.profileId === profileId)
  if (idx === -1) return undefined
  all[idx] = { ...all[idx], ...updates, updatedAt: now() }
  lsSet(PRIVATE_KEY, all)
  return all[idx]
}

// ============================================================
// 3. VIP MEMBERSHIP
// ============================================================

export function activateVip(profileId: string): Profile | undefined {
  return updateProfile(profileId, {
    membershipTier: 'VIP',
    vipStatus: 'VIP_PENDING_PAYMENT',
  })
}

export function confirmVipPayment(profileId: string): Profile | undefined {
  return updateProfile(profileId, {
    vipStatus: 'VIP_ACTIVE',
  })
}

export function cancelVip(profileId: string): Profile | undefined {
  return updateProfile(profileId, {
    vipStatus: 'VIP_CANCEL_AT_PERIOD_END',
  })
}

export function suspendVip(profileId: string): Profile | undefined {
  return updateProfile(profileId, {
    vipStatus: 'VIP_SUSPENDED',
  })
}

// ============================================================
// 4. KYC
// ============================================================

export function getKycCases(): KycCase[] {
  return lsGet<KycCase[]>(KYC_CASES_KEY, [])
}

export function getKycCase(profileId: string): KycCase | undefined {
  return getKycCases().find(k => k.profileId === profileId)
}

export function createKycCase(profileId: string): KycCase {
  const cases = getKycCases()
  const existing = cases.find(k => k.profileId === profileId)
  if (existing) return existing

  const kc: KycCase = {
    id: genId(),
    profileId,
    status: 'NOT_STARTED',
    createdAt: now(),
    updatedAt: now(),
  }
  cases.push(kc)
  lsSet(KYC_CASES_KEY, cases)
  updateProfile(profileId, { verificationStatus: 'NOT_STARTED' })
  recordEvent('kyc_case', kc.id, 'CREATED', profileId, undefined, 'NOT_STARTED')
  return kc
}

export function updateKycCase(caseId: string, updates: Partial<KycCase>): KycCase | undefined {
  const cases = getKycCases()
  const idx = cases.findIndex(k => k.id === caseId)
  if (idx === -1) return undefined
  const prev = cases[idx].status
  cases[idx] = { ...cases[idx], ...updates, updatedAt: now() }
  lsSet(KYC_CASES_KEY, cases)
  if (updates.status && updates.status !== prev) {
    updateProfile(cases[idx].profileId, { verificationStatus: updates.status })
    recordEvent('kyc_case', caseId, `STATUS_${updates.status}`, undefined, prev, updates.status)
  }
  return cases[idx]
}

export function getKycDocuments(kycCaseId: string): KycDocument[] {
  const all = lsGet<KycDocument[]>(KYC_DOCS_KEY, [])
  return all.filter(d => d.kycCaseId === kycCaseId)
}

export function addKycDocument(kycCaseId: string, docType: string, fileName: string): KycDocument {
  const all = lsGet<KycDocument[]>(KYC_DOCS_KEY, [])
  const doc: KycDocument = {
    id: genId(),
    kycCaseId,
    documentType: docType,
    fileName,
    fileHash: genId(),
    status: 'uploaded',
    createdAt: now(),
  }
  all.push(doc)
  lsSet(KYC_DOCS_KEY, all)
  return doc
}

export function getKycReviews(kycCaseId: string): KycReview[] {
  const all = lsGet<KycReview[]>(KYC_REVIEWS_KEY, [])
  return all.filter(r => r.kycCaseId === kycCaseId)
}

export function approveKyc(caseId: string, reviewerProfileId: string, reasonCode?: string, note?: string): KycCase | undefined {
  const kc = updateKycCase(caseId, { status: 'APPROVED', reviewedAt: now() })
  if (!kc) return undefined
  const review: KycReview = {
    id: genId(),
    kycCaseId: caseId,
    reviewerProfileId,
    decision: 'APPROVED',
    reasonCode,
    internalNote: note,
    decidedAt: now(),
    auditEventId: genId(),
    createdAt: now(),
  }
  const reviews = lsGet<KycReview[]>(KYC_REVIEWS_KEY, [])
  reviews.push(review)
  lsSet(KYC_REVIEWS_KEY, reviews)
  return kc
}

export function rejectKyc(caseId: string, reviewerProfileId: string, reasonCode: string, note?: string): KycCase | undefined {
  const kc = updateKycCase(caseId, { status: 'REJECTED', reviewedAt: now() })
  if (!kc) return undefined
  const review: KycReview = {
    id: genId(),
    kycCaseId: caseId,
    reviewerProfileId,
    decision: 'REJECTED',
    reasonCode,
    internalNote: note,
    decidedAt: now(),
    auditEventId: genId(),
    createdAt: now(),
  }
  const reviews = lsGet<KycReview[]>(KYC_REVIEWS_KEY, [])
  reviews.push(review)
  lsSet(KYC_REVIEWS_KEY, reviews)
  return kc
}

export function requestKycInfo(caseId: string, reviewerProfileId: string, reasonCode: string): KycCase | undefined {
  return updateKycCase(caseId, { status: 'MORE_INFORMATION_REQUIRED' })
}

// ============================================================
// 5. KYB (Business)
// ============================================================

export function getBusinessProfiles(): BusinessProfile[] {
  return lsGet<BusinessProfile[]>(BUSINESS_KEY, [])
}

export function getBusinessProfile(ownerProfileId: string): BusinessProfile | undefined {
  return getBusinessProfiles().find(b => b.ownerProfileId === ownerProfileId)
}

export function createBusinessProfile(
  ownerProfileId: string,
  legalBusinessName: string,
  entityType?: string,
): BusinessProfile {
  const all = getBusinessProfiles()
  const existing = all.find(b => b.ownerProfileId === ownerProfileId)
  if (existing) return existing

  const bp: BusinessProfile = {
    id: genId(),
    ownerProfileId,
    legalBusinessName,
    entityType,
    registeredAddress: {},
    verificationStatus: 'NOT_STARTED',
    createdAt: now(),
    updatedAt: now(),
  }
  all.push(bp)
  lsSet(BUSINESS_KEY, all)
  updateProfile(ownerProfileId, { membershipTier: 'ENTREPRENEUR_VIP' })
  recordEvent('business_profile', bp.id, 'CREATED', ownerProfileId)
  return bp
}

export function updateBusinessProfile(id: string, updates: Partial<BusinessProfile>): BusinessProfile | undefined {
  const all = getBusinessProfiles()
  const idx = all.findIndex(b => b.id === id)
  if (idx === -1) return undefined
  const prev = all[idx].verificationStatus
  all[idx] = { ...all[idx], ...updates, updatedAt: now() }
  lsSet(BUSINESS_KEY, all)
  if (updates.verificationStatus && updates.verificationStatus !== prev) {
    recordEvent('business_profile', id, `STATUS_${updates.verificationStatus}`, undefined, prev, updates.verificationStatus)
  }
  return all[idx]
}

export function getBusinessMembers(businessProfileId: string): BusinessMember[] {
  const all = lsGet<BusinessMember[]>(BUSINESS_MEMBERS_KEY, [])
  return all.filter(m => m.businessProfileId === businessProfileId)
}

export function addBusinessMember(
  businessProfileId: string,
  fullName: string,
  controlRole: string,
  ownershipPercentage?: number,
): BusinessMember {
  const all = lsGet<BusinessMember[]>(BUSINESS_MEMBERS_KEY, [])
  const member: BusinessMember = {
    id: genId(),
    businessProfileId,
    fullName,
    controlRole,
    ownershipPercentage,
    kycStatus: 'NOT_STARTED',
    createdAt: now(),
    updatedAt: now(),
  }
  all.push(member)
  lsSet(BUSINESS_MEMBERS_KEY, all)
  return member
}

// ============================================================
// 6. BADGES
// ============================================================

export function getBadges(profileId: string): Badge[] {
  const all = lsGet<Badge[]>(BADGES_KEY, [])
  return all.filter(b => b.profileId === profileId)
}

export function awardBadge(profileId: string, badgeType: BadgeType, metadata?: Record<string, unknown>): Badge {
  const all = lsGet<Badge[]>(BADGES_KEY, [])
  const existing = all.find(b => b.profileId === profileId && b.badgeType === badgeType)
  if (existing) return existing

  const badge: Badge = {
    id: genId(),
    profileId,
    badgeType,
    earnedAt: now(),
    metadata,
  }
  all.push(badge)
  lsSet(BADGES_KEY, all)
  return badge
}

export function getEarnedBadges(profileId: string): BadgeType[] {
  return getBadges(profileId).map(b => b.badgeType)
}

// ============================================================
// 7. CONSENT
// ============================================================

export function recordConsent(profileId: string, type: string, version: string, granted: boolean): ConsentRecord {
  const all = lsGet<ConsentRecord[]>(CONSENTS_KEY, [])
  const record: ConsentRecord = {
    id: genId(),
    profileId,
    consentType: type,
    consentVersion: version,
    granted,
    createdAt: now(),
  }
  all.push(record)
  lsSet(CONSENTS_KEY, all)
  return record
}

export function hasConsent(profileId: string, type: string): boolean {
  const all = lsGet<ConsentRecord[]>(CONSENTS_KEY, [])
  const records = all.filter(r => r.profileId === profileId && r.consentType === type)
  return records.length > 0 && records[records.length - 1].granted
}

// ============================================================
// 8. AUDIT EVENTS (append-only)
// ============================================================

export function getEvents(entityType?: string, entityId?: string): VerificationEvent[] {
  let all = lsGet<VerificationEvent[]>(EVENTS_KEY, [])
  if (entityType) all = all.filter(e => e.entityType === entityType)
  if (entityId) all = all.filter(e => e.entityId === entityId)
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function recordEvent(
  entityType: string, entityId: string, eventType: string,
  actorProfileId?: string, previousStatus?: string, newStatus?: string,
  reasonCode?: string, metadata?: Record<string, unknown>,
): VerificationEvent {
  const all = lsGet<VerificationEvent[]>(EVENTS_KEY, [])
  const event: VerificationEvent = {
    id: genId(),
    entityType,
    entityId,
    eventType,
    actorProfileId,
    previousStatus,
    newStatus,
    reasonCode,
    metadata: metadata || {},
    operationId: genOperationId(),
    createdAt: now(),
  }
  all.push(event)
  lsSet(EVENTS_KEY, all)
  return event
}

// ============================================================
// 9. ADMIN ACTIONS (append-only, MFA-gated)
// ============================================================

export function getAdminActions(): AdminAction[] {
  return lsGet<AdminAction[]>(ADMINS_KEY, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function recordAdminAction(
  actorProfileId: string,
  actionType: string,
  targetType: string,
  targetId: string,
  reason: string,
  mfaVerified: boolean,
  metadata?: Record<string, unknown>,
): AdminAction | null {
  if (!mfaVerified) return null
  const all = lsGet<AdminAction[]>(ADMINS_KEY, [])
  const action: AdminAction = {
    id: genId(),
    actorProfileId,
    actionType,
    targetType,
    targetId,
    reason,
    mfaVerified: true,
    operationId: genOperationId(),
    metadata: metadata || {},
    createdAt: now(),
  }
  all.push(action)
  lsSet(ADMINS_KEY, all)
  recordEvent('admin_action', targetId, actionType, actorProfileId, undefined, undefined, reason)
  return action
}

// ============================================================
// 10. DON MIGUEL BOOTSTRAP
// ============================================================

const OWNER_EMAIL = process.env.NEXT_PUBLIC_ZAFIRO_OWNER_EMAIL || 'cm8msm@gmail.com'
const OWNER_DISPLAY = process.env.NEXT_PUBLIC_ZAFIRO_OWNER_DISPLAY_NAME || 'Don Miguel'

export function bootstrapOwnerProfile(): Profile | undefined {
  const session = getSession()
  if (!session) return undefined

  const isOwner = session.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
  if (!isOwner) return undefined

  let profile = getProfileByAuthId(session.id)
  if (!profile) {
    profile = createProfile(session.id, OWNER_DISPLAY, session.email || OWNER_EMAIL, 'OWNER_SUPERADMIN')
  }

  profile = updateProfile(profile.id, {
    role: 'OWNER_SUPERADMIN',
    membershipTier: 'VIP',
    vipStatus: 'VIP_ACTIVE',
    verificationStatus: 'APPROVED',
  }) || profile

  awardBadge(profile.id, 'ADMINISTRADOR_OFICIAL')
  awardBadge(profile.id, 'VIP')
  awardBadge(profile.id, 'IDENTIDAD_VERIFICADA')
  awardBadge(profile.id, 'FUNDADOR')

  recordEvent('profile', profile.id, 'OWNER_BOOTSTRAPPED', profile.id)

  return profile
}

// ============================================================
// 11. PERMISSION HELPERS
// ============================================================

const PERMISSION_MAP: Record<UserRole, Permission[]> = {
  OWNER_SUPERADMIN: [
    'users.read', 'users.update', 'users.suspend',
    'roles.manage', 'memberships.manage',
    'kyc.read', 'kyc.review', 'kyc.approve', 'kyc.reject',
    'kyb.review', 'kyb.approve',
    'audit.read', 'system.configure',
    'plans.manage', 'marketplace.manage', 'economy.manage', 'security.manage',
  ],
  ADMIN: [
    'users.read', 'users.update',
    'memberships.manage',
    'kyc.read', 'kyc.review',
    'kyb.review',
    'audit.read',
    'plans.manage', 'marketplace.manage',
  ],
  COMPLIANCE_REVIEWER: [
    'kyc.read', 'kyc.review', 'kyc.approve', 'kyc.reject',
    'kyb.review', 'kyb.approve',
    'audit.read',
  ],
  SUPPORT_AGENT: ['users.read', 'kyc.read'],
  ENTREPRENEUR: ['users.read', 'marketplace.manage'],
  USER: ['users.read'],
}

export function hasPermission(profile: Profile | undefined, permission: Permission): boolean {
  if (!profile) return false
  return (PERMISSION_MAP[profile.role] || []).includes(permission)
}

export function can(permission: Permission): boolean {
  const session = getSession()
  if (!session) return false
  const profile = getProfileByAuthId(session.id)
  return hasPermission(profile, permission)
}

// ============================================================
// 12. PROVIDER INTERFACE (sandbox)
// ============================================================

export interface KycProvider {
  createSession(input: { profileId: string; kycCaseId: string; documentTypes: string[] }): Promise<KycProviderSession>
  getSession(reference: string): Promise<KycProviderResult>
  cancelSession(reference: string): Promise<void>
  verifyWebhook(payload: unknown, signature: string): Promise<boolean>
}

export class SandboxKycProvider implements KycProvider {
  async createSession(input: { profileId: string; kycCaseId: string; documentTypes: string[] }): Promise<KycProviderSession> {
    const ref = `sbx_${genId()}`
    return {
      sessionId: genId(),
      url: `/kyc/mock?ref=${ref}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      providerReference: ref,
    }
  }

  async getSession(reference: string): Promise<KycProviderResult> {
    return {
      providerReference: reference,
      status: 'COMPLETED',
      assuranceLevel: 'MEDIUM',
      riskLevel: 'LOW',
      reasonCodes: [],
    }
  }

  async cancelSession(_reference: string): Promise<void> {}

  async verifyWebhook(_payload: unknown, _signature: string): Promise<boolean> {
    return true
  }
}

// ============================================================
// 13. STATS (for admin dashboard)
// ============================================================

export function getIdentityStats() {
  const profiles = getProfiles()
  const kycCases = getKycCases()
  const businesses = getBusinessProfiles()

  return {
    totalUsers: profiles.length,
    standard: profiles.filter(p => p.membershipTier === 'STANDARD').length,
    vip: profiles.filter(p => p.membershipTier === 'VIP').length,
    entrepreneurVip: profiles.filter(p => p.membershipTier === 'ENTREPRENEUR_VIP').length,
    kycStarted: kycCases.filter(k => k.status !== 'NOT_STARTED').length,
    kycPending: kycCases.filter(k => k.status === 'PENDING_REVIEW').length,
    kycApproved: kycCases.filter(k => k.status === 'APPROVED').length,
    kycRejected: kycCases.filter(k => k.status === 'REJECTED').length,
    kycMoreInfo: kycCases.filter(k => k.status === 'MORE_INFORMATION_REQUIRED').length,
    kybPending: businesses.filter(b => b.verificationStatus === 'PENDING_REVIEW').length,
    highRisk: kycCases.filter(k => k.riskLevel === 'HIGH' || k.riskLevel === 'PROHIBITED').length,
    expiringSoon: kycCases.filter(k => {
      if (!k.expiresAt) return false
      const daysLeft = (new Date(k.expiresAt).getTime() - Date.now()) / 86400000
      return daysLeft > 0 && daysLeft < 30
    }).length,
    recentActions: getAdminActions().slice(0, 10),
  }
}

// ============================================================
// 14. RESET (dev only)
// ============================================================

export function resetIdentitySystem() {
  const keys = [PROFILES_KEY, PRIVATE_KEY, KYC_CASES_KEY, KYC_DOCS_KEY,
    KYC_REVIEWS_KEY, BUSINESS_KEY, BUSINESS_MEMBERS_KEY, CONSENTS_KEY,
    EVENTS_KEY, ADMINS_KEY, BADGES_KEY]
  if (typeof window !== 'undefined') keys.forEach(k => localStorage.removeItem(k))
}
