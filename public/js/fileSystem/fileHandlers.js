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
    event.preventDefault();
    event.stopPropagation();
    
    // Get the file name from the clicked button data attribute
    const button = event.currentTarget;
    const fileName = button.getAttribute('data-name');
    
    if (!fileName) {
        console.error('No filename found for download');
        return;
    }
    
    // Create and trigger a download link
    const downloadUrl = `${CONFIG.apiEndpoints.download}/${encodeURIComponent(fileName)}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName; // Use the original filename
    link.style.display = 'none';
    
    // Add to DOM, trigger click, then remove
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
    
    console.log('Downloading file:', fileName);
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

    // Remove any existing event listeners first to prevent duplicates
    document.querySelectorAll('.primary-action').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', downloadFile);
    });

    document.querySelectorAll('.copy-preview').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', handleCopyClick);
    });
}

/**
 * Handle copy button click - simplified implementation
 * @param {Event} event - Click event
 */
async function handleCopyClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    
    // Check if button is already in a copied or error state
    if (button.classList.contains('copied-state') || button.classList.contains('error-state')) {
        console.log('Button is already in a feedback state - ignoring click');
        return; // Ignore clicks while in feedback state
    }
    
    const fileName = button.getAttribute('data-name');
    
    if (!fileName) {
        console.error('No filename found for copy');
        showCopyFeedback(button, false);
        return;
    }
    
    try {
        const content = await fileAPI.getFileContent(fileName);
        
        // Try different copy methods in sequence for best compatibility
        let copySuccessful = false;
        
        // Method 1: Modern Clipboard API (most browsers)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(content);
                copySuccessful = true;
                console.log('Copied using Clipboard API');
            } catch (clipboardErr) {
                console.warn('Clipboard API failed:', clipboardErr);
            }
        }
        
        // Method 2: execCommand (fallback for older browsers)
        if (!copySuccessful) {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = content;
                
                // Make the textarea part of the page so it can be selected
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                textarea.style.opacity = '0';
                
                document.body.appendChild(textarea);
                
                // iOS specific handling
                if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                    const range = document.createRange();
                    range.selectNodeContents(textarea);
                    
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    textarea.setSelectionRange(0, content.length);
                } else {
                    textarea.select();
                }
                
                copySuccessful = document.execCommand('copy');
                document.body.removeChild(textarea);
                console.log('Copied using execCommand');
            } catch (execErr) {
                console.warn('execCommand failed:', execErr);
            }
        }
        
        showCopyFeedback(button, copySuccessful);
    } catch (error) {
        console.error('Error getting content for copy:', error);
        showCopyFeedback(button, false);
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
    
    // Clone and replace the button to remove any existing listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    btn = newBtn;
    
    if (success) {
        // Use icon from icon manager
        btn.innerHTML = '';
        const icon = iconManager.createIcon('check');
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(' Copied!'));
        btn.classList.add('copied-state');
        
        // Reset after delay
        const timeout = setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied-state');
            buttonTimeouts.delete(btn);
            
            // Reattach event listeners
            btn.addEventListener('click', handleCopyClick);
        }, 2000);
        
        buttonTimeouts.set(btn, timeout);
    } else {
        // Use icon from icon manager
        btn.innerHTML = '';
        const icon = iconManager.createIcon('warning');
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(' Copy Error'));
        btn.classList.add('error-state');
        
        // Allow clicking to reset immediately 
        // Note: This click will just reset the button, not trigger a new copy operation
        btn.addEventListener('click', () => {
            btn.innerHTML = originalHTML;
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
    attachEventListeners,
    handleCopyClick
};
