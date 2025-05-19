// Zapier partial submission API endpoint
// This sends partial form data to Zapier as users are filling out the form
import { csrf } from '@/utils/csrf';

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

    // Add metadata to identify this as a partial submission
    const enhancedData = {
      ...req.body,
      is_partial: true,
      partial_timestamp: new Date().toISOString(),
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
