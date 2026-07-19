-- ============================================================
-- MIGRATION 00011 — BIBLIOTECA ZAFIRO
-- Fecha: 2026-07-18
-- Descripción: Tablas para libros, capítulos, marcadores,
--              notas, progreso de lectura y perfil de autor
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. LIBROS
-- ============================================================
CREATE TABLE IF NOT EXISTS biblioteca_libros (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES identity_profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  subtitle        TEXT,
  author_name     TEXT NOT NULL,
  description     TEXT,
  biography       TEXT,
  cover_image_url TEXT,
  cover_color     TEXT DEFAULT '#00D9FF',
  isbn            TEXT,
  format          TEXT NOT NULL DEFAULT 'txt' CHECK (format IN ('txt','md','pdf','docx','epub')),
  language        TEXT DEFAULT 'es',
  status          TEXT NOT NULL DEFAULT 'SUBIDO' CHECK (status IN ('SUBIDO','VALIDADO','ESTRUCTURADO','EN_REVISION','APROBADO','PUBLICADO','ARCHIVADO')),
  chapter_count   INTEGER DEFAULT 0,
  copyright       TEXT,
  rights_reserved BOOLEAN DEFAULT TRUE,
  published_at    TIMESTAMPTZ,
  hash_sha256     TEXT,
  word_count      INTEGER DEFAULT 0,
  tags            TEXT[] DEFAULT '{}',
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_biblioteca_libros_profile ON biblioteca_libros(profile_id);
CREATE INDEX idx_biblioteca_libros_status ON biblioteca_libros(status);
CREATE INDEX idx_biblioteca_libros_published ON biblioteca_libros(published_at) WHERE status = 'PUBLICADO';

-- ============================================================
-- 2. CAPÍTULOS
-- ============================================================
CREATE TABLE IF NOT EXISTS biblioteca_capitulos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id       UUID NOT NULL REFERENCES biblioteca_libros(id) ON DELETE CASCADE,
  index         INTEGER NOT NULL,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  word_count    INTEGER DEFAULT 0,
  hash_sha256   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(book_id, index)
);

CREATE INDEX idx_biblioteca_capitulos_book ON biblioteca_capitulos(book_id);

-- ============================================================
-- 3. MARCADORES
-- ============================================================
CREATE TABLE IF NOT EXISTS biblioteca_marcadores (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    UUID NOT NULL REFERENCES identity_profiles(id) ON DELETE CASCADE,
  book_id       UUID NOT NULL REFERENCES biblioteca_libros(id) ON DELETE CASCADE,
  chapter_id    UUID NOT NULL REFERENCES biblioteca_capitulos(id) ON DELETE CASCADE,
  chapter_index INTEGER NOT NULL,
  label         TEXT NOT NULL DEFAULT 'Marcador',
  location      INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_biblioteca_marcadores_profile ON biblioteca_marcadores(profile_id, book_id);

-- ============================================================
-- 4. NOTAS DE LECTURA
-- ============================================================
CREATE TABLE IF NOT EXISTS biblioteca_notas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    UUID NOT NULL REFERENCES identity_profiles(id) ON DELETE CASCADE,
  book_id       UUID NOT NULL REFERENCES biblioteca_libros(id) ON DELETE CASCADE,
  chapter_id    UUID NOT NULL REFERENCES biblioteca_capitulos(id) ON DELETE CASCADE,
  chapter_index INTEGER NOT NULL,
  text          TEXT NOT NULL,
  location      INTEGER DEFAULT 0,
  color         TEXT DEFAULT '#FFD700',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_biblioteca_notas_profile ON biblioteca_notas(profile_id, book_id);

-- ============================================================
-- 5. PROGRESO DE LECTURA
-- ============================================================
CREATE TABLE IF NOT EXISTS biblioteca_progreso (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id          UUID NOT NULL REFERENCES identity_profiles(id) ON DELETE CASCADE,
  book_id             UUID NOT NULL REFERENCES biblioteca_libros(id) ON DELETE CASCADE,
  current_chapter_id  UUID REFERENCES biblioteca_capitulos(id),
  current_chapter_index INTEGER DEFAULT 0,
  scroll_position     INTEGER DEFAULT 0,
  completed_chapters  TEXT[] DEFAULT '{}',
  total_reading_time_ms BIGINT DEFAULT 0,
  last_read_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, book_id)
);

CREATE INDEX idx_biblioteca_progreso_profile ON biblioteca_progreso(profile_id);

-- ============================================================
-- 6. PERFIL DE AUTOR
-- ============================================================
ALTER TABLE identity_profiles ADD COLUMN IF NOT EXISTS author_bio TEXT;
ALTER TABLE identity_profiles ADD COLUMN IF NOT EXISTS author_photo_url TEXT;
ALTER TABLE identity_profiles ADD COLUMN IF NOT EXISTS author_website TEXT;
ALTER TABLE identity_profiles ADD COLUMN IF NOT EXISTS author_social_links JSONB DEFAULT '{}';

-- ============================================================
-- 7. VISTA: LIBROS PÚBLICOS
-- ============================================================
CREATE OR REPLACE VIEW biblioteca_publicaciones AS
SELECT
  l.id,
  l.title,
  l.subtitle,
  l.author_name,
  l.description,
  l.cover_image_url,
  l.cover_color,
  l.isbn,
  l.chapter_count,
  l.copyright,
  l.published_at,
  l.word_count,
  l.tags,
  p.public_handle AS author_handle,
  p.display_name  AS author_display_name
FROM biblioteca_libros l
JOIN identity_profiles p ON l.profile_id = p.id
WHERE l.status = 'PUBLICADO'
ORDER BY l.published_at DESC;

-- ============================================================
-- 8. RLS (preparado, requiere Supabase Auth activo)
-- ============================================================
-- ALTER TABLE biblioteca_libros ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE biblioteca_capitulos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE biblioteca_marcadores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE biblioteca_notas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE biblioteca_progreso ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY libros_owner ON biblioteca_libros
--   FOR ALL USING (profile_id = auth.uid());
--
-- CREATE POLICY libros_public_read ON biblioteca_libros
--   FOR SELECT USING (status = 'PUBLICADO');
--
-- CREATE POLICY capitulos_read ON biblioteca_capitulos
--   FOR SELECT USING (
--     book_id IN (SELECT id FROM biblioteca_libros WHERE status = 'PUBLICADO' OR profile_id = auth.uid())
--   );
