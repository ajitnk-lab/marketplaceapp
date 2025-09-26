import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
export interface MarketplaceApiStackProps extends cdk.StackProps {
    stage: string;
    vpc: ec2.Vpc;
    userTable: dynamodb.Table;
    solutionTable: dynamodb.Table;
    transactionTable: dynamodb.Table;
    sessionTable: dynamodb.Table;
    lambdaSecurityGroup: ec2.SecurityGroup;
    logGroup: logs.LogGroup;
}
export declare class MarketplaceApiStack extends cdk.Stack {
    readonly api: apigateway.RestApi;
    constructor(scope: Construct, id: string, props: MarketplaceApiStackProps);
}
