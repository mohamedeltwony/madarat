const fs = require('fs');
const path = require('path');

class SEOFixHelper {
  constructor() {
    this.pagesDir = path.join(__dirname, 'src', 'pages');
    this.fixes = [];
  }

  // Analyze a page file for SEO issues
  analyzePageFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.pagesDir, filePath);
      const pageName = relativePath.replace('.js', '');

      console.log(`\n🔍 Analyzing: ${pageName}`);

      // Check for Head component usage
      const hasHead = content.includes('import Head from') || content.includes('<Head>');
      if (!hasHead) {
        this.fixes.push({
          file: relativePath,
          issue: 'Missing Head component import',
          priority: 'HIGH',
          suggestion: 'Add: import Head from "next/head"'
        });
      }

      // Check for title tag
      const hasTitle = content.includes('<title>') || content.includes('title=');
      if (!hasTitle) {
        this.fixes.push({
          file: relativePath,
          issue: 'Missing title tag',
          priority: 'HIGH',
          suggestion: 'Add <title>Your Page Title (30-60 chars)</title> inside <Head>'
        });
      }

      // Check for meta description
      const hasMetaDesc = content.includes('name="description"') || content.includes('name=\'description\'');
      if (!hasMetaDesc) {
        this.fixes.push({
          file: relativePath,
          issue: 'Missing meta description',
          priority: 'MEDIUM',
          suggestion: 'Add <meta name="description" content="Your description (120-160 chars)" />'
        });
      }

      // Check for canonical URL
      const hasCanonical = content.includes('rel="canonical"') || content.includes('rel=\'canonical\'');
      if (!hasCanonical) {
        this.fixes.push({
          file: relativePath,
          issue: 'Missing canonical URL',
          priority: 'MEDIUM',
          suggestion: 'Add <link rel="canonical" href="https://madarat.com/your-page" />'
        });
      }

      // Check for Open Graph tags
      const hasOG = content.includes('property="og:') || content.includes('property=\'og:');
      if (!hasOG) {
        this.fixes.push({
          file: relativePath,
          issue: 'Missing Open Graph tags',
          priority: 'MEDIUM',
          suggestion: 'Add og:title, og:description, og:image, og:url meta tags'
        });
      }

      // Check for H1 tag
      const hasH1 = content.includes('<h1') || content.includes('<H1');
      if (!hasH1) {
        this.fixes.push({
          file: relativePath,
          issue: 'Missing H1 tag',
          priority: 'HIGH',
          suggestion: 'Add a single <h1> tag with your main page heading'
        });
      }

    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
    }
  }

  // Scan all page files
  scanAllPages() {
    console.log('🕷️ Scanning pages for SEO issues...\n');

    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (!['api', 'examples', '_app.js', '_document.js'].includes(item)) {
            scanDirectory(fullPath);
          }
        } else if (item.endsWith('.js') && !item.startsWith('_')) {
          this.analyzePageFile(fullPath);
        }
      });
    };

    scanDirectory(this.pagesDir);
  }

  // Generate SEO template for a page
  generateSEOTemplate(pageTitle, pageDescription, pageUrl) {
    return `
import Head from 'next/head';

// Add this to your page component
<Head>
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}" />
  <link rel="canonical" href="https://madarat.com${pageUrl}" />
  
  {/* Open Graph tags */}
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${pageDescription}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://madarat.com${pageUrl}" />
  <meta property="og:image" content="https://madarat.com/images/og-image.jpg" />
  
  {/* Twitter Card tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${pageDescription}" />
  <meta name="twitter:image" content="https://madarat.com/images/og-image.jpg" />
</Head>
`;
  }

  // Generate report
  generateReport() {
    console.log('\n📊 SEO ISSUES REPORT');
    console.log('='.repeat(50));

    if (this.fixes.length === 0) {
      console.log('✅ No SEO issues found!');
      return;
    }

    // Group by priority
    const highPriority = this.fixes.filter(fix => fix.priority === 'HIGH');
    const mediumPriority = this.fixes.filter(fix => fix.priority === 'MEDIUM');
    const lowPriority = this.fixes.filter(fix => fix.priority === 'LOW');

    if (highPriority.length > 0) {
      console.log('\n🚨 HIGH PRIORITY ISSUES:');
      highPriority.forEach((fix, index) => {
        console.log(`\n${index + 1}. File: ${fix.file}`);
        console.log(`   Issue: ${fix.issue}`);
        console.log(`   Fix: ${fix.suggestion}`);
      });
    }

    if (mediumPriority.length > 0) {
      console.log('\n⚠️  MEDIUM PRIORITY ISSUES:');
      mediumPriority.forEach((fix, index) => {
        console.log(`\n${index + 1}. File: ${fix.file}`);
        console.log(`   Issue: ${fix.issue}`);
        console.log(`   Fix: ${fix.suggestion}`);
      });
    }

    if (lowPriority.length > 0) {
      console.log('\n💡 LOW PRIORITY ISSUES:');
      lowPriority.forEach((fix, index) => {
        console.log(`\n${index + 1}. File: ${fix.file}`);
        console.log(`   Issue: ${fix.issue}`);
        console.log(`   Fix: ${fix.suggestion}`);
      });
    }

    console.log('\n📝 SUMMARY:');
    console.log(`Total issues found: ${this.fixes.length}`);
    console.log(`High priority: ${highPriority.length}`);
    console.log(`Medium priority: ${mediumPriority.length}`);
    console.log(`Low priority: ${lowPriority.length}`);

    // Save detailed report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `seo-issues-report-${timestamp}.json`;
    
    fs.writeFileSync(reportFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalIssues: this.fixes.length,
      highPriority: highPriority.length,
      mediumPriority: mediumPriority.length,
      lowPriority: lowPriority.length,
      fixes: this.fixes
    }, null, 2));

    console.log(`\n📄 Detailed report saved to: ${reportFile}`);

    // Generate example templates
    console.log('\n🛠️  EXAMPLE SEO TEMPLATE:');
    console.log(this.generateSEOTemplate(
      'Your Page Title - Madarat Travel',
      'Discover amazing travel destinations with Madarat. Book your perfect trip today and explore the world with our expert travel guides.',
      '/your-page'
    ));
  }

  // Quick fix suggestions for common pages
  generateQuickFixes() {
    console.log('\n🚀 QUICK FIXES FOR COMMON PAGES:');
    
    const commonPages = [
      {
        file: 'about.js',
        title: 'About Madarat Travel - Your Trusted Travel Partner',
        description: 'Learn about Madarat Travel, your trusted partner for unforgettable journeys. Discover our story, mission, and commitment to exceptional travel experiences.',
        url: '/about'
      },
      {
        file: 'contact.js',
        title: 'Contact Madarat Travel - Get in Touch for Your Next Adventure',
        description: 'Contact Madarat Travel for personalized travel planning, booking assistance, and expert advice. Reach out today to start planning your dream vacation.',
        url: '/contact'
      },
      {
        file: 'trips.js',
        title: 'Travel Packages & Tours - Madarat Travel Destinations',
        description: 'Explore our curated collection of travel packages and tours. From cultural adventures to luxury getaways, find your perfect trip with Madarat Travel.',
        url: '/trip'
      },
      {
        file: 'destinations.js',
        title: 'Travel Destinations - Explore the World with Madarat',
        description: 'Discover amazing travel destinations around the world. From exotic beaches to historic cities, explore our comprehensive destination guides and travel tips.',
        url: '/destinations'
      },
      {
        file: 'blog.js',
        title: 'Travel Blog - Tips, Guides & Inspiration | Madarat Travel',
        description: 'Get inspired with our travel blog featuring destination guides, travel tips, cultural insights, and expert advice for your next adventure.',
        url: '/blog'
      }
    ];

    commonPages.forEach(page => {
      console.log(`\n📄 ${page.file}:`);
      console.log(this.generateSEOTemplate(page.title, page.description, page.url));
    });
  }
}

// CLI usage
if (require.main === module) {
  const helper = new SEOFixHelper();
  
  const command = process.argv[2];
  
  if (command === 'scan') {
    helper.scanAllPages();
    helper.generateReport();
  } else if (command === 'templates') {
    helper.generateQuickFixes();
  } else {
    console.log('🕷️ SEO Fix Helper');
    console.log('================');
    console.log('');
    console.log('Usage:');
    console.log('  node seo-fix-helper.js scan      - Scan all pages for SEO issues');
    console.log('  node seo-fix-helper.js templates - Generate SEO templates for common pages');
    console.log('');
    console.log('Examples:');
    console.log('  npm run seo:scan');
    console.log('  npm run seo:templates');
  }
}

module.exports = SEOFixHelper; 