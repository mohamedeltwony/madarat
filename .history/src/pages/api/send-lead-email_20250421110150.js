import nodemailer from 'nodemailer';
import UAParser from 'ua-parser-js';

// Helper function to safely get IP address
const getIpAddress = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // 'x-forwarded-for' can be a comma-separated list (client, proxy1, proxy2)
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || null;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Destructure all expected fields from the request body
  const {
    name,
    phone,
    email,
    nationality,
    destination,
    formName,
    pageUrl,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content, // UTM Params
    screenWidth, // Client Info
    fbc,
    fbp, // Facebook Cookies
  } = req.body;

  // Basic validation (keep existing)
  if (!phone || !nationality || !destination) {
    return res.status(400).json({ message: 'Missing required form fields.' });
  }

  // --- Server-side Data Extraction ---
  const ipAddress = getIpAddress(req);
  const userAgentString = req.headers['user-agent'];
  const parser = new UAParser(userAgentString);
  const uaResult = parser.getResult();
  // --- End Server-side Data Extraction ---

  // Retrieve recipient emails from environment variables (keep existing)
  const recipientEmails = process.env.LEAD_RECIPIENT_EMAILS;
  if (!recipientEmails) {
    console.error('LEAD_RECIPIENT_EMAILS environment variable is not set.');
    return res
      .status(500)
      .json({
        message: 'Server configuration error: Missing recipient emails.',
      });
  }

  // Retrieve SMTP credentials from environment variables (keep existing)
  const smtpHost = process.env.EMAIL_HOST;
  const smtpPort = process.env.EMAIL_PORT;
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error(
      'Missing one or more SMTP environment variables (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS).'
    );
    return res
      .status(500)
      .json({
        message: 'Server configuration error: Missing SMTP credentials.',
      });
  }

  // Create transporter (keep existing)
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: parseInt(smtpPort, 10) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  // --- Construct Enhanced Email Content ---
  const subject = `🚀 New Lead: ${formName || 'Website Form'} (${destination || 'N/A'})`;

  // Helper to format optional fields
  const formatField = (label, value) => (value ? `${label}: ${value}\n` : '');
  const formatHtmlField = (label, value) =>
    value ? `<p><strong>${label}:</strong> ${value}</p>` : '';

  const textBody = `
    New Lead Submission:
    ------------------------------------
    Form & Page:
    ${formatField('Form Name', formName)}
    ${formatField('Page URL', pageUrl)}
    ${formatField('Destination', destination)}
    ------------------------------------
    Contact Info:
    ${formatField('Name', name)}
    ${formatField('Phone', phone)}
    ${formatField('Email', email)}
    ${formatField('Nationality', nationality)}
    ------------------------------------
    Campaign Info (UTM):
    ${formatField('Source', utm_source)}
    ${formatField('Medium', utm_medium)}
    ${formatField('Campaign', utm_campaign)}
    ${formatField('Term', utm_term)}
    ${formatField('Content', utm_content)}
    ------------------------------------
    Client Info:
    ${formatField('IP Address', ipAddress)}
    ${formatField('Browser', `${uaResult.browser.name || 'N/A'} ${uaResult.browser.version || ''}`.trim())}
    ${formatField('Operating System', `${uaResult.os.name || 'N/A'} ${uaResult.os.version || ''}`.trim())}
    ${formatField('Device Type', uaResult.device.type || 'desktop')}
    ${formatField('Device Vendor', uaResult.device.vendor)}
    ${formatField('Device Model', uaResult.device.model)}
    ${formatField('Screen Width', screenWidth ? `${screenWidth}px` : null)}
    ------------------------------------
    Facebook Tracking:
    ${formatField('FB Click ID (_fbc)', fbc)}
    ${formatField('FB Browser ID (_fbp)', fbp)}
    ------------------------------------
    Raw User Agent: ${userAgentString || 'N/A'}
  `;

  const htmlBody = `
    <h2>🚀 New Lead Submission</h2>
    <hr>
    <h3>Form & Page Details</h3>
    ${formatHtmlField('Form Name', formName)}
    ${formatHtmlField('Page URL', pageUrl ? `<a href="${pageUrl}">${pageUrl}</a>` : null)}
    ${formatHtmlField('Destination', destination)}
    <hr>
    <h3>Contact Information</h3>
    ${formatHtmlField('Name', name)}
    ${formatHtmlField('Phone', phone)}
    ${formatHtmlField('Email', email)}
    ${formatHtmlField('Nationality', nationality)}
    <hr>
    <h3>Campaign Information (UTM Parameters)</h3>
    ${formatHtmlField('Source', utm_source)}
    ${formatHtmlField('Medium', utm_medium)}
    ${formatHtmlField('Campaign', utm_campaign)}
    ${formatHtmlField('Term', utm_term)}
    ${formatHtmlField('Content', utm_content)}
    <hr>
    <h3>Client Information</h3>
    ${formatHtmlField('IP Address', ipAddress)}
    ${formatHtmlField('Browser', `${uaResult.browser.name || 'N/A'} ${uaResult.browser.version || ''}`.trim())}
    ${formatHtmlField('Operating System', `${uaResult.os.name || 'N/A'} ${uaResult.os.version || ''}`.trim())}
    ${formatHtmlField('Device Type', uaResult.device.type || 'desktop')}
    ${formatHtmlField('Device Vendor', uaResult.device.vendor)}
    ${formatHtmlField('Device Model', uaResult.device.model)}
    ${formatHtmlField('Screen Width', screenWidth ? `${screenWidth}px` : null)}
    <hr>
    <h3>Facebook Tracking</h3>
    ${formatHtmlField('FB Click ID (_fbc)', fbc)}
    ${formatHtmlField('FB Browser ID (_fbp)', fbp)}
    <hr>
    <p><small><strong>Raw User Agent:</strong> ${userAgentString || 'N/A'}</small></p>
  `;
  // --- End Enhanced Email Content ---

  // Setup email data (keep existing, but use new subject/body)
  const mailOptions = {
    from: `"Madarat Lead Bot" <${smtpUser}>`, // Updated sender name
    to: recipientEmails,
    subject: subject,
    text: textBody,
    html: htmlBody,
  };

  try {
    // Send mail (keep existing)
    console.log('Attempting to send enriched lead email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Enriched lead email sent successfully:', info.messageId);
    return res.status(200).json({ message: 'Lead email sent successfully.' });
  } catch (error) {
    console.error('Error sending enriched lead email:', error);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    return res
      .status(500)
      .json({ message: 'Failed to send lead email.', error: error.message });
  }
}
