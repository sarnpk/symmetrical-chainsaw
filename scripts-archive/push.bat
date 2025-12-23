@echo off
if "%~1"=="" (
    echo Error: Commit message required
    echo Usage: git-push.bat "your commit message"
    exit /b 1
)

echo Adding all changes...
git add .

echo Committing with message: %~1
git commit -m "%~1"

echo Pushing to remote...
git push

echo Done!
