import { createHash } from 'crypto';

/**
 * Snapchat Conversions API (CAPI) Endpoint
 * Sends server-side events to Snapchat for better data accuracy and iOS 14.5+ compliance
 * 
 * Environment Variables Required:
 * - SNAPCHAT_ACCESS_TOKEN: Your Snapchat CAPI access token
 * - SNAPCHAT_PIXEL_ID: Your Snapchat pixel ID (a9d0612f-6ca4-4b9a-a9a8-74310e3a4462)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventName, userData, customData, eventId, actionSource = 'website' } = req.body;

    if (!eventName || !userData) {
      return res.status(400).json({ error: 'Missing required parameters: eventName and userData' });
    }

    // Additional validation for meaningful user data
    const hasValidUserData = userData && (
      userData.email ||
      userData.phone ||
      userData.user_email ||
      userData.user_phone_number ||
      userData.external_id ||
      userData.uuid_c1
    );

    if (!hasValidUserData) {
      return res.status(400).json({ 
        error: 'Invalid user data: At least one of email, phone, user_email, user_phone_number, external_id, or uuid_c1 is required' 
      });
    }

    // Map event names to valid Snapchat event names
    const validEventName = mapToValidSnapchatEventName(eventName);
    if (!validEventName) {
      return res.status(400).json({ 
        error: 'Invalid event name', 
        details: `Event name "${eventName}" is not supported. Valid events: PAGE_VIEW, VIEW_CONTENT, ADD_CART, PURCHASE, SIGN_UP, COMPLETE_REGISTRATION` 
      });
    }

    // Get environment variables
    const accessToken = process.env.SNAPCHAT_ACCESS_TOKEN;
    const pixelId = process.env.SNAPCHAT_PIXEL_ID || 'a9d0612f-6ca4-4b9a-a9a8-74310e3a4462';

    if (!accessToken) {
      console.error('SNAPCHAT_ACCESS_TOKEN not found in environment variables');
      return res.status(500).json({ error: 'Snapchat access token not configured' });
    }

    // Generate event ID for deduplication if not provided
    const finalEventId = eventId || generateSnapchatEventId(validEventName, userData);

    // Get client IP address
    const clientIp = getClientIp(req);

    // Prepare user data according to Snapchat CAPI format
    const snapchatUserData = await prepareSnapchatUserData(userData, clientIp);

    // Prepare custom data
    const snapchatCustomData = prepareSnapchatCustomData(customData || {});

    // Create the event payload according to Snapchat CAPI v3 format
    const eventPayload = {
      event_name: validEventName,
      action_source: actionSource,
      event_time: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      user_data: snapchatUserData,
      custom_data: snapchatCustomData,
      event_id: finalEventId
    };

    // Add event source URL if available
    if (userData.event_source_url || userData.page_url) {
      eventPayload.event_source_url = userData.event_source_url || userData.page_url;
    }

    // Log the event (mask sensitive data)
    console.log('Sending Snapchat CAPI event:', {
      original_event_name: eventName,
      mapped_event_name: validEventName,
      event_id: finalEventId,
      action_source: eventPayload.action_source,
      has_email: !!snapchatUserData.em,
      has_phone: !!snapchatUserData.ph,
      has_user_agent: !!snapchatUserData.user_agent,
      has_ip: !!snapchatUserData.client_ip_address,
      custom_data_keys: Object.keys(snapchatCustomData)
    });

    // Send to Snapchat CAPI using correct endpoint and authentication
    const snapchatResponse = await fetch(
      `https://tr.snapchat.com/v3/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [eventPayload]
        })
      }
    );

    const result = await snapchatResponse.json();

    if (!snapchatResponse.ok) {
      console.error('Snapchat CAPI Error:', {
        status: snapchatResponse.status,
        statusText: snapchatResponse.statusText,
        response: result
      });
      return res.status(500).json({ 
        error: 'Snapchat CAPI request failed',
        details: result 
      });
    }

    console.log('Snapchat CAPI event sent successfully:', {
      original_event_name: eventName,
      mapped_event_name: validEventName,
      event_id: finalEventId,
      snapchat_response: result
    });

    return res.status(200).json({
      success: true,
      eventId: finalEventId,
      originalEventName: eventName,
      mappedEventName: validEventName,
      response: result
    });

  } catch (error) {
    console.error('Error in Snapchat CAPI handler:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Map event names to valid Snapchat event names
 */
function mapToValidSnapchatEventName(eventName) {
  const eventMappings = {
    // Standard events
    'PAGE_VIEW': 'PAGE_VIEW',
    'PAGEVIEW': 'PAGE_VIEW',
    'VIEW_CONTENT': 'VIEW_CONTENT',
    'VIEWCONTENT': 'VIEW_CONTENT',
    'ADD_CART': 'ADD_CART',
    'ADDCART': 'ADD_CART',
    'ADD_TO_CART': 'ADD_CART',
    'PURCHASE': 'PURCHASE',
    'SIGN_UP': 'SIGN_UP',
    'SIGNUP': 'SIGN_UP',
    'COMPLETE_REGISTRATION': 'COMPLETE_REGISTRATION',
    'REGISTRATION': 'COMPLETE_REGISTRATION',
    
    // Custom events mapped to closest standard events
    'CUSTOM_EVENT_1': 'SIGN_UP', // Updated to map to SIGN_UP for form submissions
    'TEST_EVENT': 'VIEW_CONTENT',
    'LEAD': 'SIGN_UP',
    'CONVERSION': 'PURCHASE',
    
    // Additional mappings
    'CONTACT': 'SIGN_UP',
    'SUBSCRIBE': 'SIGN_UP',
    'DOWNLOAD': 'VIEW_CONTENT',
    'BOOKING': 'PURCHASE',
    'RESERVATION': 'PURCHASE'
  };

  const normalizedEventName = eventName.toUpperCase().trim();
  return eventMappings[normalizedEventName] || null;
}

/**
 * Hash user data using SHA-256 for Snapchat CAPI
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
 * Prepare user data according to Snapchat CAPI requirements
 */
async function prepareSnapchatUserData(userData, clientIp) {
  const snapchatUserData = {};

  // Email (hashed)
  if (userData.email) {
    snapchatUserData.em = [hashUserData(userData.email)];
  }

  // Phone (hashed) - format for Saudi Arabia
  if (userData.phone) {
    let formattedPhone = userData.phone.replace(/\D/g, '');
    
    // Add Saudi country code if not present
    if (formattedPhone.startsWith('5') && formattedPhone.length === 9) {
      formattedPhone = '966' + formattedPhone;
    } else if (formattedPhone.startsWith('05') && formattedPhone.length === 10) {
      formattedPhone = '966' + formattedPhone.substring(1);
    }
    
    snapchatUserData.ph = [hashUserData(formattedPhone)];
  }

  // User Agent
  if (userData.user_agent) {
    snapchatUserData.user_agent = userData.user_agent;
  }

  // Client IP Address
  if (clientIp) {
    snapchatUserData.client_ip_address = clientIp;
  }

  // Snapchat Click ID (from URL parameters or cookies)
  if (userData.sc_click_id) {
    snapchatUserData.sc_click_id = userData.sc_click_id;
  }

  // Snapchat Cookie (scID)
  if (userData.sc_cookie1 || userData.scid) {
    snapchatUserData.sc_cookie1 = userData.sc_cookie1 || userData.scid;
  }

  // Geographic data (hashed for privacy)
  if (userData.country) {
    snapchatUserData.country = hashUserData(userData.country);
  }

  if (userData.state || userData.region) {
    snapchatUserData.st = hashUserData(userData.state || userData.region);
  }

  if (userData.city) {
    snapchatUserData.ct = hashUserData(userData.city);
  }

  if (userData.zipCode || userData.postalCode) {
    snapchatUserData.zp = hashUserData(userData.zipCode || userData.postalCode);
  }

  // Name data (hashed)
  if (userData.firstName) {
    snapchatUserData.fn = [hashUserData(userData.firstName)];
  }

  if (userData.lastName) {
    snapchatUserData.ln = [hashUserData(userData.lastName)];
  }

  // Gender (hashed) - m/f
  if (userData.gender) {
    snapchatUserData.ge = hashUserData(userData.gender.toLowerCase());
  }

  // Mobile Advertising ID
  if (userData.madid || userData.mobile_ad_id) {
    snapchatUserData.madid = userData.madid || userData.mobile_ad_id;
  }

  return snapchatUserData;
}

/**
 * Prepare custom data for Snapchat events
 */
function prepareSnapchatCustomData(customData) {
  const snapchatCustomData = {};

  // Event ID for deduplication
  if (customData.event_id) {
    snapchatCustomData.event_id = customData.event_id;
  }

  // Transaction value
  if (customData.value || customData.price) {
    snapchatCustomData.value = String(customData.value || customData.price);
  }

  // Currency
  if (customData.currency) {
    snapchatCustomData.currency = customData.currency.toUpperCase();
  }

  // Content/Item IDs
  if (customData.content_ids || customData.item_ids) {
    snapchatCustomData.content_ids = customData.content_ids || customData.item_ids;
  }

  // Content Category
  if (customData.content_category || customData.item_category) {
    snapchatCustomData.content_category = [customData.content_category || customData.item_category];
  }

  // Number of items/quantities
  if (customData.number_items || customData.quantity) {
    const quantities = Array.isArray(customData.number_items) 
      ? customData.number_items 
      : [String(customData.quantity || 1)];
    snapchatCustomData.number_items = quantities;
  }

  // Order ID
  if (customData.order_id || customData.transaction_id) {
    snapchatCustomData.order_id = customData.order_id || customData.transaction_id;
  }

  // Content name
  if (customData.content_name) {
    snapchatCustomData.content_name = customData.content_name;
  }

  return snapchatCustomData;
}

/**
 * Generate unique event ID for deduplication between pixel and CAPI
 */
function generateSnapchatEventId(eventName, userData) {
  const timestamp = Date.now();
  const userIdentifier = userData.email || userData.phone || userData.external_id || 'anonymous';
  const hash = createHash('md5');
  hash.update(`${eventName}_${userIdentifier}_${timestamp}`);
  return `sc_${hash.digest('hex').substring(0, 16)}`;
}

/**
 * Extract client IP address from request headers
 */
function getClientIp(req) {
  // Try multiple headers for different proxy setups
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.headers['cf-connecting-ip'] ||
         req.headers['x-client-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         '127.0.0.1';
} 