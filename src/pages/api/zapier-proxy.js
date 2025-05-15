// Zapier proxy API endpoint to avoid CORS issues
// This will relay requests from the form to Zapier's webhook

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the request for debugging
    console.log('Zapier proxy received request');
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));

    // The Zapier webhook URL from environment variables only
    const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    
    // If no webhook URL is configured, return error
    if (!zapierWebhookUrl) {
      console.error('No Zapier webhook URL configured in environment variables');
      return res.status(200).json({
        status: 500,
        success: false,
        error: 'Zapier webhook not configured',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Don't log the full webhook URL for security
    console.log('Using Zapier webhook from environment variables:', zapierWebhookUrl.substring(0, 20) + '...');

    // Get client IP address
    const forwarded = req.headers['x-forwarded-for'];
    let ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
    
    // Handle localhost IP addresses
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = 'localhost (development)';
      console.log('Development environment detected, IP address is localhost');
    } else {
      console.log('Client IP address:', ip);
    }
    
    // Add IP address to the payload without overriding client data
    const enhancedPayload = {
      ...req.body,
      // Only set IP if not already provided by client
      ip_address: req.body.ip_address || ip || 'unknown',
      
      // Add server-side headers if not provided by client
      server_user_agent: req.headers['user-agent'] || 'unknown',
      server_referer: req.headers['referer'] || 'unknown',
      server_origin: req.headers['origin'] || 'unknown',
      
      // Add note for development environment
      is_development: ip === 'localhost (development)',
      
      // Add timestamp for verification
      server_timestamp: Date.now(),
    };

    // Generate a signature for verification
    const signature = generateSignature(enhancedPayload);
    
    // Log the payload for debugging (without sensitive data)
    console.log('Zapier payload (sample):', {
      name: enhancedPayload.name,
      phone: maskPhoneNumber(enhancedPayload.phone),
      email: maskEmail(enhancedPayload.email),
      device_vendor: enhancedPayload.device_vendor,
      operating_system: enhancedPayload.operating_system,
      browser: enhancedPayload.browser,
      ip_address: enhancedPayload.ip_address,
      formSource: enhancedPayload.formSource,
      destination: enhancedPayload.destination
    });

    // Create a controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

    try {
      // Make a single attempt with timeout
      console.log('Attempting submission to Zapier with timeout, URL:', zapierWebhookUrl.substring(0, 20) + '...');
      const response = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature,
        },
        body: JSON.stringify(enhancedPayload),
        signal: controller.signal,
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      // Process the response
      let responseText = '';
      try {
        responseText = await response.text();
      } catch (textError) {
        console.error('Could not get response text:', textError);
        responseText = 'Could not read response';
      }

      console.log('Zapier response status:', response.status);
      console.log('Zapier response:', responseText);

      // Always return a 200 status to the client to prevent form submission delays
      // The client can check success field to know if it actually worked
      return res.status(200).json({
        status: response.status,
        success: response.ok,
        data: responseText,
        timestamp: new Date().toISOString(),
      });
    } catch (fetchError) {
      // Handle fetch errors (including timeout)
      clearTimeout(timeoutId);
      console.error('Error fetching Zapier webhook:', fetchError);
      
      // For timeout or network errors, still return 200 to client
      // to prevent blocking the form submission
      return res.status(200).json({
        status: 500,
        success: false,
        error: fetchError.name === 'AbortError' ? 'Timeout' : fetchError.message,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error in Zapier proxy:', error);

    // Return a proper error response but use 200 status to not block the client
    return res.status(200).json({
      status: 500,
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// Helper function to generate a signature using proper crypto
// In production, implement this with a proper HMAC using a secret key
function generateSignature(payload) {
  try {
    // Use the native Node.js crypto module
    const crypto = require('crypto');
    
    // Get the secret key from environment variables
    const secretKey = process.env.WEBHOOK_SECRET_KEY || 'development-only-key';
    
    // Create a string representation of the payload
    const data = JSON.stringify(payload);
    
    // Create an HMAC signature using SHA-256
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(data);
    
    // Return the signature as a hex string
    return hmac.digest('hex');
  } catch (error) {
    console.error('Error generating signature:', error);
    // Fallback to a simple hash if crypto operations fail
    return simpleHash(JSON.stringify(payload));
  }
}

// Simple fallback hash function
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Helper function to mask phone numbers for logging
function maskPhoneNumber(phone) {
  if (!phone) return 'Not provided';
  // Keep first digit and last 2 digits, mask the rest
  return phone.substring(0, 1) + '*'.repeat(phone.length - 3) + phone.substring(phone.length - 2);
}

// Helper function to mask email addresses for logging
function maskEmail(email) {
  if (!email || email === 'Not provided') return 'Not provided';
  const parts = email.split('@');
  if (parts.length !== 2) return 'Invalid email format';
  
  const name = parts[0];
  const domain = parts[1];
  
  // Show first and last character of the name part
  const maskedName = name.charAt(0) + '*'.repeat(Math.max(name.length - 2, 0)) + 
    (name.length > 1 ? name.charAt(name.length - 1) : '');
  
  return `${maskedName}@${domain}`;
}
