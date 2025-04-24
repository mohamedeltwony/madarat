import crypto from 'crypto';

// Helper function to hash data using SHA-256
const hashData = (data) => {
  if (!data) return null;
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { eventName, userData, eventSourceUrl } = req.body;
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error('Facebook Pixel ID or Access Token is missing in environment variables.');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  if (!eventName || !userData || !eventSourceUrl) {
    return res.status(400).json({ message: 'Missing required event data.' });
  }

  // Prepare user data with hashed values
  const preparedUserData = {
    em: hashData(userData.email), // Hashed Email
    ph: hashData(userData.phone), // Hashed Phone Number (assuming no country code needed for hashing)
    // Add other fields if needed by Facebook for matching (e.g., fn, ln, ct, st, zp)
    client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    client_user_agent: req.headers['user-agent'],
    // fbc: userData.fbc, // Facebook Click ID (if available)
    // fbp: userData.fbp, // Facebook Browser ID (if available)
  };

  // Remove null values from preparedUserData
  Object.keys(preparedUserData).forEach(key => {
    if (preparedUserData[key] === null || preparedUserData[key] === undefined) {
      delete preparedUserData[key];
    }
  });

  // Prepare custom data (non-sensitive fields)
  const customData = {
    name: userData.name,
    city: userData.city,
    destination: userData.destination,
    // Add any other relevant non-sensitive form fields
  };

  // Remove null/undefined values from customData
  Object.keys(customData).forEach(key => {
    if (customData[key] === null || customData[key] === undefined) {
      delete customData[key];
    }
  });


  const eventData = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: eventSourceUrl,
    action_source: 'website',
    user_data: preparedUserData,
    custom_data: customData,
    // Optional: Add event_id for deduplication if needed
    // event_id: `${eventName}_${Date.now()}`
  };

  const payload = {
    data: [eventData],
    // Optional: Add test_event_code for testing in Events Manager
    // test_event_code: 'YOUR_TEST_EVENT_CODE'
  };

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`; // Use the latest stable API version

  try {
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

    console.log('Event sent successfully to Facebook CAPI:', responseData);
    return res.status(200).json({ success: true, fbResponse: responseData });

  } catch (error) {
    console.error('Error in /api/fb-events:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}