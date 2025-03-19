/**
 * Event handlers for file interactions
 */

import CONFIG from '../config.js';
import fileAPI from './fileAPI.js';
import iconManager from '../ui/iconManager.js';

/**
 * Downloads a file
 * @param {Event} event - Click event
 */
function downloadFile(event) {
    const fileName = event.target.getAttribute('data-name');
    window.location.href = `${CONFIG.apiEndpoints.download}/${encodeURIComponent(fileName)}`;
}

/**
 * Attaches event listeners to file action buttons
 */
function attachEventListeners() {
    // Use the icon manager to set up icons
    document.querySelectorAll('.primary-action i').forEach(icon => {
        icon.textContent = iconManager.ICON_MAP.download;
    });
    
    document.querySelectorAll('.copy-preview i').forEach(icon => {
        icon.textContent = iconManager.ICON_MAP.copy;
    });

    document.querySelectorAll('.primary-action').forEach(btn => {
        btn.addEventListener('click', downloadFile);
    });

    document.querySelectorAll('.copy-preview').forEach(btn => {
        btn.removeEventListener('click', downloadFile);  // Remove default download handler
        btn.addEventListener('click', handleCopyClick);
    });
}

/**
 * Handle copy button click
 * @param {Event} event - Click event
 */
async function handleCopyClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const fileName = event.target.getAttribute('data-name');
    
    try {
        const content = await fileAPI.getFileContent(fileName);
        
        try {
            // Use clipboard API without fallback dialog
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(content);
                showCopyFeedback(event.target, true);
            } else {
                // Use document.execCommand as fallback
                const textarea = document.createElement('textarea');
                textarea.value = content;
                textarea.style.position = 'fixed';
                textarea.style.top = '-9999px';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                showCopyFeedback(event.target, successful);
            }
        } catch (error) {
            console.error('Copy failed:', error);
            showCopyFeedback(event.target, false);
        }
    } catch (error) {
        console.error('Error copying content:', error);
        showCopyFeedback(event.target, false);
    }
}

// Store timeouts to prevent multiple animations
const buttonTimeouts = new WeakMap();

/**
 * Show feedback to the user after copy attempt
 * @param {HTMLElement} btn - The button element
 * @param {boolean} success - Whether the copy was successful
 */
function showCopyFeedback(btn, success) {
    // Clear any existing timeout to prevent stacking animations
    if (buttonTimeouts.has(btn)) {
        clearTimeout(buttonTimeouts.get(btn));
    }
    
    // Store original content for restoration
    if (!btn.hasAttribute('data-original-html')) {
        btn.setAttribute('data-original-html', btn.innerHTML);
    }
    
    // Get the original HTML from the data attribute
    const originalHTML = btn.getAttribute('data-original-html');
    
    // Remove any existing event listeners
    btn.replaceWith(btn.cloneNode(true));
    const newBtn = document.querySelector(`[data-name="${btn.getAttribute('data-name')}"].copy-preview`);
    btn = newBtn;
    
    if (success) {
        // Use icon from icon manager
        btn.innerHTML = '';
        btn.appendChild(iconManager.createIcon('check'));
        btn.appendChild(document.createTextNode(' Copied!'));
        btn.style.backgroundColor = 'var(--md-sys-color-secondary)';
        btn.classList.add('copied-state');
        
        // Reset after delay
        const timeout = setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
            btn.classList.remove('copied-state');
            buttonTimeouts.delete(btn);
            
            // Reattach event listeners
            btn.addEventListener('click', handleCopyClick);
        }, 2000);
        
        buttonTimeouts.set(btn, timeout);
    } else {
        // Use icon from icon manager
        btn.innerHTML = '';
        btn.appendChild(iconManager.createIcon('warning'));
        btn.appendChild(document.createTextNode(' Copy Error'));
        btn.style.backgroundColor = 'var(--md-sys-color-error)';
        btn.classList.add('error-state');
        
        // Allow clicking to reset immediately
        btn.addEventListener('click', () => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
            btn.classList.remove('error-state');
            buttonTimeouts.delete(btn);
            
            // Add back the original handler after a small delay
            setTimeout(() => {
                btn.addEventListener('click', handleCopyClick);
            }, 10);
        });
        
        // Auto-reset after delay
        const timeout = setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
            btn.classList.remove('error-state');
            buttonTimeouts.delete(btn);
            
            // Reattach event listeners
            btn.addEventListener('click', handleCopyClick);
        }, 3000);
        
        buttonTimeouts.set(btn, timeout);
    }
}

export default {
    downloadFile,
    attachEventListeners
};
