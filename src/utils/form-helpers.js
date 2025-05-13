// Utility functions for handling form submissions and partial data sending

/**
 * Sends partial form data to Zapier as user types
 * @param {Object} formData - Current form data
 * @param {String} formSource - Source identifier (e.g. 'bosnia-trip')
 * @param {String} formName - Form name (e.g. 'Bosnia Trip Form')
 * @param {Object} clientData - UTM parameters and client data
 * @param {String} fieldChanged - The field that just changed
 * @param {Number} debounceMs - Debounce time in milliseconds
 * @returns {Promise<Object>} - Response from the API
 */
export const sendPartialFormData = async (
  formData,
  formSource,
  formName,
  clientData = {},
  fieldChanged = null,
  debounceMs = 1000
) => {
  try {
    // Don't send if no meaningful data yet
    if (!formData || (
      !formData.name?.trim() && 
      !formData.phone?.trim() && 
      !formData.email?.trim()
    )) {
      return { success: false, reason: 'No meaningful data to send yet' };
    }

    // Create payload with metadata
    const now = new Date();
    const partialPayload = {
      ...formData,
      formSource,
      formName,
      isPartialSubmission: true,
      fieldChanged,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: now.toISOString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      externalId: crypto.randomUUID(),
      ...clientData
    };

    console.log('Sending partial data:', partialPayload);

    // Send the data to our API endpoint
    const response = await fetch('/api/zapier-partial-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partialPayload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending partial form data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * @param {Function} func - The function to debounce
 * @param {Number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}; 