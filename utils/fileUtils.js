/**
 * Utility functions for file operations
 */
const path = require('path');

/**
 * Determines the file type based on the file extension
 * @param {string} fileName - Name of the file
 * @returns {string} - Type of the file
 */
function getFileType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    
    // Python files
    if (['.py', '.ipynb', '.pyc'].includes(ext)) return 'python';
    
    // Java files
    if (['.java', '.class', '.jar'].includes(ext)) return 'java';
    
    // C/C++ files
    if (['.c', '.cpp', '.h', '.hpp', '.o'].includes(ext)) return 'cpp';
    
    // Web development files
    if (['.html', '.css', '.js', '.php', '.jsx', '.ts', '.tsx'].includes(ext)) return 'web';
    
    // Data files
    if (['.csv', '.json', '.xml', '.sql', '.db'].includes(ext)) return 'data';
    
    // Code files (other programming languages)
    const codeExts = ['.go', '.rb', '.rs', '.swift', '.kt', '.cs', '.sh', '.pl', '.lua'];
    if (codeExts.includes(ext)) return 'code';
    
    // Text files
    const textExts = ['.txt', '.md', '.log'];
    if (textExts.includes(ext)) return 'text';
    
    // Other common CS file types
    switch (ext) {
        case '.pdf': return 'pdf';
        case '.zip': 
        case '.rar':
        case '.tar':
        case '.gz': return 'archive';
        default: return 'text'; // Default to text for CS focus
    }
}

/**
 * Formats file size in bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size with units
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i];
}

module.exports = {
    getFileType,
    formatFileSize
};
