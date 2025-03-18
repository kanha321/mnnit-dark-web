/**
 * UI related functionality
 * Handles theme, display preferences, and UI interactions
 */

import CONFIG from './config.js';
import FileSystem from './fileSystem.js';

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
        }, 100);
    });
    
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark'); // Changed from dark-theme to dark
        
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

/**
 * Updates the current path display
 */
function updatePathDisplay() {
    const currentPath = document.querySelector(CONFIG.selectors.currentPath);
    currentPath.innerHTML = `<span>Path: /files/</span>`;
}

async function showPreview(fileName) {
    console.log('Showing preview for:', fileName);
    
    const previewDialog = document.createElement('dialog');
    previewDialog.className = CONFIG.cssClasses.previewDialog;
    
    previewDialog.innerHTML = `
        <div class="preview-header">
            <h3>${fileName}</h3>
            <button class="close-preview">×</button>
        </div>
        <div class="preview-content">
            <pre class="loading">Loading preview...</pre>
        </div>
    `;
    
    document.body.appendChild(previewDialog);
    previewDialog.showModal();

    try {
        const content = await FileSystem.getFileContent(fileName);
        console.log('Preview content received, length:', content.length);
        
        const escapedContent = content.replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
        
        previewDialog.querySelector('.preview-content').innerHTML = `<pre class="code">${escapedContent}</pre>`;
    } catch (error) {
        console.error('Preview error:', error);
        previewDialog.querySelector('.preview-content').innerHTML = 
            `<div class="error-state">
                Error loading preview: ${error.message}
                <br>
                <small>Check browser console for more details</small>
            </div>`;
    }

    previewDialog.querySelector('.close-preview').addEventListener('click', () => {
        previewDialog.close();
        previewDialog.remove();
    });
}

function formatContent(content, mimeType) {
    // Escape HTML to prevent XSS
    const escapedContent = content.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));

    // Add syntax highlighting class based on MIME type
    const langClass = getMimeTypeClass(mimeType);
    return `<pre class="code ${langClass}">${escapedContent}</pre>`;
}

function getMimeTypeClass(mimeType) {
    const mimeToClass = {
        'text/html': 'language-html',
        'text/css': 'language-css',
        'application/javascript': 'language-javascript',
        'application/json': 'language-json',
        'text/xml': 'language-xml',
        'application/xml': 'language-xml',
        'text/x-python': 'language-python',
        'text/x-java': 'language-java',
        'text/x-c': 'language-c',
        'text/x-cpp': 'language-cpp',
        'text/markdown': 'language-markdown',
        'text/plain': 'language-plaintext'
    };
    
    return mimeToClass[mimeType] || 'language-plaintext';
}

export default {
    setupThemeToggle,
    showPreview
};
