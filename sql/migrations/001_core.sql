CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_panel_id uuid NULL REFERENCES panels(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  theme_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL REFERENCES panels(id) ON DELETE CASCADE,
  name text,
  username text UNIQUE,
  firebase_uid text UNIQUE,
  referred_code_id uuid NULL,
  role text NOT NULL, -- 'Main'|'Owner'|'Admin'|'Reseller'
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(lower(username));

CREATE TABLE IF NOT EXISTS panel_features (
  panel_id uuid NOT NULL REFERENCES panels(id) ON DELETE CASCADE,
  key text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  PRIMARY KEY(panel_id, key)
);

CREATE TABLE IF NOT EXISTS panel_wallets (
  panel_id uuid PRIMARY KEY REFERENCES panels(id) ON DELETE CASCADE,
  balance_cents bigint NOT NULL DEFAULT 0,
  credit_limit_cents bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet_txns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL REFERENCES panel_wallets(panel_id),
  delta_cents bigint NOT NULL,
  reason text NOT NULL,
  ref_id uuid NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
