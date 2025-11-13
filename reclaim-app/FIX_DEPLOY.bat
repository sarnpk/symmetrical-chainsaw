@echo off
echo ========================================
echo   Netlify Deployment Fix Script
echo ========================================
echo.

REM Step 1: Link to existing site
echo Step 1: Linking to your Netlify site...
call netlify link --id clinquant-daifuku-27ed85

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to link site. Make sure you're logged in.
    echo Run: netlify login
    pause
    exit /b 1
)

echo ✅ Site linked!
echo.

REM Step 2: Check environment variables
echo Step 2: Checking environment variables...
echo.
echo ⚠️  Make sure these are set in Netlify Dashboard:
echo    - NEXT_PUBLIC_SUPABASE_URL
echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo    - SUPABASE_SERVICE_ROLE_KEY
echo    - GOOGLE_AI_API_KEY
echo    - GLADIA_API_KEY
echo.
echo Press any key to continue (or Ctrl+C to cancel and set them first)...
pause >nul

REM Step 3: Clean install
echo.
echo Step 3: Clean install...
if exist "node_modules" rmdir /s /q node_modules
if exist ".next" rmdir /s /q .next
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo ✅ Dependencies installed!
echo.

REM Step 4: Build locally
echo Step 4: Building locally...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed! Fix errors above before deploying.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Step 5: Deploy
echo Step 5: Deploying to production...
call netlify deploy --prod --build

echo.
echo ========================================
echo   ✨ Deployment Complete!
echo ========================================
echo.
echo Your site: https://clinquant-daifuku-27ed85.netlify.app
echo.
echo If you still see "Page not found":
echo 1. Wait 1-2 minutes for DNS propagation
echo 2. Clear your browser cache (Ctrl+Shift+Delete)
echo 3. Try incognito/private browsing mode
echo 4. Check Netlify deploy logs at:
echo    https://app.netlify.com/sites/clinquant-daifuku-27ed85/deploys
echo.
pause
