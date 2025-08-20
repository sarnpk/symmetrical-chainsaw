param(
  [ValidateSet('major','minor','patch','build')]
  [string]$Part = 'build',
  [switch]$ShowOnly
)

$versionFile = Join-Path $PSScriptRoot 'reclaim-app\src\version.json'
if (-not (Test-Path $versionFile)) {
  Write-Error "version.json not found at $versionFile"
  exit 1
}

# Load JSON
$jsonText = Get-Content -Raw $versionFile
$ver = $jsonText | ConvertFrom-Json

# Helper to check if a property exists on the PSObject
function Has-Prop($obj, $name) {
  return $obj.PSObject.Properties.Name -contains $name
}

# Ensure fields exist without treating 0 as missing
if (-not (Has-Prop $ver 'major')) { $ver | Add-Member -NotePropertyName major -NotePropertyValue 1 }
if (-not (Has-Prop $ver 'minor')) { $ver | Add-Member -NotePropertyName minor -NotePropertyValue 0 }
if (-not (Has-Prop $ver 'patch')) { $ver | Add-Member -NotePropertyName patch -NotePropertyValue 0 }
if (-not (Has-Prop $ver 'build')) { $ver | Add-Member -NotePropertyName build -NotePropertyValue 0 }

# Bump logic
switch ($Part) {
  'major' { $ver.major = [int]$ver.major + 1; $ver.minor = 0; $ver.patch = 0; $ver.build = 0 }
  'minor' { $ver.minor = [int]$ver.minor + 1; $ver.patch = 0; $ver.build = 0 }
  'patch' { $ver.patch = [int]$ver.patch + 1; $ver.build = 0 }
  'build' { $ver.build = [int]$ver.build + 1 }
}

# Update timestamp (UTC ISO)
$ver.timestamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')

if ($ShowOnly) {
  Write-Host (ConvertTo-Json $ver -Depth 3)
  exit 0
}

# Save back (UTF-8 without BOM)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($versionFile, ($ver | ConvertTo-Json -Depth 3), $utf8NoBom)

# Output human-friendly version
$semver = "$($ver.major).$($ver.minor).$($ver.patch)+$($ver.build)"
Write-Host "Bumped $Part -> $semver at $($ver.timestamp)" -ForegroundColor Green
