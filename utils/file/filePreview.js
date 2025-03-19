/**
 * File preview utility functions
 */

const mime = require('mime-types');

// Previewable MIME types
const PREVIEWABLE_MIME_TYPES = [
    // Text formats
    'text/plain', 'text/html', 'text/css', 'text/markdown',
    // Code formats
    'application/javascript', 'application/json', 'application/xml',
    'application/x-httpd-php', 'text/x-python', 'text/x-java',
    // Data formats
    'text/csv'
];

/**
 * Check if a file is previewable based on its MIME type
 * @param {string} fileName - Name of the file
 * @returns {boolean} - True if file can be previewed
 */
function isPreviewable(fileName) {
    const mimeType = getMimeType(fileName);
    
    // Check if it's a text-based MIME type
    if (mimeType.startsWith('text/')) {
        return true;
    }
    
    // Check other previewable types
    return PREVIEWABLE_MIME_TYPES.includes(mimeType);
}

/**
 * Get MIME type for a file
 * @param {string} fileName - Name of the file
 * @returns {string} - MIME type of the file
 */
function getMimeType(fileName) {
    return mime.lookup(fileName) || 'application/octet-stream';
}

module.exports = {
    isPreviewable,
    getMimeType,
    PREVIEWABLE_MIME_TYPES
};
