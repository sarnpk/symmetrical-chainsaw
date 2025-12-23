@echo off
echo 🔧 Fixing Netlify deployment...

REM Install dependencies including Netlify plugin
echo 📦 Installing dependencies...
call npm install

REM Clean build
echo 🧹 Cleaning previous build...
if exist ".next" rmdir /s /q .next
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache

REM Build
echo 🔨 Building application...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed! Check errors above.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Deploy - Let Netlify plugin handle the directory
echo 🚀 Deploying to Netlify...
call netlify deploy --prod

echo.
echo ✨ Deployment complete!
echo 🌐 Check your site at: https://clinquant-daifuku-27ed85.netlify.app
echo.
echo ⚠️  IMPORTANT: Make sure you've set environment variables in Netlify Dashboard!
echo    Go to: https://app.netlify.com/sites/clinquant-daifuku-27ed85/settings/env
echo.
pause
