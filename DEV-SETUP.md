# Development Environment Setup

This guide will help you set up your development environment for the Marketplace Platform project.

## Prerequisites

### Required Software

1. **Node.js (v18+)**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm or yarn**
   - Comes with Node.js
   - Verify installation: `npm --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **AWS CLI**
   - Download from: https://aws.amazon.com/cli/
   - Verify installation: `aws --version`

5. **AWS CDK**
   - Install globally: `npm install -g aws-cdk`
   - Verify installation: `cdk --version`

### VS Code Setup

1. **Install VS Code**
   - Download from: https://code.visualstudio.com/

2. **Install Recommended Extensions**
   - Open VS Code in this project
   - Press `Ctrl+Shift+P` and run "Extensions: Show Recommended Extensions"
   - Install all recommended extensions

### AWS Account Setup

1. **Create AWS Account**
   - Sign up at: https://aws.amazon.com/
   - Set up billing alerts in the AWS Console

2. **Configure AWS Credentials**
   ```bash
   aws configure
   ```
   - Enter your Access Key ID
   - Enter your Secret Access Key
   - Set default region (e.g., `us-east-1`)
   - Set default output format: `json`

3. **Test AWS Access**
   ```bash
   aws sts get-caller-identity
   ```

4. **Bootstrap CDK**
   ```bash
   cdk bootstrap
   ```

### Razorpay Setup

1. **Create Razorpay Account**
   - Sign up at: https://razorpay.com/
   - Complete KYC verification

2. **Get Test API Keys**
   - Navigate to Settings > API Keys
   - Generate test mode keys
   - Store securely (never commit to version control)

## Quick Setup

### Option 1: Automated Setup (Windows)

Run the setup script:

**PowerShell:**
```powershell
.\setup-dev-env.ps1
```

**Command Prompt:**
```cmd
setup-dev-env.bat
```

### Option 2: Manual Setup

1. **Check Node.js**
   ```bash
   node --version  # Should be v18+
   npm --version
   ```

2. **Check Git**
   ```bash
   git --version
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Install AWS CLI**
   ```bash
   aws --version
   ```

4. **Install AWS CDK**
   ```bash
   npm install -g aws-cdk
   cdk --version
   ```

5. **Configure AWS**
   ```bash
   aws configure
   aws sts get-caller-identity
   ```

6. **Test CDK**
   ```bash
   mkdir cdk-test
   cd cdk-test
   cdk init app --language typescript
   cdk synth
   cd ..
   rmdir /s cdk-test
   ```

## VS Code Terminal Configuration

The project includes VS Code settings that configure:
- PowerShell as the default terminal
- Terminal integration features
- Copy on selection
- Multi-line paste warnings disabled

## Troubleshooting

### Common Issues

1. **Node.js not found**
   - Ensure Node.js is installed and in your PATH
   - Restart your terminal/VS Code after installation

2. **AWS CLI not found**
   - Install AWS CLI v2 from the official website
   - Add to PATH if necessary

3. **CDK bootstrap fails**
   - Ensure AWS credentials are configured
   - Check AWS permissions
   - Verify the region is correct

4. **Permission errors on Windows**
   - Run PowerShell as Administrator
   - Set execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Getting Help

- Check the AWS CDK documentation: https://docs.aws.amazon.com/cdk/
- Razorpay documentation: https://razorpay.com/docs/
- Node.js documentation: https://nodejs.org/docs/

## Next Steps

After completing the setup:

1. Open the tasks.md file in VS Code
2. Click "Start task" next to the first development task
3. Follow the implementation plan step by step

## Environment Variables

Create a `.env` file in the project root with:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=your-account-id

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=your-test-key-id
RAZORPAY_KEY_SECRET=your-test-key-secret

# Application Configuration
NODE_ENV=development
PORT=3000
```

**Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.