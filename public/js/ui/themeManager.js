/**
 * Theme management
 * Handles theme switching and preference storage
 */

import CONFIG from '../config.js';

/**
 * Sets up theme toggle functionality
 */
function setupThemeToggle() {
    const themeToggle = document.querySelector(CONFIG.selectors.themeToggle);
    
    // Remove the no-transition class after load
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.documentElement.classList.remove('no-transition');
            document.body.classList.remove('no-transition');
            
            // Ensure fonts are loaded before transitions
            document.fonts.ready.then(() => {
                console.log('All fonts loaded and ready');
            });
        }, 100);
    });
    
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark');
        
        // Save preference to localStorage
        const isDarkMode = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Load saved preference or use dark mode as default
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // If no preference is stored (null) or it's explicitly set to 'true',
    // enable dark mode (dark mode is default)
    if (savedDarkMode === null || savedDarkMode === 'true') {
        document.body.classList.add('dark');
        themeToggle.checked = true;
    } else {
        // Only if we explicitly have a 'false' value, use light mode
        document.body.classList.remove('dark');
        themeToggle.checked = false;
    }
}

export default {
    setupThemeToggle
};
