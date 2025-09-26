import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
export interface MarketplaceInfrastructureStackProps extends cdk.StackProps {
    stage: string;
}
export declare class MarketplaceInfrastructureStack extends cdk.Stack {
    readonly vpc: ec2.Vpc;
    readonly assetsBucket: s3.Bucket;
    readonly solutionFilesBucket: s3.Bucket;
    readonly distribution: cloudfront.Distribution;
    readonly lambdaSecurityGroup: ec2.SecurityGroup;
    readonly databaseSecurityGroup: ec2.SecurityGroup;
    readonly logGroup: logs.LogGroup;
    constructor(scope: Construct, id: string, props: MarketplaceInfrastructureStackProps);
}
