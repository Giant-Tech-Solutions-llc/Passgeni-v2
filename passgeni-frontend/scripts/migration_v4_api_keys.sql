-- =============================================================
-- PASSGENI — MIGRATION V4: USER API KEYS
-- =============================================================
-- Run in Supabase SQL Editor before deploying Week 7 code.
--
-- NOTE: The existing `api_keys` table is the billing-tier key
-- table (customer_id → customers). This new table is separate:
-- user_api_keys (user_id → nextauth_users) for the developer API.
-- =============================================================

CREATE TABLE IF NOT EXISTS user_api_keys (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES nextauth_users(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  key_hash     TEXT        NOT NULL UNIQUE,
  key_prefix   TEXT        NOT NULL,
  scopes       TEXT[]      NOT NULL DEFAULT ARRAY['generate','certify','read'],
  last_used_at TIMESTAMPTZ NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active    BOOLEAN     NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_user_api_keys_user   ON user_api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_hash   ON user_api_keys (key_hash);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_active ON user_api_keys (is_active) WHERE is_active = true;

ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
