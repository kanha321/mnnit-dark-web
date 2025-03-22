/**
 * Renders individual file items
 */

import CONFIG from '../../config.js';
import fileUtils from '../fileUtils.js';
import previewContent from './previewContent.js';
import iconHandler from './iconHandler.js';
import dateFormatter from '../../utils/dateFormatter.js';

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
    
    // Check if the file is empty (0 B)
    const isEmptyFile = file.size === '0 B';
    
    // Use classes instead of :has pseudo-selector
    // Only consider a file previewable if it's a previewable type AND not empty
    const isPreviewableFile = fileUtils.isPreviewable(file.type) && !isEmptyFile;
    
    if (isPreviewableFile) {
        fileItem.classList.add('previewable');
        fileItem.classList.add('with-hover-effects');
    } else {
        fileItem.classList.add('not-previewable');
        // Add an empty-file class if applicable
        if (isEmptyFile) {
            fileItem.classList.add('empty-file');
        }
    }
    
    // Restructure the action buttons HTML with spans around the text for easy hiding
    // Don't show copy button for empty files
    const actionButtons = `
        ${isPreviewableFile ? `
            <button class="file-action copy-preview" data-name="${file.name}"><i></i><span> Copy</span></button>
        ` : ''}
        <button class="file-action primary-action" data-name="${file.name}"><i></i><span> Download</span></button>
    `;
    
    // Get file extension for more specific icon styling
    const fileExt = file.name.split('.').pop().toLowerCase();
    let iconClass = `icon-${file.type}`;
    
    // Apply extension-specific classes
    iconClass = getIconClassForExtension(fileExt, iconClass);

    // Format modified date in the requested format
    const formattedDate = dateFormatter.formatModifiedDate(file.lastModified);
    
    // Add an indicator for empty files in their description
    const sizeDisplay = isEmptyFile ? 'Empty file' : `Size: ${file.size}`;
    
    // Use a more reliable way to display the icon with inline modified date
    fileItem.innerHTML = `
        <div class="file-item-header">
            <div class="file-details-group">
                <div class="file-icon ${iconClass}" data-file-type="${file.type}" data-file-name="${file.name}">
                    <!-- Icon will be inserted by JavaScript -->
                </div>
                <div class="file-details">
                    <h3>${file.name}</h3>
                    <p class="file-description">${sizeDisplay} <span class="size-modified-separator">|</span> <span class="modified-info">Modified: ${formattedDate}</span></p>
                </div>
            </div>
            <div class="file-actions">
                ${actionButtons}
            </div>
        </div>
        ${isPreviewableFile ? '<div class="file-preview-content"><pre class="loading">Loading preview...</pre></div>' : ''}
    `;
    
    // Insert icon using a more direct approach
    const iconContainer = fileItem.querySelector('.file-icon');
    iconHandler.insertFileIcon(iconContainer, file.type);
    
    container.appendChild(fileItem);

    // Load preview content for previewable files
    if (isPreviewableFile) {
        previewContent.loadPreviewContent(file.name, fileItem.querySelector('.file-preview-content'));
    }
}

/**
 * Get CSS class for specific file extensions
 * @param {string} fileExt - File extension
 * @param {string} defaultClass - Default class to use if no match
 * @returns {string} - CSS class
 */
function getIconClassForExtension(fileExt, defaultClass) {
    switch (fileExt) {
        case 'js': return 'icon-js';
        case 'ts': return 'icon-ts';
        case 'jsx': return 'icon-jsx';
        case 'tsx': return 'icon-tsx';
        case 'html': return 'icon-html';
        case 'css': return 'icon-css';
        case 'scss': 
        case 'sass': return 'icon-scss';
        case 'json': return 'icon-json';
        case 'md': return 'icon-markdown';
        case 'py': return 'icon-python';
        case 'java': return 'icon-java';
        case 'php': return 'icon-php';
        default: return defaultClass;
    }
}

export default {
    renderFileItem,
    getIconClassForExtension
};
