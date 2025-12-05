@echo off
echo Fixing createServerSupabase imports...

powershell -Command "(Get-Content 'src\app\api\community\comments\route.ts') -replace 'createServerSupabase', 'createServerSupabaseClient' | Set-Content 'src\app\api\community\comments\route.ts'"
powershell -Command "(Get-Content 'src\app\api\community\likes\route.ts') -replace 'createServerSupabase', 'createServerSupabaseClient' | Set-Content 'src\app\api\community\likes\route.ts'"
powershell -Command "(Get-Content 'src\app\api\community\posts\route.ts') -replace 'createServerSupabase', 'createServerSupabaseClient' | Set-Content 'src\app\api\community\posts\route.ts'"
powershell -Command "(Get-Content 'src\app\api\community\posts\[id]\route.ts') -replace 'createServerSupabase', 'createServerSupabaseClient' | Set-Content 'src\app\api\community\posts\[id]\route.ts'"
powershell -Command "(Get-Content 'src\app\api\community\reports\route.ts') -replace 'createServerSupabase', 'createServerSupabaseClient' | Set-Content 'src\app\api\community\reports\route.ts'"
powershell -Command "(Get-Content 'src\app\api\me\route.ts') -replace 'createServerSupabase', 'createServerSupabaseClient' | Set-Content 'src\app\api\me\route.ts'"

echo Done! All community API routes fixed.
pause
