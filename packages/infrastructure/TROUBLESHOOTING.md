# Troubleshooting Guide

## Quick Start

If you're having issues, run these scripts in order:

1. `verify-setup.bat` - Check what's working and what needs fixing
2. `setup-and-deploy.bat` - Set up Node.js, npm, CDK and build the project
3. `setup-aws-and-deploy.bat` - Configure AWS and deploy infrastructure

Or run `complete-setup.bat` to do everything automatically.

## Common Issues

### 1. Node.js/npm Not Found

**Symptoms:**
- `'node' is not recognized as an internal or external command`
- `'npm' is not recognized as an internal or external command`

**Solutions:**
- Install Node.js from https://nodejs.org/
- Or if already installed, add `C:\Program Files\nodejs` to your PATH
- Use the batch files which use full paths

### 2. PowerShell Not Working

**Symptoms:**
- PowerShell commands don't show output
- Scripts hang or don't respond

**Solutions:**
- Run `fix-powershell.bat` to repair PowerShell
- Or run `reinstall-powershell.bat` to install PowerShell 7
- Use the batch files (.bat) instead of PowerShell scripts (.ps1)

### 3. CDK Not Found

**Symptoms:**
- `'cdk' is not recognized as an internal or external command`
- CDK commands fail

**Solutions:**
- Install globally: `npm install -g aws-cdk`
- Or use npx: `npx cdk --version`
- The batch files handle this automatically

### 4. AWS CLI Not Found

**Symptoms:**
- `'aws' is not recognized as an internal or external command`

**Solutions:**
- Install via winget: `winget install Amazon.AWSCLI`
- Or download from: https://aws.amazon.com/cli/
- Restart terminal after installation

### 5. AWS Credentials Not Configured

**Symptoms:**
- `Unable to locate credentials`
- `The security token included in the request is invalid`

**Solutions:**
- Run: `aws configure`
- Or set environment variables:
  ```
  set AWS_ACCESS_KEY_ID=your-access-key
  set AWS_SECRET_ACCESS_KEY=your-secret-key
  set AWS_DEFAULT_REGION=us-east-1
  ```

### 6. CDK Bootstrap Required

**Symptoms:**
- `This stack uses assets, so the toolkit stack must be deployed`

**Solutions:**
- Run: `npx cdk bootstrap`
- Or: `cdk bootstrap` if CDK is installed globally

### 7. TypeScript Build Errors

**Symptoms:**
- Build fails with TypeScript errors
- Missing type definitions

**Solutions:**
- Install dependencies: `npm install`
- Install types: `npm install --save-dev @types/node`
- Check tsconfig.json configuration

### 8. Lambda Layer Dependencies Missing

**Symptoms:**
- CDK synthesis fails
- Lambda layer errors

**Solutions:**
- Install layer dependencies:
  ```
  cd lambda-layers/common/nodejs
  npm install
  cd ../../..
  ```

### 9. Deployment Fails

**Symptoms:**
- CloudFormation stack creation fails
- Resource creation errors

**Solutions:**
- Check AWS permissions
- Verify region availability
- Check resource limits/quotas
- Review CloudFormation events in AWS Console

### 10. Stack Already Exists

**Symptoms:**
- `Stack already exists`
- Update conflicts

**Solutions:**
- Use update instead: `cdk deploy --all`
- Or destroy first: `cdk destroy --all` (WARNING: deletes all data)
- Check stack status in CloudFormation console

## Manual Commands

If the batch files don't work, try these manual commands:

### Build and Test
```cmd
cd packages/infrastructure
"C:\Program Files\nodejs\npm.cmd" install
"C:\Program Files\nodejs\npm.cmd" run build
"C:\Program Files\nodejs\npx.cmd" cdk synth --context stage=dev
```

### Deploy
```cmd
aws configure
"C:\Program Files\nodejs\npx.cmd" cdk bootstrap
"C:\Program Files\nodejs\npx.cmd" cdk deploy --all --context stage=dev
```

### Verify Deployment
```cmd
aws cloudformation list-stacks --query "StackSummaries[?contains(StackName, 'Marketplace')]"
"C:\Program Files\nodejs\npx.cmd" cdk list --context stage=dev
```

## Getting Help

1. Check AWS CloudFormation console for detailed error messages
2. Check CloudWatch logs for Lambda function errors
3. Verify IAM permissions for your AWS user/role
4. Check AWS service limits and quotas
5. Review the CDK documentation: https://docs.aws.amazon.com/cdk/

## Clean Up

To remove all deployed resources:
```cmd
"C:\Program Files\nodejs\npx.cmd" cdk destroy --all --context stage=dev
```

**WARNING:** This will delete all data and resources!