@echo off
setlocal enabledelayedexpansion

echo === AWS Setup and Marketplace Deployment ===
echo.

REM Define paths
set NODE_PATH=C:\Program Files\nodejs
set NPX_CMD=%NODE_PATH%\npx.cmd

echo === Step 1: Check AWS CLI ===
aws --version 2>nul
if errorlevel 1 (
    echo AWS CLI not found. Installing via winget...
    winget install Amazon.AWSCLI
    if errorlevel 1 (
        echo ERROR: Failed to install AWS CLI via winget
        echo Please install manually from: https://aws.amazon.com/cli/
        echo Then run this script again.
        pause
        exit /b 1
    )
    echo AWS CLI installed. Please restart this script.
    pause
    exit /b 0
)

echo AWS CLI found and working.
echo.

echo === Step 2: Check AWS Configuration ===
aws sts get-caller-identity 2>nul
if errorlevel 1 (
    echo AWS credentials not configured or invalid.
    echo.
    echo Please configure AWS credentials:
    echo 1. Run: aws configure
    echo 2. Enter your AWS Access Key ID
    echo 3. Enter your AWS Secret Access Key  
    echo 4. Enter your default region (e.g., us-east-1)
    echo 5. Enter default output format (json)
    echo.
    echo Or set environment variables:
    echo set AWS_ACCESS_KEY_ID=your-access-key
    echo set AWS_SECRET_ACCESS_KEY=your-secret-key
    echo set AWS_DEFAULT_REGION=us-east-1
    echo.
    pause
    echo Testing AWS configuration again...
    aws sts get-caller-identity
    if errorlevel 1 (
        echo ERROR: AWS credentials still not working
        echo Please configure AWS credentials and run this script again
        pause
        exit /b 1
    )
)

echo AWS credentials configured and working.
echo Current AWS identity:
aws sts get-caller-identity
echo.

echo === Step 3: Bootstrap CDK ===
echo Checking if CDK is bootstrapped...
"%NPX_CMD%" cdk list --context stage=dev 2>nul
if errorlevel 1 (
    echo CDK not bootstrapped or having issues.
    echo Bootstrapping CDK...
    "%NPX_CMD%" cdk bootstrap --context stage=dev
    if errorlevel 1 (
        echo ERROR: CDK bootstrap failed!
        echo Please check your AWS permissions and try again.
        pause
        exit /b 1
    )
)

echo CDK is bootstrapped and ready.
echo.

echo === Step 4: List CDK Stacks ===
echo Available stacks:
"%NPX_CMD%" cdk list --context stage=dev
echo.

echo === Step 5: Deploy Infrastructure ===
echo.
echo Ready to deploy the following stacks:
echo - MarketplaceInfrastructure-dev (VPC, S3, CloudFront)
echo - MarketplaceDatabase-dev (DynamoDB tables)
echo - MarketplaceApi-dev (API Gateway, Lambda functions)
echo - MarketplaceMonitoring-dev (CloudWatch dashboards, alarms)
echo.
set /p DEPLOY_CONFIRM="Deploy all stacks? (y/N): "
if /i "!DEPLOY_CONFIRM!"=="y" (
    echo.
    echo Deploying all stacks...
    "%NPX_CMD%" cdk deploy --all --context stage=dev --require-approval never
    if errorlevel 1 (
        echo ERROR: Deployment failed!
        echo Check the error messages above for details.
        pause
        exit /b 1
    )
    echo.
    echo === DEPLOYMENT SUCCESSFUL! ===
    echo.
    echo Stack outputs:
    "%NPX_CMD%" cdk list --context stage=dev
    echo.
    echo Check AWS Console for deployed resources:
    echo - CloudFormation: https://console.aws.amazon.com/cloudformation/
    echo - API Gateway: https://console.aws.amazon.com/apigateway/
    echo - DynamoDB: https://console.aws.amazon.com/dynamodb/
    echo - Lambda: https://console.aws.amazon.com/lambda/
    echo - CloudWatch: https://console.aws.amazon.com/cloudwatch/
    echo.
) else (
    echo Deployment cancelled.
    echo To deploy manually, run:
    echo "%NPX_CMD%" cdk deploy --all --context stage=dev
)

echo.
pause