@echo off
echo === System Diagnostic Report ===
echo.
echo Current Date/Time:
date /t
time /t
echo.
echo === Testing Basic Commands ===
echo Testing DIR command:
dir "C:\Program Files\nodejs" 2>nul
echo.
echo === Testing Node.js Direct Path ===
echo Node.js version:
"C:\Program Files\nodejs\node.exe" --version 2>nul
echo npm version:
"C:\Program Files\nodejs\npm.cmd" --version 2>nul
echo.
echo === Environment Variables ===
echo PATH variable (first 500 chars):
echo %PATH:~0,500%
echo.
echo === PowerShell Test ===
powershell -Command "Write-Host 'PowerShell is working'; Get-Date"
echo.
echo === CDK Test ===
"C:\Program Files\nodejs\npx.cmd" cdk --version 2>nul
echo.
echo === End Diagnostic ===
pause