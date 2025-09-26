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
exports.MarketplaceApiStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const apigateway = __importStar(require("aws-cdk-lib/aws-apigateway"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const logs = __importStar(require("aws-cdk-lib/aws-logs"));
class MarketplaceApiStack extends cdk.Stack {
    constructor(scope, id, props) {
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
exports.MarketplaceApiStack = MarketplaceApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2V0cGxhY2UtYXBpLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFya2V0cGxhY2UtYXBpLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW1DO0FBQ25DLHVFQUF5RDtBQUN6RCwrREFBaUQ7QUFFakQseURBQTJDO0FBQzNDLDJEQUE2QztBQWM3QyxNQUFhLG1CQUFvQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBR2hELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBK0I7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsY0FBYztRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN4RCxXQUFXLEVBQUUsbUJBQW1CLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDN0MsV0FBVyxFQUFFLDBCQUEwQjtZQUN2QywyQkFBMkIsRUFBRTtnQkFDM0IsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFDekMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFDekMsWUFBWSxFQUFFLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsV0FBVyxDQUFDO2FBQzNFO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsdUNBQXVDO1FBQ3ZDLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQy9ELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztZQUNuRCxrQkFBa0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1lBQ2hELFdBQVcsRUFBRSwrQ0FBK0M7U0FDN0QsQ0FBQyxD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QUFDLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3ZELFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDeEQsTUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3BFLGVBQWUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFFMUQsVUFBVTtRQUNWLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUc7WUFDbkIsVUFBVSxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssU0FBUztTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF2SUQsa0RBdUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XHJcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcclxuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcclxuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xyXG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sb2dzJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtldHBsYWNlQXBpU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcclxuICBzdGFnZTogc3RyaW5nO1xyXG4gIHZwYzogZWMyLlZwYztcclxuICB1c2VyVGFibGU6IGR5bmFtb2RiLlRhYmxlO1xyXG4gIHNvbHV0aW9uVGFibGU6IGR5bmFtb2RiLlRhYmxlO1xyXG4gIHRyYW5zYWN0aW9uVGFibGU6IGR5bmFtb2RiLlRhYmxlO1xyXG4gIHNlc3Npb25UYWJsZTogZHluYW1vZGIuVGFibGU7XHJcbiAgbGFtYmRhU2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXA7XHJcbiAgbG9nR3JvdXA6IGxvZ3MuTG9nR3JvdXA7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNYXJrZXRwbGFjZUFwaVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBwdWJsaWMgcmVhZG9ubHkgYXBpOiBhcGlnYXRld2F5LlJlc3RBcGk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNYXJrZXRwbGFjZUFwaVN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIC8vIEFQSSBHYXRld2F5XHJcbiAgICB0aGlzLmFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ01hcmtldHBsYWNlQXBpJywge1xyXG4gICAgICByZXN0QXBpTmFtZTogYG1hcmtldHBsYWNlLWFwaS0ke3Byb3BzLnN0YWdlfWAsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFya2V0cGxhY2UgUGxhdGZvcm0gQVBJJyxcclxuICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XHJcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXHJcbiAgICAgICAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXHJcbiAgICAgICAgYWxsb3dIZWFkZXJzOiBbJ0NvbnRlbnQtVHlwZScsICdYLUFtei1EYXRlJywgJ0F1dGhvcml6YXRpb24nLCAnWC1BcGktS2V5J10sXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMYW1iZGEgbGF5ZXIgZm9yIGNvbW1vbiBkZXBlbmRlbmNpZXNcclxuICAgIGNvbnN0IGNvbW1vbkxheWVyID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24odGhpcywgJ0NvbW1vbkxheWVyJywge1xyXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYS1sYXllcnMvY29tbW9uJyksXHJcbiAgICAgIGNvbXBhdGlibGVSdW50aW1lczogW2xhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YXSxcclxuICAgICAgZGVzY3JpcHRpb246ICdDb21tb24gZGVwZW5kZW5jaWVzIGZvciBtYXJrZXRwbGFjZSBmdW5jdGlvbnMnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRW52aXJvbm1lbnQgdmFyaWFibGVzIGZvciBMYW1iZGEgZnVuY3Rpb25zXHJcbiAgICBjb25zdCBsYW1iZGFFbnZpcm9ubWVudCA9IHtcclxuICAgICAgVVNFUlNfVEFCTEVfTkFNRTogcHJvcHMudXNlclRhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgU09MVVRJT05TX1RBQkxFX05BTUU6IHByb3BzLnNvbHV0aW9uVGFibGUudGFibGVOYW1lLFxyXG4gICAgICBUUkFOU0FDVElPTlNfVEFCTEVfTkFNRTogcHJvcHMudHJhbnNhY3Rpb25UYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgIFNFU1NJT05TX1RBQkxFX05BTUU6IHByb3BzLnNlc3Npb25UYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgIFNUQUdFOiBwcm9wcy5zdGFnZSxcclxuICAgICAgTE9HX0dST1VQX05BTUU6IHByb3BzLmxvZ0dyb3VwLmxvZ0dyb3VwTmFtZSxcclxuICAgIH07XHJcblxyXG4gICAgLy8gVXNlcnMgQVBJXHJcbiAgICBjb25zdCB1c2Vyc0Z1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnVXNlcnNGdW5jdGlvbicsIHtcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXHJcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcclxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEvdXNlcnMnKSxcclxuICAgICAgZW52aXJvbm1lbnQ6IGxhbWJkYUVudmlyb25tZW50LFxyXG4gICAgICBsYXllcnM6IFtjb21tb25MYXllcl0sXHJcbiAgICAgIGxvZ1JldGVudGlvbjogbG9ncy5SZXRlbnRpb25EYXlzLk9ORV9XRUVLLFxyXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXHJcbiAgICAgIG1lbW9yeVNpemU6IDI1NixcclxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcm9wcy5sYW1iZGFTZWN1cml0eUdyb3VwXSxcclxuICAgICAgdnBjOiBwcm9wcy52cGMsXHJcbiAgICAgIHZwY1N1Ym5ldHM6IHtcclxuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU29sdXRpb25zIEFQSVxyXG4gICAgY29uc3Qgc29sdXRpb25zRnVuY3Rpb24gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdTb2x1dGlvbnNGdW5jdGlvbicsIHtcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXHJcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcclxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEvc29sdXRpb25zJyksXHJcbiAgICAgIGVudmlyb25tZW50OiBsYW1iZGFFbnZpcm9ubWVudCxcclxuICAgICAgbGF5ZXJzOiBbY29tbW9uTGF5ZXJdLFxyXG4gICAgICBsb2dSZXRlbnRpb246IGxvZ3MuUmV0ZW50aW9uRGF5cy5PTkVfV0VFSyxcclxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxyXG4gICAgICBtZW1vcnlTaXplOiAyNTYsXHJcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJvcHMubGFtYmRhU2VjdXJpdHlHcm91cF0sXHJcbiAgICAgIHZwYzogcHJvcHMudnBjLFxyXG4gICAgICB2cGNTdWJuZXRzOiB7XHJcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFRyYW5zYWN0aW9ucyBBUElcclxuICAgIGNvbnN0IHRyYW5zYWN0aW9uc0Z1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnVHJhbnNhY3Rpb25zRnVuY3Rpb24nLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxyXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhL3RyYW5zYWN0aW9ucycpLFxyXG4gICAgICBlbnZpcm9ubWVudDogbGFtYmRhRW52aXJvbm1lbnQsXHJcbiAgICAgIGxheWVyczogW2NvbW1vbkxheWVyXSxcclxuICAgICAgbG9nUmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuT05FX1dFRUssXHJcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwKSxcclxuICAgICAgbWVtb3J5U2l6ZTogMjU2LFxyXG4gICAgICBzZWN1cml0eUdyb3VwczogW3Byb3BzLmxhbWJkYVNlY3VyaXR5R3JvdXBdLFxyXG4gICAgICB2cGM6IHByb3BzLnZwYyxcclxuICAgICAgdnBjU3VibmV0czoge1xyXG4gICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBHcmFudCBEeW5hbW9EQiBwZXJtaXNzaW9uc1xyXG4gICAgcHJvcHMudXNlclRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YSh1c2Vyc0Z1bmN0aW9uKTtcclxuICAgIHByb3BzLnNlc3Npb25UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEodXNlcnNGdW5jdGlvbik7IC8vIFVzZXJzIG1hbmFnZSBzZXNzaW9uc1xyXG4gICAgcHJvcHMuc29sdXRpb25UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoc29sdXRpb25zRnVuY3Rpb24pO1xyXG4gICAgcHJvcHMuc29sdXRpb25UYWJsZS5ncmFudFJlYWREYXRhKHVzZXJzRnVuY3Rpb24pOyAvLyBVc2VycyBuZWVkIHRvIHJlYWQgc29sdXRpb25zXHJcbiAgICBwcm9wcy50cmFuc2FjdGlvblRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YSh0cmFuc2FjdGlvbnNGdW5jdGlvbik7XHJcbiAgICBwcm9wcy51c2VyVGFibGUuZ3JhbnRSZWFkRGF0YSh0cmFuc2FjdGlvbnNGdW5jdGlvbik7IC8vIFRyYW5zYWN0aW9ucyBuZWVkIHVzZXIgZGF0YVxyXG4gICAgcHJvcHMuc2Vzc2lvblRhYmxlLmdyYW50UmVhZERhdGEodHJhbnNhY3Rpb25zRnVuY3Rpb24pOyAvLyBUcmFuc2FjdGlvbnMgbmVlZCBzZXNzaW9uIHZhbGlkYXRpb25cclxuXHJcbiAgICAvLyBHcmFudCBDbG91ZFdhdGNoIExvZ3MgcGVybWlzc2lvbnNcclxuICAgIHByb3BzLmxvZ0dyb3VwLmdyYW50V3JpdGUodXNlcnNGdW5jdGlvbik7XHJcbiAgICBwcm9wcy5sb2dHcm91cC5ncmFudFdyaXRlKHNvbHV0aW9uc0Z1bmN0aW9uKTtcclxuICAgIHByb3BzLmxvZ0dyb3VwLmdyYW50V3JpdGUodHJhbnNhY3Rpb25zRnVuY3Rpb24pO1xyXG5cclxuICAgIC8vIEFQSSBHYXRld2F5IGludGVncmF0aW9uc1xyXG4gICAgY29uc3QgdXNlcnNJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHVzZXJzRnVuY3Rpb24pO1xyXG4gICAgY29uc3Qgc29sdXRpb25zSW50ZWdyYXRpb24gPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihzb2x1dGlvbnNGdW5jdGlvbik7XHJcbiAgICBjb25zdCB0cmFuc2FjdGlvbnNJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHRyYW5zYWN0aW9uc0Z1bmN0aW9uKTtcclxuXHJcbiAgICAvLyBBUEkgcm91dGVzXHJcbiAgICBjb25zdCB2MSA9IHRoaXMuYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3YxJyk7XHJcbiAgICBcclxuICAgIGNvbnN0IHVzZXJzID0gdjEuYWRkUmVzb3VyY2UoJ3VzZXJzJyk7XHJcbiAgICB1c2Vycy5hZGRNZXRob2QoJ0dFVCcsIHVzZXJzSW50ZWdyYXRpb24pO1xyXG4gICAgdXNlcnMuYWRkTWV0aG9kKCdQT1NUJywgdXNlcnNJbnRlZ3JhdGlvbik7XHJcbiAgICBjb25zdCB1c2VyQnlJZCA9IHVzZXJzLmFkZFJlc291cmNlKCd7dXNlcklkfScpO1xyXG4gICAgdXNlckJ5SWQuYWRkTWV0aG9kKCdHRVQnLCB1c2Vyc0ludGVncmF0aW9uKTtcclxuICAgIHVzZXJCeUlkLmFkZE1ldGhvZCgnUFVUJywgdXNlcnNJbnRlZ3JhdGlvbik7XHJcbiAgICB1c2VyQnlJZC5hZGRNZXRob2QoJ0RFTEVURScsIHVzZXJzSW50ZWdyYXRpb24pO1xyXG5cclxuICAgIGNvbnN0IHNvbHV0aW9ucyA9IHYxLmFkZFJlc291cmNlKCdzb2x1dGlvbnMnKTtcclxuICAgIHNvbHV0aW9ucy5hZGRNZXRob2QoJ0dFVCcsIHNvbHV0aW9uc0ludGVncmF0aW9uKTtcclxuICAgIHNvbHV0aW9ucy5hZGRNZXRob2QoJ1BPU1QnLCBzb2x1dGlvbnNJbnRlZ3JhdGlvbik7XHJcbiAgICBjb25zdCBzb2x1dGlvbkJ5SWQgPSBzb2x1dGlvbnMuYWRkUmVzb3VyY2UoJ3tzb2x1dGlvbklkfScpO1xyXG4gICAgc29sdXRpb25CeUlkLmFkZE1ldGhvZCgnR0VUJywgc29sdXRpb25zSW50ZWdyYXRpb24pO1xyXG4gICAgc29sdXRpb25CeUlkLmFkZE1ldGhvZCgnUFVUJywgc29sdXRpb25zSW50ZWdyYXRpb24pO1xyXG4gICAgc29sdXRpb25CeUlkLmFkZE1ldGhvZCgnREVMRVRFJywgc29sdXRpb25zSW50ZWdyYXRpb24pO1xyXG5cclxuICAgIGNvbnN0IHRyYW5zYWN0aW9ucyA9IHYxLmFkZFJlc291cmNlKCd0cmFuc2FjdGlvbnMnKTtcclxuICAgIHRyYW5zYWN0aW9ucy5hZGRNZXRob2QoJ0dFVCcsIHRyYW5zYWN0aW9uc0ludGVncmF0aW9uKTtcclxuICAgIHRyYW5zYWN0aW9ucy5hZGRNZXRob2QoJ1BPU1QnLCB0cmFuc2FjdGlvbnNJbnRlZ3JhdGlvbik7XHJcbiAgICBjb25zdCB0cmFuc2FjdGlvbkJ5SWQgPSB0cmFuc2FjdGlvbnMuYWRkUmVzb3VyY2UoJ3t0cmFuc2FjdGlvbklkfScpO1xyXG4gICAgdHJhbnNhY3Rpb25CeUlkLmFkZE1ldGhvZCgnR0VUJywgdHJhbnNhY3Rpb25zSW50ZWdyYXRpb24pO1xyXG5cclxuICAgIC8vIE91dHB1dHNcclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdBcGlVcmwnLCB7XHJcbiAgICAgIHZhbHVlOiB0aGlzLmFwaS51cmwsXHJcbiAgICAgIGV4cG9ydE5hbWU6IGAke3Byb3BzLnN0YWdlfS1BcGlVcmxgLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59Il19