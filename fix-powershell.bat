@echo off
echo === PowerShell Fix Script ===
echo Running as Administrator is recommended for best results.
echo.

echo Step 1: Checking PowerShell execution policy...
powershell -Command "Get-ExecutionPolicy -List"
echo.

echo Step 2: Resetting PowerShell execution policy...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
echo.

echo Step 3: Clearing PowerShell module cache...
powershell -Command "Remove-Module * -Force -ErrorAction SilentlyContinue"
echo.

echo Step 4: Testing basic PowerShell functionality...
powershell -Command "Write-Host 'PowerShell Test: ' -NoNewline; Get-Date; Write-Host 'Environment test: ' -NoNewline; $env:COMPUTERNAME"
echo.

echo Step 5: Testing Node.js through PowerShell...
powershell -Command "& 'C:\Program Files\nodejs\node.exe' --version"
echo.

echo Step 6: Refreshing environment variables...
powershell -Command "$env:PATH = [System.Environment]::GetEnvironmentVariable('PATH','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH','User'); Write-Host 'PATH refreshed'"
echo.

echo Step 7: Testing npm through PowerShell...
powershell -Command "& 'C:\Program Files\nodejs\npm.cmd' --version"
echo.

echo If the above tests work, PowerShell should be fixed.
echo If not, consider reinstalling PowerShell using reinstall-powershell.bat
echo.
pause