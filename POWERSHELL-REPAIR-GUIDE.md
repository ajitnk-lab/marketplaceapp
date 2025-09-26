# PowerShell Repair Guide

## Issue
PowerShell commands are not returning output, which is blocking all development tools (Node.js, npm, CDK).

## Quick Diagnosis

Open a **new Command Prompt as Administrator** and run:

```cmd
powershell -Command "Write-Host 'PowerShell Test'; Get-Date"
```

If you see no output or errors, PowerShell needs repair.

## Repair Methods (Try in Order)

### Method 1: Reset Execution Policy
```cmd
powershell -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
```

### Method 2: Registry Fix
```cmd
reg add "HKCU\Software\Microsoft\PowerShell\1\ShellIds\Microsoft.PowerShell" /v ExecutionPolicy /t REG_SZ /d RemoteSigned /f
```

### Method 3: System File Repair (Run as Administrator)
```cmd
sfc /scannow
DISM /Online /Cleanup-Image /RestoreHealth
```

### Method 4: Install PowerShell 7 (Recommended)

**Option A: Via winget**
```cmd
winget install Microsoft.PowerShell
```

**Option B: Manual Download**
1. Go to: https://github.com/PowerShell/PowerShell/releases/latest
2. Download: `PowerShell-7.x.x-win-x64.msi`
3. Run as Administrator
4. After installation, use `pwsh` instead of `powershell`

### Method 5: Windows Feature Reset
```cmd
dism /online /disable-feature /featurename:MicrosoftWindowsPowerShellV2Root
dism /online /enable-feature /featurename:MicrosoftWindowsPowerShellV2Root
```

## Test After Each Method

```cmd
powershell -Command "Write-Host 'SUCCESS: PowerShell is working'; Get-Date"
```

Or if you installed PowerShell 7:
```cmd
pwsh -Command "Write-Host 'SUCCESS: PowerShell 7 is working'; Get-Date"
```

## Once PowerShell is Fixed

Run these commands to continue with infrastructure deployment:

```cmd
cd packages/infrastructure
verify-setup.bat
setup-and-deploy.bat
setup-aws-and-deploy.bat
```

## Alternative: Use Batch Files Only

If PowerShell cannot be fixed, all our scripts have batch file (.bat) versions that work without PowerShell:

- `verify-setup.bat` - Check system setup
- `setup-and-deploy.bat` - Build and prepare deployment
- `setup-aws-and-deploy.bat` - Deploy to AWS

## Emergency Node.js Test

If you need to test Node.js immediately without PowerShell:

```cmd
"C:\Program Files\nodejs\node.exe" --version
"C:\Program Files\nodejs\npm.cmd" --version
```

## Next Steps After PowerShell is Fixed

1. Verify setup: `verify-setup.bat`
2. Build project: `setup-and-deploy.bat`
3. Deploy to AWS: `setup-aws-and-deploy.bat`

The infrastructure code is ready - we just need PowerShell working to run the deployment tools effectively.