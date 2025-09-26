# Deploy development environment
Write-Host "Deploying Marketplace Platform - Development Environment" -ForegroundColor Green

# Build the project
Write-Host "Building CDK project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Synthesize CloudFormation templates
Write-Host "Synthesizing CloudFormation templates..." -ForegroundColor Yellow
npm run synth

if ($LASTEXITCODE -ne 0) {
    Write-Host "Synthesis failed!" -ForegroundColor Red
    exit 1
}

# Deploy all stacks
Write-Host "Deploying infrastructure stacks..." -ForegroundColor Yellow
cdk deploy --all --require-approval never --context stage=dev

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Check the AWS Console for stack outputs and resources." -ForegroundColor Cyan
} else {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}