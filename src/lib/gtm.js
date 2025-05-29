/**
 * Google Tag Manager Utilities
 * Handles GTM events and page view tracking for Next.js
 */

import { getUserTrackingData, saveUserProfile } from '@/utils/userIdentification';

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
export const sendGTMEvent = async (eventData) => {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('GTM dataLayer not available');
    return;
  }

  try {
    // Get persistent user tracking data
    const userTrackingData = await getUserTrackingData();
    
    // Merge event data with persistent user data
    const enhancedEventData = {
      ...eventData,
      // Add persistent user identification
      persistent_user_id: userTrackingData.user_id,
      is_returning_user: userTrackingData.is_returning_user,
      visit_count: userTrackingData.visit_count,
      form_interactions_count: userTrackingData.form_interactions_count,
      
      // Add encrypted user data if available
      persistent_encrypted_email: userTrackingData.encrypted_email,
      persistent_encrypted_phone: userTrackingData.encrypted_phone,
      persistent_encrypted_name: userTrackingData.encrypted_name,
      
      // Add behavioral data
      user_interests: userTrackingData.interests,
      total_visits: userTrackingData.total_visits,
      total_form_submissions: userTrackingData.total_form_submissions,
      
      // Add classification data
      persistent_user_type: userTrackingData.user_type,
      persistent_nationality: userTrackingData.nationality,
      preferred_language: userTrackingData.preferred_language,
      
      // Add technical data
      device_fingerprint: userTrackingData.device_fingerprint,
      first_visit: userTrackingData.first_visit,
      last_visit: userTrackingData.last_visit,
      
      // Add Facebook tracking data
      persistent_fbp: userTrackingData.fbp,
      persistent_fbc: userTrackingData.fbc,
      
      // Add UTM data
      persistent_utm_source: userTrackingData.utm_source,
      persistent_utm_medium: userTrackingData.utm_medium,
      persistent_utm_campaign: userTrackingData.utm_campaign,
      persistent_utm_content: userTrackingData.utm_content,
      persistent_utm_term: userTrackingData.utm_term,
      
      // Add timestamp
      event_timestamp: new Date().toISOString()
    };

    // Push to dataLayer
    window.dataLayer.push(enhancedEventData);
    
    console.log('Enhanced GTM event sent:', {
      event: enhancedEventData.event,
      persistent_user_id: enhancedEventData.persistent_user_id,
      is_returning_user: enhancedEventData.is_returning_user,
      visit_count: enhancedEventData.visit_count,
      has_persistent_email: !!enhancedEventData.persistent_encrypted_email,
      has_persistent_phone: !!enhancedEventData.persistent_encrypted_phone
    });

  } catch (error) {
    console.error('Error sending enhanced GTM event:', error);
    // Fallback to original event data
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
export const trackFormSubmission = async (formName, formData = {}) => {
  try {
    // Save user profile data for persistence
    if (formData.email || formData.phone || formData.name || formData.nationality) {
      await saveUserProfile({
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        nationality: formData.nationality,
        user_type: formData.user_type,
        form_submission: true,
        form_name: formName,
        external_id: formData.external_id,
        event_id: formData.event_id,
        conversion_value: formData.conversion_value,
        trip_destination: formData.trip_destination
      });
    }

    // Send enhanced GTM event
    await sendGTMEvent({
      event: 'form_submit',
      form_name: formName,
      ...formData
    });

  } catch (error) {
    console.error('Error tracking form submission:', error);
  }
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