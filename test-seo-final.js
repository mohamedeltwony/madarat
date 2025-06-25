const puppeteer = require('puppeteer');

async function testTripSEOFinal() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Test the problematic URLs from the user's list
  const testUrls = [
    'http://localhost:3000/trip/السياحة-في-اسبانيا-7-أيام',
    'http://localhost:3000/trip/رحلة-سويسرا',
    'http://localhost:3000/trip/بريطانيا-وسكوتلاندا',
    'http://localhost:3000/trip/عروض-سويسرا',
    'http://localhost:3000/trip/عروض-ايطاليا'
  ];
  
  let allPassed = true;
  
  for (const testUrl of testUrls) {
    console.log(`\n🔍 Testing URL: ${testUrl}`);
    
    try {
      // Navigate to the page with a longer timeout
      const response = await page.goto(testUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      
      console.log(`   Status: ${response.status()}`);
      
      if (response.status() !== 200) {
        console.log('❌ Non-200 status code');
        allPassed = false;
        continue;
      }
      
      // Wait a bit for dynamic content to load
      await page.waitForTimeout(2000);
      
      // Get the page title
      const title = await page.title();
      console.log(`   Page title: "${title}"`);
      
      // Get the H1 tag content
      const h1Text = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.textContent.trim() : null;
      });
      console.log(`   H1 text: "${h1Text}"`);
      
      // Get meta description
      const metaDescription = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="description"]');
        return meta ? meta.getAttribute('content') : null;
      });
      console.log(`   Meta description: "${metaDescription}"`);
      
      // Check for empty or whitespace-only title
      if (!title || title.trim().length === 0) {
        console.log('❌ EMPTY PAGE TITLE');
        allPassed = false;
      } else {
        console.log('✅ Page title present');
      }
      
      // Check for empty or whitespace-only H1
      if (!h1Text || h1Text.trim().length === 0) {
        console.log('❌ EMPTY H1 TAG');
        allPassed = false;
      } else {
        console.log('✅ H1 tag present');
      }
      
      // Check for empty or whitespace-only meta description
      if (!metaDescription || metaDescription.trim().length === 0) {
        console.log('❌ EMPTY META DESCRIPTION');
        allPassed = false;
      } else {
        console.log('✅ Meta description present');
      }
      
    } catch (error) {
      console.log(`❌ Error testing URL: ${error.message}`);
      allPassed = false;
    }
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! SEO issues have been resolved.');
  } else {
    console.log('❌ Some tests failed. Please check the issues above.');
  }
  console.log('='.repeat(50));
}

testTripSEOFinal().catch(console.error); 