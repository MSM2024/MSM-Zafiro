-- ============================================================
-- ZAFIRO — Owner Device Sync
-- Migration 00009 (review before executing)
-- Frecuencia simbólica 369-777
-- ============================================================

-- ============================================================
-- TABLE: owner_devices
-- ============================================================

CREATE TABLE IF NOT EXISTS public.owner_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  platform TEXT,
  browser TEXT,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'TRUSTED', 'REVOKED', 'BLOCKED')),
  symbolic_seals JSONB DEFAULT '["369","777"]'::jsonb,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_user_id, device_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_owner_devices_owner ON public.owner_devices(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_owner_devices_status ON public.owner_devices(status);

-- ============================================================
-- TABLE: device_sync_events
-- ============================================================

CREATE TABLE IF NOT EXISTS public.device_sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES public.owner_devices(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_sync_events_device ON public.device_sync_events(device_id);
CREATE INDEX IF NOT EXISTS idx_device_sync_events_type ON public.device_sync_events(event_type);

-- ============================================================
-- TABLE: owner_sync_preferences
-- ============================================================

CREATE TABLE IF NOT EXISTS public.owner_sync_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  sync_eliana BOOLEAN NOT NULL DEFAULT true,
  sync_knowledge BOOLEAN NOT NULL DEFAULT true,
  sync_projects BOOLEAN NOT NULL DEFAULT true,
  sync_notifications BOOLEAN NOT NULL DEFAULT true,
  sync_interval_minutes INTEGER NOT NULL DEFAULT 15,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.owner_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_sync_preferences ENABLE ROW LEVEL SECURITY;

-- Owner solo ve sus propios dispositivos
CREATE POLICY owner_devices_select_policy ON public.owner_devices
  FOR SELECT USING (auth.uid() = owner_user_id);

-- Owner puede registrar/actualizar sus dispositivos
CREATE POLICY owner_devices_insert_policy ON public.owner_devices
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY owner_devices_update_policy ON public.owner_devices
  FOR UPDATE USING (auth.uid() = owner_user_id);

-- Owner ve eventos de sus dispositivos
CREATE POLICY device_sync_events_select_policy ON public.device_sync_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.owner_devices od WHERE od.id = device_id AND od.owner_user_id = auth.uid())
  );

CREATE POLICY device_sync_events_insert_policy ON public.device_sync_events
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.owner_devices od WHERE od.id = device_id AND od.owner_user_id = auth.uid())
  );

-- Owner sync preferences
CREATE POLICY owner_sync_preferences_select_policy ON public.owner_sync_preferences
  FOR SELECT USING (auth.uid() = owner_user_id);

CREATE POLICY owner_sync_preferences_insert_policy ON public.owner_sync_preferences
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY owner_sync_preferences_update_policy ON public.owner_sync_preferences
  FOR UPDATE USING (auth.uid() = owner_user_id);

-- ============================================================
-- GRANTS
-- ============================================================

GRANT SELECT, INSERT, UPDATE ON public.owner_devices TO authenticated;
GRANT SELECT, INSERT ON public.device_sync_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.owner_sync_preferences TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
