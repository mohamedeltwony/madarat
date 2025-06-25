// API endpoint to get location data from client IP address
// This provides geolocation data for form submissions without requiring user permissions

import { getLocationWithFallback, formatLocationForDisplay, getLocationAwareTimestamp } from '@/utils/geolocation';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP address (same logic as zapier-proxy)
    const forwarded = req.headers['x-forwarded-for'];
    let ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
    
    // Handle localhost IP addresses
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = 'localhost (development)';
    }

    console.log('Getting location for IP:', ip);

    // Get location data with fallback handling
    const location = await getLocationWithFallback(ip);
    
    // Get timezone-aware timestamps
    const timestamps = getLocationAwareTimestamp(location);
    
    // Format for display
    const displayLocation = formatLocationForDisplay(location);

    // Prepare response data
    const responseData = {
      success: true,
      ip: ip,
      location: location,
      displayLocation: displayLocation,
      timestamps: timestamps,
      // Add some metadata
      metadata: {
        service: location.source,
        valid: location.source !== 'fallback',
        timestamp: new Date().toISOString(),
        isDevelopment: ip === 'localhost (development)'
      }
    };

    console.log('Location lookup result:', {
      ip: ip,
      city: location.city,
      country: location.country,
      service: location.source,
      valid: location.source !== 'fallback'
    });

    // Return the location data
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in get-location API:', error);
    
    // Return error response but still include basic structure
    return res.status(200).json({
      success: false,
      error: error.message,
      location: {
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        country_code: 'XX',
        latitude: null,
        longitude: null,
        timezone: 'UTC',
        isp: 'Unknown',
        source: 'error'
      },
      displayLocation: 'موقع غير محدد',
      timestamps: {
        utc: new Date().toISOString(),
        local: new Date().toISOString(),
        timezone: 'UTC',
        timestamp: Date.now()
      },
      metadata: {
        service: 'error',
        valid: false,
        timestamp: new Date().toISOString(),
        isDevelopment: false
      }
    });
  }
} 