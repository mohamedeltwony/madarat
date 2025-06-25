/**
 * API endpoint to handle offline conversions (like phone calls)
 * for Facebook Conversion API tracking
 */

import { createHash } from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { 
      eventName = 'OfflinePhoneCall', 
      userData, 
      callData, 
      timestamp = Date.now() 
    } = req.body;
    
    if (!userData) {
      return res.status(400).json({ error: 'Missing required user data' });
    }
    
    const pixelId = process.env.FB_PIXEL_ID || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '330286163283402';
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || process.env.FB_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ error: 'Missing access token in environment variables' });
    }
    
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
      country: userData.country || 'SA'
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
    
    // Generate an event ID for this offline conversion
    const eventId = userData.eventId || generateEventId('offline', cleanedUserData);
    
    // Create Facebook event object for Conversion API
    const event = {
      event_name: eventName,
      event_time: Math.floor(timestamp / 1000), // Convert to seconds
      action_source: 'phone_call',
      user_data: {
        ...hashedData,
        external_id: userData.external_id || null,
        fbp: userData.fbp || null,
        fbc: userData.fbc || null,
        client_ip_address: userData.ip || req.headers['x-forwarded-for'] || null,
        client_user_agent: userData.userAgent || req.headers['user-agent'] || null,
      },
      custom_data: {
        // Add call-specific data
        call_duration: callData?.duration || 0,
        call_timestamp: callData?.callTime || Math.floor(timestamp / 1000),
        call_disposition: callData?.disposition || 'completed',
        call_source: callData?.source || 'website',
        call_agent: callData?.agent || 'unknown',
        value: callData?.value || 50, // Assign a value to the call
        currency: 'SAR',
        content_name: 'Phone Call Conversion',
        content_category: callData?.category || 'lead'
      },
      event_id: eventId
    };
    
    // Remove null/undefined values
    cleanObject(event.user_data);
    cleanObject(event.custom_data);
    
    // Check if we need the test event code
    const isTestMode = process.env.NODE_ENV === 'development' || userData.test_mode === true;
    const testEventCode = isTestMode ? process.env.FB_TEST_EVENT_CODE : undefined;
    
    // Log what we're sending
    console.log('Sending offline conversion event to Facebook:', {
      event_name: event.event_name,
      event_id: event.event_id,
      user_data_keys: Object.keys(event.user_data).join(','),
      timestamp: new Date(timestamp).toISOString()
    });
    
    // Send to Facebook Conversion API
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [event],
          ...(testEventCode ? { test_event_code: testEventCode } : {})
        })
      }
    );
    
    const result = await response.json();
    
    if (result.error) {
      console.error('Facebook Offline Conversion API error:', result.error);
      return res.status(500).json({ error: result.error });
    }
    
    console.log('Offline conversion event sent successfully to Facebook:', {
      event_name: eventName,
      event_id: eventId,
      result: result
    });
    
    return res.status(200).json({ 
      success: true, 
      eventId: eventId,
      result: result
    });
  } catch (error) {
    console.error('Error processing offline conversion:', error);
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
function generateEventId(type, userData) {
  const timestamp = new Date().toISOString();
  const userStr = userData.email || userData.phone || userData.external_id || Math.random().toString();
  const uniqueStr = `${type}_${timestamp}_${userStr}`;
  return createHash('md5').update(uniqueStr).digest('hex');
} 