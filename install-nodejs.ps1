# Automated Node.js Installation Script
Write-Host "🚀 Installing Node.js v18+ for Marketplace Platform Development..." -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  This script requires Administrator privileges to install Node.js" -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Download and install manually from https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

# Define Node.js version and download URL
$nodeVersion = "18.19.0"
$nodeUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

try {
    # Download Node.js installer
    Write-Host "📥 Downloading Node.js v$nodeVersion..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath -UseBasicParsing
    
    if (Test-Path $installerPath) {
        Write-Host "✅ Download completed successfully" -ForegroundColor Green
        
        # Install Node.js silently
        Write-Host "🔧 Installing Node.js..." -ForegroundColor Yellow
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait
        
        # Clean up installer
        Remove-Item $installerPath -Force
        
        # Refresh environment variables
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        
        Write-Host "✅ Node.js installation completed!" -ForegroundColor Green
        Write-Host ""
        
        # Verify installation
        Write-Host "🔍 Verifying installation..." -ForegroundColor Yellow
        
        # Wait a moment for PATH to update
        Start-Sleep -Seconds 3
        
        try {
            $nodeVersionOutput = & node --version 2>$null
            $npmVersionOutput = & npm --version 2>$null
            
            if ($nodeVersionOutput -and $npmVersionOutput) {
                Write-Host "✅ Node.js version: $nodeVersionOutput" -ForegroundColor Green
                Write-Host "✅ npm version: $npmVersionOutput" -ForegroundColor Green
                Write-Host ""
                Write-Host "🎉 Installation successful! You can now run the development setup." -ForegroundColor Green
                Write-Host "Run: .\setup-dev-env.ps1" -ForegroundColor Cyan
            } else {
                Write-Host "⚠️  Installation completed but Node.js not found in PATH" -ForegroundColor Yellow
                Write-Host "Please restart your terminal or VS Code and try again." -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️  Installation completed but verification failed" -ForegroundColor Yellow
            Write-Host "Please restart your terminal or VS Code and try again." -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "❌ Failed to download Node.js installer" -ForegroundColor Red
        Write-Host "Please download manually from https://nodejs.org/" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual installation steps:" -ForegroundColor Yellow
    Write-Host "1. Go to https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the Windows Installer (.msi)" -ForegroundColor White
    Write-Host "3. Run the installer as Administrator" -ForegroundColor White
    Write-Host "4. Restart your terminal/VS Code" -ForegroundColor White
}