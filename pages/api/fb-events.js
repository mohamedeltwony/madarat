import crypto from 'crypto';
import { csrf } from '@/utils/csrf';

// Helper function to hash data using SHA-256
const hashData = (data) => {
  if (!data) return null;
  return crypto
    .createHash('sha256')
    .update(String(data).toLowerCase().trim())
    .digest('hex');
};

// Create a handler that will be wrapped with CSRF protection
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { eventName, userData, eventSourceUrl, eventId, custom_data = {} } = req.body;
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '330286163283402';
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('Facebook Access Token is missing in environment variables.');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  if (!eventName) {
    return res.status(400).json({ message: 'Missing event name.' });
  }

  try {
    // Get client IP - try to get the real client IP through various headers
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.headers['cf-connecting-ip'] || 
                   req.socket.remoteAddress || 
                   '127.0.0.1';

    // Get Facebook click ID and browser ID
    const fbc = userData.fbc || req.cookies?._fbc;
    const fbp = userData.fbp || req.cookies?._fbp;
    
    // Process and clean user data before hashing
    const cleanedUserData = {
      email: userData.email ? String(userData.email).toLowerCase().trim() : undefined,
      phone: userData.phone ? String(userData.phone).replace(/\D/g, '') : undefined,
      firstName: userData.firstName || userData.fn || undefined,
      lastName: userData.lastName || userData.ln || undefined,
      name: userData.name || undefined,
      external_id: userData.external_id || undefined,
      city: userData.city || userData.ct || undefined,
      state: userData.state || userData.st || undefined,
      zipCode: userData.zipCode || userData.zip || userData.zp || undefined,
      country: userData.country || undefined,
      gender: userData.gender || userData.ge || undefined,
      dateOfBirth: userData.dateOfBirth || userData.dob || userData.db || undefined,
    };
    
    // If we have a name but no first/last name, split the name
    if (cleanedUserData.name && (!cleanedUserData.firstName && !cleanedUserData.lastName)) {
      const nameParts = cleanedUserData.name.split(' ');
      cleanedUserData.firstName = nameParts[0];
      if (nameParts.length > 1) {
        cleanedUserData.lastName = nameParts.slice(1).join(' ');
      }
    }
    
    console.log('Processing client-side event with data:', {
      email: cleanedUserData.email ? `${cleanedUserData.email.substring(0, 2)}***@${cleanedUserData.email.split('@')[1] || ''}` : 'missing',
      phone: cleanedUserData.phone ? `${cleanedUserData.phone.substring(0, 2)}****${cleanedUserData.phone.slice(-2) || ''}` : 'missing',
      name: cleanedUserData.name ? 'present' : 'missing',
      firstName: cleanedUserData.firstName ? 'present' : 'missing',
      lastName: cleanedUserData.lastName ? 'present' : 'missing',
      external_id: cleanedUserData.external_id ? 'present' : 'missing',
      fbp: fbp ? 'present' : 'missing',
      fbc: fbc ? 'present' : 'missing',
      eventName: eventName,
      eventId: eventId || 'missing'
    });

    // Prepare user data with hashed values for better matching
    const preparedUserData = {
      em: cleanedUserData.email ? hashData(cleanedUserData.email) : undefined,
      ph: cleanedUserData.phone ? hashData(cleanedUserData.phone) : undefined,
      fn: cleanedUserData.firstName ? hashData(cleanedUserData.firstName) : undefined,
      ln: cleanedUserData.lastName ? hashData(cleanedUserData.lastName) : undefined,
      ct: cleanedUserData.city ? hashData(cleanedUserData.city) : undefined,
      st: cleanedUserData.state ? hashData(cleanedUserData.state) : undefined,
      zp: cleanedUserData.zipCode ? hashData(cleanedUserData.zipCode) : undefined,
      country: cleanedUserData.country ? hashData(cleanedUserData.country) : undefined,
      ge: cleanedUserData.gender ? hashData(cleanedUserData.gender) : undefined,
      db: cleanedUserData.dateOfBirth ? hashData(cleanedUserData.dateOfBirth) : undefined,
      external_id: cleanedUserData.external_id || undefined,
      client_ip_address: clientIp,
      client_user_agent: req.headers['user-agent'],
      fbc: fbc,
      fbp: fbp,
    };

    // Remove null/undefined values from preparedUserData
    Object.keys(preparedUserData).forEach((key) => {
      if (preparedUserData[key] === null || preparedUserData[key] === undefined) {
        delete preparedUserData[key];
      }
    });

    // Make sure we have an event ID for deduplication
    const finalEventId = eventId || `${eventName}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

    // Combine custom data provided with any other relevant fields
    const finalCustomData = {
      ...custom_data,
      nationality: userData.nationality,
      value: custom_data.value || 0,
      currency: custom_data.currency || 'SAR',
    };

    // Remove null/undefined values from customData
    Object.keys(finalCustomData).forEach((key) => {
      if (finalCustomData[key] === null || finalCustomData[key] === undefined) {
        delete finalCustomData[key];
      }
    });

    const eventData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: eventSourceUrl || req.headers.referer || '',
      action_source: 'website',
      user_data: preparedUserData,
      custom_data: finalCustomData,
      event_id: finalEventId,
      // Add opt_out and data_processing_options for compliance
      opt_out: false,
      data_processing_options: [],
      data_processing_options_country: 0,
      data_processing_options_state: 0
    };

    // Check if we're in a test environment
    const isTestMode = process.env.NODE_ENV === 'development' || 
                       eventSourceUrl?.includes('localhost') || 
                       eventSourceUrl?.includes('127.0.0.1') ||
                       req.headers.host?.includes('localhost');
    
    const payload = {
      data: [eventData],
      // Conditionally add test_event_code for development environments
      ...(isTestMode && process.env.FB_TEST_EVENT_CODE 
          ? { test_event_code: process.env.FB_TEST_EVENT_CODE } 
          : {})
    };

    console.log('Sending to Facebook CAPI:', {
      event_name: eventData.event_name,
      event_id: eventData.event_id,
      parameter_keys: Object.keys(eventData.user_data).join(','),
      email_present: !!eventData.user_data.em,
      phone_present: !!eventData.user_data.ph,
      external_id_present: !!eventData.user_data.external_id,
      fbp_present: !!eventData.user_data.fbp,
      fbc_present: !!eventData.user_data.fbc,
      is_test_mode: isTestMode
    });

    const url = `https://graph.facebook.com/v17.0/${pixelId}/events?access_token=${accessToken}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Error sending event to Facebook CAPI:', responseData);
      // Don't expose detailed FB errors to the client
      return res.status(500).json({ message: 'Failed to send event data.' });
    }

    console.log('Event sent successfully to Facebook CAPI:', {
      event_name: eventName,
      event_id: finalEventId,
      response: responseData
    });
    
    return res.status(200).json({ 
      success: true, 
      event_id: finalEventId,
      fbResponse: responseData 
    });
  } catch (error) {
    console.error('Error in /api/fb-events:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Try to apply CSRF protection, but fall back to the regular handler if it fails
let protectedHandler;
try {
  protectedHandler = csrf(handler);
} catch (error) {
  console.error('Failed to initialize CSRF protection for fb-events:', error);
  protectedHandler = handler;
}

export default protectedHandler;
