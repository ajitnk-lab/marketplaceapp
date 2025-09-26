// Simple test to check if we can start the frontend
const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Testing Frontend Setup...\n');

try {
    // Change to frontend directory
    const frontendDir = path.join(__dirname, 'packages', 'frontend');
    process.chdir(frontendDir);
    
    console.log('📁 Current directory:', process.cwd());
    
    // Check if package.json exists
    const fs = require('fs');
    if (fs.existsSync('package.json')) {
        console.log('✅ package.json found');
        
        // Try to install dependencies
        console.log('📦 Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });
        
        console.log('✅ Dependencies installed successfully');
        
        // Try to build
        console.log('🔨 Testing build...');
        execSync('npm run build', { stdio: 'inherit' });
        
        console.log('✅ Build successful');
        
    } else {
        console.log('❌ package.json not found');
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
}