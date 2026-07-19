-- ZAFIRO Perfiles y Membresías Stripe — Migración 00010
-- MSM MY STORE LLC — Don Miguel Soria Martinez
-- Frecuencia 369-777
-- Crea: profiles, profile_roles, membership_plans, user_memberships, stripe_customers, stripe_subscriptions, membership_events

-- 1. PROFILES — Perfiles de usuario vinculados a auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  username TEXT UNIQUE,
  phone TEXT DEFAULT '',
  country TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('OWNER_SUPERADMIN','ADMIN','COMPLIANCE_REVIEWER','SUPPORT_AGENT','ENTREPRENEUR','USER')),
  account_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE','SUSPENDED','BANNED','PENDING_VERIFICATION')),
  language TEXT DEFAULT 'es',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_account_status ON profiles(account_status);

-- 2. PROFILE_ROLES — Roles secundarios (histórico)
CREATE TABLE IF NOT EXISTS profile_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(profile_id, role)
);

CREATE INDEX idx_profile_roles_profile_id ON profile_roles(profile_id);

-- 3. MEMBERSHIP_PLANS — Catálogo de planes (fuente única)
CREATE TABLE IF NOT EXISTS membership_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_annual NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'usd',
  stripe_price_id_monthly TEXT,
  stripe_price_id_annual TEXT,
  features JSONB DEFAULT '[]',
  pts_per_day INTEGER NOT NULL DEFAULT 100,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. USER_MEMBERSHIPS — Membresías activas de usuarios
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES membership_plans(id),
  status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN (
    'PENDING_PAYMENT', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED', 'LIFETIME'
  )),
  billing_interval TEXT NOT NULL DEFAULT 'month' CHECK (billing_interval IN ('month','annual','lifetime')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  activated_by_webhook_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, plan_id)
);

CREATE INDEX idx_user_memberships_profile_id ON user_memberships(profile_id);
CREATE INDEX idx_user_memberships_status ON user_memberships(status);
CREATE INDEX idx_user_memberships_current_period_end ON user_memberships(current_period_end);

-- 5. STRIPE_CUSTOMERS — Mapeo perfil → stripe_customer_id
CREATE TABLE IF NOT EXISTS stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  stripe_email TEXT,
  payment_method_last4 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id)
);

CREATE INDEX idx_stripe_customers_profile_id ON stripe_customers(profile_id);
CREATE INDEX idx_stripe_customers_stripe_customer_id ON stripe_customers(stripe_customer_id);

-- 6. STRIPE_SUBSCRIPTIONS — Registro de suscripciones Stripe
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES user_memberships(id) ON DELETE SET NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan_id TEXT NOT NULL REFERENCES membership_plans(id),
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stripe_subscriptions_profile_id ON stripe_subscriptions(profile_id);
CREATE INDEX idx_stripe_subscriptions_stripe_subscription_id ON stripe_subscriptions(stripe_subscription_id);
CREATE INDEX idx_stripe_subscriptions_status ON stripe_subscriptions(status);

-- 7. MEMBERSHIP_EVENTS — Auditoría de eventos de membresía
CREATE TABLE IF NOT EXISTS membership_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  source TEXT NOT NULL DEFAULT 'system' CHECK (source IN ('stripe_webhook','api','admin','frontend','system')),
  stripe_event_id TEXT,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_membership_events_profile_id ON membership_events(profile_id);
CREATE INDEX idx_membership_events_event_type ON membership_events(event_type);
CREATE INDEX idx_membership_events_idempotency_key ON membership_events(idempotency_key);
CREATE INDEX idx_membership_events_created_at ON membership_events(created_at);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_events ENABLE ROW LEVEL SECURITY;

-- Perfiles: usuario ve el suyo, admin ve todos
CREATE POLICY profiles_user_select ON profiles FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY profiles_user_update ON profiles FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY profiles_admin_insert ON profiles FOR INSERT WITH CHECK (is_admin());
CREATE POLICY profiles_admin_delete ON profiles FOR DELETE USING (is_admin());

-- Membresías: usuario ve la suya, admin ve todas
CREATE POLICY memberships_user_select ON user_memberships FOR SELECT USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR is_admin()
);
CREATE POLICY memberships_admin_all ON user_memberships FOR ALL USING (is_admin());

-- Eventos: solo lectura para el usuario, escritura desde webhook/api
CREATE POLICY events_user_select ON membership_events FOR SELECT USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR is_admin()
);
CREATE POLICY events_service_insert ON membership_events FOR INSERT WITH CHECK (
  current_setting('role') = 'service_role' OR is_admin()
);

-- Stripe: solo servidor/admin
CREATE POLICY stripe_admin_all ON stripe_customers FOR ALL USING (is_admin());
CREATE POLICY stripe_admin_all_subscriptions ON stripe_subscriptions FOR ALL USING (is_admin());

-- Helper function
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('OWNER_SUPERADMIN','ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed membership plans
INSERT INTO membership_plans (id, name, description, price_monthly, price_annual, currency, stripe_price_id_monthly, features, pts_per_day, sort_order) VALUES
  ('free', 'Gratis', 'Acceso básico a ZAFIRO', 0, NULL, 'usd', NULL, '["100 PTS/día", "Perfil público", "Explorar contenido"]', 100, 0),
  ('pro', 'Pro', 'Acceso completo a ZAFIRO', 9.99, 7.99, 'usd', 'price_pro_monthly', '["500 PTS/día", "Acceso VIP", "Círculos exclusivos", "Sin anuncios", "Insignias premium"]', 500, 1),
  ('cuba_plus', 'Cuba Plus', 'Acceso completo + beneficios Cuba', 14.99, 11.99, 'usd', 'price_cuba_plus_monthly', '["1000 PTS/día", "Todo de Pro", "Prioridad en remesas", "Tasas preferenciales", "Soporte prioritario"]', 1000, 2)
ON CONFLICT (id) DO NOTHING;
