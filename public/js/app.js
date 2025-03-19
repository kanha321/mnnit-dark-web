/**
 * Main application entry point
 * Initializes modules and bootstraps the application
 */

import FileSystem from './fileSystem/index.js';
import UI from './ui/index.js';
import iconManager from './ui/iconManager.js';

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the icon manager first to ensure icons load properly
    iconManager.initialize();
    
    // Initialize file system and UI components
    FileSystem.loadFiles();
    UI.initialize();
});
