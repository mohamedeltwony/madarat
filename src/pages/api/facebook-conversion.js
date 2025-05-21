import { createHash } from 'crypto';

// Environment variables needed:
// FB_ACCESS_TOKEN - Your Facebook access token
// FB_PIXEL_ID - Your Facebook pixel ID (330286163283402)
// FB_TEST_EVENT_CODE - Test event code for development environments

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  
  try {
    const { eventName, userData, eventId } = req.body;
    
    if (!eventName || !userData) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Log the incoming data for debugging (with sensitive data masked)
    console.log(`Processing ${eventName} server-side event with data:`, {
      email: userData.email ? `${userData.email.substring(0, 2)}***@${userData.email.split('@')[1] || ''}` : 'missing',
      phone: userData.phone ? `${userData.phone.substring(0, 2)}****${userData.phone.slice(-2) || ''}` : 'missing',
      external_id: userData.external_id || 'missing',
      fbp: userData.fbp ? 'present' : 'missing',
      fbc: userData.fbc ? 'present' : 'missing',
      event_id: eventId || 'missing'
    });
    
    // Get client IP address - try multiple headers for proxies
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                    req.headers['x-real-ip'] || 
                    req.headers['cf-connecting-ip'] || 
                    req.socket.remoteAddress || 
                    '127.0.0.1';
    
    // Process and normalize data before hashing
    const cleanedUserData = {
      email: userData.email ? userData.email.toLowerCase().trim() : undefined,
      phone: userData.phone ? userData.phone.replace(/\D/g, '') : undefined,
      firstName: userData.firstName ? userData.firstName.trim() : undefined,
      lastName: userData.lastName ? userData.lastName.trim() : undefined,
      name: userData.name ? userData.name.trim() : undefined,
      city: userData.city,
      state: userData.state,
      zipCode: userData.zipCode || userData.zip,
      country: userData.country,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth || userData.dob,
    };
    
    // If we have a name but no first/last name, split it
    if (cleanedUserData.name && (!cleanedUserData.firstName && !cleanedUserData.lastName)) {
      const nameParts = cleanedUserData.name.split(' ');
      cleanedUserData.firstName = nameParts[0];
      if (nameParts.length > 1) {
        cleanedUserData.lastName = nameParts.slice(1).join(' ');
      }
    }
    
    // Hash PII data
    const hashedData = hashUserData(cleanedUserData);
    
    // Use provided eventId or generate one
    const finalEventId = eventId || generateEventId(userData, eventName);
    
    // Prepare event for Conversion API - using Facebook's exact parameter naming
    const event = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: userData.event_source_url || req.headers.referer || '',
      action_source: 'website',
      user_data: {
        client_ip_address: clientIp,
        client_user_agent: userData.user_agent || req.headers['user-agent'],
        fbp: userData.fbp || req.cookies?._fbp || null,
        fbc: userData.fbc || req.cookies?._fbc || null,
        external_id: userData.external_id || null,
        ...hashedData
      },
      custom_data: {
        // Add any custom parameters here - use camelCase as Facebook prefers
        value: userData.value || 0,
        currency: userData.currency || 'SAR',
        content_name: userData.content_name || null,
        nationality: userData.nationality || null,
        // Add any additional metadata related to this specific lead/conversion
        device_type: getDeviceTypeFromUserAgent(userData.user_agent || req.headers['user-agent']),
        browser_language: req.headers['accept-language']?.split(',')[0] || null,
        form_id: userData.formId || userData.form_id || userData.formName || null,
        lead_event_source: userData.leadSource || userData.lead_event_source || 'website',
        page_location: userData.pageUrl || userData.page_url || userData.event_source_url || req.headers.referer || null,
      },
      event_id: finalEventId,
      // Add opt_out and data_processing_options parameters for GDPR/data regulation compliance
      opt_out: false,
      data_processing_options: [],
      data_processing_options_country: 0,
      data_processing_options_state: 0
    };
    
    // Add more standard fields that Facebook recognizes
    if (userData.content_category) event.custom_data.content_category = userData.content_category;
    if (userData.content_type) event.custom_data.content_type = userData.content_type;
    if (userData.content_ids) event.custom_data.content_ids = userData.content_ids;
    if (userData.num_items) event.custom_data.num_items = userData.num_items;
    if (userData.search_string) event.custom_data.search_string = userData.search_string;
    if (userData.status) event.custom_data.status = userData.status;
    if (userData.order_id) event.custom_data.order_id = userData.order_id;
    
    // Clean up undefined/null values
    cleanObject(event.user_data);
    cleanObject(event.custom_data);
    
    // Log what's being sent to Facebook
    console.log('Sending to Facebook CAPI:', {
      event_name: event.event_name,
      event_id: event.event_id,
      user_data_keys: Object.keys(event.user_data),
      em_present: !!event.user_data.em,
      ph_present: !!event.user_data.ph,
      external_id_present: !!event.user_data.external_id
    });
    
    // Determine if we need to use test event code
    let testEventCode;
    
    // Check for test mode based on multiple conditions
    const isTestMode = process.env.NODE_ENV === 'development' || 
      (userData.event_source_url && 
        (userData.event_source_url.includes('localhost') || 
         userData.event_source_url.includes('127.0.0.1'))) ||
      userData.test_mode === true;
    
    if (isTestMode) {
      testEventCode = process.env.FB_TEST_EVENT_CODE;
      console.log('Using test event code for development:', testEventCode);
    }
    
    // Get the access token and pixel ID from environment variables
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pixelId = process.env.FB_PIXEL_ID || '330286163283402';
    
    // Ensure we have an access token
    if (!accessToken) {
      console.error('Missing Facebook access token in environment variables!');
      return res.status(500).json({ error: 'Server configuration error - missing access token' });
    }
    
    // Make the API request to Facebook
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [event],
          test_event_code: testEventCode
        })
      }
    );
    
    const result = await response.json();
    
    if (result.error) {
      console.error('Facebook Conversion API error:', result.error);
      return res.status(500).json({ error: result.error });
    }
    
    console.log('Event sent successfully to Facebook Conversion API:', {
      event_name: eventName,
      event_id: finalEventId,
      facebook_response: result
    });
    
    return res.status(200).json({ 
      success: true, 
      result,
      eventId: finalEventId
    });
  } catch (error) {
    console.error('Error processing conversion event:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Remove null/undefined values from object
function cleanObject(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}

// Hash user data according to Facebook requirements
function hashUserData(userData) {
  const hashedData = {};
  
  // Facebook standard identifiers - always lowercase and trimmed before hashing
  if (userData.email) {
    hashedData.em = hash(userData.email);
  }
  
  if (userData.phone) {
    hashedData.ph = hash(userData.phone);
  }
  
  if (userData.firstName) {
    hashedData.fn = hash(userData.firstName);
  }
  
  if (userData.lastName) {
    hashedData.ln = hash(userData.lastName);
  }
  
  // Facebook advanced matching parameters
  if (userData.city) {
    hashedData.ct = hash(userData.city);
  }
  
  if (userData.state) {
    hashedData.st = hash(userData.state);
  }
  
  if (userData.zipCode) {
    hashedData.zp = hash(userData.zipCode);
  }
  
  if (userData.country) {
    hashedData.country = hash(userData.country);
  }
  
  if (userData.gender) {
    hashedData.ge = hash(userData.gender);
  }
  
  if (userData.dateOfBirth) {
    hashedData.db = hash(userData.dateOfBirth);
  }
  
  return hashedData;
}

// SHA-256 hash function
function hash(value) {
  if (!value) return undefined;
  // Ensure value is a string, lowercase and trimmed
  const normalizedValue = String(value).toLowerCase().trim();
  return createHash('sha256').update(normalizedValue).digest('hex');
}

// Generate a unique event ID for deduplication
function generateEventId(userData, eventName) {
  const timestamp = new Date().toISOString();
  const uniqueStr = `${eventName}_${timestamp}_${Math.random()}`;
  return createHash('md5').update(uniqueStr).digest('hex');
}

// Get device type from user agent
function getDeviceTypeFromUserAgent(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Mobile')) {
    return 'Mobile';
  } else if (userAgent.includes('Tablet')) {
    return 'Tablet';
  } else if (userAgent.includes('Windows NT')) {
    return 'Desktop';
  } else if (userAgent.includes('Macintosh')) {
    return 'Desktop';
  } else if (userAgent.includes('Linux')) {
    return 'Desktop';
  } else if (userAgent.includes('Android')) {
    return 'Mobile';
  } else if (userAgent.includes('iOS')) {
    return 'Mobile';
  } else {
    return 'Unknown';
  }
} 