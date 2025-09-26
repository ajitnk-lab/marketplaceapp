# Marketplace Platform Infrastructure

## Overview

The Marketplace Platform infrastructure is built using AWS CDK (Cloud Development Kit) with TypeScript. It follows a modular architecture with separate stacks for different concerns, enabling phased deployment and independent scaling.

## Architecture Components

### 1. Infrastructure Stack (`MarketplaceInfrastructureStack`)

**Purpose**: Core networking, storage, and CDN infrastructure

**Resources**:
- **VPC**: Multi-AZ VPC with public and private subnets
- **Security Groups**: 
  - Lambda Security Group (for function-to-function communication)
  - Database Security Group (for secure database access)
- **S3 Buckets**:
  - Assets Bucket (images, documentation)
  - Solution Files Bucket (downloadable packages)
  - CloudFront Logs Bucket
- **CloudFront Distribution**: Global CDN for asset delivery
- **CloudWatch Log Group**: Centralized logging

**Key Features**:
- DNS resolution enabled
- Versioned S3 buckets with lifecycle policies
- Secure bucket policies (no public access)
- CloudFront with separate behaviors for assets and solution files

### 2. Database Stack (`MarketplaceDatabaseStack`)

**Purpose**: Data storage and management

**Resources**:
- **DynamoDB Tables**:
  - Users Table (with email index)
  - Solutions Table (with category and partner indexes)
  - Transactions Table (with user and partner indexes)
  - Sessions Table (with TTL and user index)

**Key Features**:
- Pay-per-request billing mode
- Point-in-time recovery enabled
- AWS-managed encryption
- Contributor insights for monitoring
- Global Secondary Indexes for efficient queries

### 3. API Stack (`MarketplaceApiStack`)

**Purpose**: API Gateway and Lambda functions

**Resources**:
- **API Gateway**: RESTful API with CORS support
- **Lambda Functions**:
  - Users Function (user management)
  - Solutions Function (catalog management)
  - Transactions Function (payment processing)
- **Lambda Layer**: Common dependencies

**Key Features**:
- VPC-enabled Lambda functions
- Proper IAM permissions for DynamoDB access
- CloudWatch logging integration
- 30-second timeout and 256MB memory allocation

### 4. Monitoring Stack (`MarketplaceMonitoringStack`)

**Purpose**: Observability and alerting

**Resources**:
- **CloudWatch Dashboard**: Platform metrics visualization
- **CloudWatch Alarms**: Error rate and latency monitoring
- **SNS Topic**: Alert notifications

**Key Features**:
- Lambda function metrics (errors, duration)
- DynamoDB capacity metrics
- API Gateway request metrics
- Automated alerting for high error rates and latency

## Deployment

### Prerequisites

1. **AWS CLI**: Configured with appropriate credentials
2. **AWS CDK CLI**: Installed globally (`npm install -g aws-cdk`)
3. **Node.js**: Version 18 or higher
4. **AWS Account**: With sufficient permissions

### Environment Setup

```bash
# Install dependencies
cd packages/infrastructure
npm install

# Bootstrap CDK (first time only)
cdk bootstrap

# Build TypeScript
npm run build
```

### Development Deployment

```bash
# Deploy all stacks to development environment
npm run deploy

# Or use the PowerShell script
./scripts/deploy-dev.ps1
```

### Production Deployment

```bash
# Deploy to production with explicit context
cdk deploy --all --context stage=prod
```

### Stack Dependencies

The stacks have the following deployment order:
1. `MarketplaceInfrastructure-{stage}`
2. `MarketplaceDatabase-{stage}` (depends on Infrastructure)
3. `MarketplaceApi-{stage}` (depends on Database)
4. `MarketplaceMonitoring-{stage}` (depends on API)

## Configuration

### Environment Variables

Lambda functions receive the following environment variables:
- `USERS_TABLE_NAME`: DynamoDB users table name
- `SOLUTIONS_TABLE_NAME`: DynamoDB solutions table name
- `TRANSACTIONS_TABLE_NAME`: DynamoDB transactions table name
- `SESSIONS_TABLE_NAME`: DynamoDB sessions table name
- `STAGE`: Deployment stage (dev/staging/prod)
- `LOG_GROUP_NAME`: CloudWatch log group name

### Stage Configuration

The infrastructure supports multiple stages (dev, staging, prod) with:
- Separate resource naming
- Independent deployments
- Stage-specific configurations
- Isolated environments

## Security

### Network Security
- Lambda functions deployed in private subnets
- Security groups with minimal required access
- VPC endpoints for AWS service communication

### Data Security
- DynamoDB tables encrypted with AWS-managed keys
- S3 buckets with block public access enabled
- CloudWatch logs encrypted at rest

### Access Control
- IAM roles with least privilege principle
- Function-specific permissions for DynamoDB tables
- Separate security groups for different tiers

## Monitoring and Logging

### CloudWatch Dashboard
Access the dashboard at: `https://console.aws.amazon.com/cloudwatch/home#dashboards:name=marketplace-{stage}`

**Metrics Tracked**:
- Lambda function errors and duration
- DynamoDB read/write capacity consumption
- API Gateway request count and error rates

### Alarms
- **High Error Rate**: Triggers when Lambda errors exceed 10 in 2 evaluation periods
- **High Latency**: Triggers when API Gateway latency exceeds 5 seconds

### Logging
- Centralized logging in CloudWatch Log Group: `/aws/marketplace/{stage}`
- Lambda function logs with 1-week retention
- CloudFront access logs in dedicated S3 bucket

## Cost Optimization

### DynamoDB
- Pay-per-request billing mode (no provisioned capacity)
- Automatic scaling based on demand
- Point-in-time recovery for data protection

### Lambda
- Right-sized memory allocation (256MB)
- Efficient code with minimal cold starts
- VPC configuration only where necessary

### S3
- Lifecycle policies for old versions
- CloudFront caching to reduce origin requests
- Appropriate storage classes for different use cases

## Troubleshooting

### Common Issues

1. **CDK Bootstrap Required**
   ```bash
   cdk bootstrap
   ```

2. **Lambda Layer Dependencies**
   ```bash
   cd lambda-layers/common/nodejs
   npm install
   ```

3. **VPC Endpoint Issues**
   - Ensure NAT Gateway is properly configured
   - Check security group rules

4. **DynamoDB Access Issues**
   - Verify IAM permissions
   - Check VPC endpoint configuration

### Useful Commands

```bash
# View stack outputs
cdk list
cdk diff
cdk synth

# Check stack status
aws cloudformation describe-stacks --stack-name MarketplaceInfrastructure-dev

# View Lambda logs
aws logs tail /aws/lambda/MarketplaceApi-dev-UsersFunction --follow
```

## Next Steps

After completing Task 2 (Core Infrastructure Foundation), the infrastructure is ready for:

1. **Task 3**: Authentication system implementation
2. **Task 4**: User management backend services
3. **Task 5**: Solution catalog data model and backend

The modular architecture allows for incremental development and deployment of features while maintaining system stability and security.