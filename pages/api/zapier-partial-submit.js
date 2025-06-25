// Zapier partial submission API endpoint
// This sends partial form data to Zapier as users are filling out the form
import { csrf } from '@/utils/csrf';
import { getLocationWithFallback, formatLocationForDisplay, getLocationAwareTimestamp, isValidLocation } from '@/utils/geolocation';

// Create a handler that will be wrapped with CSRF protection
async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the request for debugging
    console.log('Zapier partial submit received request');

    // The Zapier webhook URL for partial submissions - only use environment variables
    const zapierPartialWebhookUrl = process.env.ZAPIER_PARTIAL_WEBHOOK_URL;
      
    // Check if we have a webhook URL  
    if (!zapierPartialWebhookUrl) {
      console.error('No Zapier partial webhook URL configured in environment variables');
      return res.status(200).json({
        status: 500,
        success: false,
        error: 'Zapier partial webhook not configured',
        timestamp: new Date().toISOString(),
      });
    }

    console.log('Using Zapier partial webhook URL from environment variables:', 
      zapierPartialWebhookUrl.substring(0, 20) + '...');

    // Get client IP address
    const forwarded = req.headers['x-forwarded-for'];
    let ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
    
    // Handle localhost IP addresses
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = 'localhost (development)';
    }

    // Get location data for partial submission
    console.log('Getting location data for partial submission...');
    const locationData = await getLocationWithFallback(ip);
    const locationTimestamps = getLocationAwareTimestamp(locationData);
    const displayLocation = formatLocationForDisplay(locationData);
    const validLocation = isValidLocation(locationData);

    // Add metadata to identify this as a partial submission
    const enhancedData = {
      ...req.body,
      is_partial: true,
      partial_timestamp: new Date().toISOString(),
      
      // Add geolocation data for partial submissions
      ip_address: ip,
      client_city: locationData.city,
      client_region: locationData.region,
      client_country: locationData.country,
      client_country_code: locationData.country_code,
      client_latitude: locationData.latitude,
      client_longitude: locationData.longitude,
      client_timezone: locationData.timezone,
      client_isp: locationData.isp,
      client_location_display: displayLocation,
      client_location_valid: validLocation,
      client_location_source: locationData.source,
      
      // Add timezone-aware timestamps
      client_local_time: locationTimestamps.local,
      client_timezone_offset: locationTimestamps.timezone,
    };

    try {
      console.log('Submitting partial data to Zapier:', enhancedData);
      const jsonResponse = await fetch(zapierPartialWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedData),
      });

      if (jsonResponse.ok) {
        // JSON format worked
        const responseData = await jsonResponse.text();
        console.log(
          'Zapier partial submit response status:',
          jsonResponse.status
        );

        return res.status(jsonResponse.status).json({
          status: jsonResponse.status,
          success: true,
          format: 'json',
          data: responseData,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error(
          'Partial submission failed with status:',
          jsonResponse.status
        );
        // Return success anyway to not disrupt the user experience
        return res.status(200).json({
          status: jsonResponse.status,
          success: false,
          message: 'Partial submission failed but form experience continues',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error with partial submission:', error.message);
      // Return success anyway to not disrupt the user experience
      return res.status(200).json({
        success: false,
        error: 'Failed to forward partial request to Zapier',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error in Zapier partial submit proxy:', error);

    // Return a success response anyway to not disrupt the user experience
    return res.status(200).json({
      success: false,
      error: 'Failed to process partial submission',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// Try to apply CSRF protection, but fall back to the regular handler if it fails
let protectedHandler;
try {
  protectedHandler = csrf(handler);
} catch (error) {
  console.error('Failed to initialize CSRF protection for partial submit:', error);
  protectedHandler = handler;
}

export default protectedHandler;
