@echo off
echo === Marketplace Platform - Complete Setup ===
echo This script will set up everything needed for deployment
echo.

echo Step 1: Verifying current setup...
call verify-setup.bat
echo.

echo Step 2: Setting up Node.js, npm, and CDK...
call setup-and-deploy.bat
if errorlevel 1 (
    echo ERROR: Setup failed!
    pause
    exit /b 1
)
echo.

echo Step 3: Setting up AWS and deploying...
call setup-aws-and-deploy.bat
if errorlevel 1 (
    echo ERROR: AWS setup or deployment failed!
    pause
    exit /b 1
)

echo.
echo === COMPLETE SETUP FINISHED ===
echo Your Marketplace Platform infrastructure should now be deployed!
echo.
pause