/**
 * Main application entry point
 */
import ThemeController from './controllers/ThemeController.js';
import UploadController from './controllers/UploadController.js';
import FileListController from './controllers/FileListController.js';

// Initialize controllers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme controller
  const themeController = new ThemeController();
  themeController.initTheme();
  
  // Initialize file list controller
  const fileListController = new FileListController();
  
  // Initialize upload controller with dependency on file list
  const uploadController = new UploadController(fileListController);
  uploadController.init();
});
