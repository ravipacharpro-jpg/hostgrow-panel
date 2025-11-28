CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  base_price_cents int NOT NULL DEFAULT 0,
  tax_rate_bps int NOT NULL DEFAULT 0,
  floor_price_cents int NULL,
  ceiling_price_cents int NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  code text NOT NULL, -- '2H','5H','1D','7D','15D','1M','2M'
  name text NOT NULL,
  duration_seconds int NOT NULL,
  base_price_cents int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  UNIQUE(product_id, code)
);

CREATE TABLE IF NOT EXISTS panel_price_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL REFERENCES panels(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  mode text NOT NULL CHECK (mode IN ('percent','flat','absolute')),
  value_cents int NOT NULL DEFAULT 0,
  value_bps int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  UNIQUE(panel_id, product_id)
);

CREATE TABLE IF NOT EXISTS panel_variant_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL REFERENCES panels(id) ON DELETE CASCADE,
  variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  mode text NOT NULL CHECK (mode IN ('percent','flat','absolute')),
  value_cents int NOT NULL DEFAULT 0,
  value_bps int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  UNIQUE(panel_id, variant_id)
);
