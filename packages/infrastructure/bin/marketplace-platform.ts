#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

declare const process: any;
import { MarketplaceInfrastructureStack } from '../lib/marketplace-infrastructure-stack';
import { MarketplaceDatabaseStack } from '../lib/marketplace-database-stack';
import { MarketplaceApiStack } from '../lib/marketplace-api-stack';
// import { MarketplaceMonitoringStack } from '../lib/marketplace-monitoring-stack';

const app = new cdk.App();

// Get environment configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const stage = app.node.tryGetContext('stage') || 'dev';

// Core infrastructure stack
const infrastructureStack = new MarketplaceInfrastructureStack(app, `MarketplaceInfrastructure-${stage}`, {
  env,
  stage,
});

// Database stack
const databaseStack = new MarketplaceDatabaseStack(app, `MarketplaceDatabase-${stage}`, {
  env,
  stage,
  vpc: infrastructureStack.vpc,
});

// API stack
const apiStack = new MarketplaceApiStack(app, `MarketplaceApi-${stage}`, {
  env,
  stage,
  vpc: infrastructureStack.vpc,
  userTable: databaseStack.userTable,
  solutionTable: databaseStack.solutionTable,
  transactionTable: databaseStack.transactionTable,
  sessionTable: databaseStack.sessionTable,
  lambdaSecurityGroup: infrastructureStack.lambdaSecurityGroup,
  logGroup: infrastructureStack.logGroup,
});

// Monitoring stack - temporarily disabled due to module import issue
// const monitoringStack = new MarketplaceMonitoringStack(app, `MarketplaceMonitoring-${stage}`, {
//   env,
//   stage,
//   logGroup: infrastructureStack.logGroup,
//   userTable: databaseStack.userTable,
//   solutionTable: databaseStack.solutionTable,
//   transactionTable: databaseStack.transactionTable,
//   sessionTable: databaseStack.sessionTable,
// });

// Add dependencies
databaseStack.addDependency(infrastructureStack);
apiStack.addDependency(databaseStack);
// monitoringStack.addDependency(apiStack);