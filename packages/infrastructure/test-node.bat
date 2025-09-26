@echo off
echo Testing Node.js installation...
"C:\Program Files\nodejs\node.exe" --version
"C:\Program Files\nodejs\npm.cmd" --version
echo.
echo Building infrastructure...
"C:\Program Files\nodejs\npm.cmd" run build
echo.
echo Synthesizing CDK...
"C:\Program Files\nodejs\npx.cmd" cdk list
pause