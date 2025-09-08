# Environment Setup Guide for Cloud Nestle Website

This guide will help you set up all the required software and tools for developing the Cloud Nestle website.

## Required Software Checklist

### 1. Node.js (Version 18 or Higher)

**Download and Install:**
- Visit: https://nodejs.org/
- Download the LTS version (18.x or higher)
- Run the installer and follow the setup wizard
- **Important**: Make sure to check "Add to PATH" during installation

**Verify Installation:**
```powershell
node --version
npm --version
```
Expected output: Node.js v18.x.x or higher, npm 9.x.x or higher

### 2. Git

**Download and Install:**
- Visit: https://git-scm.com/download/win
- Download Git for Windows
- Run the installer with these recommended settings:
  - Use Git from the command line and also from 3rd-party software
  - Use the OpenSSL library
  - Checkout Windows-style, commit Unix-style line endings
  - Use Windows' default console window

**Configure Git:**
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Verify Installation:**
```powershell
git --version
```
Expected output: git version 2.x.x or higher

### 3. AWS CLI v2 ✅ (Already Installed)

Your system already has AWS CLI v2.28.25 installed. Great!

**Verify Installation:**
```powershell
aws --version
```
Current output: aws-cli/2.28.25 Python/3.13.7 Windows/10 exe/AMD64

### 4. AWS CDK CLI

**Install Globally:**
```powershell
npm install -g aws-cdk
```

**Verify Installation:**
```powershell
cdk --version
```
Expected output: 2.x.x (AWS CDK)

## Installation Order

1. **Install Node.js first** (required for npm and CDK)
2. **Install Git** (required for version control)
3. **Install AWS CDK** (requires npm from Node.js)
4. **Verify all installations** using the verification script

## Next Steps After Installation

Once all software is installed, run the verification script:
```powershell
.\verify-installation.ps1
```

This will check all installations and create a report of your development environment.

## Troubleshooting

### Node.js Not Found
- Restart your terminal/PowerShell after installation
- Check if Node.js is in your PATH: `$env:PATH -split ';' | Select-String node`
- Reinstall Node.js and ensure "Add to PATH" is checked

### Git Not Found
- Restart your terminal/PowerShell after installation
- Check if Git is in your PATH: `$env:PATH -split ';' | Select-String git`
- Reinstall Git with proper PATH configuration

### Permission Issues
- Run PowerShell as Administrator if you encounter permission errors
- For npm global installs, you might need to configure npm prefix

### AWS CDK Installation Issues
- Ensure Node.js and npm are working first
- Clear npm cache: `npm cache clean --force`
- Try installing with verbose output: `npm install -g aws-cdk --verbose`

## System Requirements

- **Operating System**: Windows 10 or higher
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: At least 5GB free space
- **Internet Connection**: Required for downloads and AWS operations