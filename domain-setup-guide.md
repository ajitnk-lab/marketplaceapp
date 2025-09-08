# Domain Setup Guide for Cloud Nestle Website

This guide will help you configure the domain `cloudnestle.com` and set up DNS for the website.

## Prerequisites

- AWS CLI configured ✅ (from Task 0.2)
- Domain name decided: `cloudnestle.com`

## Step 1: Domain Acquisition

### Option A: Purchase Domain Through AWS Route53 (Recommended)

**Advantages:**
- ✅ Automatic DNS configuration
- ✅ Integrated with AWS services
- ✅ Easy SSL certificate validation
- ✅ No manual DNS delegation needed

**Steps:**
1. Go to AWS Console → Route53 → Registered domains
2. Click "Register domain"
3. Search for `cloudnestle.com`
4. If available, add to cart and complete purchase
5. **Cost**: ~$12-15/year

### Option B: Purchase Domain from External Registrar

**Popular Registrars:**
- GoDaddy, Namecheap, Google Domains, Cloudflare

**Advantages:**
- ✅ Often cheaper
- ✅ More registrar options
- ✅ Familiar interface

**Disadvantages:**
- ❌ Requires manual DNS delegation
- ❌ Additional configuration steps

## Step 2: DNS Configuration

### If Domain is Purchased Through Route53

**Automatic Setup:**
- ✅ Hosted zone automatically created
- ✅ Name servers automatically configured
- ✅ Ready for AWS services integration

**Verification:**
```powershell
# Check hosted zone
aws route53 list-hosted-zones --profile cloudnestle-dev

# Check name servers
aws route53 get-hosted-zone --id /hostedzone/YOUR_ZONE_ID --profile cloudnestle-dev
```

### If Domain is Purchased from External Registrar

**Manual DNS Delegation Required:**

1. **Create Route53 Hosted Zone:**
```powershell
aws route53 create-hosted-zone --name cloudnestle.com --caller-reference $(Get-Date -Format "yyyyMMddHHmmss") --profile cloudnestle-dev
```

2. **Get Name Servers:**
```powershell
aws route53 list-resource-record-sets --hosted-zone-id YOUR_ZONE_ID --profile cloudnestle-dev
```

3. **Update Registrar DNS Settings:**
   - Log into your domain registrar
   - Find DNS/Name Server settings
   - Replace default name servers with Route53 name servers:
     - `ns-xxx.awsdns-xx.com`
     - `ns-xxx.awsdns-xx.co.uk`
     - `ns-xxx.awsdns-xx.net`
     - `ns-xxx.awsdns-xx.org`

## Step 3: Domain Verification

### Check Domain Ownership
```powershell
# Check if domain resolves
nslookup cloudnestle.com

# Check name servers
nslookup -type=NS cloudnestle.com
```

### Verify Route53 Configuration
```powershell
# List hosted zones
aws route53 list-hosted-zones --profile cloudnestle-dev

# Check zone details
aws route53 list-resource-record-sets --hosted-zone-id YOUR_ZONE_ID --profile cloudnestle-dev
```

## Step 4: DNS Propagation

### Timeline
- **Route53 to Route53**: Immediate (0-5 minutes)
- **External to Route53**: 24-48 hours for full propagation
- **Regional variations**: Some areas may take longer

### Check Propagation Status
```powershell
# Check from different DNS servers
nslookup cloudnestle.com 8.8.8.8
nslookup cloudnestle.com 1.1.1.1
nslookup cloudnestle.com 208.67.222.222
```

**Online Tools:**
- https://www.whatsmydns.net/
- https://dnschecker.org/
- https://www.dnswatch.info/

## Step 5: Subdomain Planning

### Recommended Subdomain Structure

**Production:**
- `cloudnestle.com` → Main website
- `www.cloudnestle.com` → Redirect to main

**Development/Staging:**
- `dev.cloudnestle.com` → Development environment
- `staging.cloudnestle.com` → Staging environment

**Future Subdomains:**
- `admin.cloudnestle.com` → Admin interface (Phase 3+)
- `api.cloudnestle.com` → API endpoints (Phase 3+)
- `blog.cloudnestle.com` → Blog subdomain (optional)

## Step 6: SSL Certificate Preparation

### AWS Certificate Manager (ACM)

**Certificate Requirements:**
- Primary domain: `cloudnestle.com`
- Subject Alternative Names (SANs):
  - `www.cloudnestle.com`
  - `dev.cloudnestle.com`
  - `staging.cloudnestle.com`

**Certificate Request (will be done during infrastructure deployment):**
```powershell
# This will be automated in CDK, but for reference:
aws acm request-certificate --domain-name cloudnestle.com --subject-alternative-names www.cloudnestle.com dev.cloudnestle.com staging.cloudnestle.com --validation-method DNS --region us-east-1 --profile cloudnestle-dev
```

## Step 7: Domain Configuration Verification

### Create Domain Verification Script
```powershell
# Check domain status
function Test-Domain {
    param($Domain)
    
    Write-Host "Testing domain: $Domain" -ForegroundColor Yellow
    
    # Test DNS resolution
    try {
        $dnsResult = Resolve-DnsName $Domain -ErrorAction Stop
        Write-Host "✅ DNS Resolution: Success" -ForegroundColor Green
        Write-Host "   IP: $($dnsResult.IPAddress -join ', ')" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ DNS Resolution: Failed" -ForegroundColor Red
    }
    
    # Test name servers
    try {
        $nsResult = Resolve-DnsName $Domain -Type NS -ErrorAction Stop
        Write-Host "✅ Name Servers:" -ForegroundColor Green
        foreach ($ns in $nsResult) {
            Write-Host "   $($ns.NameHost)" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "❌ Name Servers: Not found" -ForegroundColor Red
    }
}

Test-Domain "cloudnestle.com"
```

## Step 8: Update Environment Variables

### Update .env.local
```env
# Domain Configuration
DOMAIN_NAME=cloudnestle.com
SUBDOMAIN_DEV=dev.cloudnestle.com
SUBDOMAIN_STAGING=staging.cloudnestle.com

# Route53 Configuration (will be populated after setup)
HOSTED_ZONE_ID=your-hosted-zone-id
```

## Troubleshooting

### Domain Not Resolving
- **Check**: DNS propagation (can take 24-48 hours)
- **Verify**: Name servers are correctly set at registrar
- **Test**: Use different DNS servers (8.8.8.8, 1.1.1.1)

### Name Server Issues
- **Verify**: Route53 hosted zone exists
- **Check**: Name servers match between Route53 and registrar
- **Wait**: DNS propagation can be slow

### SSL Certificate Issues
- **Ensure**: Domain is resolving before requesting certificate
- **Check**: DNS validation records are created
- **Verify**: Certificate is requested in us-east-1 region

### Route53 Access Issues
- **Verify**: AWS credentials have Route53 permissions
- **Check**: Correct AWS profile is being used
- **Test**: `aws route53 list-hosted-zones --profile cloudnestle-dev`

## Cost Considerations

### Route53 Costs
- **Hosted Zone**: $0.50/month per zone
- **DNS Queries**: $0.40 per million queries (first 1 billion queries/month)
- **Domain Registration**: $12-15/year (varies by TLD)

### Total Monthly Cost
- **Domain**: ~$1/month (annual registration divided by 12)
- **Route53**: ~$0.50/month
- **Total**: ~$1.50/month for DNS

## Security Considerations

### Domain Security
- ✅ Enable domain lock at registrar
- ✅ Use strong passwords for registrar account
- ✅ Enable 2FA on registrar account
- ✅ Keep registrar contact information updated

### DNS Security
- ✅ Use Route53 for authoritative DNS
- ✅ Monitor DNS changes
- ✅ Set up CloudWatch alarms for Route53

## Next Steps

After domain configuration:
1. ✅ Verify domain ownership and DNS resolution
2. ✅ Confirm Route53 hosted zone is working
3. ➡️ Set up development tools and IDE (Task 0.5)
4. ➡️ Deploy infrastructure with CDK (includes SSL certificate)

## Quick Verification Checklist

- [ ] Domain purchased or ownership verified
- [ ] Route53 hosted zone created
- [ ] Name servers configured at registrar (if external)
- [ ] DNS propagation completed
- [ ] Domain resolves correctly
- [ ] Environment variables updated
- [ ] AWS Route53 access verified