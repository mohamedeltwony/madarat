import { createHash } from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const {
      eventName = 'OfflineConversion',
      leadId,
      externalId,
      email,
      phone,
      name,
      conversionValue,
      conversionTime, // Optional, use current time if not provided
      conversionType, // E.g., 'call', 'visit', 'purchase', etc.
      additionalData = {}
    } = req.body;

    if (!leadId && !externalId && !email && !phone) {
      return res.status(400).json({
        error: 'At least one identifier is required (leadId, externalId, email, or phone)'
      });
    }

    // Prepare user data for matching
    const userData = {};
    
    // Hash all PII data
    if (email) userData.em = hash(email.toLowerCase().trim());
    if (phone) userData.ph = hash(phone.replace(/\D/g, ''));

    if (name) {
      const nameParts = name.split(' ');
      if (nameParts.length > 0) {
        userData.fn = hash(nameParts[0].trim());
        if (nameParts.length > 1) {
          userData.ln = hash(nameParts.slice(1).join(' ').trim());
        }
      }
    }

    // Add external ID if available
    if (externalId) userData.external_id = externalId;
    if (leadId) userData.lead_id = leadId;

    // Create conversion event
    const eventId = `offline_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Normalize conversion time (use current time if not provided)
    const eventTime = conversionTime 
      ? Math.floor(new Date(conversionTime).getTime() / 1000)
      : Math.floor(Date.now() / 1000);

    const event = {
      event_name: eventName,
      event_time: eventTime,
      user_data: userData,
      custom_data: {
        value: conversionValue || 0,
        currency: 'SAR',
        content_name: `Offline ${conversionType || 'Conversion'}`,
        conversion_type: conversionType || 'other',
        ...additionalData
      },
      action_source: 'crm', // Use 'crm', 'phone_call', 'email', or other appropriate source
      event_id: eventId
    };

    // Log what we're sending to Facebook
    console.log(`Sending offline conversion to Facebook:`, {
      event_name: event.event_name,
      event_id: event.event_id,
      identifiers_provided: {
        email: !!email,
        phone: !!phone,
        name: !!name,
        externalId: !!externalId,
        leadId: !!leadId
      }
    });

    // Make the call to Facebook Conversion API
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${process.env.FB_PIXEL_ID || '330286163283402'}/events?access_token=${process.env.FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [event],
          test_event_code: process.env.NODE_ENV === 'development' ? process.env.FB_TEST_EVENT_CODE : undefined
        })
      }
    );

    const result = await response.json();

    if (result.error) {
      console.error('Error sending offline conversion:', result.error);
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({ 
      success: true, 
      eventId,
      response: result
    });
  } catch (error) {
    console.error('Error processing offline conversion:', error);
    return res.status(500).json({ error: error.message });
  }
}

// SHA-256 hash function
function hash(value) {
  return value ? createHash('sha256').update(value).digest('hex') : undefined;
} 