@echo off
echo ========================================
echo   Safe Netlify Deployment
echo ========================================
echo.

REM Function to check internet connectivity
echo 🌐 Checking internet connectivity...
ping -n 1 netlify.com >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ No internet connection or Netlify is unreachable
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

REM Check Netlify status
echo 📡 Checking Netlify service status...
curl -s https://www.netlifystatus.com/api/v2/status.json | findstr "operational" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Netlify services may be experiencing issues
    echo Check https://www.netlifystatus.com/ for current status
    echo.
    echo Continue anyway? (y/n)
    set /p continue=
    if /i not "%continue%"=="y" exit /b 1
)

REM Clean everything
echo 🧹 Deep cleaning build artifacts...
cd reclaim-app
if exist ".next" rmdir /s /q ".next"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist ".netlify" rmdir /s /q ".netlify"

REM Fresh install
echo 📦 Fresh npm install...
call npm ci --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed
    cd ..
    pause
    exit /b 1
)

REM Build
echo 🔨 Building...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    cd ..
    pause
    exit /b 1
)

cd ..

REM Deploy with retries
echo 🚀 Deploying with retry logic...
set /a attempts=0
set /a max_attempts=3

:deploy_loop
set /a attempts+=1
echo Attempt %attempts% of %max_attempts%...

call netlify deploy --prod --timeout=300
if %ERRORLEVEL% EQU 0 (
    echo ✅ Deployment successful!
    goto success
)

if %attempts% LSS %max_attempts% (
    echo ⚠️  Attempt %attempts% failed, waiting 30 seconds before retry...
    timeout /t 30 /nobreak >nul
    goto deploy_loop
)

echo ❌ All deployment attempts failed
echo.
echo Troubleshooting steps:
echo 1. Check https://www.netlifystatus.com/
echo 2. Try again in 10-15 minutes
echo 3. Check your internet connection
echo 4. Contact Netlify support if issue persists
echo.
pause
exit /b 1

:success
echo.
echo ========================================
echo   ✨ Deployment Complete!
echo ========================================
echo.
echo Your site: https://clinquant-daifuku-27ed85.netlify.app
echo.
pause