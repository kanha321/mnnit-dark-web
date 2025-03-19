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
    
    // Load saved preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark');
        themeToggle.checked = true;
    }
}

export default {
    setupThemeToggle
};
