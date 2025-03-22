/**
 * File handlers module entry point
 * Combines all file interaction handlers
 */

import downloadHandler from './downloadHandler.js';
import copyHandler from './copyHandler.js';
import eventAttacher from './eventAttacher.js';

// Export all components for easy importing
export default {
    downloadFile: downloadHandler.downloadFile,
    handleCopyClick: copyHandler.handleCopyClick,
    attachEventListeners: eventAttacher.attachEventListeners
};
