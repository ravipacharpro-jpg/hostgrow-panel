CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL REFERENCES panels(id) ON DELETE CASCADE,
  package_name text NOT NULL,
  display_name text,
  UNIQUE(panel_id, package_name)
);

CREATE TABLE IF NOT EXISTS app_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  version_code int NOT NULL,
  version_name text,
  track text NOT NULL DEFAULT 'prod',
  min_sdk int, target_sdk int, abi text[],
  file_apk_url text NULL, -- client uploads to Firebase; store URLs if needed
  file_apk_sha256 text NULL,
  size_apk_bytes bigint NULL,
  file_main_obb_url text NULL,
  file_main_obb_sha256 text NULL,
  size_main_obb_bytes bigint NULL,
  file_patch_obb_url text NULL,
  file_patch_obb_sha256 text NULL,
  size_patch_obb_bytes bigint NULL,
  signed boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(app_id, version_code, track)
);
