const fs = require('fs');
const path = require('path');

class HeadingStructureAuditor {
  constructor() {
    this.results = [];
    this.pagesToFix = [
      'pages/index.js',
      'pages/destination/index.js', 
      'pages/about.js',
      'pages/terms-conditions.js',
      'pages/legal-documents.js',
      'pages/refund-policy.js',
      'pages/trip/[slug].js',
      'pages/privacy-policy.js'
    ];
  }

  analyzeHeadingStructure(filePath, content) {
    const fileName = path.basename(filePath);
    const h1Matches = content.match(/<h1[^>]*>.*?<\/h1>/g) || [];
    const h2Matches = content.match(/<h2[^>]*>.*?<\/h2>/g) || [];
    const h3Matches = content.match(/<h3[^>]*>.*?<\/h3>/g) || [];
    
    const analysis = {
      file: filePath,
      h1Count: h1Matches.length,
      h2Count: h2Matches.length,
      h3Count: h3Matches.length,
      h1Tags: h1Matches,
      h2Tags: h2Matches,
      h3Tags: h3Matches,
      issues: [],
      recommendations: []
    };

    // Check for missing H1
    if (analysis.h1Count === 0) {
      analysis.issues.push('No H1 tag found');
      analysis.recommendations.push('Add a single H1 tag as the main page heading');
    }

    // Check for multiple H1s
    if (analysis.h1Count > 1) {
      analysis.issues.push(`Multiple H1 tags found: ${analysis.h1Count}`);
      analysis.recommendations.push('Use only one H1 tag per page');
    }

    // Check for multiple H2s without proper hierarchy
    if (analysis.h2Count > 3) {
      analysis.issues.push(`Many H2 tags found: ${analysis.h2Count} - may need better hierarchy`);
      analysis.recommendations.push('Consider using H3, H4 for subsections under main H2 sections');
    }

    // Analyze specific patterns
    this.analyzeSpecificPatterns(content, analysis);

    return analysis;
  }

  analyzeSpecificPatterns(content, analysis) {
    // Check for section patterns that should use proper hierarchy
    const sectionPatterns = [
      { pattern: /عن الشركة.*?<h2/s, suggestion: 'Use H3 for subsections under "About" H2' },
      { pattern: /الشروط والأحكام.*?<h2.*?<h2/s, suggestion: 'Use H3 for subsections under "Terms" H2' },
      { pattern: /الخدمات.*?<h2.*?<h2/s, suggestion: 'Use H3 for service subsections' },
      { pattern: /الوجهات.*?<h2.*?<h2/s, suggestion: 'Use H3 for destination subsections' }
    ];

    sectionPatterns.forEach(({pattern, suggestion}) => {
      if (pattern.test(content)) {
        analysis.recommendations.push(suggestion);
      }
    });
  }

  async auditAllPages() {
    console.log('🔍 Starting heading structure audit...\n');

    for (const filePath of this.pagesToFix) {
      try {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const analysis = this.analyzeHeadingStructure(filePath, content);
          this.results.push(analysis);
          
          console.log(`📄 ${filePath}:`);
          console.log(`   H1: ${analysis.h1Count}, H2: ${analysis.h2Count}, H3: ${analysis.h3Count}`);
          
          if (analysis.issues.length > 0) {
            console.log(`   ❌ Issues: ${analysis.issues.join(', ')}`);
          }
          
          if (analysis.recommendations.length > 0) {
            console.log(`   💡 Recommendations: ${analysis.recommendations.join(', ')}`);
          }
          console.log('');
        } else {
          console.log(`⚠️  File not found: ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error analyzing ${filePath}:`, error.message);
      }
    }

    return this.generateReport();
  }

  generateReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalPages: this.results.length,
      pagesWithIssues: this.results.filter(r => r.issues.length > 0).length,
      summary: {
        pagesWithoutH1: this.results.filter(r => r.h1Count === 0).length,
        pagesWithMultipleH1: this.results.filter(r => r.h1Count > 1).length,
        pagesWithManyH2s: this.results.filter(r => r.h2Count > 3).length
      },
      detailedResults: this.results
    };

    // Save report to file
    const reportPath = `heading-structure-audit-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log('📊 AUDIT SUMMARY:');
    console.log(`   Total pages analyzed: ${reportData.totalPages}`);
    console.log(`   Pages with issues: ${reportData.pagesWithIssues}`);
    console.log(`   Pages without H1: ${reportData.summary.pagesWithoutH1}`);
    console.log(`   Pages with multiple H1s: ${reportData.summary.pagesWithMultipleH1}`);
    console.log(`   Pages with many H2s: ${reportData.summary.pagesWithManyH2s}`);
    console.log(`\n📋 Report saved to: ${reportPath}`);

    return reportData;
  }

  generateFixRecommendations() {
    console.log('\n🔧 RECOMMENDED FIXES:\n');

    const fixes = {
      'pages/index.js': {
        issues: ['H1 might be hidden/styled as H2', 'Multiple H2s in sections'],
        fixes: [
          'Ensure main "مدارات الكون" title uses H1',
          'Convert section titles like "Latest Stories" to H2',
          'Use H3 for subsection headings within sections'
        ]
      },
      'pages/about.js': {
        issues: ['Multiple H2s for company info sections'],
        fixes: [
          'Keep main "اكتشف الكون مع مدارات الكون" as H2',
          'Convert "من نحن", "رؤيتنا", "مهمتنا" etc. to H3',
          'Maintain logical hierarchy: H1 > H2 > H3'
        ]
      },
      'pages/terms-conditions.js': {
        issues: ['Multiple H2s for different terms sections'],
        fixes: [
          'Use H2 for main section: "الشروط والأحكام"',
          'Convert sub-sections like "الحجوزات والبرامج" to H3',
          'Use H4 for detailed sub-items within sections'
        ]
      },
      'pages/legal-documents.js': {
        issues: ['Multiple H2s for different documents'],
        fixes: [
          'Use H2 for "الأوراق القانونية"',
          'Convert document titles to H3',
          'Use consistent hierarchy for all legal pages'
        ]
      },
      'pages/refund-policy.js': {
        issues: ['Multiple H2s for policy sections'],
        fixes: [
          'Use H2 for main "سياسة الاسترداد"',
          'Convert policy sections to H3',
          'Use H4 for detailed policy items'
        ]
      },
      'pages/trip/[slug].js': {
        issues: ['Multiple H2s in trip details sections'],
        fixes: [
          'Keep trip title as H1',
          'Use H2 for main sections: "نبذة عن الرحلة"',
          'Convert service sections to H3',
          'Use H4 for detailed items within services'
        ]
      }
    };

    Object.entries(fixes).forEach(([page, data]) => {
      console.log(`📄 ${page}:`);
      console.log(`   Issues: ${data.issues.join(', ')}`);
      console.log(`   Fixes:`);
      data.fixes.forEach(fix => console.log(`   • ${fix}`));
      console.log('');
    });

    return fixes;
  }
}

// Run the audit
async function runHeadingAudit() {
  const auditor = new HeadingStructureAuditor();
  
  try {
    const results = await auditor.auditAllPages();
    const fixes = auditor.generateFixRecommendations();
    
    console.log('\n✅ Heading structure audit completed!');
    console.log('Next steps: Apply the recommended fixes to improve SEO heading hierarchy');
    
    return { results, fixes };
  } catch (error) {
    console.error('❌ Audit failed:', error);
    throw error;
  }
}

// Export for use in other scripts
module.exports = { HeadingStructureAuditor, runHeadingAudit };

// Run if called directly
if (require.main === module) {
  runHeadingAudit();
} 