/**
 * Google Ads Conversion Tracking Test Utility
 * 
 * This script helps test and debug Google Ads conversion tracking
 * on the Madarat Al-Kon website.
 * 
 * Usage:
 * 1. Open browser console on the thank you page
 * 2. Copy and paste this script
 * 3. Run the test functions
 */

window.ConversionTrackingTester = {
  
  /**
   * Test if Google Ads tracking is properly set up
   */
  testGoogleAdsSetup() {
    console.log('🔍 Testing Google Ads Setup...\n');
    
    const results = {
      gtag_available: typeof window.gtag === 'function',
      dataLayer_available: Array.isArray(window.dataLayer),
      conversion_id: 'AW-16691848441',
      conversion_label: 'Y1RHCJuO-dUZEPnJpZc-'
    };
    
    console.log('✅ Setup Results:', results);
    
    if (!results.gtag_available) {
      console.error('❌ gtag is not available. Check if Google Ads script is loaded.');
    }
    
    if (!results.dataLayer_available) {
      console.error('❌ dataLayer is not available. Check if GTM is properly initialized.');
    }
    
    return results;
  },

  /**
   * Test conversion tracking with sample data
   */
  testConversionTracking(testData = {}) {
    console.log('🧪 Testing Conversion Tracking...\n');
    
    const defaultTestData = {
      email: 'test@example.com',
      phone: '0501234567',
      firstName: 'أحمد',
      lastName: 'محمد',
      external_id: 'test_' + Date.now(),
      event_id: 'test_event_' + Date.now()
    };
    
    const userData = { ...defaultTestData, ...testData };
    
    console.log('📊 Test Data:', userData);
    
    if (typeof window.gtag === 'function') {
      try {
        // Format phone number
        let formattedPhone = userData.phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('5') && formattedPhone.length === 9) {
          formattedPhone = '966' + formattedPhone;
        }
        
        const conversionData = {
          'send_to': 'AW-16691848441/Y1RHCJuO-dUZEPnJpZc-',
          'value': 10.0,
          'currency': 'SAR',
          'transaction_id': userData.external_id,
          'user_data': {
            'email_address': userData.email,
            'phone_number': '+' + formattedPhone,
            'first_name': userData.firstName,
            'last_name': userData.lastName,
            'country': 'SA'
          },
          'custom_parameters': {
            'user_type': 'citizen',
            'nationality': 'مواطن',
            'form_name': 'citizenship_form',
            'lead_quality': 'high',
            'page_type': 'thank_you',
            'lead_source': 'website',
            'conversion_type': 'lead_generation',
            'event_id': userData.event_id,
            'external_id': userData.external_id,
            'timestamp': new Date().toISOString(),
            'page_url': window.location.href,
            'page_title': document.title,
            'user_language': 'ar'
          }
        };
        
        console.log('🚀 Firing test conversion with data:', conversionData);
        
        window.gtag('event', 'conversion', conversionData);
        
        console.log('✅ Test conversion fired successfully!');
        
        // Also test dataLayer push
        if (window.dataLayer) {
          window.dataLayer.push({
            'event': 'google_ads_conversion_test',
            'google_ads_conversion_id': 'AW-16691848441',
            'google_ads_conversion_label': 'Y1RHCJuO-dUZEPnJpZc-',
            'conversion_value': 10.0,
            'currency': 'SAR',
            'transaction_id': userData.external_id,
            'user_type': 'citizen',
            'nationality': 'مواطن',
            'form_name': 'citizenship_form',
            'lead_quality': 'high',
            'conversion_type': 'lead_generation',
            'enhanced_conversion_enabled': true,
            'timestamp': new Date().toISOString(),
            'test_mode': true
          });
          
          console.log('✅ Test data pushed to dataLayer successfully!');
        }
        
        return { success: true, data: conversionData };
        
      } catch (error) {
        console.error('❌ Error firing test conversion:', error);
        return { success: false, error: error.message };
      }
    } else {
      console.error('❌ gtag not available for testing');
      return { success: false, error: 'gtag not available' };
    }
  },

  /**
   * Check current page data availability
   */
  checkPageData() {
    console.log('📋 Checking Page Data Availability...\n');
    
    const urlParams = new URLSearchParams(window.location.search);
    const pageData = {
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      title: document.title,
      query_params: {
        email: urlParams.get('email'),
        phone: urlParams.get('phone'),
        firstName: urlParams.get('firstName'),
        lastName: urlParams.get('lastName'),
        name: urlParams.get('name'),
        external_id: urlParams.get('external_id'),
        eventId: urlParams.get('eventId'),
        nationality: urlParams.get('nationality'),
        fbc: urlParams.get('fbc'),
        fbp: urlParams.get('fbp')
      }
    };
    
    console.log('📊 Page Data:', pageData);
    
    // Check which data is available for enhanced conversions
    const availableData = Object.entries(pageData.query_params)
      .filter(([key, value]) => value !== null)
      .map(([key, value]) => key);
    
    console.log('✅ Available Data Fields:', availableData);
    
    if (availableData.length === 0) {
      console.warn('⚠️ No query parameters found. Enhanced conversions may not work properly.');
    }
    
    return pageData;
  },

  /**
   * Monitor dataLayer events
   */
  monitorDataLayer(duration = 30000) {
    console.log(`👀 Monitoring dataLayer events for ${duration/1000} seconds...\n`);
    
    const originalPush = window.dataLayer.push;
    const events = [];
    
    window.dataLayer.push = function() {
      const event = arguments[0];
      events.push({
        timestamp: new Date().toISOString(),
        event: event
      });
      
      if (event.event && event.event.includes('conversion')) {
        console.log('🎯 Conversion Event Detected:', event);
      }
      
      return originalPush.apply(window.dataLayer, arguments);
    };
    
    setTimeout(() => {
      window.dataLayer.push = originalPush;
      console.log(`📊 Monitoring Complete. Total events captured: ${events.length}`);
      console.log('📋 All Events:', events);
    }, duration);
    
    return events;
  },

  /**
   * Check network requests for Google Ads
   */
  checkNetworkRequests() {
    console.log('🌐 Checking Network Requests...\n');
    
    if (typeof window.performance === 'undefined') {
      console.warn('⚠️ Performance API not available');
      return [];
    }
    
    const entries = window.performance.getEntriesByType('resource');
    const googleAdsRequests = entries.filter(entry => 
      entry.name.includes('googletagmanager.com') || 
      entry.name.includes('google-analytics.com') ||
      entry.name.includes('doubleclick.net')
    );
    
    console.log('📊 Google Ads Related Requests:', googleAdsRequests.length);
    googleAdsRequests.forEach((request, index) => {
      console.log(`${index + 1}. ${request.name} (${request.duration.toFixed(2)}ms)`);
    });
    
    return googleAdsRequests;
  },

  /**
   * Validate phone number formatting
   */
  validatePhoneFormatting(phone) {
    console.log(`📞 Validating Phone Number: ${phone}\n`);
    
    const original = phone;
    let formatted = phone.replace(/\D/g, '');
    
    console.log('🔄 Processing steps:');
    console.log(`1. Original: ${original}`);
    console.log(`2. Digits only: ${formatted}`);
    
    if (formatted.startsWith('5') && formatted.length === 9) {
      formatted = '966' + formatted;
      console.log(`3. Added country code: ${formatted}`);
    }
    
    const final = '+' + formatted;
    console.log(`4. Final format: ${final}`);
    
    const isValid = /^\+966[5][0-9]{8}$/.test(final);
    console.log(`✅ Valid Saudi number: ${isValid}`);
    
    return {
      original,
      formatted: final,
      isValid
    };
  },

  /**
   * Run comprehensive test suite
   */
  runFullTest() {
    console.log('🚀 Running Comprehensive Conversion Tracking Test Suite...\n');
    console.log('=' .repeat(60));
    
    const results = {
      setup: this.testGoogleAdsSetup(),
      pageData: this.checkPageData(),
      networkRequests: this.checkNetworkRequests()
    };
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 Test Suite Results:');
    console.log('✅ Setup Test:', results.setup.gtag_available && results.setup.dataLayer_available ? 'PASS' : 'FAIL');
    console.log('✅ Page Data:', Object.values(results.pageData.query_params).some(v => v !== null) ? 'PASS' : 'FAIL');
    console.log('✅ Network Requests:', results.networkRequests.length > 0 ? 'PASS' : 'FAIL');
    
    console.log('\n🧪 To test actual conversion tracking, run:');
    console.log('ConversionTrackingTester.testConversionTracking()');
    
    console.log('\n👀 To monitor live events, run:');
    console.log('ConversionTrackingTester.monitorDataLayer()');
    
    return results;
  }
};

// Auto-run basic checks if on thank you page
if (window.location.pathname.includes('thank-you')) {
  console.log('🎯 Thank You Page Detected - Running Basic Checks...\n');
  window.ConversionTrackingTester.runFullTest();
}

console.log('🛠️ Conversion Tracking Tester Loaded!');
console.log('📖 Available methods:');
console.log('- ConversionTrackingTester.testGoogleAdsSetup()');
console.log('- ConversionTrackingTester.testConversionTracking()');
console.log('- ConversionTrackingTester.checkPageData()');
console.log('- ConversionTrackingTester.monitorDataLayer()');
console.log('- ConversionTrackingTester.checkNetworkRequests()');
console.log('- ConversionTrackingTester.validatePhoneFormatting(phone)');
console.log('- ConversionTrackingTester.runFullTest()'); 