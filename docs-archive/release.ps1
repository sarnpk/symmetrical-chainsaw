param(
  [ValidateSet('major','minor','patch','build')]
  [string]$Part = 'minor',
  [string]$Message
)

$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$versionFile = Join-Path $root 'reclaim-app\src\version.json'
$bumpScript = Join-Path $root 'bump-version.ps1'
$pushScript = Join-Path $root 'push.ps1'

if (-not (Test-Path $bumpScript)) { Write-Error "bump-version.ps1 not found" }
if (-not (Test-Path $pushScript)) { Write-Error "push.ps1 not found" }

# 1) Bump version
Write-Host "Bumping version ($Part)..." -ForegroundColor Cyan
powershell -ExecutionPolicy Bypass -File $bumpScript -Part $Part | Write-Host

# 2) Read new version
if (-not (Test-Path $versionFile)) { Write-Error "version.json not found at $versionFile" }
$json = Get-Content -Raw $versionFile | ConvertFrom-Json
$semver = "$($json.major).$($json.minor).$($json.patch)+$($json.build)"
$ts = $json.timestamp

# 3) Compose commit message
if (-not $Message -or $Message.Trim().Length -eq 0) {
  $Message = "Release: v$semver ($ts)"
}

# 4) Push to origin/master
Write-Host "Pushing with message: $Message" -ForegroundColor Cyan
powershell -ExecutionPolicy Bypass -File $pushScript -Message $Message
