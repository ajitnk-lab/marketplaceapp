# GitHub Repository Secrets Setup

After creating your GitHub repository, you need to configure secrets for automated deployment. These secrets allow GitHub Actions to deploy your website to AWS.

## Required Repository Secrets

Go to your repository on GitHub → Settings → Secrets and variables → Actions → New repository secret

### AWS Credentials

**AWS_ACCESS_KEY_ID**
- **Value**: Your AWS Access Key ID
- **Description**: AWS credentials for deployment

**AWS_SECRET_ACCESS_KEY**
- **Value**: Your AWS Secret Access Key  
- **Description**: AWS credentials for deployment

**AWS_REGION**
- **Value**: `us-east-1`
- **Description**: AWS region for deployment

**AWS_ACCOUNT_ID**
- **Value**: Your AWS Account ID (e.g., `039920874011`)
- **Description**: AWS account identifier

### GitHub Integration

**GITHUB_TOKEN**
- **Value**: Your GitHub Personal Access Token
- **Description**: Token for admin interface to commit content changes

### Domain Configuration

**DOMAIN_NAME**
- **Value**: `cloudnestle.com`
- **Description**: Your website domain name

### Optional Secrets (for later phases)

**ADMIN_EMAIL**
- **Value**: Your email address
- **Description**: Admin contact email

## How to Add Secrets

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the **Name** and **Secret** value
6. Click **Add secret**

## Security Notes

- ✅ Secrets are encrypted and only visible to GitHub Actions
- ✅ Never commit secrets to your code repository
- ✅ Rotate secrets regularly (every 90 days recommended)
- ❌ Don't share secrets in plain text or screenshots

## Verification

After adding all secrets, you can verify they're configured by:
1. Going to Settings → Secrets and variables → Actions
2. You should see all the secret names listed (values are hidden)
3. GitHub Actions will use these secrets automatically when deploying

## Next Steps

Once secrets are configured:
1. Push your code to the main branch
2. GitHub Actions will automatically deploy to AWS
3. Your website will be live at your domain within 5-10 minutes