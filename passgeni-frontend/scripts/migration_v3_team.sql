-- Week 5: Team Features — add org policy column to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS team_policy_standard TEXT NULL;
