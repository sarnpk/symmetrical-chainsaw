@echo off
echo ========================================
echo   Deploying Reclaim to Netlify
echo ========================================
echo.

REM Check if we're in the root directory
if not exist "reclaim-app" (
    echo ❌ Error: reclaim-app folder not found!
    echo    Make sure you're running this from the project root.
    pause
    exit /b 1
)

REM Check if netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Netlify CLI...
    call npm install -g netlify-cli
)

REM Check if logged in
echo 🔐 Checking Netlify authentication...
call netlify status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Please login to Netlify...
    call netlify login
)

echo.
echo ⚠️  IMPORTANT: Environment Variables Check
echo ========================================
echo Make sure these are set in Netlify Dashboard:
echo https://app.netlify.com/sites/clinquant-daifuku-27ed85/settings/env
echo.
echo Required variables:
echo   - NEXT_PUBLIC_SUPABASE_URL
echo   - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo   - SUPABASE_SERVICE_ROLE_KEY
echo   - GOOGLE_AI_API_KEY
echo   - GLADIA_API_KEY
echo.
echo Press any key to continue (or Ctrl+C to cancel)...
pause >nul

REM Install dependencies
echo.
echo 📦 Installing dependencies...
cd reclaim-app
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed!
    cd ..
    pause
    exit /b 1
)
cd ..

REM Clean build
echo.
echo 🧹 Cleaning previous build...
if exist "reclaim-app\.next" rmdir /s /q "reclaim-app\.next"

REM Build locally to check for errors
echo.
echo 🔨 Building application...
cd reclaim-app
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed! Fix errors above.
    cd ..
    pause
    exit /b 1
)
cd ..

echo ✅ Build successful!

REM Deploy from root directory
echo.
echo 🚀 Deploying to Netlify production...
call netlify deploy --prod

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✨ Deployment Complete!
echo ========================================
echo.
echo Your site: https://clinquant-daifuku-27ed85.netlify.app
echo.
echo If you see "Page not found":
echo 1. Wait 1-2 minutes for deployment to complete
echo 2. Check environment variables are set in Netlify
echo 3. Clear browser cache (Ctrl+Shift+Delete)
echo 4. Check deploy logs:
echo    https://app.netlify.com/sites/clinquant-daifuku-27ed85/deploys
echo.
pause
