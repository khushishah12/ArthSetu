$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm install --no-audit --no-fund
if (-not (Test-Path ml-service/.venv/Scripts/python.exe)) { py -3 -m venv ml-service/.venv }
& ml-service/.venv/Scripts/python.exe -m pip install -r ml-service/requirements.txt
Start-Process powershell -ArgumentList '-NoExit','-Command',"Set-Location '$PSScriptRoot/ml-service'; `$env:ML_SERVICE_API_KEY='local-development-key'; `$env:ALLOWED_ORIGINS='http://localhost:3000,http://127.0.0.1:3000'; & ./.venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList '-NoExit','-Command',"Set-Location '$PSScriptRoot'; npm run dev"
& "$PSScriptRoot/scripts/wait-and-open.ps1"
