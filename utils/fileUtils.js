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

/**
 * Checks if a file is a text file that can be previewed
 * @param {string} fileName - Name of the file
 * @returns {boolean} - True if the file is a text file
 */
function isTextFile(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const textFileExts = [
        '.txt', '.md', '.json', '.js', '.html', 
        '.css', '.csv', '.xml', '.log', '.sh', 
        '.py', '.c', '.cpp', '.java', '.ts',
        '.jsx', '.tsx', '.yml', '.yaml', '.ini',
        '.config', '.php', '.rb', '.go', '.rs'
    ];
    
    return textFileExts.includes(ext);
}

/**
 * Checks if a file is previewable in the browser
 * @param {string} fileName - Name of the file
 * @returns {boolean} - True if the file can be previewed
 */
function isPreviewable(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    
    // File types that can be previewed in a browser
    const previewableExts = [
        // Text files
        '.txt', '.md', '.json', '.js', '.html', '.css', '.csv', '.xml', 
        '.log', '.sh', '.py', '.c', '.cpp', '.java', '.ts', '.jsx', 
        '.tsx', '.yml', '.yaml', '.ini', '.config', '.php', '.rb', '.go', '.rs',
        
        // Images
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp',
        
        // PDFs
        '.pdf',
        
        // Audio
        '.mp3', '.wav', '.ogg',
        
        // Video
        '.mp4', '.webm'
    ];
    
    return previewableExts.includes(ext);
}

module.exports = {
    getFileType,
    formatFileSize,
    isTextFile,
    isPreviewable
};
