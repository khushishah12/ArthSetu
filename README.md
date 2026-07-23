# ArthSetu AI

ArthSetu AI is an explainable financial-identity and educational
micro-investment prototype powered by a gamified questionnaire and
machine-learning scoring.

## Final architecture

```text
Vercel
Next.js 16 + React 19 + TypeScript + Route Handlers
          |
          +---- Neon Auth (optional)
          |
          +---- Neon PostgreSQL + Drizzle ORM (optional)
          |
          +---- Render FastAPI + scikit-learn ML
          |
          +---- Gamified Questionnaire → ML Scoring → Dashboard
```

## How it works

1. User completes a **6-phase, 20-question gamified questionnaire**
2. Answers are mapped to **13 ML features** via `lib/questionnaire-map.ts`
3. Features are scored by a **GradientBoostingRegressor** (300–900 range)
4. Results include: SetuScore, risk bucket, drivers, improvement missions,
   investment plan, and projected growth curve
5. All data is persisted to **localStorage** — no server storage required

## Run locally

1. Copy `.env.example` to `.env.local`
2. Add environment values (see below)
3. Start the ML service:

```powershell
cd ml-service
.\.venv\Scripts\activate
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

4. Start the Next.js application:

```powershell
npm run dev
```

5. Open `http://localhost:3000` and click "Get Your SetuScore"

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

When `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and `NEON_AUTH_COOKIE_SECRET`
are empty the app runs in full demo mode with local-only persistence.

## Product routes

| Route | Purpose |
|-------|---------|
| `/` | Cinematic landing page with hero, journey, engines, trust |
| `/login` and `/signup` | Neon Auth with demo bypass |
| `/questionnaire` | Gamified 6-phase financial questionnaire |
| `/app/dashboard` | SetuScore command centre: drivers, missions, projections |
| `/app/assessment` | Full risk-profile and investment assessment |
| `/app/invest` | SetuInvest educational allocation and scenarios |
| `/app/history` | Assessment history (localStorage) |
| `/app/profile` | Financial profile and consent source controls |

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/health` | GET | ML service health |
| `/api/v1/profiles` | GET | Demo profile listing |
| `/api/v1/profiles/[id]/dashboard` | GET | Full dashboard bundle |
| `/api/v1/score` | POST | Score from raw features |
| `/api/v1/risk-profile` | POST | Risk assessment |
| `/api/v1/full-assessment` | POST | Combined score + risk + invest |
| `/api/submit-questionnaire` | POST | Questionnaire orchestration |
| `/api/profiles` | GET | Next.js BFF proxy |
| `/api/model-card` | GET | Model metadata |
| `/api/history` | GET/DELETE | Assessment history |
| `/api/demo-session` | GET/DELETE | Demo cookie management |

## ML model

- **Regression**: GradientBoostingRegressor → SetuScore (300–900)
- **Classification**: LogisticRegression → risk category (Low / Medium / High)
- **Training data**: 10,000 synthetic credit profiles
- **R²**: 0.9649 | **MAE**: 6.58 | **Accuracy**: 93.15%
- **Top features**: financial_discipline (0.60), late_bill_count (0.24),
  savings_ratio (0.08)

## Database setup (optional)

When using Neon, paste `database/NEON_SETUP.sql` into Neon Console →
SQL Editor and run it once.

Drizzle commands:

```powershell
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Responsible-use boundary

SetuScore is not a bureau score or lending decision. SetuInvest is educational,
not regulated financial advice. All training data is synthetic. User data stays
in the browser (localStorage) unless Neon is configured.
