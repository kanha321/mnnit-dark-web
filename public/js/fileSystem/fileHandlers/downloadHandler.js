/**
 * Handles file download operations
 */

import CONFIG from '../../config.js';

/**
 * Downloads a file
 * @param {Event} event - Click event
 */
function downloadFile(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Get the file name from the clicked button data attribute
    const button = event.currentTarget;
    const fileName = button.getAttribute('data-name');
    
    if (!fileName) {
        return;
    }
    
    // Create and trigger a download link
    const downloadUrl = `${CONFIG.apiEndpoints.download}/${encodeURIComponent(fileName)}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName; // Use the original filename
    link.style.display = 'none';
    
    // Add to DOM, trigger click, then remove
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
}

export default {
    downloadFile
};
