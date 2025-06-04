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

// Track Snapchat PAGE_VIEW event with enhanced data
export async function trackSnapchatPageView(options = {}) {
  if (typeof window === 'undefined' || !window.snaptr) {
    console.warn('Snapchat pixel (snaptr) not available for PAGE_VIEW tracking');
    return false;
  }
  
  try {
    const userData = await prepareSnapchatUserData(options.userData || {});
    
    const pageViewData = {
      ...userData,
      ...(options.item_ids && { item_ids: options.item_ids }),
      ...(options.item_category && { item_category: options.item_category })
    };
    
    // Fire the enhanced PAGE_VIEW event
    window.snaptr('track', 'PAGE_VIEW', pageViewData);
    
    console.log('Snapchat PAGE_VIEW tracked successfully:', {
      event_name: 'PAGE_VIEW',
      has_user_data: Object.keys(userData).length > 0,
      item_ids: options.item_ids || null,
      item_category: options.item_category || null
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking Snapchat PAGE_VIEW:', error);
    return false;
  }
}

// Track Snapchat VIEW_CONTENT event
export async function trackSnapchatViewContent(options = {}) {
  if (typeof window === 'undefined' || !window.snaptr) {
    console.warn('Snapchat pixel (snaptr) not available for VIEW_CONTENT tracking');
    return false;
  }
  
  try {
    const userData = await prepareSnapchatUserData(options.userData || {});
    
    const viewContentData = {
      ...userData,
      ...(options.price && { price: options.price }),
      ...(options.currency && { currency: options.currency }),
      ...(options.item_ids && { item_ids: options.item_ids }),
      ...(options.item_category && { item_category: options.item_category })
    };
    
    // Fire the VIEW_CONTENT event
    window.snaptr('track', 'VIEW_CONTENT', viewContentData);
    
    console.log('Snapchat VIEW_CONTENT tracked successfully:', {
      event_name: 'VIEW_CONTENT',
      price: options.price || null,
      currency: options.currency || null,
      item_ids: options.item_ids || null,
      item_category: options.item_category || null,
      has_user_data: Object.keys(userData).length > 0
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking Snapchat VIEW_CONTENT:', error);
    return false;
  }
}

// Track Snapchat CUSTOM_EVENT_1 (for conversions)
export async function trackSnapchatCustomEvent(eventName = 'CUSTOM_EVENT_1', options = {}) {
  if (typeof window === 'undefined' || !window.snaptr) {
    console.warn('Snapchat pixel (snaptr) not available for custom event tracking');
    return false;
  }
  
  try {
    const userData = await prepareSnapchatUserData(options.userData || {});
    
    const customEventData = {
      ...userData,
      ...(options.price && { price: options.price }),
      ...(options.currency && { currency: options.currency }),
      ...(options.item_ids && { item_ids: options.item_ids }),
      ...(options.item_category && { item_category: options.item_category })
    };
    
    // Fire the custom event
    window.snaptr('track', eventName, customEventData);
    
    console.log(`Snapchat ${eventName} tracked successfully:`, {
      event_name: eventName,
      has_user_data: Object.keys(userData).length > 0,
      additional_data: Object.keys(options).filter(key => key !== 'userData')
    });
    
    return true;
  } catch (error) {
    console.error(`Error tracking Snapchat ${eventName}:`, error);
    return false;
  }
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