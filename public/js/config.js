/**
 * Configuration settings for the application
 * Contains global constants and selectors
 */

const CONFIG = {
    apiEndpoints: {
        fileList: '/api/files',
        download: '/api/files'
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
        darkTheme: 'dark-theme'
    }
};

export default CONFIG;
