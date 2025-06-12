/**
 * Test Script for Snapchat SIGN_UP Integration
 * Tests both Pixel and CAPI for the updated citizen form submission
 */
require('dotenv').config();
const puppeteer = require('puppeteer');

async function testSnapchatSignUp() {
  let browser;
  
  try {
    console.log('🧪 Testing Snapchat SIGN_UP Integration');
    console.log('=====================================\n');

    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Track network requests
    const snapchatRequests = [];
    page.on('request', request => {
      if (request.url().includes('snapchat') || request.url().includes('tr.snapchat.com')) {
        snapchatRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Capture console logs
    const logs = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Snapchat') && text.includes('SIGN_UP')) {
        logs.push({
          message: text,
          timestamp: new Date().toISOString()
        });
      }
    });

    console.log('1️⃣ Testing Thank You Citizen Page with SIGN_UP...');
    
    // Navigate to thank you page with test data
    const testUrl = 'http://localhost:3000/thank-you-citizen?' + new URLSearchParams({
      email: 'test@example.com',
      phone: '0555123456',
      firstName: 'أحمد',
      lastName: 'السعودي',
      external_id: 'signup_test_' + Date.now(),
      trip_source: 'london-scotland-trip'
    }).toString();

    await page.goto(testUrl);
    console.log('📍 Navigated to:', testUrl);

    // Wait for tracking to complete
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n2️⃣ Testing CAPI Direct Call...');
    
    // Test CAPI endpoint directly
    const capiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/snapchat-conversion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'SIGN_UP',
            userData: {
              email: 'test@example.com',
              phone: '0555123456',
              firstName: 'أحمد',
              lastName: 'السعودي'
            },
            customData: {
              sign_up_method: 'citizenship_form',
              value: '100',
              currency: 'SAR',
              item_category: 'citizenship_services'
            }
          })
        });
        
        const result = await response.json();
        return {
          success: response.ok,
          status: response.status,
          result: result
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('CAPI Response:', capiResponse);

    console.log('\n3️⃣ Testing Global Function...');
    
    // Test global trackSnapchatSignUp function
    const globalFunctionTest = await page.evaluate(async () => {
      if (typeof window.trackSnapchatSignUp === 'function') {
        try {
          const result = await window.trackSnapchatSignUp({
            userData: {
              email: 'global@test.com',
              phone: '0555987654',
              firstName: 'Global',
              lastName: 'Test'
            },
            price: '150',
            currency: 'SAR',
            sign_up_method: 'global_function_test'
          });
          
          return { success: true, result };
        } catch (error) {
          return { success: false, error: error.message };
        }
      } else {
        return { success: false, error: 'trackSnapchatSignUp function not available' };
      }
    });

    console.log('Global Function Test:', globalFunctionTest);

    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log(`📱 Console Logs Captured: ${logs.length}`);
    logs.forEach((log, index) => {
      console.log(`  ${index + 1}. [${log.timestamp}] ${log.message}`);
    });

    console.log(`\n🌐 Snapchat Requests: ${snapchatRequests.length}`);
    snapchatRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. [${req.timestamp}] ${req.method} ${req.url}`);
    });

    console.log('\n✅ Test Results:');
    console.log(`• Page Load: Success`);
    console.log(`• CAPI Direct: ${capiResponse.success ? 'Success' : 'Failed'}`);
    console.log(`• Global Function: ${globalFunctionTest.success ? 'Success' : 'Failed'}`);
    console.log(`• Network Requests: ${snapchatRequests.length}`);
    console.log(`• Console Logs: ${logs.length}`);

    if (capiResponse.success && capiResponse.result.response?.status === 'VALID') {
      console.log('\n🎉 SIGN_UP Integration Test: PASSED');
    } else {
      console.log('\n❌ SIGN_UP Integration Test: NEEDS REVIEW');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('\n🏁 Test completed.');
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testSnapchatSignUp(); 