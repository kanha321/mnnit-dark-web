/**
 * Configuration settings for the application
 * Contains global constants and selectors
 */

const CONFIG = {
    apiEndpoints: {
        fileList: '/api/files',
        download: '/api/files',
        previewInfo: '/api/preview-info',
        previewContent: '/api/preview-content'
    },
    selectors: {
        fileList: '#file-list',
        previewContainer: '#file-preview-container',
        fileContent: '#file-content',
        previewFilename: '#preview-filename',
        currentPath: '#current-path',
        closePreview: '#close-preview',
        themeToggle: '#theme-toggle',
        previewMedia: '#preview-media'
    },
    cssClasses: {
        loading: 'loading',
        emptyState: 'empty-state',
        errorState: 'error-state',
        fileItem: 'file-item',
        textFile: 'text-file',
        hidden: 'hidden',
        darkTheme: 'dark-theme',
        previewActive: 'preview-active'
    },
    previewTypes: {
        text: 'text',
        image: 'image',
        pdf: 'pdf',
        audio: 'audio',
        video: 'video',
        other: 'other'
    }
};

export default CONFIG;
