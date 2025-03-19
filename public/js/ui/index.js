/**
 * UI module entry point
 * Combines all UI functionality
 */

import themeManager from './themeManager.js';
import dialogManager from './dialogManager.js';

/**
 * Initialize and set up all UI components
 */
function initialize() {
    themeManager.setupThemeToggle();
}

export default {
    // Public API
    setupThemeToggle: themeManager.setupThemeToggle,
    showPreview: dialogManager.showPreview,
    initialize
};
