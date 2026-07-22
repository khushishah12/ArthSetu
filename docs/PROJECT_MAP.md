# Project Map

```text
arthsetu-ai-next-supabase-ml/
├── app/                         Next.js pages and Route Handlers
│   ├── api/                     Backend-for-frontend endpoints
│   ├── app/                     Authenticated/demo product workspace
│   ├── auth/callback/           Supabase authentication callback
│   ├── login/ and signup/       Authentication screens
│   └── page.tsx                 Cinematic public homepage
├── components/                  UI, motion, charts and product components
├── lib/
│   ├── demo-engine.ts           Zero-configuration local demo logic
│   ├── ml-client.ts             Server-only FastAPI client
│   ├── web-api.ts               Browser API client
│   ├── validators.ts            Zod validation
│   └── supabase/                Browser, server and proxy clients
├── ml-service/
│   ├── app/main.py              FastAPI service
│   ├── app/services/            Score, risk and investment engines
│   ├── app/ml/artifacts/        Trained scikit-learn model
│   ├── app/data/profiles.json   15 synthetic demo profiles
│   └── tests/                   ML/API tests
├── supabase/
│   ├── migrations/              PostgreSQL schema and RLS
│   └── seed.sql                 Synthetic demonstration data
├── docs/                        Architecture, setup, deployment and validation
├── proxy.ts                     Supabase SSR session refresh for Next.js 16
├── render.yaml                  ML-service deployment
├── vercel.json                  Next.js deployment
├── run-local.bat                Windows launcher
├── run-local.ps1                PowerShell launcher
└── run-local.sh                 Linux/macOS launcher
```
