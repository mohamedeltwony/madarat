# Environment Variables Setup Guide

This document provides guidance on setting up secure environment variables for the application.

## Security Best Practices

1. **Never commit sensitive values to version control**
2. **Use different values for development, staging, and production**
3. **Rotate secrets regularly**
4. **Use strong, generated secrets**

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Email Sending Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_secure_password
LEAD_RECIPIENT_EMAILS=admin@example.com,sales@example.com

# Zapier Webhook URLs - Critical security
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT/YOUR_HOOK_ID/
ZAPIER_PARTIAL_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT/YOUR_PARTIAL_HOOK_ID/

# Security keys (generate with: openssl rand -hex 32)
WEBHOOK_SECRET_KEY=your_random_secret_key_used_for_signatures
CSRF_SECRET=your_random_csrf_secret_key

# Facebook Pixel Integration (if used)
FACEBOOK_PIXEL_ID=your_facebook_pixel_id
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token

# Google Places API Configuration (if needed)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_PLACE_ID=your_google_place_id

# Rate limiting settings
MAX_REQUESTS_PER_MINUTE=10
```

## Production Deployment

For production deployments, set these environment variables securely in your hosting platform:

- **Vercel**: Use the Environment Variables section in project settings
- **Netlify**: Use the Environment Variables section in site settings
- **AWS**: Use Parameter Store or Secrets Manager
- **Azure**: Use App Configuration or Key Vault

## Generating Secure Values

### Generate a Webhook Secret Key

```bash
# Using OpenSSL (recommended)
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Setting up Zapier Webhook Security

1. Create a new Zap in Zapier
2. Choose "Webhooks by Zapier" as the trigger
3. Select "Catch Hook" as the trigger event
4. Copy the webhook URL provided by Zapier
5. Add this URL to your `.env.local` file as `ZAPIER_WEBHOOK_URL`

### Setting up Zapier Partial Submission Webhook

For improved user experience and data collection:
1. Create a separate Zap in Zapier for partial form submissions
2. Choose "Webhooks by Zapier" as the trigger
3. Copy the webhook URL provided by Zapier
4. Add this URL to your `.env.local` file as `ZAPIER_PARTIAL_WEBHOOK_URL`
5. Configure the Zap to handle partial (incomplete) submission data

For enhanced security in production:
1. Implement proper signature verification on both ends
2. Consider using a middleware service like Cloudflare Workers to add additional security

### Setting up CSRF Protection

The application uses Cross-Site Request Forgery (CSRF) protection to secure form submissions:

1. Generate a random secret for CSRF protection:
```bash
openssl rand -hex 32
```

2. Add this secret to your `.env.local` file as `CSRF_SECRET`

3. The application automatically:
   - Generates CSRF tokens for forms
   - Validates tokens on form submission
   - Rejects requests without valid tokens

This protection prevents malicious websites from submitting forms on behalf of your users.

## Updating Secrets

When rotating secrets:
1. Update the new secret in your environment
2. Verify the application works with the new secret
3. Remove/disable the old secret after ensuring everything works

## Troubleshooting

If you encounter issues with environment variables:
1. Restart the development server after changing `.env.local`
2. Verify the variables are being loaded correctly
3. Check for typos in variable names 