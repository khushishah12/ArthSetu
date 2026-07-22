# Deployment — Vercel + Supabase + Render

## 1. GitHub

Push the complete project root to one repository. Do not commit `.env.local`, `.venv`, `.next` or `node_modules`.

## 2. Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/migrations/001_arthsetu.sql`.
4. Run `supabase/seed.sql`.
5. Copy the Project URL and Publishable key.
6. In Authentication URL Configuration, set the Vercel production URL and add `/auth/callback` as a redirect URL.

## 3. Render ML service

Create a Blueprint from the repository or a Python Web Service:

- Root directory: `ml-service`
- Build: `pip install -r requirements.txt`
- Start: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health: `/api/v1/health`
- Python: `3.12.10`

Set `ML_SERVICE_API_KEY` to a long random value and set `ALLOWED_ORIGINS` to the Vercel origin.

## 4. Vercel

Import the same repository with the project root as the Root Directory.

Environment variables:

```env
NEXT_PUBLIC_APP_MODE=production
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
ML_SERVICE_URL=https://your-render-service.onrender.com
ML_SERVICE_API_KEY=the-same-secret-used-on-render
ALLOW_DEMO_FALLBACK=true
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

Never expose `ML_SERVICE_API_KEY` with a `NEXT_PUBLIC_` prefix.

## 5. Verification

- `/api/health` reports Supabase configured and ML connected.
- Signup creates an Auth user and a `profiles` row.
- Dashboard loads 15 synthetic profiles.
- Complete assessment returns score, drivers, plan and scenario.
- Authenticated assessment creates a row in `assessment_runs`.
- History displays only rows owned by the current user.
