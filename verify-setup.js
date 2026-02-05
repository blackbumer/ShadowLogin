#!/usr/bin/env node

/**
 * ShadowLogin Testing & Development Script
 * Run test commands and verify the setup
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════╗
║     ShadowLogin - Setup Verification Script            ║
╚════════════════════════════════════════════════════════╝
`);

// Check Node version
const nodeVersion = process.version;
console.log('✓ Node.js version:', nodeVersion);

if (parseInt(nodeVersion.split('.')[0].slice(1)) < 14) {
    console.error('✗ Node.js 14+ is required');
    process.exit(1);
}

// Check files
const requiredFiles = [
    'index.html',
    'styles.css',
    'script.js',
    'server.js',
    'package.json',
    'README.md'
];

console.log('\nChecking required files:');
let allFilesPresent = true;
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`✓ ${file} (${stats.size} bytes)`);
    } else {
        console.error(`✗ ${file} - MISSING`);
        allFilesPresent = false;
    }
});

if (!allFilesPresent) {
    console.error('\n✗ Some files are missing. Please check your installation.');
    process.exit(1);
}

console.log('\n✓ All required files present!');

// Check if package.json has dependencies
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    console.log(`\nProject: ${packageJson.name}`);
    console.log(`Version: ${packageJson.version}`);
    console.log(`Dependencies: ${Object.keys(packageJson.dependencies).join(', ')}`);
} catch (error) {
    console.error('✗ Error reading package.json:', error.message);
}

console.log(`
╔════════════════════════════════════════════════════════╗
║           Setup Verification Complete! ✓               ║
╚════════════════════════════════════════════════════════╝

Next steps:
1. Run: npm install
2. Run: npm start
3. Open: http://localhost:3000

For detailed instructions, see QUICKSTART.md
`);
