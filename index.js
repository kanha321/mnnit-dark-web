/**
 * Main application server for MNNIT's Dark Web file server
 * This file initializes the Express server and sets up all routes
 */
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Import models and routes
const File = require('./models/file');
const routes = require('./routes');

// Ensure the files directory exists
File.ensureFilesDirectory();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add debug middleware with more detailed logging
app.use((req, res, next) => {
    console.log('\n=== Request Details ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Original URL:', req.originalUrl);
    console.log('Base URL:', req.baseUrl);
    console.log('Path:', req.path);
    console.log('Query:', req.query);
    console.log('Headers:', req.headers);
    console.log('===================\n');
    next();
});

// Serve static files from both the root and public directories
app.use(express.static(__dirname));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Add explicit file serving - this ensures files are accessible
app.use('/files', express.static(path.join(__dirname, 'files')));
console.log('Serving files from:', path.join(__dirname, 'files'));

// Set up API routes with debug logging
app.use('/api', (req, res, next) => {
    console.log('[API] Route accessed:', req.url);
    next();
}, routes);

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`MNNIT's Dark Web is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} in your browser`);
    console.log(`Files are being served from: ${File.FILES_DIR}`);
});
