/**
 * File Controller
 * Handles all file-related operations
 */

const File = require('../models/file');

/**
 * Get all files
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getAllFiles(req, res) {
    try {
        const files = await File.getAllFiles();
        res.json(files);
    } catch (error) {
        console.error('Error in getAllFiles controller:', error);
        res.status(500).json({ error: 'Failed to retrieve files' });
    }
}

/**
 * Download a file
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function downloadFile(req, res) {
    const fileName = req.params.fileName;
    const filePath = File.getFilePath(fileName);
    
    // Check if file exists
    if (!File.fileExists(fileName)) {
        return res.status(404).send('File not found');
    }
    
    res.download(filePath);
}

module.exports = {
    getAllFiles,
    downloadFile
};
