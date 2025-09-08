# Environment Verification Script for Cloud Nestle Website
# This script checks all required software installations

Write-Host "=== Cloud Nestle Website - Environment Verification ===" -ForegroundColor Cyan
Write-Host ""

$allGood = $true
$results = @()

# Function to test command availability
function Test-Command {
    param($CommandName, $VersionFlag = "--version")
    try {
        $output = & $CommandName $VersionFlag 2>&1
        if ($LASTEXITCODE -eq 0) {
            return @{ Success = $true; Output = $output }
        } else {
            return @{ Success = $false; Output = $output }
        }
    } catch {
        return @{ Success = $false; Output = $_.Exception.Message }
    }
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeResult = Test-Command "node"
if ($nodeResult.Success) {
    $nodeVersion = $nodeResult.Output | Select-String "v(\d+\.\d+\.\d+)" | ForEach-Object { $_.Matches[0].Groups[1].Value }
    if ([version]$nodeVersion -ge [version]"18.0.0") {
        Write-Host "✅ Node.js: $($nodeResult.Output)" -ForegroundColor Green
        $results += "✅ Node.js: $($nodeResult.Output)"
    } else {
        Write-Host "❌ Node.js version $nodeVersion is too old. Need 18.0.0 or higher." -ForegroundColor Red
        $results += "❌ Node.js: Version $nodeVersion (need 18.0.0+)"
        $allGood = $false
    }
} else {
    Write-Host "❌ Node.js: Not installed or not in PATH" -ForegroundColor Red
    $results += "❌ Node.js: Not found"
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
$npmResult = Test-Command "npm"
if ($npmResult.Success) {
    Write-Host "✅ npm: $($npmResult.Output)" -ForegroundColor Green
    $results += "✅ npm: $($npmResult.Output)"
} else {
    Write-Host "❌ npm: Not installed or not in PATH" -ForegroundColor Red
    $results += "❌ npm: Not found"
    $allGood = $false
}

# Check Git
Write-Host "Checking Git..." -ForegroundColor Yellow
$gitResult = Test-Command "git"
if ($gitResult.Success) {
    Write-Host "✅ Git: $($gitResult.Output)" -ForegroundColor Green
    $results += "✅ Git: $($gitResult.Output)"
    
    # Check Git configuration
    try {
        $gitUser = git config --global user.name 2>$null
        $gitEmail = git config --global user.email 2>$null
        if ($gitUser -and $gitEmail) {
            Write-Host "✅ Git configured: $gitUser <$gitEmail>" -ForegroundColor Green
            $results += "✅ Git configured: $gitUser <$gitEmail>"
        } else {
            Write-Host "⚠️  Git not configured. Run: git config --global user.name 'Your Name'" -ForegroundColor Yellow
            Write-Host "⚠️  Git not configured. Run: git config --global user.email 'your.email@example.com'" -ForegroundColor Yellow
            $results += "⚠️  Git: Not configured (user.name and user.email needed)"
        }
    } catch {
        $results += "⚠️  Git: Configuration check failed"
    }
} else {
    Write-Host "❌ Git: Not installed or not in PATH" -ForegroundColor Red
    $results += "❌ Git: Not found"
    $allGood = $false
}

# Check AWS CLI
Write-Host "Checking AWS CLI..." -ForegroundColor Yellow
$awsResult = Test-Command "aws"
if ($awsResult.Success) {
    Write-Host "✅ AWS CLI: $($awsResult.Output)" -ForegroundColor Green
    $results += "✅ AWS CLI: $($awsResult.Output)"
} else {
    Write-Host "❌ AWS CLI: Not installed or not in PATH" -ForegroundColor Red
    $results += "❌ AWS CLI: Not found"
    $allGood = $false
}

# Check AWS CDK
Write-Host "Checking AWS CDK..." -ForegroundColor Yellow
$cdkResult = Test-Command "cdk"
if ($cdkResult.Success) {
    Write-Host "✅ AWS CDK: $($cdkResult.Output)" -ForegroundColor Green
    $results += "✅ AWS CDK: $($cdkResult.Output)"
} else {
    Write-Host "❌ AWS CDK: Not installed. Run: npm install -g aws-cdk" -ForegroundColor Red
    $results += "❌ AWS CDK: Not found (run: npm install -g aws-cdk)"
    $allGood = $false
}

# System Requirements Check
Write-Host ""
Write-Host "Checking System Requirements..." -ForegroundColor Yellow

# Check RAM
$ram = [math]::Round((Get-CimInstance -ClassName Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
if ($ram -ge 8) {
    Write-Host "✅ RAM: $ram GB (8GB+ required)" -ForegroundColor Green
    $results += "✅ RAM: $ram GB"
} else {
    Write-Host "⚠️  RAM: $ram GB (8GB recommended)" -ForegroundColor Yellow
    $results += "⚠️  RAM: $ram GB (8GB recommended)"
}

# Check Disk Space
$disk = Get-CimInstance -ClassName Win32_LogicalDisk | Where-Object { $_.DriveType -eq 3 -and $_.DeviceID -eq "C:" }
$freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 2)
if ($freeSpaceGB -ge 5) {
    Write-Host "✅ Disk Space: $freeSpaceGB GB free (5GB+ required)" -ForegroundColor Green
    $results += "✅ Disk Space: $freeSpaceGB GB free"
} else {
    Write-Host "⚠️  Disk Space: $freeSpaceGB GB free (5GB recommended)" -ForegroundColor Yellow
    $results += "⚠️  Disk Space: $freeSpaceGB GB free (5GB recommended)"
}

# Check Internet Connectivity
Write-Host "Checking Internet Connectivity..." -ForegroundColor Yellow
try {
    $ping = Test-NetConnection -ComputerName "github.com" -Port 443 -InformationLevel Quiet
    if ($ping) {
        Write-Host "✅ Internet: Connected to GitHub" -ForegroundColor Green
        $results += "✅ Internet: Connected"
    } else {
        Write-Host "❌ Internet: Cannot reach GitHub" -ForegroundColor Red
        $results += "❌ Internet: Connection issues"
        $allGood = $false
    }
} catch {
    Write-Host "⚠️  Internet: Connection test failed" -ForegroundColor Yellow
    $results += "⚠️  Internet: Test failed"
}

# Summary
Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
foreach ($result in $results) {
    Write-Host $result
}

Write-Host ""
if ($allGood) {
    Write-Host "🎉 All required software is installed and ready!" -ForegroundColor Green
    Write-Host "You can proceed with the next setup tasks." -ForegroundColor Green
} else {
    Write-Host "❌ Some required software is missing or needs attention." -ForegroundColor Red
    Write-Host "Please install missing software and run this script again." -ForegroundColor Red
}

# Save results to file
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportFile = "environment-check-$timestamp.txt"
$results | Out-File -FilePath $reportFile -Encoding UTF8
Write-Host ""
Write-Host "Report saved to: $reportFile" -ForegroundColor Cyan

# Return exit code
if ($allGood) { exit 0 } else { exit 1 }