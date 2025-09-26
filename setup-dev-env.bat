@echo off
echo Setting up development environment for Marketplace Platform...
echo.

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js v18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo npm is not available
    pause
    exit /b 1
)

echo Checking Git installation...
git --version
if %errorlevel% neq 0 (
    echo Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo Checking AWS CLI installation...
aws --version
if %errorlevel% neq 0 (
    echo AWS CLI is not installed
    echo Please install AWS CLI from https://aws.amazon.com/cli/
    pause
    exit /b 1
)

echo Installing AWS CDK globally...
npm install -g aws-cdk
if %errorlevel% neq 0 (
    echo Failed to install AWS CDK
    pause
    exit /b 1
)

echo Checking CDK installation...
cdk --version
if %errorlevel% neq 0 (
    echo CDK installation failed
    pause
    exit /b 1
)

echo.
echo Development environment setup complete!
echo.
echo Next steps:
echo 1. Configure AWS credentials: aws configure
echo 2. Test AWS access: aws sts get-caller-identity
echo 3. Bootstrap CDK: cdk bootstrap
echo.
pause