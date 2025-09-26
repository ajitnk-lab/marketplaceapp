@echo off
echo === Direct PowerShell Repair ===

echo Testing basic Windows commands...
echo Current directory: %CD%
echo Current user: %USERNAME%
echo Computer name: %COMPUTERNAME%
echo.

echo Attempting to repair PowerShell...
echo.

echo Method 1: Reset execution policy via registry...
reg add "HKCU\Software\Microsoft\PowerShell\1\ShellIds\Microsoft.PowerShell" /v ExecutionPolicy /t REG_SZ /d RemoteSigned /f
echo.

echo Method 2: System file checker...
echo Running SFC scan (this may take several minutes)...
sfc /scannow
echo.

echo Method 3: DISM repair...
echo Running DISM repair (this may take several minutes)...
DISM /Online /Cleanup-Image /RestoreHealth
echo.

echo Method 4: PowerShell reinstall via Windows Features...
echo Disabling and re-enabling PowerShell feature...
dism /online /disable-feature /featurename:MicrosoftWindowsPowerShellV2Root
dism /online /enable-feature /featurename:MicrosoftWindowsPowerShellV2Root
echo.

echo Method 5: Download PowerShell 7 directly...
echo Opening PowerShell 7 download page...
start https://github.com/PowerShell/PowerShell/releases/latest
echo.
echo Please download: PowerShell-7.x.x-win-x64.msi
echo Run it as Administrator
echo.

echo Testing PowerShell after fixes...
powershell -ExecutionPolicy Bypass -Command "Write-Host 'Test successful'; Get-Date"
echo.

echo If the above shows a date, PowerShell is working!
echo If not, please install PowerShell 7 from the opened webpage.
echo.
pause