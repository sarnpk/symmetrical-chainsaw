@echo off
setlocal EnableDelayedExpansion

:: ===================================================================
:: Next.js Clean Production Build + Zip
:: Excludes: node_modules, docs, .netlify, .git + some junk files
:: ===================================================================

echo.
echo =================================================
echo   Running npm run build...
echo =================================================
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Build successful!
echo.

set "ROOT=%cd%"
set "CACHE=%ROOT%\.next\cache"
set "TEMP_BUILD=%ROOT%\build-production-temp"
set "ZIP=%ROOT%\reclaim-app-production.zip"

:: 1. Delete .next\cache
echo Deleting .next\cache...
if exist "%CACHE%" rd /s /q "%CACHE%" >nul 2>&1

:: 2. Recreate empty .next\cache (required by Netlify/Vercel)
mkdir "%CACHE%" >nul 2>&1

:: 3. Create temp folder
echo.
echo Preparing clean production files...
if exist "%TEMP_BUILD%" rd /s /q "%TEMP_BUILD%"
mkdir "%TEMP_BUILD%"

:: 4. Copy everything EXCEPT the big/unwanted folders
robocopy "%ROOT%" "%TEMP_BUILD%" /MIR ^
    /XD ^
        "%ROOT%\node_modules" ^
        "%ROOT%\docs" ^
        "%ROOT%\.netlify" ^
        "%ROOT%\.git" ^
    /XF ^
        "%ZIP%" ^
        ".env.local" ^
        "*.log" ^
        ".gitignore" ^
    >nul

echo   -> Copy complete ^(node_modules, docs, .netlify, .git excluded^)

:: 5. Create zip using a single-line PowerShell command (no brace issues)
echo.
echo Creating reclaim-app-production.zip ...
if exist "%ZIP%" del /f /q "%ZIP%"



echo.
echo You can now deploy reclaim-app-production.zip
echo.
pause