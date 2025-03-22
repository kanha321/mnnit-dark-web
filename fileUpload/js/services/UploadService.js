/**
 * Service for handling file uploads to the server
 * This is a MOCK/SIMULATION implementation for frontend development only
 */
export default class UploadService {
  constructor() {
    console.log('%c⚠️ DEMO MODE: No real uploads will occur', 'font-weight: bold; font-size: 16px; color: orange');
    console.log('This is a frontend simulation only - no files will be sent to any server');
  }
  
  /**
   * Upload files to the server (SIMULATED - NO ACTUAL UPLOAD OCCURS)
   * @param {Array} files - Array of file objects to upload
   * @param {Function} progressCallback - Callback for progress updates
   * @returns {Promise} - Resolves when upload completes
   */
  async uploadFiles(files, progressCallback) {
    return new Promise((resolve, reject) => {
      console.log('%c📢 DEMO MODE ACTIVE: Simulating file upload', 'background-color: #FFF3CD; color: #856404; padding: 5px; border-radius: 3px');
      console.log(`Would upload ${files.length} files if backend was implemented:`);
      
      // Show file information that would be uploaded
      files.forEach(fileObj => {
        console.log(`- ${fileObj.name} (${this.formatFileSize(fileObj.size)})`);
      });
      
      // Add simulated progress banner to the page
      this.showSimulationBanner();
      
      // Simulate progress updates with a slight randomization to seem more realistic
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 8 + 2; // Add between 2-10% each time
        progressCallback(Math.min(progress, 100));
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          
          // Simulate successful upload after a delay
          setTimeout(() => {
            console.log('%c✅ DEMO: Upload simulation complete', 'color: green; font-weight: bold');
            
            // Generate mock response
            const mockResponse = {
              success: true,
              message: `DEMO MODE: ${files.length} files processed (No actual upload occurred)`,
              files: files.map(fileObj => ({
                name: fileObj.name,
                size: fileObj.size,
                url: '#demo-url',
                mimetype: fileObj.file.type,
                demo: true
              }))
            };
            
            resolve(mockResponse);
          }, 500);
        }
      }, 200);
    });
  }
  
  /**
   * Show a simulation banner on the page
   */
  showSimulationBanner() {
    // Only add the banner if it doesn't already exist
    if (!document.getElementById('demo-mode-banner')) {
      const banner = document.createElement('div');
      banner.id = 'demo-mode-banner';
      banner.style.position = 'fixed';
      banner.style.bottom = '20px';
      banner.style.left = '20px';
      banner.style.backgroundColor = '#FFF3CD';
      banner.style.color = '#856404';
      banner.style.padding = '10px 15px';
      banner.style.borderRadius = '5px';
      banner.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      banner.style.zIndex = '9999';
      banner.style.fontSize = '14px';
      banner.style.fontWeight = 'bold';
      banner.innerHTML = '⚠️ DEMO MODE: No actual file uploads will occur';
      
      document.body.appendChild(banner);
      
      // Remove the banner after some time
      setTimeout(() => {
        if (banner.parentNode) {
          banner.style.opacity = '0';
          banner.style.transition = 'opacity 0.5s ease-out';
          setTimeout(() => banner.parentNode.removeChild(banner), 500);
        }
      }, 5000);
    }
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
}
