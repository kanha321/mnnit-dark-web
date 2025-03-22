/**
 * Handles file icon rendering and management
 */

/**
 * Inserts an appropriate icon for a file type
 * @param {HTMLElement} container - Element to insert the icon into
 * @param {string} fileType - Type of file
 */
function insertFileIcon(container, fileType) {
    // Simple mapping of file types to Nerd Font icons
    const typeToIcon = {
        text: '\uf15c',     // Text file
        code: '\uf1c9',     // Code file
        python: '\ue73c',   // Python
        java: '\ue738',     // Java
        cpp: '\ue61d',      // C++
        web: '\uf13b',      // HTML
        data: '\uf1c0',     // Database
        pdf: '\uf1c1',      // PDF
        archive: '\uf1c6',  // Archive
        binary: '\uf471',   // Binary
        unknown: '\uf15b'   // Unknown
    };
    
    const icon = typeToIcon[fileType] || typeToIcon.unknown;
    container.textContent = icon;
    
    // Apply correct font styling directly
    container.style.fontFamily = 'Symbols Nerd Font, monospace';
}

export default {
    insertFileIcon
};
