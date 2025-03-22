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
    FILE_TYPES: fileType.FILE_TYPES,
    
    // File formatting utilities
    formatFileSize: fileFormat.formatFileSize,
    formatDate: fileFormat.formatDate,
    
    // File preview utilities
    isPreviewable: filePreview.isPreviewable,
    getMimeType: filePreview.getMimeType,
    PREVIEWABLE_MIME_TYPES: filePreview.PREVIEWABLE_MIME_TYPES
};
