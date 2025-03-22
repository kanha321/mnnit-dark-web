/**
 * File model
 * Handles file-related data operations
 */

const fs = require('fs');
const path = require('path');

// Use absolute require paths to avoid path resolution issues
const fileUtils = require(path.resolve(__dirname, '../utils/file'));

// Update FILES_DIR to point to the root files directory
const FILES_DIR = path.resolve(__dirname, '../files');

/**
 * Ensures the files directory exists
 */
function ensureFilesDirectory() {
    if (!fs.existsSync(FILES_DIR)) {
        fs.mkdirSync(FILES_DIR, { recursive: true });
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
                    
                    let fileType, mimeType, formattedSize;
                    
                    try {
                        fileType = fileUtils.getFileType(fileName);
                    } catch (typeErr) {
                        fileType = 'unknown';
                    }
                    
                    try {
                        mimeType = fileUtils.getMimeType(fileName);
                    } catch (mimeErr) {
                        mimeType = 'application/octet-stream';
                    }
                    
                    try {
                        formattedSize = fileUtils.formatFileSize(stats.size);
                    } catch (sizeErr) {
                        formattedSize = `${stats.size} bytes`;
                    }
                    
                    return {
                        name: fileName,
                        type: fileType,
                        mimeType: mimeType,
                        size: formattedSize,
                        lastModified: new Date(stats.mtime).toISOString().split('T')[0]
                    };
                } catch (err) {
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
