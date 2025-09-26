@echo off
echo === PowerShell Reinstallation Script ===
echo.
echo This script will help reinstall PowerShell to fix command output issues.
echo.

echo Step 1: Checking current PowerShell version...
powershell -Command "$PSVersionTable.PSVersion"
echo.

echo Step 2: Downloading PowerShell 7 (latest stable)...
echo Opening PowerShell download page...
start https://github.com/PowerShell/PowerShell/releases/latest

echo.
echo Step 3: Alternative - Install via winget (if available)...
winget install Microsoft.PowerShell
if errorlevel 1 (
    echo winget not available or failed. Please download manually from the opened webpage.
)

echo.
echo Step 4: Alternative - Install via Chocolatey (if available)...
choco install powershell-core
if errorlevel 1 (
    echo Chocolatey not available or failed.
)

echo.
echo === Manual Installation Instructions ===
echo 1. Download PowerShell from: https://github.com/PowerShell/PowerShell/releases/latest
echo 2. Look for: PowerShell-7.x.x-win-x64.msi
echo 3. Run the installer as Administrator
echo 4. Restart your terminal/IDE after installation
echo.

echo === Alternative: Reset Windows PowerShell ===
echo If you prefer to fix Windows PowerShell instead:
echo 1. Run as Administrator: sfc /scannow
echo 2. Run as Administrator: DISM /Online /Cleanup-Image /RestoreHealth
echo 3. Reset PowerShell execution policy: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
echo.

pause