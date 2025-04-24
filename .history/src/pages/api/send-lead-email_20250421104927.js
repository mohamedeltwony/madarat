import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, phone, email, nationality, destination, formName, pageUrl } = req.body;

  // Basic validation
  if (!phone || !nationality || !destination) {
    return res.status(400).json({ message: 'Missing required form fields.' });
  }

  // Retrieve recipient emails from environment variables
  const recipientEmails = process.env.LEAD_RECIPIENT_EMAILS;
  if (!recipientEmails) {
    console.error('LEAD_RECIPIENT_EMAILS environment variable is not set.');
    return res.status(500).json({ message: 'Server configuration error: Missing recipient emails.' });
  }

  // Retrieve SMTP credentials from environment variables
  const smtpHost = process.env.EMAIL_HOST;
  const smtpPort = process.env.EMAIL_PORT;
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error('Missing one or more SMTP environment variables (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS).');
    return res.status(500).json({ message: 'Server configuration error: Missing SMTP credentials.' });
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10), // Ensure port is an integer
    secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports (like 587)
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    // Optional: Add timeout settings if needed
    // connectionTimeout: 5000, // 5 seconds
    // greetingTimeout: 5000, // 5 seconds
    // socketTimeout: 5000, // 5 seconds
  });

  // Construct email content
  const subject = `New Lead Submission: ${formName || 'Website Form'}`;
  const textBody = `
    You have received a new lead submission:

    Form Name: ${formName || 'N/A'}
    Page URL: ${pageUrl || 'N/A'}
    ------------------------------------
    Name: ${name || 'Not Provided'}
    Phone: ${phone}
    Email: ${email || 'Not Provided'}
    Nationality: ${nationality}
    Destination: ${destination}
    ------------------------------------
  `;
  const htmlBody = `
    <h2>New Lead Submission</h2>
    <p><strong>Form Name:</strong> ${formName || 'N/A'}</p>
    <p><strong>Page URL:</strong> <a href="${pageUrl || '#'}">${pageUrl || 'N/A'}</a></p>
    <hr>
    <p><strong>Name:</strong> ${name || 'Not Provided'}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email || 'Not Provided'}</p>
    <p><strong>Nationality:</strong> ${nationality}</p>
    <p><strong>Destination:</strong> ${destination}</p>
    <hr>
  `;

  // Setup email data
  const mailOptions = {
    from: `"Madarat Website Lead" <${smtpUser}>`, // Sender address (must be authorized)
    to: recipientEmails, // List of receivers (comma-separated string)
    subject: subject, // Subject line
    text: textBody, // Plain text body
    html: htmlBody, // HTML body
  };

  try {
    // Send mail with defined transport object
    console.log('Attempting to send lead email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Lead email sent successfully:', info.messageId);
    // You can optionally check info.accepted and info.rejected arrays
    return res.status(200).json({ message: 'Lead email sent successfully.' });
  } catch (error) {
    console.error('Error sending lead email:', error);
    // Log more details for debugging if possible
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    return res.status(500).json({ message: 'Failed to send lead email.', error: error.message });
  }
}