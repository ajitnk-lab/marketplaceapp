# Fix Node.js PATH permanently
Write-Host "🔧 Fixing Node.js PATH configuration..." -ForegroundColor Green

# Get current system PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

# Node.js installation paths to check
$nodePaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "$env:LOCALAPPDATA\Microsoft\WindowsApps"
)

# Find where Node.js is actually installed
$nodeExePath = $null
foreach ($path in $nodePaths) {
    if (Test-Path "$path\node.exe") {
        $nodeExePath = $path
        Write-Host "✅ Found Node.js at: $path" -ForegroundColor Green
        break
    }
}

if (-not $nodeExePath) {
    Write-Host "❌ Node.js not found in expected locations" -ForegroundColor Red
    Write-Host "Searching system..." -ForegroundColor Yellow
    
    # Try to find node.exe anywhere
    $found = Get-ChildItem -Path "C:\" -Recurse -Name "node.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $nodeExePath = Split-Path $found -Parent
        Write-Host "✅ Found Node.js at: $nodeExePath" -ForegroundColor Green
    }
}

if ($nodeExePath) {
    # Add to system PATH if not already there
    if ($currentPath -notlike "*$nodeExePath*") {
        $newPath = "$currentPath;$nodeExePath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
        Write-Host "✅ Added Node.js to system PATH" -ForegroundColor Green
    } else {
        Write-Host "✅ Node.js already in system PATH" -ForegroundColor Green
    }
    
    # Also add npm global path
    $npmGlobalPath = "$env:APPDATA\npm"
    if ($currentPath -notlike "*$npmGlobalPath*") {
        $newPath = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";$npmGlobalPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
        Write-Host "✅ Added npm global path to system PATH" -ForegroundColor Green
    }
    
    # Refresh current session
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Test commands
    Write-Host "🧪 Testing commands..." -ForegroundColor Yellow
    try {
        $nodeVersion = & "$nodeExePath\node.exe" --version
        Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
        
        $npmVersion = & "$nodeExePath\npm.cmd" --version
        Write-Host "npm version: $npmVersion" -ForegroundColor Green
        
        Write-Host "🎉 Node.js and npm are working correctly!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error testing commands: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Could not locate Node.js installation" -ForegroundColor Red
    Write-Host "Please install Node.js manually from https://nodejs.org/" -ForegroundColor Yellow
}