const puppeteer = require('puppeteer');

async function testDynamicSnapchatPricing() {
  console.log('🧪 Testing Dynamic Snapchat Pricing Integration...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true
  });
  
  const page = await browser.newPage();
  
  // Store captured events for analysis
  const snapchatEvents = [];
  
  // Helper function to wait (replacement for deprecated waitForTimeout)
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('Snapchat') && (text.includes('VIEW_CONTENT') || text.includes('CUSTOM_EVENT_1'))) {
      snapchatEvents.push({
        timestamp: new Date().toISOString(),
        message: text,
        page: page.url()
      });
      console.log(`📱 ${text}`);
    }
  });
  
  try {
    console.log('1️⃣ Testing London Scotland Trip (Price: 5900 SAR)...');
    await page.goto('http://localhost:3001/london-scotland-trip', { 
      waitUntil: 'networkidle2' 
    });
    await wait(3000);
    
    console.log('2️⃣ Testing Italy Trip (Price: 7200 SAR)...');
    await page.goto('http://localhost:3001/italy-trip', { 
      waitUntil: 'networkidle2' 
    });
    await wait(3000);
    
    console.log('3️⃣ Testing Georgia Trip (Price: 3800 SAR)...');
    await page.goto('http://localhost:3001/georgia-trip', { 
      waitUntil: 'networkidle2' 
    });
    await wait(3000);
    
    console.log('\n4️⃣ Testing Thank You Page with London Scotland source...');
    const londonParams = new URLSearchParams({
      email: 'john.smith.travel@gmail.com',
      phone: '555123456',
      firstName: 'John',
      trip_source: 'london-scotland-trip'
    });
    
    await page.goto(`http://localhost:3001/thank-you-citizen?${londonParams}`, { 
      waitUntil: 'networkidle2' 
    });
    await wait(3000);
    
    console.log('\n5️⃣ Testing Thank You Page with Italy source...');
    const italyParams = new URLSearchParams({
      email: 'jane.doe.vacation@gmail.com',
      phone: '555789012',
      firstName: 'Jane',
      trip_source: 'italy-trip'
    });
    
    await page.goto(`http://localhost:3001/thank-you-citizen?${italyParams}`, { 
      waitUntil: 'networkidle2' 
    });
    await wait(3000);
    
    console.log('\n6️⃣ Testing Thank You Page with Georgia source...');
    const georgiaParams = new URLSearchParams({
      email: 'alex.johnson.adventure@gmail.com',
      phone: '555456789',
      firstName: 'Alex',
      trip_source: 'georgia-trip'
    });
    
    await page.goto(`http://localhost:3001/thank-you-citizen?${georgiaParams}`, { 
      waitUntil: 'networkidle2' 
    });
    await wait(3000);
    
    console.log('\n📊 Captured Snapchat Events:');
    snapchatEvents.forEach((event, index) => {
      console.log(`${index + 1}. [${event.timestamp}] ${event.message}`);
      console.log(`   Page: ${event.page}\n`);
    });
    
    // Analyze pricing data
    console.log('🔍 Pricing Analysis:');
    const viewContentEvents = snapchatEvents.filter(e => e.message.includes('VIEW_CONTENT'));
    const customEvents = snapchatEvents.filter(e => e.message.includes('CUSTOM_EVENT_1'));
    
    console.log(`📈 VIEW_CONTENT Events: ${viewContentEvents.length}`);
    console.log(`🎯 CUSTOM_EVENT_1 Events: ${customEvents.length}`);
    
    if (viewContentEvents.length > 0) {
      console.log('\n💰 Expected Pricing per Trip:');
      console.log('- London Scotland: 5900 SAR');
      console.log('- Italy: 7200 SAR'); 
      console.log('- Georgia: 3800 SAR');
    }
    
    console.log('\n✅ Dynamic Pricing Test Complete!');
    console.log('\n🔍 Browser kept open for manual inspection. Check console for detailed event data.');
    
    // Wait for manual inspection
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the test
try {
  testDynamicSnapchatPricing();
} catch (error) {
  console.log('❌ Puppeteer not available. Manual testing instructions:\n');
  console.log('🧪 Manual Dynamic Pricing Test:');
  console.log('1. Open http://localhost:3001/london-scotland-trip');
  console.log('2. Check console for "VIEW_CONTENT tracked successfully" with price: 5900');
  console.log('3. Open http://localhost:3001/italy-trip'); 
  console.log('4. Check console for "VIEW_CONTENT tracked successfully" with price: 7200');
  console.log('5. Open http://localhost:3001/georgia-trip');
  console.log('6. Check console for "VIEW_CONTENT tracked successfully" with price: 3800');
  console.log('7. Open http://localhost:3001/thank-you-citizen?trip_source=london-scotland-trip');
  console.log('8. Check console for "CUSTOM_EVENT_1 tracked successfully" with price: 5900');
  console.log('9. Open http://localhost:3001/thank-you-citizen?trip_source=italy-trip');
  console.log('10. Check console for "CUSTOM_EVENT_1 tracked successfully" with price: 7200');
  console.log('11. Open http://localhost:3001/thank-you-citizen?trip_source=georgia-trip');
  console.log('12. Check console for "CUSTOM_EVENT_1 tracked successfully" with price: 3800');
} 