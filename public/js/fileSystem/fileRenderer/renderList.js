/**
 * Renders file lists in the UI
 */

import CONFIG from '../../config.js';
import renderItem from './renderItem.js';

/**
 * Renders the file list in the UI
 * @param {Array} files - List of file objects
 */
function renderFileList(files) {
    const fileList = document.querySelector(CONFIG.selectors.fileList);
    fileList.innerHTML = '';
    
    files.forEach(file => renderItem.renderFileItem(file, fileList));
}

export default {
    renderFileList
};
