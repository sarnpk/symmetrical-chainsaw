@echo off
echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Are you in the reclaim-app directory?
    exit /b 1
)

REM Check if netlify-cli is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Netlify CLI...
    npm install -g netlify-cli
)

REM Check for .env.local
if not exist ".env.local" (
    echo ⚠️  Warning: .env.local not found. Make sure environment variables are set in Netlify.
)

REM Run build locally to check for errors
echo 🔨 Running build check...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed! Fix errors before deploying.
    exit /b 1
)

echo ✅ Build successful!

REM Deploy to production
echo 🌐 Deploying to Netlify production...
call netlify deploy --prod

echo ✨ Deployment complete!
echo 📊 Check your site at: https://app.netlify.com

pause
