@echo off
echo === Marketplace Infrastructure Deployment ===
echo.

set NODE_PATH="C:\Program Files\nodejs"
set NODE_EXE=%NODE_PATH%\node.exe
set NPM_CMD=%NODE_PATH%\npm.cmd
set NPX_CMD=%NODE_PATH%\npx.cmd

echo Testing Node.js installation...
%NODE_EXE% --version
if errorlevel 1 (
    echo ERROR: Node.js not found or not working!
    pause
    exit /b 1
)

echo Testing npm...
%NPM_CMD% --version
if errorlevel 1 (
    echo ERROR: npm not found or not working!
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
%NPM_CMD% install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo Installing lambda layer dependencies...
cd lambda-layers\common\nodejs
%NPM_CMD% install
cd ..\..\..

echo.
echo Building TypeScript...
%NPM_CMD% run build
if errorlevel 1 (
    echo ERROR: TypeScript build failed!
    pause
    exit /b 1
)

echo.
echo Synthesizing CDK templates...
%NPX_CMD% cdk synth --context stage=dev
if errorlevel 1 (
    echo ERROR: CDK synthesis failed!
    pause
    exit /b 1
)

echo.
echo === Synthesis Complete ===
echo To deploy: %NPX_CMD% cdk deploy --all --context stage=dev
echo To bootstrap (first time): %NPX_CMD% cdk bootstrap
echo.
pause