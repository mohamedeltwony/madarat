# 🌐 Cloudflare Domain Redirect Setup Guide
## Redirect madaratalkon.com → madaratalkon.sa (Campaign-Safe)

## 🎯 **Objective**
Redirect all traffic from `madaratalkon.com` to `madaratalkon.sa` while:
- ✅ Preserving all UTM parameters and tracking codes
- ✅ Maintaining campaign performance
- ✅ Protecting SEO value with proper 301 redirects
- ✅ Ensuring fast global redirects via Cloudflare Edge

## 🏆 **Recommended Method: Transform Rules**

### **Step 1: Access Cloudflare Dashboard**
1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your `madaratalkon.com` domain
3. Navigate to **Rules** → **Transform Rules**

### **Step 2: Create URL Redirect Rule**
1. Click **Create Rule**
2. Select **URL Redirect**
3. Enter rule details:

```
Rule Name: COM to SA Domain Redirect
Description: Redirect all madaratalkon.com traffic to madaratalkon.sa with parameter preservation
```

### **Step 3: Configure Matching Conditions**
```
When incoming requests match:
├── Field: Hostname
├── Operator: equals
└── Value: madaratalkon.com
```

### **Step 4: Configure Redirect Action**
```
URL redirect type: Dynamic
Expression: 
concat("https://madaratalkon.sa", http.request.uri.path, 
  if(http.request.uri.query ne "", concat("?", http.request.uri.query), ""))

Status code: 301 (Permanent Redirect)
Preserve query string: ✅ Enabled (automatic with expression above)
```

### **Step 5: Test Examples**
After setup, these redirects will work:

| Original URL | Redirected URL |
|-------------|----------------|
| `http://madaratalkon.com/georgia-trip` | `https://madaratalkon.sa/georgia-trip` |
| `http://madaratalkon.com/georgia-trip?utm_source=google&utm_campaign=georgia` | `https://madaratalkon.sa/georgia-trip?utm_source=google&utm_campaign=georgia` |
| `http://madaratalkon.com/bosnia-trip?fbclid=abc123` | `https://madaratalkon.sa/bosnia-trip?fbclid=abc123` |
| `http://madaratalkon.com/?gclid=xyz789&utm_medium=cpc` | `https://madaratalkon.sa/?gclid=xyz789&utm_medium=cpc` |

## 🔄 **Alternative Method: Page Rules**

If Transform Rules aren't available in your plan:

### **Step 1: Create Page Rule**
1. Go to **Rules** → **Page Rules**
2. Click **Create Page Rule**

### **Step 2: Configure Page Rule**
```
URL Pattern: madaratalkon.com/*
├── Setting: Forwarding URL
├── Status Code: 301 - Permanent Redirect
└── Destination URL: https://madaratalkon.sa/$1
```

**Note**: Page Rules have limited parameter handling compared to Transform Rules.

## 📊 **Campaign Tracking Preservation**

### **UTM Parameters Protected** ✅
- `utm_source` (Google, Facebook, etc.)
- `utm_medium` (cpc, social, email)
- `utm_campaign` (campaign names)
- `utm_content` (ad content)
- `utm_term` (keywords)

### **Platform-Specific Tracking** ✅
- **Google Ads**: `gclid`, `gbraid`, `wbraid`
- **Facebook**: `fbclid`
- **Snapchat**: `sc_click_id`
- **TikTok**: `ttclid`
- **Custom**: Any parameter you use

### **Example Preserved Redirect**
```
Original: 
http://madaratalkon.com/georgia-trip?utm_source=snapchat&utm_campaign=georgia_summer&sc_click_id=abc123&fbclid=xyz789

Redirected:
https://madaratalkon.sa/georgia-trip?utm_source=snapchat&utm_campaign=georgia_summer&sc_click_id=abc123&fbclid=xyz789
```

## 🧪 **Testing Your Setup**

### **Method 1: Browser Testing**
1. Open incognito/private browser window
2. Visit: `http://madaratalkon.com/georgia-trip?utm_source=test&utm_campaign=redirect_test`
3. Verify redirect to: `https://madaratalkon.sa/georgia-trip?utm_source=test&utm_campaign=redirect_test`

### **Method 2: cURL Testing**
```bash
curl -I "http://madaratalkon.com/georgia-trip?utm_source=test"
```

**Expected Response:**
```
HTTP/1.1 301 Moved Permanently
Location: https://madaratalkon.sa/georgia-trip?utm_source=test
```

### **Method 3: Online Redirect Checker**
Use tools like:
- [Redirect Checker](https://httpstatus.io/)
- [SEMrush Redirect Tracer](https://www.semrush.com/redirect-tracer/)

## 📈 **Impact on Active Campaigns**

### **✅ What Will Continue Working**
- All existing campaign URLs will redirect properly
- UTM tracking will remain intact
- Conversion tracking pixels will fire correctly
- Attribution models will continue working

### **🔄 What You Should Update (Optional)**
- **Google Ads**: Update destination URLs to .sa domain
- **Facebook Ads**: Update landing page URLs
- **Email campaigns**: Update links in future emails
- **Social media**: Update bio links

### **⚠️ Temporary Considerations**
- **First 24-48 hours**: Monitor campaign performance closely
- **Analytics**: Expect slight data fragmentation during transition
- **Conversion tracking**: May see slight delays as systems adapt

## 🎯 **Best Practices**

### **DNS Configuration**
Ensure both domains point to Cloudflare:
```
madaratalkon.com → Cloudflare (Orange cloud ☁️)
madaratalkon.sa → Cloudflare (Orange cloud ☁️)
```

### **SSL/TLS Configuration**
1. **SSL/TLS** → **Overview**
2. Set to **Full (strict)** for both domains
3. Verify SSL certificates are active

### **Caching Rules**
1. **Caching** → **Configuration**
2. Set appropriate cache rules for .sa domain
3. Consider purging cache after redirect setup

## 🔍 **Troubleshooting**

### **Common Issues**

**Issue**: Redirect loop
**Solution**: Ensure .sa domain isn't also redirecting back to .com

**Issue**: Parameters not preserved
**Solution**: Use Transform Rules instead of Page Rules

**Issue**: HTTPS not enforced
**Solution**: Add "Always Use HTTPS" rule

### **Monitoring Tools**
- **Cloudflare Analytics**: Monitor redirect traffic
- **Google Analytics**: Track cross-domain behavior
- **Google Search Console**: Monitor both domains

## 📋 **Post-Setup Checklist**

### **Immediate (0-24 hours)**
- [ ] Test redirect functionality
- [ ] Verify UTM parameter preservation
- [ ] Check SSL certificate validity
- [ ] Monitor campaign performance

### **Short-term (1-7 days)**
- [ ] Update campaign URLs where possible
- [ ] Monitor conversion tracking
- [ ] Check analytics data flow
- [ ] Update internal links

### **Long-term (1-4 weeks)**
- [ ] Complete campaign URL migration
- [ ] Monitor SEO impact
- [ ] Update all marketing materials
- [ ] Consider canonical tags if needed

## 🚀 **Ready to Implement?**

1. **Choose your method**: Transform Rules (recommended) or Page Rules
2. **Set up the redirect**: Follow the step-by-step guide above
3. **Test thoroughly**: Use the testing methods provided
4. **Monitor closely**: Watch campaign performance for first 48 hours
5. **Update gradually**: Migrate campaign URLs over time

Your campaign tracking will remain intact, and users will seamlessly redirect to the .sa domain! 🎉

## 📞 **Need Help?**

If you encounter any issues:
1. Check Cloudflare's **Security** → **Events** for blocked requests
2. Review **Analytics** → **Security** for redirect statistics
3. Use **Network** tab in browser dev tools to debug redirects
4. Contact Cloudflare support if rules aren't working as expected 