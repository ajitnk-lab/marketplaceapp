# GitHub Setup Guide for Cloud Nestle Website

This guide will help you set up the GitHub repository and configure access for the Cloud Nestle website project.

## Prerequisites

- Git installed and configured ✅ (from Task 0.1)
- GitHub account (create at https://github.com if you don't have one)

## Step 1: Create GitHub Repository

### 1.1 Create Repository on GitHub.com
1. Go to https://github.com
2. Sign in to your GitHub account
3. Click the "+" icon in the top right corner
4. Select "New repository"

### 1.2 Repository Configuration
- **Repository name**: `cloudnestle-website`
- **Description**: `Professional website for Cloud Nestle Consulting and Services - AWS cloud consulting and migration services`
- **Visibility**: 
  - ✅ **Public** (recommended for open source)
  - ⚠️ **Private** (if you prefer to keep it private)
- **Initialize repository**:
  - ✅ Add a README file
  - ✅ Add .gitignore (choose "Node" template)
  - ✅ Choose a license (MIT License recommended)

### 1.3 Create Repository
Click "Create repository" to create your new repository.

## Step 2: Generate GitHub Personal Access Token

### 2.1 Navigate to Token Settings
1. Click your profile picture (top right)
2. Go to "Settings"
3. Scroll down to "Developer settings" (left sidebar)
4. Click "Personal access tokens"
5. Click "Tokens (classic)"

### 2.2 Generate New Token
1. Click "Generate new token" → "Generate new token (classic)"
2. **Note**: `Cloud Nestle Website - Admin Interface`
3. **Expiration**: Choose "90 days" or "No expiration" (less secure but convenient)

### 2.3 Select Scopes (Permissions)
Select these scopes for the admin interface to work:
- ✅ **repo** (Full control of private repositories)
  - ✅ repo:status
  - ✅ repo_deployment
  - ✅ public_repo
  - ✅ repo:invite
  - ✅ security_events
- ✅ **workflow** (Update GitHub Action workflows)
- ✅ **write:packages** (Upload packages to GitHub Package Registry)
- ✅ **read:packages** (Download packages from GitHub Package Registry)

### 2.4 Generate and Save Token
1. Click "Generate token"
2. **IMPORTANT**: Copy the token immediately and save it securely
3. You won't be able to see it again!

## Step 3: Configure Git SSH Keys (Recommended)

### 3.1 Check for Existing SSH Keys
```powershell
ls ~/.ssh
```

If you see `id_rsa.pub` or `id_ed25519.pub`, you already have SSH keys.

### 3.2 Generate New SSH Key (if needed)
```powershell
ssh-keygen -t ed25519 -C "your.email@example.com"
```

- Press Enter to accept the default file location
- Enter a passphrase (optional but recommended)

### 3.3 Add SSH Key to SSH Agent
```powershell
# Start SSH agent
Start-Service ssh-agent

# Add your SSH key
ssh-add ~/.ssh/id_ed25519
```

### 3.4 Add SSH Key to GitHub
1. Copy your public key:
```powershell
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

2. Go to GitHub → Settings → SSH and GPG keys
3. Click "New SSH key"
4. **Title**: `Cloud Nestle Development Machine`
5. **Key**: Paste your public key
6. Click "Add SSH key"

### 3.5 Test SSH Connection
```powershell
ssh -T git@github.com
```

Expected output: `Hi username! You've successfully authenticated...`

## Step 4: Clone Repository Locally

### 4.1 Clone Using SSH (Recommended)
```powershell
git clone git@github.com:YOUR_USERNAME/cloudnestle-website.git
cd cloudnestle-website
```

### 4.2 Clone Using HTTPS (Alternative)
```powershell
git clone https://github.com/YOUR_USERNAME/cloudnestle-website.git
cd cloudnestle-website
```

## Step 5: Set Up GitHub Repository Secrets

### 5.1 Navigate to Repository Secrets
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"

### 5.2 Add AWS Credentials
Click "New repository secret" and add these secrets:

**AWS_ACCESS_KEY_ID**
- Name: `AWS_ACCESS_KEY_ID`
- Secret: Your AWS Access Key ID

**AWS_SECRET_ACCESS_KEY**
- Name: `AWS_SECRET_ACCESS_KEY`
- Secret: Your AWS Secret Access Key

**AWS_REGION**
- Name: `AWS_REGION`
- Secret: `us-east-1`

**AWS_ACCOUNT_ID**
- Name: `AWS_ACCOUNT_ID`
- Secret: Your AWS Account ID (e.g., `039920874011`)

### 5.3 Add GitHub Token
**GITHUB_TOKEN**
- Name: `GITHUB_TOKEN`
- Secret: The Personal Access Token you created in Step 2

### 5.4 Add Other Configuration Secrets
**DOMAIN_NAME**
- Name: `DOMAIN_NAME`
- Secret: `cloudnestle.com`

## Step 6: Configure Repository Settings

### 6.1 Branch Protection (Optional but Recommended)
1. Go to Settings → Branches
2. Click "Add rule"
3. **Branch name pattern**: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

### 6.2 Enable GitHub Actions
1. Go to "Actions" tab in your repository
2. If prompted, click "I understand my workflows, go ahead and enable them"

## Step 7: Verify GitHub API Access

### 7.1 Test Repository Access
```powershell
# Test with your token (replace YOUR_TOKEN with actual token)
$headers = @{ Authorization = "token YOUR_TOKEN" }
Invoke-RestMethod -Uri "https://api.github.com/repos/YOUR_USERNAME/cloudnestle-website" -Headers $headers
```

### 7.2 Test Write Access
```powershell
# Create a test file
echo "# Test" > test-file.md
git add test-file.md
git commit -m "Test commit"
git push origin main

# Clean up
git rm test-file.md
git commit -m "Remove test file"
git push origin main
```

## Step 8: Update Environment Variables

### 8.1 Update .env.local File
Edit the `.env.local` file created in the previous task:

```env
# AWS Configuration
AWS_PROFILE=cloudnestle-dev
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=039920874011

# Environment Configuration
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development

# Project Configuration
PROJECT_NAME=cloudnestle-website
DOMAIN_NAME=cloudnestle.com

# GitHub Configuration
GITHUB_OWNER=YOUR_GITHUB_USERNAME
GITHUB_REPO=cloudnestle-website
GITHUB_TOKEN=YOUR_GITHUB_TOKEN

# Admin Configuration
ADMIN_EMAIL=your-email@example.com
```

Replace:
- `YOUR_GITHUB_USERNAME` with your actual GitHub username
- `YOUR_GITHUB_TOKEN` with the token you generated

## Troubleshooting

### SSH Key Issues
- Make sure SSH agent is running: `Get-Service ssh-agent`
- Verify key is added: `ssh-add -l`
- Test connection: `ssh -T git@github.com`

### Permission Denied Errors
- Check that your GitHub token has the correct scopes
- Verify the token hasn't expired
- Make sure you're using the correct repository name

### Git Configuration Issues
- Verify Git is configured: `git config --list`
- Set user info if missing:
  ```powershell
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### Repository Access Issues
- Verify repository exists and you have access
- Check if repository is private and you have permissions
- Ensure you're using the correct repository URL

## Security Best Practices

### Token Security
- ✅ Store tokens in GitHub Secrets, not in code
- ✅ Use tokens with minimal required permissions
- ✅ Rotate tokens regularly (every 90 days)
- ❌ Never commit tokens to Git repositories

### SSH Key Security
- ✅ Use strong passphrases for SSH keys
- ✅ Use Ed25519 keys (more secure than RSA)
- ✅ Regularly rotate SSH keys
- ❌ Never share private keys

### Repository Security
- ✅ Enable branch protection on main branch
- ✅ Require pull request reviews for important changes
- ✅ Use GitHub's security features (Dependabot, etc.)

## Next Steps

After completing GitHub setup:
1. ✅ Verify all GitHub operations work without errors
2. ➡️ Configure domain and DNS settings (Task 0.4)
3. ➡️ Set up development tools and IDE (Task 0.5)

## Quick Verification Checklist

- [ ] Repository created on GitHub
- [ ] Personal Access Token generated with correct scopes
- [ ] SSH keys configured and tested
- [ ] Repository cloned locally
- [ ] GitHub Secrets configured with AWS credentials
- [ ] Environment variables updated with GitHub info
- [ ] Git push/pull operations working
- [ ] GitHub API access verified