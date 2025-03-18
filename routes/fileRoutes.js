/**
 * File Routes
 * Defines all file-related routes
 */

const express = require('express');
const router = express.Router();
const { fileController } = require('../controllers');

// Debug middleware for preview route
router.use('/preview/:fileName', (req, res, next) => {
    console.log('[Route Debug] Preview route hit');
    console.log('[Route Debug] Params:', req.params);
    console.log('[Route Debug] URL:', req.url);
    console.log('[Route Debug] Original URL:', req.originalUrl);
    next();
});

// Preview route must come before the general files route
router.get('/preview/:fileName', fileController.previewFile);

// Get list of all files
router.get('/files', fileController.getAllFiles);

// Download a file
router.get('/files/:fileName', fileController.downloadFile);

module.exports = router;
