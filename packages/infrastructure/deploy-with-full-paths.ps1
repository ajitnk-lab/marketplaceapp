# Deploy Marketplace Infrastructure with Full Paths
# This script works around PATH issues by using full paths to Node.js

$NodePath = "C:\Program Files\nodejs"
$NodeExe = "$NodePath\node.exe"
$NpmCmd = "$NodePath\npm.cmd"
$NpxCmd = "$NodePath\npx.cmd"

Write-Host "=== Marketplace Platform Deployment ===" -ForegroundColor Green
Write-Host "Using Node.js from: $NodePath" -ForegroundColor Cyan

# Check if Node.js exists
if (-not (Test-Path $NodeExe)) {
    Write-Host "ERROR: Node.js not found at $NodeExe" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Display versions
Write-Host "Node.js version:" -ForegroundColor Yellow
& $NodeExe --version

Write-Host "npm version:" -ForegroundColor Yellow  
& $NpmCmd --version

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
& $NpmCmd install

# Install lambda layer dependencies
Write-Host "Installing lambda layer dependencies..." -ForegroundColor Yellow
Push-Location "lambda-layers\common\nodejs"
& $NpmCmd install
Pop-Location

# Build TypeScript
Write-Host "Building TypeScript..." -ForegroundColor Yellow
& $NpmCmd run build

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: TypeScript build failed!" -ForegroundColor Red
    exit 1
}

# Synthesize CDK
Write-Host "Synthesizing CDK templates..." -ForegroundColor Yellow
& $NpxCmd cdk synth --context stage=dev

# Check if synthesis was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: CDK synthesis failed!" -ForegroundColor Red
    exit 1
}

Write-Host "CDK synthesis completed successfully!" -ForegroundColor Green
Write-Host "To deploy, run: npx cdk deploy --all --context stage=dev" -ForegroundColor Cyan
Write-Host "Or use: npx cdk bootstrap (first time only)" -ForegroundColor Cyan