/**
 * UI related functionality
 * Handles theme, display preferences, and UI interactions
 */

import CONFIG from './config.js';

/**
 * Sets up theme toggle functionality
 */
function setupThemeToggle() {
    const themeToggle = document.querySelector(CONFIG.selectors.themeToggle);
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle(CONFIG.cssClasses.darkTheme);
        
        // Save preference to localStorage
        const isDarkMode = document.body.classList.contains(CONFIG.cssClasses.darkTheme);
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Load saved preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add(CONFIG.cssClasses.darkTheme);
        themeToggle.checked = true;
    }
}

/**
 * Updates the current path display
 */
function updatePathDisplay() {
    const currentPath = document.querySelector(CONFIG.selectors.currentPath);
    currentPath.innerHTML = `<span>Path: /files/</span>`;
}

export default {
    setupThemeToggle,
    updatePathDisplay
};
