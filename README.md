# ArthSetu AI — Full-Stack Intelligence Edition

ArthSetu has been regenerated with a proven product architecture: **one premium Next.js product, Supabase ownership and persistence, explainable server-side business logic, and a specialised FastAPI intelligence service**.

## Product principle

**Premium outside. Clear inside.**

The public website is cinematic and mobile-first. The product workspace is calmer, data-led and reviewable. Every result keeps consent, confidence, reasoning, actions, guardrails and limitations visible.

## Technology stack

### Main application
- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- GSAP
- Lenis smooth scrolling
- Lucide icons
- Next.js Route Handlers
- Zod validation

### Identity and persistence
- Supabase Auth
- Supabase PostgreSQL
- Row Level Security
- Cookie-based server rendering through `@supabase/ssr`

### Machine-learning service
- FastAPI
- Pydantic
- scikit-learn Logistic Regression
- StandardScaler
- Joblib model artifact
- 6,000 synthetic training records
- 13 alternative financial features

### Deployment
- Vercel: Next.js application and BFF route handlers
- Supabase: authentication, PostgreSQL and RLS
- Render: FastAPI ML service

## Main routes

- `/` — cinematic public experience
- `/login`, `/signup` — Supabase authentication
- `/app/dashboard` — command centre
- `/app/assessment` — complete capacity-aware assessment
- `/app/invest` — educational allocation and scenarios
- `/app/history` — Supabase or browser demo history
- `/app/profile` — profile and consent lineage
- `/api/*` — Next.js backend-for-frontend routes
- FastAPI docs: `http://127.0.0.1:8000/api/docs`

## Local run

Double-click `run-local.bat` or run:

```powershell
./run-local.ps1
```

The launcher creates `.env.local`, installs dependencies, prepares the Python virtual environment and opens both services.

- Next.js: `http://localhost:3000`
- FastAPI: `http://127.0.0.1:8000`
- FastAPI docs: `http://127.0.0.1:8000/api/docs`

Supabase is optional for the first local run. Demo mode is clearly labelled.

## Real cloud mode

1. Run the SQL migration and seed in Supabase.
2. Deploy `ml-service` to Render using the included Blueprint.
3. Configure Vercel environment variables from `.env.example`.
4. Set the Supabase Auth site URL and callback URL.
5. Redeploy Vercel.

See `docs/DEPLOYMENT.md` for the exact procedure.

## Responsible-use boundary

ArthSetu is an educational prototype. SetuScore is not an official credit bureau score, does not approve or reject lending, and SetuInvest does not provide regulated financial advice or promise returns. All bundled identities and training records are synthetic.


## Validation and project map

- `docs/VALIDATION.md` — completed technical checks and environment limitation
- `docs/PROJECT_MAP.md` — concise explanation of every major folder
