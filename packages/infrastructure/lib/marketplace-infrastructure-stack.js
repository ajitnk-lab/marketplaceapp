"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceInfrastructureStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const cloudfront = __importStar(require("aws-cdk-lib/aws-cloudfront"));
const origins = __importStar(require("aws-cdk-lib/aws-cloudfront-origins"));
const logs = __importStar(require("aws-cdk-lib/aws-logs"));
class MarketplaceInfrastructureStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // VPC with public and private subnets
        this.vpc = new ec2.Vpc(this, 'MarketplaceVpc', {
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                },
            ],
            enableDnsHostnames: true,
            enableDnsSupport: true,
        });
        // Security Groups
        this.lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for Lambda functions',
            allowAllOutbound: true,
        });
        this.databaseSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
            vpc: this.vpc,
            description: 'Security group for database access',
            allowAllOutbound: false,
        });
        // Allow Lambda to access database
        this.databaseSecurityGroup.addIngressRule(this.lambdaSecurityGroup, ec2.Port.tcp(443), 'Allow HTTPS from Lambda functions');
        // S3 bucket for static assets (images, documentation)
        this.assetsBucket = new s3.Bucket(this, 'AssetsBucket', {
            bucketName: `marketplace-assets-${props.stage}-${this.account}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: true,
            cors: [
                {
                    allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
                    allowedOrigins: ['*'],
                    allowedHeaders: ['*'],
                },
            ],
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            lifecycleRules: [
                {
                    id: 'DeleteOldVersions',
                    enabled: true,
                    noncurrentVersionExpiration: cdk.Duration.days(30),
                },
            ],
        });
        // S3 bucket for solution files (downloads, packages)
        this.solutionFilesBucket = new s3.Bucket(this, 'SolutionFilesBucket', {
            bucketName: `marketplace-solutions-${props.stage}-${this.account}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: true,
            cors: [
                {
                    allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
                    allowedOrigins: ['*'],
                    allowedHeaders: ['*'],
                },
            ],
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            lifecycleRules: [
                {
                    id: 'DeleteOldVersions',
                    enabled: true,
                    noncurrentVersionExpiration: cdk.Duration.days(90),
                },
            ],
        });
        // CloudWatch Log Group for centralized logging
        this.logGroup = new logs.LogGroup(this, 'MarketplaceLogGroup', {
            logGroupName: `/aws/marketplace/${props.stage}`,
            retention: logs.RetentionDays.ONE_MONTH,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        // CloudFront distribution for assets
        this.distribution = new cloudfront.Distribution(this, 'AssetsDistribution', {
            defaultBehavior: {
                origin: new origins.S3Origin(this.assetsBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
            },
            additionalBehaviors: {
                '/solutions/*': {
                    origin: new origins.S3Origin(this.solutionFilesBucket),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED, // Solution files should not be cached
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                },
            },
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Use only North America and Europe
            enableLogging: true,
            logBucket: new s3.Bucket(this, 'CloudFrontLogsBucket', {
                bucketName: `marketplace-cf-logs-${props.stage}-${this.account}`,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                autoDeleteObjects: true,
            }),
        });
        // Outputs
        new cdk.CfnOutput(this, 'VpcId', {
            value: this.vpc.vpcId,
            exportName: `${props.stage}-VpcId`,
        });
        new cdk.CfnOutput(this, 'AssetsBucketName', {
            value: this.assetsBucket.bucketName,
            exportName: `${props.stage}-AssetsBucketName`,
        });
        new cdk.CfnOutput(this, 'SolutionFilesBucketName', {
            value: this.solutionFilesBucket.bucketName,
            exportName: `${props.stage}-SolutionFilesBucketName`,
        });
        new cdk.CfnOutput(this, 'CloudFrontDomainName', {
            value: this.distribution.distributionDomainName,
            exportName: `${props.stage}-CloudFrontDomainName`,
        });
        new cdk.CfnOutput(this, 'LogGroupName', {
            value: this.logGroup.logGroupName,
            exportName: `${props.stage}-LogGroupName`,
        });
    }
}
exports.MarketplaceInfrastructureStack = MarketplaceInfrastructureStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2V0cGxhY2UtaW5mcmFzdHJ1Y3R1cmUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXJrZXRwbGFjZS1pbmZyYXN0cnVjdHVyZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFtQztBQUNuQyx5REFBMkM7QUFDM0MsdURBQXlDO0FBQ3pDLHVFQUF5RDtBQUN6RCw0RUFBOEQ7QUFDOUQsMkRBQTZDO0FBTzdDLE1BQWEsOEJBQStCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFTM0QsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQztRQUNsRixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzdDLE1BQU0sRUFBRSxDQUFDO1lBQ1QsV0FBVyxFQUFFLENBQUM7WUFDZCxtQkFBbUIsRUFBRTtnQkFDbkI7b0JBQ0UsUUFBUSxFQUFFLEVBQUU7b0JBQ1osSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTtpQkFDbEM7Z0JBQ0Q7b0JBQ0UsUUFBUSxFQUFFLEVBQUU7b0JBQ1osSUFBSSxFQUFFLFNBQVM7b0JBQ2YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsbUJBQW1CO2lCQUMvQzthQUNGO1lBQ0Qsa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixnQkFBZ0IsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztRQUVILGtCQUFrQjtRQUNsQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUM1RSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7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QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udCc7XHJcbmltcG9ydCAqIGFzIG9yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XHJcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxvZ3MnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWFya2V0cGxhY2VJbmZyYXN0cnVjdHVyZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XHJcbiAgc3RhZ2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hcmtldHBsYWNlSW5mcmFzdHJ1Y3R1cmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgcHVibGljIHJlYWRvbmx5IHZwYzogZWMyLlZwYztcclxuICBwdWJsaWMgcmVhZG9ubHkgYXNzZXRzQnVja2V0OiBzMy5CdWNrZXQ7XHJcbiAgcHVibGljIHJlYWRvbmx5IHNvbHV0aW9uRmlsZXNCdWNrZXQ6IHMzLkJ1Y2tldDtcclxuICBwdWJsaWMgcmVhZG9ubHkgZGlzdHJpYnV0aW9uOiBjbG91ZGZyb250LkRpc3RyaWJ1dGlvbjtcclxuICBwdWJsaWMgcmVhZG9ubHkgbGFtYmRhU2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXA7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRhdGFiYXNlU2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXA7XHJcbiAgcHVibGljIHJlYWRvbmx5IGxvZ0dyb3VwOiBsb2dzLkxvZ0dyb3VwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTWFya2V0cGxhY2VJbmZyYXN0cnVjdHVyZVN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIC8vIFZQQyB3aXRoIHB1YmxpYyBhbmQgcHJpdmF0ZSBzdWJuZXRzXHJcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdNYXJrZXRwbGFjZVZwYycsIHtcclxuICAgICAgbWF4QXpzOiAyLFxyXG4gICAgICBuYXRHYXRld2F5czogMSxcclxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcclxuICAgICAgICAgIG5hbWU6ICdQdWJsaWMnLFxyXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY2lkck1hc2s6IDI0LFxyXG4gICAgICAgICAgbmFtZTogJ1ByaXZhdGUnLFxyXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IHRydWUsXHJcbiAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZWN1cml0eSBHcm91cHNcclxuICAgIHRoaXMubGFtYmRhU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnTGFtYmRhU2VjdXJpdHlHcm91cCcsIHtcclxuICAgICAgdnBjOiB0aGlzLnZwYyxcclxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBncm91cCBmb3IgTGFtYmRhIGZ1bmN0aW9ucycsXHJcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRhdGFiYXNlU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnRGF0YWJhc2VTZWN1cml0eUdyb3VwJywge1xyXG4gICAgICB2cGM6IHRoaXMudnBjLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1NlY3VyaXR5IGdyb3VwIGZvciBkYXRhYmFzZSBhY2Nlc3MnLFxyXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiBmYWxzZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFsbG93IExhbWJkYSB0byBhY2Nlc3MgZGF0YWJhc2VcclxuICAgIHRoaXMuZGF0YWJhc2VTZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKFxyXG4gICAgICB0aGlzLmxhbWJkYVNlY3VyaXR5R3JvdXAsXHJcbiAgICAgIGVjMi5Qb3J0LnRjcCg0NDMpLFxyXG4gICAgICAnQWxsb3cgSFRUUFMgZnJvbSBMYW1iZGEgZnVuY3Rpb25zJ1xyXG4gICAgKTtcclxuXHJcbiAgICAvLyBTMyBidWNrZXQgZm9yIHN0YXRpYyBhc3NldHMgKGltYWdlcywgZG9jdW1lbnRhdGlvbilcclxuICAgIHRoaXMuYXNzZXRzQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnQXNzZXRzQnVja2V0Jywge1xyXG4gICAgICBidWNrZXROYW1lOiBgbWFya2V0cGxhY2UtYXNzZXRzLSR7cHJvcHMuc3RhZ2V9LSR7dGhpcy5hY2NvdW50fWAsXHJcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxyXG4gICAgICB2ZXJzaW9uZWQ6IHRydWUsXHJcbiAgICAgIGNvcnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBhbGxvd2VkTWV0aG9kczogW3MzLkh0dHBNZXRob2RzLkdFVCwgczMuSHR0cE1ldGhvZHMuUFVULCBzMy5IdHRwTWV0aG9kcy5QT1NUXSxcclxuICAgICAgICAgIGFsbG93ZWRPcmlnaW5zOiBbJyonXSxcclxuICAgICAgICAgIGFsbG93ZWRIZWFkZXJzOiBbJyonXSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcclxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcclxuICAgICAgbGlmZWN5Y2xlUnVsZXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ0RlbGV0ZU9sZFZlcnNpb25zJyxcclxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICBub25jdXJyZW50VmVyc2lvbkV4cGlyYXRpb246IGNkay5EdXJhdGlvbi5kYXlzKDMwKSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUzMgYnVja2V0IGZvciBzb2x1dGlvbiBmaWxlcyAoZG93bmxvYWRzLCBwYWNrYWdlcylcclxuICAgIHRoaXMuc29sdXRpb25GaWxlc0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NvbHV0aW9uRmlsZXNCdWNrZXQnLCB7XHJcbiAgICAgIGJ1Y2tldE5hbWU6IGBtYXJrZXRwbGFjZS1zb2x1dGlvbnMtJHtwcm9wcy5zdGFnZX0tJHt0aGlzLmFjY291bnR9YCxcclxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXHJcbiAgICAgIHZlcnNpb25lZDogdHJ1ZSxcclxuICAgICAgY29yczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGFsbG93ZWRNZXRob2RzOiBbczMuSHR0cE1ldGhvZHMuR0VULCBzMy5IdHRwTWV0aG9kcy5QVVQsIHMzLkh0dHBNZXRob2RzLlBPU1RdLFxyXG4gICAgICAgICAgYWxsb3dlZE9yaWdpbnM6IFsnKiddLFxyXG4gICAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnKiddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxyXG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxyXG4gICAgICBsaWZlY3ljbGVSdWxlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnRGVsZXRlT2xkVmVyc2lvbnMnLFxyXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgIG5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbjogY2RrLkR1cmF0aW9uLmRheXMoOTApLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDbG91ZFdhdGNoIExvZyBHcm91cCBmb3IgY2VudHJhbGl6ZWQgbG9nZ2luZ1xyXG4gICAgdGhpcy5sb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHRoaXMsICdNYXJrZXRwbGFjZUxvZ0dyb3VwJywge1xyXG4gICAgICBsb2dHcm91cE5hbWU6IGAvYXdzL21hcmtldHBsYWNlLyR7cHJvcHMuc3RhZ2V9YCxcclxuICAgICAgcmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuT05FX01PTlRILFxyXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gZm9yIGFzc2V0c1xyXG4gICAgdGhpcy5kaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5EaXN0cmlidXRpb24odGhpcywgJ0Fzc2V0c0Rpc3RyaWJ1dGlvbicsIHtcclxuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7XHJcbiAgICAgICAgb3JpZ2luOiBuZXcgb3JpZ2lucy5TM09yaWdpbih0aGlzLmFzc2V0c0J1Y2tldCksXHJcbiAgICAgICAgdmlld2VyUHJvdG9jb2xQb2xpY3k6IGNsb3VkZnJvbnQuVmlld2VyUHJvdG9jb2xQb2xpY3kuUkVESVJFQ1RfVE9fSFRUUFMsXHJcbiAgICAgICAgY2FjaGVQb2xpY3k6IGNsb3VkZnJvbnQuQ2FjaGVQb2xpY3kuQ0FDSElOR19PUFRJTUlaRUQsXHJcbiAgICAgICAgYWxsb3dlZE1ldGhvZHM6IGNsb3VkZnJvbnQuQWxsb3dlZE1ldGhvZHMuQUxMT1dfR0VUX0hFQURfT1BUSU9OUyxcclxuICAgICAgICBjYWNoZWRNZXRob2RzOiBjbG91ZGZyb250LkNhY2hlZE1ldGhvZHMuQ0FDSEVfR0VUX0hFQURfT1BUSU9OUyxcclxuICAgICAgfSxcclxuICAgICAgYWRkaXRpb25hbEJlaGF2aW9yczoge1xyXG4gICAgICAgICcvc29sdXRpb25zLyonOiB7XHJcbiAgICAgICAgICBvcmlnaW46IG5ldyBvcmlnaW5zLlMzT3JpZ2luKHRoaXMuc29sdXRpb25GaWxlc0J1Y2tldCksXHJcbiAgICAgICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5WaWV3ZXJQcm90b2NvbFBvbGljeS5SRURJUkVDVF9UT19IVFRQUyxcclxuICAgICAgICAgIGNhY2hlUG9saWN5OiBjbG91ZGZyb250LkNhY2hlUG9saWN5LkNBQ0hJTkdfRElTQUJMRUQsIC8vIFNvbHV0aW9uIGZpbGVzIHNob3VsZCBub3QgYmUgY2FjaGVkXHJcbiAgICAgICAgICBhbGxvd2VkTWV0aG9kczogY2xvdWRmcm9udC5BbGxvd2VkTWV0aG9kcy5BTExPV19HRVRfSEVBRF9PUFRJT05TLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHByaWNlQ2xhc3M6IGNsb3VkZnJvbnQuUHJpY2VDbGFzcy5QUklDRV9DTEFTU18xMDAsIC8vIFVzZSBvbmx5IE5vcnRoIEFtZXJpY2EgYW5kIEV1cm9wZVxyXG4gICAgICBlbmFibGVMb2dnaW5nOiB0cnVlLFxyXG4gICAgICBsb2dCdWNrZXQ6IG5ldyBzMy5CdWNrZXQodGhpcywgJ0Nsb3VkRnJvbnRMb2dzQnVja2V0Jywge1xyXG4gICAgICAgIGJ1Y2tldE5hbWU6IGBtYXJrZXRwbGFjZS1jZi1sb2dzLSR7cHJvcHMuc3RhZ2V9LSR7dGhpcy5hY2NvdW50fWAsXHJcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcclxuICAgICAgfSksXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBPdXRwdXRzXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnVnBjSWQnLCB7XHJcbiAgICAgIHZhbHVlOiB0aGlzLnZwYy52cGNJZCxcclxuICAgICAgZXhwb3J0TmFtZTogYCR7cHJvcHMuc3RhZ2V9LVZwY0lkYCxcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdBc3NldHNCdWNrZXROYW1lJywge1xyXG4gICAgICB2YWx1ZTogdGhpcy5hc3NldHNCdWNrZXQuYnVja2V0TmFtZSxcclxuICAgICAgZXhwb3J0TmFtZTogYCR7cHJvcHMuc3RhZ2V9LUFzc2V0c0J1Y2tldE5hbWVgLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1NvbHV0aW9uRmlsZXNCdWNrZXROYW1lJywge1xyXG4gICAgICB2YWx1ZTogdGhpcy5zb2x1dGlvbkZpbGVzQnVja2V0LmJ1Y2tldE5hbWUsXHJcbiAgICAgIGV4cG9ydE5hbWU6IGAke3Byb3BzLnN0YWdlfS1Tb2x1dGlvbkZpbGVzQnVja2V0TmFtZWAsXHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQ2xvdWRGcm9udERvbWFpbk5hbWUnLCB7XHJcbiAgICAgIHZhbHVlOiB0aGlzLmRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25Eb21haW5OYW1lLFxyXG4gICAgICBleHBvcnROYW1lOiBgJHtwcm9wcy5zdGFnZX0tQ2xvdWRGcm9udERvbWFpbk5hbWVgLFxyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0xvZ0dyb3VwTmFtZScsIHtcclxuICAgICAgdmFsdWU6IHRoaXMubG9nR3JvdXAubG9nR3JvdXBOYW1lLFxyXG4gICAgICBleHBvcnROYW1lOiBgJHtwcm9wcy5zdGFnZX0tTG9nR3JvdXBOYW1lYCxcclxuICAgIH0pO1xyXG4gIH1cclxufSJdfQ==