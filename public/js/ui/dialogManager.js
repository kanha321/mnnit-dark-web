/**
 * Dialog management
 * Handles modal dialogs and preview functionality
 */

import CONFIG from '../config.js';
import FileSystem from '../fileSystem/index.js';
import formatters from './formatters.js';

/**
 * Shows a preview dialog for a file
 * @param {string} fileName - Name of the file to preview
 */
async function showPreview(fileName) {
    console.log('Showing preview for:', fileName);
    
    const previewDialog = document.createElement('dialog');
    previewDialog.className = CONFIG.cssClasses.previewDialog;
    
    previewDialog.innerHTML = `
        <div class="preview-header">
            <h3>${fileName}</h3>
            <button class="close-preview">×</button>
        </div>
        <div class="preview-content">
            <pre class="loading">Loading preview...</pre>
        </div>
    `;
    
    document.body.appendChild(previewDialog);
    previewDialog.showModal();

    try {
        const content = await FileSystem.getFileContent(fileName);
        console.log('Preview content received, length:', content.length);
        
        const escapedContent = formatters.escapeHTML(content);
        previewDialog.querySelector('.preview-content').innerHTML = `<pre class="code">${escapedContent}</pre>`;
    } catch (error) {
        console.error('Preview error:', error);
        previewDialog.querySelector('.preview-content').innerHTML = 
            `<div class="error-state">Failed to load preview</div>`;
    }

    // Add event listener for close button
    previewDialog.querySelector('.close-preview').addEventListener('click', () => {
        previewDialog.close();
        previewDialog.remove();
    });
}

export default {
    showPreview
};
