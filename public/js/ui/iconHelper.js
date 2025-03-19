/**
 * Icon helper module
 * Ensures Nerd Font icons load correctly
 */

/**
 * Fix Nerd Font icon display issues
 */
function fixNerdFontIcons() {
    // Check if font is loaded
    document.fonts.ready.then(() => {
        // Get all elements that should contain icons
        const iconElements = document.querySelectorAll('.file-icon, .file-action i');
        
        iconElements.forEach(icon => {
            // Force a repaint to ensure proper icon display
            const originalDisplay = icon.style.display;
            icon.style.display = 'none';
            // Trigger reflow
            void icon.offsetHeight;
            icon.style.display = originalDisplay;
        });
        
        console.log('Icon display fix applied');
    });
}

export default {
    fixNerdFontIcons
};
