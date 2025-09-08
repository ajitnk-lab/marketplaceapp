# GitHub Setup Verification Script for Cloud Nestle Website
# This script verifies GitHub repository and access configuration

Write-Host "=== GitHub Setup Verification ===" -ForegroundColor Cyan
Write-Host ""

$allGood = $true
$results = @()

# Function to test command availability
function Test-Command {
    param($CommandName, $Arguments = @())
    try {
        $output = & $CommandName @Arguments 2>&1
        if ($LASTEXITCODE -eq 0) {
            return @{ Success = $true; Output = $output }
        } else {
            return @{ Success = $false; Output = $output }
        }
    } catch {
        return @{ Success = $false; Output = $_.Exception.Message }
    }
}

# Check if Git is available
Write-Host "Checking Git availability..." -ForegroundColor Yellow
$gitCheck = Test-Command "git" @("--version")
if ($gitCheck.Success) {
    Write-Host "✅ Git: $($gitCheck.Output)" -ForegroundColor Green
    $results += "✅ Git: Available"
} else {
    Write-Host "❌ Git: Not available" -ForegroundColor Red
    $results += "❌ Git: Not available"
    $allGood = $false
    Write-Host "Please install Git first." -ForegroundColor Red
    exit 1
}

# Check Git configuration
Write-Host ""
Write-Host "Checking Git configuration..." -ForegroundColor Yellow
$gitUser = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null

if ($gitUser -and $gitEmail) {
    Write-Host "✅ Git configured: $gitUser <$gitEmail>" -ForegroundColor Green
    $results += "✅ Git configured: $gitUser <$gitEmail>"
} else {
    Write-Host "❌ Git not configured" -ForegroundColor Red
    Write-Host "   Run: git config --global user.name 'Your Name'" -ForegroundColor Yellow
    Write-Host "   Run: git config --global user.email 'your.email@example.com'" -ForegroundColor Yellow
    $results += "❌ Git: Not configured"
    $allGood = $false
}

# Check if we're in a Git repository
Write-Host ""
Write-Host "Checking Git repository..." -ForegroundColor Yellow
$gitRepoCheck = Test-Command "git" @("rev-parse", "--git-dir")
if ($gitRepoCheck.Success) {
    Write-Host "✅ Git repository: Initialized" -ForegroundColor Green
    $results += "✅ Git repository: Initialized"
    
    # Check remote origin
    $remoteCheck = Test-Command "git" @("remote", "get-url", "origin")
    if ($remoteCheck.Success) {
        $remoteUrl = $remoteCheck.Output.Trim()
        Write-Host "✅ Remote origin: $remoteUrl" -ForegroundColor Green
        $results += "✅ Remote origin: $remoteUrl"
        
        # Extract repository info from URL
        if ($remoteUrl -match "github\.com[:/]([^/]+)/([^/]+?)(?:\.git)?$") {
            $githubOwner = $matches[1]
            $githubRepo = $matches[2]
            Write-Host "   Owner: $githubOwner" -ForegroundColor Cyan
            Write-Host "   Repository: $githubRepo" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️  Remote origin: Not configured" -ForegroundColor Yellow
        $results += "⚠️  Remote origin: Not configured"
    }
} else {
    Write-Host "⚠️  Git repository: Not initialized or not in repository directory" -ForegroundColor Yellow
    $results += "⚠️  Git repository: Not initialized"
}

# Check SSH key configuration
Write-Host ""
Write-Host "Checking SSH configuration..." -ForegroundColor Yellow
if (Test-Path "~/.ssh/id_ed25519.pub" -or Test-Path "~/.ssh/id_rsa.pub") {
    Write-Host "✅ SSH keys: Found" -ForegroundColor Green
    $results += "✅ SSH keys: Found"
    
    # Test GitHub SSH connection
    $sshTest = Test-Command "ssh" @("-T", "git@github.com", "-o", "StrictHostKeyChecking=no")
    if ($sshTest.Output -match "successfully authenticated") {
        Write-Host "✅ GitHub SSH: Connection successful" -ForegroundColor Green
        $results += "✅ GitHub SSH: Connected"
    } else {
        Write-Host "⚠️  GitHub SSH: Connection failed or not configured" -ForegroundColor Yellow
        $results += "⚠️  GitHub SSH: Connection issues"
    }
} else {
    Write-Host "⚠️  SSH keys: Not found" -ForegroundColor Yellow
    Write-Host "   Generate with: ssh-keygen -t ed25519 -C 'your.email@example.com'" -ForegroundColor Yellow
    $results += "⚠️  SSH keys: Not found"
}

# Check environment variables
Write-Host ""
Write-Host "Checking environment variables..." -ForegroundColor Yellow

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ Environment file: .env.local found" -ForegroundColor Green
    $results += "✅ Environment file: Found"
    
    # Read and check GitHub configuration
    $envContent = Get-Content ".env.local" -Raw
    
    if ($envContent -match "GITHUB_OWNER=(.+)") {
        $githubOwner = $matches[1].Trim()
        if ($githubOwner -ne "your-github-username" -and $githubOwner -ne "YOUR_GITHUB_USERNAME") {
            Write-Host "✅ GitHub Owner: $githubOwner" -ForegroundColor Green
            $results += "✅ GitHub Owner: $githubOwner"
        } else {
            Write-Host "⚠️  GitHub Owner: Not configured (placeholder value)" -ForegroundColor Yellow
            $results += "⚠️  GitHub Owner: Not configured"
        }
    } else {
        Write-Host "⚠️  GitHub Owner: Not found in .env.local" -ForegroundColor Yellow
        $results += "⚠️  GitHub Owner: Missing"
    }
    
    if ($envContent -match "GITHUB_REPO=(.+)") {
        $githubRepo = $matches[1].Trim()
        Write-Host "✅ GitHub Repository: $githubRepo" -ForegroundColor Green
        $results += "✅ GitHub Repository: $githubRepo"
    } else {
        Write-Host "⚠️  GitHub Repository: Not found in .env.local" -ForegroundColor Yellow
        $results += "⚠️  GitHub Repository: Missing"
    }
    
    if ($envContent -match "GITHUB_TOKEN=(.+)") {
        $githubToken = $matches[1].Trim()
        if ($githubToken -ne "your-github-token" -and $githubToken -ne "YOUR_GITHUB_TOKEN") {
            Write-Host "✅ GitHub Token: Configured (hidden for security)" -ForegroundColor Green
            $results += "✅ GitHub Token: Configured"
        } else {
            Write-Host "⚠️  GitHub Token: Not configured (placeholder value)" -ForegroundColor Yellow
            $results += "⚠️  GitHub Token: Not configured"
        }
    } else {
        Write-Host "⚠️  GitHub Token: Not found in .env.local" -ForegroundColor Yellow
        $results += "⚠️  GitHub Token: Missing"
    }
} else {
    Write-Host "⚠️  Environment file: .env.local not found" -ForegroundColor Yellow
    $results += "⚠️  Environment file: Missing"
}

# Test GitHub API access (if token is available)
Write-Host ""
Write-Host "Testing GitHub API access..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "GITHUB_TOKEN=([^`r`n]+)" -and $envContent -match "GITHUB_OWNER=([^`r`n]+)" -and $envContent -match "GITHUB_REPO=([^`r`n]+)") {
        $token = $matches[1].Trim()
        $owner = ($envContent | Select-String "GITHUB_OWNER=([^`r`n]+)").Matches[0].Groups[1].Value.Trim()
        $repo = ($envContent | Select-String "GITHUB_REPO=([^`r`n]+)").Matches[0].Groups[1].Value.Trim()
        
        if ($token -ne "your-github-token" -and $token -ne "YOUR_GITHUB_TOKEN" -and 
            $owner -ne "your-github-username" -and $owner -ne "YOUR_GITHUB_USERNAME") {
            
            try {
                $headers = @{ 
                    Authorization = "token $token"
                    "User-Agent" = "CloudNestle-Setup-Script"
                }
                $apiUrl = "https://api.github.com/repos/$owner/$repo"
                $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -ErrorAction Stop
                
                Write-Host "✅ GitHub API: Access successful" -ForegroundColor Green
                Write-Host "   Repository: $($response.full_name)" -ForegroundColor Cyan
                Write-Host "   Private: $($response.private)" -ForegroundColor Cyan
                $results += "✅ GitHub API: Access successful"
            } catch {
                Write-Host "❌ GitHub API: Access failed" -ForegroundColor Red
                Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
                $results += "❌ GitHub API: Access failed"
                $allGood = $false
            }
        } else {
            Write-Host "⚠️  GitHub API: Cannot test (token or owner not configured)" -ForegroundColor Yellow
            $results += "⚠️  GitHub API: Cannot test"
        }
    } else {
        Write-Host "⚠️  GitHub API: Cannot test (missing configuration)" -ForegroundColor Yellow
        $results += "⚠️  GitHub API: Cannot test"
    }
} else {
    Write-Host "⚠️  GitHub API: Cannot test (no .env.local file)" -ForegroundColor Yellow
    $results += "⚠️  GitHub API: Cannot test"
}

# Check if we can push to repository
Write-Host ""
Write-Host "Testing Git operations..." -ForegroundColor Yellow

if ($gitRepoCheck.Success -and $remoteCheck.Success) {
    # Test if we can fetch from remote
    $fetchTest = Test-Command "git" @("fetch", "--dry-run")
    if ($fetchTest.Success -or $fetchTest.Output -match "up to date") {
        Write-Host "✅ Git fetch: Working" -ForegroundColor Green
        $results += "✅ Git fetch: Working"
    } else {
        Write-Host "⚠️  Git fetch: Issues detected" -ForegroundColor Yellow
        $results += "⚠️  Git fetch: Issues"
    }
} else {
    Write-Host "⚠️  Git operations: Cannot test (no repository or remote)" -ForegroundColor Yellow
    $results += "⚠️  Git operations: Cannot test"
}

# Summary
Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
foreach ($result in $results) {
    Write-Host $result
}

Write-Host ""
if ($allGood) {
    Write-Host "🎉 GitHub is properly configured and ready!" -ForegroundColor Green
    Write-Host "You can proceed with domain configuration and development setup." -ForegroundColor Green
} else {
    Write-Host "❌ GitHub configuration needs attention." -ForegroundColor Red
    Write-Host "Please follow the github-setup-guide.md to fix the issues." -ForegroundColor Red
}

# Save results to file
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportFile = "github-verification-$timestamp.txt"
$results | Out-File -FilePath $reportFile -Encoding UTF8
Write-Host ""
Write-Host "Report saved to: $reportFile" -ForegroundColor Cyan

# Return exit code
if ($allGood) { exit 0 } else { exit 1 }