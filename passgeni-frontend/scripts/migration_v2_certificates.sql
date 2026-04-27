-- PassGeni V2 — Certificate Engine Migration
-- Run this in your Supabase SQL editor (passgeni-staging project first)
-- Then repeat on production Supabase project before merging to main

-- ── certificates ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES nextauth_users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  compliance_standard TEXT NOT NULL,               -- 'nist' | 'hipaa' | 'pci' | 'soc2' | 'iso' | 'fips'
  generation_params   JSONB NOT NULL,              -- { length, has_upper, has_lower, has_numbers, has_special, entropy_source }
  entropy_bits    INTEGER NOT NULL,
  char_pool_size  INTEGER NOT NULL,
  standards_met   TEXT[] NOT NULL DEFAULT '{}',   -- all standards this cert satisfies
  jwt_token       TEXT NOT NULL,                   -- ES256-signed certificate JWT
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
  is_revoked      BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id  ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_created  ON certificates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_standard ON certificates(compliance_standard);

-- ── cert_views ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cert_views (
  id          BIGSERIAL PRIMARY KEY,
  cert_id     UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  viewer_ip_hash TEXT                               -- SHA-256 of viewer IP, no PII
);

CREATE INDEX IF NOT EXISTS idx_cert_views_cert_id ON cert_views(cert_id);

-- ── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cert_views   ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically — these policies are for anon/authenticated roles
-- Certificates: owner can read/revoke, public can read (for /cert/[id])
CREATE POLICY "cert_public_read" ON certificates
  FOR SELECT USING (true);

CREATE POLICY "cert_owner_insert" ON certificates
  FOR INSERT WITH CHECK (true);    -- enforced at API layer

CREATE POLICY "cert_owner_update" ON certificates
  FOR UPDATE USING (true);         -- enforced at API layer (revoke only)

-- cert_views: insert-only from API, no direct user access
CREATE POLICY "cert_views_insert" ON cert_views
  FOR INSERT WITH CHECK (true);

-- ── monthly cert count helper ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_monthly_cert_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL STABLE AS $$
  SELECT COUNT(*)::INTEGER
  FROM certificates
  WHERE user_id = p_user_id
    AND created_at >= date_trunc('month', NOW())
    AND is_revoked = FALSE;
$$;
