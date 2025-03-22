/**
 * File system module entry point
 * Combines all file system functionality
 */

import fileCache from './fileCache.js';
import fileRenderer from './fileRenderer/index.js';
import fileHandlers from './fileHandlers/index.js';
import fileAPI from './fileAPI.js';
import fileUtils from './fileUtils.js';

/**
 * Loads and displays the file list from the server
 */
function loadFiles() {
    fileAPI.fetchFileList()
        .then(files => {
            // Setup and render files
            fileRenderer.renderFileList(files);
            
            // Attach event handlers
            fileHandlers.attachEventListeners();
            
            // Cache text files after displaying the list
            if (fileCache.isEnabled()) {
                fileCache.cacheTextFiles(files);
            }
        });
}

// Public API
export default {
    loadFiles,
    getFileIcon: fileUtils.getFileIcon,
    renderFileItem: fileRenderer.renderFileItem,
    downloadFile: fileHandlers.downloadFile,
    getFileContent: fileAPI.getFileContent
};
