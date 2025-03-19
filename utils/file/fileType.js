/**
 * File type utility functions
 */

const path = require('path');

// File type categories with corresponding extensions
const FILE_TYPES = {
    python: ['.py', '.ipynb', '.pyc'],
    java: ['.java', '.class', '.jar'],
    cpp: ['.c', '.cpp', '.h', '.hpp', '.o'],
    web: ['.html', '.css', '.js', '.php', '.jsx', '.ts', '.tsx'],
    data: ['.csv', '.json', '.xml', '.sql', '.db'],
    code: ['.go', '.rb', '.rs', '.swift', '.kt', '.cs', '.sh', '.pl', '.lua'],
    text: ['.txt', '.md', '.log'],
    pdf: ['.pdf'],
    archive: ['.zip', '.rar', '.tar', '.gz', '.7z']
};

/**
 * Determines the file type based on the file extension
 * @param {string} fileName - Name of the file
 * @returns {string} - Type of the file
 */
function getFileType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    
    // Find file type by extension
    for (const [type, extensions] of Object.entries(FILE_TYPES)) {
        if (extensions.includes(ext)) {
            return type;
        }
    }
    
    // Default to text for CS focus
    return 'text';
}

module.exports = {
    getFileType,
    FILE_TYPES
};
