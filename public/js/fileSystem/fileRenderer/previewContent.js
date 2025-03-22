/**
 * Handles file preview content loading and display
 */

import fileAPI from '../fileAPI.js';

/**
 * Load preview content for a file
 * @param {string} fileName - Name of the file
 * @param {HTMLElement} container - Container element
 */
async function loadPreviewContent(fileName, container) {
    try {
        const content = await fileAPI.getFileContent(fileName);
        const escapedContent = escapeHtml(content);
        
        container.innerHTML = `<pre>${escapedContent}</pre>`;
    } catch (error) {
        container.innerHTML = `<div class="error-state">Failed to load preview</div>`;
    }
}

/**
 * Escapes HTML characters in a string
 * @param {string} html - HTML string to escape
 * @returns {string} - Escaped HTML
 */
function escapeHtml(html) {
    return html.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

export default {
    loadPreviewContent,
    escapeHtml
};
