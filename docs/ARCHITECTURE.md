# Architecture

```text
Browser
  ↓
Vercel — Next.js App Router
  ├─ cinematic React frontend
  ├─ Supabase SSR authentication
  ├─ Route Handlers / BFF validation
  └─ assessment persistence
       ↓                 ↓
Supabase              Render
Auth + Postgres       FastAPI ML engine
RLS + history         scikit-learn + Joblib
```

## Why this architecture works

- One Next.js project owns marketing, product UI and server routes.
- Supabase owns identity, user-scoped data and row-level policies.
- Specialised Python intelligence remains behind a server-side API boundary.
- The browser never receives the ML service secret or Supabase service-role key.
- A labelled LocalStorage/demo path keeps presentations reliable before cloud configuration.

## Request path

1. The dashboard calls a same-origin `/api` route.
2. The Route Handler validates input with Zod.
3. The server calls FastAPI with `ML_SERVICE_API_KEY`.
4. FastAPI loads the Joblib model and returns score, drivers and actions.
5. The Route Handler saves a complete assessment to Supabase when a user is authenticated.
6. The browser receives only the final bounded response.
