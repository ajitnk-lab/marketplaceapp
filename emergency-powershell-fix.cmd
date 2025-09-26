@echo off
echo === Emergency PowerShell Fix ===
echo.

echo Step 1: Testing current PowerShell...
powershell -Command "Write-Host 'PowerShell Test'; $PSVersionTable.PSVersion"
echo.

echo Step 2: Resetting PowerShell execution policy...
powershell -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
echo.

echo Step 3: Clearing PowerShell cache...
powershell -ExecutionPolicy Bypass -Command "Remove-Module * -Force -ErrorAction SilentlyContinue"
echo.

echo Step 4: Testing PowerShell with bypass...
powershell -ExecutionPolicy Bypass -Command "Write-Host 'PowerShell Bypass Test: SUCCESS'; Get-Date"
echo.

echo Step 5: Installing PowerShell 7 via winget...
winget install Microsoft.PowerShell --accept-source-agreements --accept-package-agreements
if errorlevel 1 (
    echo winget failed, trying chocolatey...
    choco install powershell-core -y
    if errorlevel 1 (
        echo Both winget and chocolatey failed.
        echo Please download PowerShell 7 manually from:
        echo https://github.com/PowerShell/PowerShell/releases/latest
        echo Look for: PowerShell-7.x.x-win-x64.msi
    )
)
echo.

echo Step 6: Testing PowerShell 7...
pwsh -Command "Write-Host 'PowerShell 7 Test: SUCCESS'; $PSVersionTable.PSVersion"
echo.

echo Step 7: System file check (may take a few minutes)...
sfc /scannow
echo.

echo === PowerShell Fix Complete ===
echo.
echo If PowerShell 7 is working, use 'pwsh' instead of 'powershell'
echo If Windows PowerShell is fixed, continue using 'powershell'
echo.
pause