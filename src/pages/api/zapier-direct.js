// Direct API endpoint for fallback in case Zapier proxy has issues
// This just logs the request and returns success

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the full request data for debugging
    console.log('Zapier direct endpoint received request with data:', req.body);

    // Record the request in server logs for manual processing if needed
    const requestId = Math.random().toString(36).substring(2, 15);
    console.log(`Request ID: ${requestId}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(
      `Request data for manual processing: ${JSON.stringify(req.body, null, 2)}`
    );

    // Always return success to the client
    // This way, even if the main Zapier integration fails, we have a record of the submission
    return res.status(200).json({
      status: 200,
      success: true,
      requestId: requestId,
      message: 'Request logged for processing',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in Zapier direct endpoint:', error);

    // Still return a 200 status to avoid confusing the user
    // We want to log the error but not make the form submission appear to fail
    return res.status(200).json({
      status: 200,
      success: true,
      error: 'Internal error, but request was logged',
      timestamp: new Date().toISOString(),
    });
  }
}
