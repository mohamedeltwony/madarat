const puppeteer = require('puppeteer');

class CanonicalTestSuite {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async addTest(pageName, status, message, details = null) {
    this.results.push({
      name: `Canonical URL (${pageName})`,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  async testPageCanonical(url = '', pageName) {
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
      console.log(`Testing canonical URL for: ${fullUrl}`);
      
      await page.goto(fullUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      const html = await page.content();
      
      // Check for canonical URLs
      const canonicalMatches = html.match(/<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"']*)["\'][^>]*>/gi);
      
      if (!canonicalMatches) {
        await this.addTest(
          pageName,
          'FAIL',
          'No canonical URL found'
        );
      } else if (canonicalMatches.length > 1) {
        const canonicalUrls = canonicalMatches.map(match => {
          const hrefMatch = match.match(/href=["\']([^"']*)["\']/);
          return hrefMatch ? hrefMatch[1] : 'Unknown';
        });
        
        await this.addTest(
          pageName,
          'FAIL',
          `Multiple canonical URLs found (${canonicalMatches.length})`,
          { canonicalUrls }
        );
      } else {
        const canonicalUrl = canonicalMatches[0].match(/href=["\']([^"']*)["\']/)[1];
        
        // Check if it points to the correct domain
        if (canonicalUrl.includes('madaratalkon.com')) {
          // Check if it points to itself
          const expectedCanonical = `https://madaratalkon.com${url}`;
          if (canonicalUrl === expectedCanonical) {
            await this.addTest(
              pageName,
              'PASS',
              `Canonical URL correctly points to itself: ${canonicalUrl}`
            );
          } else {
            await this.addTest(
              pageName,
              'WARN',
              `Canonical URL found but doesn't point to itself. Found: ${canonicalUrl}, Expected: ${expectedCanonical}`
            );
          }
        } else {
          await this.addTest(
            pageName,
            'FAIL',
            `Canonical URL points to wrong domain: ${canonicalUrl}`
          );
        }
      }

      await browser.close();
    } catch (error) {
      await this.addTest(
        pageName,
        'ERROR',
        `Failed to test page: ${error.message}`
      );
    }
  }

  async runAllTests() {
    console.log('🔍 Starting Canonical URL Test Suite...\n');

    const pagesToTest = [
      { url: '/', name: 'Homepage' },
      { url: '/about', name: 'About' },
      { url: '/contact', name: 'Contact' },
      { url: '/destinations', name: 'Destinations' },
      { url: '/trips', name: 'Trips' },
      { url: '/blog', name: 'Blog' },
      { url: '/posts', name: 'Posts' },
      { url: '/categories', name: 'Categories' }
    ];

    for (const page of pagesToTest) {
      await this.testPageCanonical(page.url, page.name);
    }

    // Generate report
    console.log('📊 Canonical URL Test Results:');
    console.log('=====================================\n');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;
    const errors = this.results.filter(r => r.status === 'ERROR').length;

    this.results.forEach(result => {
      const statusIcon = {
        'PASS': '✅',
        'FAIL': '❌',
        'WARN': '⚠️',
        'ERROR': '🚨'
      }[result.status];

      console.log(`${statusIcon} ${result.name}: ${result.message}`);
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
      }
    });

    console.log('\n📈 Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`🚨 Errors: ${errors}`);
    console.log(`📊 Total: ${this.results.length}`);

    // Save results to JSON file
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `canonical-test-report-${timestamp}.json`;
    
    fs.writeFileSync(filename, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: { passed, failed, warnings, errors, total: this.results.length },
      results: this.results
    }, null, 2));

    console.log(`\n💾 Report saved to: ${filename}`);

    return {
      passed,
      failed,
      warnings,
      errors,
      total: this.results.length,
      allPassed: failed === 0 && errors === 0
    };
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  const tester = new CanonicalTestSuite();
  tester.runAllTests().then(summary => {
    process.exit(summary.allPassed ? 0 : 1);
  }).catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = CanonicalTestSuite; 