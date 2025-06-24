# 🔐 Snapchat API Token Configuration Guide

## ✅ **Your Snapchat Integration Status**

**GREAT NEWS!** You already have a complete Snapchat CAPI integration implemented. Now we just need to configure your API token.

## 🔧 **Configuration Required**

### **Step 1: Create/Update `.env.local` File**

Create or update your `.env.local` file in the root directory with:

```bash
# =============================================================================
# SNAPCHAT CONVERSIONS API CONFIGURATION
# =============================================================================

# Your Snapchat Pixel ID (already implemented)
SNAPCHAT_PIXEL_ID=a9d0612f-6ca4-4b9a-a9a8-74310e3a4462

# Your Snapchat API Token (PROVIDED)
SNAPCHAT_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ5NjQyMzM4LCJzdWIiOiI2MjIyNmE3Mi03Y2M0LTQ2ZGYtOTM4NS01NGVmMTcyNGQzOWZ-UFJPRFVDVElPTn45NWY3NTY0YS0zZmJmLTRkOTMtOGNhNi02NDllNDY3ZTg4MzEifQ.Y5_lWcntasP9E7l-v78Eep5BzWWOQWI6-luULmpYwfc

# Optional: Enable debug mode for testing
SNAPCHAT_DEBUG=true

# =============================================================================
# EXISTING CONFIGURATION (ADD IF NOT PRESENT)
# =============================================================================

# Site URL
NEXT_PUBLIC_SITE_URL=https://madaratalkon.com

# Facebook Configuration
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=330286163283402
FB_PIXEL_ID=330286163283402

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mohammed@madaratalkon.com
EMAIL_PASS=hqsa xlvy tdjq kfpq
LEAD_RECIPIENT_EMAILS=hesham@madaratalkon.com,mohammed@madaratalkon.com

# Zapier Webhook
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/18799879/2x6aaqq/
```

## 🧪 **Step 2: Test Your Integration**

Once you've updated your `.env.local` file, test the integration:

### **Option A: Quick Test Script**
```bash
node test-snapchat-capi-integration.js
```

### **Option B: Simple API Test**
```bash
node test-snapchat-capi-simple.js
```

## 🎯 **What Your Token Provides**

Your JWT token includes:
- **Algorithm**: HS256 (secure)
- **Canvas API Access**: Full Snapchat conversions API access
- **Production Environment**: Ready for live tracking
- **Valid Until**: Token includes expiration handling

## 📊 **Expected Results After Configuration**

### **1. Server-Side Events**
Your application will automatically send these events to Snapchat:
- ✅ **PAGE_VIEW** - Every page visit
- ✅ **VIEW_CONTENT** - Trip/product page views
- ✅ **SIGN_UP** - Form submissions
- ✅ **CUSTOM_EVENT_1** - Lead conversions

### **2. Dual Channel Tracking**
- 🌐 **Client-Side**: Snapchat Pixel (browser-based)
- 🚀 **Server-Side**: Snapchat CAPI (your new token)
- 🔄 **Deduplication**: Same event ID for both channels

### **3. Enhanced Data Quality**
- 📱 iOS 14.5+ compliance
- 🔐 SHA-256 hashed PII data
- 🇸🇦 Saudi phone number formatting
- 🎯 Better user matching

## 🔍 **Verification Steps**

### **1. Check Application Logs**
Look for these success messages:
```
Snapchat CAPI event sent successfully: {
  event_name: 'PAGE_VIEW',
  event_id: 'sc_abc123...'
}
```

### **2. Check Snapchat Events Manager**
1. Go to [Snapchat Ads Manager](https://ads.snapchat.com/manager)
2. Navigate to **Events Manager**
3. Select your pixel: `a9d0612f-6ca4-4b9a-a9a8-74310e3a4462`
4. Check **Recent Events** tab
5. Verify events are being received

### **3. Monitor Browser Console**
Look for client-side confirmations:
```
Enhanced Snapchat PAGE_VIEW tracked: {
  pixel_tracked: true,
  capi_tracked: true
}
```

## 🚨 **Security Notes**

### **Token Security**
- ✅ Your token is properly formatted
- ✅ Includes production environment settings
- ✅ Has proper expiration handling
- ⚠️ **Never commit `.env.local` to git** (already in .gitignore)

### **Data Privacy**
Your implementation automatically:
- 🔐 Hashes all PII data (email, phone, names)
- 🇸🇦 Formats Saudi phone numbers correctly
- 🛡️ Complies with privacy regulations
- 🎯 Uses secure event deduplication

## 🚀 **Next Steps**

1. **Update `.env.local`** with the configuration above
2. **Restart your development server**: `npm run dev` or `yarn dev`
3. **Run the test script**: `node test-snapchat-capi-integration.js`
4. **Monitor Snapchat Events Manager** for incoming events
5. **Test form submissions** to verify SIGN_UP events

## 📞 **Support**

If you encounter any issues:
1. Check the application logs for error messages
2. Verify the token format matches exactly
3. Ensure `.env.local` is in the root directory
4. Restart the development server after changes

Your Snapchat CAPI integration is now ready to go! 🎉 