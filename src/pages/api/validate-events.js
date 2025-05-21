/**
 * API Endpoint to validate Facebook event configuration and diagnostics
 * This endpoint checks:
 * 1. Connection to Facebook
 * 2. Pixel/CAPI configuration
 * 3. Any diagnostic issues reported by Facebook
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const pixelId = process.env.FB_PIXEL_ID || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '330286163283402';
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || process.env.FB_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ 
        timestamp: new Date().toISOString(),
        connection: { 
          success: false, 
          message: 'Missing Facebook access token in environment variables.' 
        },
        configuredServices: {
          pixel: false,
          capi: false,
          test_events: false
        }
      });
    }
    
    // Check connection to Facebook and get pixel details
    const connectionInfo = await checkFacebookConnection(pixelId, accessToken);
    
    // Get diagnostics from Facebook
    const diagnostics = await getEventDiagnostics(pixelId, accessToken);
    
    // Return comprehensive information
    return res.status(200).json({
      timestamp: new Date().toISOString(),
      connection: connectionInfo,
      configuredServices: {
        pixel: connectionInfo.success,
        capi: !!accessToken,
        test_events: !!process.env.FB_TEST_EVENT_CODE
      },
      diagnostics: diagnostics
    });
  } catch (error) {
    console.error('Error in Facebook validation endpoint:', error);
    return res.status(500).json({ 
      timestamp: new Date().toISOString(),
      error: error.message 
    });
  }
}

/**
 * Check connection to Facebook and get pixel details
 */
async function checkFacebookConnection(pixelId, accessToken) {
  try {
    // Use Facebook Marketing API to check pixel
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${pixelId}?access_token=${accessToken}&fields=name,is_unavailable,last_fired_time,owner_business`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const error = await response.json();
      return { 
        success: false, 
        message: `Facebook API error: ${error.error?.message || 'Unknown error'}` 
      };
    }
    
    const pixelData = await response.json();
    
    // Check if pixel is available and has fired recently
    if (pixelData.is_unavailable) {
      return { 
        success: false, 
        message: 'Pixel is marked as unavailable by Facebook' 
      };
    }
    
    // Get last fired time
    let lastFiredMsg = '';
    if (pixelData.last_fired_time) {
      const lastFired = new Date(pixelData.last_fired_time);
      const nowTime = new Date();
      const hoursSinceFired = Math.round((nowTime - lastFired) / (1000 * 60 * 60));
      
      lastFiredMsg = `Pixel last fired ${hoursSinceFired} hour(s) ago`;
    } else {
      lastFiredMsg = 'Pixel has not fired recently';
    }
    
    return { 
      success: true, 
      message: `Connection successful. ${lastFiredMsg}`,
      pixelId: pixelData.id,
      pixelName: pixelData.name,
      lastFired: pixelData.last_fired_time
    };
  } catch (error) {
    console.error('Error checking Facebook connection:', error);
    return { 
      success: false, 
      message: `Connection error: ${error.message}` 
    };
  }
}

/**
 * Get diagnostics information from Facebook
 */
async function getEventDiagnostics(pixelId, accessToken) {
  try {
    // Use Facebook Marketing API to get diagnostics
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${pixelId}/diagnostics?access_token=${accessToken}&limit=25`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      console.error('Failed to retrieve diagnostics:', await response.json());
      return null;
    }
    
    const diagData = await response.json();
    
    if (!diagData || !diagData.data) {
      return {
        count: 0,
        diagnostics: [],
        hasCriticalIssues: false
      };
    }
    
    // Check if there are any critical issues
    const hasCriticalIssues = diagData.data.some(issue => 
      issue.severity_level === 'CRITICAL'
    );
    
    return {
      count: diagData.data.length,
      diagnostics: diagData.data,
      hasCriticalIssues
    };
  } catch (error) {
    console.error('Error getting Facebook diagnostics:', error);
    return null;
  }
} 