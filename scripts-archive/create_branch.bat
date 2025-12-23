@echo off
ECHO Starting process to create and push to a new branch...

:: Navigate to the repository directory (optional if already in the correct directory)
cd /d "%~dp0"

:: Check if Git is installed
git --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO Git is not installed or not found in PATH. Please install Git and try again.
    pause
    exit /b %ERRORLEVEL%
)

:: Check if the current directory is a Git repository
git rev-parse --is-inside-work-tree >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO This directory is not a Git repository. Please navigate to the 'kidsos' repository and try again.
    pause
    exit /b %ERRORLEVEL%
)

:: Prompt for branch name
set /p BRANCH_NAME=Enter the branch name (e.g., final): 
IF "%BRANCH_NAME%"=="" (
    ECHO Branch name cannot be empty. Exiting...
    pause
    exit /b 1
)

:: Prompt for commit message
set /p COMMIT_MESSAGE=Enter the commit message: 
IF "%COMMIT_MESSAGE%"=="" (
    ECHO Commit message cannot be empty. Using default message...
    set COMMIT_MESSAGE=Committing all changes before switching to branch '%BRANCH_NAME%'
)

:: Stage all changes
ECHO Staging all changes...
git add .

:: Commit changes (if any)
ECHO Committing changes with message: %COMMIT_MESSAGE%
git commit -m "%COMMIT_MESSAGE%" || (
    ECHO No changes to commit, proceeding to create branch...
)

:: Create and checkout the new branch
ECHO Creating and switching to branch '%BRANCH_NAME%'...
git checkout -b %BRANCH_NAME%

:: Push the new branch to the remote repository
ECHO Pushing branch '%BRANCH_NAME%' to remote repository...
git push origin %BRANCH_NAME%

:: Check if push was successful
IF %ERRORLEVEL% EQU 0 (
    ECHO Branch '%BRANCH_NAME%' created and pushed successfully!
) ELSE (
    ECHO Failed to push branch '%BRANCH_NAME%'. Please check your remote repository settings and try again.
)

pause