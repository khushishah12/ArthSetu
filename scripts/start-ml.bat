@echo off
cd /d "%~dp0..\ml-service"
title ArthSetu ML Engine
call ".venv\Scripts\activate.bat"
set ML_SERVICE_API_KEY=local-development-key
set ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
echo.
echo ML service stopped. Review the error above.
pause
