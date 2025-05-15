// Direct API endpoint for fallback in case Zapier proxy has issues
// This just logs the request and returns success

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate a unique ID for this request
    const requestId = Math.random().toString(36).substring(2, 15);
    
    // Log the request data for debugging and manual processing if needed
    console.log(`[${requestId}] Zapier direct endpoint received request`);
    console.log(`[${requestId}] Timestamp: ${new Date().toISOString()}`);
    
    // Get client IP address
    const forwarded = req.headers['x-forwarded-for'];
    let ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
    
    // Handle localhost IP addresses
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = 'localhost (development)';
      console.log(`[${requestId}] Development environment detected, IP address is localhost`);
    } else {
      console.log(`[${requestId}] Client IP address:`, ip);
    }
    
    // Add IP address to the payload without overriding client data
    const enhancedBody = {
      ...req.body,
      // Only set IP if not already provided by client
      ip_address: req.body.ip_address || ip || 'unknown',
      
      // Add server-side headers if not already provided
      server_user_agent: req.headers['user-agent'] || 'unknown',
      server_referer: req.headers['referer'] || 'unknown',
      server_origin: req.headers['origin'] || 'unknown',
      
      // Add note for development environment
      is_development: ip === 'localhost (development)',
      
      // Add timestamp and request ID for verification
      server_timestamp: Date.now(),
      request_id: requestId,
    };
    
    // Generate a signature for verification
    const signature = generateSignature(enhancedBody);
    
    // Extract key fields for logging
    const { name, phone, email, nationality, destination, formSource } = enhancedBody;
    console.log(`[${requestId}] Form data summary: ${formSource || 'unknown form'} - ${maskName(name) || 'No Name'} / ${maskPhoneNumber(phone) || 'No Phone'} / ${nationality || 'No Nationality'} / ${destination || 'No Destination'}`);
    
    // Log device and tracking info for debugging
    console.log(`[${requestId}] Device info: ${enhancedBody.device_vendor || 'Unknown'} / ${enhancedBody.operating_system || 'Unknown'} / ${enhancedBody.browser || 'Unknown'} / IP: ${enhancedBody.ip_address || 'Unknown'}`);
    
    // Log full details for record-keeping with sensitive data masked
    const maskedBody = maskSensitiveData(enhancedBody);
    console.log(`[${requestId}] Form data (sensitive info masked):`, JSON.stringify(maskedBody, null, 2));
    
    // Always return immediate success to the client
    return res.status(200).json({
      status: 200,
      success: true,
      requestId: requestId,
      message: 'Request logged for manual processing',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in Zapier direct endpoint:', error);

    // Always return a 200 status to avoid blocking form submission
    return res.status(200).json({
      status: 200,
      success: true, // Still indicate success to the client
      error: 'Internal error, but request was logged',
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

// Helper function to mask name for logging
function maskName(name) {
  if (!name || name === 'Not provided') return 'Not provided';
  const names = name.split(' ');
  if (names.length === 1) {
    // Only one name component
    if (names[0].length <= 2) return names[0]; // Very short name, don't mask
    return names[0].charAt(0) + '*'.repeat(names[0].length - 2) + names[0].charAt(names[0].length - 1);
  }
  
  // First and last name
  const firstName = names[0];
  const lastName = names[names.length - 1];
  
  const maskedFirstName = firstName.charAt(0) + '*'.repeat(Math.max(firstName.length - 1, 0));
  const maskedLastName = lastName.charAt(0) + '*'.repeat(Math.max(lastName.length - 1, 0));
  
  return `${maskedFirstName} ${maskedLastName}`;
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

// Function to mask all sensitive data in an object
function maskSensitiveData(data) {
  const maskedData = { ...data };
  
  // Mask specific sensitive fields
  if (maskedData.phone) maskedData.phone = maskPhoneNumber(maskedData.phone);
  if (maskedData.email) maskedData.email = maskEmail(maskedData.email);
  if (maskedData.name) maskedData.name = maskName(maskedData.name);
  
  // Remove any security-sensitive fields
  delete maskedData.fb_browser_id;
  delete maskedData.fb_click_id;
  
  return maskedData;
}
