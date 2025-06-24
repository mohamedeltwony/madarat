/**
 * TikTok Events API (CAPI) Integration Test
 * Tests all TikTok event types and validates API responses
 * 
 * Run with: node test-tiktok-capi-integration.js
 */

const fetch = require('node-fetch');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000', // Change to your domain for production testing
  apiEndpoint: '/api/tiktok-conversion',
  pixelId: 'D17TA5JC77UDOT6CA5FG',
  testEventCode: 'TEST12345', // Optional test event code
  timeout: 10000 // 10 seconds timeout
};

// Test user data
const TEST_USER_DATA = {
  email: 'test@madaratalkon.com',
  phone: '+966501234567',
  external_id: 'test_user_123',
  firstName: 'Ahmed',
  url: 'https://madaratalkon.com/test-page',
  user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Test events to validate
const TEST_EVENTS = [
  {
    name: 'ViewContent',
    userData: TEST_USER_DATA,
    customData: {
      content_type: 'page',
      content_name: 'Test Trip Page',
      content_id: 'turkey-trip',
      content_category: 'travel_packages',
      value: 2500,
      currency: 'SAR',
      url: 'https://madaratalkon.com/turkey-trip'
    }
  },
  {
    name: 'Search',
    userData: TEST_USER_DATA,
    customData: {
      search_string: 'تركيا سياحة',
      content_type: 'search',
      content_name: 'Search: تركيا سياحة',
      content_id: 'search',
      value: 0,
      currency: 'SAR'
    }
  },
  {
    name: 'ClickButton',
    userData: TEST_USER_DATA,
    customData: {
      content_type: 'button',
      content_name: 'احجز الآن',
      content_id: 'book_now_button',
      value: 0,
      currency: 'SAR'
    }
  },
  {
    name: 'Lead',
    userData: {
      ...TEST_USER_DATA,
      firstName: 'محمد',
      nationality: 'Saudi'
    },
    customData: {
      content_type: 'lead',
      content_name: 'Trip Inquiry Form',
      content_id: 'trip_inquiry',
      content_category: 'form_submission',
      value: 0,
      currency: 'SAR',
      price: 2500,
      description: 'Turkey trip inquiry from website form'
    }
  },
  {
    name: 'Purchase',
    userData: TEST_USER_DATA,
    customData: {
      content_type: 'purchase',
      content_name: 'Turkey Trip Booking',
      content_id: 'turkey_trip_2024',
      value: 2500,
      currency: 'SAR',
      order_id: 'ORDER_12345',
      content_ids: ['turkey_trip_2024']
    }
  },
  {
    name: 'CompleteRegistration',
    userData: TEST_USER_DATA,
    customData: {
      content_type: 'registration',
      content_name: 'User Registration',
      content_id: 'registration',
      value: 0,
      currency: 'SAR'
    }
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function makeRequest(eventData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TEST_CONFIG.timeout);

  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}${TEST_CONFIG.apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventData,
        testEventCode: TEST_CONFIG.testEventCode
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const result = await response.json();
    return {
      success: response.ok,
      status: response.status,
      data: result,
      response
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout',
        timeout: true
      };
    }
    
    return {
      success: false,
      error: error.message,
      networkError: true
    };
  }
}

async function testEvent(eventConfig, index) {
  colorLog('cyan', `\n[${ index + 1}/${TEST_EVENTS.length}] Testing ${eventConfig.name} event...`);
  
  console.log('📤 Sending data:', {
    eventName: eventConfig.name,
    hasEmail: !!eventConfig.userData.email,
    hasPhone: !!eventConfig.userData.phone,
    hasExternalId: !!eventConfig.userData.external_id,
    customDataKeys: Object.keys(eventConfig.customData)
  });

  const result = await makeRequest({
    eventName: eventConfig.name,
    userData: eventConfig.userData,
    customData: eventConfig.customData
  });

  if (result.success) {
    colorLog('green', '✅ SUCCESS');
    console.log('📨 Response:', {
      eventId: result.data.eventId,
      originalEventName: result.data.originalEventName,
      mappedEventName: result.data.mappedEventName,
      tiktokResponse: result.data.response
    });
    return { success: true, eventName: eventConfig.name };
  } else {
    colorLog('red', '❌ FAILED');
    
    if (result.timeout) {
      console.log('⏱️  Request timed out');
    } else if (result.networkError) {
      console.log('🌐 Network error:', result.error);
    } else {
      console.log('📥 Error response:', {
        status: result.status,
        error: result.data?.error || result.error,
        details: result.data?.details
      });
    }
    
    return { success: false, eventName: eventConfig.name, error: result.error || result.data?.error };
  }
}

async function runHealthCheck() {
  colorLog('blue', '🏥 Running health check...');
  
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/health`, {
      timeout: 5000
    });
    
    if (response.ok) {
      colorLog('green', '✅ Server is running');
      return true;
    } else {
      colorLog('red', '❌ Server health check failed');
      return false;
    }
  } catch (error) {
    colorLog('red', '❌ Cannot connect to server');
    console.log('Error:', error.message);
    return false;
  }
}

async function runTests() {
  colorLog('bright', '🧪 TikTok Events API (CAPI) Integration Test');
  colorLog('bright', '='.repeat(50));
  
  console.log('📋 Test Configuration:');
  console.log(`   Base URL: ${TEST_CONFIG.baseUrl}`);
  console.log(`   API Endpoint: ${TEST_CONFIG.apiEndpoint}`);
  console.log(`   Pixel ID: ${TEST_CONFIG.pixelId}`);
  console.log(`   Test Events: ${TEST_EVENTS.length}`);
  
  // Health check
  const serverHealthy = await runHealthCheck();
  if (!serverHealthy) {
    colorLog('red', '\n❌ Aborting tests - server not accessible');
    process.exit(1);
  }

  // Run tests
  const results = [];
  
  for (let i = 0; i < TEST_EVENTS.length; i++) {
    const result = await testEvent(TEST_EVENTS[i], i);
    results.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  colorLog('bright', '\n📊 TEST SUMMARY');
  colorLog('bright', '='.repeat(30));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  colorLog('green', `✅ Successful: ${successful.length}/${results.length}`);
  if (successful.length > 0) {
    successful.forEach(r => console.log(`   - ${r.eventName}`));
  }
  
  if (failed.length > 0) {
    colorLog('red', `❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => console.log(`   - ${r.eventName}: ${r.error || 'Unknown error'}`));
  }

  // Recommendations
  colorLog('bright', '\n💡 RECOMMENDATIONS');
  colorLog('bright', '='.repeat(20));
  
  if (successful.length === results.length) {
    colorLog('green', '🎉 All tests passed! Your TikTok Events API integration is working correctly.');
    console.log('\n📋 Next steps:');
    console.log('   1. ✅ Remove test event code for production');
    console.log('   2. ✅ Add proper error handling in your frontend');
    console.log('   3. ✅ Monitor TikTok Events Manager for events');
    console.log('   4. ✅ Set up conversion optimization campaigns');
  } else if (successful.length > 0) {
    colorLog('yellow', '⚠️  Partial success - some events are working.');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check environment variables (TIKTOK_ACCESS_TOKEN, TIKTOK_PIXEL_ID)');
    console.log('   2. Verify TikTok Events API access token is valid');
    console.log('   3. Check server logs for detailed error messages');
    console.log('   4. Ensure proper user data is being sent');
  } else {
    colorLog('red', '💥 All tests failed - check your configuration.');
    console.log('\n🚨 Urgent fixes needed:');
    console.log('   1. Verify TikTok access token is correct');
    console.log('   2. Check pixel ID matches your TikTok account');
    console.log('   3. Ensure API endpoint is accessible');
    console.log('   4. Check network connectivity and firewall settings');
  }

  // Environment check
  colorLog('bright', '\n🔧 ENVIRONMENT CHECK');
  colorLog('bright', '='.repeat(20));
  
  console.log('Required environment variables:');
  console.log(`   TIKTOK_ACCESS_TOKEN: ${process.env.TIKTOK_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
  console.log(`   TIKTOK_PIXEL_ID: ${process.env.TIKTOK_PIXEL_ID ? '✅ Set' : '❌ Missing'}`);
  
  if (!process.env.TIKTOK_ACCESS_TOKEN || !process.env.TIKTOK_PIXEL_ID) {
    colorLog('yellow', '\n⚠️  Environment variables missing. Add to your .env.local:');
    console.log('   TIKTOK_ACCESS_TOKEN=c8947ce24f6cd19daf4073304848a6b9d0cd89ca');
    console.log('   TIKTOK_PIXEL_ID=D17TA5JC77UDOT6CA5FG');
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

// Handle process termination
process.on('SIGINT', () => {
  colorLog('yellow', '\n⚠️  Test interrupted by user');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  colorLog('red', '💥 Unhandled rejection:');
  console.error(reason);
  process.exit(1);
});

// Run tests
runTests().catch(error => {
  colorLog('red', '💥 Test suite failed:');
  console.error(error);
  process.exit(1);
}); 