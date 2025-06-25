const puppeteer = require('puppeteer');

class CanonicalTestSuite {
  constructor() {
    this.baseUrl = 'https://madaratalkon.sa';
    this.results = [];
  }

  // Helper method to add test results
  async addTest(pageName, status, message, details = {}) {
    this.results.push({
      page: pageName,
      status,
      message,
      timestamp: new Date().toISOString(),
      ...details
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
        if (canonicalUrl.includes('madaratalkon.sa')) {
          // Check if it points to itself
          const expectedCanonical = `https://madaratalkon.sa${url}`;
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

      // Additional SEO checks
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']*)["\'][^>]*>/i);
      const ogTitleMatch = html.match(/<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"']*)["\'][^>]*>/i);
      const ogDescMatch = html.match(/<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"']*)["\'][^>]*>/i);
      const robotsMatch = html.match(/<meta[^>]*name=["\']robots["\'][^>]*content=["\']([^"']*)["\'][^>]*>/i);

      // Check for complete SEO tags
      let seoScore = 0;
      let seoIssues = [];

      if (titleMatch && titleMatch[1].trim()) seoScore++;
      else seoIssues.push('Missing title tag');

      if (descMatch && descMatch[1].trim()) seoScore++;
      else seoIssues.push('Missing meta description');

      if (ogTitleMatch && ogTitleMatch[1].trim()) seoScore++;
      else seoIssues.push('Missing og:title');

      if (ogDescMatch && ogDescMatch[1].trim()) seoScore++;
      else seoIssues.push('Missing og:description');

      if (robotsMatch && robotsMatch[1].trim()) seoScore++;
      else seoIssues.push('Missing robots meta tag');

      await this.addTest(
        pageName,
        seoScore >= 4 ? 'PASS' : 'WARN',
        `SEO completeness: ${seoScore}/5 essential tags present`,
        { seoIssues, seoScore }
      );

      await browser.close();
    } catch (error) {
      await this.addTest(
        pageName,
        'ERROR',
        `Failed to test page: ${error.message}`
      );
    }
  }

  async runTests() {
    console.log('🔍 Starting Canonical URL Tests...\n');

    const pages = [
      { url: '/current-offers', name: 'Current Offers' },
      { url: '/destination', name: 'Destinations' },
      { url: '/legal-documents', name: 'Legal Documents' },
      { url: '/terms-conditions', name: 'Terms & Conditions' },
      { url: '/privacy-policy', name: 'Privacy Policy' },
      { url: '/book-now', name: 'Book Now' }
    ];

    for (const page of pages) {
      await this.testPageCanonical(page.url, page.name);
    }

    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 CANONICAL URL TEST RESULTS');
    console.log('=====================================\n');

    const summary = {
      total: this.results.length / 2, // Each page has 2 tests (canonical + SEO)
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: 0
    };

    // Group results by page
    const pageResults = {};
    this.results.forEach(result => {
      if (!pageResults[result.page]) {
        pageResults[result.page] = [];
      }
      pageResults[result.page].push(result);
    });

    Object.keys(pageResults).forEach(pageName => {
      console.log(`📄 ${pageName}`);
      console.log('-'.repeat(40));
      
      pageResults[pageName].forEach(result => {
        const icon = {
          'PASS': '✅',
          'FAIL': '❌',
          'WARN': '⚠️',
          'ERROR': '🔥'
        }[result.status];

        console.log(`${icon} ${result.message}`);
        
        if (result.canonicalUrls) {
          console.log(`   Found: ${result.canonicalUrls.join(', ')}`);
        }
        if (result.seoIssues && result.seoIssues.length > 0) {
          console.log(`   SEO Issues: ${result.seoIssues.join(', ')}`);
        }

        // Update summary
        if (result.message.includes('Canonical URL')) {
          switch (result.status) {
            case 'PASS': summary.passed++; break;
            case 'FAIL': summary.failed++; break;
            case 'WARN': summary.warnings++; break;
            case 'ERROR': summary.errors++; break;
          }
        }
      });
      console.log('');
    });

    console.log('📈 SUMMARY');
    console.log('-'.repeat(40));
    console.log(`Total Pages Tested: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⚠️  Warnings: ${summary.warnings}`);
    console.log(`🔥 Errors: ${summary.errors}`);

    const successRate = Math.round((summary.passed / summary.total) * 100);
    console.log(`\n🎯 Success Rate: ${successRate}%`);

    if (successRate === 100) {
      console.log('\n🎉 All canonical URLs are properly implemented!');
    } else if (successRate >= 80) {
      console.log('\n👍 Most canonical URLs are working correctly. Minor issues to address.');
    } else {
      console.log('\n🚨 Significant canonical URL issues found. Please review and fix.');
    }

    // Save detailed results to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `canonical-test-report-${timestamp}.json`;
    
    const fs = require('fs');
    fs.writeFileSync(filename, JSON.stringify({
      summary,
      results: this.results,
      timestamp: new Date().toISOString()
    }, null, 2));

    console.log(`\n📄 Detailed report saved to: ${filename}`);
  }
}

// Run the tests
async function main() {
  const tester = new CanonicalTestSuite();
  await tester.runTests();
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = CanonicalTestSuite; 