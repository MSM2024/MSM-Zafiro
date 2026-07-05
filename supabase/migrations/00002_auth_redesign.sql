-- MSM Zafiro - Auth redesign: identity decoupled from phone, 2FA, device fingerprint, trust score

-- verified_phones: separate table so identity survives phone changes
CREATE TABLE core.verified_phones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  phone_verified_at TIMESTAMPTZ DEFAULT now(),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(phone)
);
CREATE INDEX idx_verified_phones_user ON core.verified_phones(user_id);
CREATE INDEX idx_verified_phones_phone ON core.verified_phones(phone);

-- add trust_score and totp_secret to users
ALTER TABLE core.users ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 50;
ALTER TABLE core.users ADD COLUMN IF NOT EXISTS totp_secret TEXT;
ALTER TABLE core.users ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN DEFAULT false;
ALTER TABLE core.users ADD COLUMN IF NOT EXISTS recovery_email TEXT;
ALTER TABLE core.users ADD COLUMN IF NOT EXISTS device_fingerprint_hash TEXT;

-- backup_codes for 2FA recovery
CREATE TABLE core.backup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_backup_codes_user ON core.backup_codes(user_id);

-- device fingerprints for anti-fraud
CREATE TABLE core.device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint_hash TEXT NOT NULL,
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
  trusted BOOLEAN DEFAULT false,
  UNIQUE(fingerprint_hash)
);
CREATE INDEX idx_device_fp_hash ON core.device_fingerprints(fingerprint_hash);

-- otp_codes for WhatsApp verification
CREATE TABLE core.otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('register', 'login', 'recovery', 'change_phone')),
  attempts INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_otp_phone ON core.otp_codes(phone, purpose, used);
