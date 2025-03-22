/**
 * File Controller
 * Handles all file-related operations
 */

const File = require('../models/file');
const fs = require('fs').promises;
const path = require('path');
const { getMimeType, isPreviewable } = require('../utils/file');

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
    
    if (!File.fileExists(fileName)) {
        return res.status(404).send('File not found');
    }
    
    res.download(filePath);
}

/**
 * Preview a file
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function previewFile(req, res) {
    const fileName = req.params.fileName;
    const filePath = path.resolve(File.FILES_DIR, fileName);

    try {
        const exists = await fs.access(filePath).then(() => true).catch(() => false);
        
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }

        const mimeType = getMimeType(fileName);
        const canPreview = isPreviewable(fileName);

        if (!canPreview) {
            return res.status(400).json({ error: 'File type not supported for preview' });
        }

        const content = await fs.readFile(filePath, 'utf8');
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(content);

    } catch (error) {
        res.status(500).json({
            error: 'Error reading file'
        });
    }
}

module.exports = {
    getAllFiles,
    downloadFile,
    previewFile
};
