-- LOS 150 SELLOS DE LOS SALMOS
-- Migración para el módulo de Sellos dentro de ZAFIRO
-- Basado en el último versículo de cada Salmo

-- Tabla principal de sellos
CREATE TABLE IF NOT EXISTS public.seals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  psalm_number INTEGER,
  verse_number TEXT,
  reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  translation TEXT DEFAULT 'RVR1960',
  theme TEXT,
  reflection TEXT,
  declaration TEXT,
  prayer TEXT,
  meditation_question TEXT,
  daily_action TEXT,
  audio_url TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Progreso del usuario por sello
CREATE TABLE IF NOT EXISTS public.user_seal_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seal_id UUID NOT NULL REFERENCES public.seals(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'reading', 'completed')),
  opened_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  reading_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, seal_id)
);

-- Favoritos
CREATE TABLE IF NOT EXISTS public.seal_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seal_id UUID NOT NULL REFERENCES public.seals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, seal_id)
);

-- Diario espiritual (notas privadas)
CREATE TABLE IF NOT EXISTS public.seal_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seal_id UUID NOT NULL REFERENCES public.seals(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Comentarios comunitarios
CREATE TABLE IF NOT EXISTS public.seal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seal_id UUID NOT NULL REFERENCES public.seals(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.seal_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'reported')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reacciones
CREATE TABLE IF NOT EXISTS public.seal_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seal_id UUID NOT NULL REFERENCES public.seals(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL CHECK (reaction IN ('faith', 'peace', 'wisdom', 'gratitude', 'fire')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, seal_id, reaction)
);

-- Compartidos
CREATE TABLE IF NOT EXISTS public.seal_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seal_id UUID NOT NULL REFERENCES public.seals(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'telegram', 'facebook', 'copy_link')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Planes de lectura
CREATE TABLE IF NOT EXISTS public.reading_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('daily_150', 'weekly', 'random')),
  started_at TIMESTAMPTZ DEFAULT now(),
  current_seal INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, plan_type)
);

-- Rachas
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_seals_number ON public.seals(number);
CREATE INDEX IF NOT EXISTS idx_seals_status ON public.seals(status);
CREATE INDEX IF NOT EXISTS idx_seals_theme ON public.seals(theme);
CREATE INDEX IF NOT EXISTS idx_user_seal_progress_user ON public.user_seal_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_seal_favorites_user ON public.seal_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_seal_journal_user ON public.seal_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_seal_comments_seal ON public.seal_comments(seal_id);
CREATE INDEX IF NOT EXISTS idx_seal_reactions_seal ON public.seal_reactions(seal_id);

-- RLS
ALTER TABLE public.seals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_seal_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seal_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seal_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seal_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seal_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Sellos: todos pueden leer publicados, solo admin edita
CREATE POLICY seals_read_published ON public.seals FOR SELECT USING (status = 'published');
CREATE POLICY seals_admin_all ON public.seals USING (auth.role() = 'service_role');

-- Progreso: solo el usuario dueño
CREATE POLICY user_seal_progress_own ON public.user_seal_progress FOR ALL USING (auth.uid() = user_id);

-- Favoritos: solo el usuario dueño
CREATE POLICY seal_favorites_own ON public.seal_favorites FOR ALL USING (auth.uid() = user_id);

-- Diario: solo el usuario dueño
CREATE POLICY seal_journal_own ON public.seal_journal_entries FOR ALL USING (auth.uid() = user_id);

-- Comentarios: todos leen publicados, usuario crea/edita propios
CREATE POLICY seal_comments_read ON public.seal_comments FOR SELECT USING (status = 'published');
CREATE POLICY seal_comments_own ON public.seal_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY seal_comments_update_own ON public.seal_comments FOR UPDATE USING (auth.uid() = user_id);

-- Reacciones: usuario gestiona propias
CREATE POLICY seal_reactions_own ON public.seal_reactions FOR ALL USING (auth.uid() = user_id);

-- Compartidos: usuario ve propios, todos insertan
CREATE POLICY seal_shares_insert ON public.seal_shares FOR INSERT WITH CHECK (true);
CREATE POLICY seal_shares_own ON public.seal_shares FOR SELECT USING (auth.uid() = user_id);

-- Planes: usuario dueño
CREATE POLICY reading_plans_own ON public.reading_plans FOR ALL USING (auth.uid() = user_id);

-- Rachas: usuario dueño
CREATE POLICY user_streaks_own ON public.user_streaks FOR ALL USING (auth.uid() = user_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_seals_updated_at BEFORE UPDATE ON public.seals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_seal_journal_updated_at BEFORE UPDATE ON public.seal_journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_seal_comments_updated_at BEFORE UPDATE ON public.seal_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
