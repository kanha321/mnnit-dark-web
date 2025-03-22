/**
 * Handles file content copy operations
 */

import fileAPI from '../fileAPI.js';
import iconManager from '../../ui/iconManager.js';

// Store timeouts to prevent multiple animations
const buttonTimeouts = new WeakMap();

/**
 * Handle copy button click
 * @param {Event} event - Click event
 */
async function handleCopyClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    
    // Check if button is already in a copied or error state
    if (button.classList.contains('copied-state') || button.classList.contains('error-state')) {
        return; // Ignore clicks while in feedback state
    }
    
    const fileName = button.getAttribute('data-name');
    
    if (!fileName) {
        showCopyFeedback(button, false);
        return;
    }
    
    try {
        const content = await fileAPI.getFileContent(fileName);
        
        // Try different copy methods in sequence for best compatibility
        let copySuccessful = await copyToClipboard(content);
        showCopyFeedback(button, copySuccessful);
    } catch (error) {
        showCopyFeedback(button, false);
    }
}

/**
 * Attempts to copy text to clipboard using different methods
 * @param {string} content - Text to copy
 * @returns {Promise<boolean>} - Success state
 */
async function copyToClipboard(content) {
    // Method 1: Modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(content);
            return true;
        } catch (clipboardErr) {
            // Fall through to next method
        }
    }
    
    // Method 2: execCommand (fallback)
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
        
        const result = document.execCommand('copy');
        document.body.removeChild(textarea);
        return result;
    } catch (execErr) {
        return false;
    }
}

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
        // Use separate elements for icon and text to ensure proper font application
        btn.innerHTML = '';
        
        // Create icon with correct font
        const icon = document.createElement('i');
        icon.textContent = iconManager.ICON_MAP.check;
        icon.className = 'icon-element';
        
        // Create text with correct font
        const textSpan = document.createElement('span');
        textSpan.className = 'button-text';
        textSpan.textContent = ' Copied!';
        
        btn.appendChild(icon);
        btn.appendChild(textSpan);
        btn.classList.add('copied-state');
        
        // Reset after delay
        const timeout = setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied-state');
            buttonTimeouts.delete(btn);
            
            btn.addEventListener('click', handleCopyClick);
        }, 2000);
        
        buttonTimeouts.set(btn, timeout);
    } else {
        btn.innerHTML = '';
        
        // Create icon with correct font
        const icon = document.createElement('i');
        icon.textContent = iconManager.ICON_MAP.warning;
        icon.className = 'icon-element';
        
        // Create text with correct font
        const textSpan = document.createElement('span');
        textSpan.className = 'button-text';
        textSpan.textContent = ' Copy Error';
        
        btn.appendChild(icon);
        btn.appendChild(textSpan);
        btn.classList.add('error-state');
        
        // Allow clicking to reset immediately
        btn.addEventListener('click', () => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('error-state');
            buttonTimeouts.delete(btn);
            
            // Add back the original handler
            setTimeout(() => {
                btn.addEventListener('click', handleCopyClick);
            }, 10);
        });
        
        // Auto-reset after delay
        const timeout = setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('error-state');
            buttonTimeouts.delete(btn);
            
            btn.addEventListener('click', handleCopyClick);
        }, 3000);
        
        buttonTimeouts.set(btn, timeout);
    }
}

export default {
    handleCopyClick,
    copyToClipboard,
    showCopyFeedback
};
