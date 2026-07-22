#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
[ -f .env.local ] || cp .env.example .env.local
npm install --no-audit --no-fund
python3 -m venv ml-service/.venv
ml-service/.venv/bin/python -m pip install -r ml-service/requirements.txt
ML_SERVICE_API_KEY=local-development-key ALLOWED_ORIGINS=http://localhost:3000 ml-service/.venv/bin/python -m uvicorn app.main:app --app-dir ml-service --host 127.0.0.1 --port 8000 --reload &
npm run dev &
wait
