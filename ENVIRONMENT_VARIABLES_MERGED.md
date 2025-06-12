# 🔧 Merged Environment Variables Configuration

## 📋 **Overview**

This document contains the merged configuration from your four environment files:
- `.env` (shared variables)
- `.env.local` (development variables)
- `.env.local.example` (template variables) 
- `.env.production.local` (production variables)

## 📄 **Complete Merged .env.local File**

Copy the content below to your `.env.local` file:

```bash
# =============================================================================
# MERGED ENVIRONMENT CONFIGURATION
# Combined from .env, .env.local, .env.local.example, and .env.production.local
# =============================================================================

# -----------------------------------------------------------------------------
# NEXT.JS PUBLIC VARIABLES (Available in Browser)
# -----------------------------------------------------------------------------

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://madaratalkon.com

# Facebook Pixel (Client-side)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=330286163283402

# Google Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=your-ga-id-here

# -----------------------------------------------------------------------------
# ZAPIER WEBHOOKS
# -----------------------------------------------------------------------------

# Main form submission webhook (from your .env file)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/18799879/2x6aaqq/

# Partial form submission webhook (from .env.local.example)
ZAPIER_PARTIAL_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your-partial-hook-id/

# Webhook security
WEBHOOK_SECRET_KEY=your-webhook-secret-key-here

# -----------------------------------------------------------------------------
# FACEBOOK INTEGRATION
# -----------------------------------------------------------------------------

# Facebook Pixel ID (Server-side) - from your .env.local
FB_PIXEL_ID=330286163283402

# Facebook Access Token for Conversions API (from .env.local.example)
FB_ACCESS_TOKEN=your-facebook-access-token-here
FACEBOOK_ACCESS_TOKEN=your-facebook-access-token-here

# Facebook Test Event Code (for development/testing)
FB_TEST_EVENT_CODE=your-test-event-code-here

# -----------------------------------------------------------------------------
# SNAPCHAT INTEGRATION (NEW CAPI INTEGRATION)
# -----------------------------------------------------------------------------

# Snapchat Pixel ID (your existing pixel)
SNAPCHAT_PIXEL_ID=a9d0612f-6ca4-4b9a-a9a8-74310e3a4462

# Snapchat Access Token for Conversions API (NEW - needs to be added)
SNAPCHAT_ACCESS_TOKEN=your-snapchat-access-token-here

# Snapchat Debug Mode (optional)
SNAPCHAT_DEBUG=false

# -----------------------------------------------------------------------------
# GOOGLE SERVICES
# -----------------------------------------------------------------------------

# Google Places API for reviews (found in code)
GOOGLE_PLACES_API_KEY=your-google-places-api-key-here
GOOGLE_PLACE_ID=your-google-place-id-here

# -----------------------------------------------------------------------------
# EMAIL CONFIGURATION
# -----------------------------------------------------------------------------

# SMTP Settings for email notifications (found in code)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Lead notification recipients (comma-separated)
LEAD_RECIPIENT_EMAILS=admin@madaratalkon.com,leads@madaratalkon.com

# -----------------------------------------------------------------------------
# WORDPRESS INTEGRATION
# -----------------------------------------------------------------------------

# WordPress API Configuration (found in code)
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_PLUGIN_SEO=true

# -----------------------------------------------------------------------------
# DEVELOPMENT & TESTING
# -----------------------------------------------------------------------------

# Enable/disable specific features in development
DEBUG_MODE=false
ENABLE_ANALYTICS_DEBUG=false

# -----------------------------------------------------------------------------
# SECURITY & COMPLIANCE
# -----------------------------------------------------------------------------

# Webhook security
WEBHOOK_SECRET_KEY=development-only-key
```

## 🗂️ **File Structure Recommendations**

### **1. .env (Shared/Public Variables)**
Keep only non-sensitive, shared variables:
```bash
# Zapier Webhook (can be public in your case)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/18799879/2x6aaqq/

# Public Site URL
NEXT_PUBLIC_SITE_URL=https://madaratalkon.com

# WordPress Settings
WORDPRESS_PLUGIN_SEO=true
```

### **2. .env.local (Development Variables)**
All development-specific and sensitive variables:
```bash
# Facebook Integration
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=330286163283402
FB_PIXEL_ID=330286163283402
FB_ACCESS_TOKEN=your-facebook-access-token-here
FB_TEST_EVENT_CODE=your-test-event-code-here

# Snapchat Integration
SNAPCHAT_PIXEL_ID=a9d0612f-6ca4-4b9a-a9a8-74310e3a4462
SNAPCHAT_ACCESS_TOKEN=your-snapchat-access-token-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Google Services
GOOGLE_PLACES_API_KEY=your-google-places-api-key-here
GOOGLE_PLACE_ID=your-google-place-id-here
```

### **3. .env.local.example (Template)**
Updated template for other developers:
```bash
# Zapier Webhooks
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your-hook-id/
ZAPIER_PARTIAL_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your-partial-hook-id/

# Facebook API
FB_ACCESS_TOKEN=your-facebook-access-token-here
FB_PIXEL_ID=330286163283402
FB_TEST_EVENT_CODE=your-test-event-code-here

# Snapchat API (NEW)
SNAPCHAT_ACCESS_TOKEN=your-snapchat-access-token-here
SNAPCHAT_PIXEL_ID=a9d0612f-6ca4-4b9a-a9a8-74310e3a4462

# Google Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=your-ga-id-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-app-password
LEAD_RECIPIENT_EMAILS=admin@domain.com

# Google Services
GOOGLE_PLACES_API_KEY=your-google-places-api-key-here
GOOGLE_PLACE_ID=your-google-place-id-here
```

### **4. .env.production.local (Production Variables)**
Production-specific overrides:
```bash
# Production Site URL
NEXT_PUBLIC_SITE_URL=https://madaratalkon.com

# Production Facebook
FB_ACCESS_TOKEN=production-facebook-access-token
# Remove or comment out FB_TEST_EVENT_CODE for production

# Production Snapchat
SNAPCHAT_ACCESS_TOKEN=production-snapchat-access-token

# Production Email
EMAIL_USER=production-email@madaratalkon.com
EMAIL_PASS=production-email-password

# Disable debug modes
DEBUG_MODE=false
SNAPCHAT_DEBUG=false
```

## 🚨 **Critical Actions Needed**

### **1. Get Missing API Tokens**

#### **Snapchat Access Token**
1. Go to [Snapchat Ads Manager](https://ads.snapchat.com/manager)
2. Navigate to **Events Manager**
3. Select your pixel (`a9d0612f-6ca4-4b9a-a9a8-74310e3a4462`)
4. Go to **Conversions API** section
5. Generate an **Access Token**
6. Add to `SNAPCHAT_ACCESS_TOKEN`

#### **Facebook Access Token**
1. Go to [Facebook Business Manager](https://business.facebook.com)
2. Navigate to **Events Manager**
3. Select your pixel (`330286163283402`)
4. Go to **Settings** > **Conversions API**
5. Generate an **Access Token**
6. Add to `FB_ACCESS_TOKEN`

### **2. Update Your Files**

Run these commands to update your environment files:

```bash
# Backup existing files
cp .env.local .env.local.backup
cp .env .env.backup

# Copy the merged content above to .env.local
# Then add your real API tokens
```

### **3. Test the Integration**

After updating your environment variables:

```bash
# Test Snapchat CAPI integration
node test-snapchat-capi-integration.js

# Check for missing variables
npm run dev
# Look for any "Missing environment variable" errors in the console
```

## 🔍 **Environment Variables Found in Code**

Based on the code analysis, these variables are actively used:

### **Currently Used**
- ✅ `ZAPIER_WEBHOOK_URL` - Found in your .env
- ✅ `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` - Found in your .env.local  
- ✅ `FB_PIXEL_ID` - Found in your .env.local
- ❌ `FB_ACCESS_TOKEN` - Missing (needed for Facebook CAPI)
- ❌ `SNAPCHAT_ACCESS_TOKEN` - Missing (needed for Snapchat CAPI)
- ❌ `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` - Missing (for email notifications)

### **Optional but Recommended**
- `FB_TEST_EVENT_CODE` - For testing Facebook events
- `GOOGLE_PLACES_API_KEY` - For Google Reviews
- `LEAD_RECIPIENT_EMAILS` - For lead notifications

## 🎯 **Next Steps**

1. **Copy the merged configuration** to your `.env.local` file
2. **Get the missing API tokens** (Snapchat and Facebook access tokens)
3. **Test the Snapchat CAPI integration** using the test script
4. **Update production variables** in `.env.production.local`
5. **Commit the updated `.env.local.example`** template for other developers

Your environment setup will then be complete and ready for the new Snapchat CAPI integration! 🚀 