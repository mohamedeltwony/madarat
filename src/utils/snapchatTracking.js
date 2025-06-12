// Helper function to hash data using SHA-256
async function sha256(str) {
  if (!str || typeof str !== 'string') return null;
  try {
    const buffer = new TextEncoder().encode(str.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  } catch (error) {
    console.error('SHA-256 Hashing Error:', error);
    return null;
  }
}

// Format phone number for Snapchat (add country code for Saudi numbers)
function formatPhoneForSnapchat(phone) {
  if (!phone) return null;
  
  let formattedPhone = phone.replace(/\D/g, '');
  if (formattedPhone.startsWith('5') && formattedPhone.length === 9) {
    formattedPhone = '966' + formattedPhone; // Add Saudi Arabia country code
  }
  return '+' + formattedPhone;
}

// Generate event ID for pixel/CAPI deduplication
export function generateSnapchatEventId(eventName, userData = {}) {
  const timestamp = Date.now();
  const userIdentifier = userData.email || userData.phone || userData.external_id || 'anonymous';
  
  // Create a simple hash for event ID
  let hash = 0;
  const str = `${eventName}_${userIdentifier}_${timestamp}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `sc_${Math.abs(hash).toString(16).substring(0, 12)}_${timestamp.toString(36)}`;
}

// Get Snapchat tracking parameters from URL and cookies
export function getSnapchatTrackingParams() {
  if (typeof window === 'undefined') return {};
  
  const params = {};
  
  try {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Snapchat Click ID from URL
    if (urlParams.get('sc_click_id')) {
      params.sc_click_id = urlParams.get('sc_click_id');
    }
    
    // Get Snapchat cookie (scID)
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'scid' || name === 'sc_cookie1') {
        params.sc_cookie1 = value;
        break;
      }
    }
    
    // Try to get from localStorage as fallback
    if (!params.sc_cookie1) {
      const storedScid = localStorage.getItem('scid');
      if (storedScid) {
        params.sc_cookie1 = storedScid;
      }
    }
    
  } catch (error) {
    console.warn('Error getting Snapchat tracking parameters:', error);
  }
  
  return params;
}

// Send event to Snapchat CAPI (server-side)
export async function sendToSnapchatCAPI(eventName, userData, customData = {}, eventId = null) {
  if (typeof window === 'undefined') return { success: false, error: 'Server-side only' };
  
  try {
    // Validate required data before sending
    if (!eventName || typeof eventName !== 'string') {
      console.warn('Snapchat CAPI: Invalid event name, skipping CAPI call');
      return { success: false, error: 'Invalid event name' };
    }

    // Check if we have any meaningful user data
    const hasValidUserData = userData && (
      userData.email ||
      userData.phone ||
      userData.user_email ||
      userData.user_phone_number ||
      userData.external_id ||
      userData.uuid_c1
    );

    if (!hasValidUserData) {
      console.warn('Snapchat CAPI: No valid user data found, skipping CAPI call for:', eventName);
      // Don't make the call but don't treat it as an error either
      return { success: true, skipped: true, reason: 'No valid user data' };
    }

    // Generate event ID if not provided
    const finalEventId = eventId || generateSnapchatEventId(eventName, userData);
    
    // Get Snapchat tracking parameters
    const trackingParams = getSnapchatTrackingParams();
    
    // Prepare the payload
    const payload = {
      eventName,
      eventId: finalEventId,
      actionSource: 'website',
      userData: {
        ...userData,
        ...trackingParams,
        event_source_url: window.location.href,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        // Add geographic defaults for Saudi Arabia
        country: userData.country || 'SA',
        state: userData.state || userData.region || 'Riyadh',
        city: userData.city || 'Riyadh'
      },
      customData: {
        ...customData,
        event_id: finalEventId
      }
    };
    
    // Send to our API endpoint
    const response = await fetch('/api/snapchat-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('Snapchat CAPI error:', errorData);
      return { success: false, error: errorData.error, eventId: finalEventId };
    }
    
    const result = await response.json();
    console.log('Snapchat CAPI event sent successfully:', {
      event_name: eventName,
      event_id: finalEventId
    });
    
    return { success: true, eventId: finalEventId, response: result };
    
  } catch (error) {
    console.error('Error sending to Snapchat CAPI:', error);
    return { success: false, error: error.message };
  }
}

// Prepare user data for Snapchat events
export async function prepareSnapchatUserData(userData = {}) {
  const snapchatData = {};
  
  // Basic user data
  if (userData.email) {
    snapchatData.user_email = userData.email;
    snapchatData.user_hashed_email = await sha256(userData.email);
  }
  
  if (userData.phone) {
    snapchatData.user_phone_number = formatPhoneForSnapchat(userData.phone);
    snapchatData.user_hashed_phone_number = await sha256(formatPhoneForSnapchat(userData.phone));
  }
  
  if (userData.firstName) {
    snapchatData.firstname = userData.firstName;
  }
  
  // Geographic data (default to Saudi Arabia)
  snapchatData.geo_country = userData.geo_country || 'SA';
  snapchatData.geo_region = userData.geo_region || 'Riyadh';
  snapchatData.geo_city = userData.geo_city || 'Riyadh';
  
  // UUID for tracking
  if (userData.uuid_c1 || userData.external_id) {
    snapchatData.uuid_c1 = userData.uuid_c1 || userData.external_id;
  }
  
  return snapchatData;
}

// Track Snapchat PAGE_VIEW event with both pixel and CAPI
export async function trackSnapchatPageView(options = {}) {
  const eventName = 'PAGE_VIEW';
  let pixelSuccess = false;
  let capiSuccess = false;
  
  // Generate event ID for deduplication
  const eventId = generateSnapchatEventId(eventName, options.userData);
  
  // 1. Send pixel event (client-side)
  if (typeof window !== 'undefined' && window.snaptr) {
    try {
      const userData = await prepareSnapchatUserData(options.userData || {});
      
      const pageViewData = {
        ...userData,
        ...(options.item_ids && { item_ids: options.item_ids }),
        ...(options.item_category && { item_category: options.item_category }),
        event_id: eventId // Add event ID for deduplication
      };
      
      // Fire the enhanced PAGE_VIEW event
      window.snaptr('track', eventName, pageViewData);
      pixelSuccess = true;
      
      console.log('Snapchat PAGE_VIEW pixel tracked successfully:', {
        event_name: eventName,
        event_id: eventId,
        has_user_data: Object.keys(userData).length > 0,
        item_ids: options.item_ids || null,
        item_category: options.item_category || null
      });
      
    } catch (error) {
      console.error('Error tracking Snapchat PAGE_VIEW pixel:', error);
    }
  } else {
    console.warn('Snapchat pixel (snaptr) not available for PAGE_VIEW tracking');
  }
  
  // 2. Send CAPI event (server-side) - only if explicitly enabled or has meaningful user data
  if (options.enableCAPI || (options.userData && (options.userData.email || options.userData.phone || options.userData.external_id))) {
    try {
      const capiResult = await sendToSnapchatCAPI(
        eventName,
        options.userData || {},
        {
          content_ids: options.item_ids,
          content_category: options.item_category
        },
        eventId
      );
      capiSuccess = capiResult.success;
    } catch (error) {
      console.error('Error sending PAGE_VIEW to Snapchat CAPI:', error);
    }
  } else {
    console.log('Skipping PAGE_VIEW CAPI call - no enableCAPI flag or meaningful user data');
  }
  
  return { pixelSuccess, capiSuccess, eventId };
}

// Track Snapchat VIEW_CONTENT event with both pixel and CAPI
export async function trackSnapchatViewContent(options = {}) {
  const eventName = 'VIEW_CONTENT';
  let pixelSuccess = false;
  let capiSuccess = false;
  
  // Generate event ID for deduplication
  const eventId = generateSnapchatEventId(eventName, options.userData);
  
  // 1. Send pixel event (client-side)
  if (typeof window !== 'undefined' && window.snaptr) {
    try {
      const userData = await prepareSnapchatUserData(options.userData || {});
      
      const viewContentData = {
        ...userData,
        ...(options.price && { price: options.price }),
        ...(options.currency && { currency: options.currency }),
        ...(options.item_ids && { item_ids: options.item_ids }),
        ...(options.item_category && { item_category: options.item_category }),
        event_id: eventId // Add event ID for deduplication
      };
      
      // Fire the VIEW_CONTENT event
      window.snaptr('track', eventName, viewContentData);
      pixelSuccess = true;
      
      console.log('Snapchat VIEW_CONTENT pixel tracked successfully:', {
        event_name: eventName,
        event_id: eventId,
        price: options.price || null,
        currency: options.currency || null,
        item_ids: options.item_ids || null,
        item_category: options.item_category || null,
        has_user_data: Object.keys(userData).length > 0
      });
      
    } catch (error) {
      console.error('Error tracking Snapchat VIEW_CONTENT pixel:', error);
    }
  } else {
    console.warn('Snapchat pixel (snaptr) not available for VIEW_CONTENT tracking');
  }
  
  // 2. Send CAPI event (server-side) - only if explicitly enabled or has meaningful user data
  if (options.enableCAPI || (options.userData && (options.userData.email || options.userData.phone || options.userData.external_id))) {
    try {
      const capiResult = await sendToSnapchatCAPI(
        eventName,
        options.userData || {},
        {
          value: options.price,
          currency: options.currency,
          content_ids: options.item_ids,
          content_category: options.item_category,
          content_name: options.content_name
        },
        eventId
      );
      capiSuccess = capiResult.success;
    } catch (error) {
      console.error('Error sending VIEW_CONTENT to Snapchat CAPI:', error);
    }
  } else {
    console.log('Skipping VIEW_CONTENT CAPI call - no enableCAPI flag or meaningful user data');
  }
  
  return { pixelSuccess, capiSuccess, eventId };
}

// Track Snapchat CUSTOM_EVENT_1 (for conversions) with both pixel and CAPI
export async function trackSnapchatCustomEvent(eventName = 'CUSTOM_EVENT_1', options = {}) {
  let pixelSuccess = false;
  let capiSuccess = false;
  
  // Generate event ID for deduplication
  const eventId = generateSnapchatEventId(eventName, options.userData);
  
  // 1. Send pixel event (client-side)
  if (typeof window !== 'undefined' && window.snaptr) {
    try {
      const userData = await prepareSnapchatUserData(options.userData || {});
      
      const customEventData = {
        ...userData,
        ...(options.price && { price: options.price }),
        ...(options.currency && { currency: options.currency }),
        ...(options.item_ids && { item_ids: options.item_ids }),
        ...(options.item_category && { item_category: options.item_category }),
        event_id: eventId // Add event ID for deduplication
      };
      
      // Fire the custom event
      window.snaptr('track', eventName, customEventData);
      pixelSuccess = true;
      
      console.log(`Snapchat ${eventName} pixel tracked successfully:`, {
        event_name: eventName,
        event_id: eventId,
        has_user_data: Object.keys(userData).length > 0,
        additional_data: Object.keys(options).filter(key => key !== 'userData')
      });
      
    } catch (error) {
      console.error(`Error tracking Snapchat ${eventName} pixel:`, error);
    }
  } else {
    console.warn(`Snapchat pixel (snaptr) not available for ${eventName} tracking`);
  }
  
  // 2. Send CAPI event (server-side) - only if explicitly enabled or has meaningful user data
  if (options.enableCAPI || (options.userData && (options.userData.email || options.userData.phone || options.userData.external_id))) {
    try {
      const capiResult = await sendToSnapchatCAPI(
        eventName,
        options.userData || {},
        {
          value: options.price,
          currency: options.currency,
          content_ids: options.item_ids,
          content_category: options.item_category,
          order_id: options.transaction_id || options.order_id,
          content_name: options.content_name
        },
        eventId
      );
      capiSuccess = capiResult.success;
    } catch (error) {
      console.error(`Error sending ${eventName} to Snapchat CAPI:`, error);
    }
  } else {
    console.log(`Skipping ${eventName} CAPI call - no enableCAPI flag or meaningful user data`);
  }
  
  return { pixelSuccess, capiSuccess, eventId };
}

// Track ADD_CART event
export async function trackSnapchatAddCart(options = {}) {
  return await trackSnapchatCustomEvent('ADD_CART', options);
}

// Track SIGN_UP event
export async function trackSnapchatSignUp(options = {}) {
  return await trackSnapchatCustomEvent('SIGN_UP', options);
}

// Track PURCHASE event
export async function trackSnapchatPurchase(options = {}) {
  return await trackSnapchatCustomEvent('PURCHASE', options);
}

// Get user data from various sources (localStorage, cookies, URL params)
export function getUserDataFromSources(router = null) {
  const userData = {};
  
  // From URL parameters (if router is provided)
  if (router && router.query) {
    userData.email = router.query.email || null;
    userData.phone = router.query.phone || null;
    userData.firstName = router.query.firstName || null;
    userData.lastName = router.query.lastName || null;
    userData.external_id = router.query.external_id || null;
  }
  
  // From localStorage (if available)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        userData.email = userData.email || profile.email;
        userData.phone = userData.phone || profile.phone;
        userData.firstName = userData.firstName || profile.firstName;
        userData.lastName = userData.lastName || profile.lastName;
      }
    } catch (error) {
      console.warn('Error reading user profile from localStorage:', error);
    }
  }
  
  // Generate UUID if we have external_id or create timestamp-based one
  userData.uuid_c1 = userData.external_id || `user_${Date.now()}`;
  
  return userData;
}

// Store trip page visit for later price detection
export function storeLastVisitedTrip(tripId) {
  if (typeof window !== 'undefined' && window.localStorage && tripId) {
    try {
      const tripData = {
        tripId: tripId,
        timestamp: Date.now(),
        url: window.location.href,
        pathname: window.location.pathname
      };
      
      localStorage.setItem('lastVisitedTrip', JSON.stringify(tripData));
      console.log('Last visited trip stored for dynamic pricing:', tripId);
    } catch (error) {
      console.warn('Error storing last visited trip:', error);
    }
  }
} 