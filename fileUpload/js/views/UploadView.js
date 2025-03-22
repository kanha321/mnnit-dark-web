/**
 * View for handling upload UI
 */
export default class UploadView {
  constructor() {
    // DOM elements
    this.dropArea = document.getElementById('drop-area');
    this.fileInput = document.getElementById('file-input');
    this.selectButton = document.getElementById('select-files');
    this.uploadButton = document.getElementById('upload-files');
    this.progressContainer = document.getElementById('upload-progress');
    this.progressFill = document.getElementById('progress-fill');
    this.progressText = document.getElementById('progress-text');
  }
  
  /**
   * Set drop area to active state (during drag over)
   */
  setDropAreaActive() {
    this.dropArea.classList.add('drag-over');
  }
  
  /**
   * Set drop area to normal state
   */
  setDropAreaNormal() {
    this.dropArea.classList.remove('drag-over');
  }
  
  /**
   * Show progress UI
   */
  showProgress() {
    this.progressContainer.hidden = false;
    this.progressFill.style.width = '0%';
    this.progressText.textContent = 'Uploading... 0%';
    this.progressText.style.color = 'var(--md-sys-color-on-surface-variant)';
  }
  
  /**
   * Hide progress UI
   */
  hideProgress() {
    this.progressContainer.hidden = true;
  }
  
  /**
   * Update progress bar
   * @param {number} percent - Upload progress percentage
   */
  updateProgress(percent) {
    const formattedPercent = Math.round(percent);
    this.progressFill.style.width = `${formattedPercent}%`;
    this.progressText.textContent = `Uploading... ${formattedPercent}%`;
  }
  
  /**
   * Set progress UI to complete state
   * @param {string} message - Optional custom success message
   */
  setProgressComplete(message = 'Upload complete! Files uploaded successfully.') {
    this.progressFill.style.width = '100%';
    this.progressText.textContent = message;
    this.progressText.style.color = 'var(--md-sys-color-primary)';
    
    // Add "DEMO" badge to make it clear this is just a simulation
    const demoBadge = document.createElement('span');
    demoBadge.textContent = 'FRONTEND DEMO';
    demoBadge.style.marginLeft = '8px';
    demoBadge.style.padding = '2px 6px';
    demoBadge.style.fontSize = '12px';
    demoBadge.style.borderRadius = '4px';
    demoBadge.style.backgroundColor = 'var(--md-sys-color-tertiary-container)';
    demoBadge.style.color = 'var(--md-sys-color-on-tertiary-container)';
    this.progressText.appendChild(demoBadge);
    
    // Show upload success message
    this.showNotification(message + ' [DEMO MODE]', 'success');
  }
  
  /**
   * Set progress UI to error state
   * @param {string} errorMessage - Error message to display
   */
  setProgressError(errorMessage = 'Upload failed. Please try again.') {
    this.progressText.textContent = errorMessage;
    this.progressText.style.color = 'var(--md-sys-color-error)';
    
    // Add "DEMO" badge to make it clear this is just a simulation
    const demoBadge = document.createElement('span');
    demoBadge.textContent = 'FRONTEND DEMO';
    demoBadge.style.marginLeft = '8px';
    demoBadge.style.padding = '2px 6px';
    demoBadge.style.fontSize = '12px';
    demoBadge.style.borderRadius = '4px';
    demoBadge.style.backgroundColor = 'var(--md-sys-color-tertiary-container)';
    demoBadge.style.color = 'var(--md-sys-color-on-tertiary-container)';
    this.progressText.appendChild(demoBadge);
    
    // Show error notification
    this.showNotification(errorMessage + ' [DEMO MODE]', 'error');
  }
  
  /**
   * Show a notification message
   * @param {string} message - Message to display
   * @param {string} type - Type of notification ('success' or 'error')
   */
  showNotification(message, type) {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.className = 'notification-container';
      document.body.appendChild(notificationContainer);
      
      // Add styles dynamically if not already in CSS
      if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
          }
          .notification {
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: var(--elevation-2);
            animation: slide-in 0.3s ease-out;
            max-width: 300px;
          }
          .notification.success {
            background-color: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
          }
          .notification.error {
            background-color: var(--md-sys-color-error-container);
            color: var(--md-sys-color-on-error-container);
          }
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.animation = 'fade-out 0.5s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 5000);
  }
  
  /**
   * Bind file selection handler
   * @param {Function} handler - Function to handle file selection
   */
  bindFileSelect(handler) {
    this.fileInput.addEventListener('change', handler);
    this.selectButton.addEventListener('click', () => {
      this.fileInput.click();
    });
    
    // Allow clicking anywhere in the drop area to select files
    this.dropArea.addEventListener('click', (e) => {
      // Don't trigger if clicking on the select button (to avoid double events)
      if (e.target !== this.selectButton && !this.selectButton.contains(e.target)) {
        this.fileInput.click();
      }
    });
  }
  
  /**
   * Bind drop handler
   * @param {Function} handler - Function to handle file drop
   */
  bindDrop(handler) {
    this.dropArea.addEventListener('drop', handler);
  }
  
  /**
   * Bind drag over handler
   * @param {Function} handler - Function to handle drag over
   */
  bindDragOver(handler) {
    this.dropArea.addEventListener('dragover', handler);
  }
  
  /**
   * Bind drag leave handler
   * @param {Function} handler - Function to handle drag leave
   */
  bindDragLeave(handler) {
    this.dropArea.addEventListener('dragleave', handler);
  }
  
  /**
   * Bind upload handler
   * @param {Function} handler - Function to handle file upload
   */
  bindUpload(handler) {
    this.uploadButton.addEventListener('click', handler);
  }
}
