# AWS Setup Verification Script for Cloud Nestle Website
# This script verifies AWS credentials and permissions

Write-Host "=== AWS Setup Verification ===" -ForegroundColor Cyan
Write-Host ""

$allGood = $true
$results = @()

# Function to test AWS command
function Test-AWSCommand {
    param($Command, $Profile = $null)
    try {
        if ($Profile) {
            $output = Invoke-Expression "$Command --profile $Profile" 2>&1
        } else {
            $output = Invoke-Expression $Command 2>&1
        }
        
        if ($LASTEXITCODE -eq 0) {
            return @{ Success = $true; Output = $output }
        } else {
            return @{ Success = $false; Output = $output }
        }
    } catch {
        return @{ Success = $false; Output = $_.Exception.Message }
    }
}

# Check if AWS CLI is available
Write-Host "Checking AWS CLI availability..." -ForegroundColor Yellow
$awsCheck = Test-AWSCommand "aws --version"
if ($awsCheck.Success) {
    Write-Host "✅ AWS CLI: $($awsCheck.Output)" -ForegroundColor Green
    $results += "✅ AWS CLI: Available"
} else {
    Write-Host "❌ AWS CLI: Not available" -ForegroundColor Red
    $results += "❌ AWS CLI: Not available"
    $allGood = $false
    Write-Host "Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

# Check AWS profiles
Write-Host ""
Write-Host "Checking AWS profiles..." -ForegroundColor Yellow
$profilesCheck = Test-AWSCommand "aws configure list-profiles"
if ($profilesCheck.Success) {
    $profiles = $profilesCheck.Output -split "`n" | Where-Object { $_ -ne "" }
    Write-Host "Available profiles: $($profiles -join ', ')" -ForegroundColor Cyan
    $results += "Available profiles: $($profiles -join ', ')"
} else {
    Write-Host "⚠️  Could not list profiles" -ForegroundColor Yellow
    $results += "⚠️  Could not list profiles"
}

# Test default profile
Write-Host ""
Write-Host "Testing default AWS profile..." -ForegroundColor Yellow
$defaultTest = Test-AWSCommand "aws sts get-caller-identity"
if ($defaultTest.Success) {
    $identity = $defaultTest.Output | ConvertFrom-Json
    Write-Host "✅ Default profile works" -ForegroundColor Green
    Write-Host "   User: $($identity.Arn)" -ForegroundColor Cyan
    Write-Host "   Account: $($identity.Account)" -ForegroundColor Cyan
    $results += "✅ Default profile: $($identity.Arn)"
} else {
    Write-Host "❌ Default profile: Not configured or invalid" -ForegroundColor Red
    $results += "❌ Default profile: Not configured"
    $allGood = $false
}

# Test cloudnestle-dev profile if it exists
Write-Host ""
Write-Host "Testing cloudnestle-dev profile..." -ForegroundColor Yellow
$devTest = Test-AWSCommand "aws sts get-caller-identity" "cloudnestle-dev"
if ($devTest.Success) {
    $devIdentity = $devTest.Output | ConvertFrom-Json
    Write-Host "✅ cloudnestle-dev profile works" -ForegroundColor Green
    Write-Host "   User: $($devIdentity.Arn)" -ForegroundColor Cyan
    Write-Host "   Account: $($devIdentity.Account)" -ForegroundColor Cyan
    $results += "✅ cloudnestle-dev profile: $($devIdentity.Arn)"
} else {
    Write-Host "⚠️  cloudnestle-dev profile: Not configured" -ForegroundColor Yellow
    Write-Host "   You can create it with: aws configure --profile cloudnestle-dev" -ForegroundColor Yellow
    $results += "⚠️  cloudnestle-dev profile: Not configured"
}

# Test required AWS services access
Write-Host ""
Write-Host "Testing AWS services access..." -ForegroundColor Yellow

$services = @(
    @{ Name = "S3"; Command = "aws s3 ls" },
    @{ Name = "CloudFormation"; Command = "aws cloudformation list-stacks --max-items 1" },
    @{ Name = "Route53"; Command = "aws route53 list-hosted-zones --max-items 1" },
    @{ Name = "IAM"; Command = "aws iam get-user" }
)

foreach ($service in $services) {
    $serviceTest = Test-AWSCommand $service.Command
    if ($serviceTest.Success) {
        Write-Host "✅ $($service.Name): Access granted" -ForegroundColor Green
        $results += "✅ $($service.Name): Access granted"
    } else {
        Write-Host "❌ $($service.Name): Access denied or error" -ForegroundColor Red
        Write-Host "   Error: $($serviceTest.Output)" -ForegroundColor Red
        $results += "❌ $($service.Name): Access denied"
        $allGood = $false
    }
}

# Check region configuration
Write-Host ""
Write-Host "Checking region configuration..." -ForegroundColor Yellow
$regionCheck = Test-AWSCommand "aws configure get region"
if ($regionCheck.Success -and $regionCheck.Output.Trim() -ne "") {
    $region = $regionCheck.Output.Trim()
    Write-Host "✅ Default region: $region" -ForegroundColor Green
    $results += "✅ Default region: $region"
    
    if ($region -eq "us-east-1") {
        Write-Host "✅ Region is us-east-1 (recommended for global services)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Region is $region (us-east-1 recommended for CloudFront/ACM)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  No default region configured" -ForegroundColor Yellow
    Write-Host "   Run: aws configure" -ForegroundColor Yellow
    $results += "⚠️  No default region configured"
}

# Summary
Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
foreach ($result in $results) {
    Write-Host $result
}

Write-Host ""
if ($allGood) {
    Write-Host "🎉 AWS is properly configured and ready!" -ForegroundColor Green
    Write-Host "You can proceed with CDK deployment and other AWS operations." -ForegroundColor Green
} else {
    Write-Host "❌ AWS configuration needs attention." -ForegroundColor Red
    Write-Host "Please follow the aws-setup-guide.md to fix the issues." -ForegroundColor Red
}

# Save results to file
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportFile = "aws-verification-$timestamp.txt"
$results | Out-File -FilePath $reportFile -Encoding UTF8
Write-Host ""
Write-Host "Report saved to: $reportFile" -ForegroundColor Cyan

# Environment variables check
Write-Host ""
Write-Host "Environment Variables Check:" -ForegroundColor Yellow
if ($env:AWS_PROFILE) {
    Write-Host "✅ AWS_PROFILE: $env:AWS_PROFILE" -ForegroundColor Green
} else {
    Write-Host "⚠️  AWS_PROFILE not set (optional)" -ForegroundColor Yellow
}

if ($env:AWS_REGION) {
    Write-Host "✅ AWS_REGION: $env:AWS_REGION" -ForegroundColor Green
} else {
    Write-Host "⚠️  AWS_REGION not set (using default from config)" -ForegroundColor Yellow
}

# Return exit code
if ($allGood) { exit 0 } else { exit 1 }