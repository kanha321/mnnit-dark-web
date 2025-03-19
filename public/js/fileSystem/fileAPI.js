/**
 * API interaction module for file operations
 */

import CONFIG from '../config.js';
import fileCache from './fileCache.js';
import fileUtils from './fileUtils.js';

/**
 * Fetch file list from the server
 * @returns {Promise<Array>} - Promise resolving to file list
 */
async function fetchFileList() {
    const fileList = document.querySelector(CONFIG.selectors.fileList);
    fileList.innerHTML = `<div class="${CONFIG.cssClasses.loading}">Loading files...</div>`;

    try {
        const response = await fetch(CONFIG.apiEndpoints.fileList);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const files = await response.json();
        
        // Filter out .gitkeep files
        const filteredFiles = files.filter(file => file.name !== '.gitkeep');
        
        if (filteredFiles.length === 0) {
            fileList.innerHTML = `<div class="${CONFIG.cssClasses.emptyState}">No files found on the server</div>`;
            return [];
        }

        // Sort files: text files first, then by name
        filteredFiles.sort(fileUtils.sortFiles);
        
        return filteredFiles;
        
    } catch (error) {
        console.error('Error fetching files:', error);
        fileList.innerHTML = `<div class="${CONFIG.cssClasses.errorState}">Cannot load files</div>`;
        return [];
    }
}

/**
 * Gets file content from cache or fetches it
 * @param {string} fileName - Name of the file
 * @returns {Promise<string>} - File content
 */
async function getFileContent(fileName) {
    // Try to get from cache first
    const cachedContent = fileCache.getCachedContent(fileName);
    if (cachedContent) {
        console.log('Serving from cache:', fileName);
        return cachedContent;
    }

    // Fetch from server if not cached
    const response = await fetch(`${CONFIG.apiEndpoints.preview}/${encodeURIComponent(fileName)}`);
    if (!response.ok) throw new Error('Failed to load file');
    
    const content = await response.text();
    
    // Cache the content
    fileCache.addToCache(fileName, content);
    
    return content;
}

export default {
    fetchFileList,
    getFileContent
};
