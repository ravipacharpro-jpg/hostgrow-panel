CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  created_by_user uuid NOT NULL,
  created_by_panel uuid NOT NULL,
  creator_role text NOT NULL,
  target_role text NOT NULL,
  panel_scope uuid NULL,
  usage_limit int NOT NULL DEFAULT 100,
  usage_count int NOT NULL DEFAULT 0,
  expires_at timestamptz NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  disabled boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS referral_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  referred_user uuid NULL,
  panel_id uuid NULL,
  event_type text NOT NULL,
  amount_cents int NOT NULL DEFAULT 0,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
