@echo off
echo ========================================
echo   Build Size Analysis
echo ========================================
echo.

cd reclaim-app

if not exist ".next" (
    echo ❌ No build found. Run 'npm run build' first.
    cd ..
    pause
    exit /b 1
)

echo 📊 Analyzing build size...
echo.

REM Check total build size
for /f %%i in ('dir ".next" /s /-c ^| find "File(s)"') do set files=%%i
for /f %%i in ('dir ".next" /s /-c ^| find "bytes"') do set bytes=%%i

echo Total build size: %bytes% bytes
echo.

REM Find large files (>10MB)
echo 🔍 Large files (>10MB):
forfiles /p ".next" /s /m *.* /c "cmd /c if @fsize gtr 10485760 echo @path - @fsize bytes"

echo.
echo 🔍 Checking for problematic files:

REM Check for source maps (can be large)
if exist ".next\static\chunks\*.map" (
    echo ⚠️  Source maps found - these can be large
    dir ".next\static\chunks\*.map" | find ".map"
)

REM Check for large images
echo.
echo 🖼️  Large images in static folder:
if exist ".next\static" (
    forfiles /p ".next\static" /s /m *.* /c "cmd /c if @fsize gtr 5242880 echo @path - @fsize bytes" 2>nul
)

echo.
echo 💡 Optimization suggestions:
echo - Enable image optimization in next.config.js
echo - Use next/image for automatic optimization
echo - Consider removing source maps in production
echo - Compress large assets
echo.

cd ..
pause