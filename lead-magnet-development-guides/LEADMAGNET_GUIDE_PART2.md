# 🚀 Lead Magnet Development Guide - Part 2

## 📊 GTM & Tracking Utilities

### `src/lib/gtm.js` - Google Tag Manager Utilities

```javascript
/**
 * Google Tag Manager Utilities
 * Replace GTM_ID and BRAND_NAME with your values
 */

// GTM Configuration - Replace with your GTM ID
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';
export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || 'YOUR_BRAND';

/**
 * Initialize dataLayer if it doesn't exist
 */
export const initializeDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

/**
 * Send custom event to GTM with enhanced user data
 */
export const sendGTMEvent = async (eventData) => {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('GTM dataLayer not available');
    return;
  }

  try {
    // Generate unique event ID for deduplication
    const eventId = eventData.event_id || crypto.randomUUID();
    
    // Enhanced event data with user identification
    const enhancedEventData = {
      ...eventData,
      event_id: eventId,
      brand_name: BRAND_NAME,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
      page_path: window.location.pathname,
      
      // User agent data
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      
      // UTM parameters if available
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      utm_content: new URLSearchParams(window.location.search).get('utm_content'),
      utm_term: new URLSearchParams(window.location.search).get('utm_term'),
    };

    // Push to dataLayer
    window.dataLayer.push(enhancedEventData);
    
    console.log('GTM event sent:', {
      event: enhancedEventData.event,
      event_id: eventId,
      brand: BRAND_NAME
    });

  } catch (error) {
    console.error('Error sending GTM event:', error);
    // Fallback to basic event
    window.dataLayer.push(eventData);
  }
};

/**
 * Track form submission with pixel events
 */
export const trackFormSubmission = async (formName, formData = {}) => {
  try {
    const eventId = crypto.randomUUID();
    
    // Send to GTM
    await sendGTMEvent({
      event: 'form_submit',
      form_name: formName,
      event_id: eventId,
      ...formData
    });

    // Track Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: formName,
        value: formData.value || 1,
        currency: 'USD'
      }, { eventID: eventId });
    }

    // Track Snapchat Pixel
    if (typeof window !== 'undefined' && window.snaptr) {
      window.snaptr('track', 'SIGN_UP', {
        user_email: formData.email,
        user_phone_number: formData.phone
      });
    }

    // Track TikTok Pixel
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('CompleteRegistration', {
        content_type: 'lead',
        content_id: formName,
        value: formData.value || 1,
        currency: 'USD'
      });
    }

  } catch (error) {
    console.error('Error tracking form submission:', error);
  }
};

/**
 * Track page view with all pixels
 */
export const trackPageView = (pageData = {}) => {
  try {
    // GTM Page View
    sendGTMEvent({
      event: 'page_view',
      page_category: pageData.category || 'general',
      ...pageData
    });

    // Facebook Pixel Page View
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }

    // Snapchat Pixel Page View
    if (typeof window !== 'undefined' && window.snaptr) {
      window.snaptr('track', 'PAGE_VIEW');
    }

    // TikTok Pixel Page View
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.page();
    }

  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

/**
 * Track button click
 */
export const trackButtonClick = (buttonName, additionalData = {}) => {
  sendGTMEvent({
    event: 'button_click',
    button_name: buttonName,
    ...additionalData,
  });
};
```

### `src/lib/pixelTracking.js` - Pixel Event Utilities

```javascript
/**
 * Centralized pixel tracking utilities
 * Replace PIXEL_IDs with your actual values
 */

// Pixel Configuration - Replace with your pixel IDs
const PIXEL_CONFIG = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  snapchat: process.env.SNAPCHAT_PIXEL_ID,
  tiktok: process.env.TIKTOK_PIXEL_ID,
  brand: process.env.NEXT_PUBLIC_BRAND_NAME || 'YOUR_BRAND'
};

/**
 * Hash user data for privacy compliance
 */
const hashUserData = (data) => {
  // In production, implement proper hashing
  // For now, return as-is (pixels handle hashing automatically)
  return data;
};

/**
 * Normalize phone number for pixel tracking
 */
const normalizePhone = (phone) => {
  if (!phone) return null;
  return phone.replace(/[^0-9]/g, '');
};

/**
 * Send Facebook Pixel Event
 */
export const sendFacebookEvent = (eventName, userData = {}, customData = {}, eventId = null) => {
  try {
    if (typeof window === 'undefined' || !window.fbq) {
      console.warn('Facebook Pixel not loaded');
      return;
    }

    const processedUserData = {
      em: userData.email || null,
      ph: normalizePhone(userData.phone),
      fn: userData.firstName || null,
      ln: userData.lastName || null,
      country: userData.country || null,
      st: userData.state || null,
      ct: userData.city || null
    };

    // Remove null values
    Object.keys(processedUserData).forEach(key => {
      if (processedUserData[key] === null) {
        delete processedUserData[key];
      }
    });

    const eventData = {
      ...customData,
      brand: PIXEL_CONFIG.brand
    };

    const eventOptions = eventId ? { eventID: eventId } : {};

    window.fbq('track', eventName, eventData, eventOptions);
    
    console.log(`Facebook Pixel ${eventName} tracked`, { eventId, hasUserData: Object.keys(processedUserData).length > 0 });

  } catch (error) {
    console.error('Facebook Pixel tracking error:', error);
  }
};

/**
 * Send Snapchat Pixel Event
 */
export const sendSnapchatEvent = (eventName, userData = {}, customData = {}) => {
  try {
    if (typeof window === 'undefined' || !window.snaptr) {
      console.warn('Snapchat Pixel not loaded');
      return;
    }

    const eventData = {
      user_email: userData.email || null,
      user_phone_number: normalizePhone(userData.phone),
      ...customData,
      brand: PIXEL_CONFIG.brand
    };

    // Remove null values
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === null) {
        delete eventData[key];
      }
    });

    window.snaptr('track', eventName, eventData);
    
    console.log(`Snapchat Pixel ${eventName} tracked`);

  } catch (error) {
    console.error('Snapchat Pixel tracking error:', error);
  }
};

/**
 * Send TikTok Pixel Event
 */
export const sendTikTokEvent = (eventName, userData = {}, customData = {}) => {
  try {
    if (typeof window === 'undefined' || !window.ttq) {
      console.warn('TikTok Pixel not loaded');
      return;
    }

    const eventData = {
      email: userData.email || null,
      phone_number: normalizePhone(userData.phone),
      ...customData,
      brand: PIXEL_CONFIG.brand
    };

    // Remove null values
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === null) {
        delete eventData[key];
      }
    });

    window.ttq.track(eventName, eventData);
    
    console.log(`TikTok Pixel ${eventName} tracked`);

  } catch (error) {
    console.error('TikTok Pixel tracking error:', error);
  }
};

/**
 * Send event to all pixels
 */
export const sendAllPixelEvents = (eventName, userData = {}, customData = {}, eventId = null) => {
  // Map event names for different platforms
  const eventMap = {
    lead: {
      facebook: 'Lead',
      snapchat: 'SIGN_UP',
      tiktok: 'CompleteRegistration'
    },
    pageview: {
      facebook: 'PageView',
      snapchat: 'PAGE_VIEW',
      tiktok: 'ViewContent'
    },
    initiate: {
      facebook: 'InitiateCheckout',
      snapchat: 'START_CHECKOUT',
      tiktok: 'InitiateCheckout'
    }
  };

  const events = eventMap[eventName] || {
    facebook: eventName,
    snapchat: eventName,
    tiktok: eventName
  };

  // Send to all pixels
  sendFacebookEvent(events.facebook, userData, customData, eventId);
  sendSnapchatEvent(events.snapchat, userData, customData);
  sendTikTokEvent(events.tiktok, userData, customData);
};
```

### `src/utils/userIdentification.js` - User Tracking Utilities

```javascript
/**
 * User identification and tracking utilities
 */

/**
 * Generate unique user ID
 */
export const generateUserId = () => {
  return 'user_' + crypto.randomUUID();
};

/**
 * Save user profile to localStorage
 */
export const saveUserProfile = async (userData) => {
  try {
    if (typeof window === 'undefined') return;

    const existingProfile = localStorage.getItem('userProfile');
    const profile = existingProfile ? JSON.parse(existingProfile) : {};

    const updatedProfile = {
      ...profile,
      ...userData,
      lastUpdated: new Date().toISOString(),
      userId: profile.userId || generateUserId()
    };

    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    console.log('User profile saved:', { userId: updatedProfile.userId });

  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

/**
 * Get user tracking data
 */
export const getUserTrackingData = async () => {
  try {
    if (typeof window === 'undefined') {
      return { user_id: null, is_returning_user: false };
    }

    const profile = localStorage.getItem('userProfile');
    if (!profile) {
      return { user_id: null, is_returning_user: false };
    }

    const userData = JSON.parse(profile);
    return {
      user_id: userData.userId,
      is_returning_user: true,
      email: userData.email || null,
      phone: userData.phone || null,
      name: userData.name || null,
      lastUpdated: userData.lastUpdated
    };

  } catch (error) {
    console.error('Error getting user tracking data:', error);
    return { user_id: null, is_returning_user: false };
  }
};

/**
 * Get user data from URL parameters (for ad traffic)
 */
export const getUserDataFromURL = () => {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    email: urlParams.get('email'),
    phone: urlParams.get('phone'),
    name: urlParams.get('name'),
    firstName: urlParams.get('firstName'),
    lastName: urlParams.get('lastName'),
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_content: urlParams.get('utm_content'),
    utm_term: urlParams.get('utm_term')
  };
};
```

---

*Continue to Part 3 for complete form components and API implementations.* 