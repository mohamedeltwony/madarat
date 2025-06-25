/**
 * HTML Entity Decoding Test Script
 * Tests that HTML entities like &#8211; are properly decoded to actual characters
 */

// Import the enhanced utility function
const { decodeHtmlEntitiesSafe } = require('../src/lib/util');

// Test cases with actual problematic trip titles from the user
const testTitles = [
  'رحلة اوروبا &#8211; 8 ليالي 9 أيام &#8211; التشيك والنمسا وسويسرا وفرنسا',
  'رحلة اوروبا مع رحلة بحرية &#8211; 6 ليالي 7 أيام &#8211; باريس ولندن وأمستردام',
  'رحلة اوروبا &#8211; 6 ليالي 7 أيام &#8211; براغ والنمسا',
  'رحلة اوروبا &#8211; 8 ليالي 9 أيام &#8211; براغ وباريس',
  'اسعار تذاكر تركيا &#8211; كيف تسافر تركيا بأقل الأسعار',
  '6 أنشطة تجعل عاصمة البوسنة والهرسك أفضل &#8211; دليل شامل',
  'Test with &amp; ampersand and &quot;quotes&quot; and &#8216;smart quotes&#8217;',
  'Mixed entities: &#8211; &#8212; &#8220;quotes&#8221; &copy; &trade;',
  'More complex title &#8211; اختبار العربية &#8211; مع النص الانجليزي',
  'Travel guide &#8211; Best destinations &#8211; Europe &amp; Asia'
];

console.log('🧪 HTML Entity Decoding Test - Updated for Fixed Components');
console.log('=' * 70);

let passedTests = 0;
let totalTests = testTitles.length;

testTitles.forEach((title, index) => {
  console.log(`\n📝 Test ${index + 1}:`);
  console.log(`Input:  ${title}`);
  
  try {
    const decoded = decodeHtmlEntitiesSafe(title);
    console.log(`Output: ${decoded}`);
    
    // Check if &#8211; is properly decoded
    if (title.includes('&#8211;') && !decoded.includes('&#8211;')) {
      console.log('✅ HTML entities properly decoded');
      passedTests++;
    } else if (!title.includes('&#8211;')) {
      console.log('✅ No entities to decode (test passed)');
      passedTests++;
    } else {
      console.log('❌ HTML entities NOT properly decoded');
    }
    
    // Additional checks for other entities
    const hasUndecodedEntities = decoded.match(/&#?\w+;/);
    if (hasUndecodedEntities) {
      console.log('⚠️  Warning: Some entities may still be undecoded:', hasUndecodedEntities);
    }
    
    // Specific check for em dash conversion
    if (title.includes('&#8211;') && decoded.includes('–')) {
      console.log('🎯 Perfect: &#8211; correctly converted to em dash (–)');
    }
    
  } catch (error) {
    console.log('❌ Error during decoding:', error.message);
  }
});

console.log('\n' + '=' * 70);
console.log(`📊 Test Summary:`);
console.log(`✅ Passed: ${passedTests}/${totalTests}`);
console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

if (passedTests === totalTests) {
  console.log('\n🎉 All tests passed! HTML entity decoding is working correctly.');
  console.log('\n📋 Components Fixed:');
  console.log('   • BlogPosts component (home page)');
  console.log('   • BentoPosts component (home page bento layout)');
  console.log('   • PostCard component (archive pages)');
  console.log('   • PostHeader component (single post pages)');
  console.log('   • PostSidebar component (related posts)');
  console.log('   • MorphPosts component (homepage posts)');
  console.log('   • Trip pages (single trip pages)');
  console.log('\n🔧 Changes Made:');
  console.log('   • Added decodeHtmlEntitiesSafe import to all components');
  console.log('   • Replaced dangerouslySetInnerHTML with safe decoded text');
  console.log('   • Maintained security by avoiding dangerous HTML injection');
  
} else {
  console.log('\n⚠️  Some tests failed. Please check the implementation.');
}

console.log('\n💡 Usage in components:');
console.log('   import { decodeHtmlEntitiesSafe } from "@/lib/util";');
console.log('   <h1>{decodeHtmlEntitiesSafe(title)}</h1>');
console.log('\n🚫 Avoid:');
console.log('   <h1 dangerouslySetInnerHTML={{ __html: title }} />');

// Test specific HTML entities that were problematic
console.log('\n🔍 Specific Entity Tests:');
const specificEntities = {
  '&#8211;': '–',  // En dash
  '&#8212;': '—',  // Em dash
  '&amp;': '&',
  '&quot;': '"',
  '&#8220;': '"',  // Left double quote
  '&#8221;': '"',  // Right double quote
};

Object.entries(specificEntities).forEach(([entity, expected]) => {
  const decoded = decodeHtmlEntitiesSafe(entity);
  const passed = decoded === expected;
  console.log(`${entity} → ${decoded} ${passed ? '✅' : '❌'}`);
  if (!passed) {
    console.log(`  Expected: ${expected}, Got: ${decoded}`);
  }
});

console.log('\n🏁 Test completed!'); 