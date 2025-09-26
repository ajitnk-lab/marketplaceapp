import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface MarketplaceDatabaseStackProps extends cdk.StackProps {
  stage: string;
  vpc: ec2.Vpc;
}

export class MarketplaceDatabaseStack extends cdk.Stack {
  public readonly userTable: dynamodb.Table;
  public readonly solutionTable: dynamodb.Table;
  public readonly transactionTable: dynamodb.Table;
  public readonly sessionTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: MarketplaceDatabaseStackProps) {
    super(scope, id, props);

    // Users table
    this.userTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: `marketplace-users-${props.stage}`,
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      contributorInsightsEnabled: true,
    });

    // Add GSI for email lookup
    this.userTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
    });

    // Solutions table
    this.solutionTable = new dynamodb.Table(this, 'SolutionsTable', {
      tableName: `marketplace-solutions-${props.stage}`,
      partitionKey: { name: 'solutionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      contributorInsightsEnabled: true,
    });

    // Add GSI for category-based queries
    this.solutionTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    // Add GSI for partner solutions
    this.solutionTable.addGlobalSecondaryIndex({
      indexName: 'PartnerIndex',
      partitionKey: { name: 'partnerId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    // Transactions table
    this.transactionTable = new dynamodb.Table(this, 'TransactionsTable', {
      tableName: `marketplace-transactions-${props.stage}`,
      partitionKey: { name: 'transactionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      contributorInsightsEnabled: true,
    });

    // Add GSI for user transactions
    this.transactionTable.addGlobalSecondaryIndex({
      indexName: 'UserIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    // Add GSI for partner transactions
    this.transactionTable.addGlobalSecondaryIndex({
      indexName: 'PartnerIndex',
      partitionKey: { name: 'partnerId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    // Sessions table for user session management
    this.sessionTable = new dynamodb.Table(this, 'SessionsTable', {
      tableName: `marketplace-sessions-${props.stage}`,
      partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      timeToLiveAttribute: 'expiresAt',
    });

    // Add GSI for user sessions
    this.sessionTable.addGlobalSecondaryIndex({
      indexName: 'UserIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    // Outputs
    new cdk.CfnOutput(this, 'UsersTableName', {
      value: this.userTable.tableName,
      exportName: `${props.stage}-UsersTableName`,
    });

    new cdk.CfnOutput(this, 'SolutionsTableName', {
      value: this.solutionTable.tableName,
      exportName: `${props.stage}-SolutionsTableName`,
    });

    new cdk.CfnOutput(this, 'TransactionsTableName', {
      value: this.transactionTable.tableName,
      exportName: `${props.stage}-TransactionsTableName`,
    });

    new cdk.CfnOutput(this, 'SessionsTableName', {
      value: this.sessionTable.tableName,
      exportName: `${props.stage}-SessionsTableName`,
    });
  }
}