/**
 * Preview Manager
 * Handles preview functionality for different file types
 */

import CONFIG from './config.js';

/**
 * Determines the preview type based on file type
 * @param {string} fileType - Type of the file
 * @param {string} fileName - Name of the file
 * @returns {string} - Preview type
 */
function getPreviewType(fileType, fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) {
        return CONFIG.previewTypes.image;
    }
    
    // PDF files
    if (ext === 'pdf') {
        return CONFIG.previewTypes.pdf;
    }
    
    // Audio files
    if (['mp3', 'wav', 'ogg'].includes(ext)) {
        return CONFIG.previewTypes.audio;
    }
    
    // Video files
    if (['mp4', 'webm'].includes(ext)) {
        return CONFIG.previewTypes.video;
    }
    
    // Text files or code
    if (fileType === 'text' || fileType === 'code' || 
        fileType === 'web' || fileType === 'python' || 
        fileType === 'java' || fileType === 'cpp' || 
        fileType === 'data') {
        return CONFIG.previewTypes.text;
    }
    
    return CONFIG.previewTypes.other;
}

/**
 * Opens the preview for a file
 * @param {string} fileName - Name of the file to preview
 */
async function openPreview(fileName) {
    const previewContainer = document.querySelector(CONFIG.selectors.previewContainer);
    const fileContent = document.querySelector(CONFIG.selectors.fileContent);
    const previewFilename = document.querySelector(CONFIG.selectors.previewFilename);
    
    try {
        // First, show loading state
        previewFilename.textContent = fileName;
        fileContent.textContent = 'Loading preview...';
        previewContainer.classList.remove(CONFIG.cssClasses.hidden);
        document.body.classList.add(CONFIG.cssClasses.previewActive);
        
        // Get file information for preview
        const response = await fetch(`${CONFIG.apiEndpoints.previewInfo}/${encodeURIComponent(fileName)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const fileInfo = await response.json();
        const previewType = getPreviewType(fileInfo.type, fileName);
        
        // Reset the preview container
        resetPreviewContainer();
        
        // Show preview based on file type
        switch (previewType) {
            case CONFIG.previewTypes.text:
                await showTextPreview(fileName, fileContent);
                break;
                
            case CONFIG.previewTypes.image:
                showImagePreview(fileInfo.previewUrl, fileContent);
                break;
                
            case CONFIG.previewTypes.pdf:
                showPdfPreview(fileInfo.previewUrl, fileContent);
                break;
                
            case CONFIG.previewTypes.audio:
                showAudioPreview(fileInfo.previewUrl, fileContent);
                break;
                
            case CONFIG.previewTypes.video:
                showVideoPreview(fileInfo.previewUrl, fileContent);
                break;
                
            default:
                fileContent.textContent = 'This file type cannot be previewed. Please download it instead.';
        }
        
    } catch (error) {
        console.error('Error previewing file:', error);
        fileContent.textContent = `Error loading preview: ${error.message}`;
    }
}

/**
 * Reset the preview container to its initial state
 */
function resetPreviewContainer() {
    const fileContent = document.querySelector(CONFIG.selectors.fileContent);
    fileContent.innerHTML = '';
    
    // Remove any media elements that might have been added
    const mediaPreview = document.querySelector(CONFIG.selectors.previewMedia);
    if (mediaPreview) {
        mediaPreview.remove();
    }
}

/**
 * Shows a text file preview
 * @param {string} fileName - Name of the file
 * @param {HTMLElement} container - Container to show the preview in
 */
async function showTextPreview(fileName, container) {
    try {
        const response = await fetch(`${CONFIG.apiEndpoints.previewContent}/${encodeURIComponent(fileName)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const content = await response.text();
        container.textContent = content;
        
    } catch (error) {
        container.textContent = `Error loading text content: ${error.message}`;
    }
}

/**
 * Shows an image preview
 * @param {string} url - URL to the image
 * @param {HTMLElement} container - Container to show the preview in
 */
function showImagePreview(url, container) {
    // Create image element
    const mediaContainer = document.createElement('div');
    mediaContainer.id = CONFIG.selectors.previewMedia.substring(1);
    mediaContainer.classList.add('media-preview');
    
    mediaContainer.innerHTML = `
        <img src="${url}" alt="Image Preview" />
    `;
    
    container.parentNode.insertBefore(mediaContainer, container);
    container.style.display = 'none';
}

/**
 * Shows a PDF preview
 * @param {string} url - URL to the PDF
 * @param {HTMLElement} container - Container to show the preview in
 */
function showPdfPreview(url, container) {
    // Create PDF viewer
    const mediaContainer = document.createElement('div');
    mediaContainer.id = CONFIG.selectors.previewMedia.substring(1);
    mediaContainer.classList.add('media-preview');
    
    mediaContainer.innerHTML = `
        <iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>
    `;
    
    container.parentNode.insertBefore(mediaContainer, container);
    container.style.display = 'none';
}

/**
 * Shows an audio preview
 * @param {string} url - URL to the audio file
 * @param {HTMLElement} container - Container to show the preview in
 */
function showAudioPreview(url, container) {
    // Create audio player
    const mediaContainer = document.createElement('div');
    mediaContainer.id = CONFIG.selectors.previewMedia.substring(1);
    mediaContainer.classList.add('media-preview');
    
    mediaContainer.innerHTML = `
        <audio controls>
            <source src="${url}" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
    `;
    
    container.parentNode.insertBefore(mediaContainer, container);
    container.style.display = 'none';
}

/**
 * Shows a video preview
 * @param {string} url - URL to the video file
 * @param {HTMLElement} container - Container to show the preview in
 */
function showVideoPreview(url, container) {
    // Create video player
    const mediaContainer = document.createElement('div');
    mediaContainer.id = CONFIG.selectors.previewMedia.substring(1);
    mediaContainer.classList.add('media-preview');
    
    mediaContainer.innerHTML = `
        <video controls width="100%">
            <source src="${url}" type="video/mp4">
            Your browser does not support the video element.
        </video>
    `;
    
    container.parentNode.insertBefore(mediaContainer, container);
    container.style.display = 'none';
}

/**
 * Close the preview
 */
function closePreview() {
    const previewContainer = document.querySelector(CONFIG.selectors.previewContainer);
    const fileContent = document.querySelector(CONFIG.selectors.fileContent);
    
    previewContainer.classList.add(CONFIG.cssClasses.hidden);
    document.body.classList.remove(CONFIG.cssClasses.previewActive);
    fileContent.style.display = 'block';
    
    // Reset any media previews
    resetPreviewContainer();
}

export default {
    openPreview,
    closePreview,
    getPreviewType
};
