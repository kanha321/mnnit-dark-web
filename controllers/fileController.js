/**
 * File Controller
 * Handles all file-related operations
 */

const File = require('../models/file');
const fs = require('fs').promises;
const { getMimeType, isPreviewable } = require('../utils/file'); // Updated import

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

/**
 * Preview a file
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function previewFile(req, res) {
    console.log('\n=== Preview Request ===');
    const fileName = req.params.fileName;
    console.log('File requested:', fileName);
    console.log('Request URL:', req.originalUrl);
    console.log('Request path:', req.path);

    const filePath = File.getFilePath(fileName);
    console.log('Resolved file path:', filePath);

    try {
        // Check file existence
        const exists = await fs.access(filePath).then(() => true).catch(() => false);
        console.log('File exists:', exists);
        
        if (!exists) {
            console.log('Error: File not found');
            return res.status(404).json({ 
                error: 'File not found',
                details: {
                    fileName,
                    filePath,
                    exists
                }
            });
        }

        // Check if file is previewable
        const mimeType = getMimeType(fileName);
        const canPreview = isPreviewable(fileName);
        console.log('MIME type:', mimeType);
        console.log('Can preview:', canPreview);

        if (!canPreview) {
            console.log('Error: Unsupported file type');
            return res.status(400).json({ 
                error: 'File type not supported for preview',
                details: {
                    fileName,
                    mimeType,
                    supported: false
                }
            });
        }

        // Read file content
        console.log('Reading file...');
        const content = await fs.readFile(filePath, 'utf8');
        console.log('File size:', content.length, 'bytes');

        // Send response
        console.log('Sending response...');
        res.removeHeader('Content-Type');
        res.set('Content-Type', 'text/plain');
        res.send(content);
        console.log('Response sent successfully');
        console.log('===================\n');

    } catch (error) {
        console.error('Error in preview:', error);
        console.log('Stack trace:', error.stack);
        res.status(500).json({
            error: 'Error reading file',
            details: {
                message: error.message,
                code: error.code,
                fileName,
                filePath
            }
        });
    }
}

module.exports = {
    getAllFiles,
    downloadFile,
    previewFile
};
