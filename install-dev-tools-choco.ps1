# Install Development Tools using Chocolatey
Write-Host "🍫 Installing Development Tools using Chocolatey..." -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  This script requires Administrator privileges" -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Check if Chocolatey is installed
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Chocolatey package manager..." -ForegroundColor Yellow
    
    # Install Chocolatey
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # Refresh environment
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
    
    Write-Host "✅ Chocolatey installed successfully" -ForegroundColor Green
}

# Install development tools
$tools = @(
    @{Name="nodejs"; Description="Node.js v18+"},
    @{Name="git"; Description="Git version control"},
    @{Name="awscli"; Description="AWS CLI"},
    @{Name="vscode"; Description="Visual Studio Code"}
)

foreach ($tool in $tools) {
    Write-Host "📦 Installing $($tool.Description)..." -ForegroundColor Yellow
    
    try {
        choco install $tool.Name -y --force
        Write-Host "✅ $($tool.Description) installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install $($tool.Description): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Refresh environment variables
Write-Host "🔄 Refreshing environment variables..." -ForegroundColor Yellow
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")

# Install AWS CDK globally
Write-Host "📦 Installing AWS CDK globally..." -ForegroundColor Yellow
try {
    npm install -g aws-cdk
    Write-Host "✅ AWS CDK installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install AWS CDK: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Development tools installation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Installed tools:" -ForegroundColor Cyan
Write-Host "- Node.js and npm" -ForegroundColor White
Write-Host "- Git" -ForegroundColor White
Write-Host "- AWS CLI" -ForegroundColor White
Write-Host "- AWS CDK" -ForegroundColor White
Write-Host "- Visual Studio Code" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your terminal/VS Code" -ForegroundColor White
Write-Host "2. Run: .\setup-dev-env.ps1" -ForegroundColor White
Write-Host "3. Configure AWS: aws configure" -ForegroundColor White