# GitHub Token Setup Script
# This script helps you configure your GitHub Personal Access Token

Write-Host "=== GitHub Personal Access Token Setup ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "To complete the GitHub setup, you need to:" -ForegroundColor Yellow
Write-Host "1. Create a GitHub Personal Access Token" -ForegroundColor White
Write-Host "2. Create the repository on GitHub" -ForegroundColor White
Write-Host "3. Configure the token in your environment" -ForegroundColor White
Write-Host ""

Write-Host "Step 1: Create GitHub Personal Access Token" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host "2. Click 'Generate new token (classic)'" -ForegroundColor Yellow
Write-Host "3. Give it a name: 'Cloud Nestle Website'" -ForegroundColor Yellow
Write-Host "4. Select these scopes:" -ForegroundColor Yellow
Write-Host "   ✓ repo (Full control of private repositories)" -ForegroundColor Green
Write-Host "   ✓ workflow (Update GitHub Action workflows)" -ForegroundColor Green
Write-Host "   ✓ write:packages (Upload packages to GitHub Package Registry)" -ForegroundColor Green
Write-Host "   ✓ read:packages (Download packages from GitHub Package Registry)" -ForegroundColor Green
Write-Host "5. Click 'Generate token'" -ForegroundColor Yellow
Write-Host "6. Copy the token (it will only be shown once!)" -ForegroundColor Red
Write-Host ""

Write-Host "Step 2: Create GitHub Repository" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Repository name: cloudnestle-website" -ForegroundColor Yellow
Write-Host "3. Description: Professional website for Cloud Nestle Consulting and Services" -ForegroundColor Yellow
Write-Host "4. Set to Private (recommended for business)" -ForegroundColor Yellow
Write-Host "5. Do NOT initialize with README (we already have one)" -ForegroundColor Red
Write-Host "6. Click 'Create repository'" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Have you completed steps 1 and 2? (y/n)"
if ($continue -ne 'y' -and $continue -ne 'Y') {
    Write-Host "Please complete the steps above and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 3: Configure Token" -ForegroundColor Cyan
$token = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

# Update .env.local file
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    $envContent = $envContent -replace "GITHUB_TOKEN=.*", "GITHUB_TOKEN=$tokenPlain"
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Token saved to .env.local" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
    exit 1
}

# Test GitHub API access
Write-Host ""
Write-Host "Testing GitHub API access..." -ForegroundColor Yellow

try {
    $headers = @{ 
        Authorization = "token $tokenPlain"
        "User-Agent" = "CloudNestle-Setup-Script"
    }
    $apiUrl = "https://api.github.com/repos/ajitnklab/cloudnestle-website"
    $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -ErrorAction Stop
    
    Write-Host "✅ GitHub API access successful!" -ForegroundColor Green
    Write-Host "   Repository: $($response.full_name)" -ForegroundColor Cyan
    Write-Host "   Private: $($response.private)" -ForegroundColor Cyan
    Write-Host "   Clone URL: $($response.clone_url)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ GitHub API access failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please check your token and repository name" -ForegroundColor Yellow
    exit 1
}

# Add remote origin
Write-Host ""
Write-Host "Configuring Git remote..." -ForegroundColor Yellow

$env:PATH += ";C:\Program Files\Git\bin"

try {
    $currentRemote = git remote get-url origin 2>$null
    if ($LASTEXITCODE -ne 0) {
        $remoteUrl = "https://github.com/ajitnklab/cloudnestle-website.git"
        git remote add origin $remoteUrl
        Write-Host "✅ Remote origin added: $remoteUrl" -ForegroundColor Green
    } else {
        Write-Host "✅ Remote origin already configured: $currentRemote" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not configure remote origin" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host ""
Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow

try {
    git branch -M main
    git push -u origin main
    Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "   You may need to push manually: git push -u origin main" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 GitHub setup is complete!" -ForegroundColor Green
Write-Host "Your repository is available at: https://github.com/ajitnklab/cloudnestle-website" -ForegroundColor Cyan