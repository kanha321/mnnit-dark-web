/**
 * File content caching module
 */

import CONFIG from '../config.js';
import fileAPI from './fileAPI.js';
import fileUtils from './fileUtils.js';

// File content cache
const fileCache = new Map();

/**
 * Check if caching is enabled
 * @returns {boolean} - True if caching is enabled
 */
function isEnabled() {
    return CONFIG.cache.enabled;
}

/**
 * Pre-fetches and caches text files content
 * @param {Array} files - List of files
 */
async function cacheTextFiles(files) {
    const textFiles = files.filter(file => 
        fileUtils.PREVIEWABLE_TYPES.includes(file.type)
    );

    console.log('Starting to cache', textFiles.length, 'text files');
    
    for (const file of textFiles) {
        try {
            const content = await fileAPI.getFileContent(file.name);
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
 * Get cached content for a file
 * @param {string} fileName - Name of the file
 * @returns {string|null} - File content or null if not cached
 */
function getCachedContent(fileName) {
    return fileCache.has(fileName) ? fileCache.get(fileName) : null;
}

/**
 * Add content to cache
 * @param {string} fileName - Name of the file 
 * @param {string} content - File content
 */
function addToCache(fileName, content) {
    if (content.length <= CONFIG.cache.maxFileSize) {
        fileCache.set(fileName, content);
        console.log('Added to cache:', fileName);
    }
}

export default {
    isEnabled,
    cacheTextFiles,
    getCachedContent,
    addToCache
};
