param(
    [Parameter(Mandatory=$true)]
    [string]$message
)

Write-Host "Adding all changes..." -ForegroundColor Cyan
git add .

Write-Host "Committing with message: $message" -ForegroundColor Cyan
git commit -m $message

Write-Host "Pushing to remote..." -ForegroundColor Cyan
git push

Write-Host "Done! ✅" -ForegroundColor Green
