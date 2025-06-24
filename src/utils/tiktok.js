/**
 * TikTok Events API Utility
 * Provides easy-to-use functions for tracking TikTok events from the frontend
 */

/**
 * Track a TikTok event via the server-side Events API
 * @param {string} eventName - The name of the event to track
 * @param {Object} userData - User data for the event
 * @param {Object} customData - Custom data for the event
 * @param {string} eventId - Optional event ID for deduplication
 * @returns {Promise<Object>} Response from the API
 */
export async function trackTikTokEvent(eventName, userData = {}, customData = {}, eventId = null) {
  try {
    const response = await fetch('/api/tiktok-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        userData,
        customData,
        eventId
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('TikTok event tracking failed:', result);
      return { success: false, error: result.error };
    }

    console.log('TikTok event tracked successfully:', result);
    return result;
  } catch (error) {
    console.error('Error tracking TikTok event:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Track ViewContent event
 * @param {Object} userData - User data
 * @param {Object} options - Event options
 */
export async function trackTikTokViewContent(userData = {}, options = {}) {
  const customData = {
    content_type: options.contentType || 'page',
    content_name: options.contentName || document.title,
    content_id: options.contentId || window.location.pathname,
    content_category: options.contentCategory || 'website',
    value: options.value || 0,
    currency: options.currency || 'SAR',
    url: options.url || window.location.href,
    ...options.customData
  };

  return await trackTikTokEvent('ViewContent', userData, customData);
}

/**
 * Track Search event
 * @param {string} searchString - The search query
 * @param {Object} userData - User data
 * @param {Object} options - Event options
 */
export async function trackTikTokSearch(searchString, userData = {}, options = {}) {
  const customData = {
    search_string: searchString,
    content_type: options.contentType || 'search',
    content_name: options.contentName || `Search: ${searchString}`,
    content_id: options.contentId || 'search',
    value: options.value || 0,
    currency: options.currency || 'SAR',
    url: options.url || window.location.href,
    ...options.customData
  };

  return await trackTikTokEvent('Search', userData, customData);
}

/**
 * Track ClickButton event
 * @param {string} buttonName - The button name or ID
 * @param {Object} userData - User data
 * @param {Object} options - Event options
 */
export async function trackTikTokClickButton(buttonName, userData = {}, options = {}) {
  const customData = {
    content_type: options.contentType || 'button',
    content_name: options.contentName || buttonName,
    content_id: options.contentId || buttonName.toLowerCase().replace(/\s+/g, '_'),
    value: options.value || 0,
    currency: options.currency || 'SAR',
    url: options.url || window.location.href,
    ...options.customData
  };

  return await trackTikTokEvent('ClickButton', userData, customData);
}

/**
 * Track Lead event
 * @param {Object} userData - User data
 * @param {Object} options - Event options
 */
export async function trackTikTokLead(userData = {}, options = {}) {
  const customData = {
    content_type: options.contentType || 'lead',
    content_name: options.contentName || 'Lead Form Submission',
    content_id: options.contentId || 'lead_form',
    content_category: options.contentCategory || 'form_submission',
    value: options.value || 0,
    currency: options.currency || 'SAR',
    price: options.price || options.value || 0,
    description: options.description || 'Lead form submission',
    url: options.url || window.location.href,
    ...options.customData
  };

  return await trackTikTokEvent('Lead', userData, customData);
}

/**
 * Track Purchase event
 * @param {Object} userData - User data
 * @param {Object} options - Event options
 */
export async function trackTikTokPurchase(userData = {}, options = {}) {
  const customData = {
    content_type: options.contentType || 'purchase',
    content_name: options.contentName || 'Purchase',
    content_id: options.contentId || 'purchase',
    value: options.value || 0,
    currency: options.currency || 'SAR',
    order_id: options.orderId || options.order_id,
    content_ids: options.contentIds || options.content_ids || [],
    url: options.url || window.location.href,
    ...options.customData
  };

  return await trackTikTokEvent('Purchase', userData, customData);
}

/**
 * Track CompleteRegistration event
 * @param {Object} userData - User data
 * @param {Object} options - Event options
 */
export async function trackTikTokCompleteRegistration(userData = {}, options = {}) {
  const customData = {
    content_type: options.contentType || 'registration',
    content_name: options.contentName || 'Registration Complete',
    content_id: options.contentId || 'registration',
    value: options.value || 0,
    currency: options.currency || 'SAR',
    url: options.url || window.location.href,
    ...options.customData
  };

  return await trackTikTokEvent('CompleteRegistration', userData, customData);
}

/**
 * Get user data from various sources (localStorage, URL params, etc.)
 * @returns {Object} User data object
 */
export function getTikTokUserData() {
  const userData = {};

  try {
    // Get data from localStorage
    if (typeof localStorage !== 'undefined') {
      const profile = localStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        if (parsedProfile.email) userData.email = parsedProfile.email;
        if (parsedProfile.phone) userData.phone = parsedProfile.phone;
        if (parsedProfile.firstName) userData.firstName = parsedProfile.firstName;
        if (parsedProfile.external_id) userData.external_id = parsedProfile.external_id;
      }
    }

    // Get data from URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('email')) userData.email = urlParams.get('email');
      if (urlParams.get('phone')) userData.phone = urlParams.get('phone');
      if (urlParams.get('firstName')) userData.firstName = urlParams.get('firstName');
      if (urlParams.get('external_id')) userData.external_id = urlParams.get('external_id');
      if (urlParams.get('ttclid')) userData.ttclid = urlParams.get('ttclid');
      if (urlParams.get('ttp')) userData.ttp = urlParams.get('ttp');

      // Add page context
      userData.url = window.location.href;
      userData.page_url = window.location.href;
      userData.user_agent = navigator.userAgent;
    }
  } catch (error) {
    console.warn('Error getting TikTok user data:', error);
  }

  return userData;
}

/**
 * Initialize TikTok tracking with automatic page view
 */
export function initializeTikTokTracking() {
  try {
    // Track page view automatically
    const userData = getTikTokUserData();
    
    // Only track if we have some user data or if it's a significant page
    const shouldTrack = Object.keys(userData).length > 2 || // Has more than just url and user_agent
                       window.location.pathname.includes('/thank-you') ||
                       window.location.pathname.includes('/trip') ||
                       window.location.pathname.includes('/destination');

    if (shouldTrack) {
      trackTikTokViewContent(userData, {
        contentType: 'page',
        contentName: document.title,
        contentId: window.location.pathname
      });
    }
  } catch (error) {
    console.warn('Error initializing TikTok tracking:', error);
  }
}

// Auto-initialize on page load if in browser environment
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTikTokTracking);
  } else {
    // Page already loaded
    setTimeout(initializeTikTokTracking, 1000);
  }
} 