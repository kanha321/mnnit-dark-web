/**
 * Main application entry point
 */

import FileSystem from './fileSystem/index.js';
import UI from './ui/index.js';
import iconManager from './ui/iconManager.js';
import fontLoader from './ui/fontLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    // Preload fonts first
    fontLoader.preloadFonts();
    
    // Initialize the icon manager
    iconManager.initialize();
    
    // Initialize file system and UI components
    FileSystem.loadFiles();
    UI.initialize();
});
