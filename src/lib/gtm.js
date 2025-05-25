/**
 * Google Tag Manager Utilities
 * Handles GTM events and page view tracking for Next.js
 */

// GTM Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5PQ58CMB';

/**
 * Send page view event to GTM
 * @param {Object} data - Additional data to send with page view
 */
export const gtmPageView = (data = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      url: window.location.href,
      page_title: document.title,
      page_path: window.location.pathname,
      ...data,
    });
  }
};

/**
 * Send custom event to GTM
 * @param {Object} eventData - Event data to send
 */
export const sendGTMEvent = (eventData) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData);
  }
};

/**
 * Initialize GTM dataLayer if it doesn't exist
 */
export const initializeDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

/**
 * Track form submission
 * @param {string} formName - Name of the form
 * @param {Object} additionalData - Additional data to track
 */
export const trackFormSubmission = (formName, additionalData = {}) => {
  sendGTMEvent({
    event: 'form_submit',
    form_name: formName,
    ...additionalData,
  });
};

/**
 * Track button click
 * @param {string} buttonName - Name/ID of the button
 * @param {Object} additionalData - Additional data to track
 */
export const trackButtonClick = (buttonName, additionalData = {}) => {
  sendGTMEvent({
    event: 'button_click',
    button_name: buttonName,
    ...additionalData,
  });
};

/**
 * Track trip booking event
 * @param {Object} tripData - Trip booking data
 */
export const trackTripBooking = (tripData = {}) => {
  sendGTMEvent({
    event: 'trip_booking',
    trip_name: tripData.tripName || '',
    trip_destination: tripData.destination || '',
    trip_price: tripData.price || '',
    trip_duration: tripData.duration || '',
    ...tripData,
  });
};

/**
 * Track search event
 * @param {string} searchTerm - Search term used
 * @param {number} resultsCount - Number of results returned
 */
export const trackSearch = (searchTerm, resultsCount = 0) => {
  sendGTMEvent({
    event: 'search',
    search_term: searchTerm,
    search_results_count: resultsCount,
  });
}; 