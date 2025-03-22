/**
 * Controller for handling file uploads
 * DEMO VERSION - No actual backend uploads occur
 */
import UploadService from '../services/UploadService.js';
import UploadView from '../views/UploadView.js';

export default class UploadController {
  constructor(fileListController) {
    this.fileListController = fileListController;
    this.uploadService = new UploadService();
    this.uploadView = new UploadView();
    
    // Bind methods
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  
  /**
   * Initialize the upload controller
   */
  init() {
    // Bind UI events
    this.uploadView.bindFileSelect(this.handleFileSelect);
    this.uploadView.bindDrop(this.handleDrop);
    this.uploadView.bindDragOver(this.handleDragOver);
    this.uploadView.bindDragLeave(this.handleDragLeave);
    this.uploadView.bindUpload(this.handleUpload);
  }
  
  /**
   * Handle file selection from input
   * @param {Event} event - File input change event
   */
  handleFileSelect(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.fileListController.addFiles(files);
    }
  }
  
  /**
   * Handle files dropped onto drop area
   * @param {DragEvent} event - Drop event
   */
  handleDrop(event) {
    event.preventDefault();
    this.uploadView.setDropAreaNormal();
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      this.fileListController.addFiles(files);
    }
  }
  
  /**
   * Handle dragover event
   * @param {DragEvent} event - Dragover event
   */
  handleDragOver(event) {
    event.preventDefault();
    this.uploadView.setDropAreaActive();
  }
  
  /**
   * Handle dragleave event
   * @param {DragEvent} event - Dragleave event
   */
  handleDragLeave(event) {
    this.uploadView.setDropAreaNormal();
  }
  
  /**
   * Handle upload button click
   */
  async handleUpload() {
    const files = this.fileListController.getFiles();
    
    if (files.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }
    
    // Show progress UI
    this.uploadView.showProgress();
    
    // Show demo mode alert
    alert('DEMO MODE: This is a frontend simulation only.\nNo actual files will be uploaded to any server.');
    
    try {
      // Use mock service for now
      await this.uploadService.uploadFiles(
        files, 
        (progress) => this.uploadView.updateProgress(progress)
      );
      
      // Handle completion
      console.log('Upload SIMULATION completed successfully');
      this.uploadView.setProgressComplete('DEMO: Files processed (No actual upload occurred)');
      this.fileListController.clearFiles();
      
      // Hide progress after a delay
      setTimeout(() => {
        this.uploadView.hideProgress();
      }, 2000);
      
    } catch (error) {
      console.error('Upload simulation failed:', error);
      this.uploadView.setProgressError('DEMO: Upload simulation failed. This is only a frontend preview.');
      
      // Hide progress after a delay
      setTimeout(() => {
        this.uploadView.hideProgress();
      }, 5000);
    }
  }
}
