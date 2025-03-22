/**
 * Attaches event handlers to file interaction elements
 */

import iconManager from '../../ui/iconManager.js';
import downloadHandler from './downloadHandler.js';
import copyHandler from './copyHandler.js';

/**
 * Attaches event listeners to file action buttons
 */
function attachEventListeners() {
    // Use icon manager to set up icons with proper font handling
    document.querySelectorAll('.primary-action i').forEach(icon => {
        // Remove existing icon and replace with properly styled one
        const parent = icon.parentNode;
        icon.remove();
        
        // Create icon with correct font family
        const newIcon = document.createElement('i');
        newIcon.textContent = iconManager.ICON_MAP.download;
        newIcon.className = 'icon-element';
        
        // Insert at beginning of button
        if (parent.firstChild) {
            parent.insertBefore(newIcon, parent.firstChild);
        } else {
            parent.appendChild(newIcon);
        }
    });
    
    document.querySelectorAll('.copy-preview i').forEach(icon => {
        // Remove existing icon and replace with properly styled one
        const parent = icon.parentNode;
        icon.remove();
        
        // Create icon with correct font family
        const newIcon = document.createElement('i');
        newIcon.textContent = iconManager.ICON_MAP.copy;
        newIcon.className = 'icon-element';
        
        // Insert at beginning of button
        if (parent.firstChild) {
            parent.insertBefore(newIcon, parent.firstChild);
        } else {
            parent.appendChild(newIcon);
        }
    });

    // Remove any existing event listeners first to prevent duplicates
    document.querySelectorAll('.primary-action').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', downloadHandler.downloadFile);
    });

    document.querySelectorAll('.copy-preview').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', copyHandler.handleCopyClick);
    });
}

export default {
    attachEventListeners
};
