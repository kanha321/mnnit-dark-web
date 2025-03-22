/**
 * View for displaying the file list
 */
export default class FileListView {
  constructor() {
    this.fileListElement = document.getElementById('file-list');
    this.clearButton = document.getElementById('clear-files');
  }
  
  /**
   * Format file size to human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted size string
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Get appropriate icon for file type
   * @param {string} fileType - MIME type of file
   * @returns {string} - Material icon name
   */
  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video_file';
    if (fileType.startsWith('audio/')) return 'audio_file';
    if (fileType.startsWith('text/')) return 'description';
    if (fileType.includes('pdf')) return 'picture_as_pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'article';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'table_chart';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'slideshow';
    if (fileType.includes('zip') || fileType.includes('archive')) return 'folder_zip';
    return 'insert_drive_file';
  }
  
  /**
   * Render the file list
   * @param {Array} files - Array of file objects to display
   */
  render(files) {
    // Clear current list
    this.fileListElement.innerHTML = '';
    
    if (files.length === 0) {
      this.fileListElement.innerHTML = '<p class="empty-message">No files selected</p>';
      return;
    }
    
    // Create elements for each file
    files.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.dataset.id = file.id;
      
      // Create icon based on file type
      const icon = this.getFileIcon(file.type);
      
      fileItem.innerHTML = `
        <div class="file-icon">
          <span class="material-symbols-outlined">${icon}</span>
        </div>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${this.formatFileSize(file.size)}</div>
        </div>
        <button class="file-remove" data-id="${file.id}">
          <span class="material-symbols-outlined">close</span>
        </button>
      `;
      
      this.fileListElement.appendChild(fileItem);
    });
    
    // Add event listeners to remove buttons
    const removeButtons = this.fileListElement.querySelectorAll('.file-remove');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const fileId = e.currentTarget.dataset.id;
        this.onRemoveFile(fileId);
      });
    });
  }
  
  /**
   * Bind file removal handler
   * @param {Function} handler - Function to handle file removal
   */
  bindRemoveFile(handler) {
    this.onRemoveFile = handler;
  }
  
  /**
   * Bind clear files handler
   * @param {Function} handler - Function to handle clearing files
   */
  bindClearFiles(handler) {
    this.clearButton.addEventListener('click', handler);
  }
}
