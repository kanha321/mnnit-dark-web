/**
 * File system related functionality
 * Handles loading, displaying, and interacting with files
 */

import CONFIG from './config.js';
import PreviewManager from './previewManager.js';

/**
 * Returns appropriate icon based on file type
 * @param {string} fileType - Type of the file
 * @returns {string} - Icon emoji
 */

function getFileIcon(fileType) {
    const icons = {
        'text': '📄',
        'code': '💻',
        'python': '🐍',
        'java': '☕',
        'cpp': '🔧',
        'web': '🌐',
        'data': '📊',
        'pdf': '📚',
        'archive': '📦'
    };
    
    return icons[fileType] || '📄';
}

/**
 * Comparison function to sort files
 * @param {Object} a - First file
 * @param {Object} b - Second file
 * @returns {number} - Sort order
 */
function sortFiles(a, b) {
    const isAText = a.type === 'text' || a.type === 'code';
    const isBText = b.type === 'text' || b.type === 'code';
    
    if (isAText && !isBText) return -1;
    if (!isAText && isBText) return 1;
    return a.name.localeCompare(b.name);
}

/**
 * Renders a single file item in the list
 * @param {Object} file - File object
 * @param {HTMLElement} container - Container element
 */
function renderFileItem(file, container) {
    const fileItem = document.createElement('div');
    fileItem.classList.add(CONFIG.cssClasses.fileItem);
    
    // Add a special class for text files
    if (file.type === 'text' || file.type === 'code') {
        fileItem.classList.add(CONFIG.cssClasses.textFile);
    }
    
    fileItem.innerHTML = `
        <div class="file-icon">${getFileIcon(file.type)}</div>
        <div class="file-details">
            <h3>${file.name}</h3>
            <p>Size: ${file.size} | Modified: ${file.lastModified}</p>
        </div>
        <div class="file-actions">
            ${file.previewable ? 
                `<button class="file-preview" data-name="${file.name}">Preview</button>` : ''}
            <button class="file-action" data-name="${file.name}">Download</button>
        </div>
    `;
    container.appendChild(fileItem);
}

/**
 * Downloads a file
 * @param {Event} event - Click event
 */
function downloadFile(event) {
    const fileName = event.target.getAttribute('data-name');
    window.location.href = `${CONFIG.apiEndpoints.download}/${encodeURIComponent(fileName)}`;
}

/**
 * Previews a file
 * @param {Event} event - Click event
 */
function previewFile(event) {
    const fileName = event.target.getAttribute('data-name');
    PreviewManager.openPreview(fileName);
}

/**
 * Attaches event listeners to file action buttons
 */
function attachEventListeners() {
    document.querySelectorAll('.file-action').forEach(btn => {
        btn.addEventListener('click', downloadFile);
    });
    
    document.querySelectorAll('.file-preview').forEach(btn => {
        btn.addEventListener('click', previewFile);
    });
}

/**
 * Loads and displays the file list from the server
 */
function loadFiles() {
    const fileList = document.querySelector(CONFIG.selectors.fileList);
    fileList.innerHTML = `<div class="${CONFIG.cssClasses.loading}">Loading files...</div>`;

    // Fetch file list from the API
    fetch(CONFIG.apiEndpoints.fileList)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(files => {
            // Filter out .gitkeep files
            files = files.filter(file => file.name !== '.gitkeep');
            
            if (files.length === 0) {
                fileList.innerHTML = `<div class="${CONFIG.cssClasses.emptyState}">No files found on the server</div>`;
                return;
            }

            fileList.innerHTML = '';
            
            // Sort files: text files first, then by name
            files.sort(sortFiles);
            
            // Create and append file elements
            files.forEach(file => renderFileItem(file, fileList));
            
            // Add event listeners to buttons
            attachEventListeners();
        })
        .catch(error => {
            console.error('Error fetching files:', error);
            fileList.innerHTML = `<div class="${CONFIG.cssClasses.errorState}">Error loading files: ${error.message}</div>`;
        });
}

export default {
    loadFiles,
    getFileIcon,
    renderFileItem,
    downloadFile,
    previewFile
};
