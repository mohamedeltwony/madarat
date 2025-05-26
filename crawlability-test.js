const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class CrawlabilityTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  // Helper function to make HTTP requests
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  // Test helper
  addTest(name, status, message, details = null) {
    this.results.tests.push({
      name,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    });
    
    if (status === 'PASS') this.results.passed++;
    else if (status === 'FAIL') this.results.failed++;
    else if (status === 'WARN') this.results.warnings++;
  }

  // Test 1: Check if robots.txt exists and is accessible
  async testRobotsTxt() {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/robots.txt`);
      
      if (response.statusCode === 200) {
        const hasUserAgent = response.body.includes('User-agent:');
        const hasSitemap = response.body.includes('Sitemap:');
        
        if (hasUserAgent) {
          this.addTest(
            'Robots.txt Accessibility',
            'PASS',
            'robots.txt is accessible and contains User-agent directive',
            { content: response.body.substring(0, 200) + '...' }
          );
          
          if (hasSitemap) {
            this.addTest(
              'Robots.txt Sitemap Reference',
              'PASS',
              'robots.txt contains sitemap reference'
            );
          } else {
            this.addTest(
              'Robots.txt Sitemap Reference',
              'WARN',
              'robots.txt does not contain sitemap reference'
            );
          }
        } else {
          this.addTest(
            'Robots.txt Content',
            'WARN',
            'robots.txt exists but may not be properly formatted'
          );
        }
      } else {
        this.addTest(
          'Robots.txt Accessibility',
          'FAIL',
          `robots.txt returned status code: ${response.statusCode}`
        );
      }
    } catch (error) {
      this.addTest(
        'Robots.txt Accessibility',
        'FAIL',
        `Failed to access robots.txt: ${error.message}`
      );
    }
  }

  // Test 2: Check sitemap accessibility
  async testSitemap() {
    const sitemapUrls = [
      '/sitemap.xml',
      '/sitemap.xml.js',
      '/sitemap'
    ];

    let sitemapFound = false;

    for (const sitemapUrl of sitemapUrls) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${sitemapUrl}`);
        
        if (response.statusCode === 200) {
          sitemapFound = true;
          const isXml = response.headers['content-type']?.includes('xml') || 
                       response.body.includes('<?xml') ||
                       response.body.includes('<urlset');
          
          if (isXml) {
            const urlCount = (response.body.match(/<url>/g) || []).length;
            this.addTest(
              'Sitemap Accessibility',
              'PASS',
              `Sitemap found at ${sitemapUrl} with ${urlCount} URLs`,
              { url: sitemapUrl, urlCount }
            );
          } else {
            this.addTest(
              'Sitemap Format',
              'WARN',
              `Sitemap found but may not be in XML format`
            );
          }
          break;
        }
      } catch (error) {
        // Continue to next sitemap URL
      }
    }

    if (!sitemapFound) {
      this.addTest(
        'Sitemap Accessibility',
        'FAIL',
        'No accessible sitemap found'
      );
    }
  }

  // Test 3: Check meta tags and SEO elements
  async testPageSEO(url = '') {
    try {
      const response = await this.makeRequest(`${this.baseUrl}${url}`);
      
      if (response.statusCode !== 200) {
        this.addTest(
          `Page Accessibility${url ? ` (${url})` : ''}`,
          'FAIL',
          `Page returned status code: ${response.statusCode}`
        );
        return;
      }

      const html = response.body;
      const pageName = url || 'Homepage';

      // Check title tag
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1].trim()) {
        const titleLength = titleMatch[1].trim().length;
        if (titleLength >= 30 && titleLength <= 60) {
          this.addTest(
            `Title Tag (${pageName})`,
            'PASS',
            `Title tag present with optimal length: ${titleLength} characters`
          );
        } else {
          this.addTest(
            `Title Tag (${pageName})`,
            'WARN',
            `Title tag length (${titleLength}) is outside optimal range (30-60 characters)`
          );
        }
      } else {
        this.addTest(
          `Title Tag (${pageName})`,
          'FAIL',
          'Missing or empty title tag'
        );
      }

      // Check meta description
      const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']*)["\'][^>]*>/i);
      if (descMatch && descMatch[1].trim()) {
        const descLength = descMatch[1].trim().length;
        if (descLength >= 120 && descLength <= 160) {
          this.addTest(
            `Meta Description (${pageName})`,
            'PASS',
            `Meta description present with optimal length: ${descLength} characters`
          );
        } else {
          this.addTest(
            `Meta Description (${pageName})`,
            'WARN',
            `Meta description length (${descLength}) is outside optimal range (120-160 characters)`
          );
        }
      } else {
        this.addTest(
          `Meta Description (${pageName})`,
          'FAIL',
          'Missing meta description'
        );
      }

      // Check canonical URL
      const canonicalMatch = html.match(/<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"']*)["\'][^>]*>/i);
      if (canonicalMatch) {
        this.addTest(
          `Canonical URL (${pageName})`,
          'PASS',
          'Canonical URL is present'
        );
      } else {
        this.addTest(
          `Canonical URL (${pageName})`,
          'WARN',
          'Missing canonical URL'
        );
      }

      // Check Open Graph tags
      const ogTitleMatch = html.match(/<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"']*)["\'][^>]*>/i);
      const ogDescMatch = html.match(/<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"']*)["\'][^>]*>/i);
      const ogImageMatch = html.match(/<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"']*)["\'][^>]*>/i);

      if (ogTitleMatch && ogDescMatch) {
        this.addTest(
          `Open Graph Tags (${pageName})`,
          'PASS',
          'Essential Open Graph tags are present'
        );
      } else {
        this.addTest(
          `Open Graph Tags (${pageName})`,
          'WARN',
          'Missing essential Open Graph tags'
        );
      }

      // Check structured data
      const structuredDataMatch = html.match(/<script[^>]*type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/is);
      if (structuredDataMatch) {
        try {
          JSON.parse(structuredDataMatch[1]);
          this.addTest(
            `Structured Data (${pageName})`,
            'PASS',
            'Valid JSON-LD structured data found'
          );
        } catch (e) {
          this.addTest(
            `Structured Data (${pageName})`,
            'WARN',
            'Structured data found but may be invalid JSON'
          );
        }
      } else {
        this.addTest(
          `Structured Data (${pageName})`,
          'WARN',
          'No structured data found'
        );
      }

      // Check heading structure
      const h1Matches = html.match(/<h1[^>]*>/gi);
      if (h1Matches) {
        if (h1Matches.length === 1) {
          this.addTest(
            `H1 Tag (${pageName})`,
            'PASS',
            'Single H1 tag found'
          );
        } else {
          this.addTest(
            `H1 Tag (${pageName})`,
            'WARN',
            `Multiple H1 tags found: ${h1Matches.length}`
          );
        }
      } else {
        this.addTest(
          `H1 Tag (${pageName})`,
          'FAIL',
          'No H1 tag found'
        );
      }

    } catch (error) {
      this.addTest(
        `Page SEO Analysis${url ? ` (${url})` : ''}`,
        'FAIL',
        `Failed to analyze page: ${error.message}`
      );
    }
  }

  // Test 4: Check response times
  async testPageSpeed(url = '') {
    const startTime = Date.now();
    try {
      const response = await this.makeRequest(`${this.baseUrl}${url}`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const pageName = url || 'Homepage';
      
      if (responseTime < 1000) {
        this.addTest(
          `Page Speed (${pageName})`,
          'PASS',
          `Page loaded in ${responseTime}ms`
        );
      } else if (responseTime < 3000) {
        this.addTest(
          `Page Speed (${pageName})`,
          'WARN',
          `Page loaded in ${responseTime}ms (consider optimization)`
        );
      } else {
        this.addTest(
          `Page Speed (${pageName})`,
          'FAIL',
          `Page loaded in ${responseTime}ms (too slow)`
        );
      }
    } catch (error) {
      this.addTest(
        `Page Speed${url ? ` (${url})` : ''}`,
        'FAIL',
        `Failed to measure page speed: ${error.message}`
      );
    }
  }

  // Test 5: Check for common crawlability issues
  async testCrawlabilityIssues() {
    try {
      const response = await this.makeRequest(this.baseUrl);
      const html = response.body;

      // Check for noindex tag
      const noindexMatch = html.match(/<meta[^>]*name=["\']robots["\'][^>]*content=["\'][^"']*noindex[^"']*["\'][^>]*>/i);
      if (noindexMatch) {
        this.addTest(
          'Noindex Check',
          'WARN',
          'Page contains noindex directive'
        );
      } else {
        this.addTest(
          'Noindex Check',
          'PASS',
          'No noindex directive found'
        );
      }

      // Check for viewport meta tag
      const viewportMatch = html.match(/<meta[^>]*name=["\']viewport["\'][^>]*>/i);
      if (viewportMatch) {
        this.addTest(
          'Mobile Viewport',
          'PASS',
          'Viewport meta tag is present'
        );
      } else {
        this.addTest(
          'Mobile Viewport',
          'FAIL',
          'Missing viewport meta tag'
        );
      }

      // Check for charset declaration
      const charsetMatch = html.match(/<meta[^>]*charset=["\']?([^"'\s>]+)["\']?[^>]*>/i);
      if (charsetMatch) {
        this.addTest(
          'Character Encoding',
          'PASS',
          `Character encoding declared: ${charsetMatch[1]}`
        );
      } else {
        this.addTest(
          'Character Encoding',
          'WARN',
          'Character encoding not explicitly declared'
        );
      }

    } catch (error) {
      this.addTest(
        'Crawlability Issues Check',
        'FAIL',
        `Failed to check crawlability issues: ${error.message}`
      );
    }
  }

  // Test 6: Check internal linking
  async testInternalLinking() {
    try {
      const response = await this.makeRequest(this.baseUrl);
      const html = response.body;

      // Extract internal links
      const linkMatches = html.match(/<a[^>]*href=["\']([^"']*)["\'][^>]*>/gi) || [];
      const internalLinks = linkMatches
        .map(link => {
          const hrefMatch = link.match(/href=["\']([^"']*)["\']/i);
          return hrefMatch ? hrefMatch[1] : null;
        })
        .filter(href => href && (href.startsWith('/') || href.startsWith(this.baseUrl)))
        .filter(href => !href.includes('#') && !href.includes('mailto:') && !href.includes('tel:'));

      if (internalLinks.length > 0) {
        this.addTest(
          'Internal Linking',
          'PASS',
          `Found ${internalLinks.length} internal links`,
          { sampleLinks: internalLinks.slice(0, 5) }
        );
      } else {
        this.addTest(
          'Internal Linking',
          'WARN',
          'No internal links found on homepage'
        );
      }

    } catch (error) {
      this.addTest(
        'Internal Linking Check',
        'FAIL',
        `Failed to check internal linking: ${error.message}`
      );
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🕷️  Starting Crawlability Tests...\n');

    // Test key pages
    const testPages = [
      '',
      '/about',
      '/contact',
      '/trips',
      '/destinations',
      '/blog'
    ];

    // Basic infrastructure tests
    await this.testRobotsTxt();
    await this.testSitemap();
    await this.testCrawlabilityIssues();
    await this.testInternalLinking();

    // Test each page
    for (const page of testPages) {
      await this.testPageSEO(page);
      await this.testPageSpeed(page);
    }

    return this.generateReport();
  }

  // Generate comprehensive report
  generateReport() {
    const report = {
      summary: {
        total: this.results.tests.length,
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        score: Math.round((this.results.passed / this.results.tests.length) * 100)
      },
      tests: this.results.tests,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.results.tests.filter(test => test.status === 'FAIL');
    const warningTests = this.results.tests.filter(test => test.status === 'WARN');

    if (failedTests.some(test => test.name.includes('robots.txt'))) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Missing or inaccessible robots.txt',
        solution: 'Create a robots.txt file in your public directory'
      });
    }

    if (failedTests.some(test => test.name.includes('Sitemap'))) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Missing sitemap',
        solution: 'Ensure your sitemap.xml is accessible and properly formatted'
      });
    }

    if (failedTests.some(test => test.name.includes('Title Tag'))) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Missing or poor title tags',
        solution: 'Add unique, descriptive title tags to all pages (30-60 characters)'
      });
    }

    if (failedTests.some(test => test.name.includes('Meta Description'))) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Missing meta descriptions',
        solution: 'Add compelling meta descriptions to all pages (120-160 characters)'
      });
    }

    if (warningTests.some(test => test.name.includes('Open Graph'))) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Missing Open Graph tags',
        solution: 'Add Open Graph tags for better social media sharing'
      });
    }

    if (failedTests.some(test => test.name.includes('Page Speed'))) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Slow page loading times',
        solution: 'Optimize images, enable compression, and minimize JavaScript'
      });
    }

    return recommendations;
  }
}

// Export for use as module
module.exports = CrawlabilityTester;

// CLI usage
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  
  async function runTests() {
    const tester = new CrawlabilityTester(baseUrl);
    
    try {
      const report = await tester.runAllTests();
      
      console.log('📊 CRAWLABILITY TEST REPORT');
      console.log('=' .repeat(50));
      console.log(`🎯 Overall Score: ${report.summary.score}%`);
      console.log(`✅ Passed: ${report.summary.passed}`);
      console.log(`❌ Failed: ${report.summary.failed}`);
      console.log(`⚠️  Warnings: ${report.summary.warnings}`);
      console.log(`📝 Total Tests: ${report.summary.total}\n`);

      // Show failed tests
      if (report.summary.failed > 0) {
        console.log('❌ FAILED TESTS:');
        report.tests
          .filter(test => test.status === 'FAIL')
          .forEach(test => {
            console.log(`   • ${test.name}: ${test.message}`);
          });
        console.log('');
      }

      // Show warnings
      if (report.summary.warnings > 0) {
        console.log('⚠️  WARNINGS:');
        report.tests
          .filter(test => test.status === 'WARN')
          .forEach(test => {
            console.log(`   • ${test.name}: ${test.message}`);
          });
        console.log('');
      }

      // Show recommendations
      if (report.recommendations.length > 0) {
        console.log('💡 RECOMMENDATIONS:');
        report.recommendations.forEach((rec, index) => {
          console.log(`   ${index + 1}. [${rec.priority}] ${rec.issue}`);
          console.log(`      Solution: ${rec.solution}\n`);
        });
      }

      // Save detailed report
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportFile = `crawlability-report-${timestamp}.json`;
      
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
      console.log(`📄 Detailed report saved to: ${reportFile}`);

      // Exit with appropriate code
      process.exit(report.summary.failed > 0 ? 1 : 0);
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    }
  }

  runTests();
} 