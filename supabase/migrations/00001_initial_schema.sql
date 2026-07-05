-- MSM Zafiro - Esquema inicial de base de datos
-- Basado en domain-model.md y functional-product-spec.md

-- Schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS knowledge;

-- ============================================================
-- CORE SCHEMA (compartido con ecosistema MSM)
-- ============================================================

CREATE TABLE core.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  locale TEXT DEFAULT 'es',
  country TEXT,
  email TEXT UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  phone TEXT UNIQUE,
  phone_verified BOOLEAN DEFAULT false,
  google_id TEXT UNIQUE,
  facebook_id TEXT UNIQUE,
  password_hash TEXT,
  reputation_score INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON core.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON core.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_google ON core.users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_facebook ON core.users(facebook_id);

CREATE TABLE core.user_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verification_method TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE core.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'plus', 'pro', 'expert', 'business')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE core.ai_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE core.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  target_type TEXT,
  target_id UUID,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE core.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES core.users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB,
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- KNOWLEDGE SCHEMA (Zafiro)
-- ============================================================

CREATE TABLE knowledge.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES knowledge.categories(id),
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES core.users(id),
  type TEXT DEFAULT 'question' CHECK (type IN ('question', 'poll', 'debate', 'idea', 'invention', 'problem', 'project', 'research')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'answered', 'validated', 'archived', 'removed')),
  original_language TEXT DEFAULT 'es',
  canonical_language TEXT DEFAULT 'es',
  title TEXT NOT NULL,
  body TEXT,
  category_id UUID REFERENCES knowledge.categories(id),
  accepted_answer_id UUID,
  ai_summary_id UUID,
  score INTEGER DEFAULT 0,
  answer_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.question_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES knowledge.questions(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  provider TEXT,
  quality_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.question_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES knowledge.questions(id) ON DELETE CASCADE,
  editor_id UUID REFERENCES core.users(id),
  title TEXT NOT NULL,
  body TEXT,
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES knowledge.questions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES core.users(id),
  source TEXT DEFAULT 'human' CHECK (source IN ('ai', 'human', 'organization')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'removed')),
  original_language TEXT DEFAULT 'es',
  body TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  validation_status TEXT DEFAULT 'none' CHECK (validation_status IN ('none', 'disputed', 'expert_validated', 'community_validated')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.answer_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES knowledge.answers(id) ON DELETE CASCADE,
  editor_id UUID REFERENCES core.users(id),
  body TEXT NOT NULL,
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.answer_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES knowledge.answers(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  body TEXT NOT NULL,
  provider TEXT,
  quality_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_type TEXT NOT NULL CHECK (parent_type IN ('question', 'answer')),
  parent_id UUID NOT NULL,
  author_id UUID REFERENCES core.users(id),
  body TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('question', 'answer', 'comment')),
  target_id UUID NOT NULL,
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

CREATE TABLE knowledge.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE knowledge.question_tags (
  question_id UUID REFERENCES knowledge.questions(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES knowledge.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);

CREATE TABLE knowledge.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'question', 'category', 'specialty')),
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  collection_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.reputation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  points INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

CREATE TABLE knowledge.user_badges (
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES knowledge.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE knowledge.expert_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES core.users(id),
  answer_id UUID REFERENCES knowledge.answers(id) ON DELETE CASCADE,
  specialty_id UUID,
  verdict TEXT NOT NULL CHECK (verdict IN ('valid', 'partially_valid', 'invalid', 'needs_sources')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.ai_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT NOT NULL CHECK (task_type IN ('answer', 'summarize', 'translate', 'classify', 'moderate', 'embed', 'explain', 'code', 'image')),
  provider TEXT,
  model TEXT,
  prompt_version TEXT,
  input_hash TEXT,
  output_ref TEXT,
  cost_usd FLOAT,
  latency_ms INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  language TEXT,
  model TEXT,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES core.users(id),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES core.users(id),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('ai', 'moderator', 'admin')),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES knowledge.categories(id),
  description TEXT,
  purpose TEXT,
  owner_id UUID REFERENCES core.users(id),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'premium')),
  monetization_type TEXT DEFAULT 'none' CHECK (monetization_type IN ('none', 'premium', 'subscription')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES knowledge.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin', 'owner')),
  reputation_score INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (community_id, user_id)
);

CREATE TABLE knowledge.community_questions (
  community_id UUID REFERENCES knowledge.communities(id) ON DELETE CASCADE,
  question_id UUID REFERENCES knowledge.questions(id) ON DELETE CASCADE,
  PRIMARY KEY (community_id, question_id)
);

CREATE TABLE knowledge.sponsor_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_user_id UUID REFERENCES core.users(id),
  brand_name TEXT NOT NULL,
  category_id UUID REFERENCES knowledge.categories(id),
  ad_copy TEXT NOT NULL,
  budget_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ai_review', 'approved', 'rejected', 'paid', 'active', 'paused', 'ended')),
  ai_review_reason TEXT,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Followers
CREATE TABLE core.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id <> following_id)
);

CREATE INDEX idx_followers_follower ON core.followers(follower_id);
CREATE INDEX idx_followers_following ON core.followers(following_id);

-- Indices
CREATE INDEX idx_questions_created ON knowledge.questions(created_at DESC);
CREATE INDEX idx_questions_score ON knowledge.questions(score DESC);
CREATE INDEX idx_questions_category ON knowledge.questions(category_id, created_at DESC);
CREATE INDEX idx_answers_question ON knowledge.answers(question_id, score DESC);
CREATE INDEX idx_votes_target ON knowledge.votes(target_type, target_id);
CREATE INDEX idx_notifications_user ON core.notifications(user_id, read_at, created_at DESC);
CREATE INDEX idx_reputation_user ON knowledge.reputation_events(user_id, created_at DESC);
