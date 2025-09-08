# Installation Instructions - Cloud Nestle Website

Based on the environment verification, you need to install the following software:

## 🔴 Required Installations

### 1. Node.js (Version 18+) - REQUIRED
**Status**: ❌ Not installed
**Action**: Download and install from https://nodejs.org/
- Choose the LTS version (18.x or higher)
- **IMPORTANT**: During installation, make sure "Add to PATH" is checked
- After installation, restart your terminal/PowerShell

### 2. Git - REQUIRED  
**Status**: ❌ Not installed
**Action**: Download and install from https://git-scm.com/download/win
- Use recommended settings during installation
- After installation, configure with your details:
  ```powershell
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### 3. AWS CDK - REQUIRED
**Status**: ❌ Not installed (requires Node.js first)
**Action**: Install after Node.js is installed:
```powershell
npm install -g aws-cdk
```

## ✅ Already Installed

### AWS CLI v2
**Status**: ✅ Installed (aws-cli/2.28.25)
**Action**: No action needed

## 🟡 System Notes

### RAM
**Status**: ⚠️ 7.85 GB (8GB recommended)
**Action**: Your system has slightly less than the recommended 8GB RAM, but it should work fine for development.

### Disk Space
**Status**: ✅ 49.68 GB free (5GB+ required)
**Action**: No action needed

### Internet Connection
**Status**: ✅ Connected to GitHub
**Action**: No action needed

## Installation Order

**Follow this exact order:**

1. **Install Node.js** → Restart terminal
2. **Install Git** → Restart terminal  
3. **Configure Git** with your name and email
4. **Install AWS CDK** using npm
5. **Run verification script** to confirm everything works

## After Installation

Once you've installed Node.js and Git, run the verification script again:

```powershell
.\verify-installation.ps1
```

This will confirm all software is properly installed and configured.

## Next Steps

After all software is installed and verified:
1. Configure AWS credentials (Task 0.2)
2. Set up GitHub repository (Task 0.3)
3. Configure domain settings (Task 0.4)
4. Set up development tools (Task 0.5)
5. Final verification (Task 0.6)

## Need Help?

If you encounter issues during installation:
1. Check the troubleshooting section in `setup-environment.md`
2. Restart your terminal/PowerShell after each installation
3. Run the verification script to identify specific issues
4. Ensure you have administrator privileges for global npm installs