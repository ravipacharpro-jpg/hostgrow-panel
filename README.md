# HostGrow – FREE Serverless Panel (Vercel + Firebase + NeonDB)

No VPS. No server bills. Purely free-tier:
- **Vercel** (frontend + API routes)
- **Firebase** (Auth + Storage for APK/OBB)
- **Neon** (Postgres serverless)

Includes:
- Multi-panel roles (Main/Owner/Admin/Reseller)
- Login/Signup (Username+Password; Firebase under the hood)
- Pricing editor (Main/Owner only)
- Keys (issue/extend) + Key Name
- Wallet basics (limited panels)
- APK & OBB upload **UI** (uploads go to Firebase Storage)
- Feature flags: Main always ON; Owner only when Main enables; Admin/Reseller hidden
- SQL migrations for NeonDB

> NOTE: Firebase Email/Password requires an email. For username-based login, we auto-use a synthetic email: `<username>@local.hostgrow` (no inbox required).


## 0) Create FREE accounts
1) **Firebase**: https://console.firebase.google.com → Create Project
   - Enable **Authentication → Email/Password**
   - Enable **Storage**
   - Create **Web App** → get config (apiKey, authDomain, etc.)
   - Create **Service Account** key: Project Settings → Service Accounts → Generate new private key → copy JSON

2) **Neon DB**: https://neon.tech → Create Postgres DB
   - Copy `postgresql://...` connection string (use `NEON_DATABASE_URL`)

3) **Vercel**: https://vercel.com → New Project → Import from GitHub (push this ZIP as a repo)


## 1) Environment variables (Vercel → Project → Settings → Environment Variables)

**Public (NEXT_PUBLIC_):**
- `NEXT_PUBLIC_FIREBASE_API_KEY` = from Firebase web config
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = from Firebase web config
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = from Firebase web config
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = from Firebase web config
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = from Firebase web config
- `NEXT_PUBLIC_FIREBASE_APP_ID` = from Firebase web config

**Server (private):**
- `NEON_DATABASE_URL` = your Neon DB connection string
- `FIREBASE_SERVICE_ACCOUNT_JSON` = paste entire service account JSON (single line)
- `MAIN_PANEL_SLUG` = main
- `JWT_ISSUER` = hostgrow-panel

> In local dev, create `.env.local` with same variables.

## 2) Run SQL migrations on Neon
Open Neon SQL editor and run, in order, files from `/sql/migrations`:
- 001_core.sql
- 002_pricing.sql
- 003_keys.sql
- 004_referrals.sql
- 005_uploads.sql

## 3) Seed Main panel + admin (Vercel local or any runner)
Call the seed API once (development only):
- `POST /api/dev/seed-main`
It returns: `{ panelId, username: "mainadmin", tempPassword }`

## 4) Deploy to Vercel
- Push to GitHub
- Import in Vercel
- Set env vars
- Deploy → `https://<your-vercel-app>.vercel.app`

(Optional) Custom domain: point `panel.hostgrow.shop` to Vercel and set as production domain.

## 5) Firebase Storage rules (simple)
Use default + authenticated write. You can refine rules later. APK/OBB uploads go directly from client to Firebase Storage.

## 6) Test
- Visit `/auth/login`
- Login with `mainadmin` + temp password
- Go `/dashboard` → Upload cards visible
- Create Owner panel, then **Main** toggles Owner features via `/api/features/:panelId`

Enjoy your 100% FREE serverless panel!


## Folder structure
- `/pages/api` → API routes (serverless)
- `/lib` → db/auth helpers
- `/app` → UI (Next.js App Router)
- `/sql/migrations` → Neon DB schema

