# Production Build Script for Reclaim App

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Reclaim App - Production Build" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this from the reclaim-app directory." -ForegroundColor Red
    exit 1
}

# Step 1: Install dependencies
Write-Host "[1/4] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: npm install failed" -ForegroundColor Red
    exit 1
}

# Step 2: Build the project
Write-Host ""
Write-Host "[2/4] Building for production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: npm run build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Check build output
Write-Host ""
Write-Host "[3/4] Verifying build output..." -ForegroundColor Yellow
if (-not (Test-Path ".next")) {
    Write-Host "Error: .next directory not created" -ForegroundColor Red
    exit 1
}
Write-Host "Build output verified: .next directory created" -ForegroundColor Green

# Step 4: Summary
Write-Host ""
Write-Host "[4/4] Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Build directory: .next" -ForegroundColor Green
Write-Host "Ready to deploy to Netlify" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test locally: npm run start" -ForegroundColor White
Write-Host "2. Deploy: netlify deploy --prod" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
