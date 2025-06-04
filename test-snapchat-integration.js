const puppeteer = require('puppeteer');

async function testSnapchatIntegration() {
  console.log('🧪 Testing Snapchat Pixel Integration...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Show browser for visual verification
    devtools: true   // Open dev tools automatically
  });
  
  const page = await browser.newPage();
  
  // Listen for console logs to capture Snapchat events
  const snapchatEvents = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('Snapchat') || text.includes('snaptr')) {
      snapchatEvents.push({
        timestamp: new Date().toISOString(),
        message: text
      });
      console.log(`📱 Snapchat Event: ${text}`);
    }
  });
  
  // Intercept network requests to monitor Snapchat API calls
  const snapchatRequests = [];
  page.on('request', (request) => {
    if (request.url().includes('sc-static.net') || request.url().includes('snapchat')) {
      snapchatRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString()
      });
      console.log(`🌐 Snapchat Request: ${request.method()} ${request.url()}`);
    }
  });
  
  try {
    console.log('1️⃣ Testing Homepage PAGE_VIEW...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000); // Wait for tracking to fire
    
    console.log('\n2️⃣ Testing Trip Page VIEW_CONTENT...');
    await page.goto('http://localhost:3000/london-scotland-trip', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000); // Wait for tracking to fire
    
    console.log('\n3️⃣ Testing Thank You Page CUSTOM_EVENT_1...');
    // Simulate form submission by going to thank you page with user data
    const testParams = new URLSearchParams({
      email: 'test@example.com',
      phone: '555123456',
      firstName: 'John',
      lastName: 'Doe',
      external_id: 'test_' + Date.now()
    });
    
    await page.goto(`http://localhost:3000/thank-you-citizen?${testParams}`, { 
      waitUntil: 'networkidle2' 
    });
    await page.waitForTimeout(3000); // Wait for tracking to fire
    
    console.log('\n4️⃣ Checking Snapchat pixel initialization...');
    
    // Check if snaptr function is available
    const snaptrAvailable = await page.evaluate(() => {
      return typeof window.snaptr === 'function';
    });
    
    console.log(`✅ Snapchat pixel loaded: ${snaptrAvailable}`);
    
    // Check if pixel ID is correctly set
    const pixelId = await page.evaluate(() => {
      // Try to extract pixel ID from the initialization
      const scripts = document.querySelectorAll('script');
      for (let script of scripts) {
        if (script.innerHTML.includes('a9d0612f-6ca4-4b9a-a9a8-74310e3a4462')) {
          return 'a9d0612f-6ca4-4b9a-a9a8-74310e3a4462';
        }
      }
      return null;
    });
    
    console.log(`✅ Pixel ID found: ${pixelId}`);
    
    console.log('\n📊 Summary of Snapchat Events Captured:');
    snapchatEvents.forEach((event, index) => {
      console.log(`${index + 1}. [${event.timestamp}] ${event.message}`);
    });
    
    console.log('\n🌐 Summary of Snapchat Network Requests:');
    snapchatRequests.forEach((request, index) => {
      console.log(`${index + 1}. [${request.timestamp}] ${request.method} ${request.url}`);
    });
    
    console.log('\n✅ Snapchat Integration Test Complete!');
    console.log(`📱 Total Events Captured: ${snapchatEvents.length}`);
    console.log(`🌐 Total Network Requests: ${snapchatRequests.length}`);
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection. Press Ctrl+C to close.');
    
    // Wait indefinitely until user closes
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    // Uncomment to automatically close browser
    // await browser.close();
  }
}

// Check if puppeteer is available
try {
  testSnapchatIntegration();
} catch (error) {
  console.log('❌ Puppeteer not available. Running manual test instructions instead...\n');
  
  console.log('🧪 Manual Snapchat Integration Test Instructions:');
  console.log('1. Open browser and navigate to: http://localhost:3000');
  console.log('2. Open Developer Tools (F12) and go to Console tab');
  console.log('3. Look for logs containing "Snapchat" or "snaptr"');
  console.log('4. Navigate to: http://localhost:3000/london-scotland-trip');
  console.log('5. Check console for VIEW_CONTENT tracking logs');
  console.log('6. Navigate to: http://localhost:3000/thank-you-citizen?email=test@example.com&phone=555123456&firstName=John');
  console.log('7. Check console for CUSTOM_EVENT_1 tracking logs');
  console.log('\n📋 What to look for:');
  console.log('- "Enhanced Snapchat PAGE_VIEW tracked"');
  console.log('- "Snapchat VIEW_CONTENT tracked successfully"');
  console.log('- "Snapchat CUSTOM_EVENT_1 tracked successfully"');
  console.log('- Network requests to sc-static.net');
  
  console.log('\n🔧 To install puppeteer for automated testing:');
  console.log('npm install puppeteer --save-dev');
} 