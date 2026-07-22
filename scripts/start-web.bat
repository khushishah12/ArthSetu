@echo off
cd /d "%~dp0.."
title ArthSetu Next.js
call npm run dev
echo.
echo Next.js stopped. Review the error above.
pause
