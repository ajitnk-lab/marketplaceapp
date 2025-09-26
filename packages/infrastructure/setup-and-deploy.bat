@echo off
setlocal enabledelayedexpansion

echo === Marketplace Platform - Complete Setup and Deployment ===
echo.

REM Define paths
set NODE_PATH=C:\Program Files\nodejs
set NODE_EXE=%NODE_PATH%\node.exe
set NPM_CMD=%NODE_PATH%\npm.cmd
set NPX_CMD=%NODE_PATH%\npx.cmd

echo === Step 1: Verify Node.js Installation ===
if not exist "%NODE_EXE%" (
    echo ERROR: Node.js not found at %NODE_EXE%
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found at: %NODE_PATH%
echo Testing Node.js...
"%NODE_EXE%" --version
if errorlevel 1 (
    echo ERROR: Node.js is not working properly!
    pause
    exit /b 1
)

echo Testing npm...
"%NPM_CMD%" --version
if errorlevel 1 (
    echo ERROR: npm is not working properly!
    pause
    exit /b 1
)

echo.
echo === Step 2: Fix PATH Environment Variable ===
echo Current PATH (first 200 chars): %PATH:~0,200%...
echo.
echo Adding Node.js to PATH for this session...
set PATH=%NODE_PATH%;%PATH%

REM Test if node/npm work without full path now
echo Testing node command without full path...
node --version 2>nul
if errorlevel 1 (
    echo WARNING: node command still not in PATH, will use full paths
    set USE_FULL_PATHS=1
) else (
    echo SUCCESS: node command working in PATH
    set USE_FULL_PATHS=0
)

echo.
echo === Step 3: Install Global CDK CLI ===
echo Installing AWS CDK CLI globally...
if !USE_FULL_PATHS!==1 (
    "%NPM_CMD%" install -g aws-cdk
) else (
    npm install -g aws-cdk
)

if errorlevel 1 (
    echo WARNING: Global CDK install failed, will use npx
    set USE_NPX_CDK=1
) else (
    echo SUCCESS: CDK installed globally
    set USE_NPX_CDK=0
)

echo.
echo === Step 4: Install Project Dependencies ===
echo Installing package dependencies...
if !USE_FULL_PATHS!==1 (
    "%NPM_CMD%" install
) else (
    npm install
)

if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo === Step 5: Install Lambda Layer Dependencies ===
echo Installing lambda layer dependencies...
pushd lambda-layers\common\nodejs
if !USE_FULL_PATHS!==1 (
    "%NPM_CMD%" install
) else (
    npm install
)
if errorlevel 1 (
    echo ERROR: Failed to install lambda layer dependencies!
    popd
    pause
    exit /b 1
)
popd

echo.
echo === Step 6: Build TypeScript ===
echo Building TypeScript code...
if !USE_FULL_PATHS!==1 (
    "%NPM_CMD%" run build
) else (
    npm run build
)

if errorlevel 1 (
    echo ERROR: TypeScript build failed!
    pause
    exit /b 1
)

echo.
echo === Step 7: Test CDK ===
echo Testing CDK installation...
if !USE_NPX_CDK!==1 (
    if !USE_FULL_PATHS!==1 (
        "%NPX_CMD%" cdk --version
    ) else (
        npx cdk --version
    )
) else (
    cdk --version
)

if errorlevel 1 (
    echo ERROR: CDK is not working properly!
    pause
    exit /b 1
)

echo.
echo === Step 8: Synthesize CDK Templates ===
echo Synthesizing CloudFormation templates...
if !USE_NPX_CDK!==1 (
    if !USE_FULL_PATHS!==1 (
        "%NPX_CMD%" cdk synth --context stage=dev
    ) else (
        npx cdk synth --context stage=dev
    )
) else (
    cdk synth --context stage=dev
)

if errorlevel 1 (
    echo ERROR: CDK synthesis failed!
    echo Check the error messages above for details.
    pause
    exit /b 1
)

echo.
echo === SUCCESS: Setup Complete! ===
echo.
echo Next steps:
echo 1. Configure AWS credentials: aws configure
echo 2. Bootstrap CDK (first time): 
if !USE_NPX_CDK!==1 (
    if !USE_FULL_PATHS!==1 (
        echo    "%NPX_CMD%" cdk bootstrap
    ) else (
        echo    npx cdk bootstrap
    )
) else (
    echo    cdk bootstrap
)
echo 3. Deploy infrastructure:
if !USE_NPX_CDK!==1 (
    if !USE_FULL_PATHS!==1 (
        echo    "%NPX_CMD%" cdk deploy --all --context stage=dev
    ) else (
        echo    npx cdk deploy --all --context stage=dev
    )
) else (
    echo    cdk deploy --all --context stage=dev
)
echo.
echo Infrastructure is ready for deployment!
echo.
pause