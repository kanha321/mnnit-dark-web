/**
 * Utility functions for file operations
 */

import CONFIG from '../config.js';

// Import file icons config
let FILE_ICONS = {};
let SPECIFIC_FILES = {};
let FALLBACK_ICON = '';

// Fix the path to ensure the config is properly loaded
fetch('/public/config/file-icons.json') // This path might need to be updated depending on server config
    .then(response => response.json())
    .then(data => {
        // Extract icon for each file type
        FILE_ICONS = Object.entries(data.fileTypes).reduce((acc, [type, value]) => {
            acc[type] = value.icon;
            return acc;
        }, {});
        
        SPECIFIC_FILES = data.specificFiles;
        FALLBACK_ICON = data.fallbackIcon;
        console.log('File icons loaded');
    })
    .catch(error => {
        console.error('Error loading file icons:', error);
        // Fallback icons if loading fails
        FILE_ICONS = {
            text: '',
            code: '',
            python: '',
            java: '',
            cpp: '',
            web: '',
            data: '',
            pdf: '',
            archive: ''
        };
        FALLBACK_ICON = '';
    });

// Simplified previewable types
const PREVIEWABLE_TYPES = ['text', 'code', 'web', 'python', 'java', 'cpp', 'data'];

/**
 * Returns appropriate icon based on file type and name
 * @param {string} fileType - Type of the file
 * @param {string} fileName - Name of the file
 * @returns {string} - Icon character
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
 * @param {string} fileType - Type of the file
 * @returns {boolean} - True if previewable, false otherwise
 */
function isPreviewable(fileType) {
    return PREVIEWABLE_TYPES.includes(fileType);
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
 * Get file extension from filename
 * @param {string} fileName - Name of the file
 * @returns {string} - File extension without the dot
 */
function getFileExtension(fileName) {
    return fileName.split('.').pop().toLowerCase();
}

/**
 * Get the appropriate icon class for a file
 * @param {string} fileName - Name of the file
 * @returns {string} - CSS class for icon styling
 */
function getIconClass(fileName, fileType) {
    const ext = getFileExtension(fileName);
    
    // Check for extension-specific classes first
    switch (ext) {
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
        // Add more extensions as needed
    }
    
    // Default to file type class
    return `icon-${fileType}`;
}

export default {
    getFileIcon,
    isPreviewable,
    sortFiles,
    FILE_ICONS,
    PREVIEWABLE_TYPES,
    getFileExtension,
    getIconClass
};