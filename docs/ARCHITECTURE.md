# Architecture

```text
Browser
  |
  v
Next.js on Vercel
  |-- public UI and product workspace
  |-- server Route Handlers
  |-- Neon Auth session validation
  |-- user-scoped Drizzle queries
  |
  +--> Neon PostgreSQL
  |      assessment_runs
  |      consent_events
  |      neon_auth schema managed by Neon
  |
  +--> FastAPI on Render
         scikit-learn SetuScore model
         explainability
         risk capacity
         educational allocation
         scenario generation
```

The browser calls only the Next.js application. Database and ML secrets remain
server-side. Demo mode uses synthetic data and browser-only history.
