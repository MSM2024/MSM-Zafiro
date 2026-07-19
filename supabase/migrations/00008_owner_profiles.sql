-- ============================================================
-- ZAFIRO — Owner Profile: Identidad Soberana del Fundador
-- Migration 00008 (review before executing)
-- Frecuencia 369-777
-- ============================================================

-- Esta migración debe ejecutarse DESPUÉS de que Supabase Auth
-- tenga credenciales configuradas y el usuario con email
-- com8msm@gmail.com haya iniciado sesión al menos una vez.

-- ============================================================
-- TABLE: owner_profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS public.owner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'OWNER_SUPERADMIN',
  membership_tier TEXT NOT NULL DEFAULT 'LIFETIME_UNLIMITED',
  display_name TEXT NOT NULL DEFAULT 'Don Miguel',
  email TEXT NOT NULL UNIQUE,
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  mfa_verified_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT owner_profiles_user_id_unique UNIQUE (user_id),
  CONSTRAINT owner_profiles_valid_role CHECK (role IN ('OWNER_SUPERADMIN', 'ADMIN')),
  CONSTRAINT owner_profiles_valid_tier CHECK (membership_tier IN ('LIFETIME_UNLIMITED', 'VIP', 'STANDARD'))
);

-- Sync from auth.users (idempotent)
INSERT INTO public.owner_profiles (user_id, email, display_name, role, membership_tier)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Don Miguel'),
  'OWNER_SUPERADMIN',
  'LIFETIME_UNLIMITED'
FROM auth.users au
WHERE au.email = 'com8msm@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.owner_profiles op WHERE op.user_id = au.id
  );

-- ============================================================
-- TABLE: owner_audit_log
-- ============================================================

CREATE TABLE IF NOT EXISTS public.owner_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_owner_audit_log_owner_user_id ON public.owner_audit_log(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_owner_audit_log_event_type ON public.owner_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_owner_audit_log_created_at ON public.owner_audit_log(created_at);

-- ============================================================
-- TABLE: owner_sessions
-- ============================================================

CREATE TABLE IF NOT EXISTS public.owner_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id),
  session_token TEXT NOT NULL UNIQUE,
  mfa_verified BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_owner_sessions_token ON public.owner_sessions(session_token);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_audit_log ENABLE ROW LEVEL SECURITY;

-- Solo el owner puede leer su propio perfil
CREATE POLICY owner_profiles_select_policy ON public.owner_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Solo el owner puede actualizar su propio perfil (excepto role/tier)
CREATE POLICY owner_profiles_update_policy ON public.owner_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND NEW.role = OLD.role
    AND NEW.membership_tier = OLD.membership_tier
  );

-- Solo el owner puede leer su propio audit log
CREATE POLICY owner_audit_log_select_policy ON public.owner_audit_log
  FOR SELECT USING (auth.uid() = owner_user_id);

-- Sistema puede insertar audit log
CREATE POLICY owner_audit_log_insert_policy ON public.owner_audit_log
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_owner_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_owner_profiles_updated_at ON public.owner_profiles;
CREATE TRIGGER trg_owner_profiles_updated_at
  BEFORE UPDATE ON public.owner_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_owner_profiles_updated_at();

-- ============================================================
-- TRIGGER: audit OWNER_PROFILE_UPDATED
-- ============================================================

CREATE OR REPLACE FUNCTION public.audit_owner_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.owner_audit_log (owner_user_id, event_type, event_data)
  VALUES (
    NEW.user_id,
    'OWNER_PROFILE_UPDATED',
    jsonb_build_object(
      'changed_fields', (
        SELECT jsonb_object_agg(key, value)
        FROM jsonb_each(to_jsonb(OLD))
        WHERE to_jsonb(NEW) ->> key IS DISTINCT FROM to_jsonb(OLD) ->> key
      ),
      'timestamp', now()
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_owner_profile_audit ON public.owner_profiles;
CREATE TRIGGER trg_owner_profile_audit
  AFTER UPDATE ON public.owner_profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_owner_profile_update();

-- ============================================================
-- GRANTS
-- ============================================================

GRANT SELECT, UPDATE ON public.owner_profiles TO authenticated;
GRANT INSERT ON public.owner_audit_log TO authenticated;
GRANT SELECT ON public.owner_audit_log TO authenticated;

-- Solo service_role puede modificar role/tier
GRANT ALL ON public.owner_profiles TO service_role;
GRANT ALL ON public.owner_audit_log TO service_role;
