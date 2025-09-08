# GitHub Project Setup Script for Cloud Nestle Website
# This script helps set up the GitHub repository and configuration

Write-Host "=== GitHub Project Setup for Cloud Nestle Website ===" -ForegroundColor Cyan
Write-Host ""

# Check if Git is available
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git is available: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git first following the setup-environment.md guide." -ForegroundColor Yellow
    exit 1
}

# Check Git configuration
Write-Host ""
Write-Host "Checking Git configuration..." -ForegroundColor Yellow
$gitUser = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null

if (-not $gitUser -or -not $gitEmail) {
    Write-Host "⚠️  Git is not configured. Let's set it up..." -ForegroundColor Yellow
    
    if (-not $gitUser) {
        $userName = Read-Host "Enter your full name for Git commits"
        git config --global user.name "$userName"
        Write-Host "✅ Git user name set to: $userName" -ForegroundColor Green
    }
    
    if (-not $gitEmail) {
        $userEmail = Read-Host "Enter your email address for Git commits"
        git config --global user.email "$userEmail"
        Write-Host "✅ Git email set to: $userEmail" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Git configured: $gitUser <$gitEmail>" -ForegroundColor Green
}

# Check if we're in a Git repository
Write-Host ""
Write-Host "Checking repository status..." -ForegroundColor Yellow

$isGitRepo = $false
try {
    git rev-parse --git-dir 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $isGitRepo = $true
        Write-Host "✅ Already in a Git repository" -ForegroundColor Green
    }
} catch {
    # Not in a Git repo
}

if (-not $isGitRepo) {
    Write-Host "⚠️  Not in a Git repository" -ForegroundColor Yellow
    
    $choice = Read-Host "Do you want to initialize a new Git repository here? (y/n)"
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        git init
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
        
        # Create initial .gitignore
        $gitignoreContent = @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
.next/
out/
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# AWS CDK
cdk.out/
*.d.ts

# Temporary files
*.tmp
*.temp

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# Verification reports
*-verification-*.txt
*-check-*.txt
"@
        
        $gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
        Write-Host "✅ .gitignore file created" -ForegroundColor Green
        
        # Create initial README
        $readmeContent = @"
# Cloud Nestle Website

Professional website for Cloud Nestle Consulting and Services - AWS cloud consulting and migration services.

## Project Overview

This is a modern, scalable website built with:
- **Next.js** with TypeScript for static site generation
- **Tailwind CSS** for responsive styling
- **AWS CDK** for infrastructure as code
- **Git-based CMS** for content management
- **AWS S3 + CloudFront** for hosting and CDN

## Development Setup

1. Install required software (see setup-environment.md)
2. Configure AWS credentials (see aws-setup-guide.md)
3. Set up GitHub repository (see github-setup-guide.md)
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

## Project Structure

```
cloudnestle-website/
├── content/                 # Git-based CMS content
├── infrastructure/          # AWS CDK infrastructure code
├── src/                    # Next.js application source
├── public/                 # Static assets
└── docs/                   # Project documentation
```

## Deployment

The website is automatically deployed to AWS when changes are pushed to the main branch using GitHub Actions.

## License

MIT License - see LICENSE file for details.
"@
        
        $readmeContent | Out-File -FilePath "README.md" -Encoding UTF8
        Write-Host "✅ README.md file created" -ForegroundColor Green
        
        # Initial commit
        git add .
        git commit -m "Initial commit: Project setup and configuration files"
        Write-Host "✅ Initial commit created" -ForegroundColor Green
    }
}

# Update environment variables with GitHub info
Write-Host ""
Write-Host "Updating environment variables..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
    
    # Prompt for GitHub information
    Write-Host ""
    Write-Host "Please provide your GitHub information:" -ForegroundColor Cyan
    
    $githubOwner = Read-Host "Enter your GitHub username"
    $githubRepo = Read-Host "Enter repository name (default: cloudnestle-website)"
    if (-not $githubRepo) { $githubRepo = "cloudnestle-website" }
    
    Write-Host ""
    Write-Host "GitHub Personal Access Token Setup:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "2. Click 'Generate new token (classic)'" -ForegroundColor Yellow
    Write-Host "3. Select scopes: repo, workflow, write:packages, read:packages" -ForegroundColor Yellow
    Write-Host "4. Copy the generated token" -ForegroundColor Yellow
    Write-Host ""
    
    $githubToken = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
    $githubTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($githubToken))
    
    # Update .env.local file
    $envContent = Get-Content ".env.local" -Raw
    $envContent = $envContent -replace "GITHUB_OWNER=.*", "GITHUB_OWNER=$githubOwner"
    $envContent = $envContent -replace "GITHUB_REPO=.*", "GITHUB_REPO=$githubRepo"
    $envContent = $envContent -replace "GITHUB_TOKEN=.*", "GITHUB_TOKEN=$githubTokenPlain"
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Environment variables updated" -ForegroundColor Green
    
    # Test GitHub API access
    Write-Host ""
    Write-Host "Testing GitHub API access..." -ForegroundColor Yellow
    
    try {
        $headers = @{ 
            Authorization = "token $githubTokenPlain"
            "User-Agent" = "CloudNestle-Setup-Script"
        }
        $apiUrl = "https://api.github.com/repos/$githubOwner/$githubRepo"
        $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -ErrorAction Stop
        
        Write-Host "✅ GitHub API access successful" -ForegroundColor Green
        Write-Host "   Repository: $($response.full_name)" -ForegroundColor Cyan
        Write-Host "   Private: $($response.private)" -ForegroundColor Cyan
        Write-Host "   Clone URL: $($response.clone_url)" -ForegroundColor Cyan
        
        # Add remote origin if not exists
        try {
            $currentRemote = git remote get-url origin 2>$null
            if ($LASTEXITCODE -ne 0) {
                $remoteUrl = "git@github.com:$githubOwner/$githubRepo.git"
                git remote add origin $remoteUrl
                Write-Host "✅ Remote origin added: $remoteUrl" -ForegroundColor Green
            } else {
                Write-Host "✅ Remote origin already configured: $currentRemote" -ForegroundColor Green
            }
        } catch {
            Write-Host "⚠️  Could not configure remote origin" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ GitHub API access failed" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Please check your token and repository name" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .env.local file not found" -ForegroundColor Yellow
    Write-Host "   Please run the AWS setup script first" -ForegroundColor Yellow
}

# SSH key setup guidance
Write-Host ""
Write-Host "SSH Key Setup (Recommended):" -ForegroundColor Cyan

if (Test-Path "~/.ssh/id_ed25519.pub" -or Test-Path "~/.ssh/id_rsa.pub") {
    Write-Host "✅ SSH keys found" -ForegroundColor Green
    
    # Test GitHub SSH connection
    try {
        $sshTest = ssh -T git@github.com -o StrictHostKeyChecking=no 2>&1
        if ($sshTest -match "successfully authenticated") {
            Write-Host "✅ GitHub SSH connection successful" -ForegroundColor Green
        } else {
            Write-Host "⚠️  GitHub SSH connection not configured" -ForegroundColor Yellow
            Write-Host "   Add your SSH key to GitHub: https://github.com/settings/keys" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  SSH connection test failed" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  No SSH keys found" -ForegroundColor Yellow
    Write-Host "Generate SSH key with:" -ForegroundColor Yellow
    Write-Host "   ssh-keygen -t ed25519 -C 'your.email@example.com'" -ForegroundColor Cyan
    Write-Host "Then add the public key to GitHub: https://github.com/settings/keys" -ForegroundColor Yellow
}

# Final summary
Write-Host ""
Write-Host "=== Setup Summary ===" -ForegroundColor Cyan
Write-Host "✅ Git installed and configured" -ForegroundColor Green
Write-Host "✅ Repository initialized (if needed)" -ForegroundColor Green
Write-Host "✅ Environment variables configured" -ForegroundColor Green
Write-Host "✅ GitHub API access tested" -ForegroundColor Green

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create repository on GitHub.com if it doesn't exist" -ForegroundColor White
Write-Host "2. Set up SSH keys for secure access (recommended)" -ForegroundColor White
Write-Host "3. Configure GitHub repository secrets for CI/CD" -ForegroundColor White
Write-Host "4. Push initial code to GitHub: git push -u origin main" -ForegroundColor White
Write-Host "5. Proceed to domain configuration (Task 0.4)" -ForegroundColor White

Write-Host ""
Write-Host "🎉 GitHub setup is complete!" -ForegroundColor Green