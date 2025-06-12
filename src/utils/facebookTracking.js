// Helper functions for Facebook tracking

// Hash data client-side when needed
async function sha256(str) {
  if (!str || typeof str !== 'string') return null;
  try {
    const buffer = new TextEncoder().encode(str.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('SHA-256 Hashing Error:', error);
    return null;
  }
}

// Get browser cookies and localStorage parameters
export const getFacebookParams = () => {
  if (typeof window === 'undefined') return {};
  
  // Get fbp (Facebook Browser ID from cookie)
  const getFbp = () => {
    const fbpCookie = document.cookie.split(';').find(c => c.trim().startsWith('_fbp='));
    if (fbpCookie) return fbpCookie.split('=')[1];
    return localStorage.getItem('_fbp') || '';
  };
  
  // Get fbc (Facebook Click ID from cookie or URL)
  const getFbc = () => {
    // First check cookie
    const fbcCookie = document.cookie.split(';').find(c => c.trim().startsWith('_fbc='));
    if (fbcCookie) return fbcCookie.split('=')[1];
    
    // Then check localStorage
    const storedFbc = localStorage.getItem('_fbc');
    if (storedFbc) return storedFbc;
    
    // Finally check URL for fbclid
    try {
      const url = new URL(window.location.href);
      const fbclid = url.searchParams.get('fbclid');
      if (fbclid) {
        const fbc = `fb.1.${Date.now()}.${fbclid}`;
        localStorage.setItem('_fbc', fbc);
        return fbc;
      }
    } catch (e) {
      // Ignore URL parsing errors
      console.debug('Error parsing URL for fbclid:', e);
    }
    
    return '';
  };
  
  return {
    fbp: getFbp(),
    fbc: getFbc(),
    external_id: localStorage.getItem('userId') || ''
  };
};

// Generate a consistent event ID for deduplication
export const generateEventId = (eventName, userData = {}) => {
  if (userData.event_id) return userData.event_id;
  
  // Create a unique but deterministic ID
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  
  // Include a hash of some user data if available for better traceability
  const userPart = userData.email || userData.phone || userData.external_id || '';
  
  return `${eventName}_${timestamp}_${randomPart}_${userPart.substring(0, 8)}`;
};

// Send Lead event on the client side
export const trackLeadEvent = async (userData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Get Facebook parameters
      const fbParams = getFacebookParams();
      
      // Standard metadata with complete fields
      const eventData = {
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        ...userData,
        ...fbParams
      };
      
      // Generate or use provided event ID for deduplication
      const eventId = generateEventId('lead', userData);
      
      // Hash data for client-side pixel (Facebook standard format)
      const pixelData = {};
      
      // Only include fields if they exist, using Facebook's standard parameter names
      if (userData.email) pixelData.em = await sha256(userData.email);
      if (userData.phone) pixelData.ph = await sha256(userData.phone.replace(/\D/g, ''));
      if (userData.firstName) pixelData.fn = await sha256(userData.firstName);
      if (userData.lastName) pixelData.ln = await sha256(userData.lastName);
      
      // Add non-PII data that doesn't need hashing
      pixelData.external_id = userData.external_id || fbParams.external_id || '';
      pixelData.fbc = userData.fbc || fbParams.fbc || '';
      pixelData.fbp = userData.fbp || fbParams.fbp || '';
      
      // Add advanced matching parameters (city, state, zip, country, etc.)
      if (userData.city) pixelData.ct = await sha256(userData.city);
      if (userData.state) pixelData.st = await sha256(userData.state);
      if (userData.zip) pixelData.zp = await sha256(userData.zip);
      if (userData.country) pixelData.country = await sha256(userData.country);
      if (userData.gender) pixelData.ge = await sha256(userData.gender);
      if (userData.dateOfBirth) pixelData.db = await sha256(userData.dateOfBirth);
      
      // For local development/testing, use test_event_code
      const pixelOptions = { eventID: eventId };
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        pixelOptions.test_event_code = process.env.NEXT_PUBLIC_FB_TEST_EVENT_CODE;
        console.log('Using test event code for local development');
      }
      
      // Log the debug data
      console.log('[Pixel] Tracking Lead event with data:', {
        ...pixelData,
        em: userData.email ? 'present (hashed)' : 'missing',
        ph: userData.phone ? 'present (hashed)' : 'missing',
        event_id: eventId
      });
      
      // Track the lead event with properly formatted data
      window.fbq('track', 'Lead', pixelData, pixelOptions);
      
      // Also send to server for Conversion API (send raw data, server will hash)
      sendToConversionAPI('Lead', eventData, eventId);
      
      return { success: true, eventId };
    } catch (error) {
      console.error('Error in trackLeadEvent:', error);
      return { success: false, error: error.message };
    }
  } else {
    console.warn('[Pixel] fbq not available - running in SSR or fbq not initialized');
    return { success: false, error: 'fbq not available' };
  }
};

// Send PageView event with enhanced parameters
export const trackPageView = async (extraParams = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Get Facebook parameters
      const fbParams = getFacebookParams();
      
      // Generate event ID for deduplication
      const eventId = generateEventId('pageview', extraParams);
      
      // Prepare pixel data
      const pixelData = {
        ...extraParams,
        external_id: extraParams.external_id || fbParams.external_id || '',
        fbc: extraParams.fbc || fbParams.fbc || '',
        fbp: extraParams.fbp || fbParams.fbp || ''
      };
      
      // For local development/testing, use test_event_code
      const pixelOptions = { eventID: eventId };
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        pixelOptions.test_event_code = process.env.NEXT_PUBLIC_FB_TEST_EVENT_CODE;
      }
      
      // Track PageView with properly formatted data
      window.fbq('track', 'PageView', pixelData, pixelOptions);
      
      // Also send to server for Conversion API
      const eventData = {
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        ...extraParams,
        ...fbParams
      };
      
      sendToConversionAPI('PageView', eventData, eventId);
      
      return { success: true, eventId };
    } catch (error) {
      console.error('Error in trackPageView:', error);
      return { success: false, error: error.message };
    }
  } else {
    return { success: false, error: 'fbq not available' };
  }
};

// Send event data to our API endpoint
const sendToConversionAPI = async (eventName, eventData, eventId) => {
  try {
    // Add FB parameters
    const fbp = localStorage.getItem('_fbp');
    const fbc = localStorage.getItem('_fbc');
    
    const payload = {
      eventName,
      eventId,
      userData: {
        ...eventData,
        fbp: eventData.fbp || fbp,
        fbc: eventData.fbc || fbc,
        user_agent: navigator.userAgent
      }
    };
    
    // Send to our API route
    const response = await fetch('/api/facebook-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.warn('Conversion API error (will continue with pixel only):', errorData);
    } else {
      const result = await response.json();
      if (result.skipped) {
        console.log('[Server] Conversion API call skipped:', result.reason);
      } else {
        console.log('[Server] Event sent to Conversion API successfully');
      }
    }
  } catch (error) {
    console.error('Error sending to Conversion API:', error);
  }
}; 