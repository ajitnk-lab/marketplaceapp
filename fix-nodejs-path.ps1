# Fix Node.js PATH issue
Write-Host "Fixing Node.js PATH issue..." -ForegroundColor Yellow

# Check if Node.js is installed
$nodePath = "C:\Program Files\nodejs"
if (Test-Path "$nodePath\node.exe") {
    Write-Host "Node.js found at: $nodePath" -ForegroundColor Green
    
    # Get current PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    
    # Check if Node.js is already in PATH
    if ($currentPath -notlike "*$nodePath*") {
        Write-Host "Adding Node.js to user PATH..." -ForegroundColor Yellow
        
        # Add Node.js to user PATH
        $newPath = "$nodePath;$currentPath"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
        
        Write-Host "Node.js added to PATH successfully!" -ForegroundColor Green
        Write-Host "Please restart your terminal or IDE for changes to take effect." -ForegroundColor Cyan
    } else {
        Write-Host "Node.js is already in PATH" -ForegroundColor Green
    }
    
    # Test Node.js
    Write-Host "Testing Node.js..." -ForegroundColor Yellow
    & "$nodePath\node.exe" --version
    & "$nodePath\npm.cmd" --version
    
} else {
    Write-Host "Node.js not found at expected location: $nodePath" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
}