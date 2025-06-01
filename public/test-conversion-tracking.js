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
      console.warn('⚠️ gtag function not available - Google Ads may not be loaded');
    }
    
    if (!results.dataLayer_available) {
      console.warn('⚠️ dataLayer not available - GTM may not be loaded');
    }
    
    return results;
  },

  /**
   * Monitor dataLayer for lead events
   */
  monitorLeadEvents() {
    console.log('👀 Monitoring dataLayer for lead events...\n');
    
    if (!window.dataLayer) {
      console.error('❌ dataLayer not available');
      return;
    }

    // Check existing events
    const existingLeadEvents = window.dataLayer.filter(event => 
      event.event === 'lead' || 
      event.event === 'google_ads_conversion' ||
      event.event === 'conversion'
    );

    console.log('📊 Existing Lead/Conversion Events:', existingLeadEvents);

    // Monitor new events
    const originalPush = window.dataLayer.push;
    window.dataLayer.push = function(...args) {
      const event = args[0];
      
      if (event && (event.event === 'lead' || event.event === 'google_ads_conversion' || event.event === 'conversion')) {
        console.log('🎯 NEW LEAD/CONVERSION EVENT DETECTED:');
        console.log('Event Type:', event.event);
        console.log('Full Event Data:', event);
        
        if (event.event === 'lead') {
          console.log('✅ LEAD EVENT FOUND! This should show up in GTM debug.');
          console.log('Lead Type:', event.lead_type);
          console.log('Conversion Value:', event.conversion_value);
          console.log('User Type:', event.user_type);
          console.log('Transaction ID:', event.transaction_id);
        }
      }
      
      return originalPush.apply(window.dataLayer, args);
    };

    console.log('✅ Lead event monitoring activated. Any new lead events will be logged above.');
  },

  /**
   * Test the conversion tracking manually
   */
  testConversionTracking() {
    console.log('🧪 Testing Conversion Tracking Manually...\n');
    
    const testData = {
      email: 'test@example.com',
      phone: '0501234567',
      firstName: 'Test',
      lastName: 'User',
      external_id: 'test_' + Date.now(),
      eventId: 'test_event_' + Date.now()
    };

    console.log('📝 Test Data:', testData);

    // Test Google Ads conversion
    if (window.gtag) {
      console.log('🎯 Firing test Google Ads conversion...');
      
      window.gtag('event', 'conversion', {
        'send_to': 'AW-16691848441/Y1RHCJuO-dUZEPnJpZc-',
        'value': 10.0,
        'currency': 'SAR',
        'transaction_id': testData.external_id,
        'user_data': {
          'email_address': testData.email,
          'phone_number': '+966501234567',
          'first_name': testData.firstName,
          'last_name': testData.lastName,
          'country': 'SA'
        }
      });
      
      console.log('✅ Google Ads conversion fired');
    } else {
      console.warn('⚠️ gtag not available for testing');
    }

    // Test lead event to dataLayer
    if (window.dataLayer) {
      console.log('📊 Pushing test lead event to dataLayer...');
      
      window.dataLayer.push({
        'event': 'lead',
        'lead_type': 'quick_test',
        'conversion_value': 10.0,
        'currency': 'SAR',
        'user_type': 'citizen',
        'timestamp': new Date().toISOString(),
        'test': true
      });
      
      console.log('✅ Test lead event pushed to dataLayer');
      console.log('🎯 Check GTM debug - you should see this "lead" event');
    } else {
      console.warn('⚠️ dataLayer not available for testing');
    }
  },

  /**
   * Check current page parameters
   */
  checkPageParameters() {
    console.log('📋 Checking Current Page Parameters...\n');
    
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    
    console.log('🔗 URL Parameters:', params);
    
    const requiredParams = ['email', 'phone', 'firstName', 'lastName', 'external_id'];
    const missingParams = requiredParams.filter(param => !params[param]);
    
    if (missingParams.length > 0) {
      console.warn('⚠️ Missing Parameters:', missingParams);
      console.log('💡 For full testing, visit with parameters like:');
      console.log('?email=test@example.com&phone=0501234567&firstName=Test&lastName=User&external_id=12345');
    } else {
      console.log('✅ All required parameters present');
    }
    
    return params;
  },

  /**
   * Check GTM container status
   */
  checkGTMStatus() {
    console.log('🏷️ Checking GTM Status...\n');
    
    const gtmStatus = {
      dataLayer_exists: typeof window.dataLayer !== 'undefined',
      dataLayer_length: window.dataLayer ? window.dataLayer.length : 0,
      gtm_loaded: typeof window.google_tag_manager !== 'undefined',
      gtag_available: typeof window.gtag === 'function'
    };
    
    console.log('📊 GTM Status:', gtmStatus);
    
    if (window.dataLayer && window.dataLayer.length > 0) {
      console.log('📋 Recent dataLayer Events:');
      window.dataLayer.slice(-5).forEach((event, index) => {
        console.log(`Event ${index + 1}:`, event);
      });
    }
    
    return gtmStatus;
  },

  /**
   * Run comprehensive test
   */
  runFullTest() {
    console.log('🚀 Running Full Conversion Tracking Test...\n');
    console.log('=' .repeat(60));
    
    // Test 1: Setup
    console.log('\n1️⃣ TESTING SETUP');
    this.testGoogleAdsSetup();
    
    // Test 2: GTM Status
    console.log('\n2️⃣ CHECKING GTM STATUS');
    this.checkGTMStatus();
    
    // Test 3: Page Parameters
    console.log('\n3️⃣ CHECKING PAGE PARAMETERS');
    this.checkPageParameters();
    
    // Test 4: Monitor Events
    console.log('\n4️⃣ MONITORING LEAD EVENTS');
    this.monitorLeadEvents();
    
    // Test 5: Manual Test
    console.log('\n5️⃣ RUNNING MANUAL TEST');
    this.testConversionTracking();
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ Full test completed!');
    console.log('🎯 Check GTM debug console for the "lead" event');
    console.log('📊 Monitor the console above for any new events');
    
    return {
      message: 'Full test completed - check console output above',
      next_steps: [
        'Open GTM debug mode',
        'Look for "lead" event in GTM',
        'Verify conversion data in Google Ads',
        'Check dataLayer events in browser console'
      ]
    };
  },

  /**
   * Quick lead event test
   */
  quickLeadTest() {
    console.log('⚡ Quick Lead Event Test...\n');
    
    if (!window.dataLayer) {
      console.error('❌ dataLayer not available');
      return;
    }

    const testLeadEvent = {
      'event': 'lead',
      'lead_type': 'quick_test',
      'conversion_value': 10.0,
      'currency': 'SAR',
      'user_type': 'citizen',
      'timestamp': new Date().toISOString(),
      'test': true
    };

    window.dataLayer.push(testLeadEvent);
    
    console.log('✅ Quick lead event fired!');
    console.log('Event:', testLeadEvent);
    console.log('🎯 Check GTM debug - you should see this "lead" event');
    
    return testLeadEvent;
  }
};

// Auto-run basic checks when script loads
console.log('🔧 Google Ads Conversion Tracking Tester Loaded!');
console.log('📖 Available functions:');
console.log('  - ConversionTrackingTester.runFullTest()');
console.log('  - ConversionTrackingTester.quickLeadTest()');
console.log('  - ConversionTrackingTester.monitorLeadEvents()');
console.log('  - ConversionTrackingTester.testConversionTracking()');
console.log('\n💡 Run ConversionTrackingTester.runFullTest() to start testing');

// Quick status check
if (window.dataLayer) {
  const leadEvents = window.dataLayer.filter(event => event.event === 'lead');
  if (leadEvents.length > 0) {
    console.log(`✅ Found ${leadEvents.length} existing lead event(s) in dataLayer`);
    leadEvents.forEach((event, index) => {
      console.log(`Lead Event ${index + 1}:`, event);
    });
  } else {
    console.log('ℹ️ No lead events found in dataLayer yet');
  }
} else {
  console.warn('⚠️ dataLayer not available - GTM may not be loaded');
} 