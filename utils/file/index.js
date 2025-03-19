/**
 * File utilities main entry point
 * Combines all file utility functions
 */

const fileType = require('./fileType');
const fileFormat = require('./fileFormat');
const filePreview = require('./filePreview');

module.exports = {
    // File type utilities
    getFileType: fileType.getFileType,
    
    // File formatting utilities
    formatFileSize: fileFormat.formatFileSize,
    
    // File preview utilities
    isPreviewable: filePreview.isPreviewable,
    getMimeType: filePreview.getMimeType
};
