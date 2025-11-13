@echo off
echo ========================================
echo   Fresh Netlify Deployment
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

REM Login to Netlify
echo.
echo 🔐 Logging in to Netlify...
call netlify login

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

REM Build
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

REM Deploy - this will create a new site
echo.
echo 🚀 Creating new Netlify site and deploying...
echo.
echo You'll be asked to:
echo 1. Choose your team
echo 2. Enter a site name (or leave blank for random)
echo.
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
echo IMPORTANT: Set environment variables in Netlify Dashboard!
echo.
echo 1. Go to your site settings in Netlify
echo 2. Navigate to: Site settings → Environment variables
echo 3. Add these variables:
echo.
echo    NEXT_PUBLIC_SUPABASE_URL=https://gstiokcvqmxiaqzmtzmv.supabase.co
echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=(your anon key)
echo    SUPABASE_SERVICE_ROLE_KEY=(your service role key)
echo    GOOGLE_AI_API_KEY=(your Google AI key)
echo    GLADIA_API_KEY=(your Gladia key)
echo    NEXT_PUBLIC_V3_MOBILE=0
echo.
echo 4. After setting variables, redeploy:
echo    netlify deploy --prod
echo.
echo 5. Update Supabase Auth URLs with your new Netlify domain
echo.
pause
