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

    // The Zapier webhook URL
    const zapierWebhookUrl =
      process.env.ZAPIER_WEBHOOK_URL ||
      'https://hooks.zapier.com/hooks/catch/18799879/2x6aaqq/';
    console.log('Using Zapier webhook URL:', zapierWebhookUrl);

    // Try both JSON and form-encoded formats to ensure compatibility with Zapier

    // 1. First try with JSON format
    try {
      console.log('Attempting JSON format submission to Zapier');
      const jsonResponse = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (jsonResponse.ok) {
        // JSON format worked
        const responseData = await jsonResponse.text();
        console.log('Zapier JSON response status:', jsonResponse.status);
        console.log('Zapier JSON response:', responseData);

        return res.status(jsonResponse.status).json({
          status: jsonResponse.status,
          success: true,
          format: 'json',
          data: responseData,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log('JSON format failed, trying form-urlencoded');
        // Continue to the form-urlencoded approach
      }
    } catch (jsonError) {
      console.error('Error with JSON format:', jsonError.message);
      // Continue to the form-urlencoded approach
    }

    // 2. Try with form-urlencoded format as fallback
    try {
      console.log('Attempting form-urlencoded submission to Zapier');
      // Convert request body to URLSearchParams for form submission
      const formData = new URLSearchParams();
      Object.entries(req.body).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const formResponse = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const formResponseData = await formResponse.text();
      console.log('Zapier form response status:', formResponse.status);
      console.log('Zapier form response:', formResponseData);

      return res.status(formResponse.status).json({
        status: formResponse.status,
        success: formResponse.ok,
        format: 'form-urlencoded',
        data: formResponseData,
        timestamp: new Date().toISOString(),
      });
    } catch (formError) {
      console.error('Error with form-urlencoded format:', formError.message);
      throw formError; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Error in Zapier proxy:', error);

    // Return a proper error response
    return res.status(500).json({
      error: 'Failed to forward request to Zapier',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
