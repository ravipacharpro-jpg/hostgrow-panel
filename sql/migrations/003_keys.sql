CREATE TABLE IF NOT EXISTS license_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL REFERENCES panels(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  key text UNIQUE NOT NULL,
  key_name text NULL,
  issued_to uuid NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz NULL,
  expires_at timestamptz NULL,
  status text NOT NULL DEFAULT 'issued'
);

CREATE TABLE IF NOT EXISTS license_key_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id uuid NOT NULL REFERENCES license_keys(id) ON DELETE CASCADE,
  actor_user_id uuid NOT NULL,
  event text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
