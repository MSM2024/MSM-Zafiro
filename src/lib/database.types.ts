// ════════════════════════════════════════════════════════════════
// MSM Zafiro — Database TypeScript Types (matching Supabase schema)
// ════════════════════════════════════════════════════════════════

// ── core schema ──

export interface DBUser {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  locale: string | null
  country: string | null
  email: string | null
  email_verified: boolean
  phone: string | null
  phone_verified: boolean
  google_id: string | null
  facebook_id: string | null
  password_hash: string | null
  reputation_score: number
  level: number
  trust_score: number
  totp_secret: string | null
  totp_enabled: boolean
  recovery_email: string | null
  created_at: string
  updated_at: string
}

export interface DBVerifiedPhone {
  id: string
  user_id: string
  phone: string
  phone_verified_at: string
  is_primary: boolean
  created_at: string
}

export interface DBBackupCode {
  id: string
  user_id: string
  code_hash: string
  used: boolean
  created_at: string
}

export interface DBDeviceFingerprint {
  id: string
  fingerprint_hash: string
  first_seen_at: string
  last_seen_at: string
  user_id: string | null
  trusted: boolean
}

export interface DBOTPCode {
  id: string
  phone: string
  code_hash: string
  purpose: 'register' | 'login' | 'recovery' | 'change_phone'
  attempts: number
  expires_at: string
  used: boolean
  created_at: string
}

export interface DBFollower {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface DBMembership {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: 'free' | 'plus' | 'pro' | 'expert' | 'business'
  status: 'active' | 'canceled' | 'past_due'
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface DBSubscription {
  id: string
  subscriber_id: string
  creator_id: string
  amount_cents: number
  currency: string
  status: 'active' | 'canceled' | 'past_due'
  stripe_subscription_id: string | null
  current_period_end: string | null
  created_at: string
}

export interface DBTrustScoreLog {
  id: string
  user_id: string
  score_before: number
  score_after: number
  reason: string
  created_at: string
}

export interface DBGiftUSDT {
  id: string
  from_user_id: string
  to_user_id: string
  amount_usdt: number
  tx_hash: string | null
  note: string | null
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface DBNotification {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  target_type: string | null
  target_id: string | null
  read_at: string | null
  created_at: string
}

// ── knowledge schema ──

export interface DBCategory {
  id: string
  slug: string
  name: string
  description: string | null
  parent_id: string | null
  icon: string | null
  created_at: string
}

export interface DBQuestion {
  id: string
  author_id: string
  type: 'question' | 'poll' | 'debate' | 'idea' | 'invention' | 'problem' | 'project' | 'research'
  status: 'open' | 'answered' | 'validated' | 'archived' | 'removed'
  original_language: string
  canonical_language: string
  title: string
  body: string | null
  category_id: string | null
  accepted_answer_id: string | null
  ai_summary_id: string | null
  score: number
  answer_count: number
  follower_count: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface DBAnswer {
  id: string
  question_id: string
  author_id: string | null
  source: 'ai' | 'human' | 'organization'
  status: 'active' | 'hidden' | 'removed'
  original_language: string
  body: string
  score: number
  validation_status: 'none' | 'disputed' | 'expert_validated' | 'community_validated'
  created_at: string
  updated_at: string
}

export interface DBVote {
  id: string
  user_id: string
  target_type: 'question' | 'answer' | 'comment'
  target_id: string
  value: -1 | 1
  weight: number
  created_at: string
}

export interface DBComment {
  id: string
  parent_type: 'question' | 'answer'
  parent_id: string
  author_id: string
  body: string
  score: number
  created_at: string
  updated_at: string
}

export interface DBStory {
  id: string
  author_id: string
  media_url: string | null
  text: string | null
  expires_at: string
  created_at: string
}

export interface DBReport {
  id: string
  reporter_id: string
  target_type: string
  target_id: string
  reason: string
  details: string | null
  status: 'open' | 'reviewing' | 'resolved' | 'rejected'
  created_at: string
}

export interface DBCommunity {
  id: string
  name: string
  slug: string
  category_id: string | null
  description: string | null
  purpose: string | null
  owner_id: string
  visibility: 'public' | 'private' | 'premium'
  monetization_type: 'none' | 'premium' | 'subscription'
  created_at: string
}

export interface DBCommunityMember {
  id: string
  community_id: string
  user_id: string
  role: 'member' | 'moderator' | 'admin' | 'owner'
  reputation_score: number
  joined_at: string
}

export interface DBSponsorCampaign {
  id: string
  sponsor_user_id: string
  brand_name: string
  category_id: string | null
  ad_copy: string
  budget_cents: number
  status: 'draft' | 'ai_review' | 'approved' | 'rejected' | 'paid' | 'active' | 'paused' | 'ended'
  ai_review_reason: string | null
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  starts_at: string | null
  ends_at: string | null
  created_at: string
}

export interface DBExpertValidation {
  id: string
  expert_id: string
  answer_id: string
  specialty_id: string | null
  verdict: 'valid' | 'partially_valid' | 'invalid' | 'needs_sources'
  note: string | null
  created_at: string
}

export interface DBBadge {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
}

export interface DBUserBadge {
  user_id: string
  badge_id: string
  awarded_at: string
}

// ── Helper: column name mapping ──
// knowledge.questions: author_id (not user_id)
// knowledge.answers:   author_id (not user_id)
// knowledge.comments:  author_id (not user_id)
// knowledge.reports:   reporter_id (not user_id)
// knowledge.sponsor_campaigns: sponsor_user_id (not user_id)

export const TABLES = {
  users: 'core.users',
  questions: 'knowledge.questions',
  answers: 'knowledge.answers',
  votes: 'knowledge.votes',
  comments: 'knowledge.comments',
  stories: 'knowledge.stories',
  reports: 'knowledge.reports',
  communities: 'knowledge.communities',
  community_members: 'knowledge.community_members',
  categories: 'knowledge.categories',
  tags: 'knowledge.tags',
  followers: 'core.followers',
  subscriptions: 'core.subscriptions',
  notifications: 'core.notifications',
  memberships: 'core.memberships',
  sponsors: 'knowledge.sponsor_campaigns',
  trust_score_log: 'core.trust_score_log',
  gifts_usdt: 'core.gifts_usdt',
  badges: 'knowledge.badges',
  user_badges: 'knowledge.user_badges',
  expert_validations: 'knowledge.expert_validations',
  saved_items: 'knowledge.saved_items',
  verified_phones: 'core.verified_phones',
  backup_codes: 'core.backup_codes',
  otp_codes: 'core.otp_codes',
} as const
