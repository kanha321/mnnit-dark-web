/**
 * Main application entry point
 */
const express = require('express');
const path = require('path');
const createUploadApp = require('./fileUpload/server');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

// Request logging
app.use((req, res, next) => {
  console.log(`[Main App] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve files from the files directory
app.use('/files', express.static(path.join(__dirname, 'files')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount file routes
app.use(fileRoutes);

// Create and mount the file upload module application
const uploadApp = createUploadApp();
app.use('/fileUpload', uploadApp);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`File upload module available at http://localhost:${PORT}/fileUpload/upload`);
});
