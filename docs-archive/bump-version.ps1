# Auto-bump minor version in package.json
$packagePath = "reclaim-app\package.json"
$package = Get-Content $packagePath | ConvertFrom-Json

# Parse current version
$version = $package.version
$parts = $version.Split('.')
$major = [int]$parts[0]
$minor = [int]$parts[1]
$patch = [int]$parts[2]

# Bump minor version, reset patch
$minor++
$patch = 0
$newVersion = "$major.$minor.$patch"

# Update package.json
$package.version = $newVersion
$package | ConvertTo-Json -Depth 10 | Set-Content $packagePath

Write-Host "Version bumped from $version to $newVersion"