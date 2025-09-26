# Development Environment Setup Script for Marketplace Platform
Write-Host "Setting up development environment for Marketplace Platform..." -ForegroundColor Green
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    
    # Check if version is 18 or higher
    $version = $nodeVersion -replace 'v', ''
    $majorVersion = [int]($version.Split('.')[0])
    if ($majorVersion -lt 18) {
        Write-Host "Warning: Node.js version should be 18 or higher" -ForegroundColor Red
    }
} else {
    Write-Host "Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "npm is not available" -ForegroundColor Red
    exit 1
}

# Check Git
Write-Host "Checking Git installation..." -ForegroundColor Yellow
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host "$gitVersion" -ForegroundColor Green
} else {
    Write-Host "Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/" -ForegroundColor Yellow
    exit 1
}

# Check AWS CLI
Write-Host "Checking AWS CLI installation..." -ForegroundColor Yellow
if (Test-Command "aws") {
    $awsVersion = aws --version
    Write-Host "$awsVersion" -ForegroundColor Green
} else {
    Write-Host "AWS CLI is not installed" -ForegroundColor Red
    Write-Host "Please install AWS CLI from https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Install AWS CDK
Write-Host "Installing AWS CDK globally..." -ForegroundColor Yellow
try {
    npm install -g aws-cdk
    Write-Host "AWS CDK installed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to install AWS CDK" -ForegroundColor Red
    exit 1
}

# Check CDK installation
Write-Host "Checking CDK installation..." -ForegroundColor Yellow
if (Test-Command "cdk") {
    $cdkVersion = cdk --version
    Write-Host "CDK version: $cdkVersion" -ForegroundColor Green
} else {
    Write-Host "CDK installation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure AWS credentials: aws configure" -ForegroundColor White
Write-Host "2. Test AWS access: aws sts get-caller-identity" -ForegroundColor White
Write-Host "3. Bootstrap CDK: cdk bootstrap" -ForegroundColor White
Write-Host ""