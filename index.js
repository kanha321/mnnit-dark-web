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

// Serve static files from both the root and public directories
app.use(express.static(__dirname));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set up API routes
app.use('/api', routes);

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
