@echo off
REM Production Build Script for Reclaim App

echo.
echo ========================================
echo Reclaim App - Production Build
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this from the reclaim-app directory.
    exit /b 1
)

REM Step 1: Install dependencies
echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error: npm install failed
    exit /b 1
)

REM Step 2: Build the project
echo.
echo [2/4] Building for production...
call npm run build
if errorlevel 1 (
    echo Error: npm run build failed
    exit /b 1
)

REM Step 3: Check build output
echo.
echo [3/4] Verifying build output...
if not exist ".next" (
    echo Error: .next directory not created
    exit /b 1
)
echo Build output verified: .next directory created

REM Step 4: Summary
echo.
echo [4/4] Build complete!
echo.
echo ========================================
echo Build Summary
echo ========================================
echo.
echo Build directory: .next
echo Ready to deploy to Netlify
echo.
echo Next steps:
echo 1. Test locally: npm run start
echo 2. Deploy: netlify deploy --prod
echo.
echo ========================================
echo.

pause
