# 🎯 TikTok Events API (CAPI) Integration Guide

## 📋 **Overview**

This guide covers the complete integration of TikTok Events API (Conversions API) for improved event tracking, iOS 14.5+ compliance, and better attribution accuracy.

### **🔗 Integration Details**
- **Pixel ID**: `D17TA5JC77UDOT6CA5FG`
- **Access Token**: `c8947ce24f6cd19daf4073304848a6b9d0cd89ca`
- **API Endpoint**: `https://business-api.tiktok.com/open_api/v1.3/event/track/`
- **Supported Events**: ViewContent, Search, ClickButton, Lead, Purchase, CompleteRegistration

---

## 🚀 **Implementation Summary**

### **✅ What Was Implemented**

1. **Frontend Pixel Code** (`src/pages/_document.js`)
   - Added TikTok Pixel script with automatic page tracking
   - DNS prefetch optimization for faster loading
   - Proper async loading to maintain performance

2. **Backend Events API** (`src/pages/api/tiktok-conversion.js`)
   - Server-side event tracking for all major events
   - SHA-256 hashing for user data privacy
   - Comprehensive error handling and logging
   - Event ID generation for deduplication

3. **Utility Functions** (`src/utils/tiktok.js`)
   - Easy-to-use tracking functions for frontend
   - Automatic user data collection
   - Event-specific helper functions

4. **Testing Infrastructure** (`test-tiktok-capi-integration.js`)
   - Comprehensive test suite for all events
   - Automated validation and error reporting
   - Performance monitoring

5. **Database Setup** (`tiktok-environment-setup.sql`)
   - Event logging tables for monitoring
   - Analytics views for performance tracking
   - Environment variables documentation

---

## 🔧 **Setup Instructions**

### **1. Environment Variables**

Add these to your `.env.local` file:

```bash
# TikTok Events API Configuration
TIKTOK_ACCESS_TOKEN=c8947ce24f6cd19daf4073304848a6b9d0cd89ca
TIKTOK_PIXEL_ID=D17TA5JC77UDOT6CA5FG
TIKTOK_DEBUG=false
```

### **2. Database Setup (Optional)**

Run the SQL script in your Supabase SQL Editor:

```bash
# Execute the SQL script
./tiktok-environment-setup.sql
```

### **3. Test the Integration**

```bash
# Run the test suite
node test-tiktok-capi-integration.js
```

---

## 📊 **Supported Events**

### **1. ViewContent Event**
- **Purpose**: Track page views on important pages
- **Trigger**: Automatically on significant pages or manually
- **Data**: Content type, name, ID, category, value

**Example Usage:**
```javascript
import { trackTikTokViewContent } from '../utils/tiktok';

trackTikTokViewContent(userData, {
  contentType: 'page',
  contentName: 'Turkey Trip Package',
  contentId: 'turkey-trip',
  contentCategory: 'travel_packages',
  value: 2500,
  currency: 'SAR'
});
```

### **2. Search Event**
- **Purpose**: Track search behavior on your site
- **Trigger**: When users search for content
- **Data**: Search string, content context

**Example Usage:**
```javascript
import { trackTikTokSearch } from '../utils/tiktok';

trackTikTokSearch('تركيا سياحة', userData, {
  contentType: 'search',
  value: 0,
  currency: 'SAR'
});
```

### **3. ClickButton Event**
- **Purpose**: Track important button clicks
- **Trigger**: CTA buttons, social media buttons, etc.
- **Data**: Button name, content context

**Example Usage:**
```javascript
import { trackTikTokClickButton } from '../utils/tiktok';

trackTikTokClickButton('احجز الآن', userData, {
  contentType: 'button',
  value: 0,
  currency: 'SAR'
});
```

### **4. Lead Event**
- **Purpose**: Track form submissions and lead generation
- **Trigger**: When forms are submitted
- **Data**: Form details, lead value, description

**Example Usage:**
```javascript
import { trackTikTokLead } from '../utils/tiktok';

trackTikTokLead(userData, {
  contentType: 'lead',
  contentName: 'Trip Inquiry Form',
  contentCategory: 'form_submission',
  value: 0,
  currency: 'SAR',
  price: 2500,
  description: 'Customer inquiry for Turkey trip'
});
```

### **5. Purchase Event**
- **Purpose**: Track completed purchases/bookings
- **Trigger**: After successful payment
- **Data**: Order details, value, IDs

**Example Usage:**
```javascript
import { trackTikTokPurchase } from '../utils/tiktok';

trackTikTokPurchase(userData, {
  contentType: 'purchase',
  value: 2500,
  currency: 'SAR',
  orderId: 'ORDER_12345',
  contentIds: ['turkey_trip_2024']
});
```

### **6. CompleteRegistration Event**
- **Purpose**: Track user registrations
- **Trigger**: After successful account creation
- **Data**: Registration context

---

## 🛡️ **Privacy & Security**

### **Data Hashing**
All PII data is automatically hashed using SHA-256:
- Email addresses
- Phone numbers
- External user IDs

### **User Data Parameters Required**
At least one of these must be provided:
- `email` (hashed)
- `phone` (hashed)
- `external_id` (hashed)
- `ttclid` (TikTok Click ID)
- `ttp` (TikTok Pixel parameter)

### **GDPR Compliance**
- User data is hashed before sending
- Event IDs prevent duplicate tracking
- Optional data retention policies

---

## 📈 **Monitoring & Analytics**

### **Database Monitoring**
Query TikTok events performance:

```sql
-- View analytics (last 30 days)
SELECT * FROM public.tiktok_events_analytics;

-- Monitor recent events
SELECT 
    event_name,
    COUNT(*) as total_events,
    ROUND(AVG(CASE WHEN response_status BETWEEN 200 AND 299 THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate
FROM public.tiktok_events_log 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_name;
```

### **Error Monitoring**
Check for failed events:

```sql
-- Recent errors
SELECT 
    created_at,
    event_name,
    response_status,
    error_message
FROM public.tiktok_events_log 
WHERE response_status >= 400 
    AND created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

---

## 🧪 **Testing**

### **Test Suite Features**
- ✅ Tests all 6 event types
- ✅ Validates API responses
- ✅ Checks environment configuration
- ✅ Performance monitoring
- ✅ Error handling validation

### **Running Tests**
```bash
# Full test suite
node test-tiktok-capi-integration.js

# Test specific event (modify test file)
# Change TEST_EVENTS array to include only desired events
```

### **Expected Test Results**
- ✅ All events should return 200 status
- ✅ Event IDs should be generated
- ✅ TikTok should respond with success
- ✅ User data should be properly hashed

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. "TikTok access token not configured"**
- **Solution**: Add `TIKTOK_ACCESS_TOKEN` to `.env.local`
- **Value**: `c8947ce24f6cd19daf4073304848a6b9d0cd89ca`

#### **2. "Invalid user data: At least one identifier required"**
- **Solution**: Ensure at least one of these is provided:
  - `email`
  - `phone` 
  - `external_id`
  - `ttclid`
  - `ttp`

#### **3. "TikTok Events API request failed"**
- **Check**: Access token validity
- **Check**: Pixel ID matches TikTok Ads Manager
- **Check**: Network connectivity
- **Check**: API endpoint accessibility

#### **4. Events not appearing in TikTok**
- **Wait**: Events may take 1-4 hours to appear
- **Check**: TikTok Events Manager
- **Verify**: Pixel ID is correct
- **Test**: Use test event code for debugging

### **Debug Mode**
Enable debug logging:

```bash
# Add to .env.local
TIKTOK_DEBUG=true
```

### **API Response Codes**
- `200`: Success - Event tracked
- `400`: Bad Request - Invalid data
- `401`: Unauthorized - Invalid access token
- `403`: Forbidden - Access denied
- `500`: Server Error - TikTok API issue

---

## 📋 **Integration Checklist**

### **✅ Backend Setup**
- [x] TikTok Events API endpoint (`/api/tiktok-conversion`)
- [x] Environment variables configured
- [x] User data hashing implemented
- [x] Error handling and logging
- [x] Event ID generation for deduplication

### **✅ Frontend Setup**
- [x] TikTok Pixel code added to `_document.js`
- [x] DNS prefetch optimization
- [x] Utility functions for easy tracking
- [x] Automatic page view tracking

### **✅ Testing & Monitoring**
- [x] Comprehensive test suite
- [x] Database logging and analytics
- [x] Error monitoring queries
- [x] Performance tracking

### **✅ Security & Privacy**
- [x] SHA-256 hashing for PII data
- [x] Secure token handling
- [x] GDPR compliance measures
- [x] Event deduplication

---

## 🎯 **Best Practices**

### **1. Event Implementation**
- ✅ Use server-side tracking for critical events
- ✅ Implement both pixel and CAPI for redundancy
- ✅ Include meaningful event data
- ✅ Use consistent event naming

### **2. User Data Collection**
- ✅ Collect multiple identifiers when possible
- ✅ Hash all PII data before sending
- ✅ Respect user privacy preferences
- ✅ Implement proper consent management

### **3. Performance Optimization**
- ✅ Use async API calls
- ✅ Implement proper error handling
- ✅ Add DNS prefetch for faster loading
- ✅ Monitor API response times

### **4. Monitoring & Maintenance**
- ✅ Regular testing of event tracking
- ✅ Monitor success rates and errors
- ✅ Clean up old log data periodically
- ✅ Update access tokens as needed

---

## 🚀 **Next Steps**

### **1. Production Deployment**
1. Remove test event codes
2. Update environment variables for production
3. Monitor initial event flow
4. Verify events in TikTok Events Manager

### **2. Advanced Implementation**
1. Add custom events for specific actions
2. Implement enhanced e-commerce tracking
3. Set up audience segmentation
4. Create lookalike audiences

### **3. Campaign Optimization**
1. Use tracked events for campaign optimization
2. Set up conversion campaigns
3. Implement dynamic retargeting
4. Monitor ROAS and attribution

---

## 📞 **Support**

### **TikTok Resources**
- [TikTok Events API Documentation](https://business-api.tiktok.com/portal/docs?id=1771100865818625)
- [Pixel Helper Browser Extension](https://chrome.google.com/webstore/detail/tiktok-pixel-helper/)
- [TikTok Ads Manager](https://ads.tiktok.com/)

### **Internal Resources**
- Test Suite: `test-tiktok-capi-integration.js`
- API Endpoint: `/api/tiktok-conversion`
- Utility Functions: `src/utils/tiktok.js`
- Database Setup: `tiktok-environment-setup.sql`

---

**🎉 TikTok Events API integration is now complete and ready for production use!** 