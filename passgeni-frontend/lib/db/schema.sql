-- =============================================================
-- PASSGENI — SUPABASE DATABASE SCHEMA
-- =============================================================
-- Run this in Supabase SQL Editor (supabase.com/dashboard)
-- under your project → SQL Editor → New query.
--
-- Tables:
--   customers      — one row per paying Paddle customer
--   api_keys       — keys issued per customer (up to 5)
--   usage_logs     — one row per API call (for audit + analytics)
--   usage_daily    — aggregated daily usage per key (fast lookup)
--   team_members   — invited seats under a Team customer
-- =============================================================

-- ─── EXTENSION ───────────────────────────────────────────────
-- gen_random_uuid() for primary keys
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── CUSTOMERS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paddle_customer_id     TEXT UNIQUE,
  paddle_subscription_id TEXT,
  email                  TEXT NOT NULL,
  name                   TEXT,
  plan                   TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'team'
  plan_status            TEXT NOT NULL DEFAULT 'active', -- 'active' | 'trialing' | 'past_due' | 'canceled'
  trial_end              TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast Paddle webhook lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_paddle_id ON customers (paddle_customer_id) WHERE paddle_customer_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email ON customers (email);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── API KEYS ─────────────────────────────────────────────────
-- Each customer can have up to 5 keys (prod, staging, dev, etc.)
CREATE TABLE IF NOT EXISTS api_keys (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  key_hash      TEXT UNIQUE NOT NULL,   -- SHA-256 hash of the raw key
  key_prefix    TEXT NOT NULL,          -- First 16 chars: pg_live_abc12345
  label         TEXT NOT NULL DEFAULT 'Default',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  last_used_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  rotated_at    TIMESTAMPTZ            -- when this key was rotated out
);

CREATE INDEX IF NOT EXISTS idx_api_keys_customer ON api_keys (customer_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys (key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys (is_active) WHERE is_active = true;

CREATE TRIGGER api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── USAGE DAILY ──────────────────────────────────────────────
-- Aggregated daily count per API key. Fast O(1) read for rate limiting.
-- Resets naturally because each day is a separate row.
CREATE TABLE IF NOT EXISTS usage_daily (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id      UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  call_count  INTEGER NOT NULL DEFAULT 0,
  UNIQUE (key_id, date)
);

CREATE INDEX IF NOT EXISTS idx_usage_daily_key_date ON usage_daily (key_id, date);

-- ─── USAGE LOGS ───────────────────────────────────────────────
-- Full audit log of every API call. Used for analytics in Phase 5.
-- Partitioned by month for performance at scale.
CREATE TABLE IF NOT EXISTS usage_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id        UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  customer_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  called_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash       TEXT,            -- hashed IP for privacy (not raw IP)
  profession    TEXT,
  compliance    TEXT,
  length        INTEGER,
  count         INTEGER,
  mode          TEXT,
  response_ms   INTEGER,         -- generation time in ms
  status        TEXT DEFAULT 'ok'
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_key ON usage_logs (key_id, called_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_customer ON usage_logs (customer_id, called_at DESC);

-- ─── TEAM MEMBERS ────────────────────────────────────────────
-- Seats under a Team plan. Owner = the Paddle customer.
CREATE TABLE IF NOT EXISTS team_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  name         TEXT,
  role         TEXT NOT NULL DEFAULT 'member',  -- 'owner' | 'member'
  status       TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'active' | 'removed'
  invited_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at  TIMESTAMPTZ,
  UNIQUE (customer_id, email)
);

CREATE INDEX IF NOT EXISTS idx_team_members_customer ON team_members (customer_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members (email);

-- ─── NEXTAUTH USERS ──────────────────────────────────────────
-- Lightweight identity table used by the custom Supabase adapter.
-- Separate from `customers` — a user exists as soon as they sign in once,
-- whether or not they have a paid customer record.
CREATE TABLE IF NOT EXISTS nextauth_users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nextauth_users_email ON nextauth_users (email);

-- ─── VERIFICATION TOKENS ─────────────────────────────────────
-- Short-lived magic-link tokens created by NextAuth EmailProvider.
-- Each token is deleted on first use (single-use).
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT        NOT NULL,
  token      TEXT        NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Index for fast expiry cleanup (optional cron)
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens (expires);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
-- Supabase RLS: server-side code uses the service_role key (bypasses RLS).
-- Client-side code (if any) would be restricted. We're server-only, so this
-- is a secondary safety layer.
ALTER TABLE customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys           ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_daily        ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE nextauth_users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Service role (our backend) bypasses RLS — no policies needed for server use.
-- If you add Supabase Auth in future, add per-user policies here.

-- ─── SEED: cleanup function for dev ──────────────────────────
-- Run this to wipe all data (dev only!)
-- SELECT truncate_all_tables();
CREATE OR REPLACE FUNCTION truncate_all_tables()
RETURNS void AS $$
BEGIN
  TRUNCATE usage_logs, usage_daily, api_keys, team_members, customers CASCADE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
