/**
 * File Routes
 * Defines all file-related routes
 */

const express = require('express');
const router = express.Router();
const { fileController } = require('../controllers');

// Get list of all files
router.get('/files', fileController.getAllFiles);

// Download a file
router.get('/files/:fileName', fileController.downloadFile);

module.exports = router;
