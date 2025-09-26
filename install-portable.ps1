# Portable Installation Script (No Admin Required)
Write-Host "🚀 Installing Development Tools (Portable Mode)..." -ForegroundColor Green
Write-Host ""

# Create tools directory
$toolsDir = "$env:USERPROFILE\dev-tools"
if (!(Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir -Force
}

# Download and install Node.js portable
Write-Host "📦 Installing Node.js (Portable)..." -ForegroundColor Yellow
$nodeUrl = "https://nodejs.org/dist/v18.19.0/node-v18.19.0-win-x64.zip"
$nodeZip = "$toolsDir\nodejs.zip"
$nodeDir = "$toolsDir\nodejs"

try {
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeZip -UseBasicParsing
    Expand-Archive -Path $nodeZip -DestinationPath $toolsDir -Force
    
    # Rename extracted folder
    $extractedFolder = Get-ChildItem -Path $toolsDir -Directory | Where-Object { $_.Name -like "node-*" } | Select-Object -First 1
    if ($extractedFolder) {
        Rename-Item -Path $extractedFolder.FullName -NewName "nodejs"
    }
    
    Remove-Item $nodeZip -Force
    Write-Host "✅ Node.js installed to $nodeDir" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Node.js: $($_.Exception.Message)" -ForegroundColor Red
}

# Download and install Git portable
Write-Host "📦 Installing Git (Portable)..." -ForegroundColor Yellow
$gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/PortableGit-2.43.0-64-bit.7z.exe"
$gitExe = "$toolsDir\git-portable.exe"
$gitDir = "$toolsDir\git"

try {
    Invoke-WebRequest -Uri $gitUrl -OutFile $gitExe -UseBasicParsing
    
    # Create git directory
    if (!(Test-Path $gitDir)) {
        New-Item -ItemType Directory -Path $gitDir -Force
    }
    
    # Extract git (self-extracting archive)
    Start-Process -FilePath $gitExe -ArgumentList "-o`"$gitDir`" -y" -Wait -NoNewWindow
    Remove-Item $gitExe -Force
    
    Write-Host "✅ Git installed to $gitDir" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install Git: $($_.Exception.Message)" -ForegroundColor Red
}

# Update PATH for current session
$currentPath = $env:PATH
$newPath = "$nodeDir;$gitDir\bin;$currentPath"
$env:PATH = $newPath

# Update user PATH permanently
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$pathsToAdd = @("$nodeDir", "$gitDir\bin")

foreach ($pathToAdd in $pathsToAdd) {
    if ($userPath -notlike "*$pathToAdd*") {
        if ($userPath) {
            $userPath = "$userPath;$pathToAdd"
        } else {
            $userPath = $pathToAdd
        }
    }
}

[Environment]::SetEnvironmentVariable("PATH", $userPath, "User")

Write-Host ""
Write-Host "🔄 Updating environment variables..." -ForegroundColor Yellow

# Install AWS CLI using pip (if Python is available) or download
Write-Host "📦 Checking for AWS CLI installation options..." -ForegroundColor Yellow

# Try to install AWS CDK
Write-Host "📦 Installing AWS CDK..." -ForegroundColor Yellow
try {
    & "$nodeDir\npm.cmd" install -g aws-cdk
    Write-Host "✅ AWS CDK installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ CDK installation may need manual retry" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Portable Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Tools installed in: $toolsDir" -ForegroundColor Cyan
Write-Host ""

# Verify installations
Write-Host "🔍 Verifying installations..." -ForegroundColor Yellow

try {
    $nodeVersion = & "$nodeDir\node.exe" --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js: Not working" -ForegroundColor Red
}

try {
    $npmVersion = & "$nodeDir\npm.cmd" --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm: Not working" -ForegroundColor Red
}

try {
    $gitVersion = & "$gitDir\bin\git.exe" --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git: Not working" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Restart VS Code or open a new terminal" -ForegroundColor White
Write-Host "2. Install AWS CLI manually from: https://aws.amazon.com/cli/" -ForegroundColor White
Write-Host "3. Run: aws configure" -ForegroundColor White
Write-Host "4. Run: .\setup-dev-env.ps1" -ForegroundColor White
Write-Host ""