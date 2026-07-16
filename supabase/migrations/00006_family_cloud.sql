-- NUBE FAMILIAR — Encuentro Soria Martínez 2026
-- Frecuencia 369: Familia, Raíces, Legado

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Árboles familiares
CREATE TABLE family_trees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  root_member_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Miembros de la familia
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  maiden_name TEXT,
  birth_date DATE,
  death_date DATE,
  birth_place TEXT,
  photo_url TEXT,
  bio TEXT,
  occupation TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  is_alive BOOLEAN DEFAULT true,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('confirmed', 'pending', 'unverified')),
  privacy_level TEXT DEFAULT 'family' CHECK (privacy_level IN ('public', 'family', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Relaciones familiares
CREATE TABLE family_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  member_1_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  member_2_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'spouse', 'parent', 'child', 'sibling', 'grandparent', 'grandchild',
    'uncle_aunt', 'nephew_niece', 'cousin', 'great_grandparent', 'great_grandchild'
  )),
  start_date DATE,
  end_date DATE,
  is_biological BOOLEAN DEFAULT true,
  verification_status TEXT DEFAULT 'pending',
  source_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos familiares
CREATE TABLE family_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'birth', 'marriage', 'death', 'graduation', 'moving', 'family_gathering', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  location TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fotos familiares
CREATE TABLE family_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  date_taken DATE,
  location TEXT,
  uploaded_by TEXT,
  category TEXT,
  is_restored BOOLEAN DEFAULT false,
  original_url TEXT,
  privacy_level TEXT DEFAULT 'family',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE family_photo_people (
  photo_id UUID REFERENCES family_photos(id) ON DELETE CASCADE,
  member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  PRIMARY KEY (photo_id, member_id)
);

-- Historias familiares
CREATE TABLE family_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  audio_url TEXT,
  video_url TEXT,
  author_id UUID REFERENCES family_members(id),
  date_written DATE,
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  privacy_level TEXT DEFAULT 'family',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos, audio y video
CREATE TABLE family_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT,
  file_url TEXT,
  description TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE family_audio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  title TEXT,
  speaker_id UUID REFERENCES family_members(id),
  file_url TEXT,
  duration_seconds INTEGER,
  transcript TEXT,
  date_recorded DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE family_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES family_trees(id) ON DELETE CASCADE,
  title TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  date_recorded DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reuniones familiares
CREATE TABLE reunions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  lema TEXT,
  frequency_symbol TEXT DEFAULT '369',
  privacy TEXT DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reunion_guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE,
  member_id UUID REFERENCES family_members(id),
  full_name TEXT NOT NULL,
  branch TEXT,
  phone TEXT,
  country TEXT,
  companions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'not_attending')),
  transport TEXT,
  contribution DECIMAL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reunion_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  activity TEXT NOT NULL,
  description TEXT,
  responsible TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reunion_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'video', 'photo')),
  content TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reunion_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES reunion_guests(id),
  contribution_type TEXT,
  amount DECIMAL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reunion_id UUID REFERENCES reunions(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  recipient_name TEXT,
  sent_via TEXT,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE family_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  changed_by TEXT,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE family_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reunions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reunion_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reunion_messages ENABLE ROW LEVEL SECURITY;

-- Seed: Reunion 2026
INSERT INTO reunions (title, description, event_date, location, lema)
VALUES (
  'Gran Encuentro Familiar Soria Martinez',
  'Un dia inolvidable para honrar a nuestros abuelos, reunir a nuestros descendientes y preservar nuestra historia',
  '2026-08-16',
  'Finca Las Siete Vueltas, Mayari Arriba, Segundo Frente, Santiago de Cuba',
  'Honramos nuestras raices, celebramos nuestra familia y construimos el legado de las proximas generaciones'
);
