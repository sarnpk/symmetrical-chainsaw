param(
  [string]$Message
)

function Exec($cmd) {
  Write-Host "> $cmd" -ForegroundColor Cyan
  & powershell -NoProfile -Command $cmd
  if ($LASTEXITCODE -ne 0) { throw "Command failed: $cmd" }
}

# Ensure we're in a git repo
try {
  $null = git rev-parse --is-inside-work-tree 2>$null
} catch {
  Write-Error "Not a git repository. Run this from your project root."
  exit 1
}

# Show short status
& git status -s

if (-not $Message) {
  $Message = Read-Host "Enter commit message (leave blank for auto)"
}
if (-not $Message) {
  $Message = "Auto commit $(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')"
}

# Stage all and commit
& git add -A

# Commit; if nothing to commit, exit gracefully
$commitOutput = & git commit -m "$Message" 2>&1
if ($LASTEXITCODE -ne 0) {
  if ($commitOutput -match "nothing to commit") {
    Write-Host "Nothing to commit. Exiting." -ForegroundColor Yellow
    exit 0
  } else {
    Write-Error $commitOutput
    exit 1
  }
}

# Detect current branch
$branch = (& git rev-parse --abbrev-ref HEAD).Trim()
if (-not $branch) { $branch = "master" }

if ($branch -ne "master") {
  Write-Warning "You are on branch '$branch'. Will push to origin/master."
}

# Push logic: try explicit upstream first, then fallbacks
$pushSucceeded = $false

try {
  & git push -u origin master
  if ($LASTEXITCODE -eq 0) { $pushSucceeded = $true }
} catch {}

if (-not $pushSucceeded) {
  try {
    & git push origin master
    if ($LASTEXITCODE -eq 0) { $pushSucceeded = $true }
  } catch {}
}

if (-not $pushSucceeded) {
  try {
    # Force pushing current HEAD to remote master if upstream confusion exists
    & git push origin HEAD:master
    if ($LASTEXITCODE -eq 0) { $pushSucceeded = $true }
  } catch {}
}

if (-not $pushSucceeded) {
  Write-Error "Push failed. Check your remotes with 'git remote -v' and credentials."
  exit 1
}

Write-Host "Pushed to origin/master successfully." -ForegroundColor Green
