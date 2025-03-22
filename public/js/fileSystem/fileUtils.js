/**
 * Utility functions for file operations
 */

import CONFIG from '../config.js';

// Initialize with empty objects and populate after fetch
let FILE_ICONS = {};
let SPECIFIC_FILES = {};
let FALLBACK_ICON = '';

// Load file icons configuration
fetch('/public/config/file-icons.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load file icons`);
        }
        return response.json();
    })
    .then(data => {
        // Extract icon for each file type
        FILE_ICONS = Object.entries(data.fileTypes).reduce((acc, [type, value]) => {
            acc[type] = value.icon;
            return acc;
        }, {});
        
        SPECIFIC_FILES = data.specificFiles;
        FALLBACK_ICON = data.fallbackIcon || '\uf15b';
        
        // Refresh existing icons on the page
        document.querySelectorAll('.file-icon').forEach(icon => {
            const fileType = icon.getAttribute('data-file-type');
            const fileName = icon.getAttribute('data-file-name');
            if (fileType && fileName) {
                icon.textContent = getFileIcon(fileType, fileName);
            }
        });
    })
    .catch(error => {
        // Set fallback icons
        FILE_ICONS = {
            text: '\uf15c',
            code: '\uf1c9',
            python: '\uf3e2',
            java: '\uf4e4',
            cpp: '\uf61d',
            web: '\uf13b',
            data: '\uf1c0',
            pdf: '\uf1c1',
            archive: '\uf1c6'
        };
        FALLBACK_ICON = '\uf15b';
    });

// Previewable file types
const PREVIEWABLE_TYPES = ['text', 'code', 'web', 'python', 'java', 'cpp', 'data'];

/**
 * Returns appropriate icon based on file type and name
 */
function getFileIcon(fileType, fileName = '') {
    // Check if there's a specific icon for this filename
    if (fileName && SPECIFIC_FILES[fileName]) {
        return SPECIFIC_FILES[fileName];
    }
    
    // Return the icon for the file type, or fallback
    return FILE_ICONS[fileType] || FALLBACK_ICON;
}

/**
 * Checks if a file type is previewable
 */
function isPreviewable(fileType) {
    return PREVIEWABLE_TYPES.includes(fileType);
}

/**
 * Comparison function to sort files
 */
function sortFiles(a, b) {
    const isAText = a.type === 'text' || a.type === 'code';
    const isBText = b.type === 'text' || b.type === 'code';
    
    if (isAText && !isBText) return -1;
    if (!isAText && isBText) return 1;
    return a.name.localeCompare(b.name);
}

/**
 * Get file extension from filename
 */
function getFileExtension(fileName) {
    return fileName.split('.').pop().toLowerCase();
}

export default {
    getFileIcon,
    isPreviewable,
    sortFiles,
    getFileExtension
};