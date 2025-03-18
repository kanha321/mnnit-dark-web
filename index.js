/**
 * Main application server for MNNIT's Dark Web file server
 * This file initializes the Express server and sets up all routes
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Import utility functions
const { 
    getFileType, 
    formatFileSize,
    isTextFile,
    isPreviewable
} = require('./utils/fileUtils');

// Constants
const FILES_DIR = path.join(__dirname, 'files');

// Ensure the files directory exists
if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR);
    console.log('Created files directory');
}

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve files directory for direct access to files (needed for preview)
app.use('/preview-files', express.static(FILES_DIR));

/**
 * API Routes
 */

// Get list of all files
app.get('/api/files', (req, res) => {
    fs.readdir(FILES_DIR, (err, fileList) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Failed to read directory' });
        }

        // Filter out hidden files and .gitkeep
        fileList = fileList.filter(fileName => {
            return !fileName.startsWith('.') && fileName !== '.gitkeep';
        });

        const files = fileList.map(fileName => {
            try {
                const stats = fs.statSync(path.join(FILES_DIR, fileName));
                const fileType = getFileType(fileName);
                
                return {
                    name: fileName,
                    type: fileType,
                    size: formatFileSize(stats.size),
                    lastModified: new Date(stats.mtime).toISOString().split('T')[0],
                    previewable: isPreviewable(fileName)
                };
            } catch (err) {
                console.error(`Error reading file stats for ${fileName}:`, err);
                return {
                    name: fileName,
                    type: 'unknown',
                    size: '0 B',
                    lastModified: 'Unknown',
                    previewable: false
                };
            }
        });

        res.json(files);
    });
});

// Download a file
app.get('/api/files/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(FILES_DIR, fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }
    
    res.download(filePath);
});

// Get file information for preview
app.get('/api/preview-info/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(FILES_DIR, fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    try {
        const stats = fs.statSync(filePath);
        const fileType = getFileType(fileName);
        const previewUrl = `/preview-files/${encodeURIComponent(fileName)}`;
        
        res.json({
            name: fileName,
            type: fileType,
            size: formatFileSize(stats.size),
            lastModified: new Date(stats.mtime).toISOString().split('T')[0],
            previewUrl: previewUrl,
            isTextFile: isTextFile(fileName)
        });
    } catch (err) {
        console.error(`Error reading file info: ${err}`);
        res.status(500).json({ error: 'Error reading file information' });
    }
});

// Preview a text file's content
app.get('/api/preview-content/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(FILES_DIR, fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }
    
    // Check if it's a text file
    if (!isTextFile(fileName)) {
        return res.status(400).send('Not a text file');
    }
    
    // Read and send file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return res.status(500).send('Error reading file');
        }
        
        res.send(data);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`MNNIT's Dark Web is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} in your browser`);
    console.log(`Files are being served from: ${FILES_DIR}`);
});
