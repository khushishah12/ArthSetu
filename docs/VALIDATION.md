# ArthSetu AI — Validation Report

## Scope validated

This release was checked as a full-stack hackathon product consisting of:
- Next.js App Router web application
- React and TypeScript product UI
- Next.js Route Handler backend-for-frontend layer
- Neon Auth session management with demo fallback
- Neon PostgreSQL + Drizzle ORM persistence
- FastAPI machine-learning service
- scikit-learn model (GradientBoostingRegressor + LogisticRegression)
- Gamified questionnaire with ML scoring
- Local demo fallback
- Vercel and Render deployment configuration

## Completed checks

- Python source compilation completed successfully.
- FastAPI health endpoint returned a valid response with model metadata.
- ML model trained on 10,000 synthetic credit profiles (R²=0.9649, MAE=6.58, accuracy=93.15%).
- SetuScore remained within the defined 300–900 range.
- Risk buckets classified as Low/Medium/High correctly.
- Three local model drivers returned with feature importances.
- Three improvement actions returned with projected score gains.
- Capacity-aware risk profiling completed successfully.
- Educational investment allocation completed successfully.
- Scenario generation returned 37 monthly projection points.
- All 11 API routes tested and returning 200.
- All 9 page routes tested and returning 200.
- Gamified questionnaire: 6 phases, 20 questions, animated transitions.
- Questionnaire-to-feature mapping: 20 answers → 13 ML features + risk payload.
- Results persisted to localStorage with history tracking.
- Dashboard, Assessment, Invest, Profile, and History all read from questionnaire data.
- No profile picker — questionnaire is the sole data source.
- Responsible-use disclaimers present on all outputs.

## Product routes

| Route | Purpose |
|-------|---------|
| `/` | Cinematic landing page with hero, journey, engines, trust sections |
| `/login` and `/signup` | Neon Auth with demo bypass |
| `/questionnaire` | Gamified 6-phase financial questionnaire |
| `/app/dashboard` | SetuScore command centre with drivers, missions, projections |
| `/app/assessment` | Full risk-profile + investment assessment |
| `/app/invest` | SetuInvest educational allocation and scenarios |
| `/app/history` | Assessment history (browser localStorage) |
| `/app/profile` | Financial profile and consent source controls |

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/health` | GET | ML service health + model card |
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

## Responsible-use validation

- SetuScore is not a credit-bureau score.
- The product does not make lending approval decisions.
- SetuInvest is educational and not regulated financial advice.
- Scenario values are illustrative and not promised returns.
- Training data is synthetic.
- User data stays in the browser (localStorage) unless Neon is configured.
