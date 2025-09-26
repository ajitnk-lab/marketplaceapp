# Destroy development environment
Write-Host "Destroying Marketplace Platform - Development Environment" -ForegroundColor Red
Write-Host "WARNING: This will delete all resources and data!" -ForegroundColor Yellow

$confirmation = Read-Host "Are you sure you want to destroy the development environment? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Destruction cancelled." -ForegroundColor Green
    exit 0
}

# Destroy all stacks
Write-Host "Destroying infrastructure stacks..." -ForegroundColor Yellow
cdk destroy --all --force --context stage=dev

if ($LASTEXITCODE -eq 0) {
    Write-Host "Destruction completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Destruction failed!" -ForegroundColor Red
    exit 1
}