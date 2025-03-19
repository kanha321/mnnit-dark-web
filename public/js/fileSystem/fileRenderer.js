/**
 * File rendering module - handles UI creation
 */

import CONFIG from '../config.js';
import fileUtils from './fileUtils.js';
import fileAPI from './fileAPI.js';

/**
 * Renders the file list in the UI
 * @param {Array} files - List of file objects
 */
function renderFileList(files) {
    const fileList = document.querySelector(CONFIG.selectors.fileList);
    fileList.innerHTML = '';
    
    files.forEach(file => renderFileItem(file, fileList));
}

/**
 * Renders a single file item in the list
 * @param {Object} file - File object
 * @param {HTMLElement} container - Container element
 */
function renderFileItem(file, container) {
    const fileItem = document.createElement('div');
    fileItem.classList.add(CONFIG.cssClasses.fileItem);
    
    if (file.type === 'text' || file.type === 'code') {
        fileItem.classList.add(CONFIG.cssClasses.textFile);
    }
    
    // Use classes instead of :has pseudo-selector
    const isPreviewableFile = fileUtils.isPreviewable(file.type);
    if (isPreviewableFile) {
        fileItem.classList.add('previewable');
        fileItem.classList.add('with-hover-effects');
    } else {
        fileItem.classList.add('not-previewable');
    }
    
    // Restructure the action buttons HTML with spans around the text for easy hiding
    const actionButtons = `
        ${isPreviewableFile ? `
            <button class="file-action copy-preview" data-name="${file.name}"><i></i><span> Copy</span></button>
        ` : ''}
        <button class="file-action primary-action" data-name="${file.name}"><i></i><span> Download</span></button>
    `;
    
    // Get file extension for more specific icon styling
    const fileExt = file.name.split('.').pop().toLowerCase();
    let iconClass = `icon-${file.type}`;
    
    // Check for known extensions to apply more specific colors
    if (fileExt === 'js') iconClass = 'icon-js';
    else if (fileExt === 'ts') iconClass = 'icon-ts';
    else if (fileExt === 'jsx') iconClass = 'icon-jsx';
    else if (fileExt === 'tsx') iconClass = 'icon-tsx';
    else if (fileExt === 'html') iconClass = 'icon-html';
    else if (fileExt === 'css') iconClass = 'icon-css';
    else if (fileExt === 'scss' || fileExt === 'sass') iconClass = 'icon-scss';
    else if (fileExt === 'json') iconClass = 'icon-json';
    else if (fileExt === 'md') iconClass = 'icon-markdown';
    else if (fileExt === 'py') iconClass = 'icon-python';
    else if (fileExt === 'java') iconClass = 'icon-java';
    else if (fileExt === 'php') iconClass = 'icon-php';
    // ...and so on for other types...

    // Format file details to display on multiple lines for better readability on mobile
    const fileDetails = `
        <h3>${file.name}</h3>
        <p>Size: ${file.size}<br>Modified: ${file.lastModified}</p>
    `;
    
    fileItem.innerHTML = `
        <div class="file-item-header">
            <div class="file-details-group">
                <div class="file-icon ${iconClass}">${fileUtils.getFileIcon(file.type, file.name)}</div>
                <div class="file-details">
                    ${fileDetails}
                </div>
            </div>
            <div class="file-actions">
                ${actionButtons}
            </div>
        </div>
        ${isPreviewableFile ? '<div class="file-preview-content"><pre class="loading">Loading preview...</pre></div>' : ''}
    `;
    container.appendChild(fileItem);

    // Load preview content for previewable files
    if (isPreviewableFile) {
        loadPreviewContent(file.name, fileItem.querySelector('.file-preview-content'));
    }
}

/**
 * Load preview content for a file
 * @param {string} fileName - Name of the file
 * @param {HTMLElement} container - Container element
 */
async function loadPreviewContent(fileName, container) {
    try {
        const content = await fileAPI.getFileContent(fileName);
        const escapedContent = content.replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
        
        container.innerHTML = `<pre>${escapedContent}</pre>`;
    } catch (error) {
        console.error('Preview error:', error);
        container.innerHTML = `<div class="error-state">Failed to load preview</div>`;
    }
}

export default {
    renderFileList,
    renderFileItem,
    loadPreviewContent
};
