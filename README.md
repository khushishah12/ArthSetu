# ArthSetu AI

ArthSetu AI is an explainable financial-identity and educational
micro-investment prototype.

## Final architecture

```text
Vercel
Next.js 16 + React 19 + TypeScript + Route Handlers
          |
          +---- Neon Auth
          |
          +---- Neon PostgreSQL + Drizzle ORM
          |
          +---- Render FastAPI + scikit-learn ML
```

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Add Neon and ML environment values.
3. Run the SQL in `database/NEON_SETUP.sql` once in Neon SQL Editor.
4. Install dependencies:

```powershell
npm install
```

5. Start the included ML service with `scripts/start-ml.bat`.
6. Start the Next.js application:

```powershell
npm run dev
```

Open `http://localhost:3000`.

The project still supports a labelled demo mode when Neon is not configured.

## Required environment variables

```env
DATABASE_URL=
NEON_AUTH_BASE_URL=
NEON_AUTH_COOKIE_SECRET=
ML_SERVICE_URL=http://127.0.0.1:8000
ML_SERVICE_API_KEY=local-development-key
ALLOW_DEMO_FALLBACK=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Keep `DATABASE_URL`, `NEON_AUTH_BASE_URL`,
`NEON_AUTH_COOKIE_SECRET`, and `ML_SERVICE_API_KEY` server-side.

## Database setup

For the easiest setup, paste `database/NEON_SETUP.sql` into Neon Console →
SQL Editor and run it once.

Drizzle commands are also included:

```powershell
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Product routes

- `/` — cinematic public experience
- `/login` and `/signup` — Neon Auth
- `/app/dashboard` — SetuScore command centre
- `/app/assessment` — full score and investment assessment
- `/app/invest` — educational allocation and scenarios
- `/app/history` — user-owned Neon persistence
- `/app/profile` — synthetic data and consent explanation

## Responsible-use boundary

SetuScore is not a bureau score or lending decision. SetuInvest is educational,
not regulated financial advice. All bundled identities and training data are
synthetic.
