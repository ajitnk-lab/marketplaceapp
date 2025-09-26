import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface MarketplaceInfrastructureStackProps extends cdk.StackProps {
  stage: string;
}

export class MarketplaceInfrastructureStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly assetsBucket: s3.Bucket;
  public readonly solutionFilesBucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly lambdaSecurityGroup: ec2.SecurityGroup;
  public readonly databaseSecurityGroup: ec2.SecurityGroup;
  public readonly logGroup: logs.LogGroup;

  constructor(scope: Construct, id: string, props: MarketplaceInfrastructureStackProps) {
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
    this.databaseSecurityGroup.addIngressRule(
      this.lambdaSecurityGroup,
      ec2.Port.tcp(443),
      'Allow HTTPS from Lambda functions'
    );

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