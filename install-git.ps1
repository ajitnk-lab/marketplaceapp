# Git Installation Script for Windows
# This script downloads and installs Git for Windows with proper configuration

Write-Host "=== Git Installation for Cloud Nestle Website ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  This script should be run as Administrator for best results." -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Check if Git is already installed
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git is already installed: $gitVersion" -ForegroundColor Green
        Write-Host "No installation needed." -ForegroundColor Green
        exit 0
    }
} catch {
    # Git not found, proceed with installation
}

Write-Host "Git is not installed. Starting installation..." -ForegroundColor Yellow
Write-Host ""

# Method 1: Try using winget (Windows Package Manager)
Write-Host "Attempting installation via Windows Package Manager (winget)..." -ForegroundColor Yellow

try {
    $wingetCheck = winget --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ winget is available" -ForegroundColor Green
        
        Write-Host "Installing Git via winget..." -ForegroundColor Yellow
        winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Git installed successfully via winget" -ForegroundColor Green
            
            # Refresh environment variables
            Write-Host "Refreshing environment variables..." -ForegroundColor Yellow
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            # Test installation
            try {
                $gitVersion = git --version 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Git installation verified: $gitVersion" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "🎉 Git installation complete!" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "Next steps:" -ForegroundColor Cyan
                    Write-Host "1. Close and reopen your terminal/PowerShell" -ForegroundColor White
                    Write-Host "2. Configure Git with your name and email:" -ForegroundColor White
                    Write-Host "   git config --global user.name 'Your Name'" -ForegroundColor Gray
                    Write-Host "   git config --global user.email 'your.email@example.com'" -ForegroundColor Gray
                    Write-Host "3. Run the GitHub setup script: .\setup-github-project.ps1" -ForegroundColor White
                    exit 0
                } else {
                    throw "Git command not found after installation"
                }
            } catch {
                Write-Host "⚠️  Git installed but not in PATH. Please restart your terminal." -ForegroundColor Yellow
                exit 0
            }
        } else {
            throw "winget installation failed"
        }
    } else {
        throw "winget not available"
    }
} catch {
    Write-Host "⚠️  winget installation failed or not available" -ForegroundColor Yellow
    Write-Host "Trying alternative installation method..." -ForegroundColor Yellow
}

# Method 2: Try using Chocolatey
Write-Host ""
Write-Host "Attempting installation via Chocolatey..." -ForegroundColor Yellow

try {
    $chocoCheck = choco --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Chocolatey is available" -ForegroundColor Green
        
        Write-Host "Installing Git via Chocolatey..." -ForegroundColor Yellow
        choco install git -y
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Git installed successfully via Chocolatey" -ForegroundColor Green
            
            # Refresh environment
            refreshenv
            
            # Test installation
            try {
                $gitVersion = git --version 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Git installation verified: $gitVersion" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "🎉 Git installation complete!" -ForegroundColor Green
                    exit 0
                } else {
                    throw "Git command not found after installation"
                }
            } catch {
                Write-Host "⚠️  Git installed but not in PATH. Please restart your terminal." -ForegroundColor Yellow
                exit 0
            }
        } else {
            throw "Chocolatey installation failed"
        }
    } else {
        throw "Chocolatey not available"
    }
} catch {
    Write-Host "⚠️  Chocolatey installation failed or not available" -ForegroundColor Yellow
}

# Method 3: Manual download and install
Write-Host ""
Write-Host "Attempting manual download and installation..." -ForegroundColor Yellow

try {
    # Create temp directory
    $tempDir = "$env:TEMP\GitInstaller"
    if (-not (Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    }
    
    # Download Git installer
    $gitUrl = "https://github.com/git-for-windows/git/releases/latest/download/Git-2.43.0-64-bit.exe"
    $installerPath = "$tempDir\Git-Installer.exe"
    
    Write-Host "Downloading Git installer..." -ForegroundColor Yellow
    Write-Host "URL: $gitUrl" -ForegroundColor Gray
    
    # Use System.Net.WebClient for download
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($gitUrl, $installerPath)
    
    if (Test-Path $installerPath) {
        Write-Host "✅ Git installer downloaded" -ForegroundColor Green
        
        # Run installer silently
        Write-Host "Running Git installer..." -ForegroundColor Yellow
        Write-Host "This may take a few minutes..." -ForegroundColor Gray
        
        $installArgs = @(
            "/VERYSILENT"
            "/NORESTART"
            "/COMPONENTS=icons,ext\reg\shellhere,assoc,assoc_sh"
            "/TASKS=desktopicon,quicklaunchicon,addcontextmenufiles,addcontextmenufolders,associateshfiles"
        )
        
        Start-Process -FilePath $installerPath -ArgumentList $installArgs -Wait -NoNewWindow
        
        Write-Host "✅ Git installer completed" -ForegroundColor Green
        
        # Clean up
        Remove-Item $installerPath -Force -ErrorAction SilentlyContinue
        Remove-Item $tempDir -Force -Recurse -ErrorAction SilentlyContinue
        
        # Refresh environment variables
        Write-Host "Refreshing environment variables..." -ForegroundColor Yellow
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Test installation
        Start-Sleep -Seconds 2
        try {
            $gitVersion = git --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Git installation verified: $gitVersion" -ForegroundColor Green
                Write-Host ""
                Write-Host "🎉 Git installation complete!" -ForegroundColor Green
            } else {
                throw "Git command not found after installation"
            }
        } catch {
            Write-Host "⚠️  Git installed but may require terminal restart" -ForegroundColor Yellow
            Write-Host "Please close and reopen your PowerShell/terminal window" -ForegroundColor Yellow
        }
        
    } else {
        throw "Failed to download Git installer"
    }
    
} catch {
    Write-Host "❌ Manual installation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Final instructions
Write-Host ""
Write-Host "=== Installation Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If Git is still not recognized:" -ForegroundColor Yellow
Write-Host "1. Close this PowerShell window completely" -ForegroundColor White
Write-Host "2. Open a new PowerShell window" -ForegroundColor White
Write-Host "3. Test with: git --version" -ForegroundColor White
Write-Host ""
Write-Host "If you still have issues:" -ForegroundColor Yellow
Write-Host "1. Download Git manually from: https://git-scm.com/download/win" -ForegroundColor White
Write-Host "2. Run the installer and make sure 'Add Git to PATH' is selected" -ForegroundColor White
Write-Host "3. Restart your computer if necessary" -ForegroundColor White
Write-Host ""
Write-Host "Next steps after Git is working:" -ForegroundColor Cyan
Write-Host "1. Configure Git:" -ForegroundColor White
Write-Host "   git config --global user.name 'Your Name'" -ForegroundColor Gray
Write-Host "   git config --global user.email 'your.email@example.com'" -ForegroundColor Gray
Write-Host "2. Run: .\setup-github-project.ps1" -ForegroundColor White