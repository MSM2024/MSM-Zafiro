-- MSM Zafiro - RLS policies + missing tables (stories, subscriptions, sponsors, trust_score_log, gifts_usdt)

-- ════════════════════════════════════════════════════════════════
-- 1. MISSING TABLES
-- ════════════════════════════════════════════════════════════════

-- stories (temporal content that expires)
CREATE TABLE IF NOT EXISTS knowledge.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES core.users(id) ON DELETE CASCADE,
  media_url TEXT,
  text TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '24 hours',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- subscriptions (user-to-user tipping / support)
CREATE TABLE IF NOT EXISTS core.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(subscriber_id, creator_id)
);

-- simplified sponsors view (maps knowledge.sponsor_campaigns)
CREATE OR REPLACE VIEW knowledge.sponsors AS
SELECT
  id, sponsor_user_id AS user_id, brand_name, category_id, ad_copy,
  budget_cents, status, ai_review_reason, stripe_checkout_session_id,
  starts_at, ends_at, created_at
FROM knowledge.sponsor_campaigns;

-- trust_score_log (tracks score changes over time)
CREATE TABLE IF NOT EXISTS core.trust_score_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  score_before INTEGER NOT NULL,
  score_after INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- gifts_usdt (USDT peer-to-peer gifts)
CREATE TABLE IF NOT EXISTS core.gifts_usdt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  amount_usdt NUMERIC(12, 2) NOT NULL,
  tx_hash TEXT,
  note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ════════════════════════════════════════════════════════════════
-- 2. ENABLE RLS ON ALL TABLES
-- ════════════════════════════════════════════════════════════════

ALTER TABLE knowledge.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.gifts_usdt ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.trust_score_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.sponsor_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.expert_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge.user_badges ENABLE ROW LEVEL SECURITY;

-- ════════════════════════════════════════════════════════════════
-- 3. RLS POLICIES
-- ════════════════════════════════════════════════════════════════

-- ── knowledge.questions ──
CREATE POLICY "questions_select_public" ON knowledge.questions
  FOR SELECT USING (status <> 'removed');
CREATE POLICY "questions_insert_own" ON knowledge.questions
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "questions_update_own" ON knowledge.questions
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "questions_delete_own" ON knowledge.questions
  FOR DELETE USING (auth.uid() = author_id);

-- ── knowledge.answers ──
CREATE POLICY "answers_select_public" ON knowledge.answers
  FOR SELECT USING (status <> 'removed');
CREATE POLICY "answers_insert_own" ON knowledge.answers
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "answers_update_own" ON knowledge.answers
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "answers_delete_own" ON knowledge.answers
  FOR DELETE USING (auth.uid() = author_id);

-- ── knowledge.votes ──
CREATE POLICY "votes_select_public" ON knowledge.votes
  FOR SELECT USING (true);
CREATE POLICY "votes_insert_own" ON knowledge.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_delete_own" ON knowledge.votes
  FOR DELETE USING (auth.uid() = user_id);

-- ── knowledge.stories ──
CREATE POLICY "stories_select_active" ON knowledge.stories
  FOR SELECT USING (expires_at > now());
CREATE POLICY "stories_insert_own" ON knowledge.stories
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "stories_delete_own" ON knowledge.stories
  FOR DELETE USING (auth.uid() = author_id);

-- ── core.subscriptions ──
CREATE POLICY "subscriptions_select_own" ON core.subscriptions
  FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
CREATE POLICY "subscriptions_insert_own" ON core.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

-- ── knowledge.sponsor_campaigns ──
CREATE POLICY "sponsors_select_approved" ON knowledge.sponsor_campaigns
  FOR SELECT USING (status = 'active' OR auth.uid() = sponsor_user_id);
CREATE POLICY "sponsors_insert_own" ON knowledge.sponsor_campaigns
  FOR INSERT WITH CHECK (auth.uid() = sponsor_user_id);
CREATE POLICY "sponsors_update_own" ON knowledge.sponsor_campaigns
  FOR UPDATE USING (auth.uid() = sponsor_user_id);

-- ── knowledge.reports ──
CREATE POLICY "reports_select_own" ON knowledge.reports
  FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "reports_insert_own" ON knowledge.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- ── core.trust_score_log ──
CREATE POLICY "trust_score_log_select_own" ON core.trust_score_log
  FOR SELECT USING (auth.uid() = user_id);

-- ── core.gifts_usdt ──
CREATE POLICY "gifts_usdt_select_own" ON core.gifts_usdt
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "gifts_usdt_insert_own" ON core.gifts_usdt
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- ── core.users ──
CREATE POLICY "users_select_public" ON core.users
  FOR SELECT USING (true);
CREATE POLICY "users_update_own" ON core.users
  FOR UPDATE USING (auth.uid() = id);

-- ── core.followers ──
CREATE POLICY "followers_select_public" ON core.followers
  FOR SELECT USING (true);
CREATE POLICY "followers_insert_own" ON core.followers
  FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "followers_delete_own" ON core.followers
  FOR DELETE USING (auth.uid() = follower_id);

-- ── knowledge.comments ──
CREATE POLICY "comments_select_public" ON knowledge.comments
  FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON knowledge.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_delete_own" ON knowledge.comments
  FOR DELETE USING (auth.uid() = author_id);

-- ── knowledge.communities ──
CREATE POLICY "communities_select_public" ON knowledge.communities
  FOR SELECT USING (true);
CREATE POLICY "communities_insert_own" ON knowledge.communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "communities_update_own" ON knowledge.communities
  FOR UPDATE USING (auth.uid() = owner_id);

-- ── knowledge.community_members ──
CREATE POLICY "community_members_select_public" ON knowledge.community_members
  FOR SELECT USING (true);
CREATE POLICY "community_members_insert_own" ON knowledge.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "community_members_delete_own" ON knowledge.community_members
  FOR DELETE USING (auth.uid() = user_id);

-- ── core.notifications ──
CREATE POLICY "notifications_select_own" ON core.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON core.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ── knowledge.saved_items ──
CREATE POLICY "saved_items_select_own" ON knowledge.saved_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_items_insert_own" ON knowledge.saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_items_delete_own" ON knowledge.saved_items
  FOR DELETE USING (auth.uid() = user_id);

-- ── knowledge.expert_validations ──
CREATE POLICY "expert_validations_select_public" ON knowledge.expert_validations
  FOR SELECT USING (true);
CREATE POLICY "expert_validations_insert_own" ON knowledge.expert_validations
  FOR INSERT WITH CHECK (auth.uid() = expert_id);

-- ── knowledge.badges ──
CREATE POLICY "badges_select_public" ON knowledge.badges
  FOR SELECT USING (true);

-- ── knowledge.user_badges ──
CREATE POLICY "user_badges_select_public" ON knowledge.user_badges
  FOR SELECT USING (true);
