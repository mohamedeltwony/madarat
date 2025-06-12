/**
 * Frontend Health Check Test
 * Verifies that the landing pages are loading properly after Snapchat integration changes
 */
require('dotenv').config();
const puppeteer = require('puppeteer');

async function testFrontendHealth() {
  let browser;
  
  try {
    console.log('🔍 Frontend Health Check');
    console.log('=======================\n');

    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Capture console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      errors.push(`Page Error: ${error.message}`);
    });

    const pagesToTest = [
      { name: 'Homepage', url: 'http://localhost:3000' },
      { name: 'London Scotland Trip', url: 'http://localhost:3000/london-scotland-trip' },
      { name: 'Thank You Citizen', url: 'http://localhost:3000/thank-you-citizen?email=test@example.com' }
    ];

    for (const pageTest of pagesToTest) {
      console.log(`📄 Testing ${pageTest.name}...`);
      
      try {
        await page.goto(pageTest.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        // Wait for React to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if page loaded successfully
        const title = await page.title();
        const bodyContent = await page.evaluate(() => document.body.innerHTML.length);
        
        // Check if Snapchat functions are available (for testing)
        const snapchatStatus = await page.evaluate(() => {
          return {
            snaptrLoaded: typeof window.snaptr === 'function',
            globalFunctionsLoaded: typeof window.trackSnapchatPageView === 'function',
            debugAvailable: typeof window.snapchatDebug === 'object'
          };
        });
        
        console.log(`  ✅ Loaded: ${title}`);
        console.log(`  📊 Content size: ${bodyContent} characters`);
        console.log(`  📱 Snapchat pixel: ${snapchatStatus.snaptrLoaded ? 'Loaded' : 'Not loaded'}`);
        console.log(`  🔧 Global functions: ${snapchatStatus.globalFunctionsLoaded ? 'Available' : 'Not available'}`);
        console.log(`  🐛 Debug helper: ${snapchatStatus.debugAvailable ? 'Available' : 'Not available'}`);
        
      } catch (error) {
        console.log(`  ❌ Failed to load: ${error.message}`);
        errors.push(`${pageTest.name}: ${error.message}`);
      }
      
      console.log('');
    }

    console.log('🔧 Error Summary:');
    console.log('=================');
    if (errors.length === 0) {
      console.log('✅ No errors detected!');
    } else {
      console.log(`❌ ${errors.length} errors found:`);
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    console.log('\n🎯 Health Check Result:');
    if (errors.length === 0) {
      console.log('🎉 FRONTEND IS HEALTHY - All pages loading correctly!');
    } else {
      console.log('⚠️  FRONTEND HAS ISSUES - Please check the errors above');
    }

  } catch (error) {
    console.error('❌ Health check failed:', error);
  } finally {
    console.log('\n🏁 Health check completed.');
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testFrontendHealth(); 