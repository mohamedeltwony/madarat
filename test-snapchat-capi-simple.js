/**
 * Simple Snapchat CAPI Test
 * Tests only the server-side CAPI endpoint without requiring the local server
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function testSnapchatCAPIEndpoint() {
  console.log('🧪 Simple Snapchat CAPI Test');
  console.log('============================\n');
  
  // Check environment variables
  console.log('🔍 Environment Check:');
  const accessToken = process.env.SNAPCHAT_ACCESS_TOKEN;
  const pixelId = process.env.SNAPCHAT_PIXEL_ID;
  
  if (!accessToken) {
    console.log('❌ SNAPCHAT_ACCESS_TOKEN missing');
    return;
  }
  
  if (!pixelId) {
    console.log('❌ SNAPCHAT_PIXEL_ID missing');
    return;
  }
  
  console.log('✅ SNAPCHAT_ACCESS_TOKEN: Found');
  console.log('✅ SNAPCHAT_PIXEL_ID: Found\n');
  
  // Test direct API call to Snapchat
  console.log('🚀 Testing Direct Snapchat CAPI Call...');
  
  try {
    // Helper function to hash data with SHA-256
    const crypto = require('crypto');
    const hashData = (data) => {
      return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
    };

    // Prepare test event data with proper Snapchat format
    const testEventData = {
      event_name: 'CUSTOM_EVENT_1', // Use valid Snapchat event name
      action_source: 'website',
      event_source_url: 'https://madaratalkon.com/test',
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        em: [hashData('test@example.com')], // Properly hashed email
        ph: [hashData('966555123456')], // Properly hashed phone
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        client_ip_address: '1.2.3.4',
        country: hashData('SA'), // Hash country code
        ct: hashData('Riyadh') // Hash city
      },
      custom_data: {
        event_id: 'test_' + Date.now(),
        value: '100',
        currency: 'SAR',
        content_category: ['test']
      }
    };
    
    console.log('📤 Sending test event to Snapchat CAPI...');
    console.log('Event data:', {
      event_name: testEventData.event_name,
      has_user_data: !!testEventData.user_data,
      has_custom_data: !!testEventData.custom_data
    });
    
    // Make direct API call to Snapchat
    const response = await fetch(
      `https://tr.snapchat.com/v3/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [testEventData]
        })
      }
    );
    
    const responseText = await response.text();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ SUCCESS: Event sent to Snapchat CAPI successfully!');
      console.log('📄 Response:', responseText);
    } else {
      console.log('❌ ERROR: Failed to send event to Snapchat CAPI');
      console.log('📄 Error Response:', responseText);
    }
    
  } catch (error) {
    console.log('❌ ERROR: Exception occurred');
    console.log('📄 Error Details:', error.message);
  }
  
  console.log('\n🎯 Test Summary:');
  console.log('• Environment variables: ✅ Configured');
  console.log('• Direct CAPI call: ' + (accessToken && pixelId ? '✅ Tested' : '❌ Failed'));
  console.log('\n📋 Next Steps:');
  console.log('1. Check Snapchat Events Manager for the test event');
  console.log('2. If successful, the full integration is ready');
  console.log('3. Run the main application and test pixel + CAPI together');
}

// Add fetch polyfill for Node.js if not available
if (typeof fetch === 'undefined') {
  console.log('📦 Installing node-fetch for API calls...');
  try {
    const fetch = require('node-fetch');
    global.fetch = fetch;
  } catch (error) {
    console.log('❌ node-fetch not installed. Installing...');
    require('child_process').execSync('npm install node-fetch@2', { stdio: 'inherit' });
    const fetch = require('node-fetch');
    global.fetch = fetch;
  }
}

// Run the test
testSnapchatCAPIEndpoint(); 