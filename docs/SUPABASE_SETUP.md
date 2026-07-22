# Supabase setup

1. Create a project.
2. Open SQL Editor and run `supabase/migrations/001_arthsetu.sql`.
3. Run `supabase/seed.sql` to insert 15 synthetic profiles.
4. Copy the Project URL and Publishable key into `.env.local`.
5. In Auth URL Configuration, set `http://localhost:3000` locally and your Vercel domain in production.
6. Add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`
7. Restart Next.js after environment changes.

## What RLS protects

- `profiles`: current user only
- `assessment_runs`: current user only
- `consent_events`: current user only
- `financial_profiles`: public read only for synthetic demo rows; owner access for private rows

The service-role key is not required by this application and should not be exposed to the browser.
