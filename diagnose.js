/**
 * Diagnostic script to check module loading and file detection
 * Run with: node diagnose.js
 */

const path = require('path');
const fs = require('fs');

console.log('=== MNNIT Dark Web Diagnostics ===');
console.log('Node.js version:', process.version);
console.log('OS:', process.platform);

// Test utility module loading
console.log('\n=== Testing Utility Module Loading ===');
try {
    const fileUtils = require('./utils/file');
    console.log('fileUtils loaded successfully');
    console.log('Available functions:', Object.keys(fileUtils));
    
    // Check if functions are callable
    if (typeof fileUtils.getFileType === 'function') {
        console.log('getFileType is a function - OK');
    } else {
        console.log('ERROR: getFileType is not a function!');
    }
    
    if (typeof fileUtils.formatFileSize === 'function') {
        console.log('formatFileSize is a function - OK');
    } else {
        console.log('ERROR: formatFileSize is not a function!');
    }
} catch (error) {
    console.error('Failed to load fileUtils:', error);
}

// Test file access and scanning
console.log('\n=== Testing File Access ===');
const filesDir = path.resolve(__dirname, 'files');
console.log('Files directory:', filesDir);

try {
    const exists = fs.existsSync(filesDir);
    console.log('Files directory exists:', exists);
    
    if (exists) {
        const files = fs.readdirSync(filesDir);
        console.log(`Found ${files.length} files:`);
        files.forEach(fileName => {
            try {
                const stats = fs.statSync(path.join(filesDir, fileName));
                console.log(`- ${fileName} (${stats.size} bytes)`);
                
                // Try to detect file type
                const fileUtils = require('./utils/file');
                const fileType = fileUtils.getFileType(fileName);
                console.log(`  Type: ${fileType}`);
            } catch (err) {
                console.error(`  Error processing ${fileName}:`, err.message);
            }
        });
    }
} catch (error) {
    console.error('Error accessing files directory:', error);
}

console.log('\n=== Diagnostics Complete ===');
