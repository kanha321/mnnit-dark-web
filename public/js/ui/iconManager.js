/**
 * Icon management
 * Centralizes Nerd Font icon handling to ensure proper rendering
 */

// Icon registry - maps icon names to their Unicode character codes
const ICON_MAP = {
    // UI icons
    'sun': '\uf185',
    'moon': '\uf186',
    'download': '\uf019',
    'copy': '\uf0c5',
    'check': '\uf00c',
    'warning': '\uf071',
    'close': '\uf00d',
    'select': '\uf245',
    'error': '\uf071',
    'success': '\uf00c',
    
    // Add more icons as needed
};

/**
 * Creates an icon element with the specified icon
 * @param {string} iconName - Name of the icon from ICON_MAP
 * @param {string} className - Optional CSS class names
 * @returns {HTMLElement} - Icon element
 */
function createIcon(iconName, className = '') {
    const icon = document.createElement('i');
    icon.className = className;
    icon.setAttribute('data-icon', iconName);
    icon.setAttribute('aria-hidden', 'true');
    icon.style.fontFamily = 'Symbols Nerd Font, monospace';
    icon.style.fontStyle = 'normal';
    icon.style.display = 'inline-block';
    
    // Use innerHTML with HTML entity to prevent raw Unicode display
    const codePoint = ICON_MAP[iconName] || '';
    const hex = codePoint.codePointAt(0).toString(16);
    icon.innerHTML = `&#x${hex};`;
    
    return icon;
}

/**
 * Replaces icon placeholders with actual icon elements
 * @param {string} selector - CSS selector for icon containers 
 * @param {string} iconName - Name of the icon to insert
 */
function replaceIcons(selector, iconName) {
    document.querySelectorAll(selector).forEach(el => {
        // Clear existing content
        el.innerHTML = '';
        // Add the icon
        el.appendChild(createIcon(iconName));
    });
}

/**
 * Initializes theme toggle icons using JavaScript
 */
function setupThemeIcons() {
    // Get the theme slider
    const slider = document.querySelector('.switch .slider');
    if (!slider) {
        console.error('Theme slider element not found');
        return;
    }
    
    // Remove any existing theme icons
    slider.querySelectorAll('.theme-icon').forEach(icon => icon.remove());
    
    // Add sun icon (displayed when in light mode)
    const sunIcon = document.createElement('span');
    sunIcon.className = 'theme-icon sun-icon';
    sunIcon.innerHTML = '&#xf185;'; // Sun icon
    
    // Add moon icon (displayed when in dark mode)
    const moonIcon = document.createElement('span');
    moonIcon.className = 'theme-icon moon-icon';
    moonIcon.innerHTML = '&#xf186;'; // Moon icon
    
    // Add icons to the slider
    slider.appendChild(sunIcon);
    slider.appendChild(moonIcon);
    
    // Apply styling via CSS classes instead of inline styles
    const styleElement = document.getElementById('theme-icon-styles');
    if (!styleElement) {
        const style = document.createElement('style');
        style.id = 'theme-icon-styles';
        style.textContent = `
            .theme-icon {
                position: absolute;
                top: 4px;
                font-family: 'Symbols Nerd Font', monospace;
                font-size: 16px;
                transition: opacity 0.3s ease;
                color: var(--md-sys-color-primary);
            }
            .sun-icon {
                right: 6px;
                opacity: 1;
            }
            .moon-icon {
                left: 6px;
                opacity: 0;
            }
            .switch input:checked + .slider .sun-icon {
                opacity: 0;
            }
            .switch input:checked + .slider .moon-icon {
                opacity: 1;
            }
            .switch input:checked + .slider .theme-icon {
                color: var(--md-sys-color-on-primary);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Set up file action icons using JavaScript
 */
function setupFileActionIcons() {
    // Replace download icons
    replaceIcons('.primary-action i', 'download');
    
    // Replace copy icons
    replaceIcons('.copy-preview i', 'copy');
}

/**
 * Initializes all icons
 */
function initialize() {
    // Wait for the font to load
    document.fonts.ready.then(() => {
        setupThemeIcons();
        setupFileActionIcons();
        console.log('Nerd Font icons initialized');
    }).catch(err => {
        console.error('Failed to load fonts:', err);
    });
}

export default {
    initialize,
    createIcon,
    replaceIcons,
    ICON_MAP
};
