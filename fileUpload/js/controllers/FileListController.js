/**
 * Controller for managing the file list
 */
import FileModel from '../models/FileModel.js';
import FileListView from '../views/FileListView.js';

export default class FileListController {
  constructor() {
    this.fileModel = new FileModel();
    this.fileListView = new FileListView();
    
    // Bind methods
    this.addFiles = this.addFiles.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.clearFiles = this.clearFiles.bind(this);
    this.getFiles = this.getFiles.bind(this);
    
    // Initialize event listeners
    this.fileListView.bindRemoveFile(this.removeFile);
    this.fileListView.bindClearFiles(this.clearFiles);
  }
  
  /**
   * Add files to the file list
   * @param {FileList} fileList - List of files to add
   */
  addFiles(fileList) {
    const filesToAdd = Array.from(fileList);
    
    // Add files to model
    filesToAdd.forEach(file => {
      this.fileModel.addFile(file);
    });
    
    // Update view
    this.fileListView.render(this.fileModel.files);
  }
  
  /**
   * Remove a file from the list
   * @param {string} fileId - ID of file to remove
   */
  removeFile(fileId) {
    this.fileModel.removeFile(fileId);
    this.fileListView.render(this.fileModel.files);
  }
  
  /**
   * Clear all files from the list
   */
  clearFiles() {
    this.fileModel.clearFiles();
    this.fileListView.render(this.fileModel.files);
  }
  
  /**
   * Get all files in the list
   * @returns {Array} - Array of file objects
   */
  getFiles() {
    return this.fileModel.files;
  }
}
