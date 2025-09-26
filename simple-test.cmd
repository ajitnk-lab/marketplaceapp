@echo off
echo === Simple Test ===
echo This is a basic CMD test
echo Current time: %TIME%
echo Current date: %DATE%
echo.
echo Testing PowerShell with minimal command...
powershell -Command "1+1"
echo.
echo Testing PowerShell with Write-Output...
powershell -Command "Write-Output 'Hello World'"
echo.
echo Testing PowerShell with echo...
powershell -Command "echo 'Hello from PowerShell'"
echo.
echo End of test
pause