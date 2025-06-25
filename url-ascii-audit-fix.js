const fs = require('fs');
const path = require('path');
const { 
  validateUrlASCII, 
  toASCIISafeUrl, 
  containsNonASCII, 
  containsArabic,
  createUrlVersions,
  generateCanonicalUrl
} = require('./src/utils/urlHelpers');

class URLASCIIAuditor {
  constructor() {
    this.results = [];
    this.baseUrl = 'https://madaratalkon.sa';
    this.nonASCIIUrls = [];
    this.fixedUrls = [];
  }

  // URLs from the user's report that need fixing
  getProblematicUrls() {
    return [
      // Image URLs
      'https://madaratalkon.sa/images/مدارات.png',
      
      // Trip URLs with Arabic characters
      'https://madaratalkon.sa/trip/سياحة-إيطاليا-7-أيام',
      'https://madaratalkon.sa/trip/رحلة-اوروبا-13-يوم-مع-سائق-خاص',
      'https://madaratalkon.sa/trip/السياحة-في-اسبانيا-7-أيام',
      'https://madaratalkon.sa/trip/رحلة-سياحية-إلى-أوروبا-9-أيام',
      'https://madaratalkon.sa/trip/رحلة-شرق-اوروبا-وايطاليا-11-يوم',
      'https://madaratalkon.sa/trip/رحلة-براغ-وباريس-9-أيام',
      'https://madaratalkon.sa/trip/رحلة-إلى-هولندا-وفرنسا-6-أيام',
      'https://madaratalkon.sa/trip/عروض-سويسرا',
      'https://madaratalkon.sa/trip/بريطانيا-وسكوتلاندا',
      'https://madaratalkon.sa/trip/رحلة-الى-اوروبا-9-أيام-للعوائل',
      'https://madaratalkon.sa/trip/عروض-اوروبا-من-الشرق-إلى-الغرب',
      'https://madaratalkon.sa/trip/رحلة-سياحية-في-اوروبا',
      'https://madaratalkon.sa/trip/رحلات-الى-ايطاليا-11-يوم',
      'https://madaratalkon.sa/trip/رحلة-سويسرا',
      'https://madaratalkon.sa/trip/عروض-ايطاليا',
      'https://madaratalkon.sa/trip/رحلة-الى-دول-اوروبا-9-ايام-للسعوديين',
      'https://madaratalkon.sa/trip/رحلة-اوروبا-9-أيام-للسعوديين',
      'https://madaratalkon.sa/trip/رحلة-إلى-براغ-والنمسا-وتشيك',
      'https://madaratalkon.sa/trip/النرويج-من-كوبنهاجن',
      'https://madaratalkon.sa/trip/بكجات-سفر-اوروبا-بأسعار-رخيصة',
      
      // Next.js image optimization URLs with Arabic characters
      'https://madaratalkon.sa/_next/image?url=https%3A%2F%2Fen4ha1dlwxxhwad.madaratalkon.com%2Fwp-content%2Fuploads%2F2025%2F05%2Fايطاليا-وسويسرا.jpg&w=2048&q=75',
      'https://madaratalkon.sa/_next/image?url=https%3A%2F%2Fen4ha1dlwxxhwad.madaratalkon.com%2Fwp-content%2Fuploads%2F2025%2F05%2Fш-5.jpg&w=2048&q=75',
      'https://madaratalkon.sa/_next/image?url=https%3A%2F%2Fen4ha1dlwxxhwad.madaratalkon.com%2Fwp-content%2Fuploads%2F2025%2F05%2Fاسرار.jpg&w=2048&q=75',
      'https://madaratalkon.sa/_next/image?url=%2Fimages%2Fشهادة%20الضريبة-1%20copy.webp&w=1920&q=100',
      'https://madaratalkon.sa/_next/image?url=https%3A%2F%2Fen4ha1dlwxxhwad.madaratalkon.com%2Fwp-content%2Fuploads%2F2025%2F05%2Fш-5.jpg&w=2048&q=90',
      'https://madaratalkon.sa/_next/image?url=https%3A%2F%2Fen4ha1dlwxxhwad.madaratalkon.com%2Fwp-content%2Fuploads%2F2025%2F05%2Fايطاليا-وسويسرا.jpg&w=2048&q=90',
      'https://madaratalkon.sa/_next/image?url=https%3A%2F%2Fen4ha1dlwxxhwad.madaratalkon.com%2Fwp-content%2Fuploads%2F2025%2F05%2Fاسرار.jpg&w=2048&q=90'
    ];
  }

  // Audit a single URL
  auditUrl(url) {
    const validation = validateUrlASCII(url);
    const versions = createUrlVersions(url);
    
    const auditResult = {
      originalUrl: url,
      validation,
      versions,
      timestamp: new Date().toISOString(),
      category: this.categorizeUrl(url),
      priority: this.getPriority(url, validation),
      recommendation: this.getRecommendation(url, validation)
    };

    this.results.push(auditResult);
    
    if (!validation.isValid) {
      this.nonASCIIUrls.push(auditResult);
    }

    return auditResult;
  }

  // Categorize URL type
  categorizeUrl(url) {
    if (url.includes('/trip/')) return 'trip';
    if (url.includes('/images/')) return 'image';
    if (url.includes('/_next/image')) return 'next-image';
    if (url.includes('/posts/')) return 'blog-post';
    if (url.includes('/destination/')) return 'destination';
    return 'other';
  }

  // Get priority level for fixing
  getPriority(url, validation) {
    if (url.includes('/trip/')) return 'HIGH'; // Trip pages are critical for business
    if (url.includes('/images/')) return 'MEDIUM'; // Images affect SEO
    if (url.includes('/_next/image')) return 'LOW'; // Next.js handles these automatically
    return 'MEDIUM';
  }

  // Get specific recommendation for fixing
  getRecommendation(url, validation) {
    if (validation.isValid) {
      return 'URL is ASCII-compliant. No action needed.';
    }

    const category = this.categorizeUrl(url);
    
    switch (category) {
      case 'trip':
        return `Update canonical URLs in trip pages to use encoded version: ${validation.suggestion}. Consider creating URL redirects from Arabic URLs to encoded versions.`;
      
      case 'image':
        return `Rename image file to ASCII-safe name or ensure proper encoding in image references: ${validation.suggestion}`;
      
      case 'next-image':
        return `Next.js Image component should handle encoding automatically. Verify image source URLs are properly encoded.`;
      
      default:
        return `Encode URL to ASCII-safe format: ${validation.suggestion}`;
    }
  }

  // Run complete audit
  async runAudit() {
    console.log('🔍 Starting URL ASCII Compliance Audit...\n');
    
    const problematicUrls = this.getProblematicUrls();
    
    console.log(`📊 Auditing ${problematicUrls.length} URLs...\n`);
    
    for (const url of problematicUrls) {
      const result = this.auditUrl(url);
      
      console.log(`${result.validation.isValid ? '✅' : '❌'} ${url}`);
      if (!result.validation.isValid) {
        console.log(`   Issues: ${result.validation.issues.join(', ')}`);
        console.log(`   Suggestion: ${result.validation.suggestion}`);
        console.log(`   Priority: ${result.priority}`);
      }
      console.log('');
    }

    this.generateReport();
    this.generateSolutions();
  }

  // Generate detailed report
  generateReport() {
    const summary = {
      totalUrls: this.results.length,
      compliantUrls: this.results.filter(r => r.validation.isValid).length,
      nonCompliantUrls: this.nonASCIIUrls.length,
      highPriority: this.nonASCIIUrls.filter(r => r.priority === 'HIGH').length,
      mediumPriority: this.nonASCIIUrls.filter(r => r.priority === 'MEDIUM').length,
      lowPriority: this.nonASCIIUrls.filter(r => r.priority === 'LOW').length,
      categories: {
        trip: this.results.filter(r => r.category === 'trip').length,
        image: this.results.filter(r => r.category === 'image').length,
        nextImage: this.results.filter(r => r.category === 'next-image').length,
        other: this.results.filter(r => r.category === 'other').length
      }
    };

    const report = {
      summary,
      auditDate: new Date().toISOString(),
      nonCompliantUrls: this.nonASCIIUrls,
      recommendations: this.generateRecommendations()
    };

    // Save report to file
    const reportPath = `url-ascii-audit-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📋 AUDIT SUMMARY');
    console.log('================');
    console.log(`Total URLs audited: ${summary.totalUrls}`);
    console.log(`✅ ASCII-compliant: ${summary.compliantUrls}`);
    console.log(`❌ Non-compliant: ${summary.nonCompliantUrls}`);
    console.log(`🔴 High priority fixes: ${summary.highPriority}`);
    console.log(`🟡 Medium priority fixes: ${summary.mediumPriority}`);
    console.log(`🟢 Low priority fixes: ${summary.lowPriority}`);
    console.log(`\n📁 Detailed report saved to: ${reportPath}\n`);
  }

  // Generate specific recommendations
  generateRecommendations() {
    return [
      {
        category: 'Trip URLs',
        issue: 'Arabic characters in trip page URLs',
        solution: 'Update canonical URLs to use percent-encoded format',
        implementation: 'Already implemented in extractWordPressCanonical function',
        impact: 'HIGH - Improves SEO ranking stability and crawlability'
      },
      {
        category: 'Image Files',
        issue: 'Arabic characters in image filenames',
        solution: 'Rename files to ASCII-safe names or use proper encoding',
        implementation: 'Update image references in components and WordPress',
        impact: 'MEDIUM - Improves image SEO and accessibility'
      },
      {
        category: 'Next.js Images',
        issue: 'Non-ASCII characters in Next.js image optimization URLs',
        solution: 'Ensure source URLs are properly encoded before passing to Image component',
        implementation: 'Update Image component usage to encode src URLs',
        impact: 'LOW - Next.js handles most encoding automatically'
      },
      {
        category: 'Canonical URLs',
        issue: 'Non-ASCII canonical URLs in meta tags',
        solution: 'Use ASCII-encoded versions in canonical link tags',
        implementation: 'Update SEO components to use extractWordPressCanonical',
        impact: 'HIGH - Critical for search engine understanding'
      }
    ];
  }

  // Generate solution implementations
  generateSolutions() {
    console.log('🔧 IMPLEMENTATION SOLUTIONS');
    console.log('===========================\n');

    console.log('1. 🎯 TRIP PAGE CANONICAL URLS (HIGH PRIORITY)');
    console.log('   ✅ Already implemented in extractWordPressCanonical function');
    console.log('   📝 This function now automatically encodes non-ASCII characters in canonical URLs\n');

    console.log('2. 🖼️  IMAGE FILE FIXES (MEDIUM PRIORITY)');
    console.log('   📋 Recommended actions:');
    console.log('   - Rename "مدارات.png" to "madarat-logo.png"');
    console.log('   - Update WordPress media library filenames');
    console.log('   - Use ASCII-safe filenames for new uploads\n');

    console.log('3. 🔗 NEXT.JS IMAGE OPTIMIZATION (LOW PRIORITY)');
    console.log('   📋 Next.js automatically handles URL encoding for image optimization');
    console.log('   📝 No immediate action required, but monitor for issues\n');

    console.log('4. 🌐 GENERAL URL STRUCTURE');
    console.log('   📋 Best practices implemented:');
    console.log('   - ASCII-safe canonical URLs');
    console.log('   - Proper URL encoding utilities');
    console.log('   - Validation functions for URL compliance');
    console.log('   - Backward compatibility with Arabic URLs\n');
  }
}

// Run the audit
async function main() {
  const auditor = new URLASCIIAuditor();
  await auditor.runAudit();
  
  console.log('🎉 URL ASCII Compliance Audit Complete!');
  console.log('📖 Review the generated report for detailed findings and recommendations.');
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = URLASCIIAuditor; 