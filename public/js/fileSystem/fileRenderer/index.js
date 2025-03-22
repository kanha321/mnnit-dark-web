/**
 * File rendering module entry point
 * Combines all rendering functionality
 */

import renderList from './renderList.js';
import renderItem from './renderItem.js';
import previewContent from './previewContent.js';
import iconHandler from './iconHandler.js';

// Export all components for easy importing
export default {
    renderFileList: renderList.renderFileList,
    renderFileItem: renderItem.renderFileItem,
    loadPreviewContent: previewContent.loadPreviewContent,
    insertFileIcon: iconHandler.insertFileIcon
};
