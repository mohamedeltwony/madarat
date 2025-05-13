// Zapier partial submission API endpoint
// This sends partial form data to Zapier as users are filling out the form

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the request for debugging
    console.log('Zapier partial submit received request');

    // The Zapier webhook URL for partial submissions
    const zapierPartialWebhookUrl =
      process.env.ZAPIER_PARTIAL_WEBHOOK_URL ||
      process.env.ZAPIER_WEBHOOK_URL ||
      'https://hooks.zapier.com/hooks/catch/18799879/2ns1zxk/';

    console.log('Using Zapier partial webhook URL:', zapierPartialWebhookUrl);

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
