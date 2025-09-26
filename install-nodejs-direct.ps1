# Direct Node.js Installation Script
Write-Host "Installing Node.js directly..." -ForegroundColor Green

# Create temp directory
$tempDir = "$env:TEMP\nodejs-install"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Download Node.js LTS installer
$nodeUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
$installerPath = "$tempDir\nodejs-installer.msi"

Write-Host "Downloading Node.js v20.18.0..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath -UseBasicParsing

Write-Host "Installing Node.js..." -ForegroundColor Yellow
Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait

# Clean up
Remove-Item $tempDir -Recurse -Force

Write-Host "Node.js installation completed!" -ForegroundColor Green
Write-Host "Refreshing PATH..." -ForegroundColor Yellow

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Installation complete!" -ForegroundColor Green