-- =============================================================
-- PASSGENI — FULL BOOTSTRAP SCHEMA
-- =============================================================
-- Run this once in Supabase SQL Editor for a fresh database.
-- It is idempotent (all CREATE ... IF NOT EXISTS / OR REPLACE).
--
-- Consolidates: schema.sql + migrations v2–v5 + functions.sql
-- Last updated: April 2026
-- =============================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── TRIGGER HELPER ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- CORE TABLES
-- =============================================================

-- ─── NEXTAUTH USERS ──────────────────────────────────────────
-- Identity table. One row per sign-in email.
-- Separate from customers — a user exists as soon as they
-- sign in once, whether or not they have a paid subscription.
CREATE TABLE IF NOT EXISTS nextauth_users (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT        UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nextauth_users_email ON nextauth_users (email);

ALTER TABLE nextauth_users ENABLE ROW LEVEL SECURITY;

-- ─── VERIFICATION TOKENS ─────────────────────────────────────
-- Short-lived magic-link tokens (NextAuth EmailProvider).
-- Each token is deleted on first use (single-use by design).
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT        NOT NULL,
  token      TEXT        NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens (expires);

ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- ─── CUSTOMERS ───────────────────────────────────────────────
-- One row per paying/trialing Paddle customer (billing identity).
-- Linked to nextauth_users via email.
CREATE TABLE IF NOT EXISTS customers (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  paddle_customer_id      TEXT        UNIQUE,
  paddle_subscription_id  TEXT,
  email                   TEXT        NOT NULL,
  name                    TEXT,
  plan                    TEXT        NOT NULL DEFAULT 'free',    -- 'free' | 'assurance' | 'team'
  plan_status             TEXT        NOT NULL DEFAULT 'active',  -- 'active' | 'trialing' | 'past_due' | 'canceled'
  trial_end               TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  team_policy_standard    TEXT        NULL,                       -- org-wide compliance policy (v3)
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_paddle_id ON customers (paddle_customer_id) WHERE paddle_customer_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email     ON customers (email);

CREATE OR REPLACE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- ─── API KEYS (billing tier) ──────────────────────────────────
-- Keys issued per Paddle customer for programmatic API access.
-- Up to 5 active keys per customer.
CREATE TABLE IF NOT EXISTS api_keys (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  UUID        NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  key_hash     TEXT        UNIQUE NOT NULL,   -- SHA-256 of raw key
  key_prefix   TEXT        NOT NULL,          -- first 16 chars: pg_live_abc12345
  label        TEXT        NOT NULL DEFAULT 'Default',
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  rotated_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_api_keys_customer ON api_keys (customer_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash     ON api_keys (key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active   ON api_keys (is_active) WHERE is_active = true;

CREATE OR REPLACE TRIGGER api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- ─── USAGE DAILY ──────────────────────────────────────────────
-- Aggregated daily call count per API key.
-- Fast O(1) read for rate-limit enforcement.
CREATE TABLE IF NOT EXISTS usage_daily (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id     UUID    NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  date       DATE    NOT NULL DEFAULT CURRENT_DATE,
  call_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (key_id, date)
);

CREATE INDEX IF NOT EXISTS idx_usage_daily_key_date ON usage_daily (key_id, date);

ALTER TABLE usage_daily ENABLE ROW LEVEL SECURITY;

-- ─── USAGE LOGS ───────────────────────────────────────────────
-- Full audit log of every billing-tier API call.
CREATE TABLE IF NOT EXISTS usage_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id      UUID        NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  customer_id UUID        NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  called_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash     TEXT,
  profession  TEXT,
  compliance  TEXT,
  length      INTEGER,
  count       INTEGER,
  mode        TEXT,
  response_ms INTEGER,
  status      TEXT DEFAULT 'ok'
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_key      ON usage_logs (key_id,      called_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_customer ON usage_logs (customer_id, called_at DESC);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- ─── TEAM MEMBERS ────────────────────────────────────────────
-- Invited seats under a Team-plan customer.
CREATE TABLE IF NOT EXISTS team_members (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID        NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  name        TEXT,
  role        TEXT        NOT NULL DEFAULT 'member',   -- 'owner' | 'member'
  status      TEXT        NOT NULL DEFAULT 'pending',  -- 'pending' | 'active' | 'removed'
  invited_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  UNIQUE (customer_id, email)
);

CREATE INDEX IF NOT EXISTS idx_team_members_customer ON team_members (customer_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email    ON team_members (email);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- V2 — CERTIFICATE ENGINE
-- =============================================================

CREATE TABLE IF NOT EXISTS certificates (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES nextauth_users(id) ON DELETE CASCADE,
  email               TEXT        NOT NULL,
  compliance_standard TEXT        NOT NULL,   -- 'nist' | 'hipaa' | 'pci' | 'soc2' | 'iso' | 'fips'
  generation_params   JSONB       NOT NULL,
  entropy_bits        INTEGER     NOT NULL,
  char_pool_size      INTEGER     NOT NULL,
  standards_met       TEXT[]      NOT NULL DEFAULT '{}',
  jwt_token           TEXT        NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
  is_revoked          BOOLEAN     NOT NULL DEFAULT FALSE,
  revoked_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id  ON certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_created  ON certificates (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_standard ON certificates (compliance_standard);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "cert_public_read"   ON certificates FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "cert_owner_insert"  ON certificates FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "cert_owner_update"  ON certificates FOR UPDATE USING (true);

-- ─── CERT VIEWS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cert_views (
  id             BIGSERIAL   PRIMARY KEY,
  cert_id        UUID        NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  viewed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  viewer_ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_cert_views_cert_id ON cert_views (cert_id);

ALTER TABLE cert_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cert_views_insert" ON cert_views FOR INSERT WITH CHECK (true);

-- =============================================================
-- V4 — USER / DEVELOPER API KEYS
-- =============================================================
-- Keys keyed by nextauth_users.id (identity), not customers.id (billing).

CREATE TABLE IF NOT EXISTS user_api_keys (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES nextauth_users(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  key_hash     TEXT        NOT NULL UNIQUE,
  key_prefix   TEXT        NOT NULL,
  scopes       TEXT[]      NOT NULL DEFAULT ARRAY['generate','certify','read'],
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active    BOOLEAN     NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_user_api_keys_user   ON user_api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_hash   ON user_api_keys (key_hash);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_active ON user_api_keys (is_active) WHERE is_active = true;

ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- V5 — USAGE EVENTS (anomaly detection / audit trail)
-- =============================================================

CREATE TABLE IF NOT EXISTS usage_events (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NULL REFERENCES nextauth_users(id) ON DELETE SET NULL,
  event_type TEXT        NOT NULL,
  metadata   JSONB       NOT NULL DEFAULT '{}',
  ip_hash    TEXT,
  flagged    BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_events_user_id    ON usage_events (user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_type ON usage_events (event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_flagged    ON usage_events (flagged) WHERE flagged = true;

ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "service_role_all_usage_events" ON usage_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================
-- RPC FUNCTIONS
-- =============================================================

-- ─── ATOMIC USAGE INCREMENT ───────────────────────────────────
CREATE OR REPLACE FUNCTION increment_usage(p_key_id UUID, p_date DATE)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO usage_daily (key_id, date, call_count)
  VALUES (p_key_id, p_date, 1)
  ON CONFLICT (key_id, date) DO UPDATE
    SET call_count = usage_daily.call_count + 1
  RETURNING call_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── MONTHLY CERT COUNT ───────────────────────────────────────
CREATE OR REPLACE FUNCTION get_monthly_cert_count(p_user_id UUID)
RETURNS INTEGER LANGUAGE SQL STABLE AS $$
  SELECT COUNT(*)::INTEGER
  FROM certificates
  WHERE user_id    = p_user_id
    AND created_at >= date_trunc('month', NOW())
    AND is_revoked  = FALSE;
$$;

-- ─── CUSTOMER DASHBOARD SUMMARY ──────────────────────────────
CREATE OR REPLACE FUNCTION get_customer_summary(p_customer_id UUID)
RETURNS JSON AS $$
DECLARE
  today  DATE := CURRENT_DATE;
  ago_7  DATE := CURRENT_DATE - INTERVAL '7 days';
  result JSON;
BEGIN
  SELECT json_build_object(
    'customer', row_to_json(c.*),
    'keys', (
      SELECT json_agg(k.*)
      FROM api_keys k
      WHERE k.customer_id = p_customer_id AND k.is_active = true
    ),
    'usage_today', (
      SELECT COALESCE(SUM(ud.call_count), 0)
      FROM usage_daily ud
      JOIN api_keys ak ON ak.id = ud.key_id
      WHERE ak.customer_id = p_customer_id AND ud.date = today
    ),
    'usage_week', (
      SELECT json_agg(daily ORDER BY daily.date)
      FROM (
        SELECT ud.date, SUM(ud.call_count) AS total
        FROM usage_daily ud
        JOIN api_keys ak ON ak.id = ud.key_id
        WHERE ak.customer_id = p_customer_id AND ud.date >= ago_7
        GROUP BY ud.date
      ) daily
    ),
    'team_members', (
      SELECT json_agg(tm.*)
      FROM team_members tm
      WHERE tm.customer_id = p_customer_id
    )
  )
  INTO result
  FROM customers c
  WHERE c.id = p_customer_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- DEV UTILITY
-- =============================================================
-- Wipe all data (dev only — never run in production!)
-- SELECT truncate_all_tables();
CREATE OR REPLACE FUNCTION truncate_all_tables()
RETURNS void AS $$
BEGIN
  TRUNCATE usage_events, usage_logs, usage_daily,
           user_api_keys, api_keys,
           cert_views, certificates,
           team_members, customers,
           nextauth_users
  CASCADE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
