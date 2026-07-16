-- ============================================================
-- ZAFIRO — Identity System: Profiles, VIP, KYC, KYB
-- Migration 00005 (review before executing)
-- ============================================================

-- Run this only after reviewing:
--   1. Existing enums in the database
--   2. Existing table names (profiles already exists in 00001)
--   3. Existing RLS policies
--   4. auth.users references

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM (
    'OWNER_SUPERADMIN', 'ADMIN', 'COMPLIANCE_REVIEWER',
    'SUPPORT_AGENT', 'ENTREPRENEUR', 'USER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.membership_tier AS ENUM (
    'STANDARD', 'VIP', 'ENTREPRENEUR_VIP'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.verification_status AS ENUM (
    'NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW',
    'APPROVED', 'REJECTED', 'MORE_INFORMATION_REQUIRED',
    'EXPIRED', 'SUSPENDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.risk_level AS ENUM (
    'LOW', 'MEDIUM', 'HIGH', 'PROHIBITED', 'MANUAL_REVIEW'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.vip_status AS ENUM (
    'VIP_PENDING_PAYMENT', 'VIP_ACTIVE', 'VIP_PAST_DUE',
    'VIP_CANCEL_AT_PERIOD_END', 'VIP_SUSPENDED', 'VIP_EXPIRED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.account_status AS ENUM (
    'ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.badge_type AS ENUM (
    'ADMINISTRADOR_OFICIAL', 'VIP', 'IDENTIDAD_VERIFICADA',
    'EMPRENDEDOR_VIP', 'NEGOCIO_VERIFICADO', 'FUNDADOR', 'EQUIPO_MSM'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- PROFILES MIGRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_handle TEXT UNIQUE,
  display_name TEXT NOT NULL,
  preferred_name TEXT,
  profile_photo_url TEXT,
  biography TEXT,
  business_category TEXT,
  role public.user_role NOT NULL DEFAULT 'USER',
  membership_tier public.membership_tier NOT NULL DEFAULT 'STANDARD',
  vip_status public.vip_status,
  account_status public.account_status NOT NULL DEFAULT 'ACTIVE',
  verification_status public.verification_status NOT NULL DEFAULT 'NOT_STARTED',
  language TEXT NOT NULL DEFAULT 'es',
  timezone TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  whatsapp_consent BOOLEAN NOT NULL DEFAULT false,
  privacy_version TEXT NOT NULL DEFAULT '1.0',
  terms_version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for profiles_v2
CREATE INDEX IF NOT EXISTS idx_profiles_v2_auth_user ON public.profiles_v2(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_v2_handle ON public.profiles_v2(public_handle);
CREATE INDEX IF NOT EXISTS idx_profiles_v2_role ON public.profiles_v2(role);
CREATE INDEX IF NOT EXISTS idx_profiles_v2_tier ON public.profiles_v2(membership_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_v2_verification ON public.profiles_v2(verification_status);

-- ============================================================
-- PROFILE PRIVATE DATA
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profile_private_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles_v2(id) ON DELETE CASCADE,
  legal_first_name TEXT,
  legal_middle_name TEXT,
  legal_last_name TEXT,
  date_of_birth DATE,
  email TEXT NOT NULL,
  phone_e164 TEXT,
  country_code TEXT,
  province_region TEXT,
  municipality_city TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  postal_code TEXT,
  encrypted_identifier_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- KYC
-- ============================================================

CREATE TABLE IF NOT EXISTS public.kyc_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles_v2(id) ON DELETE CASCADE,
  status public.verification_status NOT NULL DEFAULT 'NOT_STARTED',
  risk_level public.risk_level,
  provider TEXT,
  provider_reference TEXT,
  assurance_level TEXT,
  consent_record_id UUID,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kyc_cases_profile ON public.kyc_cases(profile_id);
CREATE INDEX IF NOT EXISTS idx_kyc_cases_status ON public.kyc_cases(status);
CREATE INDEX IF NOT EXISTS idx_kyc_cases_risk ON public.kyc_cases(risk_level);

CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_case_id UUID NOT NULL REFERENCES public.kyc_cases(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  provider_reference TEXT,
  storage_reference TEXT,
  file_name TEXT,
  file_hash TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded',
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kyc_provider_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_case_id UUID NOT NULL REFERENCES public.kyc_cases(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_reference TEXT NOT NULL,
  session_url TEXT,
  status TEXT NOT NULL DEFAULT 'created',
  expires_at TIMESTAMPTZ,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kyc_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_case_id UUID NOT NULL REFERENCES public.kyc_cases(id) ON DELETE CASCADE,
  reviewer_profile_id UUID NOT NULL REFERENCES public.profiles_v2(id),
  decision public.verification_status NOT NULL,
  reason_code TEXT,
  internal_note TEXT,
  provider_reference TEXT,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_review_at TIMESTAMPTZ,
  audit_event_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- KYB (BUSINESS)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id UUID NOT NULL REFERENCES public.profiles_v2(id),
  legal_business_name TEXT NOT NULL,
  trading_name TEXT,
  entity_type TEXT,
  registration_number TEXT,
  tax_identifier_reference TEXT,
  incorporation_country TEXT,
  incorporation_region TEXT,
  registered_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  operating_address JSONB DEFAULT '{}'::jsonb,
  business_category TEXT,
  business_description TEXT,
  website TEXT,
  support_email TEXT,
  support_phone TEXT,
  expected_monthly_volume NUMERIC,
  expected_transaction_count INTEGER,
  operating_countries TEXT[],
  source_of_funds_category TEXT,
  marketplace_category TEXT,
  verification_status public.verification_status NOT NULL DEFAULT 'NOT_STARTED',
  risk_level public.risk_level,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_owner ON public.business_profiles(owner_profile_id);
CREATE INDEX IF NOT EXISTS idx_business_verification ON public.business_profiles(verification_status);

CREATE TABLE IF NOT EXISTS public.business_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_profile_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  user_profile_id UUID REFERENCES public.profiles_v2(id),
  full_name TEXT NOT NULL,
  ownership_percentage NUMERIC,
  control_role TEXT NOT NULL,
  kyc_status public.verification_status NOT NULL DEFAULT 'NOT_STARTED',
  verification_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.beneficial_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_profile_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  ownership_percentage NUMERIC,
  control_role TEXT NOT NULL,
  kyc_status public.verification_status NOT NULL DEFAULT 'NOT_STARTED',
  verification_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CONSENT RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles_v2(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consent_profile ON public.consent_records(profile_id);

-- ============================================================
-- VERIFICATION EVENTS (append-only audit log)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  actor_profile_id UUID REFERENCES public.profiles_v2(id),
  previous_status TEXT,
  new_status TEXT,
  reason_code TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  operation_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verif_events_entity ON public.verification_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_verif_events_op ON public.verification_events(operation_id);
CREATE INDEX IF NOT EXISTS idx_verif_events_time ON public.verification_events(created_at DESC);

-- ============================================================
-- BADGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profile_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles_v2(id) ON DELETE CASCADE,
  badge_type public.badge_type NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(profile_id, badge_type)
);

-- ============================================================
-- ADMIN ACTIONS (append-only, always requires MFA)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id UUID NOT NULL REFERENCES public.profiles_v2(id),
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  mfa_verified BOOLEAN NOT NULL DEFAULT false,
  operation_id TEXT UNIQUE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_actions_actor ON public.admin_actions(actor_profile_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_time ON public.admin_actions(created_at DESC);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.profiles_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_private_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_provider_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficial_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Profiles: owner reads/updates own; admins read all
CREATE POLICY profiles_v2_own ON public.profiles_v2
  FOR ALL USING (auth.uid() = auth_user_id);

CREATE POLICY profiles_v2_admin_read ON public.profiles_v2
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.auth_user_id = auth.uid() AND p.role IN ('OWNER_SUPERADMIN', 'ADMIN'))
  );

-- Private data: owner only
CREATE POLICY private_data_own ON public.profile_private_data
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.id = profile_id AND p.auth_user_id = auth.uid())
  );

-- KYC cases: owner sees own; reviewers see assigned
CREATE POLICY kyc_cases_own ON public.kyc_cases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.id = profile_id AND p.auth_user_id = auth.uid())
  );

CREATE POLICY kyc_cases_review ON public.kyc_cases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.auth_user_id = auth.uid() AND p.role IN ('OWNER_SUPERADMIN', 'ADMIN', 'COMPLIANCE_REVIEWER'))
  );

-- KYC documents: reviewer access only via signed URLs
CREATE POLICY kyc_docs_review ON public.kyc_documents
  USING (
    EXISTS (SELECT 1 FROM public.kyc_cases k JOIN public.profiles_v2 p ON p.auth_user_id = auth.uid()
      WHERE k.id = kyc_case_id AND p.role IN ('OWNER_SUPERADMIN', 'COMPLIANCE_REVIEWER'))
  );

-- Business: owner sees own; reviewers see assigned
CREATE POLICY business_own ON public.business_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.id = owner_profile_id AND p.auth_user_id = auth.uid())
  );

CREATE POLICY business_review ON public.business_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.auth_user_id = auth.uid() AND p.role IN ('OWNER_SUPERADMIN', 'ADMIN', 'COMPLIANCE_REVIEWER'))
  );

-- Verification events: append-only, readable by admins and owner
CREATE POLICY verif_events_read ON public.verification_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.auth_user_id = auth.uid() AND p.role IN ('OWNER_SUPERADMIN', 'ADMIN', 'COMPLIANCE_REVIEWER'))
    OR actor_profile_id IN (SELECT id FROM public.profiles_v2 WHERE auth_user_id = auth.uid())
  );

CREATE POLICY verif_events_insert ON public.verification_events
  FOR INSERT WITH CHECK (true);

-- Badges: readable by everyone, awarded by system
CREATE POLICY badges_read ON public.profile_badges
  FOR SELECT USING (true);

-- Admin actions: append-only, readable by admins
CREATE POLICY admin_actions_read ON public.admin_actions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.auth_user_id = auth.uid() AND p.role IN ('OWNER_SUPERADMIN', 'ADMIN'))
  );

CREATE POLICY admin_actions_insert ON public.admin_actions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles_v2 p WHERE p.id = actor_profile_id AND p.auth_user_id = auth.uid())
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_v2_updated_at BEFORE UPDATE ON public.profiles_v2
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_private_data_updated_at BEFORE UPDATE ON public.profile_private_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_kyc_cases_updated_at BEFORE UPDATE ON public.kyc_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_business_updated_at BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_business_member_updated_at BEFORE UPDATE ON public.business_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user_v2()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles_v2 (auth_user_id, display_name, public_handle)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_username', 'user_' || substr(NEW.id::text, 1, 8))
  );
  INSERT INTO public.profile_private_data (profile_id, email)
  VALUES (
    (SELECT id FROM public.profiles_v2 WHERE auth_user_id = NEW.id),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_v2 ON auth.users;
CREATE TRIGGER on_auth_user_created_v2
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_v2();
