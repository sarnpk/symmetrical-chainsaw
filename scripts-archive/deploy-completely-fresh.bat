@echo off
echo ========================================
echo   Completely Fresh Netlify Deployment
echo ========================================
echo.

REM Check if we're in the root directory
if not exist "reclaim-app" (
    echo ❌ Error: reclaim-app folder not found!
    echo    Make sure you're running this from the project root.
    pause
    exit /b 1
)

REM Remove old Netlify configuration
echo 🧹 Removing old Netlify configuration...
if exist ".netlify" (
    rmdir /s /q ".netlify"
    echo ✅ Removed .netlify folder
)

REM Check if netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Netlify CLI...
    call npm install -g netlify-cli
)

REM Check login status
echo.
echo 🔐 Checking Netlify login status...
call netlify status
if %ERRORLEVEL% NEQ 0 (
    echo Please login to Netlify...
    call netlify login
)

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

REM Initialize new Netlify site
echo.
echo 🚀 Initializing new Netlify site...
echo.
call netlify init

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Initialization failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✨ Site Created!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Set environment variables in Netlify Dashboard
echo 2. Run: netlify deploy --prod
echo.
pause
