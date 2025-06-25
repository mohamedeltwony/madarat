import { createHash } from 'crypto';

/**
 * TikTok Events API (CAPI) Endpoint
 * Sends server-side events to TikTok for better data accuracy and iOS 14.5+ compliance
 * 
 * Environment Variables Required:
 * - TIKTOK_ACCESS_TOKEN: Your TikTok Events API access token
 * - TIKTOK_PIXEL_ID: Your TikTok pixel ID (D17TA5JC77UDOT6CA5FG)
 * 
 * Supported Events: ViewContent, Search, ClickButton, Lead, Purchase, CompleteRegistration
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventName, userData, customData, eventId, testEventCode } = req.body;

    if (!eventName || !userData) {
      return res.status(400).json({ error: 'Missing required parameters: eventName and userData' });
    }

    // Validate that we have at least one user identifier
    const hasValidUserData = userData && (
      userData.email ||
      userData.phone ||
      userData.external_id ||
      userData.ttclid ||
      userData.ttp
    );

    if (!hasValidUserData) {
      return res.status(400).json({ 
        error: 'Invalid user data: At least one of email, phone, external_id, ttclid, or ttp is required' 
      });
    }

    // Map event names to valid TikTok event names
    const validEventName = mapToValidTikTokEventName(eventName);
    if (!validEventName) {
      return res.status(400).json({ 
        error: 'Invalid event name', 
        details: `Event name "${eventName}" is not supported. Valid events: ViewContent, Search, ClickButton, Lead, Purchase, CompleteRegistration` 
      });
    }

    // Get environment variables
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN || 'c8947ce24f6cd19daf4073304848a6b9d0cd89ca';
    const pixelId = process.env.TIKTOK_PIXEL_ID || 'D17TA5JC77UDOT6CA5FG';

    if (!accessToken) {
      console.error('TIKTOK_ACCESS_TOKEN not found in environment variables');
      return res.status(500).json({ error: 'TikTok access token not configured' });
    }

    // Generate event ID for deduplication if not provided
    const finalEventId = eventId || generateTikTokEventId(validEventName, userData);

    // Get client IP address
    const clientIp = getClientIp(req);

    // Prepare user data according to TikTok Events API format
    const tikTokUserData = await prepareTikTokUserData(userData, clientIp, req);

    // Prepare event data
    const tikTokEventData = prepareTikTokEventData(customData || {}, validEventName);

    // Create the event payload according to TikTok Events API format
    const eventPayload = {
      event: validEventName,
      event_id: finalEventId,
      timestamp: new Date().toISOString(),
      context: {
        user: tikTokUserData,
        page: {
          url: userData.url || userData.page_url || userData.event_source_url || req.headers.referer || '',
          referrer: req.headers.referer || ''
        },
        user_agent: userData.user_agent || req.headers['user-agent'] || '',
        ip: clientIp
      },
      properties: tikTokEventData
    };

    // Add test event code if provided (for debugging)
    if (testEventCode) {
      eventPayload.test_event_code = testEventCode;
    }

    // Log the event (mask sensitive data)
    console.log('Sending TikTok Events API event:', {
      original_event_name: eventName,
      mapped_event_name: validEventName,
      event_id: finalEventId,
      has_email: !!tikTokUserData.email,
      has_phone: !!tikTokUserData.phone,
      has_external_id: !!tikTokUserData.external_id,
      has_ttclid: !!tikTokUserData.ttclid,
      has_ttp: !!tikTokUserData.ttp,
      event_data_keys: Object.keys(tikTokEventData)
    });

    // Send to TikTok Events API
    const tikTokResponse = await fetch(
      'https://business-api.tiktok.com/open_api/v1.3/event/track/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken
        },
        body: JSON.stringify({
          pixel_code: pixelId,
          data: [eventPayload]
        })
      }
    );

    const result = await tikTokResponse.json();

    if (!tikTokResponse.ok) {
      console.error('TikTok Events API Error:', {
        status: tikTokResponse.status,
        statusText: tikTokResponse.statusText,
        response: result
      });
      return res.status(500).json({ 
        error: 'TikTok Events API request failed',
        details: result 
      });
    }

    console.log('TikTok Events API event sent successfully:', {
      original_event_name: eventName,
      mapped_event_name: validEventName,
      event_id: finalEventId,
      tiktok_response: result
    });

    return res.status(200).json({
      success: true,
      eventId: finalEventId,
      originalEventName: eventName,
      mappedEventName: validEventName,
      response: result
    });

  } catch (error) {
    console.error('Error in TikTok Events API handler:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Map event names to valid TikTok event names
 */
function mapToValidTikTokEventName(eventName) {
  const eventMappings = {
    // Standard TikTok events
    'VIEWCONTENT': 'ViewContent',
    'VIEW_CONTENT': 'ViewContent',
    'SEARCH': 'Search',
    'CLICKBUTTON': 'ClickButton',
    'CLICK_BUTTON': 'ClickButton',
    'LEAD': 'Lead',
    'PURCHASE': 'Purchase',
    'COMPLETEREGISTRATION': 'CompleteRegistration',
    'COMPLETE_REGISTRATION': 'CompleteRegistration',
    'SIGNUP': 'CompleteRegistration',
    'SIGN_UP': 'CompleteRegistration',
    
    // Custom events mapped to closest standard events
    'PAGE_VIEW': 'ViewContent',
    'PAGEVIEW': 'ViewContent',
    'ADD_TO_CART': 'ClickButton',
    'ADD_CART': 'ClickButton',
    'CONTACT': 'Lead',
    'SUBSCRIBE': 'Lead',
    'DOWNLOAD': 'ClickButton',
    'BOOKING': 'Purchase',
    'RESERVATION': 'Purchase',
    'CONVERSION': 'Purchase',
    'REGISTRATION': 'CompleteRegistration'
  };

  const normalizedEventName = eventName.toUpperCase().trim();
  return eventMappings[normalizedEventName] || null;
}

/**
 * Hash user data using SHA-256 for TikTok Events API
 */
function hashUserData(data) {
  if (!data || typeof data !== 'string') return null;
  
  try {
    // Normalize data (lowercase, trim whitespace)
    const normalized = data.toLowerCase().trim();
    if (!normalized) return null;
    
    // Create SHA-256 hash
    const hash = createHash('sha256');
    hash.update(normalized);
    return hash.digest('hex');
  } catch (error) {
    console.error('Error hashing user data:', error);
    return null;
  }
}

/**
 * Prepare user data for TikTok Events API
 */
async function prepareTikTokUserData(userData, clientIp, req) {
  const tikTokUserData = {};

  // Hash email if provided
  if (userData.email) {
    tikTokUserData.email = hashUserData(userData.email);
  }

  // Hash phone if provided (normalize phone number first)
  if (userData.phone) {
    const normalizedPhone = userData.phone.replace(/\D/g, ''); // Remove non-digits
    tikTokUserData.phone = hashUserData(normalizedPhone);
  }

  // External ID (hashed)
  if (userData.external_id) {
    tikTokUserData.external_id = hashUserData(userData.external_id.toString());
  }

  // TikTok Click ID (not hashed)
  if (userData.ttclid) {
    tikTokUserData.ttclid = userData.ttclid;
  }

  // TikTok Pixel (not hashed)
  if (userData.ttp) {
    tikTokUserData.ttp = userData.ttp;
  }

  // IP Address (not hashed)
  if (clientIp && clientIp !== '127.0.0.1') {
    tikTokUserData.ip = clientIp;
  }

  // User Agent (not hashed)
  if (userData.user_agent || req.headers['user-agent']) {
    tikTokUserData.user_agent = userData.user_agent || req.headers['user-agent'];
  }

  return tikTokUserData;
}

/**
 * Prepare event data for TikTok Events API
 */
function prepareTikTokEventData(customData, eventName) {
  const eventData = {};

  // Common properties
  if (customData.value !== undefined) {
    eventData.value = parseFloat(customData.value) || 0;
  }
  
  if (customData.currency) {
    eventData.currency = customData.currency;
  }

  if (customData.content_id) {
    eventData.content_id = customData.content_id;
  }

  if (customData.content_type) {
    eventData.content_type = customData.content_type;
  }

  if (customData.content_name) {
    eventData.content_name = customData.content_name;
  }

  // Event-specific properties
  switch (eventName) {
    case 'ViewContent':
      if (customData.content_category) {
        eventData.content_category = customData.content_category;
      }
      break;
      
    case 'Search':
      if (customData.search_string) {
        eventData.search_string = customData.search_string;
      }
      break;
      
    case 'Lead':
      if (customData.content_category) {
        eventData.content_category = customData.content_category;
      }
      if (customData.price) {
        eventData.price = parseFloat(customData.price) || 0;
      }
      if (customData.description) {
        eventData.description = customData.description;
      }
      break;
      
    case 'Purchase':
      if (customData.order_id) {
        eventData.order_id = customData.order_id;
      }
      if (customData.content_ids) {
        eventData.content_ids = Array.isArray(customData.content_ids) 
          ? customData.content_ids 
          : [customData.content_ids];
      }
      break;
  }

  return eventData;
}

/**
 * Generate a unique event ID for deduplication
 */
function generateTikTokEventId(eventName, userData) {
  const timestamp = Date.now();
  const userIdentifier = userData.email || userData.phone || userData.external_id || 'anonymous';
  const source = `${eventName}_${userIdentifier}_${timestamp}`;
  
  const hash = createHash('sha256');
  hash.update(source);
  return hash.digest('hex').substring(0, 16);
}

/**
 * Extract client IP address from request
 */
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.headers['cf-connecting-ip'] || 
         req.socket.remoteAddress || 
         '127.0.0.1';
} 