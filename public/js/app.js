/**
 * Main application entry point
 * Initializes modules and bootstraps the application
 */

import FileSystem from './fileSystem.js';
import UI from './ui.js';

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    FileSystem.loadFiles();
    UI.setupThemeToggle();
    UI.updatePathDisplay();
    UI.setupClosePreview();
});
