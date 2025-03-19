/**
 * Content formatting utilities for UI
 */

/**
 * Escapes HTML characters in content
 * @param {string} content - Text content to escape
 * @returns {string} - HTML escaped content
 */
function escapeHTML(content) {
    return content.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

/**
 * Gets CSS class for a MIME type for syntax highlighting
 * @param {string} mimeType - MIME type of the file
 * @returns {string} - CSS class name
 */
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

/**
 * Formats content with syntax highlighting based on MIME type
 * @param {string} content - Raw file content
 * @param {string} mimeType - MIME type of the file
 * @returns {string} - Formatted HTML content
 */
function formatContent(content, mimeType) {
    const escapedContent = escapeHTML(content);
    const langClass = getMimeTypeClass(mimeType);
    return `<pre class="code ${langClass}">${escapedContent}</pre>`;
}

export default {
    escapeHTML,
    getMimeTypeClass,
    formatContent
};
