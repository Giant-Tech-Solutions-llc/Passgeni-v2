-- W9-3: Usage events table for anomaly detection and audit logging
-- Run against Supabase SQL Editor (staging first, then production)

CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  ip_hash TEXT NULL,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS usage_events_user_id_idx ON usage_events(user_id);
CREATE INDEX IF NOT EXISTS usage_events_event_type_idx ON usage_events(event_type);
CREATE INDEX IF NOT EXISTS usage_events_created_at_idx ON usage_events(created_at);
CREATE INDEX IF NOT EXISTS usage_events_flagged_idx ON usage_events(flagged) WHERE flagged = true;

ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write usage events
CREATE POLICY "service_role_all_usage_events"
ON usage_events FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
