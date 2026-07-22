# ArthSetu AI — Validation Report

## Scope validated

This release was checked as a full-stack hackathon product consisting of:

- Next.js App Router web application
- React and TypeScript product UI
- Next.js Route Handler backend-for-frontend layer
- Supabase Auth, PostgreSQL and Row Level Security schema
- FastAPI machine-learning service
- scikit-learn model artifact and synthetic profiles
- Local demo fallback
- Vercel, Supabase and Render deployment configuration

## Completed checks

- Python source compilation completed successfully.
- FastAPI tests passed: **4 passed**.
- FastAPI health endpoint returned a valid response.
- The profile endpoint returned all **15 synthetic profiles**.
- Dashboard bundles were generated for Low, Medium and High examples.
- SetuScore remained within the defined 300–900 range.
- Exactly three local model drivers were returned.
- Capacity-aware risk profiling completed successfully.
- Educational investment allocation completed successfully.
- Scenario generation returned the expected monthly series.
- All JSON files parsed successfully.
- Supabase migration and seed files were present.
- Supabase seed contained all 15 synthetic profiles.
- Row Level Security policies were present for user-owned data.
- Required Next.js pages and API routes were present.
- TypeScript and TSX syntax was checked across **49 source files** with zero syntax errors.
- Local TypeScript import resolution completed with zero missing imports.
- Product source was checked for accidental legacy-brand references.
- ZIP integrity was verified after packaging.

## Sample validated results

| Profile | SetuScore | Risk bucket | Confidence | Illustrative plan |
|---|---:|---|---:|---|
| Ravi | 751 | Low | 86% | Balanced |
| Meera | 560 | Medium | 73% | Balanced |
| Imran | 317 | High | 90% | Conservative |

All included names and financial records are synthetic.

## Frontend build limitation

The sandbox environment could not complete a normal `npm install` because access
to the external npm registry timed out. Therefore, a complete Next.js production
build was not executed inside the sandbox.

To reduce deployment risk:

- dependencies use current standard package versions;
- all TypeScript and TSX source files passed syntax transpilation;
- local imports were resolved;
- required Next.js routes and configuration files were checked;
- Vercel-compatible environment and deployment files are included.

A normal internet connection is required for the first `npm install`.

## Responsible-use validation

The interface keeps the following boundary visible:

- SetuScore is not a credit-bureau score.
- The product does not make lending approval decisions.
- SetuInvest is educational and not regulated financial advice.
- Scenario values are illustrative and not promised returns.
- Bundled identities and model-training records are synthetic.
