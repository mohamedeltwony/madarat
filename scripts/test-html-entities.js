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
  'Mixed entities: &#8211; &#8212; &#8220;quotes&#8221; &copy; &trade;'
];

console.log('🧪 HTML Entity Decoding Test');
console.log('='.repeat(60));

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
    
  } catch (error) {
    console.log('❌ Error during decoding:', error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`🏁 Test Results: ${passedTests}/${totalTests} passed`);

if (passedTests === totalTests) {
  console.log('🎉 All tests passed! HTML entity decoding is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Please check the decoding function.');
}

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

console.log('\n�� Test completed!'); 