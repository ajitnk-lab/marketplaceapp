@echo off
echo === Marketplace Platform - Setup Verification ===
echo.

set NODE_PATH=C:\Program Files\nodejs
set NODE_EXE=%NODE_PATH%\node.exe
set NPM_CMD=%NODE_PATH%\npm.cmd
set NPX_CMD=%NODE_PATH%\npx.cmd

echo === Testing Node.js ===
echo Node.js path: %NODE_EXE%
if exist "%NODE_EXE%" (
    echo ✓ Node.js executable found
    "%NODE_EXE%" --version
    echo ✓ Node.js version check passed
) else (
    echo ✗ Node.js executable NOT found
    echo Please install Node.js from https://nodejs.org/
)
echo.

echo === Testing npm ===
if exist "%NPM_CMD%" (
    echo ✓ npm executable found
    "%NPM_CMD%" --version
    echo ✓ npm version check passed
) else (
    echo ✗ npm executable NOT found
)
echo.

echo === Testing CDK ===
"%NPX_CMD%" cdk --version 2>nul
if errorlevel 1 (
    echo ✗ CDK not available via npx
    echo Installing CDK...
    "%NPM_CMD%" install -g aws-cdk
) else (
    echo ✓ CDK available via npx
)
echo.

echo === Testing AWS CLI ===
aws --version 2>nul
if errorlevel 1 (
    echo ✗ AWS CLI not found
    echo Please install from: https://aws.amazon.com/cli/
) else (
    echo ✓ AWS CLI found
    aws sts get-caller-identity 2>nul
    if errorlevel 1 (
        echo ✗ AWS credentials not configured
        echo Run: aws configure
    ) else (
        echo ✓ AWS credentials configured
    )
)
echo.

echo === Testing Project Structure ===
if exist "package.json" (
    echo ✓ package.json found
) else (
    echo ✗ package.json NOT found - are you in the right directory?
)

if exist "bin\marketplace-platform.ts" (
    echo ✓ CDK app entry point found
) else (
    echo ✗ CDK app entry point NOT found
)

if exist "lib\marketplace-infrastructure-stack.ts" (
    echo ✓ Infrastructure stack found
) else (
    echo ✗ Infrastructure stack NOT found
)

if exist "lambda\users\index.js" (
    echo ✓ Lambda functions found
) else (
    echo ✗ Lambda functions NOT found
)
echo.

echo === Testing Dependencies ===
if exist "node_modules" (
    echo ✓ node_modules directory exists
) else (
    echo ✗ node_modules NOT found - run npm install
)

if exist "lambda-layers\common\nodejs\node_modules" (
    echo ✓ Lambda layer dependencies installed
) else (
    echo ✗ Lambda layer dependencies NOT installed
)
echo.

echo === Summary ===
echo If all items show ✓, you're ready to deploy!
echo If any items show ✗, please fix them first.
echo.
echo Next steps:
echo 1. Run setup-and-deploy.bat to build and synthesize
echo 2. Run setup-aws-and-deploy.bat to deploy to AWS
echo.
pause