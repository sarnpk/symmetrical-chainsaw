@echo off
echo ========================================
echo PUSHING REFERRAL SYSTEM TO GIT
echo ========================================

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing changes...
git commit -m "feat: Navigation cleanup and FAQ integration

- Remove FAQ from header navigation across pages
- Keep Learn More only in hero sections (not header nav)
- Add FAQ section to Learn More page content
- Add FAQ button to Learn More hero section
- Clean mobile-optimized navigation structure

Navigation changes:
- Main page: Learn More button in hero only
- Learn More page: FAQ button in hero, FAQ content integrated
- FAQ page: Clean header with just Home link
- Improved mobile UX with less header clutter"

echo.
echo Pushing to remote repository...
git push origin main

echo.
echo ========================================
echo PUSH COMPLETE!
echo ========================================
echo.
echo Navigation cleanup is now in Git!
echo Changes made:
echo 1. FAQ removed from header navigation
echo 2. Learn More kept in hero sections only
echo 3. FAQ integrated into Learn More page
echo 4. Mobile-optimized navigation structure
echo.
pause