#!/usr/bin/env node
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
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const marketplace_infrastructure_stack_1 = require("../lib/marketplace-infrastructure-stack");
const marketplace_database_stack_1 = require("../lib/marketplace-database-stack");
const marketplace_api_stack_1 = require("../lib/marketplace-api-stack");
// import { MarketplaceMonitoringStack } from '../lib/marketplace-monitoring-stack';
const app = new cdk.App();
// Get environment configuration
const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};
const stage = app.node.tryGetContext('stage') || 'dev';
// Core infrastructure stack
const infrastructureStack = new marketplace_infrastructure_stack_1.MarketplaceInfrastructureStack(app, `MarketplaceInfrastructure-${stage}`, {
    env,
    stage,
});
// Database stack
const databaseStack = new marketplace_database_stack_1.MarketplaceDatabaseStack(app, `MarketplaceDatabase-${stage}`, {
    env,
    stage,
    vpc: infrastructureStack.vpc,
});
// API stack
const apiStack = new marketplace_api_stack_1.MarketplaceApiStack(app, `MarketplaceApi-${stage}`, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2V0cGxhY2UtcGxhdGZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXJrZXRwbGFjZS1wbGF0Zm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHVDQUFxQztBQUNyQyxpREFBbUM7QUFHbkMsOEZBQXlGO0FBQ3pGLGtGQUE2RTtBQUM3RSx3RUFBbUU7QUFDbkUsb0ZBQW9GO0FBRXBGLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLGdDQUFnQztBQUNoQyxNQUFNLEdBQUcsR0FBRztJQUNWLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjtJQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxXQUFXO0NBQ3RELENBQUM7QUFFRixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUM7QUFFdkQsNEJBQTRCO0FBQzVCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxpRUFBOEIsQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLEtBQUssRUFBRSxFQUFFO0lBQ3hHLEdBQUc7SUFDSCxLQUFLO0NBQ04sQ0FBQyxDQUFDO0FBRUgsaUJBQWlCO0FBQ2pCLE1BQU0sYUFBYSxHQUFHLElBQUkscURBQXdCLENBQUMsR0FBRyxFQUFFLHVCQUF1QixLQUFLLEVBQUUsRUFBRTtJQUN0RixHQUFHO0lBQ0gsS0FBSztJQUNMLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxHQUFHO0NBQzdCLENBQUMsQ0FBQztBQUVILFlBQVk7QUFDWixNQUFNLFFBQVEsR0FBRyxJQUFJLDJDQUFtQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsS0FBSyxFQUFFLEVBQUU7SUFDdkUsR0FBRztJQUNILEtBQUs7SUFDTCxHQUFHLEVBQUUsbUJBQW1CLENBQUMsR0FBRztJQUM1QixTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7SUFDbEMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxhQUFhO0lBQzFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxnQkFBZ0I7SUFDaEQsWUFBWSxFQUFFLGFBQWEsQ0FBQyxZQUFZO0lBQ3hDLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDLG1CQUFtQjtJQUM1RCxRQUFRLEVBQUUsbUJBQW1CLENBQUMsUUFBUTtDQUN2QyxDQUFDLENBQUM7QUFFSCxxRUFBcUU7QUFDckUsa0dBQWtHO0FBQ2xHLFNBQVM7QUFDVCxXQUFXO0FBQ1gsNENBQTRDO0FBQzVDLHdDQUF3QztBQUN4QyxnREFBZ0Q7QUFDaEQsc0RBQXNEO0FBQ3RELDhDQUE4QztBQUM5QyxNQUFNO0FBRU4sbUJBQW1CO0FBQ25CLGFBQWEsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqRCxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3RDLDJDQUEyQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5cclxuZGVjbGFyZSBjb25zdCBwcm9jZXNzOiBhbnk7XHJcbmltcG9ydCB7IE1hcmtldHBsYWNlSW5mcmFzdHJ1Y3R1cmVTdGFjayB9IGZyb20gJy4uL2xpYi9tYXJrZXRwbGFjZS1pbmZyYXN0cnVjdHVyZS1zdGFjayc7XHJcbmltcG9ydCB7IE1hcmtldHBsYWNlRGF0YWJhc2VTdGFjayB9IGZyb20gJy4uL2xpYi9tYXJrZXRwbGFjZS1kYXRhYmFzZS1zdGFjayc7XHJcbmltcG9ydCB7IE1hcmtldHBsYWNlQXBpU3RhY2sgfSBmcm9tICcuLi9saWIvbWFya2V0cGxhY2UtYXBpLXN0YWNrJztcclxuLy8gaW1wb3J0IHsgTWFya2V0cGxhY2VNb25pdG9yaW5nU3RhY2sgfSBmcm9tICcuLi9saWIvbWFya2V0cGxhY2UtbW9uaXRvcmluZy1zdGFjayc7XHJcblxyXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xyXG5cclxuLy8gR2V0IGVudmlyb25tZW50IGNvbmZpZ3VyYXRpb25cclxuY29uc3QgZW52ID0ge1xyXG4gIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXHJcbiAgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04gfHwgJ3VzLWVhc3QtMScsXHJcbn07XHJcblxyXG5jb25zdCBzdGFnZSA9IGFwcC5ub2RlLnRyeUdldENvbnRleHQoJ3N0YWdlJykgfHwgJ2Rldic7XHJcblxyXG4vLyBDb3JlIGluZnJhc3RydWN0dXJlIHN0YWNrXHJcbmNvbnN0IGluZnJhc3RydWN0dXJlU3RhY2sgPSBuZXcgTWFya2V0cGxhY2VJbmZyYXN0cnVjdHVyZVN0YWNrKGFwcCwgYE1hcmtldHBsYWNlSW5mcmFzdHJ1Y3R1cmUtJHtzdGFnZX1gLCB7XHJcbiAgZW52LFxyXG4gIHN0YWdlLFxyXG59KTtcclxuXHJcbi8vIERhdGFiYXNlIHN0YWNrXHJcbmNvbnN0IGRhdGFiYXNlU3RhY2sgPSBuZXcgTWFya2V0cGxhY2VEYXRhYmFzZVN0YWNrKGFwcCwgYE1hcmtldHBsYWNlRGF0YWJhc2UtJHtzdGFnZX1gLCB7XHJcbiAgZW52LFxyXG4gIHN0YWdlLFxyXG4gIHZwYzogaW5mcmFzdHJ1Y3R1cmVTdGFjay52cGMsXHJcbn0pO1xyXG5cclxuLy8gQVBJIHN0YWNrXHJcbmNvbnN0IGFwaVN0YWNrID0gbmV3IE1hcmtldHBsYWNlQXBpU3RhY2soYXBwLCBgTWFya2V0cGxhY2VBcGktJHtzdGFnZX1gLCB7XHJcbiAgZW52LFxyXG4gIHN0YWdlLFxyXG4gIHZwYzogaW5mcmFzdHJ1Y3R1cmVTdGFjay52cGMsXHJcbiAgdXNlclRhYmxlOiBkYXRhYmFzZVN0YWNrLnVzZXJUYWJsZSxcclxuICBzb2x1dGlvblRhYmxlOiBkYXRhYmFzZVN0YWNrLnNvbHV0aW9uVGFibGUsXHJcbiAgdHJhbnNhY3Rpb25UYWJsZTogZGF0YWJhc2VTdGFjay50cmFuc2FjdGlvblRhYmxlLFxyXG4gIHNlc3Npb25UYWJsZTogZGF0YWJhc2VTdGFjay5zZXNzaW9uVGFibGUsXHJcbiAgbGFtYmRhU2VjdXJpdHlHcm91cDogaW5mcmFzdHJ1Y3R1cmVTdGFjay5sYW1iZGFTZWN1cml0eUdyb3VwLFxyXG4gIGxvZ0dyb3VwOiBpbmZyYXN0cnVjdHVyZVN0YWNrLmxvZ0dyb3VwLFxyXG59KTtcclxuXHJcbi8vIE1vbml0b3Jpbmcgc3RhY2sgLSB0ZW1wb3JhcmlseSBkaXNhYmxlZCBkdWUgdG8gbW9kdWxlIGltcG9ydCBpc3N1ZVxyXG4vLyBjb25zdCBtb25pdG9yaW5nU3RhY2sgPSBuZXcgTWFya2V0cGxhY2VNb25pdG9yaW5nU3RhY2soYXBwLCBgTWFya2V0cGxhY2VNb25pdG9yaW5nLSR7c3RhZ2V9YCwge1xyXG4vLyAgIGVudixcclxuLy8gICBzdGFnZSxcclxuLy8gICBsb2dHcm91cDogaW5mcmFzdHJ1Y3R1cmVTdGFjay5sb2dHcm91cCxcclxuLy8gICB1c2VyVGFibGU6IGRhdGFiYXNlU3RhY2sudXNlclRhYmxlLFxyXG4vLyAgIHNvbHV0aW9uVGFibGU6IGRhdGFiYXNlU3RhY2suc29sdXRpb25UYWJsZSxcclxuLy8gICB0cmFuc2FjdGlvblRhYmxlOiBkYXRhYmFzZVN0YWNrLnRyYW5zYWN0aW9uVGFibGUsXHJcbi8vICAgc2Vzc2lvblRhYmxlOiBkYXRhYmFzZVN0YWNrLnNlc3Npb25UYWJsZSxcclxuLy8gfSk7XHJcblxyXG4vLyBBZGQgZGVwZW5kZW5jaWVzXHJcbmRhdGFiYXNlU3RhY2suYWRkRGVwZW5kZW5jeShpbmZyYXN0cnVjdHVyZVN0YWNrKTtcclxuYXBpU3RhY2suYWRkRGVwZW5kZW5jeShkYXRhYmFzZVN0YWNrKTtcclxuLy8gbW9uaXRvcmluZ1N0YWNrLmFkZERlcGVuZGVuY3koYXBpU3RhY2spOyJdfQ==