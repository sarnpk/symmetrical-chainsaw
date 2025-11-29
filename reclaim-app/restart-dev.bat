@echo off
echo ========================================
echo Restarting Development Server
echo ========================================
echo.

echo Stopping any running Next.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting development server...
echo.
npm run dev
