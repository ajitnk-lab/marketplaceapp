# Configure AWS for Cloud Nestle Website Project
# This script sets up the recommended AWS configuration

Write-Host "=== Configuring AWS for Cloud Nestle Website ===" -ForegroundColor Cyan
Write-Host ""

# Check current AWS setup
Write-Host "Current AWS Configuration:" -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity | ConvertFrom-Json
    Write-Host "✅ Current AWS User: $($identity.Arn)" -ForegroundColor Green
    Write-Host "✅ Account ID: $($identity.Account)" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS not configured properly" -ForegroundColor Red
    exit 1
}

# Set default region if not configured
Write-Host ""
Write-Host "Checking region configuration..." -ForegroundColor Yellow
$currentRegion = aws configure get region
if (-not $currentRegion -or $currentRegion.Trim() -eq "") {
    Write-Host "Setting default region to us-east-1..." -ForegroundColor Yellow
    aws configure set region us-east-1
    Write-Host "✅ Default region set to us-east-1" -ForegroundColor Green
} else {
    Write-Host "✅ Region already configured: $($currentRegion.Trim())" -ForegroundColor Green
}

# Create cloudnestle-dev profile
Write-Host ""
Write-Host "Setting up cloudnestle-dev profile..." -ForegroundColor Yellow

# Get current credentials
$accessKey = aws configure get aws_access_key_id
$secretKey = aws configure get aws_secret_access_key
$region = aws configure get region

if ($accessKey -and $secretKey) {
    # Set up dev profile with same credentials
    aws configure set aws_access_key_id $accessKey --profile cloudnestle-dev
    aws configure set aws_secret_access_key $secretKey --profile cloudnestle-dev
    aws configure set region $region --profile cloudnestle-dev
    aws configure set output json --profile cloudnestle-dev
    
    Write-Host "✅ cloudnestle-dev profile created" -ForegroundColor Green
    
    # Test the new profile
    try {
        $devIdentity = aws sts get-caller-identity --profile cloudnestle-dev | ConvertFrom-Json
        Write-Host "✅ cloudnestle-dev profile verified: $($devIdentity.Arn)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  cloudnestle-dev profile created but verification failed" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Could not copy credentials to dev profile" -ForegroundColor Yellow
    Write-Host "   You can manually create it with: aws configure --profile cloudnestle-dev" -ForegroundColor Yellow
}

# Create environment variables file
Write-Host ""
Write-Host "Creating environment variables file..." -ForegroundColor Yellow

$envContent = @"
# AWS Configuration for Cloud Nestle Website
AWS_PROFILE=cloudnestle-dev
AWS_REGION=$region
AWS_ACCOUNT_ID=$($identity.Account)

# Environment Configuration
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development

# Project Configuration
PROJECT_NAME=cloudnestle-website
DOMAIN_NAME=cloudnestle.com

# GitHub Configuration (to be filled later)
GITHUB_OWNER=your-github-username
GITHUB_REPO=cloudnestle-website
GITHUB_TOKEN=your-github-token

# Admin Configuration
ADMIN_EMAIL=your-email@example.com
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ Environment variables file created: .env.local" -ForegroundColor Green

# Create .env.example for reference
$envExample = $envContent -replace "your-github-username", "YOUR_GITHUB_USERNAME"
$envExample = $envExample -replace "your-github-token", "YOUR_GITHUB_TOKEN"
$envExample = $envExample -replace "your-email@example.com", "YOUR_EMAIL@EXAMPLE.COM"
$envExample = $envExample -replace $identity.Account, "YOUR_AWS_ACCOUNT_ID"

$envExample | Out-File -FilePath ".env.example" -Encoding UTF8
Write-Host "✅ Environment variables template created: .env.example" -ForegroundColor Green

# Create AWS profiles summary
Write-Host ""
Write-Host "AWS Profiles Summary:" -ForegroundColor Cyan
aws configure list-profiles | ForEach-Object {
    Write-Host "  - $_" -ForegroundColor White
}

# Test all required services
Write-Host ""
Write-Host "Testing AWS services access..." -ForegroundColor Yellow

$services = @(
    @{ Name = "S3"; Command = "aws s3 ls --profile cloudnestle-dev" },
    @{ Name = "CloudFormation"; Command = "aws cloudformation list-stacks --max-items 1 --profile cloudnestle-dev" },
    @{ Name = "Route53"; Command = "aws route53 list-hosted-zones --max-items 1 --profile cloudnestle-dev" }
)

$allServicesWork = $true
foreach ($service in $services) {
    try {
        Invoke-Expression $service.Command | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $($service.Name): Access verified" -ForegroundColor Green
        } else {
            Write-Host "❌ $($service.Name): Access denied" -ForegroundColor Red
            $allServicesWork = $false
        }
    } catch {
        Write-Host "❌ $($service.Name): Error - $($_.Exception.Message)" -ForegroundColor Red
        $allServicesWork = $false
    }
}

# Final summary
Write-Host ""
Write-Host "=== Configuration Complete ===" -ForegroundColor Cyan
Write-Host "✅ AWS CLI configured and working" -ForegroundColor Green
Write-Host "✅ Default region set to $region" -ForegroundColor Green
Write-Host "✅ cloudnestle-dev profile created" -ForegroundColor Green
Write-Host "✅ Environment variables file created" -ForegroundColor Green

if ($allServicesWork) {
    Write-Host "✅ All required AWS services accessible" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 AWS configuration is complete and ready for CDK deployment!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some AWS services may have access issues" -ForegroundColor Yellow
    Write-Host "   This might be due to IAM permissions. Check your user permissions." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up GitHub repository (Task 0.3)" -ForegroundColor White
Write-Host "2. Configure domain settings (Task 0.4)" -ForegroundColor White
Write-Host "3. Set up development tools (Task 0.5)" -ForegroundColor White