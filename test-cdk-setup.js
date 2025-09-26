#!/usr/bin/env node

// Simple test script to verify CDK setup
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing CDK Setup...\n');

try {
    // Test 1: Check if CDK is installed
    console.log('1. Checking CDK installation...');
    const cdkVersion = execSync('cdk --version', { encoding: 'utf8' });
    console.log(`   ✅ CDK Version: ${cdkVersion.trim()}\n`);

    // Test 2: Create a temporary CDK app
    console.log('2. Creating test CDK app...');
    const testDir = path.join(__dirname, 'cdk-test-temp');
    
    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(testDir);
    process.chdir(testDir);
    
    execSync('cdk init app --language typescript', { stdio: 'pipe' });
    console.log('   ✅ CDK app created successfully\n');

    // Test 3: Synthesize the stack
    console.log('3. Testing CDK synthesis...');
    execSync('npm install', { stdio: 'pipe' });
    execSync('cdk synth', { stdio: 'pipe' });
    console.log('   ✅ CDK synthesis successful\n');

    // Cleanup
    process.chdir(__dirname);
    fs.rmSync(testDir, { recursive: true, force: true });

    console.log('🎉 All CDK tests passed! Your environment is ready.\n');
    
    console.log('Next steps:');
    console.log('1. Configure AWS credentials: aws configure');
    console.log('2. Test AWS access: aws sts get-caller-identity');
    console.log('3. Bootstrap CDK: cdk bootstrap');
    console.log('4. Start implementing the marketplace platform tasks');

} catch (error) {
    console.error('❌ CDK setup test failed:');
    console.error(error.message);
    
    console.log('\nTroubleshooting:');
    console.log('1. Ensure Node.js v18+ is installed');
    console.log('2. Install CDK globally: npm install -g aws-cdk');
    console.log('3. Check your PATH environment variable');
    
    process.exit(1);
}