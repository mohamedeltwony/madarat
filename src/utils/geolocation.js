// Geolocation utility functions for IP-based location detection
// This provides city-level location data without requiring user permissions

/**
 * Get location data from IP address using a free geolocation service
 * @param {string} ip - IP address to lookup
 * @returns {Promise<Object>} Location data including city, country, region
 */
export const getLocationFromIP = async (ip) => {
  try {
    // Skip localhost/development IPs
    if (!ip || ip === 'localhost (development)' || ip === '::1' || ip === '127.0.0.1') {
      return {
        city: 'Development/Unknown',
        region: 'Development',
        country: 'Unknown',
        country_code: 'XX',
        latitude: null,
        longitude: null,
        timezone: 'UTC',
        isp: 'Development',
        source: 'development'
      };
    }

    // Use ip-api.com (free service with good reliability)
    // Note: This service allows 1000 requests per month for free
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp`, {
      method: 'GET',
      timeout: 5000, // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`Geolocation service returned ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'fail') {
      console.error('Geolocation lookup failed:', data.message);
      return getFallbackLocation();
    }

    return {
      city: data.city || 'Unknown City',
      region: data.regionName || data.region || 'Unknown Region',
      country: data.country || 'Unknown Country',
      country_code: data.countryCode || 'XX',
      latitude: data.lat || null,
      longitude: data.lon || null,
      timezone: data.timezone || 'UTC',
      isp: data.isp || 'Unknown ISP',
      source: 'ip-api'
    };

  } catch (error) {
    console.error('Error getting location from IP:', error);
    return getFallbackLocation();
  }
};

/**
 * Alternative geolocation service (backup)
 * @param {string} ip - IP address to lookup
 * @returns {Promise<Object>} Location data
 */
export const getLocationFromIPFallback = async (ip) => {
  try {
    // Skip localhost/development IPs
    if (!ip || ip === 'localhost (development)' || ip === '::1' || ip === '127.0.0.1') {
      return getFallbackLocation();
    }

    // Use ipapi.co as fallback (also free with limitations)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      method: 'GET',
      timeout: 5000,
    });

    if (!response.ok) {
      throw new Error(`Fallback geolocation service returned ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error('Fallback geolocation lookup failed:', data.reason);
      return getFallbackLocation();
    }

    return {
      city: data.city || 'Unknown City',
      region: data.region || 'Unknown Region',
      country: data.country_name || 'Unknown Country',
      country_code: data.country_code || 'XX',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      timezone: data.timezone || 'UTC',
      isp: data.org || 'Unknown ISP',
      source: 'ipapi'
    };

  } catch (error) {
    console.error('Error with fallback geolocation service:', error);
    return getFallbackLocation();
  }
};

/**
 * Get location with automatic fallback between services
 * @param {string} ip - IP address to lookup
 * @returns {Promise<Object>} Location data with fallback handling
 */
export const getLocationWithFallback = async (ip) => {
  try {
    // Try primary service first
    let location = await getLocationFromIP(ip);
    
    // If primary service failed, try fallback
    if (location.source === 'fallback') {
      console.log('Primary geolocation service failed, trying fallback...');
      location = await getLocationFromIPFallback(ip);
    }

    return location;
  } catch (error) {
    console.error('All geolocation services failed:', error);
    return getFallbackLocation();
  }
};

/**
 * Fallback location data when all services fail
 * @returns {Object} Default location data
 */
export const getFallbackLocation = () => {
  return {
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    country_code: 'XX',
    latitude: null,
    longitude: null,
    timezone: 'UTC',
    isp: 'Unknown',
    source: 'fallback'
  };
};

/**
 * Format location data for display
 * @param {Object} location - Location data object
 * @returns {string} Formatted location string
 */
export const formatLocationForDisplay = (location) => {
  if (!location || location.source === 'fallback') {
    return 'موقع غير محدد';
  }

  const parts = [];
  
  if (location.city && location.city !== 'Unknown City') {
    parts.push(location.city);
  }
  
  if (location.region && location.region !== 'Unknown Region' && location.region !== location.city) {
    parts.push(location.region);
  }
  
  if (location.country && location.country !== 'Unknown Country') {
    parts.push(location.country);
  }

  return parts.length > 0 ? parts.join(', ') : 'موقع غير محدد';
};

/**
 * Get timezone-aware timestamp
 * @param {Object} location - Location data with timezone
 * @returns {Object} Formatted timestamps
 */
export const getLocationAwareTimestamp = (location) => {
  const now = new Date();
  
  try {
    // Use the detected timezone if available
    const timezone = location?.timezone || 'UTC';
    
    return {
      utc: now.toISOString(),
      local: now.toLocaleString('en-US', { timeZone: timezone }),
      timezone: timezone,
      timestamp: now.getTime()
    };
  } catch (error) {
    // Fallback to UTC if timezone parsing fails
    return {
      utc: now.toISOString(),
      local: now.toISOString(),
      timezone: 'UTC',
      timestamp: now.getTime()
    };
  }
};

/**
 * Check if location data is valid and useful
 * @param {Object} location - Location data to validate
 * @returns {boolean} Whether location data is valid
 */
export const isValidLocation = (location) => {
  return location && 
         location.source !== 'fallback' && 
         location.city !== 'Unknown' && 
         location.city !== 'Unknown City' &&
         location.country !== 'Unknown Country';
}; 