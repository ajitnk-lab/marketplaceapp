import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
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

export class MarketplaceApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: MarketplaceApiStackProps) {
    super(scope, id, props);

    // API Gateway
    this.api = new apigateway.RestApi(this, 'MarketplaceApi', {
      restApiName: `marketplace-api-${props.stage}`,
      description: 'Marketplace Platform API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Lambda layer for common dependencies
    const commonLayer = new lambda.LayerVersion(this, 'CommonLayer', {
      code: lambda.Code.fromAsset('lambda-layers/common'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      description: 'Common dependencies for marketplace functions',
    });

    // Environment variables for Lambda functions
    const lambdaEnvironment = {
      USERS_TABLE_NAME: props.userTable.tableName,
      SOLUTIONS_TABLE_NAME: props.solutionTable.tableName,
      TRANSACTIONS_TABLE_NAME: props.transactionTable.tableName,
      SESSIONS_TABLE_NAME: props.sessionTable.tableName,
      STAGE: props.stage,
      LOG_GROUP_NAME: props.logGroup.logGroupName,
    };

    // Users API
    const usersFunction = new lambda.Function(this, 'UsersFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/users'),
      environment: lambdaEnvironment,
      layers: [commonLayer],
      logRetention: logs.RetentionDays.ONE_WEEK,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      securityGroups: [props.lambdaSecurityGroup],
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // Solutions API
    const solutionsFunction = new lambda.Function(this, 'SolutionsFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/solutions'),
      environment: lambdaEnvironment,
      layers: [commonLayer],
      logRetention: logs.RetentionDays.ONE_WEEK,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      securityGroups: [props.lambdaSecurityGroup],
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // Transactions API
    const transactionsFunction = new lambda.Function(this, 'TransactionsFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/transactions'),
      environment: lambdaEnvironment,
      layers: [commonLayer],
      logRetention: logs.RetentionDays.ONE_WEEK,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      securityGroups: [props.lambdaSecurityGroup],
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // Grant DynamoDB permissions
    props.userTable.grantReadWriteData(usersFunction);
    props.sessionTable.grantReadWriteData(usersFunction); // Users manage sessions
    props.solutionTable.grantReadWriteData(solutionsFunction);
    props.solutionTable.grantReadData(usersFunction); // Users need to read solutions
    props.transactionTable.grantReadWriteData(transactionsFunction);
    props.userTable.grantReadData(transactionsFunction); // Transactions need user data
    props.sessionTable.grantReadData(transactionsFunction); // Transactions need session validation

    // Grant CloudWatch Logs permissions
    props.logGroup.grantWrite(usersFunction);
    props.logGroup.grantWrite(solutionsFunction);
    props.logGroup.grantWrite(transactionsFunction);

    // API Gateway integrations
    const usersIntegration = new apigateway.LambdaIntegration(usersFunction);
    const solutionsIntegration = new apigateway.LambdaIntegration(solutionsFunction);
    const transactionsIntegration = new apigateway.LambdaIntegration(transactionsFunction);

    // API routes
    const v1 = this.api.root.addResource('v1');
    
    const users = v1.addResource('users');
    users.addMethod('GET', usersIntegration);
    users.addMethod('POST', usersIntegration);
    const userById = users.addResource('{userId}');
    userById.addMethod('GET', usersIntegration);
    userById.addMethod('PUT', usersIntegration);
    userById.addMethod('DELETE', usersIntegration);

    const solutions = v1.addResource('solutions');
    solutions.addMethod('GET', solutionsIntegration);
    solutions.addMethod('POST', solutionsIntegration);
    const solutionById = solutions.addResource('{solutionId}');
    solutionById.addMethod('GET', solutionsIntegration);
    solutionById.addMethod('PUT', solutionsIntegration);
    solutionById.addMethod('DELETE', solutionsIntegration);

    const transactions = v1.addResource('transactions');
    transactions.addMethod('GET', transactionsIntegration);
    transactions.addMethod('POST', transactionsIntegration);
    const transactionById = transactions.addResource('{transactionId}');
    transactionById.addMethod('GET', transactionsIntegration);

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      exportName: `${props.stage}-ApiUrl`,
    });
  }
}