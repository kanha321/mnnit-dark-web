/**
 * Utility functions to format dates consistently across the application
 */

/**
 * Format date as "day dd-MM" (e.g., "Mon 25-07")
 * @param {Date|string|number} date - Date object or timestamp
 * @return {string} Formatted date string
 */
function formatModifiedDate(date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Get day name (first 3 letters)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[dateObj.getDay()];
    
    // Format day and month with leading zeros if needed
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    
    return `${dayName} ${day}-${month}`;
}

export default {
    formatModifiedDate
};
