/**
 * File system related functionality for the frontend
 * Handles loading, displaying, and interacting with files
 */

import CONFIG from './config.js';
import UI from './ui.js';

// File content cache
const fileCache = new Map();

// Simplified file icons map
const FILE_ICONS = {
    text: '📄',
    code: '💻',
    python: '🐍',
    java: '☕',
    cpp: '🔧',
    web: '🌐',
    data: '📊',
    pdf: '📚',
    archive: '📦'
};

// Simplified previewable types
const PREVIEWABLE_TYPES = ['text', 'code', 'web', 'python', 'java', 'cpp', 'data'];

/**
 * Returns appropriate icon based on file type
 * @param {string} fileType - Type of the file
 * @returns {string} - Icon emoji
 */
function getFileIcon(fileType) {
    return FILE_ICONS[fileType] || FILE_ICONS.text;
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
    
    if (file.type === 'text' || file.type === 'code') {
        fileItem.classList.add(CONFIG.cssClasses.textFile);
    }
    
    const actionButtons = `
        <div class="action-stack">
            ${isPreviewable(file.type) ? `
                <button class="file-action copy-preview" data-name="${file.name}">Copy</button>
            ` : ''}
            <button class="file-action primary-action" data-name="${file.name}">Download</button>
        </div>
    `;

    fileItem.innerHTML = `
        <div class="file-item-header">
            <div class="file-details-group">
                <div class="file-icon">${getFileIcon(file.type)}</div>
                <div class="file-details">
                    <h3>${file.name}</h3>
                    <p>Size: ${file.size} | Modified: ${file.lastModified}</p>
                </div>
            </div>
            <div class="file-actions">
                ${actionButtons}
            </div>
        </div>
        ${isPreviewable(file.type) ? '<div class="file-preview-content"><pre class="loading">Loading preview...</pre></div>' : ''}
    `;
    container.appendChild(fileItem);

    // Load preview content for previewable files
    if (isPreviewable(file.type)) {
        loadPreviewContent(file.name, fileItem.querySelector('.file-preview-content'));
    }
}

async function loadPreviewContent(fileName, container) {
    try {
        const content = await getFileContent(fileName);
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
        container.innerHTML = `<div class="error-state">Error loading preview</div>`;
    }
}

/**
 * Checks if a file type is previewable
 * @param {string} fileType - Type of the file
 * @returns {boolean} - True if previewable, false otherwise
 */
function isPreviewable(fileType) {
    return PREVIEWABLE_TYPES.includes(fileType);
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
 * Attaches event listeners to file action buttons
 */
function attachEventListeners() {
    document.querySelectorAll('.primary-action').forEach(btn => {
        btn.addEventListener('click', downloadFile);
    });

    document.querySelectorAll('.copy-preview').forEach(btn => {
        btn.removeEventListener('click', downloadFile);  // Remove default download handler
        btn.addEventListener('click', async (event) => {
            event.preventDefault();  // Prevent any default action
            event.stopPropagation(); // Stop event bubbling
            
            const fileName = event.target.getAttribute('data-name');
            try {
                const content = await getFileContent(fileName);
                await navigator.clipboard.writeText(content);
                
                // Show feedback
                const originalText = btn.textContent;
                const originalBg = btn.style.backgroundColor;
                btn.textContent = 'Copied!';
                btn.style.backgroundColor = 'var(--md-sys-color-secondary)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = originalBg;
                }, 2000);
            } catch (error) {
                console.error('Error copying content:', error);
                btn.textContent = 'Error!';
                setTimeout(() => btn.textContent = 'Copy', 2000);
            }
        });
    });
}

/**
 * Pre-fetches and caches text files content
 * @param {Array} files - List of files
 */
async function cacheTextFiles(files) {
    const textFiles = files.filter(file => 
        ['text', 'code', 'web', 'python', 'java', 'cpp', 'data'].includes(file.type)
    );

    console.log('Starting to cache', textFiles.length, 'text files');
    
    for (const file of textFiles) {
        try {
            const response = await fetch(`${CONFIG.apiEndpoints.preview}/${encodeURIComponent(file.name)}`);
            if (!response.ok) continue;
            
            const content = await response.text();
            if (content.length > CONFIG.cache.maxFileSize) continue;
            
            fileCache.set(file.name, content);
            console.log('Cached file:', file.name);
        } catch (error) {
            console.warn('Failed to cache file:', file.name, error);
        }
    }
    
    console.log('Cached', fileCache.size, 'files');
}

/**
 * Gets file content from cache or fetches it
 * @param {string} fileName - Name of the file
 * @returns {Promise<string>} - File content
 */
async function getFileContent(fileName) {
    if (fileCache.has(fileName)) {
        console.log('Serving from cache:', fileName);
        return fileCache.get(fileName);
    }

    const response = await fetch(`${CONFIG.apiEndpoints.preview}/${encodeURIComponent(fileName)}`);
    if (!response.ok) throw new Error('Failed to load file');
    
    const content = await response.text();
    
    // Cache the content if it's not too large
    if (content.length <= CONFIG.cache.maxFileSize) {
        fileCache.set(fileName, content);
        console.log('Added to cache:', fileName);
    }
    
    return content;
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

            // Cache text files after displaying the list
            if (CONFIG.cache.enabled) {
                cacheTextFiles(files);
            }
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
    getFileContent
};
