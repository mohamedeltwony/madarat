/**
 * Snapchat CAPI Integration Test Script
 * Tests both pixel and server-side CAPI events with deduplication
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const puppeteer = require('puppeteer');

async function testSnapchatCAPIIntegration() {
  console.log('🚀 Testing Snapchat CAPI (Conversions API) Integration...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  
  const page = await browser.newPage();
  
  // Track console logs for Snapchat events
  const snapchatEvents = [];
  const capiEvents = [];
  
  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('Snapchat') && (text.includes('pixel') || text.includes('CAPI'))) {
      if (text.includes('CAPI')) {
        capiEvents.push({
          timestamp: new Date().toISOString(),
          message: text
        });
        console.log(`📤 CAPI Event: ${text}`);
      } else {
        snapchatEvents.push({
          timestamp: new Date().toISOString(),
          message: text
        });
        console.log(`📱 Pixel Event: ${text}`);
      }
    }
  });
  
  // Intercept network requests to monitor CAPI calls
  const capiRequests = [];
  page.on('request', (request) => {
    if (request.url().includes('snapchat-conversion') || request.url().includes('tr.snapchat.com')) {
      capiRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString()
      });
      console.log(`🌐 CAPI Request: ${request.method()} ${request.url()}`);
    }
  });
  
  try {
    console.log('1️⃣ Testing Homepage PAGE_VIEW (Pixel + CAPI)...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for both pixel and CAPI to fire
    
    console.log('\n2️⃣ Testing Trip Page VIEW_CONTENT (Pixel + CAPI)...');
    await page.goto('http://localhost:3000/london-scotland-trip', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n3️⃣ Testing Thank You Page SIGN_UP (Pixel + CAPI)...');
    const testParams = new URLSearchParams({
      email: 'test@example.com',
      phone: '0555123456',
      firstName: 'أحمد',
      lastName: 'السعودي',
      external_id: 'capi_test_' + Date.now(),
      trip_source: 'london-scotland-trip'
    });
    
    await page.goto(`http://localhost:3000/thank-you-citizen?${testParams}`, { 
      waitUntil: 'networkidle2' 
    });
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer for conversion tracking
    
    console.log('\n4️⃣ Testing Event Deduplication...');
    // Check if event IDs are being generated consistently
    const eventIdTest = await page.evaluate(() => {
      // Test the event ID generation function
      if (typeof window.generateSnapchatEventId === 'function') {
        const testData = { email: 'test@example.com', phone: '0555123456' };
        const id1 = window.generateSnapchatEventId('TEST_EVENT', testData);
        const id2 = window.generateSnapchatEventId('TEST_EVENT', testData);
        
        return {
          id1,
          id2,
          different: id1 !== id2, // Should be different due to timestamp
          format_correct: id1.startsWith('sc_') && id2.startsWith('sc_')
        };
      }
      return { error: 'Event ID function not available' };
    });
    
    console.log('Event ID Test Result:', eventIdTest);
    
    console.log('\n5️⃣ Testing CAPI Direct API Call...');
    // Test the CAPI endpoint directly
    try {
      const capiTestResponse = await page.evaluate(async () => {
        const testPayload = {
          eventName: 'TEST_EVENT',
          userData: {
            email: 'test@example.com',
            phone: '0555123456',
            firstName: 'Test',
            lastName: 'User'
          },
          customData: {
            value: '100',
            currency: 'SAR',
            content_category: 'test'
          }
        };
        
        try {
          const response = await fetch('/api/snapchat-conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
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
      
      console.log('CAPI Direct Test Result:', capiTestResponse);
      
    } catch (error) {
      console.error('CAPI Direct Test Failed:', error);
    }
    
    console.log('\n6️⃣ Testing Enhanced Event Types...');
    
    // Test ADD_CART event
    await page.evaluate(() => {
      if (typeof window.trackSnapchatAddCart === 'function') {
        window.trackSnapchatAddCart({
          userData: {
            email: 'test@example.com',
            phone: '0555123456'
          },
          price: '5900',
          currency: 'SAR',
          item_ids: ['london-scotland-trip'],
          item_category: 'travel_packages'
        });
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test SIGN_UP event
    await page.evaluate(() => {
      if (typeof window.trackSnapchatSignUp === 'function') {
        window.trackSnapchatSignUp({
          userData: {
            email: 'newuser@example.com',
            phone: '0555789123',
            firstName: 'New',
            lastName: 'User'
          },
          currency: 'SAR'
        });
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n📊 Integration Test Summary:');
    console.log('════════════════════════════════════════');
    
    console.log(`\n📱 Pixel Events Captured: ${snapchatEvents.length}`);
    snapchatEvents.forEach((event, index) => {
      console.log(`  ${index + 1}. [${event.timestamp}] ${event.message}`);
    });
    
    console.log(`\n📤 CAPI Events Captured: ${capiEvents.length}`);
    capiEvents.forEach((event, index) => {
      console.log(`  ${index + 1}. [${event.timestamp}] ${event.message}`);
    });
    
    console.log(`\n🌐 CAPI Requests Made: ${capiRequests.length}`);
    capiRequests.forEach((request, index) => {
      console.log(`  ${index + 1}. [${request.timestamp}] ${request.method} ${request.url}`);
    });
    
    // Environment check
    console.log('\n🔧 Environment Configuration Check:');
    const envCheck = await page.evaluate(() => {
      return {
        snaptrLoaded: typeof window.snaptr === 'function',
        trackingFunctionsLoaded: {
          trackSnapchatPageView: typeof window.trackSnapchatPageView === 'function',
          trackSnapchatViewContent: typeof window.trackSnapchatViewContent === 'function',
          trackSnapchatCustomEvent: typeof window.trackSnapchatCustomEvent === 'function',
          generateSnapchatEventId: typeof window.generateSnapchatEventId === 'function'
        },
        pixelId: document.querySelector('script')?.innerHTML?.includes('a9d0612f-6ca4-4b9a-a9a8-74310e3a4462')
      };
    });
    
    console.log('✅ Snapchat Pixel Loaded:', envCheck.snaptrLoaded);
    console.log('✅ Pixel ID Detected:', envCheck.pixelId);
    console.log('✅ Tracking Functions Available:', envCheck.trackingFunctionsLoaded);
    
    console.log('\n🎯 Test Results Summary:');
    console.log('─────────────────────────────────────');
    console.log(`• Total Events Triggered: ${snapchatEvents.length + capiEvents.length}`);
    console.log(`• Pixel Events: ${snapchatEvents.length}`);
    console.log(`• CAPI Events: ${capiEvents.length}`);
    console.log(`• Network Requests: ${capiRequests.length}`);
    
    if (snapchatEvents.length > 0 && capiEvents.length > 0) {
      console.log('✅ SUCCESS: Both Pixel and CAPI events are firing');
    } else if (snapchatEvents.length > 0) {
      console.log('⚠️  WARNING: Only Pixel events detected, CAPI may not be configured');
    } else if (capiEvents.length > 0) {
      console.log('⚠️  WARNING: Only CAPI events detected, Pixel may not be loaded');
    } else {
      console.log('❌ ERROR: No events detected');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Verify SNAPCHAT_ACCESS_TOKEN is set in environment variables');
    console.log('2. Check Snapchat Events Manager for received events');
    console.log('3. Monitor server logs for CAPI request details');
    console.log('4. Test with real user data in production');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    console.log('\n🏁 Test completed. Browser will remain open for manual inspection...');
    // Don't close browser automatically for manual inspection
    // await browser.close();
  }
}

// Helper function to test environment variables
function checkEnvironmentVariables() {
  console.log('\n🔍 Checking Environment Variables...');
  
  const requiredVars = [
    'SNAPCHAT_ACCESS_TOKEN',
    'SNAPCHAT_PIXEL_ID'
  ];
  
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      console.log(`✅ ${varName}: Set (${process.env[varName].substring(0, 8)}...)`);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('\n❌ Missing Environment Variables:');
    missingVars.forEach(varName => {
      console.log(`   • ${varName}`);
    });
    console.log('\nPlease add these to your .env.local file');
    return false;
  }
  
  return true;
}

// Run the test
console.log('🧪 Snapchat CAPI Integration Test Suite');
console.log('========================================\n');

if (checkEnvironmentVariables()) {
  testSnapchatCAPIIntegration();
} else {
  console.log('\n⚠️  Environment check failed. Please configure required variables before testing.');
} 