@echo off
echo Running transcription fix script...
echo.

REM Set environment variables (replace with your actual values)
set NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
set GLADIA_API_KEY=your_gladia_api_key_here

REM Run the fix script
node scripts/fix-stuck-transcriptions.js

echo.
echo Script completed. Press any key to exit...
pause > nul