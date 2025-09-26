# Automated Development Environment Installer
# This script will automatically install all required tools

Write-Host "🚀 Starting Automated Installation..." -ForegroundColor Green
Write-Host "Installing: Node.js, Git, AWS CLI, and AWS CDK" -ForegroundColor Yellow
Write-Host ""

# Set execution policy for current session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Install Chocolatey (Windows Package Manager) if not installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey package manager..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

Write-Host "✅ Chocolatey installed" -ForegroundColor Green

# Install Node.js (LTS version)
Write-Host "Installing Node.js..." -ForegroundColor Yellow
choco install nodejs-lts -y --force
Write-Host "✅ Node.js installed" -ForegroundColor Green

# Install Git
Write-Host "Installing Git..." -ForegroundColor Yellow
choco install git -y --force
Write-Host "✅ Git installed" -ForegroundColor Green

# Install AWS CLI
Write-Host "Installing AWS CLI..." -ForegroundColor Yellow
choco install awscli -y --force
Write-Host "✅ AWS CLI installed" -ForegroundColor Green

# Refresh environment variables
Write-Host "Refreshing environment variables..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Wait a moment for installations to complete
Start-Sleep -Seconds 5

# Install AWS CDK globally
Write-Host "Installing AWS CDK..." -ForegroundColor Yellow
try {
    npm install -g aws-cdk --force
    Write-Host "✅ AWS CDK installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ CDK installation may need manual retry after restart" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Verifying installations..." -ForegroundColor Yellow

# Verify installations
try {
    $nodeVersion = & node --version 2>$null
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js: Not found (restart terminal)" -ForegroundColor Red
}

try {
    $npmVersion = & npm --version 2>$null
    Write-Host "npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm: Not found (restart terminal)" -ForegroundColor Red
}

try {
    $gitVersion = & git --version 2>$null
    Write-Host "Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git: Not found (restart terminal)" -ForegroundColor Red
}

try {
    $awsVersion = & aws --version 2>$null
    Write-Host "AWS CLI: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "AWS CLI: Not found (restart terminal)" -ForegroundColor Red
}

try {
    $cdkVersion = & cdk --version 2>$null
    Write-Host "CDK: $cdkVersion" -ForegroundColor Green
} catch {
    Write-Host "CDK: Not found (restart terminal)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Restart VS Code or open a new terminal" -ForegroundColor White
Write-Host "2. Run: aws configure" -ForegroundColor White
Write-Host "3. Run: aws sts get-caller-identity" -ForegroundColor White
Write-Host "4. Run: cdk bootstrap" -ForegroundColor White
Write-Host ""