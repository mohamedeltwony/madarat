#!/usr/bin/env node

/**
 * Sitemap Validation Script
 * Validates the new clean, duplicate-free sitemap structure
 */

const fs = require('fs');
const path = require('path');

console.log('🗺️  Validating Clean Sitemap Structure...\n');

// Define sitemap files to validate
const sitemapFiles = [
  'pages/sitemap.xml.js',
  'pages/sitemap-posts.xml.js', 
  'pages/sitemap-trips.xml.js',
  'pages/sitemap-trips-2.xml.js',
  'pages/sitemap-trips-3.xml.js',
  'pages/sitemap-destinations.xml.js',
  'pages/sitemap-index.xml.js'
];

// Define expected content for each sitemap
const expectedContent = {
  'sitemap.xml.js': {
    shouldContain: ['static pages', '/destination', '/trip', '/blog'],
    shouldNotContain: ['posts.slug', 'trips.map', '/destination/turkey'],
    purpose: 'Static pages and main navigation only'
  },
  'sitemap-posts.xml.js': {
    shouldContain: ['/posts/${post.slug}', 'getAllPosts'],
    shouldNotContain: ['url: \'/blog\'', 'url: \'/posts\'', 'url: \'/categories\''],
    purpose: 'Individual blog post URLs only'
  },
  'sitemap-trips.xml.js': {
    shouldContain: ['/trip/${decodedSlug}', 'getAllTrips', 'slice(0, 50)'],
    shouldNotContain: ['url: \'/trip\'', 'url: \'/book-now\'', 'url: \'/offers\''],
    purpose: 'First 50 trip URLs only'
  },
  'sitemap-destinations.xml.js': {
    shouldContain: ['/destination/turkey', '/destination/georgia'],
    shouldNotContain: ['url: \'/destination\'', 'changefreq: \'daily\''],
    purpose: 'Individual destination pages only'
  },
  'sitemap-index.xml.js': {
    shouldContain: ['sitemap-trips.xml', 'sitemap-posts.xml', 'sitemapindex'],
    shouldNotContain: ['sitemap-trips-index.xml'],
    purpose: 'Master sitemap index'
  }
};

let validationResults = {
  passed: 0,
  failed: 0,
  issues: []
};

// Validate each sitemap file
sitemapFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    validationResults.failed++;
    validationResults.issues.push(`❌ Missing file: ${file}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const expected = expectedContent[path.basename(file)];
  
  if (!expected) {
    console.log(`ℹ️  ${file} - No validation rules defined`);
    return;
  }
  
  console.log(`\n📋 Validating: ${file}`);
  console.log(`   Purpose: ${expected.purpose}`);
  
  let fileValid = true;
  
  // Check for required content
  expected.shouldContain.forEach(requirement => {
    if (!content.includes(requirement)) {
      validationResults.issues.push(`❌ ${file} missing required content: "${requirement}"`);
      fileValid = false;
    }
  });
  
  // Check for prohibited content (duplications)
  expected.shouldNotContain.forEach(prohibition => {
    if (content.includes(prohibition)) {
      validationResults.issues.push(`⚠️  ${file} contains prohibited content: "${prohibition}" (potential duplication)`);
      fileValid = false;
    }
  });
  
  if (fileValid) {
    console.log(`   ✅ Valid - No duplications detected`);
    validationResults.passed++;
  } else {
    console.log(`   ❌ Issues detected`);
    validationResults.failed++;
  }
});

// Validate robots.txt
console.log(`\n📋 Validating: robots.txt`);
const robotsPath = path.join(process.cwd(), 'public/robots.txt');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  
  if (robotsContent.includes('sitemap-index.xml')) {
    console.log('   ✅ robots.txt references sitemap index');
    validationResults.passed++;
  } else {
    console.log('   ❌ robots.txt missing sitemap index reference');
    validationResults.failed++;
  }
  
  if (robotsContent.includes('Sitemap: https://madaratalkon.sa/sitemap-trips-index.xml')) {
    console.log('   ⚠️  robots.txt still references old sitemap-trips-index.xml');
    validationResults.issues.push('robots.txt contains outdated sitemap reference');
  } else {
    console.log('   ✅ robots.txt does not reference old sitemaps');
  }
} else {
  console.log('   ❌ robots.txt not found');
  validationResults.failed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${validationResults.passed}`);
console.log(`❌ Failed: ${validationResults.failed}`);

if (validationResults.issues.length > 0) {
  console.log('\n🚨 ISSUES FOUND:');
  validationResults.issues.forEach(issue => console.log(`   ${issue}`));
}

if (validationResults.failed === 0) {
  console.log('\n🎉 All validations passed! Your sitemaps are clean and duplicate-free.');
  console.log('\n📋 NEXT STEPS:');
  console.log('   1. Deploy to production');
  console.log('   2. Submit sitemap-index.xml to Google Search Console');
  console.log('   3. Monitor crawl performance');
} else {
  console.log('\n⚠️  Please fix the issues above before deployment.');
  process.exit(1);
} 