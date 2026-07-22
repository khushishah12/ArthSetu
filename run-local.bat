@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title ArthSetu AI - Setup

echo.
echo ============================================================
echo        ARTHSETU AI - FULL-STACK LOCAL LAUNCHER
echo ============================================================
echo.
echo Next.js + Supabase-ready + FastAPI ML

echo Checking Node.js...
where node >nul 2>&1 || goto NO_NODE
where npm >nul 2>&1 || goto NO_NODE
for /f %%V in ('node -p "Number(process.versions.node.split('.')[0])"') do set NODE_MAJOR=%%V
if !NODE_MAJOR! LSS 20 goto OLD_NODE

echo Checking Python...
set PY_CMD=
where py >nul 2>&1
if not errorlevel 1 (
  py -3.12 -c "import sys" >nul 2>&1 && set PY_CMD=py -3.12
  if not defined PY_CMD py -3.11 -c "import sys" >nul 2>&1 && set PY_CMD=py -3.11
  if not defined PY_CMD py -3 -c "import sys" >nul 2>&1 && set PY_CMD=py -3
)
if not defined PY_CMD where python >nul 2>&1 && set PY_CMD=python
if not defined PY_CMD goto NO_PYTHON

if not exist ".env.local" (
  copy /Y ".env.example" ".env.local" >nul
  echo Created .env.local in demo mode.
)

echo.
echo Installing Next.js packages...
call npm install --no-audit --no-fund
if errorlevel 1 goto SETUP_FAILED

if not exist "ml-service\.venv\Scripts\python.exe" (
  echo Creating Python virtual environment...
  %PY_CMD% -m venv "ml-service\.venv"
  if errorlevel 1 goto SETUP_FAILED
)

echo Installing ML service packages...
call "ml-service\.venv\Scripts\activate.bat"
python -m pip install --upgrade pip
python -m pip install -r "ml-service\requirements.txt"
if errorlevel 1 goto SETUP_FAILED

echo.
echo Starting FastAPI and Next.js in separate windows...
start "ArthSetu ML Engine" cmd /k ""%~dp0scripts\start-ml.bat""
start "ArthSetu Next.js" cmd /k ""%~dp0scripts\start-web.bat""

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\wait-and-open.ps1"
if errorlevel 1 goto SERVICES_FAILED

echo.
echo ArthSetu AI is running.
echo Website : http://localhost:3000
echo Product : http://localhost:3000/app/dashboard
echo ML docs : http://127.0.0.1:8000/api/docs
echo.
pause
exit /b 0

:NO_NODE
echo Node.js and npm were not found. Install Node.js 20 LTS or newer.
pause
exit /b 1
:OLD_NODE
echo Node.js !NODE_MAJOR! is too old. Install Node.js 20 or newer.
pause
exit /b 1
:NO_PYTHON
echo Python was not found. Install Python 3.11 or 3.12 and add it to PATH.
pause
exit /b 1
:SETUP_FAILED
echo.
echo Setup failed. Read the error above. The window will stay open.
pause
exit /b 1
:SERVICES_FAILED
echo.
echo Services did not become ready. Check the two ArthSetu command windows.
pause
exit /b 1
