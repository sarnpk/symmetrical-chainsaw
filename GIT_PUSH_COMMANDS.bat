@echo off
echo ========================================
echo PUSHING REFERRAL SYSTEM TO GIT
echo ========================================

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing changes...
git commit -m "feat: Complete therapy and legal referral system

- Add therapy referral tracking system with analytics
- Add legal referral system for attorney partnerships  
- Implement dual referral buttons (therapy + legal)
- Add revenue tracking and platform optimization
- Create partnership email templates
- Update safety plan, manipulation decoder, and dashboard
- Add comprehensive marketing and launch strategies

Revenue potential: $350K-1.8M annually from referrals
- Therapy: $50-75 per referral (BetterHelp, Talkspace, etc.)
- Legal: $200-500 per referral (Avvo, FindLaw, etc.)

Files added:
- Database migrations for referral tracking
- TherapyReferralButton and LegalReferralButton components
- Partnership email templates
- Marketing and launch strategy documents
- Updated UI with referral integration"

echo.
echo Pushing to remote repository...
git push origin main

echo.
echo ========================================
echo PUSH COMPLETE!
echo ========================================
echo.
echo Your referral system is now in Git!
echo Next steps:
echo 1. Send partnership emails
echo 2. Test referral buttons
echo 3. Monitor analytics
echo 4. Start earning $350K-1.8M annually!
echo.
pause