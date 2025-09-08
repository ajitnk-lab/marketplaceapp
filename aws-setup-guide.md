# AWS Setup Guide for Cloud Nestle Website

This guide will help you configure AWS credentials and permissions for the Cloud Nestle website project.

## Prerequisites

- AWS CLI v2 installed ✅ (already verified)
- An AWS account (if you don't have one, create at https://aws.amazon.com/)

## Step 1: Create IAM User for Development

### 1.1 Log into AWS Console
- Go to https://console.aws.amazon.com/
- Sign in with your AWS account credentials

### 1.2 Navigate to IAM Service
- Search for "IAM" in the AWS Console search bar
- Click on "IAM" service

### 1.3 Create New User
1. Click "Users" in the left sidebar
2. Click "Create user" button
3. **User name**: `cloudnestle-dev-user`
4. **Access type**: Select "Programmatic access" (for CLI/API access)
5. Click "Next"

### 1.4 Attach Permissions
For development, you'll need these permissions. Choose **Option A** for simplicity or **Option B** for better security:

#### Option A: Administrator Access (Simpler, Less Secure)
1. Click "Attach existing policies directly"
2. Search for and select: `AdministratorAccess`
3. Click "Next"

#### Option B: Specific Permissions (More Secure, Recommended)
1. Click "Create policy"
2. Use the JSON editor and paste this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "cloudfront:*",
                "route53:*",
                "acm:*",
                "lambda:*",
                "apigateway:*",
                "iam:*",
                "cloudformation:*",
                "ssm:*",
                "logs:*",
                "cloudwatch:*",
                "sts:GetCallerIdentity"
            ],
            "Resource": "*"
        }
    ]
}
```

3. Name the policy: `CloudNestleWebsitePolicy`
4. Create the policy
5. Go back to user creation and attach this policy

### 1.5 Complete User Creation
1. Review the settings
2. Click "Create user"
3. **IMPORTANT**: Save the Access Key ID and Secret Access Key
   - Download the CSV file or copy the credentials
   - You won't be able to see the secret key again!

## Step 2: Configure AWS CLI

### 2.1 Configure Default Profile
Run this command and enter your credentials:

```powershell
aws configure
```

Enter the following when prompted:
- **AWS Access Key ID**: [Your Access Key from Step 1.5]
- **AWS Secret Access Key**: [Your Secret Key from Step 1.5]
- **Default region name**: `us-east-1` (recommended for global services)
- **Default output format**: `json`

### 2.2 Configure Development Profile
Create a separate profile for development:

```powershell
aws configure --profile cloudnestle-dev
```

Use the same credentials as above.

### 2.3 Configure Production Profile (Optional)
If you have separate production credentials:

```powershell
aws configure --profile cloudnestle-prod
```

## Step 3: Verify AWS Access

### 3.1 Test Default Profile
```powershell
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/cloudnestle-dev-user"
}
```

### 3.2 Test Development Profile
```powershell
aws sts get-caller-identity --profile cloudnestle-dev
```

Should show the same information.

### 3.3 Test S3 Access
```powershell
aws s3 ls --profile cloudnestle-dev
```

This should list your S3 buckets (or show empty if you have none).

## Step 4: Set Up Environment Variables

### 4.1 Create Environment Variables File
Create a `.env.local` file in your project root:

```env
# AWS Configuration
AWS_PROFILE=cloudnestle-dev
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=your-account-id-here

# Environment
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
```

### 4.2 Set PowerShell Environment Variables (Optional)
For convenience, you can set these in your PowerShell profile:

```powershell
# Add to your PowerShell profile
$env:AWS_PROFILE = "cloudnestle-dev"
$env:AWS_REGION = "us-east-1"
```

## Step 5: Security Best Practices

### 5.1 Credential Storage
- ✅ Store credentials in AWS CLI configuration files (secure)
- ❌ Never commit credentials to Git repositories
- ❌ Never share credentials in plain text

### 5.2 Access Key Rotation
- Rotate access keys every 90 days
- Create new keys before deleting old ones
- Test new keys before removing old ones

### 5.3 Multi-Factor Authentication (MFA)
Consider enabling MFA on your AWS account for additional security.

## Troubleshooting

### "Access Denied" Errors
- Check that your IAM user has the necessary permissions
- Verify you're using the correct AWS profile
- Ensure your credentials are correctly configured

### "Invalid Credentials" Errors
- Double-check your Access Key ID and Secret Access Key
- Make sure there are no extra spaces in the credentials
- Try reconfiguring with `aws configure`

### Region Issues
- Use `us-east-1` for global services like CloudFront and ACM
- Some services are only available in specific regions

### Profile Issues
- List all profiles: `aws configure list-profiles`
- Check current profile: `aws configure list`
- Switch profiles: `aws configure --profile profile-name`

## Next Steps

After completing AWS setup:
1. ✅ Verify all commands work without errors
2. ➡️ Proceed to GitHub repository setup (Task 0.3)
3. ➡️ Configure domain settings (Task 0.4)

## Quick Verification Checklist

Run these commands to verify everything is working:

```powershell
# Check AWS identity
aws sts get-caller-identity --profile cloudnestle-dev

# Check S3 access
aws s3 ls --profile cloudnestle-dev

# Check CloudFormation access (needed for CDK)
aws cloudformation list-stacks --profile cloudnestle-dev

# Check Route53 access
aws route53 list-hosted-zones --profile cloudnestle-dev
```

All commands should complete without "Access Denied" errors.