import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
export interface MarketplaceDatabaseStackProps extends cdk.StackProps {
    stage: string;
    vpc: ec2.Vpc;
}
export declare class MarketplaceDatabaseStack extends cdk.Stack {
    readonly userTable: dynamodb.Table;
    readonly solutionTable: dynamodb.Table;
    readonly transactionTable: dynamodb.Table;
    readonly sessionTable: dynamodb.Table;
    constructor(scope: Construct, id: string, props: MarketplaceDatabaseStackProps);
}
