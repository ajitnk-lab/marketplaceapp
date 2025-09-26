# Troubleshooting Guide

## PowerShell Stack Overflow Error

If you're experiencing stack overflow errors when running PowerShell commands, try these solutions:

### Solution 1: Use PowerShell with No Profile
The VS Code settings have been updated to use PowerShell with `-NoProfile` flag to prevent profile-related issues.

### Solution 2: Reset PowerShell Profile
If you have a custom PowerShell profile causing issues:

1. Check if you have a profile:
   ```powershell
   Test-Path $PROFILE
   ```

2. If true, temporarily rename it:
   ```powershell
   Rename-Item $PROFILE "$PROFILE.backup"
   ```

3. Restart VS Code and test

### Solution 3: Use Command Prompt Instead
If PowerShell continues to have issues, use Command Prompt:

1. In VS Code, press `Ctrl+Shift+P`
2. Type "Terminal: Select Default Profile"
3. Choose "Command Prompt"

### Solution 4: Check for Circular References
Look for circular imports or recursive calls in:
- PowerShell modules in `$env:PSModulePath`
- Scripts in PowerShell startup locations
- Custom functions that might call themselves

### Solution 5: Clean PowerShell Installation
1. Uninstall PowerShell modules that might be causing issues:
   ```powershell
   Get-Module -ListAvailable | Where-Object {$_.Name -like "*problematic*"} | Uninstall-Module
   ```

2. Clear PowerShell cache:
   ```cmd
   del /s /q "%LOCALAPPDATA%\Microsoft\Windows\PowerShell\*"
   ```

### Alternative: Use Node.js Directly
For development tasks, you can run Node.js commands directly:

```cmd
node --version
npm --version
npm install -g aws-cdk
cdk --version
```

### Testing Commands
Try these simple commands to test if the issue is resolved:

**Command Prompt:**
```cmd
echo "test"
node --version
npm --version
```

**PowerShell (if working):**
```powershell
Write-Host "test"
$PSVersionTable.PSVersion
```

## Other Common Issues

### Node.js Not Found
- Ensure Node.js is installed from https://nodejs.org/
- Add Node.js to your PATH environment variable
- Restart your terminal/VS Code

### AWS CLI Issues
- Install AWS CLI v2 from https://aws.amazon.com/cli/
- Configure credentials: `aws configure`
- Test access: `aws sts get-caller-identity`

### CDK Bootstrap Fails
- Ensure AWS credentials are configured
- Check AWS permissions for CloudFormation
- Verify the correct region is set

### Permission Errors
- Run terminal as Administrator
- Set PowerShell execution policy:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

## Getting Help
If issues persist:
1. Check the error logs in VS Code Developer Tools
2. Try running commands in a standalone terminal
3. Consider using Windows Subsystem for Linux (WSL) as an alternative