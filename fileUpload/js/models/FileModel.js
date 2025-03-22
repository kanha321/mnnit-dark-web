/**
 * Model for managing file data
 */
export default class FileModel {
  constructor() {
    this.files = [];
  }
  
  /**
   * Add a file to the collection
   * @param {File} file - File object to add
   */
  addFile(file) {
    // Create a unique ID for the file
    const fileId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Add file with metadata
    this.files.push({
      id: fileId,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
  }
  
  /**
   * Remove a file from collection by ID
   * @param {string} fileId - ID of file to remove
   */
  removeFile(fileId) {
    this.files = this.files.filter(file => file.id !== fileId);
  }
  
  /**
   * Clear all files from collection
   */
  clearFiles() {
    this.files = [];
  }
  
  /**
   * Get a file by its ID
   * @param {string} fileId - ID of file to retrieve
   * @returns {Object|null} - File object or null if not found
   */
  getFile(fileId) {
    return this.files.find(file => file.id === fileId) || null;
  }
}
