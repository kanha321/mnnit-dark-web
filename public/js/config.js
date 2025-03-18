/**
 * Configuration settings for the application
 * Contains global constants and selectors
 */

const CONFIG = {
    apiEndpoints: {
        fileList: '/api/files',
        download: '/files',  // Points to static files directory
        preview: '/files'    // Points to static files directory
    },
    selectors: {
        fileList: '#file-list',
        currentPath: '#current-path',
        themeToggle: '#theme-toggle'
    },
    cssClasses: {
        loading: 'loading',
        emptyState: 'empty-state',
        errorState: 'error-state',
        fileItem: 'file-item',
        textFile: 'text-file',
        darkTheme: 'dark-theme',
        previewDialog: 'preview-dialog'
    },
    cache: {
        enabled: true,
        maxSize: 1024 * 1024, // 1MB total cache size
        maxFileSize: 100 * 1024 // 100KB max per file
    }
};

export default CONFIG;
