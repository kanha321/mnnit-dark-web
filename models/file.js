/**
 * File model
 * Handles file-related data operations
 */

const fs = require('fs');
const path = require('path');
const fileUtils = require('../utils/file'); // Updated import

// Update FILES_DIR to point to the root files directory
const FILES_DIR = path.resolve(__dirname, '../files');
console.log('Files directory path:', FILES_DIR); // Add logging for debugging

/**
 * Ensures the files directory exists
 */
function ensureFilesDirectory() {
    if (!fs.existsSync(FILES_DIR)) {
        fs.mkdirSync(FILES_DIR, { recursive: true });
        console.log('Created files directory at:', FILES_DIR);
    } else {
        console.log('Using existing files directory at:', FILES_DIR);
    }
}

/**
 * Gets a list of all files
 * @returns {Promise<Array>} Array of file objects
 */
function getAllFiles() {
    return new Promise((resolve, reject) => {
        fs.readdir(FILES_DIR, (err, fileList) => {
            if (err) {
                console.error('Error reading directory:', err);
                return reject(new Error('Failed to read directory'));
            }

            // Filter out hidden files and .gitkeep
            fileList = fileList.filter(fileName => {
                return !fileName.startsWith('.') && fileName !== '.gitkeep';
            });

            const files = fileList.map(fileName => {
                try {
                    const stats = fs.statSync(path.join(FILES_DIR, fileName));
                    const fileType = getFileType(fileName);
                    const mimeType = getMimeType(fileName);
                    
                    return {
                        name: fileName,
                        type: fileType,
                        mimeType: mimeType,
                        size: formatFileSize(stats.size),
                        lastModified: new Date(stats.mtime).toISOString().split('T')[0]
                    };
                } catch (err) {
                    console.error(`Error reading file stats for ${fileName}:`, err);
                    return {
                        name: fileName,
                        type: 'unknown',
                        size: '0 B',
                        lastModified: 'Unknown'
                    };
                }
            });

            resolve(files);
        });
    });
}

/**
 * Get file path for a specific file
 * @param {string} fileName - Name of the file
 * @returns {string} - Full path to the file
 */
function getFilePath(fileName) {
    return path.join(FILES_DIR, fileName);
}

/**
 * Check if a file exists
 * @param {string} fileName - Name of the file
 * @returns {boolean} - True if the file exists
 */
function fileExists(fileName) {
    return fs.existsSync(getFilePath(fileName));
}

module.exports = {
    ensureFilesDirectory,
    getAllFiles,
    getFilePath,
    fileExists,
    FILES_DIR
};
