-- TASAS DE CAMBIO CUBA — Sincronizacion Nacional
-- Frecuencias simbolicas: 369, 777

CREATE TABLE exchange_rate_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  base_currency TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  rate_type TEXT CHECK (rate_type IN ('BUY','SELL','REFERENCE','MSM_BUY','MSM_SELL')),
  rate NUMERIC NOT NULL,
  payment_method TEXT,
  observed_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  source_url TEXT,
  approved_by UUID,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','EXPIRED','REJECTED')),
  symbolic_labels JSONB DEFAULT '["369","777"]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rates_currency ON exchange_rate_snapshots(base_currency, quote_currency, observed_at DESC);
CREATE INDEX idx_rates_status ON exchange_rate_snapshots(status);

ALTER TABLE exchange_rate_snapshots ENABLE ROW LEVEL SECURITY;

-- Seed: referencia 16 Julio 2026 (elTOQUE + BCC)
INSERT INTO exchange_rate_snapshots (source, base_currency, quote_currency, rate_type, rate, observed_at, source_url, status) VALUES
  ('elTOQUE', 'USD', 'CUP', 'REFERENCE', 660, '2026-07-16T17:00:00Z', 'https://eltoque.com/tasas-de-cambio-cuba', 'APPROVED'),
  ('elTOQUE', 'EUR', 'CUP', 'REFERENCE', 760, '2026-07-16T17:00:00Z', 'https://eltoque.com/tasas-de-cambio-cuba', 'APPROVED'),
  ('BCC', 'USD', 'CUP', 'REFERENCE', 592, '2026-07-10T00:00:00Z', 'https://www.bc.gob.cu/tasas-de-cambio', 'APPROVED'),
  ('CADECA', 'USD', 'CUP', 'BUY', 589, '2026-07-16T17:00:00Z', NULL, 'APPROVED'),
  ('CADECA', 'USD', 'CUP', 'SELL', 608, '2026-07-16T17:00:00Z', NULL, 'APPROVED'),
  ('CADECA', 'EUR', 'CUP', 'BUY', 672, '2026-07-16T17:00:00Z', NULL, 'APPROVED'),
  ('CADECA', 'EUR', 'CUP', 'SELL', 696, '2026-07-16T17:00:00Z', NULL, 'APPROVED');
